/**
 * Accessible Toast Notifications (ARIA Live Region)
 * Announces state changes to screen readers and displays brief visual feedback.
 */

class ToastManager {
  constructor() {
    this.container = null;
    this._ensureContainer();
  }

  _ensureContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    this.container = container;
  }

  /**
   * Shows a toast message.
   * @param {string} message
   * @param {'success'|'error'|'warn'|'info'} type
   * @param {number} durationMs
   * @param {Object} action Optional { label, onClick }
   */
  show(message, type = 'info', durationMs = 4000, action = null) {
    this._ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message; // Safe DOM assignment
    toast.appendChild(messageSpan);

    if (action && typeof action.onClick === 'function') {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'btn btn-sm btn-secondary';
      actionBtn.textContent = action.label || 'Action';
      actionBtn.addEventListener('click', () => {
        action.onClick();
        this._dismiss(toast);
      });
      toast.appendChild(actionBtn);
    }

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close-toast';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this._dismiss(toast));
    toast.appendChild(closeBtn);

    this.container.appendChild(toast);

    if (durationMs > 0) {
      setTimeout(() => {
        this._dismiss(toast);
      }, durationMs);
    }

    return toast;
  }

  _dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }
}

export const toast = new ToastManager();
