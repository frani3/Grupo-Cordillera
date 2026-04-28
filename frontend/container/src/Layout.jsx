import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, moduloActivo, email, role, onLogout }) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Navbar moduloActivo={moduloActivo} email={email} onLogout={onLogout} />

      <div className="flex h-full pt-16">
        <Sidebar role={role} />

        <main className="min-w-0 flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}