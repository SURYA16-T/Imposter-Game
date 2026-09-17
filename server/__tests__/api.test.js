import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { initDb } from '../db.js';

describe('Server API Routes (Integration)', () => {
  beforeAll(async () => {
    await initDb();
  });

  describe('GET /api/health', () => {
    it('returns status ok and timestamp', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('time');
    });
  });

  describe('GET /api/auth/check-username', () => {
    it('confirms username is available for a fresh username', async () => {
      const freshName = `user_${Date.now()}`;
      const res = await request(app)
        .get('/api/auth/check-username')
        .query({ username: freshName });

      expect(res.status).toBe(200);
      expect(res.body.available).toBe(true);
    });

    it('returns available: false for empty username', async () => {
      const res = await request(app).get('/api/auth/check-username').query({ username: '' });
      expect(res.status).toBe(200);
      expect(res.body.available).toBe(false);
    });
  });

  describe('Local Authentication Flow: /api/auth/register & /api/auth/login', () => {
    const username = `apirunner_${Date.now()}`;
    const password = 'passWord1234!';
    const email = 'apirunner@imposter.app';

    it('registers a new account and returns sanitized player', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username, password, email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.username).toBe(username);
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.password_hash).toBeUndefined();
    });

    it('rejects registering with an already registered username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username, password, email });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('successfully logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username, password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.username).toBe(username);
    });

    it('rejects login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'wrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Incorrect password');
    });
  });

  describe('GET /api/me', () => {
    it('returns user: null when not authenticated in session', async () => {
      const res = await request(app).get('/api/me');
      expect(res.status).toBe(200);
      expect(res.body.user).toBeNull();
    });
  });

  describe('GET /api/admin/users', () => {
    it('returns list of registered users', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('users');
      expect(Array.isArray(res.body.users)).toBe(true);
    });
  });
});
