import React, { useEffect, useState } from 'react';
import DetalleReporte from './components/DetalleReporte';
import FormularioReporte from './components/FormularioReporte';
import ListaReportes from './components/ListaReportes';
import Toast from './components/Toast';
import { getReporteDetalle, getReportes } from './services/reportesService';

export default function App() {
  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionadoId, setReporteSeleccionadoId] = useState(null);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [toast, setToast] = useState({ id: 0, mensaje: '', tipo: 'success', visible: false });

  useEffect(() => {
    let cancelled = false;

    async function cargarReportes() {
      const data = await getReportes();
      if (!cancelled) {
        setReportes(data);
      }
    }

    cargarReportes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function cargarDetalle() {
      if (!reporteSeleccionadoId) {
        setReporteSeleccionado(null);
        setCargandoDetalle(false);
        return;
      }

      setCargandoDetalle(true);
      try {
        const detalle = await getReporteDetalle(reporteSeleccionadoId);
        if (!cancelled) {
          setReporteSeleccionado(detalle);
        }
      } catch {
        if (!cancelled) {
          setToast({
            id: Date.now(),
            mensaje: 'No se pudo cargar el detalle del reporte',
            tipo: 'error',
            visible: true,
          });
          setReporteSeleccionadoId(null);
        }
      } finally {
        if (!cancelled) {
          setCargandoDetalle(false);
        }
      }
    }

    cargarDetalle();

    return () => {
      cancelled = true;
    };
  }, [reporteSeleccionadoId]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({
      id: Date.now(),
      mensaje,
      tipo,
      visible: true,
    });
  };

  const recargarReportes = async () => {
    const data = await getReportes();
    setReportes(data);
  };

  const handleReporteGenerado = async () => {
    await recargarReportes();
    mostrarToast('Reporte generado correctamente', 'success');
  };

  const handleErrorGeneracion = (error) => {
    const mensaje = error instanceof Error ? error.message : 'No se pudo generar el reporte';
    mostrarToast(mensaje, 'error');
  };

  const volverALista = () => {
    setReporteSeleccionadoId(null);
    setReporteSeleccionado(null);
  };

  const contenidoPrincipal = reporteSeleccionado ? (
    <DetalleReporte reporte={reporteSeleccionado} onVolver={volverALista} />
  ) : (
    <div className="space-y-8 pb-8">
      <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary-600">Grupo Cordillera</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">Gestión de reportes</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
            Genera y consulta reportes mockeados de forma aislada mientras el backend queda listo.
          </p>
        </div>
      </section>

      <FormularioReporte onGenerado={handleReporteGenerado} onError={handleErrorGeneracion} />

      <ListaReportes
        reportes={reportes}
        onVerDetalle={(id) => setReporteSeleccionadoId(id)}
      />
    </div>
  );

  return (
    <>
      {cargandoDetalle ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
          Cargando detalle del reporte...
        </div>
      ) : (
        contenidoPrincipal
      )}

      <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} key={toast.id} />
    </>
  );
}