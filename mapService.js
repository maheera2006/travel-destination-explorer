/**
 * Resilient Map Service
 * Wraps Leaflet.js with defensive error handling and provides a structured
 * fallback location panel if Leaflet CDN fails or tiles cannot load.
 */

import { APP_CONFIG } from '../config.js';
import { logger } from './logger.js';
import { appStore } from '../state/store.js';

export class MapService {
  constructor() {
    this.mapInstance = null;
    this.markersLayer = null;
    this.isLeafletAvailable = false;
  }

  /**
   * Checks if Leaflet library is available on the window object.
   */
  checkLeafletAvailability() {
    this.isLeafletAvailable = typeof window !== 'undefined' && Boolean(window.L && window.L.map);
    return this.isLeafletAvailable;
  }

  /**
   * Initializes or updates the map inside the given container element.
   * @param {HTMLElement} containerElement
   * @param {Array<Object>} destinations
   * @param {Function} onSelectDestination Callback when a marker popup is clicked
   */
  renderMap(containerElement, destinations = [], onSelectDestination = null) {
    if (!containerElement) return;

    if (!this.checkLeafletAvailability()) {
      logger.warn('MapService', 'Leaflet is not loaded; rendering location fallback overview.');
      this.renderFallbackOverview(containerElement, destinations);
      return;
    }

    try {
      if (!this.mapInstance) {
        this.mapInstance = window.L.map(containerElement, {
          center: APP_CONFIG.MAP.DEFAULT_CENTER,
          zoom: APP_CONFIG.MAP.DEFAULT_ZOOM,
          minZoom: 1,
          maxZoom: APP_CONFIG.MAP.MAX_ZOOM,
          scrollWheelZoom: false
        });

        // Add OpenStreetMap tile layer with error handling
        const tileLayer = window.L.tileLayer(APP_CONFIG.MAP.TILE_LAYER_URL, {
          attribution: APP_CONFIG.MAP.TILE_ATTRIBUTION,
          maxZoom: APP_CONFIG.MAP.MAX_ZOOM
        });

        tileLayer.on('tileerror', () => {
          logger.warn('MapService', 'Map tile load failure. Falling back if tile network remains disconnected.');
        });

        tileLayer.addTo(this.mapInstance);
        this.markersLayer = window.L.layerGroup().addTo(this.mapInstance);
      }

      // Update markers
      this.updateMarkers(destinations, onSelectDestination);

      // Force layout invalidation after DOM render
      setTimeout(() => {
        if (this.mapInstance) {
          this.mapInstance.invalidateSize();
        }
      }, 200);

    } catch (err) {
      logger.error('MapService', 'Failed to initialize Leaflet map.', err);
      this.renderFallbackOverview(containerElement, destinations);
    }
  }

  updateMarkers(destinations = [], onSelectDestination = null) {
    if (!this.mapInstance || !this.markersLayer || !this.isLeafletAvailable) return;

    this.markersLayer.clearLayers();

    const bounds = [];

    destinations.forEach(dest => {
      if (!Array.isArray(dest.coordinates) || dest.coordinates.length < 2) return;
      const [lat, lng] = dest.coordinates;
      bounds.push([lat, lng]);

      // Custom SVG icon
      const customIcon = window.L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="pin-marker" title="${dest.name}, ${dest.country}">
            <span class="pin-symbol">📍</span>
            <span class="pin-label">${dest.name}</span>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      const marker = window.L.marker([lat, lng], { icon: customIcon });

      const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;
      const dailyRateUSD = dest.costTier?.dailyBudget ?? dest.dailyCostUSD ?? 0;
      const displayDailyRate = Math.round(dailyRateUSD * curr.rate);

      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup-card';
      popupContent.innerHTML = `
        <div class="map-popup-header">
          <strong>${dest.name}</strong>, <span>${dest.country}</span>
        </div>
        <p class="map-popup-cost">From ${curr.symbol}${displayDailyRate}/day</p>
        <button type="button" class="btn-popup-explore" data-id="${dest.id}">View Details</button>
      `;

      popupContent.querySelector('.btn-popup-explore')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (onSelectDestination) {
          onSelectDestination(dest);
        }
      });

      marker.bindPopup(popupContent);
      this.markersLayer.addLayer(marker);
    });

    if (bounds.length > 0 && this.mapInstance) {
      this.mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  }

  /**
   * Renders a structured textual fallback panel when Leaflet or network tiles are unavailable.
   */
  renderFallbackOverview(containerElement, destinations = []) {
    if (!containerElement) return;

    containerElement.innerHTML = `
      <div class="map-fallback-panel" role="region" aria-label="Geographic Location Overview">
        <div class="fallback-header">
          <h4>🗺️ Geographic Distribution Overview</h4>
          <span class="fallback-status-badge">Offline / Text Mode</span>
        </div>
        <p class="fallback-description">
          Interactive map tiles are currently in text mode. The table below lists geographic coordinates and regions for all ${destinations.length} matching destinations.
        </p>
        <div class="fallback-table-wrapper">
          <table class="fallback-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Country</th>
                <th>Region</th>
                <th>Coordinates</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${destinations.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>${d.country}</td>
                  <td>${d.region || d.continent}</td>
                  <td class="font-mono">${d.coordinates ? `${d.coordinates[0].toFixed(2)}°, ${d.coordinates[1].toFixed(2)}°` : 'N/A'}</td>
                  <td>
                    <button type="button" class="btn-fallback-view" data-id="${d.id}">Explore</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Wire up explore buttons in the fallback table
    containerElement.querySelectorAll('.btn-fallback-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = destinations.find(d => d.id === id);
        if (dest) {
          const event = new CustomEvent('open-destination-modal', { detail: dest, bubbles: true });
          containerElement.dispatchEvent(event);
        }
      });
    });
  }

  destroy() {
    if (this.mapInstance) {
      try {
        this.mapInstance.remove();
      } catch (err) {
        logger.debug('MapService', 'Error during map cleanup.', err);
      }
      this.mapInstance = null;
      this.markersLayer = null;
    }
  }
}

export const mapService = new MapService();
