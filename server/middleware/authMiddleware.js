import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { findPostgresUserByUid } from '../db/postgres.js';

/**
 * Authentication Middleware
 * Supports Secure HTTP-Only Cookie or Authorization Bearer header.
 * Eliminates reliance on vulnerable localStorage.
 */
export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // 1. Check HTTP-Only Cookie first (secure against XSS)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization Bearer Header (for external / mobile clients)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication session or token required.',
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await findPostgresUserByUid(decoded.uid);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Account not found or deactivated.',
      });
    }

    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please sign in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid or forged authentication token.',
    });
  }
}
