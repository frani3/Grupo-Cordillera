import React from 'react';

const colores = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-success/10 text-success border-success/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
};

export default function Badge({ color = 'primary', texto = '' }) {
  const classes = colores[color] || colores.primary;

  return React.createElement(
    'span',
    {
      className: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${classes}`,
    },
    texto
  );
}