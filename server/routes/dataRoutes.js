import express from 'express';
import { cacheService } from '../cache/cacheService.js';
import { config } from '../config/env.js';
import { EVENTS_DATA } from '../../src/data/events.js';
import { IEEE_TEAM_REGISTRY } from '../../src/lib/teamRegistry.js';
import { stats } from '../../src/data/stats.js';

const router = express.Router();

/**
 * GET /api/events
 * Supports pagination (page, limit), category filter, search, and caching
 */
router.get('/events', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, flagship } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const cacheKey = `events:${category || 'all'}:${search || ''}:${pageNum}:${limitNum}:${flagship || 'all'}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    let list = [...EVENTS_DATA];

    if (category && category !== 'All') {
      list = list.filter((e) => e.category?.toLowerCase() === category.toLowerCase());
    }

    if (flagship === 'true') {
      list = list.filter((e) => e.isFlagship === true);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    const payload = {
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: paginated,
      fromCache: false,
    };

    await cacheService.set(cacheKey, payload, config.cacheTtlSeconds.events);
    return res.json(payload);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/team
 * Cached team registry endpoint
 */
router.get('/team', async (req, res, next) => {
  try {
    const { query, society } = req.query;
    const cacheKey = `team:${query || 'all'}:${society || 'all'}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    let team = [...IEEE_TEAM_REGISTRY];

    if (query) {
      const q = query.toLowerCase();
      team = team.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.usn?.toLowerCase().includes(q) ||
          m.ieeeId?.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q)
      );
    }

    const payload = {
      success: true,
      count: team.length,
      data: team,
      fromCache: false,
    };

    await cacheService.set(cacheKey, payload, config.cacheTtlSeconds.team);
    return res.json(payload);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/stats
 * Aggregated live and static statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const cacheKey = 'stats:general';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const payload = {
      success: true,
      data: {
        ...stats,
        totalEventsRecorded: EVENTS_DATA.length,
        registeredTeamMembers: IEEE_TEAM_REGISTRY.length,
      },
      fromCache: false,
    };

    await cacheService.set(cacheKey, payload, config.cacheTtlSeconds.stats);
    return res.json(payload);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/events/:eventId/register
 * Validates attendee details and confirms event registration
 */
router.post('/events/:eventId/register', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { name, usn, year, branch, email, phone, isIeeeMember, membershipId } = req.body || {};

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (min 2 characters)' });
    }
    if (!usn || usn.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'Valid USN is required' });
    }
    if (!year) {
      return res.status(400).json({ success: false, error: 'Year of study is required' });
    }
    if (!branch) {
      return res.status(400).json({ success: false, error: 'Branch/Department is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid college email is required' });
    }

    const event = EVENTS_DATA.find((e) => String(e.id).toLowerCase() === String(eventId).toLowerCase());

    const ticketId = 'IEEE-' + (event?.category?.toUpperCase().slice(0, 3) || 'EVT') + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const registration = {
      ticketId,
      eventId,
      eventTitle: event?.title || 'IEEE NMAMIT Event',
      eventDate: event?.date || new Date().toISOString(),
      eventVenue: event?.venue || 'NMAMIT Campus',
      name: name.trim(),
      usn: usn.trim().toUpperCase(),
      year,
      branch,
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      isIeeeMember: Boolean(isIeeeMember),
      membershipId: membershipId ? membershipId.trim() : '',
      registeredAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      ticketId,
      registration
    });
  } catch (err) {
    next(err);
  }
});

export default router;
