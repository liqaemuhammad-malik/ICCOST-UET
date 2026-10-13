import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/modules/users/user.model.js';
import { AuditLog } from '../src/modules/audit/audit.model.js';
import { ROLES } from '../src/config/constants.js';

describe('Phase 1 Foundation: Auth, RBAC & Audit Logging Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  const testUser = {
    name: 'Dr. Tariq Mahmood',
    email: `tariq.test.${Date.now()}@uet.edu.pk`,
    password: 'Password123!',
  };

  let verificationToken = '';
  let accessToken = '';
  let refreshCookie = '';

  it('1. Registers new user and issues email verification token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.isEmailVerified).toBe(false);

    // Capture token from dev response
    verificationToken = res.body.data.rawVerificationToken;
    expect(verificationToken).toBeDefined();

    // Verify user exists in database with hashed password
    const user = await User.findOne({ email: testUser.email.toLowerCase() }).select('+passwordHash');
    expect(user).toBeDefined();
    expect(user.passwordHash).not.toBe(testUser.password);
  });

  it('2. Verifies email using verification token', async () => {
    const res = await request(app).post('/api/auth/verify-email').send({ token: verificationToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const user = await User.findOne({ email: testUser.email.toLowerCase() });
    expect(user.isEmailVerified).toBe(true);
  });

  it('3. Authenticates user and issues access token + httpOnly refresh cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());

    accessToken = res.body.data.accessToken;

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const refreshCookieStr = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookieStr).toBeDefined();
    expect(refreshCookieStr).toContain('HttpOnly');
    refreshCookie = refreshCookieStr;
  });

  it('4. Rotates refresh token successfully', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', [refreshCookie]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.accessToken).not.toBe(accessToken);
  });

  it('5. RBAC Guard: Forbids regular participant from admin audit endpoints', async () => {
    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('6. RBAC Guard: Permits admin to access audit logs', async () => {
    // Elevate user to admin
    await User.findOneAndUpdate({ email: testUser.email.toLowerCase() }, { role: ROLES.ADMIN });

    // Login as admin
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    const adminToken = loginRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('7. Audit Log Immutability: Throws error when attempting update on AuditLog model', async () => {
    const log = await AuditLog.findOne();
    expect(log).toBeDefined();

    await expect(
      AuditLog.updateOne({ _id: log._id }, { action: 'TAMPERED_ACTION' })
    ).rejects.toThrow();
  });
});
