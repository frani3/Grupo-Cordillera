import React, { useEffect, useState } from 'react';
import KpiCard from './components/KpiCard';
import { getDashboard } from './services/kpiService';

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded-md bg-slate-100" />
            <div className="h-3.5 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
        <div className="h-9 w-32 rounded-md bg-slate-100" />
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-[60px] w-full rounded-lg bg-slate-50" />
        <div className="h-3 w-44 rounded bg-slate-100" />
      </div>
    </div>
  );
}

// w-full + max-w-full ensure the micro-frontend never overflows the host container
export default function App() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getDashboard()
      .then((data) => {
        if (!cancelled) {
          setKpis(data.kpis ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="w-full max-w-full space-y-8">
      {/* ── Page header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
          Panel de Control
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
          Indicadores de Negocio
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          5 KPIs críticos · MS1 – MS5 · Últimos 7 días
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-medium text-red-600">
          No se pudieron cargar los indicadores. Intenta refrescar la página.
        </div>
      )}

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 5 }, (_, i) => <KpiSkeleton key={i} />)
          : kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
      </div>
    </section>
  );
}
