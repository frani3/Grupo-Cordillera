import React, { useEffect, useMemo, useState } from 'react';
import KpiCard from './components/KpiCard';
import { getDashboard } from './services/kpiService';

function KpiSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="h-10 w-2/3 rounded-2xl bg-slate-200" />
        <div className="h-4 w-1/2 rounded-full bg-slate-200" />
        <div className="h-5 w-24 rounded-full bg-slate-200" />
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(false);
        const data = await getDashboard();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = dashboard?.kpis ?? [];
  const hasStaleData = useMemo(() => kpis.some((kpi) => kpi.staleData), [kpis]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Indicadores KPI</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Vista consolidada de los principales indicadores del negocio con datos simulados mientras el backend está disponible.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
          No se pudo cargar los indicadores. Intenta refrescar la página.
        </div>
      ) : null}

      {hasStaleData ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          ⚠️ Uno o más indicadores muestran datos desfasados por falla en sistemas de integración
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      ) : error ? null : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}
    </section>
  );
}