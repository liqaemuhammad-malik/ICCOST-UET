import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { AppError } from './utils/appError.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import settingRoutes from './modules/settings/setting.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';

export const app = express();

// Trust proxy for rate limiting behind reverse proxies (Nginx / Cloudflare)
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || origin === env.CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Sanitize inputs against NoSQL injection
app.use(mongoSanitize());

// Static files for uploaded proofs and invoices
const uploadPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
app.use('/uploads', express.static(uploadPath));

// Apply global rate limiting
app.use('/api', globalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    event: 'ICOSST 2026 Platform API',
    version: '1.0.0',
  });
});

// Mount module routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit', auditRoutes);

// Catch-all for undefined routes
app.use('*', (req, res, next) => {
  next(AppError.notFound(`Cannot find route ${req.originalUrl} on this server`));
});

// Centralized error handling middleware
app.use(errorHandler);
