/**
 * Catálogo Centralizado y Fuente Única de Verdad (Single Source of Truth)
 * Gestiona el inventario de habitaciones, amenidades y servicios adicionales.
 */
const HotelData = {
  habitaciones: [
    {
      id: 'suite',
      titulo: 'Suite Presidencial',
      descripcion: 'Habitación amplia de alta gama con sala de estar independiente, cama King Size, balcón con vista panorámica y amenidades ejecutivas.',
      precio: 50,
      rating: 4.8,
      opinionesCount: 24,
      capacidadMaxima: 4,
      imagen: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
      servicios: [
        'Wi-Fi de ultra alta velocidad',
        'Aire acondicionado climatizado',
        'Desayuno americano buffet',
        'Smart TV 55" con streaming',
        'Caja fuerte digital',
        'Bañera de hidromasaje privada',
        'Servicio a la habitación 24/7'
      ]
    },
    {
      id: 'doble',
      titulo: 'Habitación Doble Deluxe',
      descripcion: 'Dos camas semidobles confortables, iluminación cálida, escritorio ejecutivo y espacio óptimo para familias o viajes corporativos.',
      precio: 40,
      rating: 4.6,
      opinionesCount: 18,
      capacidadMaxima: 3,
      imagen: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
      servicios: [
        'Wi-Fi de alta velocidad',
        'Aire acondicionado',
        'Desayuno americano incluido',
        'Smart TV 43"',
        'Caja fuerte digital',
        'Acceso a piscina y zonas húmedas'
      ]
    },
    {
      id: 'individual',
      titulo: 'Habitación Individual Estándar',
      descripcion: 'Espacio acogedor y moderno equipado con cama doble, escritorio ergonómico de trabajo y conectividad de máxima velocidad.',
      precio: 30,
      rating: 4.5,
      opinionesCount: 15,
      capacidadMaxima: 2,
      imagen: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
      servicios: [
        'Wi-Fi de alta velocidad',
        'Aire acondicionado',
        'Escritorio con lámpara de trabajo',
        'Smart TV 32"',
        'Caja fuerte digital'
      ]
    }
  ],

  serviciosExtra: [
    { id: 'transporte', nombre: 'Transporte Aeropuerto - Hotel', precio: 20 },
    { id: 'spa', nombre: 'Acceso Completo a Spa & Sauna', precio: 15 },
    { id: 'cena', nombre: 'Cena Gourmet en la Habitación', precio: 30 },
    { id: 'tour', nombre: 'Paseo Turístico por la Ciudad', precio: 25 }
  ],

  // Obtiene una habitación por ID (o fallback a la primera)
  getHabitacion(id) {
    if (!id) return this.habitaciones[0];
    const found = this.habitaciones.find(h => h.id.toLowerCase() === String(id).toLowerCase());
    return found || this.habitaciones[0];
  },

  // Filtra habitaciones por capacidad mínima requerida
  filtrarPorHuespedes(cantidadPersonas) {
    const cant = parseInt(cantidadPersonas, 10) || 1;
    return this.habitaciones.filter(h => h.capacidadMaxima >= cant);
  }
};
