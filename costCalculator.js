/**
 * Dynamic Trip Cost Calculator Component
 * Implements approved formula:
 *   Base Cost = dailyCost (per-person/day) × travelers × days
 *   Adjusted Cost = Base Cost × styleMultiplier
 * Converts between supported currencies using fixed reference exchange rates.
 */

import { APP_CONFIG } from '../config.js';
import { Validator } from '../models/validator.js';

export class CostCalculator {
  constructor(destination, initialDays = 5, initialTravelers = 2, initialStyle = 'comfort') {
    this.destination = destination;
    this.days = Validator.validateInteger(initialDays, APP_CONFIG.BOUNDS.MIN_DAYS, APP_CONFIG.BOUNDS.MAX_DAYS, 5);
    this.travelers = Validator.validateInteger(initialTravelers, APP_CONFIG.BOUNDS.MIN_TRAVELERS, APP_CONFIG.BOUNDS.MAX_TRAVELERS, 2);
    this.style = Validator.validateTravelStyle(initialStyle);
    this.currency = 'USD';
  }

  setCurrency(currencyCode) {
    if (APP_CONFIG.CURRENCIES[currencyCode]) {
      this.currency = currencyCode;
    }
  }

  calculate() {
    const dailyCostPerPerson = this.destination.dailyCostUSD || 100;
    const baseCostUSD = dailyCostPerPerson * this.travelers * this.days;
    const multiplier = APP_CONFIG.TRAVEL_STYLES[this.style]?.multiplier ?? 1.6;
    const totalUSD = Math.round(baseCostUSD * multiplier);

    const currencyConfig = APP_CONFIG.CURRENCIES[this.currency] ?? APP_CONFIG.CURRENCIES.USD;
    const convertedAmount = Math.round(totalUSD * currencyConfig.rate);

    return {
      dailyCostPerPerson,
      days: this.days,
      travelers: this.travelers,
      style: this.style,
      multiplier,
      totalUSD,
      convertedAmount,
      currency: this.currency,
      currencySymbol: currencyConfig.symbol,
      formattedTotal: `${currencyConfig.symbol}${convertedAmount.toLocaleString(currencyConfig.format)}`
    };
  }

  render(containerElement, onCalculateChange = null) {
    if (!containerElement) return;

    const calc = this.calculate();

    containerElement.innerHTML = `
      <div class="calculator-box" role="region" aria-label="Trip Budget Calculator">
        <h4 style="margin-bottom: var(--space-sm);">💰 Estimate Your Trip Budget</h4>
        
        <div class="calculator-grid">
          <!-- Days input -->
          <div class="form-group">
            <label for="calc-days-input">Duration (Days): <span id="days-val" class="font-bold">${this.days}</span></label>
            <input type="range" id="calc-days-input" min="${APP_CONFIG.BOUNDS.MIN_DAYS}" max="${APP_CONFIG.BOUNDS.MAX_DAYS}" value="${this.days}">
          </div>

          <!-- Travelers input -->
          <div class="form-group">
            <label for="calc-travelers-input">Travelers: <span id="travelers-val" class="font-bold">${this.travelers}</span></label>
            <input type="range" id="calc-travelers-input" min="${APP_CONFIG.BOUNDS.MIN_TRAVELERS}" max="${APP_CONFIG.BOUNDS.MAX_TRAVELERS}" value="${this.travelers}">
          </div>

          <!-- Style selector -->
          <div class="form-group" style="grid-column: 1 / -1;">
            <label>Travel Comfort Level</label>
            <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
              <button type="button" class="btn btn-sm btn-secondary calc-style-btn ${this.style === 'budget' ? 'active' : ''}" data-style="budget">
                🎒 Budget (1.0x)
              </button>
              <button type="button" class="btn btn-sm btn-secondary calc-style-btn ${this.style === 'comfort' ? 'active' : ''}" data-style="comfort">
                🏨 Comfort (1.6x)
              </button>
              <button type="button" class="btn btn-sm btn-secondary calc-style-btn ${this.style === 'luxury' ? 'active' : ''}" data-style="luxury">
                ✨ Luxury (2.8x)
              </button>
            </div>
          </div>
        </div>

        <!-- Calculated Summary Box -->
        <div class="calc-total-card">
          <div class="rate-label">Estimated Total Trip Cost</div>
          <div class="calc-total-amount" id="calc-total-display">${calc.formattedTotal}</div>
          <div class="calc-disclaimer">
            Based on $${calc.dailyCostPerPerson}/person/day × ${calc.travelers} travelers × ${calc.days} days × ${calc.multiplier}x multiplier.<br>
            *Estimated conversion based on fixed reference rates (${this.currency}); not live market rates.
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const daysSlider = containerElement.querySelector('#calc-days-input');
    const daysDisplay = containerElement.querySelector('#days-val');
    const travelersSlider = containerElement.querySelector('#calc-travelers-input');
    const travelersDisplay = containerElement.querySelector('#travelers-val');
    const totalDisplay = containerElement.querySelector('#calc-total-display');
    const styleBtns = containerElement.querySelectorAll('.calc-style-btn');

    const updateUI = () => {
      const updated = this.calculate();
      daysDisplay.textContent = this.days;
      travelersDisplay.textContent = this.travelers;
      totalDisplay.textContent = updated.formattedTotal;

      styleBtns.forEach(btn => {
        if (btn.getAttribute('data-style') === this.style) {
          btn.classList.add('active');
          btn.classList.remove('btn-secondary');
          btn.classList.add('btn-primary');
        } else {
          btn.classList.remove('active', 'btn-primary');
          btn.classList.add('btn-secondary');
        }
      });

      if (onCalculateChange) {
        onCalculateChange(updated);
      }
    };

    daysSlider?.addEventListener('input', (e) => {
      this.days = parseInt(e.target.value, 10);
      updateUI();
    });

    travelersSlider?.addEventListener('input', (e) => {
      this.travelers = parseInt(e.target.value, 10);
      updateUI();
    });

    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.style = btn.getAttribute('data-style');
        updateUI();
      });
    });

    // Initial button styling
    updateUI();
  }
}
