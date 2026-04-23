import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#F7FAFC] to-[#FFF5EB] p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#C96A00]">Grupo Cordillera</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">mf-reportes</h1>
          </div>
          <div className="rounded-full bg-[#C96A00]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#C96A00]">
            Puerto 3003
          </div>
        </header>
        <App />
      </div>
    </div>
  </React.StrictMode>
);