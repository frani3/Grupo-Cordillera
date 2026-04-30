import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

function MiniTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const pt = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-semibold text-gray-800">{pt?.valorFormateado ?? pt?.valor}</p>
      <p className="text-[10px] text-gray-400">{pt?.fecha}</p>
    </div>
  );
}

// id prop ensures each card gets a unique SVG gradient ID (avoids DOM conflicts)
export default function SparkLine({ id = 'default', data, color = '#2563EB', height = 60 }) {
  const gradientId = `sg-${id}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data ?? []} margin={{ top: 4, right: 2, left: 2, bottom: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3.5, fill: color, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <Tooltip
          content={<MiniTooltip />}
          cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
