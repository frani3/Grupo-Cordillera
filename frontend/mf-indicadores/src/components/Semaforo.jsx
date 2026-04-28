import React from 'react';

function getEstado(valor, meta, umbralMin) {
  if (valor >= meta) {
    return {
      label: 'Óptimo',
      color: 'bg-success',
    };
  }

  if (valor >= umbralMin) {
    return {
      label: 'En riesgo',
      color: 'bg-warning',
    };
  }

  return {
    label: 'Crítico',
    color: 'bg-danger',
  };
}

export default function Semaforo({ valor, meta, umbralMin }) {
  const estado = getEstado(valor, meta, umbralMin);

  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
      <span className={`h-3 w-3 rounded-full ${estado.color}`} aria-hidden="true" />
      <span>{estado.label}</span>
    </div>
  );
}