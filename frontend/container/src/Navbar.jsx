import React from 'react';

export default function Navbar({ moduloActivo, email, onLogout }) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-full bg-gradient-navbar text-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left — brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-primary-600 shadow-sm">
            GC
          </div>
          <span className="text-sm font-bold tracking-tight">Grupo Cordillera</span>
          {moduloActivo && (
            <>
              <span className="text-white/30">/</span>
              <span className="text-xs font-medium text-white/70">{moduloActivo}</span>
            </>
          )}
        </div>

        {/* Right — user info */}
        <div className="flex items-center gap-4">
          <span className="max-w-[180px] truncate text-xs font-medium text-white/80">{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-primary-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
