/**
 * Defensive Data & Input Validators
 * Travel Destination Explorer
 */

import { APP_CONFIG } from '../config.js';

export const Validator = {
  /**
   * Validates and bounds a search query.
   * Treats query strictly as text data, enforces maximum length, and never modifies characters.
   */
  validateSearchQuery(query) {
    if (typeof query !== 'string') return '';
    const trimmed = query.trim();
    if (trimmed.length > APP_CONFIG.BOUNDS.MAX_SEARCH_LENGTH) {
      return trimmed.slice(0, APP_CONFIG.BOUNDS.MAX_SEARCH_LENGTH);
    }
    return trimmed;
  },

  /**
   * Validates an integer within strict bounds.
   */
  validateInteger(value, min, max, defaultValue) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return defaultValue;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  },

  /**
   * Validates external URLs using the browser URL parser.
   * Only permits valid https: URLs with non-empty hostnames.
   */
  isValidHttpsUrl(urlString) {
    if (typeof urlString !== 'string' || !urlString.trim()) {
      return false;
    }
    try {
      const parsed = new URL(urlString.trim());
      // Strict https check, non-empty host, and exclude localhost/loopback
      const isHttps = parsed.protocol === 'https:';
      const hasHost = Boolean(parsed.hostname && parsed.hostname.includes('.'));
      return isHttps && hasHost;
    } catch {
      return false;
    }
  },

  /**
   * Validates trip user notes length and bounds.
   */
  validateNotes(notes) {
    if (typeof notes !== 'string') return '';
    return notes.slice(0, APP_CONFIG.BOUNDS.MAX_NOTE_LENGTH);
  },

  /**
   * Validates a travel style key.
   */
  validateTravelStyle(style) {
    const validStyles = Object.keys(APP_CONFIG.TRAVEL_STYLES);
    return validStyles.includes(style) ? style : 'comfort';
  },

  /**
   * Validates a single trip object against the strict storage schema.
   */
  validateTrip(trip) {
    if (!trip || typeof trip !== 'object') {
      return { isValid: false, error: 'Trip must be a valid object' };
    }

    if (typeof trip.destinationId !== 'string' || !trip.destinationId.trim()) {
      return { isValid: false, error: 'Trip must have a valid destinationId' };
    }

    const days = parseInt(trip.customDays, 10);
    if (Number.isNaN(days) || days < APP_CONFIG.BOUNDS.MIN_DAYS || days > APP_CONFIG.BOUNDS.MAX_DAYS) {
      return { isValid: false, error: `customDays must be between ${APP_CONFIG.BOUNDS.MIN_DAYS} and ${APP_CONFIG.BOUNDS.MAX_DAYS}` };
    }

    const travelers = parseInt(trip.customTravelers, 10);
    if (Number.isNaN(travelers) || travelers < APP_CONFIG.BOUNDS.MIN_TRAVELERS || travelers > APP_CONFIG.BOUNDS.MAX_TRAVELERS) {
      return { isValid: false, error: `customTravelers must be between ${APP_CONFIG.BOUNDS.MIN_TRAVELERS} and ${APP_CONFIG.BOUNDS.MAX_TRAVELERS}` };
    }

    const validStyles = Object.keys(APP_CONFIG.TRAVEL_STYLES);
    if (!validStyles.includes(trip.travelStyle)) {
      return { isValid: false, error: `travelStyle must be one of: ${validStyles.join(', ')}` };
    }

    const userNotes = typeof trip.userNotes === 'string' 
      ? trip.userNotes.slice(0, APP_CONFIG.BOUNDS.MAX_NOTE_LENGTH) 
      : '';

    let savedAt = trip.savedAt;
    if (!savedAt || Number.isNaN(Date.parse(savedAt))) {
      savedAt = new Date().toISOString();
    }

    const sanitizedTrip = {
      destinationId: trip.destinationId.trim(),
      savedAt,
      customDays: days,
      customTravelers: travelers,
      travelStyle: trip.travelStyle,
      userNotes
    };

    return { isValid: true, trip: sanitizedTrip };
  },

  /**
   * Validates an entire import file payload against the travelExplorer schema.
   */
  validateImportPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, error: 'Imported file does not contain a valid JSON object.' };
    }

    if (!Array.isArray(payload.trips)) {
      return { isValid: false, error: 'Imported JSON must contain a "trips" array.' };
    }

    const validTrips = [];
    const rejectedTrips = [];

    payload.trips.forEach((rawTrip, idx) => {
      const result = this.validateTrip(rawTrip);
      if (result.isValid) {
        validTrips.push(result.trip);
      } else {
        rejectedTrips.push({ index: idx, error: result.error });
      }
    });

    return {
      isValid: validTrips.length > 0 || payload.trips.length === 0,
      validTrips,
      rejectedTrips,
      totalCount: payload.trips.length
    };
  }
};
