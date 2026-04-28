import React, { useMemo, useState } from 'react';

function BadgeEstado({ activo }) {
  const clases = activo
    ? 'border-green-200 bg-green-50 text-green-700'
    : 'border-gray-200 bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${clases}`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function BadgeRol({ rol }) {
  const clases =
    rol === 'ADMINISTRADOR'
      ? 'border-blue-100 bg-blue-50 text-blue-700'
      : rol === 'ANALISTA'
        ? 'border-gray-200 bg-gray-100 text-gray-700'
        : 'border-blue-100 bg-blue-50 text-blue-700';

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${clases}`}>
      {rol}
    </span>
  );
}

function ModalConfirmacion({ usuario, onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Confirmación</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-gray-900">Desactivar usuario</h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          ¿Seguro que deseas desactivar a <span className="font-semibold text-gray-900">{usuario.nombre}</span>?
        </p>

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
            onClick={onConfirmar}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {usuariosOrdenados.map((usuario) => (
                <tr key={usuario.id} className="align-top border-b border-gray-50 transition-colors hover:bg-blue-50/30">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{usuario.nombre}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
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
                        className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        Cambiar rol
                      </button>
                      <button
                        type="button"
                        disabled={!usuario.activo}
                        onClick={() => setUsuarioPendiente(usuario)}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
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
          <div className="border-t border-gray-100 px-6 py-10 text-center text-sm text-gray-500">
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