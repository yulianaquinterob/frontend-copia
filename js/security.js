const SecurityUtils = {
  // Sanitiza texto para evitar inyección XSS en inserciones HTML
  sanitizeText(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>&"'/]/g, (char) => {
      const map = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      return map[char] || char;
    }).trim();
  },

  // Validación de correo electrónico
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).trim());
  },

  // Política de contraseña segura (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)
  isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },

  // Algoritmo de Luhn para validar número de tarjeta de crédito/débito
  isValidLuhn(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  },

  // Valida que la fecha de expiración de tarjeta sea válida y no esté en el pasado
  isValidCardExpiry(exp) {
    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(exp.trim())) return false;
    const parts = exp.split('/');
    const month = parseInt(parts[0].trim(), 10);
    const year = parseInt('20' + parts[1].trim(), 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  },

  // Genera fecha local YYYY-MM-DD sin depender de UTC
  getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Gestión segura de sesión (nunca guarda contraseñas ni datos de tarjetas)
  setSession(userObj) {
    const sessionData = {
      isAuthenticated: true,
      userId: userObj.id || 'USR-' + Date.now(),
      nombre: this.sanitizeText(userObj.nombre || 'Usuario'),
      email: this.sanitizeText(userObj.email || ''),
      timestamp: Date.now()
    };
    sessionStorage.setItem('hotel_session', JSON.stringify(sessionData));
  },

  getSession() {
    try {
      const raw = sessionStorage.getItem('hotel_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    sessionStorage.removeItem('hotel_session');
  },

  // Route Guard: Protege páginas que requieren autenticación
  requireAuth(redirectTarget = './login.html') {
    const session = this.getSession();
    if (!session || !session.isAuthenticated) {
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${redirectTarget}?redirect=${currentUrl}`;
      return false;
    }
    return true;
  },

  // Aísla claves de almacenamiento local por usuario
  getUserStorageKey(prefix) {
    const session = this.getSession();
    const uid = session && session.userId ? session.userId : 'guest';
    return `${prefix}_${uid}`;
  }
};
