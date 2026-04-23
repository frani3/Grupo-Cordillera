import React from 'react';

const estados = {
  VERDE: {
    badge: 'bg-[#1A7A4A]/10 text-[#1A7A4A] border-[#1A7A4A]/20',
    dot: 'bg-[#1A7A4A]',
  },
  AMARILLO: {
    badge: 'bg-[#856404]/10 text-[#856404] border-[#856404]/20',
    dot: 'bg-[#856404]',
  },
  ROJO: {
    badge: 'bg-[#A32D2D]/10 text-[#A32D2D] border-[#A32D2D]/20',
    dot: 'bg-[#A32D2D]',
  },
};

export default function Semaforo({ estado = 'VERDE' }) {
  const current = estados[estado] || estados.ROJO;

  return React.createElement(
    'div',
    {
      className: `inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] ${current.badge}`,
    },
    React.createElement('span', { className: `h-3 w-3 rounded-full ${current.dot}` }),
    React.createElement('span', null, estado)
  );
}