import React from 'react';
import { NavLink } from 'react-router-dom';

const baseItemClass = 'flex items-center gap-3 border-l-3 px-4 py-3 text-sm font-medium transition-colors';

const moduleItems = [
  { icon: '▣', label: 'Indicadores', to: '/dashboard/indicadores' },
  { icon: '▤', label: 'Datos', to: '/dashboard/datos' },
  { icon: '▥', label: 'Reportes', to: '/dashboard/reportes' },
];

export default function Sidebar({ role }) {
  const isAdministrador = role === 'ADMINISTRADOR';

  return (
    <aside className="h-full w-[240px] shrink-0 border-r border-gray-100 bg-white">
      <div className="px-4 py-5">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400">MÓDULOS</p>

        <nav className="mt-4 flex flex-col divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {moduleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  baseItemClass,
                  isActive
                    ? 'border-blue-600 bg-gradient-brand-soft text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              <span className="text-base" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdministrador ? (
            <NavLink
              to="/dashboard/usuarios"
              end
              className={({ isActive }) =>
                [
                  baseItemClass,
                  isActive
                    ? 'border-blue-600 bg-gradient-brand-soft text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              <span className="text-base" aria-hidden="true">◫</span>
              <span>Usuarios</span>
            </NavLink>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}