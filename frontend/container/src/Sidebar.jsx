import React from 'react';
import { NavLink } from 'react-router-dom';

const baseItemClass = 'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors';

const moduleItems = [
  { icon: '📊', label: 'Indicadores', to: '/dashboard/indicadores' },
  { icon: '🗂️', label: 'Datos', to: '/dashboard/datos' },
  { icon: '📄', label: 'Reportes', to: '/dashboard/reportes' },
];

export default function Sidebar({ role }) {
  const isAdministrador = role === 'ADMINISTRADOR';

  return (
    <aside className="h-full w-[220px] shrink-0 border-r border-gray-200 bg-white">
      <div className="px-4 py-5">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Módulos</p>

        <nav className="mt-4 flex flex-col gap-2">
          {moduleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  baseItemClass,
                  isActive
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" aria-hidden="true" />
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
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" aria-hidden="true" />
              <span>Usuarios</span>
            </NavLink>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}