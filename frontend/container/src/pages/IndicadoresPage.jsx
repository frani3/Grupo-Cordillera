import React, { Suspense, useContext } from 'react';
import AuthContext from '../AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { Spinner } from '@shared';

const MfIndicadores = React.lazy(() => import('mfIndicadores/App'));

export default function IndicadoresPage() {
  const { usuario } = useContext(AuthContext);

  return (
    <ErrorBoundary message="No se pudo cargar el módulo de Indicadores. Intenta refrescar la página.">
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner />
          </div>
        }
      >
        <MfIndicadores rolUsuario={usuario?.role} />
      </Suspense>
    </ErrorBoundary>
  );
}