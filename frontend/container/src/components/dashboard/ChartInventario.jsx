// MS2 · Inventario — Horizontal BarChart
// Barras slate-300 por defecto → Rojo Coral (#FF6B6B) si valor > umbralCritico
import React from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const CORAL = '#FF6B6B';
const SLATE = '#CBD5E1';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const pt = payload[0]?.payload;
  const isCritical = pt?.valor > payload[0]?.payload?._umbral;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{pt?.fecha}</p>
      <p className={`mt-0.5 font-medium ${isCritical ? 'text-red-500' : 'text-slate-500'}`}>
        {pt?.valor?.toFixed(1)} %
      </p>
    </div>
  );
}

export default function ChartInventario({ data, umbralCritico }) {
  // Inject umbral into each point so tooltip can access it
  const enriched = data.map((d) => ({ ...d, _umbral: umbralCritico }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        layout="vertical"
        data={enriched}
        margin={{ top: 4, right: 24, left: -8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />

        <XAxis
          type="number"
          domain={[0, Math.max(umbralCritico * 1.6, 12)]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="fecha"
          width={36}
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />

        {/* Umbral crítico reference line */}
        <ReferenceLine
          x={umbralCritico}
          stroke={CORAL}
          strokeDasharray="4 3"
          strokeWidth={1.5}
          label={{ value: `Crítico ${umbralCritico}%`, position: 'top', fill: CORAL, fontSize: 9, fontFamily: 'Inter, system-ui' }}
        />

        <Bar dataKey="valor" radius={[0, 4, 4, 0]} maxBarSize={14} isAnimationActive={false}>
          {enriched.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.valor > umbralCritico ? CORAL : SLATE}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
