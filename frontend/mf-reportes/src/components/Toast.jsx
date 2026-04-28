import React, { useEffect, useState } from 'react';

const estilos = {
  success: 'border-success/20 bg-success/10 text-success',
  error: 'border-danger/20 bg-danger/10 text-danger',
  warning: 'border-warning/20 bg-warning/10 text-warning',
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
      <div role="alert" className={`rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm ${classes}`}>
        {mensaje}
      </div>
    </div>
  );
}