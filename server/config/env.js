import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'production',
  jwtSecret: process.env.JWT_SECRET || 'ieee_nmamit_secure_jwt_token_key_2026_super_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'ieee_nmamit_refresh_key_2026_super_secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  redisUrl: process.env.REDIS_URL || null,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  cacheTtlSeconds: {
    events: 300,        // 5 minutes
    team: 600,          // 10 minutes
    stats: 300,         // 5 minutes
    passResolver: 3600, // 1 hour
    profile: 120,       // 2 minutes (invalidated immediately on write)
  },
  rateLimits: {
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMax: 50,                   // 50 attempts per 15 min (protects against brute-force)
    apiWindowMs: 60 * 1000,        // 1 minute
    apiMax: process.env.LOAD_TEST === 'true' ? 500000 : 1000,
    authMax: process.env.LOAD_TEST === 'true' ? 500000 : 50,
  },
};
