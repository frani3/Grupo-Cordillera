import { KPI_MOCK } from '../mocks/kpiMock';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// In-memory cache — mock data is static so TTL is not needed
const _cache = new Map();

export async function getDashboard() {
  if (_cache.has('dashboard')) return _cache.get('dashboard');
  const data = clone({ kpis: KPI_MOCK });
  _cache.set('dashboard', data);
  return data;
}

export async function getHistorico(kpiId, dias) {
  const key = `hist:${kpiId}:${dias}`;
  if (_cache.has(key)) return _cache.get(key);

  const kpi = KPI_MOCK.find((item) => item.id === kpiId);
  if (!kpi) throw new Error(`KPI not found: ${kpiId}`);

  const cantidadDias = [7, 30, 90].includes(dias) ? dias : 30;
  const result = clone({ kpi, historico: kpi.historico.slice(-cantidadDias) });
  _cache.set(key, result);
  return result;
}
