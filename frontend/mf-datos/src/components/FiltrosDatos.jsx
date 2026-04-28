import React, { useEffect, useState } from 'react';

const fuenteOptions = ['Todas', 'POS', 'INVENTARIO', 'ECOMMERCE', 'FINANZAS', 'CLIENTES'];

export default function FiltrosDatos({ value, onFiltrar, onLimpiar }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const update = (field, nextValue) => {
    setDraft((current) => ({ ...current, [field]: nextValue }));
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-40">
          Fuente
          <select
            value={draft.fuente}
            onChange={(event) => update('fuente', event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            {fuenteOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-36">
          Fecha desde
          <input
            type="date"
            value={draft.desde}
            onChange={(event) => update('desde', event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block w-full text-sm font-semibold text-gray-700 xl:w-36">
          Fecha hasta
          <input
            type="date"
            value={draft.hasta}
            onChange={(event) => update('hasta', event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onFiltrar(draft)}
            className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Filtrar
          </button>

          <button
            type="button"
            onClick={() => {
              setDraft({ fuente: 'Todas', desde: '', hasta: '' });
              onLimpiar();
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}