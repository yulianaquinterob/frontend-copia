/**
 * Controlador de la Página de Inicio (index.html)
 * Manejo del buscador de fechas y catálogo dinámico de habitaciones.
 */

function renderRooms(lista) {
  const container = document.getElementById('roomsList');
  if (!container) return;
  container.innerHTML = '';

  if (lista.length === 0) {
    const emptyWrapper = document.createElement('div');
    emptyWrapper.style.gridColumn = '1/-1';
    emptyWrapper.style.textAlign = 'center';
    emptyWrapper.style.padding = '40px 20px';

    const emptyText = document.createElement('p');
    emptyText.style.fontSize = '1.15rem';
    emptyText.style.color = 'var(--texto-etiqueta)';
    emptyText.style.marginBottom = '12px';
    emptyText.textContent = 'No se encontraron habitaciones para la capacidad solicitada.';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-purple';
    resetBtn.style.maxWidth = '220px';
    resetBtn.textContent = 'Ver todas las habitaciones';
    resetBtn.addEventListener('click', () => renderRooms(HotelData.habitaciones));

    emptyWrapper.append(emptyText, resetBtn);
    container.appendChild(emptyWrapper);
    return;
  }

  lista.forEach((hab) => {
    const card = document.createElement('article');
    card.className = 'room-card';

    const img = document.createElement('img');
    img.src = hab.imagen;
    img.alt = hab.titulo;
    img.className = 'room-card__img';

    const body = document.createElement('div');
    body.className = 'room-card__body';

    const title = document.createElement('h2');
    title.className = 'room-card__title';
    title.textContent = hab.titulo;

    const middle = document.createElement('div');
    middle.className = 'room-card__middle';

    const desc = document.createElement('p');
    desc.className = 'room-card__desc';
    desc.textContent = hab.descripcion;

    const link = document.createElement('a');
    link.href = `./pages/habitaciones.html?id=${encodeURIComponent(hab.id)}`;
    link.className = 'btn-red-small';
    link.textContent = 'Ver más';

    middle.append(desc, link);

    const footer = document.createElement('div');
    footer.className = 'room-card__footer';

    const rating = document.createElement('span');
    rating.className = 'room-card__rating';
    rating.textContent = `★ ${hab.rating}`;

    const price = document.createElement('span');
    price.className = 'room-card__price';
    price.textContent = `$${hab.precio}`;

    footer.append(rating, price);
    body.append(title, middle, footer);
    card.append(img, body);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Configurar fechas por defecto con fecha local segura
  const hoyStr = SecurityUtils.getLocalDateString();
  const fechaSalidaObj = new Date();
  fechaSalidaObj.setDate(fechaSalidaObj.getDate() + 3);
  const salidaStr = SecurityUtils.getLocalDateString(fechaSalidaObj);

  const entradaInput = document.getElementById('fechaEntrada');
  const salidaInput = document.getElementById('fechaSalida');
  const huespedesSelect = document.getElementById('huespedes');

  if (entradaInput && salidaInput) {
    entradaInput.min = hoyStr;
    entradaInput.value = hoyStr;

    salidaInput.min = hoyStr;
    salidaInput.value = salidaStr;

    entradaInput.addEventListener('change', () => {
      salidaInput.min = entradaInput.value;
      if (salidaInput.value <= entradaInput.value) {
        const nuevaSalida = new Date(entradaInput.value + 'T00:00:00');
        nuevaSalida.setDate(nuevaSalida.getDate() + 1);
        salidaInput.value = SecurityUtils.getLocalDateString(nuevaSalida);
      }
    });
  }

  renderRooms(HotelData.habitaciones);

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entradaVal = entradaInput.value;
      const salidaVal = salidaInput.value;
      const personasVal = huespedesSelect.value;
      const feedback = document.getElementById('searchFeedback');

      if (salidaVal <= entradaVal) {
        feedback.textContent = 'La fecha de salida debe ser posterior a la fecha de entrada.';
        feedback.style.display = 'block';
        return;
      }
      feedback.style.display = 'none';

      sessionStorage.setItem('filtro_reserva', JSON.stringify({
        entrada: entradaVal,
        salida: salidaVal,
        personas: personasVal
      }));

      const filtradas = HotelData.filtrarPorHuespedes(personasVal);
      renderRooms(filtradas);
      UI.toast(`Búsqueda actualizada: ${filtradas.length} habitación(es) disponible(s).`, 'success');
    });
  }
});
