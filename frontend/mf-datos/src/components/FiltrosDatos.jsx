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
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_auto_auto] lg:items-end">
        <label className="block text-sm font-semibold text-gray-700">
          Fuente
          <select
            value={draft.fuente}
            onChange={(event) => update('fuente', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary-600"
          >
            {fuenteOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Fecha desde
          <input
            type="date"
            value={draft.desde}
            onChange={(event) => update('desde', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary-600"
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Fecha hasta
          <input
            type="date"
            value={draft.hasta}
            onChange={(event) => update('hasta', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary-600"
          />
        </label>

        <button
          type="button"
          onClick={() => onFiltrar(draft)}
          className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Filtrar
        </button>

        <button
          type="button"
          onClick={() => {
            setDraft({ fuente: 'Todas', desde: '', hasta: '' });
            onLimpiar();
          }}
          className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}