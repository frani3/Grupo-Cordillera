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

    const oscillation = Math.sin(index / 4.7 + phase) * amplitude + Math.cos(index / 9.3 + phase) * (amplitude * 0.35);
    let valor = startingValue + trend * index + oscillation;

    if (typeof min === 'number') {
      valor = Math.max(min, valor);
    }

    if (typeof max === 'number') {
      valor = Math.min(max, valor);
    }

    if (index === days - 1) {
      valor = targetValue;
    }

    const parsedValue = decimals > 0 ? Number(valor.toFixed(decimals)) : Math.round(valor);

    historial.push({
      fecha: formatDate(currentDate),
      fechaCompleta: formatTime(currentDate),
      valor: parsedValue,
    });
  }

  return historial;
}

const ventasHistorico = buildHistorico({
  targetValue: 1250000,
  trend: 2100,
  amplitude: 38000,
  phase: 0.8,
  min: 700000,
  max: 2050000,
});

const inventarioHistorico = buildHistorico({
  targetValue: -12,
  trend: 0.03,
  amplitude: 2.6,
  phase: 1.4,
  min: -22,
  max: 14,
});

const ticketHistorico = buildHistorico({
  targetValue: 85000,
  trend: 160,
  amplitude: 2600,
  phase: 2.1,
  min: 45000,
  max: 155000,
});

export const KPI_MOCK = [
  {
    id: 'ventas-totales',
    nombre: 'Ventas Totales',
    valor: 1250000,
    meta: 1500000,
    umbralMin: 800000,
    umbralMax: 2000000,
    unidad: 'CLP',
    staleData: false,
    timestampUltimoValor: ventasHistorico[ventasHistorico.length - 1]?.fechaCompleta ?? '',
    historico: ventasHistorico,
    historico30dias: ventasHistorico.slice(-30),
  },
  {
    id: 'variacion-inventario',
    nombre: 'Variación de Inventario',
    valor: -12,
    meta: 0,
    umbralMin: -20,
    umbralMax: 10,
    unidad: '%',
    staleData: true,
    timestampUltimoValor: inventarioHistorico[inventarioHistorico.length - 1]?.fechaCompleta ?? '',
    historico: inventarioHistorico,
    historico30dias: inventarioHistorico.slice(-30),
  },
  {
    id: 'ticket-promedio',
    nombre: 'Ticket Promedio',
    valor: 85000,
    meta: 75000,
    umbralMin: 50000,
    umbralMax: 150000,
    unidad: 'CLP',
    staleData: false,
    timestampUltimoValor: ticketHistorico[ticketHistorico.length - 1]?.fechaCompleta ?? '',
    historico: ticketHistorico,
    historico30dias: ticketHistorico.slice(-30),
  },
];