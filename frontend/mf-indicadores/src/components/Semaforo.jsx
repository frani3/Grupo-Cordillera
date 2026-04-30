import React from 'react';

const ESTADOS = {
  optimo: {
    label: 'Óptimo',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-500/20',
  },
  riesgo: {
    label: 'En riesgo',
    dot: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 ring-amber-400/20',
  },
  critico: {
    label: 'Crítico',
    dot: 'bg-red-500',
    pill: 'bg-red-50 text-red-700 ring-red-500/20',
  },
};

function getEstadoKey(valor, meta, umbralMin, invertido) {
  if (invertido) {
    // Menor es mejor (ej. quiebre de stock): meta = umbral óptimo, umbralMin = umbral crítico
    if (valor <= meta) return 'optimo';
    if (valor <= umbralMin) return 'riesgo';
    return 'critico';
  }
  if (valor >= meta) return 'optimo';
  if (valor >= umbralMin) return 'riesgo';
  return 'critico';
}

export function getSemaforoColor(valor, meta, umbralMin, invertido = false) {
  const key = getEstadoKey(valor, meta, umbralMin, invertido);
  return { optimo: '#10B981', riesgo: '#F59E0B', critico: '#EF4444' }[key];
}

export default function Semaforo({ valor, meta, umbralMin, invertido = false }) {
  const key = getEstadoKey(valor, meta, umbralMin, invertido);
  const estado = ESTADOS[key];

  return (
    <div
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${estado.pill}`}
    >
      <span className={`h-2 w-2 rounded-full ${estado.dot}`} aria-hidden="true" />
      {estado.label}
    </div>
  );
}
