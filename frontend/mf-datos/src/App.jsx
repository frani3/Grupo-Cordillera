import './mf.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TablaCompacta from './components/TablaCompacta';
import TablaAuditoria from './components/TablaAuditoria';
import { getEstadoCircuitos, getRegistros } from './services/datosService';

// ── Constants ────────────────────────────────────────────────────────────────

const MICROSERVICIOS = [
  { ms: 'MS1', fuente: 'POS',        label: 'Punto de Venta',      msLabel: 'MS1 · Punto de Venta'      },
  { ms: 'MS2', fuente: 'INVENTARIO', label: 'Inventario',           msLabel: 'MS2 · Inventario'           },
  { ms: 'MS3', fuente: 'ECOMMERCE',  label: 'E-commerce',           msLabel: 'MS3 · E-commerce'           },
  { ms: 'MS4', fuente: 'FINANZAS',   label: 'Finanzas',             msLabel: 'MS4 · Finanzas'             },
  { ms: 'MS5', fuente: 'CLIENTES',   label: 'Atención al Cliente',  msLabel: 'MS5 · Atención al Cliente'  },
];

const TAMANO_PAGINA = 10;

// ── Color palette per circuit state ──────────────────────────────────────────

function circuitoColor(estado) {
  if (estado === 'CLOSED')
    return {
      dot:       'bg-emerald-500',
      ping:      'bg-emerald-400',
      ring:      'ring-emerald-300',
      activeRing:'ring-2 ring-offset-2 ring-emerald-300',
      text:      'text-emerald-600',
      badgeBg:   'bg-emerald-50',
      badgeRing: 'ring-emerald-200',
      label:     'Operativo',
    };
  if (estado === 'HALF_OPEN')
    return {
      dot:       'bg-amber-400',
      ping:      'bg-amber-300',
      ring:      'ring-amber-300',
      activeRing:'ring-2 ring-offset-2 ring-amber-300',
      text:      'text-amber-600',
      badgeBg:   'bg-amber-50',
      badgeRing: 'ring-amber-200',
      label:     'Sincronizando',
    };
  if (estado === 'OPEN')
    return {
      dot:       'bg-red-500',
      ping:      'bg-red-400',
      ring:      'ring-red-300',
      activeRing:'ring-2 ring-offset-2 ring-red-300',
      text:      'text-red-600',
      badgeBg:   'bg-red-50',
      badgeRing: 'ring-red-200',
      label:     'Falla de Enlace',
    };
  return {
    dot:       'bg-gray-300',
    ping:      'bg-gray-200',
    ring:      'ring-gray-200',
    activeRing:'',
    text:      'text-gray-400',
    badgeBg:   'bg-gray-50',
    badgeRing: 'ring-gray-200',
    label:     'Cargando',
  };
}

// ── Banner components ─────────────────────────────────────────────────────────

function BannerDown({ msLabel }) {
  return (
    <div className="flex items-start gap-3 border-b border-red-100 bg-red-50 px-5 py-3.5">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17
             2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10
             5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1
             1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-xs font-semibold text-red-700">Dato de Respaldo</p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-red-500">
          La integración <strong>{msLabel}</strong> no está disponible (Debezium / RabbitMQ).
          Se muestran registros del último snapshot válido.
          Los filtros de tiempo real están deshabilitados.
        </p>
      </div>
    </div>
  );
}

function BannerDegraded({ msLabel }) {
  return (
    <div className="flex items-start gap-3 border-b border-amber-100 bg-amber-50 px-5 py-3.5">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0
             012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459
             2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25
             0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-xs font-semibold text-amber-700">Sincronizando</p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-amber-600">
          <strong>{msLabel}</strong> está recuperando la conexión CDC.
          Los registros pueden estar incompletos hasta restablecer el enlace.
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function App({ rolUsuario }) {
  const [circuitos,         setCircuitos]         = useState([]);
  const [loadingCircuitos,  setLoadingCircuitos]  = useState(true);
  const [tabActiva,         setTabActiva]          = useState('POS');
  const [registros,         setRegistros]          = useState([]);
  const [pagina,            setPagina]             = useState(1);
  const [totalPaginas,      setTotalPaginas]       = useState(1);
  const [totalRegistros,    setTotalRegistros]     = useState(0);
  const [loadingRegistros,  setLoadingRegistros]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    getEstadoCircuitos()
      .then((data) => { if (!cancelled) { setCircuitos(data); setLoadingCircuitos(false); } })
      .catch(()    => { if (!cancelled) setLoadingCircuitos(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingRegistros(true);
    getRegistros(tabActiva, '', '', pagina, TAMANO_PAGINA)
      .then((data) => {
        if (!cancelled) {
          setRegistros(data.registros);
          setTotalPaginas(data.totalPaginas);
          setTotalRegistros(data.totalRegistros);
          setLoadingRegistros(false);
        }
      })
      .catch(() => { if (!cancelled) setLoadingRegistros(false); });
    return () => { cancelled = true; };
  }, [tabActiva, pagina]);

  const handleTab = useCallback((fuente) => {
    setTabActiva(fuente);
    setPagina(1);
  }, []);

  const circuitosPorMs = useMemo(
    () => Object.fromEntries(circuitos.map((c) => [c.ms, c])),
    [circuitos],
  );

  const activeMs   = MICROSERVICIOS.find((m) => m.fuente === tabActiva);
  const activeCirc = circuitosPorMs[activeMs?.ms];
  const activePip  = circuitoColor(loadingCircuitos ? null : activeCirc?.estado);
  const isDown     = activeCirc?.estado === 'OPEN';
  const isDegraded = activeCirc?.estado === 'HALF_OPEN';

  return (
    <>
    {/* ── Guaranteed font lock — runs at mount regardless of CSS bundling ── */}
    <style>{`
      table, thead, tbody, tr, th, td,
      button, span, div, p, label, input, select {
        font-family: 'Inter', Arial, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
    `}</style>
    <section className="w-full max-w-full space-y-6">

      {/* ── Data Explorer — Block 2 ── */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

        {/* Tab bar */}
        <div className="flex items-end gap-0.5 border-b border-gray-100 px-4 pt-4">
          {MICROSERVICIOS.map(({ ms, fuente, label }) => {
            const c        = circuitosPorMs[ms];
            const isActive = tabActiva === fuente;
            const pip      = circuitoColor(loadingCircuitos ? null : c?.estado);
            return (
              <button
                key={fuente}
                type="button"
                onClick={() => handleTab(fuente)}
                className={`relative flex flex-col items-center gap-1.5 rounded-t-lg px-5 py-3 text-[11px] font-semibold transition-colors focus:outline-none ${
                  isActive
                    ? 'border border-b-0 border-blue-200 bg-white text-blue-700 shadow-[0_1px_0_0_white]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${pip.dot} ${
                    isActive ? pip.activeRing : ''
                  }`}
                  aria-label={`${ms}: ${pip.label}`}
                />
                {label}
              </button>
            );
          })}
        </div>

        {/* Sub-header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {activeMs?.msLabel}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-500">{totalRegistros} registros</span>
            {activeCirc?.ultimoEventoExitoso && (
              <>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">
                  Últ. éxito: {activeCirc.ultimoEventoExitoso}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCirc?.fallasConsecutivas > 0 && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-600 ring-1 ring-red-200">
                {activeCirc.fallasConsecutivas}{' '}
                falla{activeCirc.fallasConsecutivas !== 1 ? 's' : ''}{' '}
                consecutiva{activeCirc.fallasConsecutivas !== 1 ? 's' : ''}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${activePip.text} ring-1 ${activePip.badgeRing} ${activePip.badgeBg}`}
            >
              {activePip.label}
            </span>
          </div>
        </div>

        {/* Ethical transparency banners */}
        {isDown     && <BannerDown      msLabel={activeMs?.msLabel} />}
        {isDegraded && <BannerDegraded  msLabel={activeMs?.msLabel} />}

        <TablaCompacta
          registros={registros}
          fuente={tabActiva}
          loading={loadingRegistros}
          pagina={pagina}
          totalPaginas={totalPaginas}
          onAnterior={() => setPagina((p) => Math.max(1, p - 1))}
          onSiguiente={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          filtersDisabled={isDown}
        />
      </div>

      {/* ── Audit log — Block 3 (ADMIN only) ── */}
      {rolUsuario === 'ADMINISTRADOR' && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Administración
            </p>
            <h3 className="mt-1 text-base font-semibold text-[#0F172A]">
              Historial de Auditoría
            </h3>
          </div>
          <div className="px-5 pb-5 pt-4">
            <TablaAuditoria rolUsuario={rolUsuario} />
          </div>
        </div>
      )}
    </section>
    </>
  );
}
