/**
 * Cache Service with Time-To-Live (TTL)
 * In-memory fast cache with optional localStorage persistence.
 */

import { logger } from './logger.js';

export class CacheService {
  constructor(defaultTtlMs = 30 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
    this.memoryCache = new Map();
  }

  set(key, data, ttlMs = this.defaultTtlMs) {
    const entry = {
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
      data
    };
    this.memoryCache.set(key, entry);
  }

  get(key) {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      logger.debug('CacheService', `Cache expired for key: ${key}`);
      return null;
    }

    const ageMinutes = Math.floor((Date.now() - entry.timestamp) / 60000);
    return {
      data: entry.data,
      ageMinutes,
      timestamp: entry.timestamp
    };
  }

  clear() {
    this.memoryCache.clear();
  }
}

export const appCache = new CacheService();
