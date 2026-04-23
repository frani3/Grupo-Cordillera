import React, { Suspense } from 'react';
import { Badge, Card, Spinner } from '@shared';

const DatosApp = React.lazy(() => import('mfDatos/App'));
const IndicadoresApp = React.lazy(() => import('mfIndicadores/App'));
const ReportesApp = React.lazy(() => import('mfReportes/App'));

function LoadingCard({ texto }) {
  return (
    <Card className="flex min-h-[260px] items-center justify-center">
      <Spinner />
      <span className="ml-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{texto}</span>
    </Card>
  );
}

export default function App() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge color="primary" texto="Host" />
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Grupo Cordillera</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Este container orquesta los tres micro frontends con React.lazy, Suspense y Module Federation.
            </p>
          </div>
          <div className="rounded-full bg-[#1E5FA8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1E5FA8]">
            Puerto 3000
          </div>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-3">
        <Suspense fallback={<LoadingCard texto="Cargando mf-datos" />}>
          <DatosApp />
        </Suspense>
        <Suspense fallback={<LoadingCard texto="Cargando mf-indicadores" />}>
          <IndicadoresApp />
        </Suspense>
        <Suspense fallback={<LoadingCard texto="Cargando mf-reportes" />}>
          <ReportesApp />
        </Suspense>
      </section>
    </div>
  );
}