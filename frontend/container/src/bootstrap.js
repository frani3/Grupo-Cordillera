import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <App />
      </div>
    </div>
  </React.StrictMode>
);