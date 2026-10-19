import rateLimit from 'express-rate-limit';

const isBootstrapRead = (req) => {
  const path = req.originalUrl.split('?')[0];
  return req.method === 'GET' && (path === '/api/settings' || path === '/api/auth/me');
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  // These lightweight reads run during every app start and do not perform
  // mutations or expensive authentication work. Keep them available even
  // when another client has exhausted the general API quota.
  skip: isBootstrapRead,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
});

export const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120, // 120 scans per minute for staff gates
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'SCAN_RATE_LIMIT_EXCEEDED',
      message: 'Scanner throughput limit exceeded. Please wait a moment.',
    },
  },
});
