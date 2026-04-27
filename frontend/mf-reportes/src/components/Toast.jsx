import React, { useEffect, useState } from 'react';

const estilos = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

export default function Toast({ mensaje = '', tipo = 'success', visible = false }) {
  const [renderVisible, setRenderVisible] = useState(visible);

  useEffect(() => {
    if (!visible) {
      setRenderVisible(false);
      return undefined;
    }

    setRenderVisible(true);
    const timer = window.setTimeout(() => setRenderVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [visible, mensaje, tipo]);

  if (!renderVisible) {
    return null;
  }

  const classes = estilos[tipo] || estilos.success;

  return (
    <div className="fixed right-6 top-6 z-50 w-[min(92vw,360px)]">
      <div role="alert" className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur ${classes}`}>
        {mensaje}
      </div>
    </div>
  );
}