import React, { useState } from 'react';
import { generarReporte } from '../services/reportesService';

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
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

function SpinnerInline() {
  return (
    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
  );
}

export default function FormularioReporte({ onGenerado, onError }) {
  const [form, setForm] = useState(defaultForm);
  const [generando, setGenerando] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

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

      if (onGenerado) {
        await onGenerado(reporte);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setGenerando(false);
    }
  };

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Generación</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Crear nuevo reporte</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Tipo de reporte
            <select
              value={form.tipo}
              onChange={(event) => update('tipo', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
            >
              <option value="RESUMEN_MENSUAL">RESUMEN_MENSUAL</option>
              <option value="COMPARATIVO_HISTORICO">COMPARATIVO_HISTORICO</option>
            </select>
          </label>

          {form.tipo === 'RESUMEN_MENSUAL' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Mes
                <select
                  value={form.mes}
                  onChange={(event) => update('mes', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                >
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Año
                <select
                  value={form.anio}
                  onChange={(event) => update('anio', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C96A00]">Período 1</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Fecha desde
                      <input
                        type="date"
                        value={form.periodo1Desde}
                        onChange={(event) => update('periodo1Desde', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Fecha hasta
                      <input
                        type="date"
                        value={form.periodo1Hasta}
                        onChange={(event) => update('periodo1Hasta', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C96A00]">Período 2</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Fecha desde
                      <input
                        type="date"
                        value={form.periodo2Desde}
                        onChange={(event) => update('periodo2Desde', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Fecha hasta
                      <input
                        type="date"
                        value={form.periodo2Hasta}
                        onChange={(event) => update('periodo2Hasta', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C96A00]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={generando}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#C96A00] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a75700] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {generando ? (
            <>
              <SpinnerInline />
              <span>Generando...</span>
            </>
          ) : (
            <span>Generar reporte</span>
          )}
        </button>
      </form>
    </section>
  );
}