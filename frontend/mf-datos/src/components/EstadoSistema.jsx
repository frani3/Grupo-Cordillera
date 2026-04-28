import React, { useMemo, useState } from 'react';

const ESTADO_STYLES = {
  CLOSED: {
    dot: 'bg-green-500',
    label: 'CLOSED',
    badge: 'border-green-200 bg-green-50 text-green-700',
  },
  OPEN: {
    dot: 'bg-red-500',
    label: 'OPEN',
    badge: 'border-red-200 bg-red-50 text-red-700',
  },
  HALF_OPEN: {
    dot: 'bg-amber-500',
    label: 'HALF_OPEN',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
  },
};

function EstadoSkeleton() {
  return [1, 2, 3, 4, 5].map((item, index) => (
    <div key={item} className={`flex items-center justify-between px-4 py-3 ${index < 4 ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded-full bg-gray-200" />
          <div className="h-3 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="h-7 w-24 rounded-full bg-gray-200" />
    </div>
  ));
}

export default function EstadoSistema({ estados, loading }) {
  const [sistemaSeleccionado, setSistemaSeleccionado] = useState(null);

  const estadosOrdenados = useMemo(() => [...estados].sort((a, b) => a.sistema.localeCompare(b.sistema)), [estados]);

  const currentState = sistemaSeleccionado ? ESTADO_STYLES[sistemaSeleccionado.estado] || ESTADO_STYLES.OPEN : null;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Integraciones</p>
          <h4 className="mt-2 text-lg font-black tracking-tight text-gray-900">Estado de circuitos</h4>
        </div>

        {loading ? (
          <EstadoSkeleton />
        ) : estadosOrdenados.length > 0 ? (
          estadosOrdenados.map((estado, index) => {
            const current = ESTADO_STYLES[estado.estado] || ESTADO_STYLES.OPEN;

            return (
              <div key={estado.ms} className={`px-4 py-3 ${index < estadosOrdenados.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <button
                  type="button"
                  onClick={() => setSistemaSeleccionado(estado)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`h-3 w-3 rounded-full ${current.dot}`} aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-800">{estado.sistema}</p>
                      <p className="text-xs text-gray-400">{estado.ms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${current.badge}`}>
                      {current.label}
                    </span>
                    <span className="text-sm text-gray-400">Ver detalle</span>
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No hay estados disponibles.</div>
        )}
      </div>

      {sistemaSeleccionado ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400">Detalle</p>
                <h4 className="mt-2 text-xl font-bold text-gray-900">{sistemaSeleccionado.sistema}</h4>
                <p className="text-sm text-gray-500">{sistemaSeleccionado.ms}</p>
              </div>
              <button
                type="button"
                onClick={() => setSistemaSeleccionado(null)}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Estado CB</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${currentState?.dot ?? 'bg-gray-300'}`} aria-hidden="true" />
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${currentState?.badge ?? 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                    {currentState?.label ?? sistemaSeleccionado.estado}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Último evento exitoso</p>
                <p className="mt-1 text-sm text-gray-900">{sistemaSeleccionado.ultimoEventoExitoso}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Fallas consecutivas</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{sistemaSeleccionado.fallasConsecutivas}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}