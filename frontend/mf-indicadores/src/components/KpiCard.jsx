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
  const [periodo, setPeriodo] = useState(30);

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
      className="cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">INDICADOR</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">{kpi.nombre}</h3>
          </div>
          <Semaforo valor={kpi.valor} meta={kpi.meta} umbralMin={kpi.umbralMin} />
        </div>

        {kpi.staleData ? (
          <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            ⚠️ Dato desfasado. Última actualización: {kpi.timestampUltimoValor}
          </div>
        ) : null}

        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Valor actual</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatKpiValue(kpi.valor, kpi.unidad)}
            <span className="ml-2 text-sm font-medium text-gray-400">{kpi.unidad}</span>
          </p>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">Meta</p>
            <p className="font-semibold text-gray-700">
              {formatKpiValue(kpi.meta, kpi.unidad)}
              <span className="ml-2 text-xs font-medium text-gray-400">{kpi.unidad}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[7, 30, 90].map((dias) => (
            <button
              key={dias}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPeriodo(dias);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium ${periodo === dias ? 'bg-gradient-brand text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {dias} días
            </button>
          ))}
        </div>

        {expanded ? <GraficoTendencia kpiId={kpi.id} nombre={kpi.nombre} periodo={periodo} /> : null}
      </div>
    </article>
  );
}