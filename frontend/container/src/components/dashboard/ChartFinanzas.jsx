// MS4 · Finanzas — BarChart robusto con etiquetas $ M y línea de meta
import React from 'react';
import {
  Bar, BarChart, CartesianGrid, LabelList, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

function fmtM(v) {
  return `$${(v / 1_000_000).toFixed(1)}M`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{payload[0]?.payload?.mes}</p>
      <p className="mt-0.5 font-medium text-blue-600">{fmtM(payload[0]?.value ?? 0)}</p>
    </div>
  );
}

export default function ChartFinanzas({ data, meta }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

        <XAxis
          dataKey="mes"
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={fmtM}
          tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }}
          axisLine={false}
          tickLine={false}
          domain={[0, meta * 1.15]}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />

        {/* Meta reference */}
        <ReferenceLine
          y={meta}
          stroke="#2563EB"
          strokeDasharray="5 4"
          strokeWidth={1.5}
          label={{ value: `Meta ${fmtM(meta)}`, position: 'insideTopRight', fill: '#2563EB', fontSize: 9, fontFamily: 'Inter, system-ui' }}
        />

        <Bar
          dataKey="valor"
          fill="#2563EB"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="valor"
            position="top"
            formatter={fmtM}
            style={{ fontSize: 9, fill: '#64748B', fontFamily: 'Inter, system-ui', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
