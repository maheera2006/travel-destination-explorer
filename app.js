/**
 * Decision-First Application Bootstrap & Coordinator
 * Implements global error boundaries, initializes TripFinder, DestinationGrid,
 * CompareModal, and coordinates data flow via reactive AppStore subscriptions.
 */

import { appStore } from './state/store.js';
import { logger } from './services/logger.js';
import { mapService } from './services/mapService.js';
import { TripFinder } from './components/tripFinder.js';
import { DestinationGrid } from './components/destinationGrid.js';
import { detailModal } from './components/detailModal.js';
import { compareModal } from './components/compareModal.js';
import { tripDrawer } from './components/tripDrawer.js';
import { importExportModal } from './components/importExportModal.js';
import { toast } from './components/toast.js';

class App {
  constructor() {
    this.tripFinder = null;
    this.destinationGrid = null;
    this._setupGlobalErrorBoundaries();
  }

  _setupGlobalErrorBoundaries() {
    window.addEventListener('error', (event) => {
      logger.error('GlobalBoundary', `Uncaught exception: ${event.message}`, event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      logger.error('GlobalBoundary', `Unhandled Promise rejection: ${event.reason?.message || event.reason}`);
    });
  }

  async init() {
    logger.info('App', 'Bootstrapping Decision-First Travel Planner...');

    try {
      // 1. Initialize State & Repository
      await appStore.init();

      // 2. Setup Header Controls
      this._setupHeaderControls();

      // 3. Initialize Decision Components
      const finderContainer = document.getElementById('trip-finder-container');
      const gridContainer = document.getElementById('destinations-grid-container');
      const counterElement = document.getElementById('results-count');
      const mapContainer = document.getElementById('map-view');

      this.tripFinder = new TripFinder(finderContainer);
      this.tripFinder.render();

      this.destinationGrid = new DestinationGrid(gridContainer, counterElement);
      this.destinationGrid.render();

      // 4. Initialize Map (Non-blocking)
      this._initMap(mapContainer);

      // 5. Wire AppStore Event Subscriptions
      this._bindStoreEvents();

      // 6. Global custom event listeners
      document.addEventListener('open-destination-modal', (e) => {
        if (e.detail) {
          detailModal.open(e.detail);
        }
      });

      logger.info('App', 'Decision-First bootstrap complete.');
    } catch (err) {
      logger.error('App', 'Fatal error during bootstrap.', err);
      toast.show('An error occurred while loading the application.', 'error');
    }
  }

  _initMap(mapContainer) {
    if (!mapContainer) return;
    try {
      mapService.renderMap(mapContainer, appStore.rankedDestinations, (dest) => {
        detailModal.open(dest);
      });
    } catch (err) {
      logger.warn('App', 'Map initialization failed gracefully; fallback engaged.', err);
      mapService.renderFallbackOverview(mapContainer, appStore.rankedDestinations);
    }
  }

  _setupHeaderControls() {
    // Currency Selector
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
      currencySelect.value = appStore.activeCurrency;
      currencySelect.addEventListener('change', (e) => {
        appStore.setCurrency(e.target.value);
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      this._updateThemeIcon(themeBtn);
      themeBtn.addEventListener('click', () => {
        const nextTheme = appStore.theme === 'dark' ? 'light' : 'dark';
        appStore.setTheme(nextTheme);
        this._updateThemeIcon(themeBtn);
      });
    }

    // Saved Trips Button
    const savedTripsBtn = document.getElementById('btn-saved-trips');
    if (savedTripsBtn) {
      this._updateSavedTripsBadge();
      savedTripsBtn.addEventListener('click', () => {
        tripDrawer.open(savedTripsBtn);
      });
    }

    // Backup & Restore Button
    const backupBtn = document.getElementById('btn-backup-restore');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => {
        importExportModal.open();
      });
    }
  }

  _updateThemeIcon(btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
  }

  _updateSavedTripsBadge() {
    const badge = document.getElementById('saved-trips-count');
    if (badge) {
      badge.textContent = appStore.savedTrips.length;
    }
  }

  _bindStoreEvents() {
    // When matching results change: re-render grid and update map
    appStore.subscribe('MATCH_RESULTS_UPDATED', (data) => {
      this.destinationGrid.render();
      const mapContainer = document.getElementById('map-view');
      if (mapContainer) {
        if (mapService.isLeafletAvailable && mapService.mapInstance) {
          mapService.updateMarkers(data.ranked, (dest) => detailModal.open(dest));
        } else {
          mapService.renderFallbackOverview(mapContainer, data.ranked);
        }
      }
    });

    // When compare selection changes: re-render compare checkboxes
    appStore.subscribe('COMPARE_CHANGED', () => {
      this.destinationGrid.render();
    });

    // When saved trips change: update badge and cards
    appStore.subscribe('TRIPS_UPDATED', () => {
      this._updateSavedTripsBadge();
      this.destinationGrid.render();
      if (tripDrawer.dialog?.open) {
        tripDrawer.render();
      }
    });

    // When currency changes: re-render grid, the Trip Finder budget display,
    // and the map popups (which also show currency-converted daily rates).
    appStore.subscribe('CURRENCY_CHANGED', () => {
      this.destinationGrid.render();
      this.tripFinder?.render();
      const mapContainer = document.getElementById('map-view');
      if (mapContainer) {
        if (mapService.isLeafletAvailable && mapService.mapInstance) {
          mapService.updateMarkers(appStore.rankedDestinations, (dest) => detailModal.open(dest));
        } else {
          mapService.renderFallbackOverview(mapContainer, appStore.rankedDestinations);
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
