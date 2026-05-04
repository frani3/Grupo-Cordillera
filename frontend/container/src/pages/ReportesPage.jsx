import React, { Suspense, useContext } from 'react';
import AuthContext from '../AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

const MfReportes = React.lazy(() => import('mfReportes/App'));

export default function ReportesPage() {
  const { usuario } = useContext(AuthContext);

  return (
    <ErrorBoundary message="No se pudo cargar el módulo de Reportes. Intenta refrescar la página.">
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <div className="text-sm font-medium text-slate-500">Cargando reportes...</div>
          </div>
        }
      >
        <MfReportes rolUsuario={usuario?.role} />
      </Suspense>
    </ErrorBoundary>
  );
}