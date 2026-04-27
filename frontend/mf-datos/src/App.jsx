import React, { useEffect, useState } from 'react';
import EstadoSistema from './components/EstadoSistema';
import FiltrosDatos from './components/FiltrosDatos';
import TablaAuditoria from './components/TablaAuditoria';
import TablaRegistros from './components/TablaRegistros';
import { getEstadoCircuitos, getRegistros } from './services/datosService';

const TAMANO_PAGINA = 5;

const filtrosIniciales = {
  fuente: 'Todas',
  desde: '',
  hasta: '',
};

export default function App({ rolUsuario }) {
  const [estadoCircuitos, setEstadoCircuitos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosIniciales);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingRegistros, setLoadingRegistros] = useState(true);
  const [errorEstados, setErrorEstados] = useState('');
  const [errorRegistros, setErrorRegistros] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadEstadoCircuitos() {
      try {
        const estados = await getEstadoCircuitos();
        if (!cancelled) {
          setEstadoCircuitos(estados);
        }
      } catch {
        if (!cancelled) {
          setErrorEstados('No se pudieron cargar los datos de integración.');
        }
      } finally {
        if (!cancelled) {
          setLoadingEstados(false);
        }
      }
    }

    loadEstadoCircuitos();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRegistros() {
      try {
        setLoadingRegistros(true);
        setErrorRegistros('');
        const respuesta = await getRegistros(
          filtrosAplicados.fuente,
          filtrosAplicados.desde,
          filtrosAplicados.hasta,
          paginaActual,
          TAMANO_PAGINA
        );

        if (!cancelled) {
          setRegistros(respuesta.registros);
          setTotalPaginas(respuesta.totalPaginas);
        }
      } catch {
        if (!cancelled) {
          setErrorRegistros('No se pudieron cargar los registros consolidados.');
        }
      } finally {
        if (!cancelled) {
          setLoadingRegistros(false);
        }
      }
    }

    loadRegistros();

    return () => {
      cancelled = true;
    };
  }, [filtrosAplicados, paginaActual]);

  const mensajeError = errorEstados || errorRegistros;

  const aplicarFiltros = (filtros) => {
    setPaginaActual(1);
    setFiltrosAplicados(filtros);
  };

  const limpiarFiltros = () => {
    setPaginaActual(1);
    setFiltrosAplicados(filtrosIniciales);
  };

  return (
    <main className="space-y-8 pb-8">
      <section className="space-y-4 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#1E5FA8]">Grupo Cordillera</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Gestión de datos organizacionales</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Consola de monitoreo para integrar POS, inventario, e-commerce, finanzas y clientes con información simulada.
            </p>
          </div>

          <div className="rounded-full bg-[#1E5FA8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#1E5FA8]">
            Rol activo: {rolUsuario ?? 'Sin definir'}
          </div>
        </div>

        {mensajeError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {mensajeError}
          </div>
        ) : null}
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <EstadoSistema estados={loadingEstados ? [] : estadoCircuitos} loading={loadingEstados} />
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Exploración de registros</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Consolidado de datos</h3>
        </div>

        <FiltrosDatos
          value={filtrosAplicados}
          onFiltrar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
        />

        <TablaRegistros
          registros={loadingRegistros ? [] : registros}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onAnterior={() => setPaginaActual((value) => Math.max(1, value - 1))}
          onSiguiente={() => setPaginaActual((value) => Math.min(totalPaginas, value + 1))}
          loading={loadingRegistros}
        />
      </section>

      {rolUsuario === 'ADMINISTRADOR' ? (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Administración</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Historial de auditoría técnica</h3>
          </div>

          <TablaAuditoria rolUsuario={rolUsuario} />
        </section>
      ) : null}
    </main>
  );
}