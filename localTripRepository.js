/**
 * LocalStorage Implementation of TripRepository
 * Strictly implements the TripRepository persistence contract with travelExplorer:v1 schema.
 * Features in-memory fallback for private browsing and defensive corrupted-data recovery.
 */

import { TripRepository } from './tripRepository.js';
import { APP_CONFIG } from '../config.js';
import { Schema } from '../models/schema.js';
import { Validator } from '../models/validator.js';
import { logger } from '../services/logger.js';

export class LocalTripRepository extends TripRepository {
  constructor() {
    super();
    this.storageKey = APP_CONFIG.STORAGE_KEY;
    this._memoryFallback = null;
    this._isStorageAvailable = this._checkStorageAvailability();

    if (!this._isStorageAvailable) {
      logger.warn('LocalTripRepository', 'localStorage is unavailable or disabled. Utilizing in-memory state.');
      this._memoryFallback = Schema.createInitialState();
    }
  }

  _checkStorageAvailability() {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  _readRaw() {
    if (!this._isStorageAvailable) {
      return this._memoryFallback;
    }
    try {
      return window.localStorage.getItem(this.storageKey);
    } catch (err) {
      logger.error('LocalTripRepository', 'Error reading localStorage.', err);
      return null;
    }
  }

  _writeRaw(state) {
    state.updatedAt = new Date().toISOString();
    if (!this._isStorageAvailable) {
      this._memoryFallback = state;
      return true;
    }
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(state));
      return true;
    } catch (err) {
      logger.error('LocalTripRepository', 'Failed to write to localStorage (quota exceeded or permission error).', err);
      return false;
    }
  }

  /**
   * Retrieves sanitized, migrated state.
   */
  getState() {
    const raw = this._readRaw();
    return Schema.migrateAndValidate(raw);
  }

  async getAll() {
    const state = this.getState();
    return state.trips;
  }

  async getByDestinationId(destinationId) {
    if (!destinationId) return null;
    const trips = await this.getAll();
    return trips.find(t => t.destinationId === destinationId) ?? null;
  }

  async save(rawTrip) {
    const validation = Validator.validateTrip(rawTrip);
    if (!validation.isValid) {
      logger.warn('LocalTripRepository', `Trip validation failed: ${validation.error}`);
      return { success: false, error: validation.error };
    }

    const state = this.getState();
    const existingIndex = state.trips.findIndex(t => t.destinationId === validation.trip.destinationId);

    if (existingIndex >= 0) {
      state.trips[existingIndex] = validation.trip;
    } else {
      state.trips.push(validation.trip);
    }

    const writeSuccess = this._writeRaw(state);
    if (!writeSuccess) {
      return { success: false, error: 'Storage write failed. Quota may be exceeded.' };
    }

    logger.info('LocalTripRepository', `Trip saved for destination: ${validation.trip.destinationId}`);
    return { success: true, trip: validation.trip };
  }

  async delete(destinationId) {
    if (!destinationId) return { success: false, error: 'Destination ID required' };
    const state = this.getState();
    const initialLength = state.trips.length;
    state.trips = state.trips.filter(t => t.destinationId !== destinationId);

    if (state.trips.length === initialLength) {
      return { success: false, error: 'Trip not found' };
    }

    const writeSuccess = this._writeRaw(state);
    return { success: writeSuccess, error: writeSuccess ? undefined : 'Storage update failed' };
  }

  async update(destinationId, updates) {
    const state = this.getState();
    const trip = state.trips.find(t => t.destinationId === destinationId);
    if (!trip) {
      return { success: false, error: 'Trip not found' };
    }

    const merged = { ...trip, ...updates, destinationId }; // destinationId is immutable
    const validation = Validator.validateTrip(merged);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const index = state.trips.findIndex(t => t.destinationId === destinationId);
    state.trips[index] = validation.trip;

    const writeSuccess = this._writeRaw(state);
    return { success: writeSuccess, trip: validation.trip, error: writeSuccess ? undefined : 'Storage update failed' };
  }

  exportJSON() {
    const state = this.getState();
    return JSON.stringify(state, null, 2);
  }

  async importData(payload, strategy = 'merge') {
    const validation = Validator.validateImportPayload(payload);
    if (!validation.isValid && validation.validTrips.length === 0) {
      return { success: false, importedCount: 0, error: validation.error || 'No valid trips found in payload.' };
    }

    const state = this.getState();
    let importedCount = 0;

    if (strategy === 'replace') {
      state.trips = validation.validTrips;
      importedCount = validation.validTrips.length;
    } else {
      // Merge strategy: Add trips that don't already exist
      validation.validTrips.forEach(newTrip => {
        const exists = state.trips.some(existing => existing.destinationId === newTrip.destinationId);
        if (!exists) {
          state.trips.push(newTrip);
          importedCount++;
        }
      });
    }

    const writeSuccess = this._writeRaw(state);
    return {
      success: writeSuccess,
      importedCount,
      skippedCount: validation.validTrips.length - importedCount,
      rejectedCount: validation.rejectedTrips.length,
      error: writeSuccess ? undefined : 'Storage write failed during import.'
    };
  }
}
