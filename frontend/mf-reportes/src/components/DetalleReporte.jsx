import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const MONTHLY_KPI_CONFIG = {
  ventasTotales: { label: 'Ventas totales', format: 'currency', invertido: false },
  variacionInventario: { label: 'Variación de inventario', format: 'percent', invertido: true },
  ticketPromedio: { label: 'Ticket promedio', format: 'currency', invertido: false },
};

const COMPARATIVE_FORMATS = {
  'Ventas netas': 'currency',
  'Pedidos confirmados': 'number',
  'Ticket promedio': 'currency',
  'Margen operativo': 'percent',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatValue(value, format) {
  if (format === 'currency') {
    return formatCurrency(value);
  }

  if (format === 'percent') {
    return `${Number(value).toFixed(1)}%`;
  }

  if (format === 'number') {
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value);
  }

  return String(value);
}

function csvEscape(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function exportCsv(filename, rows) {
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function createComparisonDelta(current, previous, invertido) {
  const delta = invertido ? previous - current : current - previous;
  return {
    delta,
    improved: delta > 0,
  };
}

function formatSignedDelta(value, format) {
  const absValue = Math.abs(Number(value));
  const sign = Number(value) >= 0 ? '+' : '-';

  if (format === 'currency') {
    return `${sign}${formatCurrency(absValue)}`;
  }

  if (format === 'percent') {
    return `${sign}${absValue.toFixed(1)}%`;
  }

  return `${sign}${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(absValue)}`;
}

function getComparativeFormat(name) {
  return COMPARATIVE_FORMATS[name] || 'number';
}

export default function DetalleReporte({ reporte, onVolver }) {
  const isResumen = reporte.tipo === 'RESUMEN_MENSUAL';

  const resumenChartData = useMemo(() => {
    if (!isResumen) {
      return [];
    }

    return Object.entries(MONTHLY_KPI_CONFIG).map(([key, config]) => ({
      name: config.label,
      actual: reporte.datos[key],
      anterior: reporte.datos.comparacionMesAnterior[key],
    }));
  }, [isResumen, reporte]);

  const comparativeChartData = useMemo(() => {
    if (isResumen) {
      return [];
    }

    return reporte.datos.kpis.map((kpi) => ({
      nombre: kpi.nombre,
      periodo1: kpi.valorPeriodo1,
      periodo2: kpi.valorPeriodo2,
      diferenciaPorcentual: kpi.diferenciaPorcentual,
    }));
  }, [isResumen, reporte]);

  const handleExportCsv = () => {
    if (isResumen) {
      const rows = [
        ['KPI', 'Valor actual', 'Mes anterior', 'Diferencia', 'Estado'].map(csvEscape).join(','),
        ...Object.entries(MONTHLY_KPI_CONFIG).map(([key, config]) => {
          const current = reporte.datos[key];
          const previous = reporte.datos.comparacionMesAnterior[key];
          const { delta, improved } = createComparisonDelta(current, previous, config.invertido);

          return [
            config.label,
            formatValue(current, config.format),
            formatValue(previous, config.format),
            formatSignedDelta(delta, config.format),
            improved ? 'Mejoró' : 'Empeoró',
          ].map(csvEscape).join(',');
        }),
        ['Estado general', reporte.datos.estadoGeneral, '', '', ''].map(csvEscape).join(','),
      ];

      exportCsv(`reporte-${reporte.id}.csv`, rows);
      return;
    }

    const rows = [
      ['KPI', 'Período 1', 'Período 2', 'Diferencia', 'Variación %'].map(csvEscape).join(','),
      ...reporte.datos.kpis.map((kpi) =>
        [
          kpi.nombre,
          formatValue(kpi.valorPeriodo1, getComparativeFormat(kpi.nombre)),
          formatValue(kpi.valorPeriodo2, getComparativeFormat(kpi.nombre)),
          formatSignedDelta(kpi.diferenciaAbsoluta, getComparativeFormat(kpi.nombre)),
          `${kpi.diferenciaPorcentual}%`,
        ].map(csvEscape).join(','),
      ),
    ];

    exportCsv(`reporte-${reporte.id}.csv`, rows);
  };

  if (isResumen) {
    return (
      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Detalle</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-gray-900">{reporte.periodo}</h3>
            <p className="mt-2 text-sm text-gray-500">
              Generado por {reporte.usuarioQueGenero} · {new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(reporte.fechaGeneracion))}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-2xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Exportar CSV
            </button>
            <button
              type="button"
              onClick={onVolver}
              className="rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Volver
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(MONTHLY_KPI_CONFIG).map(([key, config]) => {
            const current = reporte.datos[key];
            const previous = reporte.datos.comparacionMesAnterior[key];
            const { delta, improved } = createComparisonDelta(current, previous, config.invertido);
            const colorClass = improved ? 'text-success' : 'text-danger';
            const backgroundClass = improved ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20';

            return (
              <article key={key} className={`rounded-3xl border p-5 ${backgroundClass}`}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">{config.label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-gray-900">{formatValue(current, config.format)}</p>
                <p className={`mt-2 text-sm font-semibold ${colorClass}`}>{formatSignedDelta(delta, config.format)} vs mes anterior</p>
                <p className="mt-2 text-sm text-gray-600">Mes anterior: {formatValue(previous, config.format)}</p>
              </article>
            );
          })}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gray-500">Comparación visual</h4>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumenChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value)} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value)} />
                <Bar dataKey="anterior" name="Mes anterior" fill="#94A3B8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" name="Mes actual" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Detalle</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-gray-900">{reporte.periodo}</h3>
          <p className="mt-2 text-sm text-gray-500">
            {reporte.datos.periodo1} · {reporte.datos.periodo2}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-2xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onVolver}
            className="rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">KPI</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Período 1</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Período 2</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Diferencia</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Variación %</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {reporte.datos.kpis.map((kpi) => {
              const positive = kpi.diferenciaPorcentual >= 0;
              const variationClass = positive ? 'text-success' : 'text-danger';
              const format = getComparativeFormat(kpi.nombre);

              return (
                <tr key={kpi.nombre} className="align-top hover:bg-gray-50/80">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{kpi.nombre}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{formatValue(kpi.valorPeriodo1, format)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{formatValue(kpi.valorPeriodo2, format)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-700">{formatSignedDelta(kpi.diferenciaAbsoluta, format)}</td>
                  <td className={`px-4 py-4 text-sm font-bold ${variationClass}`}>{kpi.diferenciaPorcentual > 0 ? '+' : ''}{kpi.diferenciaPorcentual}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gray-500">Comparación visual</h4>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativeChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="periodo1" name={reporte.datos.periodo1} fill="#94A3B8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="periodo2" name={reporte.datos.periodo2} radius={[8, 8, 0, 0]}>
                {comparativeChartData.map((entry) => (
                  <Cell key={entry.nombre} fill={entry.diferenciaPorcentual >= 0 ? '#2563EB' : '#DC2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}