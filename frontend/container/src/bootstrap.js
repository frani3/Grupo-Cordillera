import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#F7FAFC] to-[#EAF3FF] p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <App />
      </div>
    </div>
  </React.StrictMode>
);