import React, { useMemo, useState } from 'react';

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

const tipoStyles = {
  RESUMEN_MENSUAL: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPARATIVO_HISTORICO: 'bg-violet-50 text-violet-700 border-violet-200',
};

export default function ListaReportes({ reportes, onVerDetalle }) {
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const reportesFiltrados = useMemo(() => {
    return [...reportes]
      .filter((reporte) => tipoFiltro === 'TODOS' || reporte.tipo === tipoFiltro)
      .sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());
  }, [reportes, tipoFiltro]);

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Listado</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Reportes generados</h3>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Filtro por tipo
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="mt-2 min-w-[220px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
          >
            <option value="TODOS">Todos</option>
            <option value="RESUMEN_MENSUAL">RESUMEN_MENSUAL</option>
            <option value="COMPARATIVO_HISTORICO">COMPARATIVO_HISTORICO</option>
          </select>
        </label>
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm font-medium text-slate-500">
          Aún no se han generado reportes. Usa el botón Generar para crear el primero.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Período</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Fecha de generación</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Generado por</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {reportesFiltrados.map((reporte) => (
                <tr key={reporte.id} className="align-top hover:bg-slate-50/80">
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-[0.18em] ${tipoStyles[reporte.tipo] || tipoStyles.RESUMEN_MENSUAL}`}>
                      {reporte.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">{reporte.periodo}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">{formatDateTime(reporte.fechaGeneracion)}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{reporte.usuarioQueGenero}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(reporte.id)}
                      className="rounded-2xl border border-[#C96A00] bg-white px-4 py-2 text-sm font-semibold text-[#C96A00] transition-colors hover:bg-[#FFF3E6]"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}