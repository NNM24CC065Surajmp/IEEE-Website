import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { createPostgresUser, findPostgresUserByEmail } from '../db/postgres.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const ALLOWED_DOMAIN = 'nmamit.in';

function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';

  // Secure HTTP-Only Access Token Cookie
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // Secure HTTP-Only Refresh Token Cookie
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh',
    });
  }
}

function generateTokens(user) {
  const payload = {
    uid: user.uid,
    email: user.email,
    role: user.role || 'member',
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const refreshToken = jwt.sign({ uid: user.uid }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  return { accessToken, refreshToken };
}

/**
 * POST /api/auth/register
 * PostgreSQL Transactional User Registration with Bcrypt (10 rounds)
 */
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password, branch, year, usn, membershipId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format.' });
    }
    if (!cleanEmail.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return res.status(400).json({
        success: false,
        error: `Registration requires your official @${ALLOWED_DOMAIN} email address.`,
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters in length.',
      });
    }
    if (!usn || !usn.trim()) {
      return res.status(400).json({ success: false, error: 'College USN is required.' });
    }

    // OWASP Recommended 10 salt rounds for production high-concurrency
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Atomic creation inside PostgreSQL transaction
    const newUser = await createPostgresUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      branch: (branch || '').trim(),
      year: (year || '').trim(),
      usn: usn.trim().toUpperCase(),
      membershipId: (membershipId || usn).trim().toUpperCase(),
      role: 'member',
    });

    const tokens = generateTokens(newUser);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      user: safeUser,
      token: tokens.accessToken,
    });
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      return res.status(409).json({ success: false, error: err.message });
    }
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Rate-limited login with Bcrypt verification, PostgreSQL lookup, and HTTP-only cookie issuance
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both your college email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findPostgresUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const tokens = generateTokens(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Sign-in successful.',
      user: safeUser,
      token: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Clears HTTP-only session cookies
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  return res.json({
    success: true,
    message: 'Signed out successfully.',
  });
});

/**
 * POST /api/auth/refresh
 * Refreshes session access token from HTTP-only refresh cookie or request body
 */
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'Refresh token is required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = await findPostgresUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User does not exist.' });
    }

    const tokens = generateTokens(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.json({
      success: true,
      token: tokens.accessToken,
    });
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current server-authenticated user session
 */
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
