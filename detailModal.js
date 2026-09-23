/**
 * Destination Dossier Modal Component
 * Strictly implements §4.5, §12.2, and §12.3 of the Product Specification.
 * Displays:
 * 1. Match score & decomposed sub-scores
 * 2. Budget Reality Breakdown (Itemized daily costs, remaining buffer, not-included pills)
 * 3. Trade-offs section ("Why it fits" vs "Trade-offs")
 * 4. Deterministic Adaptive Itinerary scaled to user's requested trip duration
 * 5. Truthful weather conditions widget
 */

import { weatherService } from '../services/weatherService.js';
import { MatchingEngine } from '../engine/matching.js';
import { ItineraryGenerator } from '../engine/itinerary.js';
import { appStore } from '../state/store.js';
import { toast } from './toast.js';
import { logger } from '../services/logger.js';
import { APP_CONFIG } from '../config.js';

export class DetailModal {
  constructor() {
    this.dialog = null;
    this.triggerElement = null;
    this.currentDestination = null;
    this._ensureDialog();
  }

  _ensureDialog() {
    let dialog = document.getElementById('destination-detail-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'destination-detail-dialog';
      dialog.className = 'modal-layout dossier-dialog';
      dialog.setAttribute('aria-labelledby', 'modal-dest-title');
      dialog.setAttribute('aria-modal', 'true');
      document.body.appendChild(dialog);
    }
    this.dialog = dialog;

    this.dialog.addEventListener('click', (e) => {
      const rect = this.dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });

    this.dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
        this.triggerElement.focus();
      }
    });
  }

  async open(destination, triggerElement = null) {
    if (!destination) return;
    this.currentDestination = destination;
    this.triggerElement = triggerElement;

    const constraints = appStore.constraints;
    const match = MatchingEngine.scoreDestination(destination, constraints);
    const itinerary = ItineraryGenerator.generateItinerary(destination, constraints.days);
    const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;

    // Budget Reality computations (§12.3)
    const breakdown = destination.budgetBreakdown || {
      accommodationPerDay: 50,
      foodPerDay: 30,
      localTransportPerDay: 10,
      activitiesPerDay: 10,
      otherPerDay: 5
    };
    const dailySumUSD = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const totalEstimatedUSD = dailySumUSD * constraints.days * constraints.travelers;
    const remainingBufferUSD = constraints.budget - totalEstimatedUSD;

    let budgetStatusClass = 'status-comfortable';
    let budgetStatusText = '🟢 Comfortably Under Budget';
    if (match.breakdown.isNearLimit) {
      budgetStatusClass = 'status-near';
      budgetStatusText = '🟠 Near Budget Limit (Within 15%)';
    } else if (match.breakdown.isOverBudget) {
      budgetStatusClass = 'status-over';
      budgetStatusText = '🔴 Exceeds Your Budget';
    }

    const isSaved = appStore.isDestinationSaved(destination.id);

    this.dialog.innerHTML = `
      <div class="modal-header">
        <div>
          <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: 4px;">
            <span class="badge ${match.totalScore >= 80 ? 'badge-match-high' : 'badge-match-mid'}">
              ${match.totalScore}% Fit
            </span>
            <span style="font-size: 0.8rem; color: var(--text-subtle);">for ${constraints.days} days in ${constraints.season.toUpperCase()}</span>
          </div>
          <h3 id="modal-dest-title" style="margin: 0; font-size: 1.4rem;">${destination.name}, ${destination.country}</h3>
          <span style="font-size: 0.82rem; color: var(--text-subtle);">${destination.region || destination.continent}</span>
        </div>
        <button type="button" class="btn-close-modal" id="modal-close-btn" aria-label="Close dossier">✕</button>
      </div>

      <div class="modal-body">
        <!-- Hero photo & Tagline -->
        <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16/9; max-height: 280px;">
          <img src="${destination.image.url}" alt="${destination.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.85)); padding: var(--space-md); color: #fff;">
            <p style="color: #f8fafc; font-size: 0.95rem; margin: 0;">${destination.tagline}</p>
            <small style="opacity: 0.8; font-size: 0.72rem;">Photo: ${destination.image.photographer} (${destination.image.license})</small>
          </div>
        </div>

        <!-- 1. Explainable Match Decomposition Bar (§4.3) -->
        <div class="dossier-match-box">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-2xs);">
            <strong>Match Decomposition (${match.totalScore}/100)</strong>
            <span style="font-size: 0.8rem; color: var(--text-subtle);">Traceable directly to your inputs</span>
          </div>
          <div class="dossier-subscore-grid">
            <div class="subscore-stat">
              <span class="subscore-stat-name">Budget Fit</span>
              <span class="subscore-stat-val">${match.subScores.budget}/25</span>
            </div>
            <div class="subscore-stat">
              <span class="subscore-stat-name">Season Fit</span>
              <span class="subscore-stat-val">${match.subScores.season}/20</span>
            </div>
            <div class="subscore-stat">
              <span class="subscore-stat-name">Duration Fit</span>
              <span class="subscore-stat-val">${match.subScores.duration}/20</span>
            </div>
            <div class="subscore-stat">
              <span class="subscore-stat-name">Style Match</span>
              <span class="subscore-stat-val">${match.subScores.style}/35</span>
            </div>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: var(--space-xs); margin-bottom: 0;">
            💡 ${match.breakdown.summaryLine}
          </p>
        </div>

        <!-- 2. Budget Reality Breakdown (§12.3) -->
        <div class="dossier-card" role="region" aria-label="Budget Reality Breakdown">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-xs);">
            <h4>💰 Budget Reality Breakdown</h4>
            <span class="status-pill ${budgetStatusClass}">${budgetStatusText}</span>
          </div>

          <div class="budget-reality-metrics">
            <div class="reality-metric">
              <span class="rate-label">Est. Ground Total</span>
              <span class="reality-val">${curr.symbol}${Math.round(totalEstimatedUSD * curr.rate).toLocaleString()}</span>
              <small>${constraints.days} days × ${constraints.travelers} travelers</small>
            </div>
            <div class="reality-metric">
              <span class="rate-label">Your Budget</span>
              <span class="reality-val">${curr.symbol}${Math.round(constraints.budget * curr.rate).toLocaleString()}</span>
              <small>Allocated in Finder</small>
            </div>
            <div class="reality-metric">
              <span class="rate-label">Remaining Buffer</span>
              <span class="reality-val ${remainingBufferUSD >= 0 ? 'text-positive' : 'text-negative'}">
                ${remainingBufferUSD >= 0 ? '+' : ''}${curr.symbol}${Math.round(remainingBufferUSD * curr.rate).toLocaleString()}
              </span>
              <small>${remainingBufferUSD >= 0 ? 'Surplus buffer' : 'Exceeds budget'}</small>
            </div>
          </div>

          <!-- Itemized Daily Breakdown Table -->
          <div style="margin-top: var(--space-md);">
            <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 4px;">
              Itemized Daily Ground Rate (${curr.symbol}${Math.round(dailySumUSD * curr.rate)} / person / day)
            </div>
            <div class="itemized-cost-grid">
              <div class="cost-item">
                <span>🏨 Accommodation</span>
                <strong>${curr.symbol}${Math.round(breakdown.accommodationPerDay * curr.rate)}</strong>
              </div>
              <div class="cost-item">
                <span>🍜 Food & Meals</span>
                <strong>${curr.symbol}${Math.round(breakdown.foodPerDay * curr.rate)}</strong>
              </div>
              <div class="cost-item">
                <span>🚇 Local Transit</span>
                <strong>${curr.symbol}${Math.round(breakdown.localTransportPerDay * curr.rate)}</strong>
              </div>
              <div class="cost-item">
                <span>🎟️ Sights & Activities</span>
                <strong>${curr.symbol}${Math.round(breakdown.activitiesPerDay * curr.rate)}</strong>
              </div>
              <div class="cost-item">
                <span>📦 Incidentals</span>
                <strong>${curr.symbol}${Math.round(breakdown.otherPerDay * curr.rate)}</strong>
              </div>
            </div>
          </div>

          <!-- Not Included Disclaimer Pills (§12.3) -->
          <div style="margin-top: var(--space-md); padding-top: var(--space-xs); border-top: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">
              ⚠️ Budget Scope (Not Included in Ground Costs):
            </span>
            <div class="not-included-pills">
              ${(destination.notIncluded || ['flights', 'visa fees', 'travel insurance', 'shopping']).map(item => `
                <span class="not-included-pill">🚫 ${item.toUpperCase()}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3. Trade-offs Section (§4.8) -->
        <div class="dossier-card" role="region" aria-label="Trade-offs & Fit Analysis">
          <h4>⚖️ Decision Trade-offs & Fit Analysis</h4>
          <div class="tradeoffs-grid">
            <div class="tradeoffs-col why-it-fits">
              <h5>🌟 Why It Fits Your Trip</h5>
              <ul>
                ${(destination.tradeOffs?.whyItFits || ['Strong match for your travel style']).map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>
            <div class="tradeoffs-col watch-outs">
              <h5>⚠️ Trade-offs & Watch-outs</h5>
              <ul>
                ${(destination.tradeOffs?.tradeOffs || ['Check seasonal weather conditions']).map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- 4. Weather Status Widget -->
        <div id="modal-weather-container" class="weather-widget">
          <div class="weather-info">
            <span class="weather-icon">⏳</span>
            <div>
              <div class="weather-condition">Checking live weather conditions...</div>
            </div>
          </div>
        </div>

        <!-- 5. Deterministic Adaptive Itinerary (§12.2) -->
        <div class="dossier-card" role="region" aria-label="Adaptive Itinerary">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h4>🗓️ Adaptive Itinerary (${constraints.days} Days)</h4>
            <span style="font-size: 0.75rem; color: var(--text-subtle);">Paced deterministically by category</span>
          </div>

          <div class="itinerary-timeline" style="margin-top: var(--space-md);">
            ${itinerary.map(item => `
              <div class="day-item">
                <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: 4px;">
                  <span class="day-badge">Day ${item.day}</span>
                  <span class="day-category-pill">${item.category}</span>
                </div>
                <h5 style="margin-bottom: 4px;">${item.title}</h5>
                <ul class="day-activities">
                  ${item.activities.map(act => `<li>${act}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-md); border-top: 1px solid var(--border-light); flex-wrap: wrap; gap: var(--space-sm);">
          <div style="font-size: 0.88rem; color: var(--text-subtle);">
            ${isSaved ? '✓ Saved in My Trips' : 'Not yet saved to your trips'}
          </div>
          <div style="display: flex; gap: var(--space-sm);">
            <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Close</button>
            <button type="button" class="btn btn-primary" id="modal-save-btn">
              ${isSaved ? 'Update Saved Trip' : '❤️ Save Trip Snapshot'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Wire actions
    this.dialog.querySelector('#modal-close-btn')?.addEventListener('click', () => this.close());
    this.dialog.querySelector('#modal-cancel-btn')?.addEventListener('click', () => this.close());

    this.dialog.querySelector('#modal-save-btn')?.addEventListener('click', async () => {
      const tripData = {
        destinationId: destination.id,
        savedAt: new Date().toISOString(),
        customDays: constraints.days,
        customTravelers: constraints.travelers,
        travelStyle: constraints.travelerType || 'comfort',
        calculatedCostUSD: totalEstimatedUSD,
        userNotes: `Match Score: ${match.totalScore}%. Season: ${constraints.season}.`
      };

      const result = await appStore.saveTrip(tripData);
      if (result.success) {
        toast.show(`Saved ${destination.name} Trip Snapshot!`, 'success');
        this.close();
      } else {
        toast.show(`Could not save: ${result.error}`, 'error');
      }
    });

    document.body.classList.add('modal-open');
    this.dialog.showModal();
    this.dialog.querySelector('#modal-dest-title')?.focus();

    this._loadWeather(destination);
  }

  async _loadWeather(destination) {
    const weatherContainer = this.dialog.querySelector('#modal-weather-container');
    if (!weatherContainer) return;

    try {
      const weather = await weatherService.getWeatherForDestination(destination);
      weatherContainer.innerHTML = `
        <div class="weather-info">
          <span class="weather-icon">${weather.icon}</span>
          <div>
            <div class="weather-temp">${weather.tempC}°C</div>
            <div class="weather-condition">${weather.condition}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="weather-badge ${weather.status}">${weather.badgeLabel}</span>
          <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 4px;">${weather.note}</div>
        </div>
      `;
    } catch (err) {
      logger.warn('DetailModal', 'Failed to render weather in modal.', err);
      weatherContainer.innerHTML = `
        <div class="weather-info">
          <span class="weather-icon">🌤️</span>
          <div>
            <div class="weather-temp">${destination.seasonalWeather?.tempC || 20}°C</div>
            <div class="weather-condition">Typical seasonal conditions</div>
          </div>
        </div>
        <div>
          <span class="weather-badge seasonal">Typical seasonal conditions</span>
        </div>
      `;
    }
  }

  close() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }
}

export const detailModal = new DetailModal();
