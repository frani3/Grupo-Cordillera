import React from 'react';

export default function Navbar({ moduloActivo, email, onLogout }) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-full border-b border-gray-200 bg-white/95 text-gray-900 backdrop-blur">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="justify-self-start text-lg font-semibold tracking-tight text-gray-900">Grupo Cordillera</div>

        <div className="justify-self-center text-sm font-medium tracking-wide text-gray-500">{moduloActivo}</div>

        <div className="flex items-center justify-self-end gap-4 text-sm">
          <span className="max-w-[220px] truncate font-medium text-gray-600">{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}