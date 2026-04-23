import React from 'react';

const estilos = {
  success: 'border-[#1A7A4A]/20 bg-[#1A7A4A]/10 text-[#1A7A4A]',
  warning: 'border-[#856404]/20 bg-[#856404]/10 text-[#856404]',
  error: 'border-[#A32D2D]/20 bg-[#A32D2D]/10 text-[#A32D2D]',
};

export default function Toast({ tipo = 'success', mensaje = '' }) {
  const classes = estilos[tipo] || estilos.success;

  return React.createElement('div', { className: `rounded-2xl border px-4 py-3 text-sm font-medium ${classes}`, role: 'alert' }, mensaje);
}