import { config } from '../config/env.js';

/**
 * High-performance Cache Service with automatic Redis or In-Memory fallback.
 * Guarantees zero downtime: if Redis is not running or unreachable,
 * it immediately and transparently operates an in-memory TTL/LRU cache.
 */
class CacheService {
  constructor() {
    this.memoryStore = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
    };
    this.redisClient = null;
    this.isRedisAvailable = false;
    this.init();
  }

  async init() {
    if (config.redisUrl) {
      try {
        const { default: Redis } = await import('ioredis');
        this.redisClient = new Redis(config.redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableReadyCheck: true,
          connectTimeout: 2000,
        });

        await this.redisClient.connect();
        this.isRedisAvailable = true;
        console.log('[Cache] Connected to Redis cluster/instance successfully.');

        this.redisClient.on('error', (err) => {
          console.warn('[Cache] Redis error, using memory fallback:', err.message);
          this.isRedisAvailable = false;
        });
      } catch (err) {
        console.warn('[Cache] Redis initialization bypassed; using high-speed in-memory cache.');
        this.isRedisAvailable = false;
      }
    } else {
      // Intentional in-memory cache mode
      this.isRedisAvailable = false;
    }

    // Periodic sweep of expired in-memory items every 60 seconds
    setInterval(() => this.sweepExpiredMemory(), 60000).unref();
  }

  async get(key) {
    if (this.isRedisAvailable && this.redisClient) {
      try {
        const val = await this.redisClient.get(key);
        if (val !== null) {
          this.stats.hits++;
          return JSON.parse(val);
        }
      } catch (err) {
        console.warn(`[Cache] Redis get error on key "${key}", falling back to memory:`, err.message);
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  async set(key, value, ttlSeconds = 300) {
    this.stats.sets++;
    if (this.isRedisAvailable && this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (err) {
        console.warn(`[Cache] Redis set error on key "${key}":`, err.message);
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryStore.set(key, { value, expiresAt });

    // Cap memory items to avoid memory leaks
    if (this.memoryStore.size > 10000) {
      const oldestKey = this.memoryStore.keys().next().value;
      this.memoryStore.delete(oldestKey);
    }

    return true;
  }

  async del(key) {
    if (this.isRedisAvailable && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {
        console.warn(`[Cache] Redis del error on key "${key}":`, err.message);
      }
    }
    this.memoryStore.delete(key);
    return true;
  }

  async flushPattern(prefix) {
    if (this.isRedisAvailable && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (err) {
        console.warn(`[Cache] Redis flushPattern error on "${prefix}":`, err.message);
      }
    }

    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryStore.delete(key);
      }
    }
  }

  sweepExpiredMemory() {
    const now = Date.now();
    for (const [key, item] of this.memoryStore.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.memoryStore.delete(key);
      }
    }
  }

  getMetrics() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%';
    return {
      driver: this.isRedisAvailable ? 'redis' : 'in-memory',
      memoryKeysCount: this.memoryStore.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      sets: this.stats.sets,
    };
  }
}

export const cacheService = new CacheService();
