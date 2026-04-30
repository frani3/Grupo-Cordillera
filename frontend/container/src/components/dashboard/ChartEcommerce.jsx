// MS3 · E-commerce — ComposedChart: barras de volumen + línea punteada OTD
import React from 'react';
import {
  Bar, CartesianGrid, ComposedChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const pedidos = payload.find((p) => p.dataKey === 'pedidos');
  const otd     = payload.find((p) => p.dataKey === 'otd');
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{label}</p>
      {pedidos && <p className="mt-0.5 text-slate-500">Pedidos: <span className="font-medium text-slate-700">{pedidos.value}</span></p>}
      {otd     && <p className="text-slate-500">OTD: <span className="font-medium text-blue-600">{otd.value?.toFixed(1)} %</span></p>}
    </div>
  );
}

export default function ChartEcommerce({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 8, right: 36, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

        {/* Left axis — pedidos (volume) */}
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="pedidos"
          domain={[0, 600]}
          tick={{ fontSize: 10, fill: '#CBD5E1', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v}
        />

        {/* Right axis — OTD % */}
        <YAxis
          yAxisId="otd"
          orientation="right"
          domain={[75, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />

        {/* Volume bars — neutral slate */}
        <Bar
          yAxisId="pedidos"
          dataKey="pedidos"
          fill="#E2E8F0"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          name="Pedidos"
          isAnimationActive={false}
        />

        {/* OTD dotted line — corporate blue */}
        <Line
          yAxisId="otd"
          type="monotone"
          dataKey="otd"
          stroke="#2563EB"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ fill: '#2563EB', r: 3.5, stroke: '#fff', strokeWidth: 1.5 }}
          activeDot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
          name="OTD %"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
