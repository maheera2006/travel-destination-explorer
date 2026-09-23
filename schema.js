/**
 * Schema Definitions & Migration Utilities
 * Key: travelExplorer:v1
 */

import { APP_CONFIG } from '../config.js';
import { Validator } from './validator.js';
import { logger } from '../services/logger.js';

export const Schema = {
  VERSION: APP_CONFIG.SCHEMA_VERSION,

  /**
   * Generates a fresh, valid initial state for storage.
   */
  createInitialState() {
    return {
      version: this.VERSION,
      updatedAt: new Date().toISOString(),
      trips: [],
      preferences: {
        currency: 'USD',
        theme: 'system' // 'light' | 'dark' | 'system'
      }
    };
  },

  /**
   * Validates and safely migrates raw stored data to current schema (v1).
   */
  migrateAndValidate(rawData) {
    if (!rawData) {
      logger.info('Schema', 'No existing state found; initializing v1 schema.');
      return this.createInitialState();
    }

    let parsed;
    try {
      parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    } catch (err) {
      logger.warn('Schema', 'Corrupt JSON detected in localStorage; recovering with clean v1 state.', err);
      return this.createInitialState();
    }

    if (!parsed || typeof parsed !== 'object') {
      logger.warn('Schema', 'Stored state is not an object; resetting.');
      return this.createInitialState();
    }

    // Version migration handling
    const currentVersion = parsed.version || 0;
    let state = { ...parsed };

    if (currentVersion < 1) {
      logger.info('Schema', `Migrating state from v${currentVersion} to v1.`);
      // Migration from unversioned raw array or legacy format
      const rawTrips = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.trips) ? parsed.trips : []);
      state = {
        version: 1,
        updatedAt: new Date().toISOString(),
        trips: rawTrips,
        preferences: {
          currency: 'USD',
          theme: 'system'
        }
      };
    }

    // Validate trips collection
    const validatedTrips = [];
    if (Array.isArray(state.trips)) {
      state.trips.forEach((trip) => {
        const check = Validator.validateTrip(trip);
        if (check.isValid) {
          validatedTrips.push(check.trip);
        }
      });
    }

    // Validate preferences
    const validCurrencies = Object.keys(APP_CONFIG.CURRENCIES);
    const prefCurrency = validCurrencies.includes(state.preferences?.currency)
      ? state.preferences.currency
      : 'USD';
    const prefTheme = ['light', 'dark', 'system'].includes(state.preferences?.theme)
      ? state.preferences.theme
      : 'system';

    return {
      version: this.VERSION,
      updatedAt: new Date().toISOString(),
      trips: validatedTrips,
      preferences: {
        currency: prefCurrency,
        theme: prefTheme
      }
    };
  }
};
