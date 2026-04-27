import React, { useMemo, useState } from 'react';
import { auditoriaMock } from '../mocks/datosMock';

const tipoStyles = {
  ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
  CAMBIO_UMBRAL: 'bg-amber-50 text-amber-700 border-amber-200',
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
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <label className="block text-sm font-semibold text-slate-700">
          Tipo de evento
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
          >
            <option value="TODOS">Todos</option>
            <option value="ERROR">ERROR</option>
            <option value="CAMBIO_UMBRAL">CAMBIO_UMBRAL</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Desde
          <input
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Hasta
          <input
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
          />
        </label>

        <button
          type="button"
          onClick={exportarCsv}
          className="rounded-2xl border border-[#1E5FA8] bg-white px-4 py-3 text-sm font-semibold text-[#1E5FA8] transition-colors hover:bg-[#E8F0FB]"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tipo de evento</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Origen</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id} className="align-top hover:bg-slate-50/80">
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-[0.18em] ${tipoStyles[evento.tipoEvento] || tipoStyles.ERROR}`}>
                      {evento.tipoEvento}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">{evento.origen}</td>
                  <td className="px-4 py-4 text-sm leading-6 text-slate-600">{evento.descripcion}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">{evento.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm font-medium text-slate-500">
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