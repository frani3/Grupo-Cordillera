function formatDate(date) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildHistorico({ targetValue, trend, amplitude, phase = 0, days = 90, decimals = 0, min, max }) {
  const today = new Date();
  const startingValue = targetValue - trend * (days - 1);
  const historial = [];

  for (let index = 0; index < days; index += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - (days - 1 - index));

    const oscillation =
      Math.sin(index / 4.7 + phase) * amplitude + Math.cos(index / 9.3 + phase) * (amplitude * 0.35);
    let valor = startingValue + trend * index + oscillation;

    if (typeof min === 'number') valor = Math.max(min, valor);
    if (typeof max === 'number') valor = Math.min(max, valor);
    if (index === days - 1) valor = targetValue;

    historial.push({
      fecha: formatDate(currentDate),
      fechaCompleta: formatTime(currentDate),
      valor: decimals > 0 ? Number(valor.toFixed(decimals)) : Math.round(valor),
    });
  }

  return historial;
}

// MS1 · Ventas — % Cumplimiento de Meta (valor actual / meta ventas)
const cumplimientoHistorico = buildHistorico({
  targetValue: 83.3,
  trend: 0.08,
  amplitude: 4.5,
  phase: 0.8,
  decimals: 1,
  min: 52,
  max: 101,
});

// MS2 · Inventario — % Quiebre de Stock (SKUs sin stock / total SKUs)
// Métrica invertida: menor es mejor. Meta ≤ 2 %, crítico > 7 %
const quiebreStockHistorico = buildHistorico({
  targetValue: 4.2,
  trend: -0.01,
  amplitude: 0.9,
  phase: 1.4,
  decimals: 1,
  min: 1.0,
  max: 9.8,
});

// MS3 · E-commerce — % Despachos a Tiempo (OTD)
const otdHistorico = buildHistorico({
  targetValue: 91.5,
  trend: 0.06,
  amplitude: 2.2,
  phase: 2.1,
  decimals: 1,
  min: 75,
  max: 99,
});

// MS4 · Finanzas — EBITDA Mensual (CLP)
const ebitdaHistorico = buildHistorico({
  targetValue: 48500000,
  trend: 95000,
  amplitude: 3600000,
  phase: 0.3,
  min: 18000000,
  max: 70000000,
});

// MS5 · Atención al Cliente — Tasa de Resolución en Primer Contacto
const tasaResolucionHistorico = buildHistorico({
  targetValue: 87.3,
  trend: 0.05,
  amplitude: 1.9,
  phase: 1.7,
  decimals: 1,
  min: 70,
  max: 98,
});

export const KPI_MOCK = [
  {
    id: 'cumplimiento-meta',
    nombre: '% Cumplimiento Meta',
    microservicio: 'MS1 · Ventas',
    valor: 83.3,
    meta: 100,
    umbralMin: 70,
    umbralMax: 100,
    unidad: '%',
    invertido: false,
    staleData: false,
    timestampUltimoValor: cumplimientoHistorico.at(-1)?.fechaCompleta ?? '',
    historico: cumplimientoHistorico,
  },
  {
    id: 'quiebre-stock',
    nombre: '% Quiebre de Stock',
    microservicio: 'MS2 · Inventario',
    valor: 4.2,
    meta: 2,      // óptimo: ≤ 2 %
    umbralMin: 7, // crítico: > 7 %  (umbralMin reutilizado como umbral crítico para invertido)
    umbralMax: 15,
    unidad: '%',
    invertido: true,
    staleData: false,
    timestampUltimoValor: quiebreStockHistorico.at(-1)?.fechaCompleta ?? '',
    historico: quiebreStockHistorico,
  },
  {
    id: 'otd-ecommerce',
    nombre: '% Despachos a Tiempo',
    microservicio: 'MS3 · E-commerce',
    valor: 91.5,
    meta: 95,
    umbralMin: 85,
    umbralMax: 100,
    unidad: '%',
    invertido: false,
    staleData: true,
    timestampUltimoValor: otdHistorico.at(-1)?.fechaCompleta ?? '',
    historico: otdHistorico,
  },
  {
    id: 'ebitda-mensual',
    nombre: 'EBITDA Mensual',
    microservicio: 'MS4 · Finanzas',
    valor: 48500000,
    meta: 55000000,
    umbralMin: 35000000,
    umbralMax: 80000000,
    unidad: 'CLP',
    invertido: false,
    staleData: true,
    timestampUltimoValor: ebitdaHistorico.at(-1)?.fechaCompleta ?? '',
    historico: ebitdaHistorico,
  },
  {
    id: 'tasa-resolucion',
    nombre: 'Tasa de Resolución',
    microservicio: 'MS5 · Atención',
    valor: 87.3,
    meta: 90,
    umbralMin: 80,
    umbralMax: 100,
    unidad: '%',
    invertido: false,
    staleData: false,
    timestampUltimoValor: tasaResolucionHistorico.at(-1)?.fechaCompleta ?? '',
    historico: tasaResolucionHistorico,
  },
];