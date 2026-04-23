import React from 'react';
import { theme } from '../theme.js';

export default function Card({ children, className = '' }) {
  return React.createElement(
    'div',
    {
      className: `rounded-3xl border border-[#1E5FA8]/10 bg-white p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] ${className}`,
      style: { fontFamily: theme.typography.base },
    },
    children
  );
}