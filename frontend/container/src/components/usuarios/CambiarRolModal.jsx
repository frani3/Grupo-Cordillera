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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Cambiar rol</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-gray-900">{usuario.nombre}</h3>

        <label className="mt-5 block text-sm font-semibold text-gray-700">
          Rol
          <select
            value={nuevoRol}
            onChange={(event) => setNuevoRol(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}