import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateAccessToken(payload) {
  return jwt.sign(
    { ...payload, jti: crypto.randomBytes(8).toString('hex') },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
}

export function generateRefreshToken(payload) {
  return jwt.sign(
    { ...payload, jti: crypto.randomBytes(8).toString('hex') },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export function signHmac(data, secret = env.QR_SIGNING_SECRET) {
  return crypto.createHmac('sha256', secret).update(typeof data === 'string' ? data : JSON.stringify(data)).digest('hex');
}

export function verifyHmac(data, signature, secret = env.QR_SIGNING_SECRET) {
  const expected = signHmac(data, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
