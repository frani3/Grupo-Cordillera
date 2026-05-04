import React, { useMemo } from 'react';
import SparkLine from './SparkLine';
import Semaforo, { getSemaforoColor } from './Semaforo';

// ── Formatters ──────────────────────────────────────────────────────────────

function formatValue(valor, unidad) {
  if (unidad === 'CLP') {
    if (Math.abs(valor) >= 1_000_000)
      return `$ ${(valor / 1_000_000).toFixed(1)} M`;
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(valor);
  }
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(valor)} %`;
}

function formatMeta(meta, unidad) {
  if (unidad === 'CLP') {
    if (Math.abs(meta) >= 1_000_000) return `$ ${(meta / 1_000_000).toFixed(1)} M`;
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(meta);
  }
  return `${meta} %`;
}

// Returns { label, isPositive } — neutral by default, colored only when critical
function buildDelta(valor, meta, unidad, invertido) {
  if (meta === 0) return null;

  if (unidad === 'CLP') {
    const pct = ((valor - meta) / Math.abs(meta)) * 100;
    const isPositive = invertido ? pct <= 0 : pct >= 0;
    return {
      label: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)} %`,
      isPositive,
    };
  }

  // Percentage-unit: show absolute pp deviation
  const diff = invertido ? meta - valor : valor - meta;
  const sign = diff >= 0 ? '+' : '−';
  return {
    label: `${sign}${Math.abs(diff).toFixed(1)} pp`,
    isPositive: diff >= 0,
  };
}

// ── Stale-data footer ───────────────────────────────────────────────────────

function StaleFooter({ timestamp }) {
  return (
    <div className="flex items-center gap-1.5 rounded bg-amber-50 border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-800">
      <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 3a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414L7.586 9 7 8.414V4a1 1 0 011-1z" />
      </svg>
      Dato en caché · {timestamp}
    </div>
  );
}

// ── Card component ──────────────────────────────────────────────────────────

export default function KpiCard({ kpi }) {
  const sparkColor = getSemaforoColor(kpi.valor, kpi.meta, kpi.umbralMin, kpi.invertido);

  // 7-day window for the area chart
  const sparkData = useMemo(
    () =>
      kpi.historico.slice(-7).map((item) => ({
        ...item,
        valorFormateado: formatValue(item.valor, kpi.unidad),
      })),
    [kpi.historico, kpi.unidad],
  );

  const delta = buildDelta(kpi.valor, kpi.meta, kpi.unidad, kpi.invertido);

  // Only use color for delta when truly critical (helps decision in < 5 s)
  const deltaClass = delta?.isPositive
    ? 'text-gray-400'
    : 'text-red-500 font-semibold';

  return (
    <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03] transition-shadow duration-150 hover:shadow-md">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {kpi.microservicio}
          </span>
          <h3 className="mt-1.5 text-sm font-medium text-gray-600">{kpi.nombre}</h3>
        </div>
        <Semaforo
          valor={kpi.valor}
          meta={kpi.meta}
          umbralMin={kpi.umbralMin}
          invertido={kpi.invertido}
        />
      </div>

      {/* ── Dominant value ── */}
      <div>
        <p className="text-[2rem] font-bold leading-none tracking-tight text-[#0F172A]">
          {formatValue(kpi.valor, kpi.unidad)}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">Meta {formatMeta(kpi.meta, kpi.unidad)}</span>
          {delta && (
            <span className={`text-xs ${deltaClass}`}>{delta.label}</span>
          )}
        </div>
      </div>

      {/* ── 7-day Area chart ── */}
      <div className="-mx-1">
        <SparkLine id={kpi.id} data={sparkData} color={sparkColor} />
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-gray-50 pt-2">
        {kpi.staleData ? (
          <StaleFooter timestamp={kpi.timestampUltimoValor} />
        ) : (
          <p className="text-[11px] text-gray-400">
            Últ. actualización: {kpi.timestampUltimoValor}
          </p>
        )}
      </div>
    </article>
  );
}
