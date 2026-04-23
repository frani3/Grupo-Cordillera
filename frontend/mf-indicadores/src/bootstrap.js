import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#F7FAFC] to-[#EEF6EB] p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#1A7A4A]">Grupo Cordillera</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">mf-indicadores</h1>
          </div>
          <div className="rounded-full bg-[#1A7A4A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1A7A4A]">
            Puerto 3002
          </div>
        </header>
        <App />
      </div>
    </div>
  </React.StrictMode>
);