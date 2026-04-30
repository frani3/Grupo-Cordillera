import { KPI_MOCK } from '../../../mf-indicadores/src/mocks/kpiMock';

// Helper: Extract last 7 days from 90-day history
function getLast7Days(historico) {
  return historico.slice(-7).map(item => {
    const parts = item.fecha.split('/');
    return {
      fecha: parts.length === 3 ? `${parts[0]}/${parts[1]}` : item.fecha,
      valor: item.valor,
    };
  });
}

// Helper: Extract last 6 months from 90-day history (grouped by month)
function getMonthlyFromHistorico(historico) {
  const monthMap = {};

  historico.forEach(item => {
    const parts = item.fecha.split('/');
    if (parts.length === 3) {
      const monthKey = `${parts[1]}/${parts[2]}`;
      monthMap[monthKey] = item.valor;
    }
  });

  const monthNames = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
  };

  return Object.entries(monthMap)
    .slice(-6)
    .map(([monthKey, valor]) => {
      const [month] = monthKey.split('/');
      return { mes: monthNames[month] || month, valor };
    });
}

// Helper: Extract MS3 composed data (pedidos + OTD)
function getComposedDataMS3(historico) {
  const pedidosBase = [312, 287, 334, 418, 356, 298, 385];

  return historico.slice(-7).map((item, i) => {
    const parts = item.fecha.split('/');
    return {
      fecha: parts.length === 3 ? `${parts[0]}/${parts[1]}` : item.fecha,
      pedidos: pedidosBase[i],
      otd: item.valor,
    };
  });
}

// Delta calculations
function pDelta(arr) {
  return Number((arr.at(-1).valor - arr.at(0).valor).toFixed(1));
}

function clpDelta(monthly) {
  if (monthly.length < 2) return 0;
  return monthly.at(-1).valor - monthly.at(-2).valor;
}

// Circuit states (mirrors datosMock.js)
export const CIRCUIT_STATES = [
  { ms: 'MS1', label: 'Punto de Venta',      estado: 'CLOSED'    },
  { ms: 'MS2', label: 'Inventario',           estado: 'CLOSED'    },
  { ms: 'MS3', label: 'E-commerce',           estado: 'OPEN'      },
  { ms: 'MS4', label: 'Finanzas',             estado: 'HALF_OPEN' },
  { ms: 'MS5', label: 'Atención al Cliente',  estado: 'CLOSED'    },
];

export const INDICADORES_DATA = {
  MS1: {
    id: 'ms1',
    ms: 'MS1 · Punto de Venta',
    label: KPI_MOCK[0].nombre,
    valor: KPI_MOCK[0].valor,
    meta: KPI_MOCK[0].meta,
    umbralMin: KPI_MOCK[0].umbralMin,
    unidad: KPI_MOCK[0].unidad,
    invertido: KPI_MOCK[0].invertido,
    staleData: KPI_MOCK[0].staleData,
    timestamp: KPI_MOCK[0].timestampUltimoValor,
    delta: { value: pDelta(getLast7Days(KPI_MOCK[0].historico)), unit: 'pp' },
    historico7d: getLast7Days(KPI_MOCK[0].historico),
  },
  MS2: {
    id: 'ms2',
    ms: 'MS2 · Inventario',
    label: KPI_MOCK[1].nombre,
    valor: KPI_MOCK[1].valor,
    meta: KPI_MOCK[1].meta,
    umbralMin: KPI_MOCK[1].umbralMin,
    unidad: KPI_MOCK[1].unidad,
    invertido: KPI_MOCK[1].invertido,
    staleData: KPI_MOCK[1].staleData,
    timestamp: KPI_MOCK[1].timestampUltimoValor,
    delta: { value: pDelta(getLast7Days(KPI_MOCK[1].historico)), unit: 'pp' },
    historico7d: getLast7Days(KPI_MOCK[1].historico),
  },
  MS3: {
    id: 'ms3',
    ms: 'MS3 · E-commerce',
    label: KPI_MOCK[2].nombre,
    valor: KPI_MOCK[2].valor,
    meta: KPI_MOCK[2].meta,
    umbralMin: KPI_MOCK[2].umbralMin,
    unidad: KPI_MOCK[2].unidad,
    invertido: KPI_MOCK[2].invertido,
    staleData: KPI_MOCK[2].staleData,
    timestamp: KPI_MOCK[2].timestampUltimoValor,
    delta: { value: pDelta(getLast7Days(KPI_MOCK[2].historico)), unit: 'pp' },
    composedData: getComposedDataMS3(KPI_MOCK[2].historico),
  },
  MS4: {
    id: 'ms4',
    ms: 'MS4 · Finanzas',
    label: KPI_MOCK[3].nombre,
    valor: KPI_MOCK[3].valor,
    meta: KPI_MOCK[3].meta,
    umbralMin: KPI_MOCK[3].umbralMin,
    unidad: KPI_MOCK[3].unidad,
    invertido: KPI_MOCK[3].invertido,
    staleData: KPI_MOCK[3].staleData,
    timestamp: KPI_MOCK[3].timestampUltimoValor,
    delta: { value: clpDelta(getMonthlyFromHistorico(KPI_MOCK[3].historico)), unit: 'CLP' },
    historicoMensual: getMonthlyFromHistorico(KPI_MOCK[3].historico),
  },
  MS5: {
    id: 'ms5',
    ms: 'MS5 · Atención al Cliente',
    label: KPI_MOCK[4].nombre,
    valor: KPI_MOCK[4].valor,
    meta: KPI_MOCK[4].meta,
    umbralMin: KPI_MOCK[4].umbralMin,
    unidad: KPI_MOCK[4].unidad,
    invertido: KPI_MOCK[4].invertido,
    staleData: KPI_MOCK[4].staleData,
    timestamp: KPI_MOCK[4].timestampUltimoValor,
    delta: { value: pDelta(getLast7Days(KPI_MOCK[4].historico)), unit: 'pp' },
    historico7d: getLast7Days(KPI_MOCK[4].historico),
  },
};
