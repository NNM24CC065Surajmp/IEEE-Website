import express from 'express';
import os from 'os';
import { getPostgresPoolMetrics } from '../db/postgres.js';
import { cacheService } from '../cache/cacheService.js';

const router = express.Router();
const serverStartTime = Date.now();

/**
 * GET /api/health
 * Comprehensive health status with runtime metrics
 */
router.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      cpuCores: os.cpus().length,
      freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
      totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
      loadAverage: os.loadavg(),
    },
    process: {
      pid: process.pid,
      memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
    },
    postgresPool: getPostgresPoolMetrics(),
    cache: cacheService.getMetrics(),
  };

  res.status(200).json(healthData);
});

/**
 * GET /api/ready
 * Readiness probe
 */
router.get('/ready', (req, res) => {
  const metrics = getPostgresPoolMetrics();
  const isReady = metrics.waitingCount === 0;
  if (isReady) {
    return res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
  }
  return res.status(503).json({ status: 'busy', metrics });
});

export default router;
