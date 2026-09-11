// index.js — Express + Passport OAuth + Local Auth (Unified Full-Stack)
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import {
  initDb,
  createLocalPlayer,
  verifyLocalPlayer,
  isUsernameAvailable,
  upsertOAuthPlayer,
  findPlayerById,
  getAllPlayers,
  deletePlayer,
  sanitizePlayer,
} from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST_PATH = join(__dirname, "../dist");

const app = express();
const PORT = process.env.PORT || 3001;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const CLIENT_URL = process.env.CLIENT_URL || SERVER_URL;

// ─── Middleware ────────────────────────────────────────────────────
app.use(express.json());

const allowedOrigins = [CLIENT_URL, SERVER_URL, "http://localhost:5173", "http://localhost:5174", "http://localhost:3001"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ─── Passport Serialization ──────────────────────────────────────
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const player = findPlayerById(id);
  done(null, player || null);
});

// ─── Check OAuth Credentials Status ──────────────────────────────
const hasRealGoogle =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.includes("your-google");

const hasRealGithub =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  !process.env.GITHUB_CLIENT_ID.includes("your-github");

// ─── Google OAuth Strategy ────────────────────────────────────────
if (hasRealGoogle) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/auth/google/callback`,
        scope: ["profile", "email"],
      },
      (_accessToken, _refreshToken, profile, done) => {
        try {
          const player = upsertOAuthPlayer({
            provider: "google",
            providerUserId: profile.id,
            email: profile.emails?.[0]?.value || null,
            displayName: profile.displayName || "Google Player",
            profileImage: profile.photos?.[0]?.value || null,
          });
          done(null, player);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

// ─── GitHub OAuth Strategy ────────────────────────────────────────
if (hasRealGithub) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/auth/github/callback`,
        scope: ["user:email"],
      },
      (_accessToken, _refreshToken, profile, done) => {
        try {
          const player = upsertOAuthPlayer({
            provider: "github",
            providerUserId: String(profile.id),
            email: profile.emails?.[0]?.value || null,
            displayName: profile.displayName || profile.username || "GitHub Player",
            profileImage: profile.photos?.[0]?.value || null,
          });
          done(null, player);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

// ─── OAuth Routes (with Seamless Fallback for instant local login) ─

// Google OAuth
app.get("/auth/google", (req, res, next) => {
  if (hasRealGoogle) {
    return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }
  // Seamless demo / local Google authentication
  const mockId = "google_" + (req.session.id || "player_g").substring(0, 8);
  const player = upsertOAuthPlayer({
    provider: "google",
    providerUserId: mockId,
    email: "player@gmail.com",
    displayName: "Google Player",
    profileImage: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  });
  req.login(player, (err) => {
    if (err) return res.redirect(`${CLIENT_URL}/?error=login_failed`);
    return res.redirect(`${CLIENT_URL}/?auth=success`);
  });
});

app.get("/auth/google/callback", (req, res, next) => {
  if (hasRealGoogle) {
    return passport.authenticate("google", {
      failureRedirect: `${CLIENT_URL}/?error=google_failed`,
      successRedirect: `${CLIENT_URL}/?auth=success`,
    })(req, res, next);
  }
  res.redirect(`${CLIENT_URL}/?auth=success`);
});

// GitHub OAuth
app.get("/auth/github", (req, res, next) => {
  if (hasRealGithub) {
    return passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
  }
  // Seamless demo / local GitHub authentication
  const mockId = "github_" + (req.session.id || "player_gh").substring(0, 8);
  const player = upsertOAuthPlayer({
    provider: "github",
    providerUserId: mockId,
    email: "player@github.com",
    displayName: "GitHub Player",
    profileImage: "https://avatars.githubusercontent.com/u/9919?v=4",
  });
  req.login(player, (err) => {
    if (err) return res.redirect(`${CLIENT_URL}/?error=login_failed`);
    return res.redirect(`${CLIENT_URL}/?auth=success`);
  });
});

app.get("/auth/github/callback", (req, res, next) => {
  if (hasRealGithub) {
    return passport.authenticate("github", {
      failureRedirect: `${CLIENT_URL}/?error=github_failed`,
      successRedirect: `${CLIENT_URL}/?auth=success`,
    })(req, res, next);
  }
  res.redirect(`${CLIENT_URL}/?auth=success`);
});

// ─── Local Auth Routes (Sign Up & Login) ──────────────────────────

/** Check if username is available */
app.get("/api/auth/check-username", (req, res) => {
  const { username } = req.query;
  const available = isUsernameAvailable(username);
  res.json({ available });
});

/** Register a new local account */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const player = await createLocalPlayer({ username, password, email });
    req.login(player, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to establish session" });
      }
      return res.json({ success: true, user: sanitizePlayer(player) });
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Registration failed" });
  }
});

/** Login with username and password */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const player = await verifyLocalPlayer(username, password);
    req.login(player, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to establish session" });
      }
      return res.json({ success: true, user: sanitizePlayer(player) });
    });
  } catch (err) {
    return res.status(401).json({ error: err.message || "Login failed" });
  }
});

// ─── User & Session APIs ──────────────────────────────────────────

/** Get current authenticated user */
app.get("/api/me", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.json({ user: null });
  }
  res.json({ user: sanitizePlayer(req.user) });
});

/** Logout — destroy session */
app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

// ─── Admin Routes ─────────────────────────────────────────────────

/** List all players */
app.get("/api/admin/users", (_req, res) => {
  const players = getAllPlayers().map(sanitizePlayer);
  res.json({ users: players });
});

/** Delete a player */
app.delete("/api/admin/users/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  deletePlayer(id);
  res.json({ success: true });
});

/** Export users to Excel */
app.get("/api/admin/export", (_req, res) => {
  const players = getAllPlayers();

  const data = players.map((p, i) => ({
    "S.No": i + 1,
    Username: p.username || "N/A",
    "Display Name": p.display_name,
    Provider: p.provider,
    Email: p.email || "N/A",
    "Game Level": p.game_level,
    Score: p.score,
    "Created At": p.created_at,
    "Last Login": p.last_login,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  if (data.length > 0) {
    ws["!cols"] = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length, ...data.map((row) => String(row[key]).length)) + 2,
    }));
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Players");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=imposter_game_players_${Date.now()}.xlsx`);
  res.send(buffer);
});

// ─── Health Check ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ─── Serve Static Frontend ────────────────────────────────────────
if (existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/auth")) {
      return next();
    }
    res.sendFile(join(DIST_PATH, "index.html"));
  });
}

// ─── Start Server ─────────────────────────────────────────────────
async function start() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`\n🎮 Imposter Game — Unified Server`);
    console.log(`   Host Link:    ${SERVER_URL}`);
    console.log(`   Google OAuth: ${hasRealGoogle ? "✅ Configured (Real OAuth)" : "⚡ Ready (Auto-Demo Fallback active)"}`);
    console.log(`   GitHub OAuth: ${hasRealGithub ? "✅ Configured (Real OAuth)" : "⚡ Ready (Auto-Demo Fallback active)"}`);
    console.log(`   Local Auth:   ✅ Password Registration & Login active\n`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
