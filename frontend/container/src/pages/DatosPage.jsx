import React, { Suspense, useContext } from 'react';
import AuthContext from '../AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { Spinner } from '@shared';

const MfDatos = React.lazy(() => import('mfDatos/App'));

export default function DatosPage() {
  const { usuario } = useContext(AuthContext);

  return (
    <ErrorBoundary message="No se pudo cargar el módulo de Datos. Intenta refrescar la página.">
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner />
          </div>
        }
      >
        <MfDatos rolUsuario={usuario?.role} />
      </Suspense>
    </ErrorBoundary>
  );
}