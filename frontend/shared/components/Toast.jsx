import React from 'react';

const estilos = {
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  error: 'border-danger/20 bg-danger/10 text-danger',
};

export default function Toast({ tipo = 'success', mensaje = '' }) {
  const classes = estilos[tipo] || estilos.success;

  return React.createElement('div', { className: `rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm ${classes}`, role: 'alert' }, mensaje);
}