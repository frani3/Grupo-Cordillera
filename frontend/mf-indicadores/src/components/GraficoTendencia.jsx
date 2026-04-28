import React, { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getHistorico } from '../services/kpiService';

function formatValue(valor, unidad) {
  if (unidad === 'CLP') {
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(valor);
  }

  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(valor)}%`;
}

function DotPersonalizado(props) {
  const { cx, cy, payload, threshold } = props;

  if (cx == null || cy == null) {
    return null;
  }

  const isBelowThreshold = payload.valor < threshold;

  return <circle cx={cx} cy={cy} r={4.5} fill={isBelowThreshold ? '#DC2626' : '#2563EB'} stroke="#ffffff" strokeWidth={2} />;
}

function TooltipPersonalizado({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
      <p className="font-semibold text-gray-900">{point.fechaCompleta}</p>
      <p className="mt-1 text-gray-600">Valor: {point.valorFormateado}</p>
    </div>
  );
}

export default function GraficoTendencia({ kpiId, nombre, periodo }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [state, setState] = useState({ kpi: null, historico: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadHistorico() {
      try {
        setLoading(true);
        setError(false);
        const data = await getHistorico(kpiId, periodo);

        if (cancelled) {
          return;
        }

        const historico = data.historico.map((item) => ({
          ...item,
          valorFormateado: formatValue(item.valor, data.kpi.unidad),
        }));

        setState({
          kpi: data.kpi,
          historico,
        });
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistorico();

    return () => {
      cancelled = true;
    };
  }, [kpiId, periodo]);

  const series = useMemo(() => state.historico, [state.historico]);

  return (
    <div className="mt-5 space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4" onClick={(event) => event.stopPropagation()}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Tendencia</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">{nombre}</h3>
        </div>

      </div>

      <div className="h-[320px] rounded-xl border border-gray-100 bg-white p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">Cargando tendencia...</div>
        ) : error || !state.kpi ? (
          <div className="flex h-full items-center justify-center text-sm font-medium text-danger">
            No se pudo cargar la tendencia.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" tickFormatter={(value) => formatValue(value, state.kpi.unidad)} />
              <Tooltip content={<TooltipPersonalizado />} />
              <ReferenceLine y={state.kpi.meta} stroke="#2563EB" strokeDasharray="5 5" label={{ value: 'Meta', position: 'insideTopRight', fill: '#2563EB', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#2563EB"
                strokeWidth={3}
                dot={(dotProps) => <DotPersonalizado {...dotProps} threshold={state.kpi.umbralMin} />}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}