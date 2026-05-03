import './mf.css';
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
      if (!cancelled) setReportes(data);
    }
    cargarReportes();
    return () => { cancelled = true; };
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
        if (!cancelled) setReporteSeleccionado(detalle);
      } catch {
        if (!cancelled) {
          setToast({ id: Date.now(), mensaje: 'No se pudo cargar el detalle del reporte', tipo: 'error', visible: true });
          setReporteSeleccionadoId(null);
        }
      } finally {
        if (!cancelled) setCargandoDetalle(false);
      }
    }
    cargarDetalle();
    return () => { cancelled = true; };
  }, [reporteSeleccionadoId]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ id: Date.now(), mensaje, tipo, visible: true });
  };

  const handleReporteGenerado = async () => {
    const data = await getReportes();
    setReportes(data);
    mostrarToast('Reporte generado correctamente', 'success');
  };

  const handleErrorGeneracion = (error) => {
    mostrarToast(error instanceof Error ? error.message : 'No se pudo generar el reporte', 'error');
  };

  const volverALista = () => {
    setReporteSeleccionadoId(null);
    setReporteSeleccionado(null);
  };

  return (
    <>
    <style>{`
      table, thead, tbody, tr, th, td,
      button, span, div, p, label, input, select {
        font-family: 'Inter', Arial, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
      th { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
      td { font-size: 0.75rem; font-weight: 500; }
    `}</style>

    {cargandoDetalle ? (
      <div className="w-full space-y-6">
        <div className="h-32 animate-pulse rounded-xl border border-slate-100 bg-white shadow-sm" />
        <div className="h-48 animate-pulse rounded-xl border border-slate-100 bg-white shadow-sm" />
      </div>
    ) : reporteSeleccionado ? (
      <DetalleReporte reporte={reporteSeleccionado} onVolver={volverALista} />
    ) : (
      <div className="w-full space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Panel de Control</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Reportes</h2>
          <p className="mt-1 text-sm text-slate-500">Generación y consulta de informes ejecutivos · Grupo Cordillera</p>
        </div>

        <FormularioReporte onGenerado={handleReporteGenerado} onError={handleErrorGeneracion} />
        <ListaReportes reportes={reportes} onVerDetalle={(id) => setReporteSeleccionadoId(id)} />
      </div>
    )}

    <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} key={toast.id} />
    </>
  );
}
