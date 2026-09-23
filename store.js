/**
 * Decision-First Reactive Application Store
 * Manages user constraints, matching engine execution, comparison selections,
 * local repository persistence, and UI events.
 */

import { DESTINATIONS } from '../data/destinations.js';
import { MatchingEngine } from '../engine/matching.js';
import { LocalTripRepository } from '../repositories/localTripRepository.js';
import { Validator } from '../models/validator.js';
import { logger } from '../services/logger.js';
import { APP_CONFIG } from '../config.js';

class AppStore {
  constructor() {
    this.repository = new LocalTripRepository();
    this.destinations = [...DESTINATIONS];
    this.rankedDestinations = [];
    
    // Core User Constraints (§3 & §12)
    this.constraints = {
      budget: 1200,
      days: 5,
      travelers: 2,
      season: 'spring',
      travelerType: 'couple', // 'solo' | 'couple' | 'family' | 'friends'
      styles: ['culture', 'food']
    };

    // Text search filter (optional refinement)
    this.searchQuery = '';

    // Compare View State (2 - 4 selections)
    this.comparedDestinationIds = new Set();

    this.activeCurrency = 'USD';
    this.theme = 'system';
    this.savedTrips = [];
    this.selectedDestination = null;

    this.listeners = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    return () => {
      this.listeners.get(eventName)?.delete(callback);
    };
  }

  notify(eventName, data = null) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data, this);
        } catch (err) {
          logger.error('AppStore', `Error in subscriber for event "${eventName}".`, err);
        }
      });
    }
  }

  async init() {
    logger.info('AppStore', 'Initializing Decision-First application state...');
    const storedState = this.repository.getState();
    this.savedTrips = storedState.trips || [];
    this.activeCurrency = storedState.preferences?.currency || 'USD';
    this.theme = storedState.preferences?.theme || 'system';

    this.applyTheme(this.theme);
    this._runMatching();
    this.notify('INIT_COMPLETE', { store: this });
  }

  // --- Constraints Management ---

  setConstraint(key, value) {
    if (this.constraints.hasOwnProperty(key)) {
      this.constraints[key] = value;
      this._runMatching();
    }
  }

  setConstraints(newConstraints) {
    this.constraints = { ...this.constraints, ...newConstraints };
    this._runMatching();
  }

  toggleStyleTag(styleKey) {
    const index = this.constraints.styles.indexOf(styleKey);
    if (index >= 0) {
      this.constraints.styles.splice(index, 1);
    } else {
      if (this.constraints.styles.length < 4) {
        this.constraints.styles.push(styleKey);
      }
    }
    this._runMatching();
  }

  setSearchQuery(query) {
    this.searchQuery = Validator.validateSearchQuery(query);
    this._runMatching();
  }

  resetConstraints() {
    this.constraints = {
      budget: 1200,
      days: 5,
      travelers: 2,
      season: 'spring',
      travelerType: 'couple',
      styles: ['culture', 'food']
    };
    this.searchQuery = '';
    this._runMatching();
  }

  _runMatching() {
    // 1. Run deterministic matching on all 16 destinations
    const scored = MatchingEngine.rankDestinations(this.destinations, this.constraints);

    // 2. Filter by search query if user typed one
    let filtered = scored;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = scored.filter(dest => {
        const nameMatch = dest.name.toLowerCase().includes(q);
        const countryMatch = dest.country.toLowerCase().includes(q);
        const regionMatch = (dest.region || '').toLowerCase().includes(q);
        return nameMatch || countryMatch || regionMatch;
      });
    }

    this.rankedDestinations = filtered;
    logger.debug('AppStore', `Matching complete. Top destination: ${filtered[0]?.name} (${filtered[0]?.match?.totalScore}%)`);

    this.notify('MATCH_RESULTS_UPDATED', {
      ranked: this.rankedDestinations,
      constraints: this.constraints,
      searchQuery: this.searchQuery
    });
  }

  // --- Compare Selection Management (2 to 4 destinations) ---

  toggleCompare(destinationId) {
    if (this.comparedDestinationIds.has(destinationId)) {
      this.comparedDestinationIds.delete(destinationId);
      this.notify('COMPARE_CHANGED', { selectedIds: [...this.comparedDestinationIds] });
      return { success: true, action: 'removed' };
    }

    if (this.comparedDestinationIds.size >= 4) {
      return { success: false, error: 'You can compare a maximum of 4 destinations at a time.' };
    }

    this.comparedDestinationIds.add(destinationId);
    this.notify('COMPARE_CHANGED', { selectedIds: [...this.comparedDestinationIds] });
    return { success: true, action: 'added' };
  }

  clearCompare() {
    this.comparedDestinationIds.clear();
    this.notify('COMPARE_CHANGED', { selectedIds: [] });
  }

  isCompared(destinationId) {
    return this.comparedDestinationIds.has(destinationId);
  }

  getComparedDestinations() {
    return [...this.comparedDestinationIds].map(id => {
      return this.rankedDestinations.find(d => d.id === id) || this.destinations.find(d => d.id === id);
    }).filter(Boolean);
  }

  // --- Theme & Currency ---

  setCurrency(currKey) {
    if (APP_CONFIG.CURRENCIES[currKey]) {
      this.activeCurrency = currKey;
      const state = this.repository.getState();
      state.preferences.currency = currKey;
      this.repository._writeRaw(state);
      this.notify('CURRENCY_CHANGED', { currency: currKey, info: APP_CONFIG.CURRENCIES[currKey] });
    }
  }

  setTheme(theme) {
    if (['light', 'dark', 'system'].includes(theme)) {
      this.theme = theme;
      this.applyTheme(theme);
      const state = this.repository.getState();
      state.preferences.theme = theme;
      this.repository._writeRaw(state);
      this.notify('THEME_CHANGED', { theme });
    }
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  // --- Trip Persistence ---

  async saveTrip(trip) {
    const result = await this.repository.save(trip);
    if (result.success) {
      this.savedTrips = await this.repository.getAll();
      this.notify('TRIPS_UPDATED', { trips: this.savedTrips, lastAction: 'save', savedTrip: result.trip });
    }
    return result;
  }

  async deleteTrip(destinationId) {
    const tripToDelete = this.savedTrips.find(t => t.destinationId === destinationId);
    const result = await this.repository.delete(destinationId);
    if (result.success) {
      this.savedTrips = await this.repository.getAll();
      this.notify('TRIPS_UPDATED', { trips: this.savedTrips, lastAction: 'delete', deletedTrip: tripToDelete });
    }
    return result;
  }

  async updateTrip(destinationId, updates) {
    const result = await this.repository.update(destinationId, updates);
    if (result.success) {
      this.savedTrips = await this.repository.getAll();
      this.notify('TRIPS_UPDATED', { trips: this.savedTrips, lastAction: 'update', updatedTrip: result.trip });
    }
    return result;
  }

  async importTrips(payload, strategy = 'merge') {
    const result = await this.repository.importData(payload, strategy);
    if (result.success) {
      this.savedTrips = await this.repository.getAll();
      this.notify('TRIPS_UPDATED', { trips: this.savedTrips, lastAction: 'import', result });
    }
    return result;
  }

  exportTripsJSON() {
    return this.repository.exportJSON();
  }

  isDestinationSaved(destinationId) {
    return this.savedTrips.some(t => t.destinationId === destinationId);
  }

  getSavedTrip(destinationId) {
    return this.savedTrips.find(t => t.destinationId === destinationId) || null;
  }
}

export const appStore = new AppStore();
