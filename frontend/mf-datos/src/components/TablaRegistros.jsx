import React, { useMemo } from 'react';

const fuenteStyles = {
  POS: 'bg-primary-50 text-primary-700 border-primary-200',
  INVENTARIO: 'bg-primary-50 text-primary-700 border-primary-200',
  ECOMMERCE: 'bg-primary-50 text-primary-700 border-primary-200',
  FINANZAS: 'bg-primary-50 text-primary-700 border-primary-200',
  CLIENTES: 'bg-primary-50 text-primary-700 border-primary-200',
};

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatSummaryValue(value) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value);
  }

  return String(value);
}

export default function TablaRegistros({ registros, paginaActual, totalPaginas, onAnterior, onSiguiente, loading }) {
  const hayRegistros = registros.length > 0;

  const registrosFormateados = useMemo(
    () =>
      registros.map((registro) => ({
        ...registro,
        resumenTexto: Object.entries(registro.resumen)
          .map(([clave, valor]) => `${clave}: ${formatSummaryValue(valor)}`)
          .join(', '),
      })),
    [registros]
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Fuente</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Fecha de captura</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Resumen de datos</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm font-medium text-gray-500">
                  Cargando registros...
                </td>
              </tr>
            ) : hayRegistros ? (
              registrosFormateados.map((registro) => (
                <tr key={registro.id} className="align-top hover:bg-gray-50/80">
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-[0.2em] ${fuenteStyles[registro.fuente] || fuenteStyles.POS}`}>
                      {registro.fuente}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">{formatDate(registro.fechaCaptura)}</td>
                  <td className="px-4 py-4 text-sm leading-6 text-gray-600">{registro.resumenTexto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm font-medium text-gray-500">
                  No se encontraron registros para los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-600">
          Página {paginaActual} de {totalPaginas}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAnterior}
            disabled={paginaActual <= 1 || loading}
            className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={onSiguiente}
            disabled={paginaActual >= totalPaginas || loading}
            className="rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}