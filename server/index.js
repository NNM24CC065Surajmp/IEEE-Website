import os from 'os';
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '64';
import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { config } from './config/env.js';
import cookieParser from 'cookie-parser';
import { helmetMiddleware, corsMiddleware, timeoutMiddleware } from './middleware/security.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import passRoutes from './routes/passRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');

const app = express();

// Trust reverse proxy (needed for accurate rate limiting and IP resolution behind Cloudflare, Vercel, Nginx)
app.set('trust proxy', 1);

// ─── 1. Security & Performance Middleware ──────────────────────────
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(cookieParser());

// Gzip / Brotli Compression: Dramatically reduces payload size for high concurrency
app.use(
  compression({
    level: 6,
    threshold: 1024, // Only compress responses above 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// Payload size limits to protect against memory exhaustion DOS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Timeout Protection (10 seconds)
app.use(timeoutMiddleware(10000));

// ─── 2. API Routes ─────────────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api', passRoutes);
app.use('/api', dataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Apply general API rate limiter to all /api endpoints
app.use('/api', apiLimiter);

// ─── 3. Static Asset Serving with Aggressive Caching ───────────────
if (fs.existsSync(DIST_DIR)) {
  // Hashed static assets in assets/ can be safely cached for 1 year
  app.use(
    '/assets',
    express.static(path.join(DIST_DIR, 'assets'), {
      maxAge: '1y',
      immutable: true,
      etag: true,
    })
  );

  // Other public static files
  app.use(
    express.static(DIST_DIR, {
      maxAge: '1d',
      etag: true,
    })
  );

  // SPA fallback for HTML5 History routing
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// ─── 4. Centralized Error Handling ─────────────────────────────────
app.use(errorHandler);

// ─── 5. Server Initialization & Graceful Shutdown ──────────────────
let server;
export function startServer(port = config.port) {
  server = app.listen(port, '0.0.0.0', () => {
    console.log(`[IEEE Server] High-concurrency production server running on port ${port} (PID: ${process.pid})`);
  });

  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`[IEEE Server] Received ${signal}. Commencing graceful drain...`);
    if (server) {
      server.close(() => {
        console.log('[IEEE Server] Closed all pending connections cleanly. Exiting process.');
        process.exit(0);
      });

      // Force exit after 10s if connections refuse to terminate
      setTimeout(() => {
        console.error('[IEEE Server] Forceful shutdown triggered after timeout.');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

// Auto-start if executed directly: node server/index.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export default app;
