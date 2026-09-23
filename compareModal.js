/**
 * Side-by-Side Destination Compare Modal Component
 * Strictly implements §4.4 and §12.4 of the Product Specification.
 * Compares 2 to 4 destinations across Overall Match %, Est. Ground Cost,
 * Season Match, Top Strength, and Key Trade-offs.
 */

import { appStore } from '../state/store.js';
import { detailModal } from './detailModal.js';
import { toast } from './toast.js';
import { APP_CONFIG } from '../config.js';

export class CompareModal {
  constructor() {
    this.dialog = null;
    this.floatingBar = null;
    this._ensureDialog();
    this._ensureFloatingBar();
  }

  _ensureDialog() {
    let dialog = document.getElementById('compare-modal-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'compare-modal-dialog';
      dialog.className = 'modal-layout compare-dialog';
      dialog.setAttribute('aria-labelledby', 'compare-modal-title');
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
    });
  }

  _ensureFloatingBar() {
    let bar = document.getElementById('floating-compare-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'floating-compare-bar';
      bar.className = 'floating-compare-bar';
      bar.style.display = 'none';
      document.body.appendChild(bar);
    }
    this.floatingBar = bar;

    appStore.subscribe('COMPARE_CHANGED', () => {
      this.updateFloatingBar();
    });
  }

  updateFloatingBar() {
    const compared = appStore.getComparedDestinations();
    if (!this.floatingBar) return;

    if (compared.length >= 2) {
      this.floatingBar.style.display = 'flex';
      this.floatingBar.innerHTML = `
        <div class="compare-bar-content">
          <span>⚖️ <strong>${compared.length} destinations</strong> selected for side-by-side comparison</span>
          <div style="display: flex; gap: var(--space-xs);">
            <button type="button" class="btn btn-sm btn-secondary" id="btn-clear-compare">Clear</button>
            <button type="button" class="btn btn-sm btn-primary" id="btn-launch-compare">Compare Now ➔</button>
          </div>
        </div>
      `;

      this.floatingBar.querySelector('#btn-clear-compare')?.addEventListener('click', () => {
        appStore.clearCompare();
      });

      this.floatingBar.querySelector('#btn-launch-compare')?.addEventListener('click', () => {
        this.open();
      });
    } else {
      this.floatingBar.style.display = 'none';
    }
  }

  open() {
    const compared = appStore.getComparedDestinations();
    if (compared.length < 2) {
      toast.show('Select at least 2 destinations to compare.', 'warn');
      return;
    }

    this.render();
    document.body.classList.add('modal-open');
    this.dialog.showModal();
    this.dialog.querySelector('#compare-modal-title')?.focus();
  }

  close() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }

  render() {
    const compared = appStore.getComparedDestinations();
    const curr = APP_CONFIG.CURRENCIES[appStore.activeCurrency] || APP_CONFIG.CURRENCIES.USD;

    this.dialog.innerHTML = `
      <div class="modal-header">
        <div>
          <h3 id="compare-modal-title">⚖️ Destination Decision Matrix</h3>
          <span style="font-size: 0.82rem; color: var(--text-subtle);">
            Comparing ${compared.length} options against your ${appStore.constraints.days}-day, ${curr.symbol}${Math.round(appStore.constraints.budget * curr.rate).toLocaleString()} trip
          </span>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-compare" aria-label="Close comparison">✕</button>
      </div>

      <div class="modal-body" style="padding: 0; overflow-x: auto;">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-metric-col">Decision Factor</th>
              ${compared.map(d => `
                <th class="compare-dest-col">
                  <div class="compare-dest-header">
                    <img src="${d.image.url}" alt="${d.name}" class="compare-dest-thumb">
                    <div>
                      <strong>${d.name}</strong>
                      <span class="compare-country">${d.country}</span>
                    </div>
                    <button type="button" class="btn-remove-compare" data-id="${d.id}" title="Remove from comparison" aria-label="Remove ${d.name}">✕</button>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <!-- 1. Overall Match -->
            <tr>
              <td class="metric-label">Overall Match</td>
              ${compared.map(d => `
                <td class="metric-value">
                  <span class="badge ${d.match.totalScore >= 80 ? 'badge-match-high' : 'badge-match-mid'}">
                    ${d.match.totalScore}% Fit
                  </span>
                  <div class="subscore-mini">
                    Budget ${d.match.subScores.budget}/25 · Style ${d.match.subScores.style}/35
                  </div>
                </td>
              `).join('')}
            </tr>

            <!-- 2. Estimated Ground Cost -->
            <tr>
              <td class="metric-label">Est. Ground Cost</td>
              ${compared.map(d => {
                const total = Math.round(d.match.breakdown.estimatedTotal * curr.rate);
                const isNear = d.match.breakdown.isNearLimit;
                const isOver = d.match.breakdown.isOverBudget;
                let badgeClass = 'status-comfortable';
                let badgeText = 'Within Budget';
                if (isNear) { badgeClass = 'status-near'; badgeText = '⚠️ Near Limit'; }
                if (isOver) { badgeClass = 'status-over'; badgeText = '🔴 Exceeds Budget'; }

                return `
                  <td class="metric-value">
                    <div style="font-size: 1.15rem; font-weight: 800;">${curr.symbol}${total.toLocaleString()}</div>
                    <span class="status-pill ${badgeClass}">${badgeText}</span>
                    <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">
                      ${curr.symbol}${Math.round((d.costTier?.dailyBudget || d.dailyCostUSD) * curr.rate)}/person/day
                    </div>
                  </td>
                `;
              }).join('')}
            </tr>

            <!-- 3. Best Season Match -->
            <tr>
              <td class="metric-label">Season Match (${appStore.constraints.season.toUpperCase()})</td>
              ${compared.map(d => {
                const isBest = (d.bestSeasons || []).map(s => s.toLowerCase()).includes(appStore.constraints.season);
                const isShoulder = (d.shoulderSeasons || []).map(s => s.toLowerCase()).includes(appStore.constraints.season);
                let badge = '❌ Off-Season';
                if (isBest) badge = '✅ Prime Season';
                else if (isShoulder) badge = '⚠️ Shoulder Season';

                return `
                  <td class="metric-value">
                    <div><strong>${badge}</strong></div>
                    <small style="color: var(--text-subtle);">Best in: ${(d.bestSeasons || []).join(', ')}</small>
                  </td>
                `;
              }).join('')}
            </tr>

            <!-- 4. Top Strength -->
            <tr>
              <td class="metric-label">Top Strength</td>
              ${compared.map(d => `
                <td class="metric-value">
                  <strong>${d.match.breakdown.topStrength}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">
                    Score: ${d.styleScores[d.match.breakdown.topStrength.toLowerCase()] || 90}/100
                  </div>
                </td>
              `).join('')}
            </tr>

            <!-- 5. Key Trade-Off -->
            <tr>
              <td class="metric-label">Key Trade-off / Watch-out</td>
              ${compared.map(d => `
                <td class="metric-value font-tradeoff">
                  ⚠️ ${d.tradeOffs?.tradeOffs?.[0] || 'Check peak holiday crowds'}
                </td>
              `).join('')}
            </tr>

            <!-- 6. Recommended Duration -->
            <tr>
              <td class="metric-label">Ideal Pacing</td>
              ${compared.map(d => `
                <td class="metric-value">
                  ${d.minDays} to ${d.maxRecommendedDays} Days
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">
                    Your trip: ${appStore.constraints.days} Days
                  </div>
                </td>
              `).join('')}
            </tr>

            <!-- 7. Action Row -->
            <tr>
              <td class="metric-label">Action</td>
              ${compared.map(d => `
                <td class="metric-value">
                  <button type="button" class="btn btn-sm btn-primary btn-compare-inspect" data-id="${d.id}">
                    Open Dossier ➔
                  </button>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Wire close
    this.dialog.querySelector('#btn-close-compare')?.addEventListener('click', () => this.close());

    // Wire remove buttons
    this.dialog.querySelectorAll('.btn-remove-compare').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        appStore.toggleCompare(id);
        if (appStore.getComparedDestinations().length >= 2) {
          this.render();
        } else {
          this.close();
        }
      });
    });

    // Wire inspect dossier buttons
    this.dialog.querySelectorAll('.btn-compare-inspect').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dest = appStore.destinations.find(d => d.id === id);
        if (dest) {
          this.close();
          detailModal.open(dest);
        }
      });
    });
  }
}

export const compareModal = new CompareModal();
