import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config/env.js';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*.firebaseapp.com', 'https://*.googleapis.com'],
      connectSrc: [
        "'self'",
        'https://*.firebaseio.com',
        'https://*.googleapis.com',
        'https://identitytoolkit.googleapis.com',
        'https://securetoken.googleapis.com',
        'https://enterpriseapi.ieee.org',
        'https://firebasestorage.googleapis.com',
        'https://images.unsplash.com',
      ],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://*.googleusercontent.com', 'https://*.firebasestorage.app'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
    if (!origin || config.corsOrigin === '*') {
      return callback(null, true);
    }
    const allowed = config.corsOrigin.split(',').map((o) => o.trim());
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access denied for this origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

/**
 * Request Timeout Middleware
 * Automatically terminates requests that exceed 10 seconds to protect event loop under load
 */
export function timeoutMiddleware(timeoutMs = 10000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'Gateway Timeout: The request took too long to process. Please retry.',
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    next();
  };
}
