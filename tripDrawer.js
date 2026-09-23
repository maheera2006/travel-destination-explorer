/**
 * Saved Trips Slide-Out Drawer Component
 * Accessible drawer implemented with native HTML5 <dialog>
 * Supports viewing, editing user notes, deleting with undo toast, and launching JSON export.
 */

import { appStore } from '../state/store.js';
import { DESTINATIONS } from '../data/destinations.js';
import { CostCalculator } from './costCalculator.js';
import { toast } from './toast.js';

export class TripDrawer {
  constructor() {
    this.dialog = null;
    this.triggerElement = null;
    this._ensureDialog();
  }

  _ensureDialog() {
    let dialog = document.getElementById('trips-drawer-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'trips-drawer-dialog';
      dialog.className = 'drawer-dialog';
      dialog.setAttribute('aria-labelledby', 'drawer-title');
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

  open(triggerElement = null) {
    this.triggerElement = triggerElement;
    this.render();
    document.body.classList.add('modal-open');
    this.dialog.showModal();

    const title = this.dialog.querySelector('#drawer-title');
    title?.focus();
  }

  close() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }

  render() {
    const savedTrips = appStore.savedTrips;

    this.dialog.innerHTML = `
      <div class="modal-layout" style="height: 100%;">
        <div class="modal-header">
          <div>
            <h3 id="drawer-title">My Saved Trips (${savedTrips.length})</h3>
            <span style="font-size: 0.8rem; color: var(--text-subtle);">Stored locally on your device</span>
          </div>
          <button type="button" class="btn-close-modal" id="drawer-close-btn" aria-label="Close saved trips drawer">✕</button>
        </div>

        <div class="drawer-body" id="drawer-content-area">
          ${savedTrips.length === 0 ? this._renderEmptyState() : this._renderTripList(savedTrips)}
        </div>

        <div class="modal-header" style="border-top: 1px solid var(--border-light); border-bottom: none; justify-content: space-between;">
          <button type="button" class="btn btn-sm btn-secondary" id="btn-export-from-drawer">
            📥 Export / Backup
          </button>
          <button type="button" class="btn btn-sm btn-primary" id="btn-done-drawer">
            Done
          </button>
        </div>
      </div>
    `;

    // Wire actions
    this.dialog.querySelector('#drawer-close-btn')?.addEventListener('click', () => this.close());
    this.dialog.querySelector('#btn-done-drawer')?.addEventListener('click', () => this.close());

    this.dialog.querySelector('#btn-export-from-drawer')?.addEventListener('click', () => {
      this.close();
      const exportModal = document.getElementById('import-export-modal');
      exportModal?.dispatchEvent(new CustomEvent('open-modal'));
    });

    this._wireTripItemActions();
  }

  _renderEmptyState() {
    return `
      <div class="empty-state-box" style="margin: auto 0; border: none;">
        <div class="empty-state-icon">🎒</div>
        <h4>No Trips Saved Yet</h4>
        <p style="margin-top: 4px; font-size: 0.9rem;">
          Browse destinations and click <strong>Save to My Trips</strong> to plan your itineraries.
        </p>
      </div>
    `;
  }

  _renderTripList(savedTrips) {
    return savedTrips.map(trip => {
      const dest = DESTINATIONS.find(d => d.id === trip.destinationId);
      if (!dest) return '';

      const calc = new CostCalculator(dest, trip.customDays, trip.customTravelers, trip.travelStyle);
      calc.setCurrency(appStore.activeCurrency);
      const summary = calc.calculate();

      return `
        <div class="saved-trip-item" data-id="${dest.id}">
          <div class="saved-trip-header">
            <div>
              <strong style="font-size: 1.05rem;">${dest.name}</strong>, 
              <span style="font-size: 0.85rem; color: var(--text-subtle);">${dest.country}</span>
            </div>
            <span class="rate-value" style="font-size: 1.05rem;">${summary.formattedTotal}</span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-muted); display: flex; gap: var(--space-xs); flex-wrap: wrap;">
            <span>🗓️ ${trip.customDays} Days</span>
            <span>👥 ${trip.customTravelers} Travelers</span>
            <span>🏷️ ${trip.travelStyle.toUpperCase()}</span>
          </div>

          <div class="form-group" style="margin-top: var(--space-xs);">
            <label for="notes-${dest.id}" style="font-size: 0.75rem;">Custom Itinerary Notes:</label>
            <textarea id="notes-${dest.id}" class="saved-notes-textarea" placeholder="Add packing reminders, flight ideas, or must-eat spots...">${trip.userNotes || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-xs);">
            <button type="button" class="btn btn-sm btn-danger btn-delete-trip" data-id="${dest.id}">
              🗑️ Remove
            </button>
            <button type="button" class="btn btn-sm btn-secondary btn-save-notes" data-id="${dest.id}">
              Save Notes
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  _wireTripItemActions() {
    // Save notes
    this.dialog.querySelectorAll('.btn-save-notes').forEach(btn => {
      btn.addEventListener('click', async () => {
        const destId = btn.getAttribute('data-id');
        const textarea = this.dialog.querySelector(`#notes-${destId}`);
        const notes = textarea ? textarea.value : '';

        const result = await appStore.updateTrip(destId, { userNotes: notes });
        if (result.success) {
          toast.show('Notes updated successfully!', 'success');
        } else {
          toast.show(`Failed to update notes: ${result.error}`, 'error');
        }
      });
    });

    // Delete trip with undo toast
    this.dialog.querySelectorAll('.btn-delete-trip').forEach(btn => {
      btn.addEventListener('click', async () => {
        const destId = btn.getAttribute('data-id');
        const tripToDelete = appStore.getSavedTrip(destId);
        const dest = DESTINATIONS.find(d => d.id === destId);

        const result = await appStore.deleteTrip(destId);
        if (result.success) {
          this.render(); // Re-render list
          toast.show(`Removed ${dest?.name || 'trip'} from My Trips.`, 'info', 5000, {
            label: 'Undo',
            onClick: async () => {
              if (tripToDelete) {
                await appStore.saveTrip(tripToDelete);
                this.render();
                toast.show(`Restored ${dest?.name || 'trip'} to My Trips!`, 'success');
              }
            }
          });
        }
      });
    });
  }
}

export const tripDrawer = new TripDrawer();
