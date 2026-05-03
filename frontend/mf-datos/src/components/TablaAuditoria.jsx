import React, { useMemo, useState } from 'react';
import { auditoriaMock } from '../mocks/datosMock';

const BADGE = {
  ERROR:         'bg-red-50   text-red-600   ring-1 ring-red-200',
  CAMBIO_UMBRAL: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  INFO:          'bg-blue-50  text-blue-600  ring-1 ring-blue-200',
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
        <label className="block w-full text-xs font-medium text-gray-700 xl:w-40">
          Tipo de evento
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODOS">Todos</option>
            <option value="ERROR">ERROR</option>
            <option value="CAMBIO_UMBRAL">CAMBIO_UMBRAL</option>
          </select>
        </label>

        <label className="block w-full text-xs font-medium text-gray-700 xl:w-36">
          Desde
          <input
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block w-full text-xs font-medium text-gray-700 xl:w-36">
          Hasta
          <input
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={exportarCsv}
          className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Exportar CSV
        </button>
      </div>

      <div className="no-scrollbar overflow-x-auto rounded-lg border border-slate-100">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Tipo de evento</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Origen</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Descripción</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Timestamp</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id} className="align-top border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${BADGE[evento.tipoEvento] ?? BADGE.INFO}`}>
                      {evento.tipoEvento.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{evento.origen}</td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{evento.descripcion}</td>
                  <td className="px-4 py-3.5 text-xs tabular-nums text-slate-400">{evento.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                  No se encontraron eventos para los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}