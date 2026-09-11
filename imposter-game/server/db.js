// db.js — SQLite database setup using sql.js (pure JS, no native deps)
import initSqlJs from "sql.js";
import bcrypt from "bcryptjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, "imposter_game.db");

let db;

/** Initialize the database */
export async function initDb() {
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    try {
      const fileBuffer = readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } catch {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      username         TEXT,
      password_hash    TEXT,
      provider         TEXT    NOT NULL DEFAULT 'local',
      provider_user_id TEXT,
      email            TEXT,
      display_name     TEXT    NOT NULL,
      profile_image    TEXT,
      game_level       INTEGER NOT NULL DEFAULT 1,
      score            INTEGER NOT NULL DEFAULT 0,
      created_at       DATETIME NOT NULL DEFAULT (datetime('now')),
      last_login       DATETIME NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Ensure all columns exist (schema migration)
  try {
    db.run(`ALTER TABLE players ADD COLUMN username TEXT;`);
  } catch {
    // column already exists
  }
  try {
    db.run(`ALTER TABLE players ADD COLUMN password_hash TEXT;`);
  } catch {
    // column already exists
  }

  persist();
  console.log("   DB:      ✅ SQLite initialized (with Local + OAuth support)");
}

/** Write in-memory DB to disk */
function persist() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_PATH, buffer);
}

// ─── Query Helpers ────────────────────────────────────────────────

function getRow(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// ─── Local Username / Password Auth ───────────────────────────────

/** Check if username already exists */
export function isUsernameAvailable(username) {
  if (!username) return false;
  const clean = username.trim().toLowerCase();
  const existing = getRow(`SELECT id FROM players WHERE LOWER(username) = ?`, [clean]);
  return !existing;
}

/** Register a local player with username and password */
export async function createLocalPlayer({ username, password, email = null }) {
  const cleanUser = username.trim();
  if (cleanUser.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }
  if (!password || password.length < 4) {
    throw new Error("Password must be at least 4 characters");
  }
  if (!isUsernameAvailable(cleanUser)) {
    throw new Error("Username is already taken");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  db.run(
    `INSERT INTO players (username, password_hash, provider, provider_user_id, display_name, email)
     VALUES (?, ?, 'local', ?, ?, ?)`,
    [cleanUser, passwordHash, cleanUser, cleanUser, email || null]
  );
  persist();

  return getRow(`SELECT * FROM players WHERE LOWER(username) = ?`, [cleanUser.toLowerCase()]);
}

/** Verify credentials and return user */
export async function verifyLocalPlayer(username, password) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  const clean = username.trim().toLowerCase();
  const player = getRow(`SELECT * FROM players WHERE LOWER(username) = ?`, [clean]);

  if (!player) {
    throw new Error("User not found");
  }
  if (!player.password_hash) {
    throw new Error("This account uses OAuth login. Please sign in with Google or GitHub.");
  }

  const isValid = await bcrypt.compare(password, player.password_hash);
  if (!isValid) {
    throw new Error("Incorrect password");
  }

  // Update last_login
  db.run(`UPDATE players SET last_login = datetime('now') WHERE id = ?`, [player.id]);
  persist();

  return findPlayerById(player.id);
}

// ─── OAuth / Social Profile Upsert ────────────────────────────────

export function upsertOAuthPlayer({ provider, providerUserId, email, displayName, profileImage }) {
  const existing = getRow(
    `SELECT * FROM players WHERE provider = ? AND provider_user_id = ?`,
    [provider, String(providerUserId)]
  );

  if (existing) {
    db.run(
      `UPDATE players SET email = ?, display_name = ?, profile_image = ?, last_login = datetime('now')
       WHERE id = ?`,
      [email || existing.email, displayName || existing.display_name, profileImage || existing.profile_image, existing.id]
    );
    persist();
    return findPlayerById(existing.id);
  } else {
    db.run(
      `INSERT INTO players (provider, provider_user_id, email, display_name, profile_image)
       VALUES (?, ?, ?, ?, ?)`,
      [provider, String(providerUserId), email || null, displayName || "Player", profileImage || null]
    );
    persist();
    return getRow(`SELECT * FROM players WHERE provider = ? AND provider_user_id = ?`, [provider, String(providerUserId)]);
  }
}

// ─── Query APIs ───────────────────────────────────────────────────

export function findPlayerById(id) {
  return getRow(`SELECT * FROM players WHERE id = ?`, [id]);
}

export function getAllPlayers() {
  return getAll(`SELECT * FROM players ORDER BY created_at DESC`);
}

export function deletePlayer(id) {
  db.run(`DELETE FROM players WHERE id = ?`, [id]);
  persist();
}

export function updatePlayerScore(id, scoreIncrement, newLevel) {
  db.run(
    `UPDATE players SET score = score + ?, game_level = ? WHERE id = ?`,
    [scoreIncrement, newLevel, id]
  );
  persist();
}

/** Sanitize player object before sending to browser (strips password_hash) */
export function sanitizePlayer(player) {
  if (!player) return null;
  return {
    id: player.id,
    username: player.username || null,
    provider: player.provider,
    email: player.email,
    displayName: player.display_name,
    profileImage: player.profile_image,
    gameLevel: player.game_level,
    score: player.score,
    createdAt: player.created_at,
    lastLogin: player.last_login,
  };
}

export default db;
