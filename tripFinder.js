/**
 * Decision-First Trip Finder Form Component
 * Strictly implements §4.1 and §12.5.
 * Captures user constraints: Budget, Days, Travelers, Season, Traveler Type, and Style preferences.
 */

import { appStore } from '../state/store.js';
import { Validator } from '../models/validator.js';
import { APP_CONFIG } from '../config.js';

export class TripFinder {
  constructor(containerElement) {
    this.container = containerElement;
    // Separate debounce timers per control so one input never cancels
    // another input's pending update (previously all shared one timer).
    this._budgetDebounce = null;
    this._daysDebounce = null;
    this._searchDebounce = null;
  }

  render() {
    if (!this.container) return;

    const { budget, days, travelers, season, travelerType, styles } = appStore.constraints;
    const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;
    const displayBudget = Math.round(budget * curr.rate);

    this.container.innerHTML = `
      <section class="trip-finder-card" role="region" aria-label="Trip Constraint Finder">
        <div class="finder-header">
          <div>
            <h3 style="font-size: 1.35rem; margin: 0;">🧭 Decision-First Trip Finder</h3>
            <p style="font-size: 0.88rem; color: var(--text-subtle); margin-top: 4px;">
              Input your budget, time, and preferences. The matching engine computes which destinations actually fit and why.
            </p>
          </div>
          <button type="button" class="btn btn-sm btn-secondary btn-reset-finder" id="btn-reset-finder">
            ↺ Reset Defaults
          </button>
        </div>

        <form id="trip-finder-form" class="finder-grid" onsubmit="return false;">
          <!-- 1. Total Trip Budget -->
          <div class="form-group finder-col">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <label for="finder-budget">Total Trip Budget</label>
              <span class="finder-val-badge" id="budget-val-display">${curr.symbol}${displayBudget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              id="finder-budget" 
              min="50" 
              max="6000" 
              step="50" 
              value="${budget}"
              aria-describedby="budget-val-display"
              aria-label="Total trip budget in ${curr.name}"
            >
            <span style="font-size: 0.72rem; color: var(--text-subtle);">Covers accommodation, meals, transit & activities (shown in ${curr.name})</span>
          </div>

          <!-- 2. Trip Duration -->
          <div class="form-group finder-col">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <label for="finder-days">Duration (Days)</label>
              <span class="finder-val-badge" id="days-val-display">${days} Days</span>
            </div>
            <input 
              type="range" 
              id="finder-days" 
              min="1" 
              max="16" 
              step="1" 
              value="${days}"
              aria-describedby="days-val-display"
            >
            <span style="font-size: 0.72rem; color: var(--text-subtle);">Calculates pacing & itinerary scale</span>
          </div>

          <!-- 3. Travelers Count & Party Type -->
          <div class="form-group finder-col">
            <label for="finder-travelers">Travel Party</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xs);">
              <select id="finder-travelers" aria-label="Number of travelers">
                ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${travelers === n ? 'selected' : ''}>${n} ${n === 1 ? 'Person' : 'People'}</option>`).join('')}
              </select>
              <select id="finder-party-type" aria-label="Type of travel party">
                <option value="solo" ${travelerType === 'solo' ? 'selected' : ''}>Solo</option>
                <option value="couple" ${travelerType === 'couple' ? 'selected' : ''}>Couple</option>
                <option value="friends" ${travelerType === 'friends' ? 'selected' : ''}>Friends</option>
                <option value="family" ${travelerType === 'family' ? 'selected' : ''}>Family</option>
              </select>
            </div>
          </div>

          <!-- 4. Travel Season -->
          <div class="form-group finder-col">
            <label for="finder-season">Planned Season</label>
            <select id="finder-season" aria-label="Travel season">
              <option value="spring" ${season === 'spring' ? 'selected' : ''}>🌸 Spring</option>
              <option value="summer" ${season === 'summer' ? 'selected' : ''}>☀️ Summer</option>
              <option value="autumn" ${season === 'autumn' ? 'selected' : ''}>🍂 Autumn</option>
              <option value="winter" ${season === 'winter' ? 'selected' : ''}>❄️ Winter</option>
            </select>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">Evaluates best season vs shoulder/off season</span>
          </div>

          <!-- 5. Travel Style Tags (Multi-select, max 4) -->
          <div class="form-group" style="grid-column: 1 / -1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <label>Travel Style & Vibes (Pick up to 4)</label>
              <span style="font-size: 0.75rem; color: var(--text-subtle);">Weights soft match scoring (35 pts max)</span>
            </div>
            <div class="finder-style-chips" role="group" aria-label="Select style tags">
              ${this._renderStyleChip('culture', '🏛️ Culture & History', styles)}
              ${this._renderStyleChip('nature', '🌲 Nature & Scenery', styles)}
              ${this._renderStyleChip('adventure', '🧗 Outdoor Adventure', styles)}
              ${this._renderStyleChip('food', '🍜 Food & Gastronomy', styles)}
              ${this._renderStyleChip('relaxation', '🧘 Relaxation & Wellness', styles)}
              ${this._renderStyleChip('nightlife', '🍸 Nightlife & Social', styles)}
            </div>
          </div>

          <!-- 6. Search Filter Input -->
          <div class="form-group" style="grid-column: 1 / -1; margin-top: var(--space-xs);">
            <div class="search-input-wrapper">
              <span class="search-icon" aria-hidden="true">🔍</span>
              <input 
                type="search" 
                id="finder-search-input" 
                placeholder="Filter destination name, country, or region (e.g. 'Japan', 'Banff', 'Alps')..." 
                maxlength="60"
                value="${appStore.searchQuery}"
                aria-label="Filter destination name or country"
              >
            </div>
          </div>
        </form>
      </section>
    `;

    this._bindEvents();
  }

  _renderStyleChip(key, label, selectedList) {
    const isSelected = selectedList.includes(key);
    return `
      <button 
        type="button" 
        class="finder-chip ${isSelected ? 'active' : ''}" 
        data-style="${key}"
        aria-pressed="${isSelected}"
      >
        ${label}
      </button>
    `;
  }

  _bindEvents() {
    const budgetSlider = this.container.querySelector('#finder-budget');
    const budgetDisplay = this.container.querySelector('#budget-val-display');
    const daysSlider = this.container.querySelector('#finder-days');
    const daysDisplay = this.container.querySelector('#days-val-display');
    const travelersSelect = this.container.querySelector('#finder-travelers');
    const partySelect = this.container.querySelector('#finder-party-type');
    const seasonSelect = this.container.querySelector('#finder-season');
    const searchInput = this.container.querySelector('#finder-search-input');
    const styleChips = this.container.querySelectorAll('.finder-chip');
    const resetBtn = this.container.querySelector('#btn-reset-finder');

    budgetSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;
      budgetDisplay.textContent = `${curr.symbol}${Math.round(val * curr.rate).toLocaleString()}`;
      clearTimeout(this._budgetDebounce);
      this._budgetDebounce = setTimeout(() => {
        appStore.setConstraint('budget', val);
      }, 150);
    });

    daysSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      daysDisplay.textContent = `${val} Days`;
      clearTimeout(this._daysDebounce);
      this._daysDebounce = setTimeout(() => {
        appStore.setConstraint('days', val);
      }, 150);
    });

    travelersSelect?.addEventListener('change', (e) => {
      appStore.setConstraint('travelers', parseInt(e.target.value, 10));
    });

    partySelect?.addEventListener('change', (e) => {
      appStore.setConstraint('travelerType', e.target.value);
    });

    seasonSelect?.addEventListener('change', (e) => {
      appStore.setConstraint('season', e.target.value);
    });

    styleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const styleKey = chip.getAttribute('data-style');
        appStore.toggleStyleTag(styleKey);
        this.render(); // Re-render chip states
      });
    });

    searchInput?.addEventListener('input', (e) => {
      clearTimeout(this._searchDebounce);
      this._searchDebounce = setTimeout(() => {
        appStore.setSearchQuery(e.target.value);
      }, 200);
    });

    resetBtn?.addEventListener('click', () => {
      appStore.resetConstraints();
      this.render();
    });
  }
}
