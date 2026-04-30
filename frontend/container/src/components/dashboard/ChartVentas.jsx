// MS1 · Ventas — AreaChart con gradiente azul + línea de meta constante
import React from 'react';
import {
  Area, AreaChart, CartesianGrid, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{payload[0]?.payload?.fecha}</p>
      <p className="mt-0.5 text-slate-500">{payload[0]?.value?.toFixed(1)} %</p>
    </div>
  );
}

export default function ChartVentas({ data, meta }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[50, 105]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeOpacity: 0.2 }} />

        {/* Meta reference line */}
        <ReferenceLine
          y={meta}
          stroke="#2563EB"
          strokeDasharray="5 4"
          strokeWidth={1.5}
          label={{ value: `Meta ${meta}%`, position: 'insideTopRight', fill: '#2563EB', fontSize: 9, fontFamily: 'Inter, system-ui' }}
        />

        <Area
          type="monotone"
          dataKey="valor"
          stroke="#2563EB"
          strokeWidth={2}
          fill="url(#gradVentas)"
          dot={false}
          activeDot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
