import React, { useEffect, useState } from 'react';

export default function CambiarRolModal({ usuario, onCancelar, onConfirmar }) {
  const [nuevoRol, setNuevoRol] = useState(usuario?.rol ?? 'EJECUTIVO');

  useEffect(() => {
    setNuevoRol(usuario?.rol ?? 'EJECUTIVO');
  }, [usuario]);

  if (!usuario) {
    return null;
  }

  const handleConfirmar = async () => {
    await onConfirmar(usuario, nuevoRol);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Cambiar rol</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{usuario.nombre}</h3>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Rol
          <select
            value={nuevoRol}
            onChange={(event) => setNuevoRol(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
          >
            <option value="EJECUTIVO">EJECUTIVO</option>
            <option value="ANALISTA">ANALISTA</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
          </select>
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="rounded-2xl bg-[#1E5FA8] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#174a83]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}