import { KPI_MOCK } from '../mocks/kpiMock';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export async function getDashboard() {
  return clone({ kpis: KPI_MOCK });
}

export async function getHistorico(kpiId, dias) {
  const kpi = KPI_MOCK.find((item) => item.id === kpiId);

  if (!kpi) {
    throw new Error('KPI not found');
  }

  const cantidadDias = [7, 30, 90].includes(dias) ? dias : 30;
  const historico = kpi.historico.slice(-cantidadDias);

  return clone({
    kpi,
    historico,
  });
}