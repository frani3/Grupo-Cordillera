import React, { useState } from 'react';
import GraficoTendencia from './GraficoTendencia';
import Semaforo from './Semaforo';

function formatKpiValue(valor, unidad) {
  if (unidad === 'CLP') {
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(valor);
  }

  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(valor)}%`;
}

export default function KpiCard({ kpi }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setExpanded((value) => !value);
        }
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Indicador</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{kpi.nombre}</h3>
          </div>
          <Semaforo valor={kpi.valor} meta={kpi.meta} umbralMin={kpi.umbralMin} />
        </div>

        {kpi.staleData ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
            ⚠️ Dato desfasado. Última actualización: {kpi.timestampUltimoValor}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Valor actual</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              {formatKpiValue(kpi.valor, kpi.unidad)}
              <span className="ml-2 text-sm font-semibold text-slate-500">{kpi.unidad}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Meta</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              {formatKpiValue(kpi.meta, kpi.unidad)}
              <span className="ml-2 text-sm font-semibold text-slate-500">{kpi.unidad}</span>
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-500">Haz clic para ver la tendencia histórica</p>

        {expanded ? <GraficoTendencia kpiId={kpi.id} nombre={kpi.nombre} /> : null}
      </div>
    </article>
  );
}