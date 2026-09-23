/**
 * Ranked Destination Grid Component
 * Displays destinations ordered by match score, provides explainable sub-score decompositions,
 * handles "+ Compare" selection (capped at 4), and bookmarking.
 */

import { appStore } from '../state/store.js';
import { detailModal } from './detailModal.js';
import { toast } from './toast.js';
import { APP_CONFIG } from '../config.js';

export class DestinationGrid {
  constructor(gridContainer, counterElement) {
    this.gridContainer = gridContainer;
    this.counterElement = counterElement;
  }

  render() {
    if (!this.gridContainer) return;

    const destinations = appStore.rankedDestinations;
    const headerCurr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;

    // Update results counter
    if (this.counterElement) {
      const displayBudget = Math.round(appStore.constraints.budget * headerCurr.rate);
      this.counterElement.innerHTML = `
        <span>Ranked <strong>${destinations.length} destinations</strong> matching your ${appStore.constraints.days}-day, ${headerCurr.symbol}${displayBudget.toLocaleString()} trip constraints</span>
      `;
    }

    if (destinations.length === 0) {
      this._renderEmptyState();
      return;
    }

    const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;

    this.gridContainer.innerHTML = destinations.map(dest => {
      const match = dest.match;
      const isSaved = appStore.isDestinationSaved(dest.id);
      const isCompared = appStore.isCompared(dest.id);
      const totalEstimated = Math.round(match.breakdown.estimatedTotal * curr.rate);
      const dailyRate = Math.round((dest.costTier?.dailyBudget || dest.dailyCostUSD) * curr.rate);

      // Match badge style
      let badgeClass = 'badge-match-high';
      let statusNote = '';
      if (match.breakdown.isNearLimit) {
        badgeClass = 'badge-match-mid';
        statusNote = ' · ⚠️ Near Budget Limit';
      } else if (match.breakdown.isOverBudget) {
        badgeClass = 'badge-match-low';
        statusNote = ' · 🔴 Over Budget';
      }

      return `
        <article class="destination-card ${match.breakdown.isOverBudget ? 'card-dimmed' : ''}" data-id="${dest.id}">
          <div class="card-image-wrap">
            <img 
              src="${dest.image.url}" 
              alt="${dest.name}, ${dest.country}" 
              class="card-img" 
              loading="lazy"
            >
            <div class="card-floating-badges">
              <span class="badge ${badgeClass}">${match.totalScore}% Match${statusNote}</span>
            </div>

            <!-- Bookmark Button -->
            <button 
              type="button" 
              class="card-btn-bookmark ${isSaved ? 'saved' : ''}" 
              data-id="${dest.id}" 
              aria-label="${isSaved ? 'Remove from My Trips' : 'Save to My Trips'}"
              title="${isSaved ? 'Saved in My Trips' : 'Save to My Trips'}"
            >
              ${isSaved ? '❤️' : '🤍'}
            </button>
          </div>

          <div class="card-body">
            <div class="card-title-row">
              <h3 class="card-title">${dest.name}</h3>
              <span class="card-country">${dest.country}</span>
            </div>
            <p class="card-tagline">${dest.tagline}</p>

            <!-- Decomposed Sub-Scores Bar (§4.3) -->
            <div class="match-decomposition-bar" title="Budget ${match.subScores.budget}/25 · Season ${match.subScores.season}/20 · Duration ${match.subScores.duration}/20 · Style ${match.subScores.style}/35">
              <span class="subscore-chip">💰 Budget: ${match.subScores.budget}/25</span>
              <span class="subscore-chip">☀️ Season: ${match.subScores.season}/20</span>
              <span class="subscore-chip">🗓️ Duration: ${match.subScores.duration}/20</span>
              <span class="subscore-chip">🎨 Style: ${match.subScores.style}/35</span>
            </div>

            <!-- Why this match summary -->
            <div class="match-summary-line">
              💡 ${match.breakdown.summaryLine}
            </div>

            <div class="card-footer">
              <div class="card-rate-display">
                <span class="rate-label">Est. Ground Total</span>
                <span class="rate-value">${curr.symbol}${totalEstimated.toLocaleString()}</span>
                <span style="font-size: 0.72rem; color: var(--text-subtle);">(${curr.symbol}${dailyRate}/person/day)</span>
              </div>

              <!-- Compare Toggle & Dossier CTA -->
              <div style="display: flex; align-items: center; gap: var(--space-xs);">
                <label class="compare-checkbox-label" title="Select to compare side-by-side (2 to 4 destinations)">
                  <input type="checkbox" class="compare-checkbox" data-id="${dest.id}" ${isCompared ? 'checked' : ''}>
                  <span>Compare</span>
                </label>
                <button type="button" class="btn btn-sm btn-primary btn-explore" data-id="${dest.id}">
                  Dossier ➔
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this._bindEvents();
  }

  _renderEmptyState() {
    this.gridContainer.innerHTML = `
      <div class="empty-state-box" role="status">
        <div class="empty-state-icon">🔍</div>
        <h3>No Destinations Fit Current Constraints</h3>
        <p style="margin-top: var(--space-xs); max-width: 520px; margin-left: auto; margin-right: auto;">
          None of our 16 destinations could match your strict budget or season constraints. Try increasing your budget slider or choosing a different travel season.
        </p>
        <button type="button" class="btn btn-primary" id="btn-empty-reset" style="margin-top: var(--space-md);">
          ↺ Reset Finder to Relaxed Defaults
        </button>
      </div>
    `;

    this.gridContainer.querySelector('#btn-empty-reset')?.addEventListener('click', () => {
      appStore.resetConstraints();
    });
  }

  _bindEvents() {
    // Open Dossier modal
    this.gridContainer.querySelectorAll('.btn-explore').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = appStore.destinations.find(d => d.id === id);
        if (dest) {
          detailModal.open(dest, btn);
        }
      });
    });

    // Compare checkbox toggle
    this.gridContainer.querySelectorAll('.compare-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = chk.getAttribute('data-id');
        const res = appStore.toggleCompare(id);
        if (!res.success) {
          chk.checked = false; // Revert checkbox
          toast.show(res.error, 'warn');
        }
      });
    });

    // Bookmark button
    this.gridContainer.querySelectorAll('.card-btn-bookmark').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const dest = appStore.destinations.find(d => d.id === id);
        if (!dest) return;

        if (appStore.isDestinationSaved(id)) {
          const res = await appStore.deleteTrip(id);
          if (res.success) {
            toast.show(`Removed ${dest.name} from My Trips`, 'info');
          }
        } else {
          const tripData = {
            destinationId: dest.id,
            savedAt: new Date().toISOString(),
            customDays: appStore.constraints.days,
            customTravelers: appStore.constraints.travelers,
            travelStyle: 'comfort',
            userNotes: ''
          };
          const res = await appStore.saveTrip(tripData);
          if (res.success) {
            toast.show(`Saved ${dest.name} to My Trips!`, 'success');
          }
        }
      });
    });
  }
}
