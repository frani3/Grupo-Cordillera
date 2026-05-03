import React from 'react';
import { INDICADORES_DATA } from '../data/indicadoresData';
import ChartAtencion   from '../components/dashboard/ChartAtencion';
import ChartEcommerce  from '../components/dashboard/ChartEcommerce';
import ChartFinanzas   from '../components/dashboard/ChartFinanzas';
import ChartInventario from '../components/dashboard/ChartInventario';
import ChartVentas     from '../components/dashboard/ChartVentas';
import KpiWidget       from '../components/dashboard/KpiWidget';

// ── Executive Dashboard ───────────────────────────────────────────────────────

export default function IndicadoresPage() {
  const { MS1, MS2, MS3, MS4, MS5 } = INDICADORES_DATA;

  return (
    <div className="w-full space-y-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
          Panel de Control
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
          Indicadores de Negocio
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          5 KPIs críticos · MS1 – MS5 · Grupo Cordillera
        </p>
      </div>

      {/* ══ 12-col Executive Grid ══════════════════════════════════════════════
          Row 1 │ MS1 Ventas (col-8) ─────────────────── │ MS5 Atención (col-4) │
          Row 2 │ MS2 Inventario (col-5) │ MS4 Finanzas (col-7) ───────────────── │
          Row 3 │ MS3 E-commerce (col-12) ──────────────────────────────────────── │
      ════════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">

        {/* ── Row 1 ── */}

        {/* MS1 · Ventas — Área grande */}
        <div className="col-span-12 lg:col-span-8">
          <KpiWidget kpi={MS1}>
            <ChartVentas data={MS1.historico7d} meta={MS1.meta} />
          </KpiWidget>
        </div>

        {/* MS5 · Atención — Donut compacto */}
        <div className="col-span-12 lg:col-span-4">
          <KpiWidget kpi={MS5}>
            <ChartAtencion valor={MS5.valor} />
          </KpiWidget>
        </div>

        {/* ── Row 2 ── */}

        {/* MS2 · Inventario — Barras horizontales */}
        <div className="col-span-12 md:col-span-5">
          <KpiWidget kpi={MS2}>
            <ChartInventario
              data={MS2.historico7d}
              umbralCritico={MS2.umbralMin}
            />
          </KpiWidget>
        </div>

        {/* MS4 · Finanzas — Barras mensuales con labels */}
        <div className="col-span-12 md:col-span-7">
          <KpiWidget kpi={MS4}>
            <ChartFinanzas data={MS4.historicoMensual} meta={MS4.meta} />
          </KpiWidget>
        </div>

        {/* ── Row 3 ── */}

        {/* MS3 · E-commerce — ComposedChart ancho completo */}
        <div className="col-span-12">
          <KpiWidget kpi={MS3}>
            <ChartEcommerce data={MS3.composedData} />
          </KpiWidget>
        </div>

      </div>
    </div>
  );
}
