import express from 'express';
import { findPostgresUserByUid, updatePostgresUserProfile } from '../db/postgres.js';
import { cacheService } from '../cache/cacheService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { config } from '../config/env.js';

const router = express.Router();

/**
 * GET /api/profile/:uid
 * Cached retrieval with PostgreSQL lookup on cache miss
 */
router.get('/:uid', async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID parameter is required.' });
    }

    const cacheKey = `profile:${uid}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ success: true, profile: cached, fromCache: true });
    }

    const user = await findPostgresUserByUid(uid);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    const { passwordHash: _, ...safeProfile } = user;
    await cacheService.set(cacheKey, safeProfile, config.cacheTtlSeconds.profile);

    return res.json({ success: true, profile: safeProfile, fromCache: false });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/profile/:uid
 * Transactional profile update with cache invalidation
 */
router.put('/:uid', requireAuth, async (req, res, next) => {
  try {
    const { uid } = req.params;

    // Authorization check
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify this profile.',
      });
    }

    const updatedProfile = await updatePostgresUserProfile(uid, req.body);

    // Invalidate profile cache immediately
    await cacheService.del(`profile:${uid}`);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
