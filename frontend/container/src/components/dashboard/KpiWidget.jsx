import React from 'react';

// ── Formatters ────────────────────────────────────────────────────────────────

export function fmtValue(valor, unidad) {
  if (unidad === 'CLP') {
    if (Math.abs(valor) >= 1_000_000) return `$ ${(valor / 1_000_000).toFixed(1)} M`;
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);
  }
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(valor)} %`;
}

function fmtDelta(delta) {
  if (!delta) return null;
  if (delta.unit === 'CLP') {
    const sign = delta.value >= 0 ? '+' : '−';
    return `${sign} $ ${(Math.abs(delta.value) / 1_000_000).toFixed(1)} M`;
  }
  const sign = delta.value >= 0 ? '+' : '−';
  return `${sign}${Math.abs(delta.value).toFixed(1)} pp`;
}

// ── Status pill ───────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  optimo:  { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', label: 'Óptimo'   },
  riesgo:  { pill: 'bg-amber-50  text-amber-700  ring-amber-200',  dot: 'bg-amber-400',  label: 'En riesgo' },
  critico: { pill: 'bg-red-50    text-red-700    ring-red-200',    dot: 'bg-red-500',    label: 'Crítico'   },
};

function getStatusKey(valor, meta, umbralMin, invertido) {
  if (invertido) {
    if (valor <= meta)      return 'optimo';
    if (valor <= umbralMin) return 'riesgo';
    return 'critico';
  }
  if (valor >= meta)      return 'optimo';
  if (valor >= umbralMin) return 'riesgo';
  return 'critico';
}

function StatusPill({ statusKey }) {
  const s = STATUS_STYLES[statusKey];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Delta badge ───────────────────────────────────────────────────────────────

function DeltaBadge({ delta, invertido }) {
  if (!delta) return null;
  const label = fmtDelta(delta);
  if (!label) return null;

  const isGoingUp  = delta.value >= 0;
  const isPositive = invertido ? !isGoingUp : isGoingUp;
  const arrow      = isGoingUp ? '↑' : '↓';

  return (
    <span className={`text-[11px] font-semibold ${isPositive ? 'text-gray-400' : 'text-red-500'}`}>
      {arrow} {label} <span className="text-gray-300">(7d)</span>
    </span>
  );
}

// ── KpiWidget card ────────────────────────────────────────────────────────────

export default function KpiWidget({ kpi, children }) {
  const statusKey = getStatusKey(kpi.valor, kpi.meta, kpi.umbralMin, kpi.invertido);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-heading uppercase tracking-[0.22em] text-slate-400">
            {kpi.ms}
          </span>
          <h3 className="mt-1 text-xs font-semibold text-slate-700">{kpi.label}</h3>
        </div>
        <StatusPill statusKey={statusKey} />
      </div>

      {/* Headline value + delta */}
      <div className="mt-2">
        <p className="text-2xl font-heading leading-none tracking-tight text-[#0F172A]">
          {fmtValue(kpi.valor, kpi.unidad)}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] text-gray-400">Meta {fmtValue(kpi.meta, kpi.unidad)}</span>
          <DeltaBadge delta={kpi.delta} invertido={kpi.invertido} />
        </div>
      </div>

      {/* Chart slot */}
      <div className="mt-3 flex-1">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-2 border-t border-slate-50 pt-2">
        {kpi.staleData ? (
          <div className="flex items-center gap-1.5 rounded bg-amber-50 border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-800">
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 3a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414L7.586 9 7 8.414V4a1 1 0 011-1z" />
            </svg>
            Dato de respaldo · {kpi.timestamp}
          </div>
        ) : (
          <p className="text-[11px] text-gray-400">Últ. actualización: {kpi.timestamp}</p>
        )}
      </div>
    </div>
  );
}
