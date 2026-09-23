/**
 * Client-Side Diagnostic Logger
 * Controls console output according to configured log level and maintains an in-memory audit log.
 */

import { APP_CONFIG } from '../config.js';

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

class Logger {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = 100;
  }

  get currentLevel() {
    return LEVELS[APP_CONFIG.LOG_LEVEL] ?? LEVELS.INFO;
  }

  _record(level, category, message, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null
    };

    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    return entry;
  }

  debug(category, message, data = null) {
    if (this.currentLevel <= LEVELS.DEBUG) {
      const entry = this._record('DEBUG', category, message, data);
      console.debug(`[DEBUG][${category}] ${message}`, data ?? '');
    }
  }

  info(category, message, data = null) {
    if (this.currentLevel <= LEVELS.INFO) {
      const entry = this._record('INFO', category, message, data);
      console.info(`[INFO][${category}] ${message}`, data ?? '');
    }
  }

  warn(category, message, data = null) {
    if (this.currentLevel <= LEVELS.WARN) {
      const entry = this._record('WARN', category, message, data);
      console.warn(`[WARN][${category}] ${message}`, data ?? '');
    }
  }

  error(category, message, error = null) {
    if (this.currentLevel <= LEVELS.ERROR) {
      const entry = this._record('ERROR', category, message, error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null);
      console.error(`[ERROR][${category}] ${message}`, error ?? '');
    }
  }

  /**
   * Returns recent log entries for diagnostics or viva defense.
   */
  getLogs() {
    return [...this.buffer];
  }

  clearLogs() {
    this.buffer = [];
  }
}

export const logger = new Logger();
