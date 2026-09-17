import { describe, it, expect, beforeAll } from 'vitest';
import {
  initDb,
  isUsernameAvailable,
  createLocalPlayer,
  verifyLocalPlayer,
  upsertOAuthPlayer,
  findPlayerById,
  getAllPlayers,
  updatePlayerScore,
  sanitizePlayer,
} from '../../server/db.js';

describe('Server Database & Player Authentication', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('verifies username availability', () => {
    const randomUser = `testuser_${Date.now()}`;
    expect(isUsernameAvailable(randomUser)).toBe(true);
    expect(isUsernameAvailable('')).toBe(false);
  });

  it('creates and registers a local player with hashed password', async () => {
    const testUsername = `player_${Date.now()}`;
    const password = 'securePassword123';
    const email = 'player@test.com';

    const player = await createLocalPlayer({ username: testUsername, password, email });
    expect(player).toBeDefined();
    expect(player.username).toBe(testUsername);
    expect(player.email).toBe(email);
    expect(player.password_hash).not.toBe(password);
    expect(player.password_hash).toMatch(/^\$2[aby]\$/); // bcrypt hash format

    // Username should now be unavailable
    expect(isUsernameAvailable(testUsername)).toBe(false);
  });

  it('validates minimum length constraints during registration', async () => {
    await expect(
      createLocalPlayer({ username: 'ab', password: 'validPassword' })
    ).rejects.toThrow('Username must be at least 3 characters');

    await expect(
      createLocalPlayer({ username: 'validUser', password: '12' })
    ).rejects.toThrow('Password must be at least 4 characters');
  });

  it('authenticates valid credentials and rejects invalid passwords', async () => {
    const username = `auth_test_${Date.now()}`;
    const password = 'correctPassword';

    await createLocalPlayer({ username, password });

    // Success with correct credentials
    const verified = await verifyLocalPlayer(username, password);
    expect(verified).toBeDefined();
    expect(verified.username).toBe(username);

    // Failure with wrong password
    await expect(
      verifyLocalPlayer(username, 'wrongPassword')
    ).rejects.toThrow('Incorrect password');

    // Failure with nonexistent user
    await expect(
      verifyLocalPlayer('nonexistent_user_999', 'anyPassword')
    ).rejects.toThrow('User not found');
  });

  it('sanitizes player data before exposing to clients', () => {
    const rawPlayer = {
      id: 1,
      username: 'agent007',
      password_hash: 'super_secret_hash',
      provider: 'local',
      email: 'bond@mi6.gov.uk',
      display_name: 'James Bond',
      profile_image: null,
      game_level: 5,
      score: 1200,
      created_at: '2026-01-01',
      last_login: '2026-01-02',
    };

    const sanitized = sanitizePlayer(rawPlayer);
    expect(sanitized).toBeDefined();
    expect(sanitized.id).toBe(1);
    expect(sanitized.username).toBe('agent007');
    expect(sanitized.displayName).toBe('James Bond');
    expect(sanitized.score).toBe(1200);
    // password_hash MUST NOT be leaked
    expect(sanitized.password_hash).toBeUndefined();
    expect(sanitized.passwordHash).toBeUndefined();
  });

  it('supports OAuth player upserts and updates', () => {
    const oauthId = `oauth_${Date.now()}`;
    const initial = upsertOAuthPlayer({
      provider: 'google',
      providerUserId: oauthId,
      email: 'oauth@gmail.com',
      displayName: 'OAuth Pilot',
      profileImage: 'https://example.com/avatar.png',
    });

    expect(initial.provider).toBe('google');
    expect(initial.display_name).toBe('OAuth Pilot');

    // Update existing
    const updated = upsertOAuthPlayer({
      provider: 'google',
      providerUserId: oauthId,
      email: 'oauth_updated@gmail.com',
      displayName: 'OAuth Commander',
      profileImage: 'https://example.com/avatar2.png',
    });

    expect(updated.id).toBe(initial.id);
    expect(updated.display_name).toBe('OAuth Commander');
    expect(updated.email).toBe('oauth_updated@gmail.com');
  });

  it('updates scores and retrieves players list', () => {
    const all = getAllPlayers();
    expect(Array.isArray(all)).toBe(true);

    if (all.length > 0) {
      const target = all[0];
      const initialScore = target.score;
      updatePlayerScore(target.id, 50, target.game_level + 1);

      const refreshed = findPlayerById(target.id);
      expect(refreshed.score).toBe(initialScore + 50);
      expect(refreshed.game_level).toBe(target.game_level + 1);
    }
  });
});
