import React from 'react';

export default function Navbar({ moduloActivo, email, onLogout }) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-full bg-gradient-navbar text-white shadow-sm">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="flex items-center gap-3 justify-self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-primary-600 shadow-sm">
            GC
          </div>
          <div className="text-lg font-bold tracking-tight text-white">Grupo Cordillera</div>
        </div>

        <div className="justify-self-center text-sm font-medium tracking-wide text-white">{moduloActivo}</div>

        <div className="flex items-center justify-self-end gap-4 text-sm">
          <span className="max-w-[220px] truncate font-medium text-white/80">{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-white/40 px-4 py-2 font-semibold text-white transition-colors hover:bg-white hover:text-primary-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}