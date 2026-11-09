import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * Strict Rate Limiter for Authentication Endpoints (Login, Register, Password Reset)
 * Protects against brute-force attacks and credential stuffing while remaining user-friendly.
 */
export const authLimiter = rateLimit({
  windowMs: config.rateLimits.authWindowMs, // 15 minutes
  max: config.rateLimits.authMax,           // 50 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  skipSuccessfulRequests: false,
});

/**
 * High-Throughput Rate Limiter for Public API Endpoints
 * Allows 1,000 requests per minute per IP to accommodate high-concurrency legitimate traffic.
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimits.apiWindowMs,  // 1 minute
  max: config.rateLimits.apiMax,            // 1,000 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many API requests. Please slow down.',
  },
});

/**
 * Rate Limiter for IEEE Pass Resolution
 * Prevents hitting external IEEE endpoint limits under sudden traffic bursts.
 */
export const passResolverLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.LOAD_TEST === 'true' ? 500000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Pass resolution rate limit reached. Please wait a moment before trying again.',
  },
});
