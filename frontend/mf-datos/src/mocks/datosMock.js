const fuentes = ['POS', 'INVENTARIO', 'ECOMMERCE', 'FINANZAS', 'CLIENTES'];

const currentDate = new Date('2026-04-26T12:00:00');

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function formatTimestamp(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function subtractDays(days) {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - days);
  return date;
}

const resumenPorFuente = {
  POS: [
    { producto: 'Notebook Pro', monto: 1299000, sucursal: 'Santiago Centro' },
    { producto: 'Mouse Ergonómico', monto: 24990, sucursal: 'Providencia' },
    { producto: 'Monitor 27"', monto: 189900, sucursal: 'Las Condes' },
    { producto: 'Teclado Mecánico', monto: 89990, sucursal: 'Viña del Mar' },
    { producto: 'Docking Station', monto: 149990, sucursal: 'Santiago Centro' },
  ],
  INVENTARIO: [
    { producto: 'Notebook Pro', stock: 18, bodega: 'Bodega Norte' },
    { producto: 'Mouse Ergonómico', stock: 240, bodega: 'Bodega Central' },
    { producto: 'Monitor 27"', stock: 34, bodega: 'Bodega Sur' },
    { producto: 'Teclado Mecánico', stock: 67, bodega: 'Bodega Norte' },
    { producto: 'Docking Station', stock: 12, bodega: 'Bodega Central' },
  ],
  ECOMMERCE: [
    { pedido: 'EC-20481', total: 459900, canal: 'Web' },
    { pedido: 'EC-20482', total: 89990, canal: 'Marketplace' },
    { pedido: 'EC-20483', total: 129900, canal: 'Web' },
    { pedido: 'EC-20484', total: 24990, canal: 'App' },
    { pedido: 'EC-20485', total: 189900, canal: 'Web' },
  ],
  FINANZAS: [
    { cuenta: 'Ventas Q2', monto: 18500000, centroCosto: 'Comercial' },
    { cuenta: 'Marketing', monto: 2450000, centroCosto: 'Branding' },
    { cuenta: 'Operaciones', monto: 7320000, centroCosto: 'Logística' },
    { cuenta: 'Soporte', monto: 1190000, centroCosto: 'Atención' },
    { cuenta: 'TI', monto: 4180000, centroCosto: 'Infraestructura' },
  ],
  CLIENTES: [
    { cliente: 'Compañía Andina', segmento: 'Corporativo', estado: 'Activo' },
    { cliente: 'Retail Sur', segmento: 'PyME', estado: 'Activo' },
    { cliente: 'Consultora Norte', segmento: 'Enterprise', estado: 'En riesgo' },
    { cliente: 'Clínica Centro', segmento: 'Salud', estado: 'Activo' },
    { cliente: 'Universidad Cordillera', segmento: 'Educación', estado: 'Activo' },
  ],
};

export const registrosMock = fuentes.flatMap((fuente, fuenteIndex) =>
  Array.from({ length: 5 }, (_, registroIndex) => {
    const diasRestantes = fuenteIndex * 9 + registroIndex * 4 + 3;
    return {
      id: `${fuente.toLowerCase()}-${registroIndex + 1}`,
      fuente,
      fechaCaptura: toDateString(subtractDays(diasRestantes)),
      resumen: resumenPorFuente[fuente][registroIndex],
    };
  })
).sort((a, b) => (a.fechaCaptura < b.fechaCaptura ? 1 : -1));

export const estadoCircuitosMock = [
  {
    sistema: 'POS',
    ms: 'MS1',
    estado: 'CLOSED',
    ultimoEventoExitoso: formatTimestamp(subtractDays(1)),
    fallasConsecutivas: 0,
  },
  {
    sistema: 'INVENTARIO',
    ms: 'MS2',
    estado: 'CLOSED',
    ultimoEventoExitoso: formatTimestamp(subtractDays(2)),
    fallasConsecutivas: 0,
  },
  {
    sistema: 'ECOMMERCE',
    ms: 'MS3',
    estado: 'OPEN',
    ultimoEventoExitoso: formatTimestamp(subtractDays(5)),
    fallasConsecutivas: 4,
  },
  {
    sistema: 'FINANZAS',
    ms: 'MS4',
    estado: 'HALF_OPEN',
    ultimoEventoExitoso: formatTimestamp(subtractDays(1)),
    fallasConsecutivas: 1,
  },
  {
    sistema: 'CLIENTES',
    ms: 'MS5',
    estado: 'CLOSED',
    ultimoEventoExitoso: formatTimestamp(subtractDays(3)),
    fallasConsecutivas: 0,
  },
];

export const auditoriaMock = [
  {
    id: 'audit-1',
    tipoEvento: 'ERROR',
    origen: 'MS3 - ECOMMERCE',
    descripcion: 'Timeout al sincronizar pedidos con el bus de eventos',
    timestamp: formatTimestamp(subtractDays(2)),
  },
  {
    id: 'audit-2',
    tipoEvento: 'CAMBIO_UMBRAL',
    origen: 'MS1 - POS',
    descripcion: 'Umbral de alerta ajustado por campaña comercial',
    timestamp: formatTimestamp(subtractDays(4)),
  },
  {
    id: 'audit-3',
    tipoEvento: 'ERROR',
    origen: 'MS2 - INVENTARIO',
    descripcion: 'Reintentos agotados al consultar stock consolidado',
    timestamp: formatTimestamp(subtractDays(7)),
  },
  {
    id: 'audit-4',
    tipoEvento: 'CAMBIO_UMBRAL',
    origen: 'MS4 - FINANZAS',
    descripcion: 'Se elevó el umbral mínimo para conciliación financiera',
    timestamp: formatTimestamp(subtractDays(9)),
  },
  {
    id: 'audit-5',
    tipoEvento: 'ERROR',
    origen: 'MS5 - CLIENTES',
    descripcion: 'Fallo al registrar un cliente en el servicio de integración',
    timestamp: formatTimestamp(subtractDays(12)),
  },
  {
    id: 'audit-6',
    tipoEvento: 'CAMBIO_UMBRAL',
    origen: 'MS3 - ECOMMERCE',
    descripcion: 'Ajuste temporal de tolerancia por alta demanda',
    timestamp: formatTimestamp(subtractDays(15)),
  },
  {
    id: 'audit-7',
    tipoEvento: 'ERROR',
    origen: 'MS1 - POS',
    descripcion: 'Datos duplicados detectados en el canal de cajas',
    timestamp: formatTimestamp(subtractDays(18)),
  },
  {
    id: 'audit-8',
    tipoEvento: 'CAMBIO_UMBRAL',
    origen: 'MS2 - INVENTARIO',
    descripcion: 'Cambio de sensibilidad luego de normalizar stock',
    timestamp: formatTimestamp(subtractDays(21)),
  },
  {
    id: 'audit-9',
    tipoEvento: 'ERROR',
    origen: 'MS4 - FINANZAS',
    descripcion: 'Respuesta inválida durante conciliación con ERP',
    timestamp: formatTimestamp(subtractDays(24)),
  },
];