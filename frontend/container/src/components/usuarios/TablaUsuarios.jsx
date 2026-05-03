import React, { useMemo, useState } from 'react';

const rolStyles = {
  ADMINISTRADOR: 'bg-blue-50   text-blue-700   ring-1 ring-blue-100',
  ANALISTA:      'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
  EJECUTIVO:     'bg-slate-50  text-slate-600  ring-1 ring-slate-200',
};

const rolLabels = {
  ADMINISTRADOR: 'Administrador',
  ANALISTA:      'Analista',
  EJECUTIVO:     'Ejecutivo',
};

function BadgeRol({ rol }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${rolStyles[rol] ?? rolStyles.EJECUTIVO}`}>
      {rolLabels[rol] ?? rol}
    </span>
  );
}

function BadgeEstado({ activo }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
      activo
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
        : 'bg-slate-50   text-slate-500  ring-1 ring-slate-200'
    }`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function ModalConfirmacion({ usuario, onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Confirmación</p>
          <h3 className="mt-1 text-base font-semibold text-[#0F172A]">Desactivar usuario</h3>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs leading-5 text-slate-500">
            ¿Confirmas la desactivación de{' '}
            <span className="font-bold text-slate-700">{usuario.nombre}</span>?
            Esta acción impedirá el acceso al sistema.
          </p>
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
            onClick={onConfirmar}
            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
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
    [usuarios],
  );

  const confirmarDesactivacion = async () => {
    if (!usuarioPendiente) return;
    try {
      await onDesactivar(usuarioPendiente);
    } finally {
      setUsuarioPendiente(null);
    }
  };

  if (usuariosOrdenados.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-xs text-slate-400">No hay usuarios disponibles.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Nombre</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Email</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Rol</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Estado</th>
              <th className="border-b border-slate-100 px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosOrdenados.map((u, idx) => (
              <tr
                key={u.id}
                className={`transition-colors hover:bg-blue-50/30 ${
                  idx !== usuariosOrdenados.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <td className="px-4 py-2.5">
                  <p className="text-xs font-heading text-[#0F172A]">{u.nombre}</p>
                </td>
                <td className="px-4 py-2.5 text-xs font-medium text-slate-500">{u.email}</td>
                <td className="px-4 py-2.5"><BadgeRol rol={u.rol} /></td>
                <td className="px-4 py-2.5"><BadgeEstado activo={u.activo} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onCambiarRol(u)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Cambiar rol
                    </button>
                    <button
                      type="button"
                      disabled={!u.activo}
                      onClick={() => setUsuarioPendiente(u)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
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

      {usuarioPendiente && (
        <ModalConfirmacion
          usuario={usuarioPendiente}
          onCancelar={() => setUsuarioPendiente(null)}
          onConfirmar={confirmarDesactivacion}
        />
      )}
    </>
  );
}
