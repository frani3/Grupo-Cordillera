import React, { useMemo, useState } from 'react';

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateString));
}

const tipoStyles = {
  RESUMEN_MENSUAL:       'bg-blue-50   text-blue-700   ring-1 ring-blue-100',
  COMPARATIVO_HISTORICO: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
};

const tipoLabels = {
  RESUMEN_MENSUAL:       'Resumen Mensual',
  COMPARATIVO_HISTORICO: 'Comparativo Histórico',
};

export default function ListaReportes({ reportes, onVerDetalle }) {
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const reportesFiltrados = useMemo(() => (
    [...reportes]
      .filter((r) => tipoFiltro === 'TODOS' || r.tipo === tipoFiltro)
      .sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime())
  ), [reportes, tipoFiltro]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Historial</p>
          <h3 className="mt-1 text-base font-semibold text-[#0F172A]">Reportes Generados</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Filtrar</span>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODOS">Todos</option>
            <option value="RESUMEN_MENSUAL">Resumen Mensual</option>
            <option value="COMPARATIVO_HISTORICO">Comparativo Histórico</option>
          </select>
        </div>
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-slate-400">Sin reportes generados. Usa el formulario para crear el primero.</p>
        </div>
      ) : (
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Tipo</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Período</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Generado</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Usuario</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Abrir</th>
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.map((reporte, idx) => (
              <tr
                key={reporte.id}
                className={`transition-colors hover:bg-blue-50/30 ${idx !== reportesFiltrados.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${tipoStyles[reporte.tipo] || tipoStyles.RESUMEN_MENSUAL}`}>
                    {tipoLabels[reporte.tipo] || reporte.tipo}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs font-medium text-slate-700">{reporte.periodo}</td>
                <td className="px-4 py-2.5 text-xs tabular-nums text-slate-400">{formatDateTime(reporte.fechaGeneracion)}</td>
                <td className="px-4 py-2.5 text-xs font-medium text-slate-500">{reporte.usuarioQueGenero}</td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => onVerDetalle(reporte.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Ver →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
