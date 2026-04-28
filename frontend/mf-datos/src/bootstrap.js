import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary-600">Grupo Cordillera</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900">mf-datos</h1>
          </div>
          <div className="rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-700">
            Puerto 3001
          </div>
        </header>
        <App />
      </div>
    </div>
  </React.StrictMode>
);