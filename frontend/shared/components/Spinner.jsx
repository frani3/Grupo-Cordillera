import React from 'react';

export default function Spinner() {
  return React.createElement(
    'div',
    { className: 'inline-flex items-center gap-3 text-[#1E5FA8]' },
    React.createElement('span', {
      className: 'h-6 w-6 animate-spin rounded-full border-4 border-[#1E5FA8]/20 border-t-[#1E5FA8]',
    }),
    React.createElement('span', { className: 'text-sm font-semibold uppercase tracking-[0.18em]' }, 'Cargando')
  );
}