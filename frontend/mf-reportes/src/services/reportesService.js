import { generarReporteMock, obtenerReporteDetalleMock, obtenerReportesMock } from '../mocks/reportesMock';

export async function getReportes(tipo) {
  const reportes = obtenerReportesMock();

  if (!tipo || tipo === 'TODOS') {
    return reportes;
  }

  return reportes.filter((reporte) => reporte.tipo === tipo);
}

export async function generarReporte(tipo, parametros) {
  return generarReporteMock(tipo, parametros);
}

export async function getReporteDetalle(id) {
  return obtenerReporteDetalleMock(id);
}