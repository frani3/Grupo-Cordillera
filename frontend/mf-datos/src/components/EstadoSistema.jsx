import React, { useMemo, useState } from 'react';

const ESTADO_STYLES = {
  CLOSED: {
    dot: 'bg-emerald-500',
    label: 'CLOSED',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  OPEN: {
    dot: 'bg-rose-500',
    label: 'OPEN',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  HALF_OPEN: {
    dot: 'bg-amber-400',
    label: 'HALF_OPEN',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export default function EstadoSistema({ estados, loading }) {
  const [seleccionado, setSeleccionado] = useState(null);

  const sistemaSeleccionado = useMemo(
    () => estados.find((estado) => estado.ms === seleccionado) ?? null,
    [estados, seleccionado]
  );

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Integraciones</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Estado de integración</h3>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="animate-pulse flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-4 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded-full bg-slate-200" />
                    <div className="h-3 w-16 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="h-8 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
          ))
        ) : (
          estados.map((estado) => {
          const current = ESTADO_STYLES[estado.estado] || ESTADO_STYLES.OPEN;
          const isSelected = seleccionado === estado.ms;

          return (
            <div key={estado.ms} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setSeleccionado((actual) => (actual === estado.ms ? null : estado.ms))}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className={`h-4 w-4 rounded-full ${current.dot} ring-4 ring-white`} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{estado.sistema}</p>
                    <p className="text-xs text-slate-500">{estado.ms}</p>
                  </div>
                </div>

                <span className={`rounded-full border px-3 py-1 text-xs font-bold tracking-[0.18em] ${current.badge}`}>
                  {current.label}
                </span>
              </button>

              {isSelected && sistemaSeleccionado ? (
                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Circuit Breaker</p>
                      <p className="mt-1 font-bold text-slate-900">{sistemaSeleccionado.estado}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Último evento exitoso</p>
                      <p className="mt-1 font-medium text-slate-900">{sistemaSeleccionado.ultimoEventoExitoso}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Fallas consecutivas</p>
                      <p className="mt-1 font-black text-slate-900">{sistemaSeleccionado.fallasConsecutivas}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
          })
        )}
      </div>
    </section>
  );
}