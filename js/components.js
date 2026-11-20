document.addEventListener('DOMContentLoaded', () => {
  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '../' : './';
  const pagesPath = isSubpage ? './' : './pages/';

  const session = SecurityUtils.getSession();
  const profileTarget = session && session.isAuthenticated
    ? `${pagesPath}perfil.html`
    : `${pagesPath}login.html`;

  const userGreeting = session && session.nombre ? `Hola, ${session.nombre}` : '';

  const topBarHTML = `
    <header class="top-bar">
      <a href="${basePath}index.html" class="top-bar__brand" aria-label="Ir al inicio de HotelReservas">HotelReservas</a>
      <div class="top-bar__actions">
        ${userGreeting ? `<span style="font-size: 0.9rem; font-weight: 600; opacity: 0.95;">${userGreeting}</span>` : ''}
        <a href="${profileTarget}" class="icon-btn" title="${session ? 'Mi perfil' : 'Iniciar sesión'}" aria-label="Perfil de usuario">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </a>
        <button id="menuToggleBtn" class="icon-btn" title="Menú" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="sideMenu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      <nav id="sideMenu" class="side-menu" aria-label="Navegación principal">
        <a href="${basePath}index.html">Inicio</a>
        <a href="${pagesPath}mis-reservas.html">Mis reservas</a>
        <a href="${pagesPath}historial.html">Historial de reservas</a>
        <a href="${profileTarget}">${session ? 'Mi perfil' : 'Iniciar sesión'}</a>
      </nav>
    </header>
  `;

  const bottomBarHTML = `
    <footer class="bottom-bar">
      <div>
        <span>© 2026 HotelReservas. Todos los derechos reservados.</span>
      </div>
      <div style="display: flex; gap: 16px; align-items: center;">
        <span>🔒 Conexión segura SSL</span>
        <a href="${basePath}index.html">Inicio</a>
        <a href="${pagesPath}habitaciones.html">Habitaciones</a>
      </div>
    </footer>
  `;

  const headerPlaceholder = document.getElementById('app-header');
  const footerPlaceholder = document.getElementById('app-footer');

  if (headerPlaceholder) headerPlaceholder.innerHTML = topBarHTML;
  if (footerPlaceholder) footerPlaceholder.innerHTML = bottomBarHTML;

  // Control accesible del menú desplegable
  const menuBtn = document.getElementById('menuToggleBtn');
  const sideMenu = document.getElementById('sideMenu');
  if (menuBtn && sideMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !sideMenu.classList.contains('active');
      sideMenu.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', () => {
      if (sideMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Cerrar con Escape por accesibilidad
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
  }
});
