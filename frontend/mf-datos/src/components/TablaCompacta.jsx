import React, { useMemo } from 'react';

// ── Formatters ───────────────────────────────────────────────────────────────

function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatCLP(value) {
  if (typeof value !== 'number') return String(value);
  if (Math.abs(value) >= 1_000_000)
    return `$ ${(value / 1_000_000).toFixed(2)} M`;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Column definitions per source ────────────────────────────────────────────

const COLUMNS = {
  POS: [
    { key: 'id',       label: 'ID',        cell: (r) => r.id,                          mono: true  },
    { key: 'fecha',    label: 'Fecha',     cell: (r) => formatDate(r.fechaCaptura)                 },
    { key: 'producto', label: 'Producto',  cell: (r) => r.resumen?.producto ?? '—'                 },
    { key: 'monto',    label: 'Monto',     cell: (r) => formatCLP(r.resumen?.monto),    right: true },
    { key: 'sucursal', label: 'Sucursal',  cell: (r) => r.resumen?.sucursal ?? '—'                 },
  ],
  INVENTARIO: [
    { key: 'id',       label: 'ID',        cell: (r) => r.id,                           mono: true  },
    { key: 'fecha',    label: 'Fecha',     cell: (r) => formatDate(r.fechaCaptura)                  },
    { key: 'producto', label: 'Producto',  cell: (r) => r.resumen?.producto ?? '—'                  },
    { key: 'stock',    label: 'Stock',     cell: (r) => r.resumen?.stock ?? '—',         right: true },
    { key: 'bodega',   label: 'Bodega',    cell: (r) => r.resumen?.bodega ?? '—'                    },
  ],
  ECOMMERCE: [
    { key: 'id',     label: 'ID',      cell: (r) => r.id,                          mono: true  },
    { key: 'fecha',  label: 'Fecha',   cell: (r) => formatDate(r.fechaCaptura)                 },
    { key: 'pedido', label: 'Pedido',  cell: (r) => r.resumen?.pedido ?? '—',      mono: true  },
    { key: 'total',  label: 'Total',   cell: (r) => formatCLP(r.resumen?.total),   right: true },
    { key: 'canal',  label: 'Canal',   cell: (r) => r.resumen?.canal ?? '—'                   },
  ],
  FINANZAS: [
    { key: 'id',     label: 'ID',              cell: (r) => r.id,                           mono: true  },
    { key: 'fecha',  label: 'Fecha',           cell: (r) => formatDate(r.fechaCaptura)                  },
    { key: 'cuenta', label: 'Cuenta',          cell: (r) => r.resumen?.cuenta ?? '—'                    },
    { key: 'monto',  label: 'Monto',           cell: (r) => formatCLP(r.resumen?.monto),    right: true },
    { key: 'centro', label: 'Centro de Costo', cell: (r) => r.resumen?.centroCosto ?? '—'               },
  ],
  CLIENTES: [
    { key: 'id',       label: 'ID',        cell: (r) => r.id,                    mono: true },
    { key: 'fecha',    label: 'Fecha',     cell: (r) => formatDate(r.fechaCaptura)          },
    { key: 'cliente',  label: 'Cliente',   cell: (r) => r.resumen?.cliente ?? '—'           },
    { key: 'segmento', label: 'Segmento',  cell: (r) => r.resumen?.segmento ?? '—'          },
    { key: 'estado',   label: 'Estado',    cell: (r) => <EstadoCliente value={r.resumen?.estado} /> },
  ],
};

function EstadoCliente({ value }) {
  if (!value) return <span className="text-gray-400">—</span>;
  const isRisk = value.toLowerCase().includes('riesgo');
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isRisk
          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      }`}
    >
      {value}
    </span>
  );
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonRows({ cols }) {
  return Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className="border-b border-gray-50">
      {Array.from({ length: cols }, (__, j) => (
        <td key={j} className="px-3 py-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  ));
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TablaCompacta({
  registros,
  fuente,
  loading,
  pagina,
  totalPaginas,
  onAnterior,
  onSiguiente,
  filtersDisabled = false,
}) {
  const columns = useMemo(() => COLUMNS[fuente] ?? COLUMNS.POS, [fuente]);

  return (
    <div>
      {/* Table */}
      <div className="no-scrollbar overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b border-slate-100 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${
                    col.right ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <SkeletonRows cols={columns.length} />
            ) : registros.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-xs text-gray-400"
                >
                  No hay registros para esta fuente.
                </td>
              </tr>
            ) : (
              registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50/70"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 text-xs font-medium text-slate-700 ${
                        col.right ? 'text-right tabular-nums' : ''
                      } ${col.mono ? 'text-slate-400' : ''}`}
                    >
                      {col.cell(registro)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Compact pagination */}
      <div className={`flex items-center justify-between border-t border-gray-50 px-4 py-3 ${filtersDisabled ? 'opacity-40' : ''}`}>
        <span className="text-[11px] text-gray-400">
          {filtersDisabled ? 'Snapshot · ' : ''}Pág. {pagina} / {totalPaginas}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAnterior}
            disabled={pagina <= 1 || loading || filtersDisabled}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onSiguiente}
            disabled={pagina >= totalPaginas || loading || filtersDisabled}
            className="rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
