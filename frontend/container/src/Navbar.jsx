import React from 'react';

export default function Navbar({ moduloActivo, email, onLogout }) {
  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-full bg-[#1E5FA8] text-white shadow-[0_4px_18px_rgba(30,95,168,0.18)]">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="justify-self-start text-lg font-bold tracking-tight">Grupo Cordillera</div>

        <div className="justify-self-center text-sm font-semibold tracking-wide text-white">{moduloActivo}</div>

        <div className="flex items-center justify-self-end gap-4 text-sm">
          <span className="max-w-[220px] truncate font-medium text-white">{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-white px-4 py-2 font-semibold text-[#1E5FA8] transition-colors hover:bg-[#D6E4F7]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}