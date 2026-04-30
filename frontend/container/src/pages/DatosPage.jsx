import React, { Suspense, useContext } from 'react';
import AuthContext from '../AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { CIRCUIT_STATES, INDICADORES_DATA } from '../data/indicadoresData';

const MfDatos = React.lazy(() => import('mfDatos/App'));

// ── Visual palette per circuit state ─────────────────────────────────────────
// Full class names as literals so Tailwind JIT includes them.

const STATE_STYLE = {
  CLOSED: {
    border: 'border-l-emerald-500',
    dot:    'bg-emerald-500',
    ping:   'bg-emerald-400',
    text:   'text-emerald-600',
    label:  'Operativo',
  },
  HALF_OPEN: {
    border: 'border-l-amber-400',
    dot:    'bg-amber-400',
    ping:   'bg-amber-300',
    text:   'text-amber-600',
    label:  'Sincronizando',
  },
  OPEN: {
    border: 'border-l-red-500',
    dot:    'bg-red-500',
    ping:   'bg-red-400',
    text:   'text-red-600',
    label:  'Falla de Enlace',
  },
};

// ── Premium Health Bar ────────────────────────────────────────────────────────
// Executive-level snapshot — 5 cards, rounded-2xl, border-l-4 coloured accent,
// hover:shadow-lg. Data comes from the container's own CIRCUIT_STATES source.

function HostHealthBar() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {CIRCUIT_STATES.map(({ ms, label, estado }) => {
        const s        = STATE_STYLE[estado] ?? STATE_STYLE.OPEN;
        const kpi      = INDICADORES_DATA[ms];
        const isClosed = estado === 'CLOSED';

        return (
          <div
            key={ms}
            className={`group flex flex-col gap-3 rounded-2xl border border-gray-100 border-l-4 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg ${s.border}`}
          >
            {/* MS code */}
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400">
              {ms}
            </span>

            {/* LED pip + service name */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {isClosed && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${s.ping}`}
                  />
                )}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${s.dot}`} />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-slate-700">
                {label}
              </span>
            </div>

            {/* Status label */}
            <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>

            {/* Last sync timestamp from INDICADORES_DATA */}
            {kpi?.timestamp && (
              <span className="text-[9px] text-gray-400">{kpi.timestamp}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Stale Data Notice ─────────────────────────────────────────────────────────
// Minimalistic amber notice — only shown when one or more circuits are degraded.
// Lists affected services + their last valid timestamp for transparency.

function StaleNotice() {
  const affected = CIRCUIT_STATES.filter((c) => c.estado !== 'CLOSED');
  if (!affected.length) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17
             2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485
             2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75
             0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-[11px] font-semibold text-amber-700">Dato de Respaldo</p>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-0.5">
          {affected.map(({ ms, label }) => {
            const kpi = INDICADORES_DATA[ms];
            return (
              <span key={ms} className="text-[10px] text-amber-600">
                <span className="font-medium">{label}</span>
                {kpi?.timestamp && (
                  <span className="text-amber-500/80"> · último dato: {kpi.timestamp}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MF loading skeleton ───────────────────────────────────────────────────────

function MfSkeleton() {
  return (
    <div className="space-y-5 p-6">
      <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="h-8 w-full animate-pulse rounded-xl bg-slate-200" />
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DatosPage() {
  const { usuario } = useContext(AuthContext);

  return (
    <div className="w-full space-y-6">

      {/* Page header — outside the cards, aligned with Indicadores style */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
          Salud del Sistema
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
          Módulo de Salud Técnica y Datos
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pipeline CDC + RabbitMQ · 5 integraciones activas
        </p>
      </div>

      {/* Block 1 — Health Bar card */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <HostHealthBar />
      </div>

      {/* Stale notice — between blocks, only when degraded */}
      <StaleNotice />

      {/* Blocks 2 & 3 — Data Explorer + Audit rendered by MF with their own cards */}
      <ErrorBoundary message="No se pudo cargar el módulo de Datos. Intenta refrescar la página.">
        <Suspense fallback={<MfSkeleton />}>
          <MfDatos rolUsuario={usuario?.role} />
        </Suspense>
      </ErrorBoundary>

    </div>
  );
}
