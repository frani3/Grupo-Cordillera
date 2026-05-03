import React, { useEffect, useState } from 'react';

const fieldLabel = 'block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500';
const fieldInput = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function CambiarRolModal({ usuario, onCancelar, onConfirmar }) {
  const [nuevoRol, setNuevoRol] = useState(usuario?.rol ?? 'EJECUTIVO');

  useEffect(() => {
    setNuevoRol(usuario?.rol ?? 'EJECUTIVO');
  }, [usuario]);

  if (!usuario) return null;

  const handleConfirmar = async () => {
    await onConfirmar(usuario, nuevoRol);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Cambiar Rol</p>
          <h3 className="mt-1 text-base font-semibold text-[#0F172A]">{usuario.nombre}</h3>
          <p className="mt-0.5 text-[11px] text-slate-400">{usuario.email}</p>
        </div>

        <div className="px-5 py-4">
          <label className={fieldLabel}>
            Nuevo rol
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} className={fieldInput}>
              <option value="EJECUTIVO">Ejecutivo</option>
              <option value="ANALISTA">Analista</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Confirmar cambio
          </button>
        </div>
      </div>
    </div>
  );
}
