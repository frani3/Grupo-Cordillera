import React from 'react';

export default function Spinner() {
  return React.createElement(
    'div',
    { className: 'inline-flex items-center gap-3 text-primary-600' },
    React.createElement('span', {
      className: 'h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600',
    }),
    React.createElement('span', { className: 'text-sm font-medium text-gray-600' }, 'Cargando')
  );
}