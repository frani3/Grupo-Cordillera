import React, { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const MONTHLY_KPI_CONFIG = {
  ventasTotales:       { label: 'Ventas Totales',          format: 'currency', invertido: false },
  variacionInventario: { label: 'Variación de Inventario', format: 'percent',  invertido: true  },
  ticketPromedio:      { label: 'Ticket Promedio',         format: 'currency', invertido: false },
};

const COMPARATIVE_FORMATS = {
  'Ventas netas':        'currency',
  'Pedidos confirmados': 'number',
  'Ticket promedio':     'currency',
  'Margen operativo':    'percent',
};

function formatCurrency(value) {
  if (Math.abs(value) >= 1_000_000) return `$ ${(value / 1_000_000).toFixed(1)} M`;
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function formatValue(value, format) {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent')  return `${Number(value).toFixed(1)} %`;
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value);
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
  return { delta, improved: delta > 0 };
}

function formatSignedDelta(value, format) {
  const absValue = Math.abs(Number(value));
  const sign = Number(value) >= 0 ? '+' : '−';
  if (format === 'currency') return `${sign} ${formatCurrency(absValue)}`;
  if (format === 'percent')  return `${sign}${absValue.toFixed(1)} pp`;
  return `${sign}${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(absValue)}`;
}

function getComparativeFormat(name) {
  return COMPARATIVE_FORMATS[name] || 'number';
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mt-1 text-xs font-semibold" style={{ color: p.fill }}>
          {p.name}: {new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function DetalleReporte({ reporte, onVolver }) {
  const isResumen = reporte.tipo === 'RESUMEN_MENSUAL';

  const resumenChartData = useMemo(() => {
    if (!isResumen) return [];
    return Object.entries(MONTHLY_KPI_CONFIG).map(([key, config]) => ({
      name: config.label,
      actual: reporte.datos[key],
      anterior: reporte.datos.comparacionMesAnterior[key],
    }));
  }, [isResumen, reporte]);

  const comparativeChartData = useMemo(() => {
    if (isResumen) return [];
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
          const current  = reporte.datos[key];
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
      ...reporte.datos.kpis.map((kpi) => [
        kpi.nombre,
        formatValue(kpi.valorPeriodo1, getComparativeFormat(kpi.nombre)),
        formatValue(kpi.valorPeriodo2, getComparativeFormat(kpi.nombre)),
        formatSignedDelta(kpi.diferenciaAbsoluta, getComparativeFormat(kpi.nombre)),
        `${kpi.diferenciaPorcentual}%`,
      ].map(csvEscape).join(',')),
    ];
    exportCsv(`reporte-${reporte.id}.csv`, rows);
  };

  const formatDate = (d) =>
    new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));

  return (
    <div className="w-full space-y-5">

      {/* ── Header card ─────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              {isResumen ? 'Resumen Mensual' : 'Comparativo Histórico'}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">{reporte.periodo}</h3>
            <p className="mt-1 text-[11px] text-slate-400">
              {reporte.usuarioQueGenero} · {formatDate(reporte.fechaGeneracion)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onVolver}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              ← Volver
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Exportar CSV ↓
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI mini-cards (resumen) ─────────────────────────────────────────── */}
      {isResumen && (
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(MONTHLY_KPI_CONFIG).map(([key, config]) => {
            const current  = reporte.datos[key];
            const previous = reporte.datos.comparacionMesAnterior[key];
            const { delta, improved } = createComparisonDelta(current, previous, config.invertido);
            return (
              <div
                key={key}
                className={`flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${
                  improved ? 'border-l-[3px] border-l-emerald-400' : 'border-l-[3px] border-l-red-400'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{config.label}</p>
                <p className="mt-2 text-2xl font-bold leading-none tracking-tight text-[#0F172A]">
                  {formatValue(current, config.format)}
                </p>
                <p className={`mt-1.5 text-[11px] font-semibold ${improved ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatSignedDelta(delta, config.format)} vs mes anterior
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Anterior: {formatValue(previous, config.format)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Estado general (resumen) ─────────────────────────────────────────── */}
      {isResumen && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Estado General</span>
            <span className="text-[10px] text-slate-300">·</span>
            <span className="text-xs font-semibold text-emerald-600">{reporte.datos.estadoGeneral}</span>
          </div>
        </div>
      )}

      {/* ── KPI comparison table (comparativo) ──────────────────────────────── */}
      {!isResumen && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Desglose Comparativo</p>
            <h4 className="mt-1 text-sm font-semibold text-[#0F172A]">
              {reporte.datos.periodo1} vs {reporte.datos.periodo2}
            </h4>
          </div>
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">KPI</th>
                <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Período 1</th>
                <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Período 2</th>
                <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Diferencia</th>
                <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Var. %</th>
              </tr>
            </thead>
            <tbody>
              {reporte.datos.kpis.map((kpi, idx) => {
                const positive = kpi.diferenciaPorcentual >= 0;
                const format   = getComparativeFormat(kpi.nombre);
                return (
                  <tr
                    key={kpi.nombre}
                    className={`transition-colors hover:bg-blue-50/30 ${
                      idx !== reporte.datos.kpis.length - 1 ? 'border-b border-slate-50' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 text-xs font-semibold text-slate-700">{kpi.nombre}</td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums font-medium text-slate-400">{formatValue(kpi.valorPeriodo1, format)}</td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums font-medium text-slate-700">{formatValue(kpi.valorPeriodo2, format)}</td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums font-semibold text-slate-700">{formatSignedDelta(kpi.diferenciaAbsoluta, format)}</td>
                    <td className={`px-4 py-2.5 text-right text-xs tabular-nums font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {kpi.diferenciaPorcentual > 0 ? '+' : ''}{kpi.diferenciaPorcentual}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Comparison chart ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Comparación Visual</p>
          <h4 className="mt-1 text-sm font-semibold text-[#0F172A]">
            {isResumen
              ? 'Mes actual vs Mes anterior'
              : `${reporte.datos.periodo1} vs ${reporte.datos.periodo2}`}
          </h4>
        </div>
        <div className="px-4 py-4">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={isResumen ? resumenChartData : comparativeChartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 16 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey={isResumen ? 'name' : 'nombre'}
                  tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, Arial, sans-serif' }}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0, notation: 'compact' }).format(v)
                  }
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
                {isResumen ? (
                  <>
                    <Bar dataKey="anterior" name="Mes anterior" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual"   name="Mes actual"   fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="periodo1" name={reporte.datos.periodo1} fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="periodo2" name={reporte.datos.periodo2} radius={[4, 4, 0, 0]}>
                      {comparativeChartData.map((entry) => (
                        <Cell key={entry.nombre} fill={entry.diferenciaPorcentual >= 0 ? '#2563EB' : '#EF4444'} />
                      ))}
                    </Bar>
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
