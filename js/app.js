/**
 * Utilidades de Interfaz de Usuario y Componentes Accesibles (UI Framework)
 * Reemplaza las llamadas nativas bloqueantes (alert, confirm, prompt)
 * por modales y toasts no intrusivos accesibles (WAI-ARIA).
 */
const UI = {
  // Contenedor único para notificaciones flotantes (Toasts)
  _getToastContainer() {
    let container = document.getElementById('ui-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ui-toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  },

  /**
   * Muestra una notificación flotante (toast)
   * @param {string} message - Mensaje a mostrar
   * @param {'success'|'error'|'info'} type - Tipo visual
   * @param {number} duration - Duración en milisegundos
   */
  toast(message, type = 'info', duration = 3500) {
    const container = this._getToastContainer();
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    toastEl.setAttribute('role', 'alert');

    const iconMap = {
      success: '✔',
      error: '✖',
      info: 'ℹ'
    };

    toastEl.innerHTML = `
      <span class="toast-icon">${iconMap[type] || 'ℹ'}</span>
      <span class="toast-message">${SecurityUtils ? SecurityUtils.sanitizeText(message) : message}</span>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.classList.add('toast-fadeout');
      toastEl.addEventListener('animationend', () => toastEl.remove());
    }, duration);
  },

  /**
   * Modal de confirmación accesible (reemplaza window.confirm)
   * @param {string} title
   * @param {string} message
   * @returns {Promise<boolean>}
   */
  confirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-labelledby', 'modal-title');

      backdrop.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title">${SecurityUtils.sanitizeText(title)}</h2>
          </div>
          <div class="modal-body">
            <p>${SecurityUtils.sanitizeText(message)}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-blue" id="modalCancelBtn">${SecurityUtils.sanitizeText(cancelText)}</button>
            <button type="button" class="btn btn-purple" id="modalConfirmBtn">${SecurityUtils.sanitizeText(confirmText)}</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      const confirmBtn = backdrop.querySelector('#modalConfirmBtn');
      const cancelBtn = backdrop.querySelector('#modalCancelBtn');

      const cleanup = () => {
        document.removeEventListener('keydown', handleKeydown);
        backdrop.remove();
      };

      const handleConfirm = () => {
        cleanup();
        resolve(true);
      };

      const handleCancel = () => {
        cleanup();
        resolve(false);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') handleCancel();
      };

      confirmBtn.addEventListener('click', handleConfirm);
      cancelBtn.addEventListener('click', handleCancel);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) handleCancel();
      });
      document.addEventListener('keydown', handleKeydown);

      confirmBtn.focus();
    });
  },

  /**
   * Modal para entrada de texto o fecha accesible (reemplaza window.prompt)
   * @param {string} title
   * @param {string} message
   * @param {string} defaultValue
   * @param {string} inputType - 'text', 'date', 'textarea'
   * @param {object} inputAttributes - e.g. { min: '...' }
   * @returns {Promise<string|null>}
   */
  prompt(title, message, defaultValue = '', inputType = 'text', inputAttributes = {}) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');

      let inputMarkup = '';
      if (inputType === 'textarea') {
        inputMarkup = `<textarea id="modalPromptInput" class="form-control" rows="4" style="resize:vertical;">${SecurityUtils.sanitizeText(defaultValue)}</textarea>`;
      } else {
        const minAttr = inputAttributes.min ? `min="${inputAttributes.min}"` : '';
        const maxAttr = inputAttributes.max ? `max="${inputAttributes.max}"` : '';
        inputMarkup = `<input type="${inputType}" id="modalPromptInput" class="form-control" value="${SecurityUtils.sanitizeText(defaultValue)}" ${minAttr} ${maxAttr}>`;
      }

      backdrop.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">${SecurityUtils.sanitizeText(title)}</h2>
          </div>
          <div class="modal-body">
            <p style="margin-bottom: 12px; color: var(--texto-oscuro);">${SecurityUtils.sanitizeText(message)}</p>
            ${inputMarkup}
            <div id="modalPromptError" class="alert-msg alert-error" style="margin-top: 10px; font-size: 0.85rem;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-blue" id="modalPromptCancelBtn">Cancelar</button>
            <button type="button" class="btn btn-purple" id="modalPromptOkBtn">Aceptar</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      const input = backdrop.querySelector('#modalPromptInput');
      const okBtn = backdrop.querySelector('#modalPromptOkBtn');
      const cancelBtn = backdrop.querySelector('#modalPromptCancelBtn');

      const cleanup = () => {
        document.removeEventListener('keydown', handleKeydown);
        backdrop.remove();
      };

      const handleOk = () => {
        const val = input.value.trim();
        cleanup();
        resolve(val);
      };

      const handleCancel = () => {
        cleanup();
        resolve(null);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') handleCancel();
        if (e.key === 'Enter' && inputType !== 'textarea') handleOk();
      };

      okBtn.addEventListener('click', handleOk);
      cancelBtn.addEventListener('click', handleCancel);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) handleCancel();
      });
      document.addEventListener('keydown', handleKeydown);

      input.focus();
    });
  }
};
