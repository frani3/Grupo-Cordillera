import React, { useState } from 'react';
import { generarReporte } from '../services/reportesService';

const MONTHS = [
  { value: 1,  label: 'Enero'      },
  { value: 2,  label: 'Febrero'    },
  { value: 3,  label: 'Marzo'      },
  { value: 4,  label: 'Abril'      },
  { value: 5,  label: 'Mayo'       },
  { value: 6,  label: 'Junio'      },
  { value: 7,  label: 'Julio'      },
  { value: 8,  label: 'Agosto'     },
  { value: 9,  label: 'Septiembre' },
  { value: 10, label: 'Octubre'    },
  { value: 11, label: 'Noviembre'  },
  { value: 12, label: 'Diciembre'  },
];

const YEARS = [2024, 2025, 2026];

const defaultForm = {
  tipo: 'RESUMEN_MENSUAL',
  mes: '4',
  anio: '2026',
  periodo1Desde: '2026-01-01',
  periodo1Hasta: '2026-01-31',
  periodo2Desde: '2026-02-01',
  periodo2Hasta: '2026-02-28',
};

const fieldLabel = 'block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500';
const fieldInput = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function SpinnerInline() {
  return <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />;
}

export default function FormularioReporte({ onGenerado, onError }) {
  const [form, setForm] = useState(defaultForm);
  const [generando, setGenerando] = useState(false);
  const esResumenMensual = form.tipo === 'RESUMEN_MENSUAL';

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGenerando(true);
    try {
      const reporte = await generarReporte(form.tipo, {
        mes: Number(form.mes),
        anio: Number(form.anio),
        periodo1Desde: form.periodo1Desde,
        periodo1Hasta: form.periodo1Hasta,
        periodo2Desde: form.periodo2Desde,
        periodo2Hasta: form.periodo2Hasta,
        usuarioQueGenero: 'analista.cordillera@grupocordillera.cl',
      });
      if (onGenerado) await onGenerado(reporte);
    } catch (error) {
      if (onError) onError(error);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Generación</p>
        <h3 className="mt-1 text-base font-semibold text-[#0F172A]">Nuevo Reporte</h3>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4">
        <div className={esResumenMensual ? 'flex flex-col gap-4 xl:flex-row xl:items-end' : 'flex flex-col gap-4'}>

          <label className={`${fieldLabel} xl:w-56`}>
            Tipo de reporte
            <select value={form.tipo} onChange={(e) => update('tipo', e.target.value)} className={fieldInput}>
              <option value="RESUMEN_MENSUAL">Resumen Mensual</option>
              <option value="COMPARATIVO_HISTORICO">Comparativo Histórico</option>
            </select>
          </label>

          {esResumenMensual ? (
            <div className="flex gap-4">
              <label className={`${fieldLabel} xl:w-40`}>
                Mes
                <select value={form.mes} onChange={(e) => update('mes', e.target.value)} className={fieldInput}>
                  {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </label>
              <label className={`${fieldLabel} xl:w-32`}>
                Año
                <select value={form.anio} onChange={(e) => update('anio', e.target.value)} className={fieldInput}>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Período 1</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={fieldLabel}>
                    Desde
                    <input type="date" value={form.periodo1Desde} onChange={(e) => update('periodo1Desde', e.target.value)} className={fieldInput} />
                  </label>
                  <label className={fieldLabel}>
                    Hasta
                    <input type="date" value={form.periodo1Hasta} onChange={(e) => update('periodo1Hasta', e.target.value)} className={fieldInput} />
                  </label>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Período 2</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={fieldLabel}>
                    Desde
                    <input type="date" value={form.periodo2Desde} onChange={(e) => update('periodo2Desde', e.target.value)} className={fieldInput} />
                  </label>
                  <label className={fieldLabel}>
                    Hasta
                    <input type="date" value={form.periodo2Hasta} onChange={(e) => update('periodo2Hasta', e.target.value)} className={fieldInput} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={generando}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {generando ? <><SpinnerInline /><span>Generando...</span></> : <span>Generar reporte →</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
