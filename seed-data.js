// Datos reales de producción, migrados desde el catálogo Mobihub que corría
// como Claude Artifact. Se usan una única vez para poblar Firestore la
// primera vez que se conecta la app (ver ensureSeed() en index.html).
// No son datos de ejemplo: son el catálogo y las reservas reales cargadas
// por el equipo al 14/09/2026.
(function(){
  "use strict";

  var DEFAULT_DEPOSITO_ID = 'deposito-martinez';

  var SEED_DEPOSITOS = [
    { id: 'deposito-martinez', name: 'Depósito Martínez', address: '' }
  ];

  var SEED_ITEMS = [
    { id: 'carpa-6x6', name: 'Carpa 6x6m', unit: 'unidades', description: 'Carpa para eventos Premium', details: '6 Metros de ancho y lado\n3 metros de altura\nIdeal para experior invierno o verano' },
    { id: 'mantel-blanco-3m', name: 'Mantel blanco 3m', unit: 'unidades' },
    { id: 'mesa-rectangular-8', name: 'Mesa rectangular (8 personas)', unit: 'unidades' },
    { id: 'mesa-redonda-10', name: 'Mesa redonda (10 personas)', unit: 'unidades' },
    { id: 'pista-baile-modulo', name: 'Pista de baile (módulo 1x1m)', unit: 'módulos' },
    { id: 'silla-chiavari-dorada', name: 'Silla Chiavari dorada', unit: 'unidades' },
    { id: 'silla-tiffany-blanca', name: 'Silla Tiffany blanca', unit: 'unidades' },
    { id: 'vajilla-set-x10', name: 'Vajilla completa (set x10)', unit: 'sets' }
  ];

  // total = stock real por depósito al momento de la migración.
  var SEED_STOCK = [
    { itemId: 'carpa-6x6', depositoId: DEFAULT_DEPOSITO_ID, total: 6, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'mantel-blanco-3m', depositoId: DEFAULT_DEPOSITO_ID, total: 60, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'mesa-rectangular-8', depositoId: DEFAULT_DEPOSITO_ID, total: 28, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'mesa-redonda-10', depositoId: DEFAULT_DEPOSITO_ID, total: 35, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'pista-baile-modulo', depositoId: DEFAULT_DEPOSITO_ID, total: 64, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'silla-chiavari-dorada', depositoId: DEFAULT_DEPOSITO_ID, total: 120, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'silla-tiffany-blanca', depositoId: DEFAULT_DEPOSITO_ID, total: 220, enRevision: 0, enLimpieza: 0, danado: 0 },
    { itemId: 'vajilla-set-x10', depositoId: DEFAULT_DEPOSITO_ID, total: 40, enRevision: 0, enLimpieza: 0, danado: 0 }
  ];

  var SEED_RESERVATIONS = [
    { id: 'res-aniversario-perez', event: 'Aniversario de bodas Pérez', client: 'Jorge y Susana Pérez', address: 'Club Náutico, Tigre', start: '2026-09-14', end: '2026-09-15', status: 'pendiente', depositoId: DEFAULT_DEPOSITO_ID, items: [{itemId:'carpa-6x6',qty:2},{itemId:'silla-chiavari-dorada',qty:80},{itemId:'vajilla-set-x10',qty:8}], notes: '', createdBy: 'Equipo' },
    { id: 'res-casamiento-lopez', event: 'Casamiento Lopez–Ferreyra', client: 'Familia Lopez', address: 'Salón Terrazas del Sol, San Isidro', start: '2026-09-07', end: '2026-09-08', status: 'confirmada', depositoId: DEFAULT_DEPOSITO_ID, items: [{itemId:'silla-chiavari-dorada',qty:150},{itemId:'mesa-redonda-10',qty:15},{itemId:'mantel-blanco-3m',qty:15},{itemId:'vajilla-set-x10',qty:15}], notes: 'Entrega viernes 14hs, retiro domingo 10hs.', createdBy: 'Equipo' },
    { id: 'res-corp-globex', event: 'Evento corporativo Globex', client: 'Globex S.A.', address: 'Centro de Convenciones, CABA', start: '2026-09-02', end: '2026-09-03', status: 'devuelta', depositoId: DEFAULT_DEPOSITO_ID, items: [{itemId:'mesa-rectangular-8',qty:20},{itemId:'mantel-blanco-3m',qty:20}], notes: 'Devuelto completo, sin faltantes.', createdBy: 'Equipo' },
    { id: 'res-cumple-ruiz', event: 'Cumpleaños infantil Ruiz', client: 'Fernanda Ruiz', address: 'Domicilio particular, Martínez', start: '2026-09-12', end: '2026-09-12', status: 'pendiente', depositoId: DEFAULT_DEPOSITO_ID, items: [{itemId:'silla-tiffany-blanca',qty:40},{itemId:'mesa-redonda-10',qty:5}], notes: 'Confirmar seña antes del retiro.', createdBy: 'Equipo' },
    { id: 'res-cumple15-mendez', event: 'Fiesta de 15 — Martina Méndez', client: 'Familia Méndez', address: 'Quinta Los Aromos, Pilar', start: '2026-09-04', end: '2026-09-05', status: 'en_evento', depositoId: DEFAULT_DEPOSITO_ID, items: [{itemId:'silla-tiffany-blanca',qty:180},{itemId:'pista-baile-modulo',qty:36},{itemId:'mesa-redonda-10',qty:5}], notes: 'Retirado hoy a la mañana.', createdBy: 'Equipo' }
  ];

  // Nota: las 2 fotos reales de la carpa 6x6 (cargadas el 14/09) no se
  // migran automáticamente acá — son ~500KB de datos cada una y no vale la
  // pena inflar este archivo con eso. Se vuelven a subir a mano una vez
  // desde la ficha del producto en la app nueva (30 segundos, ver README).
  var SEED_PHOTOS = {};

  window.MOBIHUB_SEED = {
    DEFAULT_DEPOSITO_ID: DEFAULT_DEPOSITO_ID,
    depositos: SEED_DEPOSITOS,
    items: SEED_ITEMS,
    stock: SEED_STOCK,
    reservations: SEED_RESERVATIONS,
    photos: SEED_PHOTOS
  };
})();
