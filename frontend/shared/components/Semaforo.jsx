import React from 'react';

const estados = {
  VERDE: {
    dot: 'bg-success',
    label: 'Operativo',
  },
  AMARILLO: {
    dot: 'bg-warning',
    label: 'En revisión',
  },
  ROJO: {
    dot: 'bg-danger',
    label: 'Crítico',
  },
};

export default function Semaforo({ estado = 'VERDE' }) {
  const current = estados[estado] || estados.ROJO;

  return React.createElement(
    'div',
    {
      className: 'inline-flex items-center',
    },
    React.createElement('span', {
      className: `h-2.5 w-2.5 rounded-full ${current.dot}`,
      title: current.label,
      'aria-label': current.label,
    })
  );
}