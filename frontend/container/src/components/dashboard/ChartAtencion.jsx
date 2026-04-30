// MS5 · Atención — Donut PieChart con valor central absoluto
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const BLUE  = '#2563EB';
const TRACK = '#E2E8F0';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{payload[0]?.name}</p>
      <p className="mt-0.5 text-slate-500">{payload[0]?.value?.toFixed(1)} %</p>
    </div>
  );
}

export default function ChartAtencion({ valor }) {
  const remaining = Number((100 - valor).toFixed(1));

  const segments = [
    { name: 'Resuelto',   value: valor    },
    { name: 'Pendiente',  value: remaining },
  ];

  return (
    <div className="relative h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="82%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill={BLUE}  />
            <Cell fill={TRACK} />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label — positioned over the donut hole */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[1.65rem] font-bold leading-none text-[#0F172A]">{valor}%</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">resolución</p>
      </div>
    </div>
  );
}
