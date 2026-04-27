import React from 'react';

function getEstado(valor, meta, umbralMin) {
  if (valor >= meta) {
    return {
      label: 'Óptimo',
      color: 'bg-emerald-500',
    };
  }

  if (valor >= umbralMin) {
    return {
      label: 'En riesgo',
      color: 'bg-amber-400',
    };
  }

  return {
    label: 'Crítico',
    color: 'bg-rose-500',
  };
}

export default function Semaforo({ valor, meta, umbralMin }) {
  const estado = getEstado(valor, meta, umbralMin);

  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
      <span className={`h-4 w-4 rounded-full ${estado.color} ring-2 ring-white shadow-sm`} aria-hidden="true" />
      <span>{estado.label}</span>
    </div>
  );
}