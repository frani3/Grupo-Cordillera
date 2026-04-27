import React from 'react';
import { NavLink } from 'react-router-dom';

const baseItemClass = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors';

const moduleItems = [
  { icon: '📊', label: 'Indicadores', to: '/dashboard/indicadores' },
  { icon: '🗂️', label: 'Datos', to: '/dashboard/datos' },
  { icon: '📄', label: 'Reportes', to: '/dashboard/reportes' },
];

export default function Sidebar({ role }) {
  const isAdministrador = role === 'ADMINISTRADOR';

  return (
    <aside className="h-full w-[220px] shrink-0 border-r border-slate-200 bg-white">
      <div className="px-4 py-5">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Módulos</p>

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
                    ? 'bg-[#D6E4F7] text-[#1E5FA8]'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
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
                    ? 'bg-[#D6E4F7] text-[#1E5FA8]'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <span className="text-base" aria-hidden="true">
                👥
              </span>
              <span>Usuarios</span>
            </NavLink>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}