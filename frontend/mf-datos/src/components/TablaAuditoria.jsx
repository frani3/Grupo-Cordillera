import React, { useMemo, useState } from 'react';
import { auditoriaMock } from '../mocks/datosMock';

const tipoStyles = {
  ERROR: 'bg-danger/10 text-danger border-danger/20',
  CAMBIO_UMBRAL: 'bg-warning/10 text-warning border-warning/20',
};

function parseTimestamp(timestamp) {
  const [datePart, timePart] = timestamp.split(' ');
  return new Date(`${datePart}T${timePart || '00:00'}:00`);
}

function csvEscape(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function formatForCsv(evento) {
  return [evento.tipoEvento, evento.origen, evento.descripcion, evento.timestamp].map(csvEscape).join(',');
}

export default function TablaAuditoria({ rolUsuario }) {
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const eventosFiltrados = useMemo(() => {
    if (rolUsuario !== 'ADMINISTRADOR') {
      return [];
    }

    return auditoriaMock.filter((evento) => {
      const fechaEvento = parseTimestamp(evento.timestamp);
      const cumpleTipo = tipoFiltro === 'TODOS' || evento.tipoEvento === tipoFiltro;
      const cumpleDesde = !desde || fechaEvento >= new Date(`${desde}T00:00:00`);
      const cumpleHasta = !hasta || fechaEvento <= new Date(`${hasta}T23:59:59`);

      return cumpleTipo && cumpleDesde && cumpleHasta;
    });
  }, [tipoFiltro, desde, hasta]);

  const exportarCsv = () => {
    const encabezado = ['Tipo de evento', 'Origen', 'Descripción', 'Timestamp'];
    const lineas = [encabezado.map(csvEscape).join(','), ...eventosFiltrados.map(formatForCsv)];
    const blob = new Blob([lineas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'auditoria_tecnica.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  if (rolUsuario !== 'ADMINISTRADOR') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-40">
          Tipo de evento
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODOS">Todos</option>
            <option value="ERROR">ERROR</option>
            <option value="CAMBIO_UMBRAL">CAMBIO_UMBRAL</option>
          </select>
        </label>

        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-36">
          Desde
          <input
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-36">
          Hasta
          <input
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={exportarCsv}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tipo de evento</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Origen</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Timestamp</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id} className="align-top border-b border-gray-50 transition-colors hover:bg-blue-50/30">
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tipoStyles[evento.tipoEvento] || tipoStyles.ERROR}`}>
                      {evento.tipoEvento}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{evento.origen}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{evento.descripcion}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{evento.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No se encontraron eventos para los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}