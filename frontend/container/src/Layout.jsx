import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Navbar height = h-16 = 4rem = 64px
// Content area = 100vh - 64px, explicit so there is no ambiguity

export default function Layout({ children, moduloActivo, email, role, onLogout }) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Fixed navbar — 64px tall, z-50 */}
      <Navbar moduloActivo={moduloActivo} email={email} onLogout={onLogout} />

      {/* Content row: starts exactly below the navbar */}
      <div className="mt-16 flex h-[calc(100vh-4rem)]">
        <Sidebar role={role} />

        {/* Single scroll zone — invisible scrollbar, 40px bottom padding so
            the last widget never gets cut off at the viewport edge           */}
        <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto bg-gray-50 p-8 pb-14">
          {children}
        </main>
      </div>
    </div>
  );
}
