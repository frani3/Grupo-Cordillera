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
  RESUMEN_MENSUAL: 'bg-blue-50 text-blue-700 border-blue-100',
  COMPARATIVO_HISTORICO: 'bg-violet-50 text-violet-700 border-violet-100',
};

export default function ListaReportes({ reportes, onVerDetalle }) {
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const reportesFiltrados = useMemo(() => {
    return [...reportes]
      .filter((reporte) => tipoFiltro === 'TODOS' || reporte.tipo === tipoFiltro)
      .sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());
  }, [reportes, tipoFiltro]);

  return (
    <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Listado</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-gray-900">Reportes generados</h3>
        </div>

        <label className="block text-sm font-semibold text-gray-700">
          Filtro por tipo
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="mt-2 min-w-[220px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODOS">Todos</option>
            <option value="RESUMEN_MENSUAL">RESUMEN_MENSUAL</option>
            <option value="COMPARATIVO_HISTORICO">COMPARATIVO_HISTORICO</option>
          </select>
        </label>
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
          Aún no se han generado reportes. Usa el botón Generar para crear el primero.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Período</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha de generación</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Generado por</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Acción</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {reportesFiltrados.map((reporte) => (
                <tr key={reporte.id} className="align-top border-b border-gray-50 transition-colors hover:bg-blue-50/30">
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${tipoStyles[reporte.tipo] || tipoStyles.RESUMEN_MENSUAL}`}>
                      {reporte.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{reporte.periodo}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatDateTime(reporte.fechaGeneracion)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{reporte.usuarioQueGenero}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(reporte.id)}
                      className="text-sm font-medium text-blue-700 transition-colors hover:underline"
                    >
                      →
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