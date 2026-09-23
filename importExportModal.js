/**
 * Safe JSON Import & Export Modal Component
 * Strictly complies with production data-safety standards:
 * - Export: Generates downloadable valid JSON file of travelExplorer:v1 state
 * - Import: Validates payload, displays preview, and requires user selection
 *   between Merge (non-destructive) or Replace (with explicit confirmation).
 */

import { appStore } from '../state/store.js';
import { Validator } from '../models/validator.js';
import { DESTINATIONS } from '../data/destinations.js';
import { toast } from './toast.js';

export class ImportExportModal {
  constructor() {
    this.dialog = null;
    this.pendingPayload = null;
    this.validationResult = null;
    this._ensureDialog();
  }

  _ensureDialog() {
    let dialog = document.getElementById('import-export-modal');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'import-export-modal';
      dialog.className = 'modal-layout';
      dialog.setAttribute('aria-labelledby', 'data-modal-title');
      dialog.setAttribute('aria-modal', 'true');
      document.body.appendChild(dialog);
    }
    this.dialog = dialog;

    dialog.addEventListener('open-modal', () => this.open());

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
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

    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      this.pendingPayload = null;
      this.validationResult = null;
    });
  }

  open() {
    this.render();
    document.body.classList.add('modal-open');
    this.dialog.showModal();
    this.dialog.querySelector('#data-modal-title')?.focus();
  }

  close() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }

  render() {
    this.dialog.innerHTML = `
      <div class="modal-header">
        <h3 id="data-modal-title">💾 Backup & Restore Saved Trips</h3>
        <button type="button" class="btn-close-modal" id="data-close-btn" aria-label="Close backup modal">✕</button>
      </div>

      <div class="modal-body">
        <!-- Export Section -->
        <div style="background-color: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <h4>📥 Export Current Saved Trips</h4>
          <p style="font-size: 0.88rem; margin: var(--space-2xs) 0 var(--space-sm);">
            Download a valid <code>.json</code> backup containing all ${appStore.savedTrips.length} saved trips, custom notes, and preferences.
          </p>
          <button type="button" class="btn btn-primary" id="btn-export-download">
            Download Backup (.json)
          </button>
        </div>

        <!-- Import Section -->
        <div style="background-color: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <h4>📤 Import / Restore Trips</h4>
          <p style="font-size: 0.88rem; margin: var(--space-2xs) 0 var(--space-sm);">
            Select a previously exported <code>.json</code> backup file. You will preview and confirm the import before any data is modified.
          </p>
          <input type="file" id="import-file-input" accept=".json,application/json" style="width: 100%; margin-bottom: var(--space-sm);">

          <!-- Preview Area (Dynamic) -->
          <div id="import-preview-area" style="display: none; margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--border-medium);">
          </div>
        </div>
      </div>
    `;

    // Wire close
    this.dialog.querySelector('#data-close-btn')?.addEventListener('click', () => this.close());

    // Wire export download
    this.dialog.querySelector('#btn-export-download')?.addEventListener('click', () => {
      this._handleExport();
    });

    // Wire file input
    const fileInput = this.dialog.querySelector('#import-file-input');
    fileInput?.addEventListener('change', (e) => {
      this._handleFileSelected(e.target.files?.[0]);
    });
  }

  _handleExport() {
    const jsonString = appStore.exportTripsJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-explorer-trips-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.show('Trip backup downloaded successfully!', 'success');
  }

  _handleFileSelected(file) {
    if (!file) return;

    const previewArea = this.dialog.querySelector('#import-preview-area');
    if (!previewArea) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawJson = JSON.parse(e.target.result);
        const validation = Validator.validateImportPayload(rawJson);

        if (!validation.isValid && validation.validTrips.length === 0) {
          previewArea.style.display = 'block';
          previewArea.innerHTML = `
            <div style="color: var(--color-danger); font-size: 0.9rem;">
              ❌ Invalid backup file format: ${validation.error || 'No valid trip records found.'}
            </div>
          `;
          return;
        }

        this.pendingPayload = rawJson;
        this.validationResult = validation;

        // Render preview with Merge vs Replace choices
        previewArea.style.display = 'block';
        previewArea.innerHTML = `
          <div style="background-color: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: var(--space-md);">
            <h5>🔍 Import Preview Summary</h5>
            <p style="font-size: 0.88rem; margin-top: var(--space-2xs);">
              Found <strong>${validation.validTrips.length}</strong> valid trip records in the file.
              ${validation.rejectedTrips.length > 0 ? `<br><span style="color: var(--color-warning);">⚠️ ${validation.rejectedTrips.length} invalid records were rejected.</span>` : ''}
            </p>

            <ul style="font-size: 0.82rem; margin: var(--space-xs) 0 var(--space-md); padding-left: var(--space-md); max-height: 120px; overflow-y: auto;">
              ${validation.validTrips.map(t => {
                const dest = DESTINATIONS.find(d => d.id === t.destinationId);
                return `<li><strong>${dest?.name || t.destinationId}</strong> (${t.customDays} days, ${t.travelStyle})</li>`;
              }).join('')}
            </ul>

            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
              <button type="button" class="btn btn-sm btn-primary" id="btn-confirm-merge">
                Merge (Keep Existing Trips)
              </button>
              <button type="button" class="btn btn-sm btn-danger" id="btn-confirm-replace">
                Replace (Overwrite All)
              </button>
            </div>
          </div>
        `;

        previewArea.querySelector('#btn-confirm-merge')?.addEventListener('click', async () => {
          await this._executeImport('merge');
        });

        previewArea.querySelector('#btn-confirm-replace')?.addEventListener('click', async () => {
          const confirmed = window.confirm('Are you sure you want to replace all existing saved trips with this file? This cannot be undone.');
          if (confirmed) {
            await this._executeImport('replace');
          }
        });

      } catch (err) {
        previewArea.style.display = 'block';
        previewArea.innerHTML = `
          <div style="color: var(--color-danger); font-size: 0.9rem;">
            ❌ Failed to parse JSON file: ${err.message}
          </div>
        `;
      }
    };

    reader.readAsText(file);
  }

  async _executeImport(strategy) {
    if (!this.pendingPayload) return;

    const result = await appStore.importTrips(this.pendingPayload, strategy);
    if (result.success) {
      toast.show(`Successfully imported ${result.importedCount} trips (${strategy} mode)!`, 'success');
      this.close();
    } else {
      toast.show(`Import error: ${result.error}`, 'error');
    }
  }
}

export const importExportModal = new ImportExportModal();
