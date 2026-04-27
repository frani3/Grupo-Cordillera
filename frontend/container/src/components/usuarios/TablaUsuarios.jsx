import React, { useMemo, useState } from 'react';

function BadgeEstado({ activo }) {
  const clases = activo
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-slate-200 bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${clases}`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function BadgeRol({ rol }) {
  const clases =
    rol === 'ADMINISTRADOR'
      ? 'border-violet-200 bg-violet-50 text-violet-700'
      : rol === 'ANALISTA'
        ? 'border-orange-200 bg-orange-50 text-orange-700'
        : 'border-sky-200 bg-sky-50 text-sky-700';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${clases}`}>
      {rol}
    </span>
  );
}

function ModalConfirmacion({ usuario, onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Confirmación</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Desactivar usuario</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          ¿Seguro que deseas desactivar a <span className="font-semibold text-slate-900">{usuario.nombre}</span>?
        </p>

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
            onClick={onConfirmar}
            className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TablaUsuarios({ usuarios, onCambiarRol, onDesactivar }) {
  const [usuarioPendiente, setUsuarioPendiente] = useState(null);

  const usuariosOrdenados = useMemo(
    () => [...usuarios].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [usuarios]
  );

  const confirmarDesactivacion = async () => {
    if (!usuarioPendiente) {
      return;
    }

    try {
      await onDesactivar(usuarioPendiente);
    } finally {
      setUsuarioPendiente(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosOrdenados.map((usuario) => (
                <tr key={usuario.id} className="align-top">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{usuario.nombre}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{usuario.email}</td>
                  <td className="px-6 py-4">
                    <BadgeRol rol={usuario.rol} />
                  </td>
                  <td className="px-6 py-4">
                    <BadgeEstado activo={usuario.activo} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onCambiarRol(usuario)}
                        className="rounded-2xl border border-[#1E5FA8]/20 bg-[#1E5FA8]/10 px-4 py-2 text-sm font-semibold text-[#1E5FA8] transition-colors hover:bg-[#1E5FA8]/15"
                      >
                        Cambiar rol
                      </button>
                      <button
                        type="button"
                        disabled={!usuario.activo}
                        onClick={() => setUsuarioPendiente(usuario)}
                        className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        Desactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usuariosOrdenados.length === 0 ? (
          <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">
            No hay usuarios disponibles.
          </div>
        ) : null}
      </div>

      {usuarioPendiente ? (
        <ModalConfirmacion
          usuario={usuarioPendiente}
          onCancelar={() => setUsuarioPendiente(null)}
          onConfirmar={confirmarDesactivacion}
        />
      ) : null}
    </div>
  );
}