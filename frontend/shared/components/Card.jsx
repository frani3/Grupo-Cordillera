import React from 'react';
import { theme } from '../theme.js';

export default function Card({ children, className = '' }) {
  return React.createElement(
    'div',
    {
      className: `rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`,
      style: { fontFamily: theme.typography.base },
    },
    children
  );
}