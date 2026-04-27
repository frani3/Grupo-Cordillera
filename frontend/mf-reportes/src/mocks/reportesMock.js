const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const SHORT_MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const USUARIOS = [
  'analista.cordillera@grupocordillera.cl',
  'reportes.finanzas@grupocordillera.cl',
  'gestor.comercial@grupocordillera.cl',
];

let reportesMock = [
  {
    id: 'rep-001',
    tipo: 'RESUMEN_MENSUAL',
    periodo: 'Abril 2026',
    fechaGeneracion: new Date('2026-04-26T08:20:00').toISOString(),
    usuarioQueGenero: USUARIOS[0],
    datos: {
      ventasTotales: 284500000,
      variacionInventario: 4.2,
      ticketPromedio: 28750,
      comparacionMesAnterior: {
        ventasTotales: 262800000,
        variacionInventario: 5.1,
        ticketPromedio: 27400,
      },
      estadoGeneral: 'Tendencia positiva',
    },
  },
  {
    id: 'rep-002',
    tipo: 'COMPARATIVO_HISTORICO',
    periodo: 'Ene 2026 vs Feb 2026',
    fechaGeneracion: new Date('2026-04-23T10:15:00').toISOString(),
    usuarioQueGenero: USUARIOS[1],
    datos: {
      periodo1: 'Enero 2026',
      periodo2: 'Febrero 2026',
      kpis: [
        { nombre: 'Ventas netas', valorPeriodo1: 241000000, valorPeriodo2: 258400000, diferenciaAbsoluta: 17400000, diferenciaPorcentual: 7.22 },
        { nombre: 'Pedidos confirmados', valorPeriodo1: 1420, valorPeriodo2: 1498, diferenciaAbsoluta: 78, diferenciaPorcentual: 5.49 },
        { nombre: 'Ticket promedio', valorPeriodo1: 26900, valorPeriodo2: 27650, diferenciaAbsoluta: 750, diferenciaPorcentual: 2.79 },
        { nombre: 'Margen operativo', valorPeriodo1: 18.4, valorPeriodo2: 19.7, diferenciaAbsoluta: 1.3, diferenciaPorcentual: 7.07 },
      ],
    },
  },
  {
    id: 'rep-003',
    tipo: 'RESUMEN_MENSUAL',
    periodo: 'Marzo 2026',
    fechaGeneracion: new Date('2026-04-18T09:40:00').toISOString(),
    usuarioQueGenero: USUARIOS[2],
    datos: {
      ventasTotales: 267900000,
      variacionInventario: 5.8,
      ticketPromedio: 27900,
      comparacionMesAnterior: {
        ventasTotales: 255100000,
        variacionInventario: 6.4,
        ticketPromedio: 27150,
      },
      estadoGeneral: 'Estable',
    },
  },
  {
    id: 'rep-004',
    tipo: 'COMPARATIVO_HISTORICO',
    periodo: 'Feb 2026 vs Mar 2026',
    fechaGeneracion: new Date('2026-04-12T14:30:00').toISOString(),
    usuarioQueGenero: USUARIOS[0],
    datos: {
      periodo1: 'Febrero 2026',
      periodo2: 'Marzo 2026',
      kpis: [
        { nombre: 'Ventas netas', valorPeriodo1: 258400000, valorPeriodo2: 267900000, diferenciaAbsoluta: 9500000, diferenciaPorcentual: 3.68 },
        { nombre: 'Pedidos confirmados', valorPeriodo1: 1498, valorPeriodo2: 1555, diferenciaAbsoluta: 57, diferenciaPorcentual: 3.81 },
        { nombre: 'Ticket promedio', valorPeriodo1: 27650, valorPeriodo2: 28120, diferenciaAbsoluta: 470, diferenciaPorcentual: 1.7 },
        { nombre: 'Margen operativo', valorPeriodo1: 19.7, valorPeriodo2: 18.9, diferenciaAbsoluta: -0.8, diferenciaPorcentual: -4.06 },
      ],
    },
  },
  {
    id: 'rep-005',
    tipo: 'RESUMEN_MENSUAL',
    periodo: 'Febrero 2026',
    fechaGeneracion: new Date('2026-04-05T11:10:00').toISOString(),
    usuarioQueGenero: USUARIOS[1],
    datos: {
      ventasTotales: 255100000,
      variacionInventario: 6.4,
      ticketPromedio: 27150,
      comparacionMesAnterior: {
        ventasTotales: 248900000,
        variacionInventario: 7.1,
        ticketPromedio: 26600,
      },
      estadoGeneral: 'Controlado',
    },
  },
  {
    id: 'rep-006',
    tipo: 'COMPARATIVO_HISTORICO',
    periodo: 'Mar 2026 vs Abr 2026',
    fechaGeneracion: new Date('2026-04-01T15:55:00').toISOString(),
    usuarioQueGenero: USUARIOS[2],
    datos: {
      periodo1: 'Marzo 2026',
      periodo2: 'Abril 2026',
      kpis: [
        { nombre: 'Ventas netas', valorPeriodo1: 267900000, valorPeriodo2: 284500000, diferenciaAbsoluta: 16600000, diferenciaPorcentual: 6.2 },
        { nombre: 'Pedidos confirmados', valorPeriodo1: 1555, valorPeriodo2: 1628, diferenciaAbsoluta: 73, diferenciaPorcentual: 4.7 },
        { nombre: 'Ticket promedio', valorPeriodo1: 28120, valorPeriodo2: 28750, diferenciaAbsoluta: 630, diferenciaPorcentual: 2.24 },
        { nombre: 'Margen operativo', valorPeriodo1: 18.9, valorPeriodo2: 19.4, diferenciaAbsoluta: 0.5, diferenciaPorcentual: 2.65 },
      ],
    },
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sortByRecent(reportes) {
  return [...reportes].sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());
}

function hashText(text) {
  return String(text)
    .split('')
    .reduce((accumulator, character) => (accumulator * 31 + character.charCodeAt(0)) % 100000, 7);
}

function currencyValue(seed, base, spread) {
  return base + (seed % spread);
}

function formatDateLabel(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const monthName = SHORT_MONTH_NAMES[date.getMonth()] || '';
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

function formatRangeLabel(desde, hasta) {
  return `${formatDateLabel(desde)} - ${formatDateLabel(hasta)}`;
}

function createResumenMock(periodo, usuarioQueGenero) {
  const seed = hashText(periodo);
  const ventasTotales = currencyValue(seed, 240000000, 65000000);
  const comparacionVentas = ventasTotales - (6500000 + (seed % 3500000));
  const variacionInventario = Number((3.2 + (seed % 30) / 10).toFixed(1));
  const variacionAnterior = Number(Math.max(1.2, variacionInventario + 0.8).toFixed(1));
  const ticketPromedio = currencyValue(seed + 11, 25200, 6200);
  const ticketAnterior = ticketPromedio - (550 + (seed % 700));

  return {
    id: `rep-${Date.now()}`,
    tipo: 'RESUMEN_MENSUAL',
    periodo,
    fechaGeneracion: new Date().toISOString(),
    usuarioQueGenero,
    datos: {
      ventasTotales,
      variacionInventario,
      ticketPromedio,
      comparacionMesAnterior: {
        ventasTotales: comparacionVentas,
        variacionInventario: variacionAnterior,
        ticketPromedio: ticketAnterior,
      },
      estadoGeneral: ventasTotales >= comparacionVentas ? 'Tendencia positiva' : 'En revisión',
    },
  };
}

function createComparativoMock(parametros = {}, usuarioQueGenero) {
  const periodo1Desde = parametros.periodo1Desde || '2026-01-01';
  const periodo1Hasta = parametros.periodo1Hasta || '2026-01-31';
  const periodo2Desde = parametros.periodo2Desde || '2026-02-01';
  const periodo2Hasta = parametros.periodo2Hasta || '2026-02-28';
  const seed = hashText(`${periodo1Desde}|${periodo1Hasta}|${periodo2Desde}|${periodo2Hasta}`);

  const kpisBase = [
    { nombre: 'Ventas netas', base: 236000000, spread: 58000000 },
    { nombre: 'Pedidos confirmados', base: 1320, spread: 420 },
    { nombre: 'Ticket promedio', base: 25400, spread: 5200 },
    { nombre: 'Margen operativo', base: 17.5, spread: 4.2 },
  ];

  const kpis = kpisBase.map((kpi, index) => {
    const valorPeriodo1 = kpi.nombre === 'Margen operativo'
      ? Number((kpi.base + ((seed + index * 7) % 1000) / 200).toFixed(1))
      : Math.round(kpi.base + ((seed + index * 13) % kpi.spread));
    const variacion = ((seed + index * 17) % 21) - 7;
    const multiplicador = 1 + variacion / 100;
    const valorPeriodo2 = kpi.nombre === 'Margen operativo'
      ? Number(Math.max(0, valorPeriodo1 * multiplicador).toFixed(1))
      : Math.round(valorPeriodo1 * multiplicador);
    const diferenciaAbsoluta = Number((valorPeriodo2 - valorPeriodo1).toFixed(1));
    const diferenciaPorcentual = Number((((valorPeriodo2 - valorPeriodo1) / valorPeriodo1) * 100).toFixed(2));

    return {
      nombre: kpi.nombre,
      valorPeriodo1,
      valorPeriodo2,
      diferenciaAbsoluta,
      diferenciaPorcentual,
    };
  });

  return {
    id: `rep-${Date.now()}`,
    tipo: 'COMPARATIVO_HISTORICO',
    periodo: `${formatRangeLabel(periodo1Desde, periodo1Hasta)} vs ${formatRangeLabel(periodo2Desde, periodo2Hasta)}`,
    fechaGeneracion: new Date().toISOString(),
    usuarioQueGenero,
    datos: {
      periodo1: formatRangeLabel(periodo1Desde, periodo1Hasta),
      periodo2: formatRangeLabel(periodo2Desde, periodo2Hasta),
      kpis,
    },
  };
}

export function obtenerReportesMock() {
  return clone(sortByRecent(reportesMock));
}

export function obtenerReporteDetalleMock(id) {
  return clone(reportesMock.find((reporte) => reporte.id === id) || null);
}

export function generarReporteMock(tipo, parametros = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const usuarioQueGenero = parametros.usuarioQueGenero || USUARIOS[0];
        const reporte =
          tipo === 'RESUMEN_MENSUAL'
            ? createResumenMock(`${MONTH_NAMES[parametros.mes - 1] || MONTH_NAMES[0]} ${parametros.anio || 2026}`, usuarioQueGenero)
            : createComparativoMock(parametros, usuarioQueGenero);

        reportesMock = sortByRecent([reporte, ...reportesMock]);
        resolve(clone(reporte));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('No se pudo generar el reporte'));
      }
    }, 1500);
  });
}