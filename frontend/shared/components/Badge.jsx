import React from 'react';

const colores = {
  primary: 'bg-[#1E5FA8]/10 text-[#1E5FA8] border-[#1E5FA8]/20',
  secondary: 'bg-[#C96A00]/10 text-[#C96A00] border-[#C96A00]/20',
  success: 'bg-[#1A7A4A]/10 text-[#1A7A4A] border-[#1A7A4A]/20',
  danger: 'bg-[#A32D2D]/10 text-[#A32D2D] border-[#A32D2D]/20',
  warning: 'bg-[#856404]/10 text-[#856404] border-[#856404]/20',
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