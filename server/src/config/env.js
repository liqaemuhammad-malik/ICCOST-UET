import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/icosst2026'),

  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  USE_IN_MEMORY_QUEUE: z.coerce.boolean().default(true),

  JWT_ACCESS_SECRET: z.string().min(16).default('icosst2026_default_jwt_access_secret_key_12345'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16).default('icosst2026_default_jwt_refresh_secret_key_12345'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  QR_SIGNING_SECRET: z.string().min(16).default('icosst2026_default_qr_secret_key_123456789'),
  COOKIE_SECRET: z.string().min(16).default('icosst2026_default_cookie_secret_key_1234567'),

  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('ICOSST 2026 Secretariat <icosst@kics.edu.pk>'),

  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),

  MOCK_GATEWAY_WEBHOOK_SECRET: z.string().default('icosst2026_mock_gateway_webhook_secret_key_5544332211'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ errors: parsed.error.format() }, 'Invalid environment configuration');
  throw new Error('Environment variable validation failed');
}

export const env = parsed.data;
