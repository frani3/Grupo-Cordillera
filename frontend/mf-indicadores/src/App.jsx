import React from 'react';
import { Badge, Card, Semaforo, Toast } from '@shared';

export default function App() {
  return (
    <Card className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge color="success" texto="Microfrontend" />
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">mf-indicadores</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Este módulo representa la vista de indicadores y confirma la integración independiente.
          </p>
        </div>
        <Semaforo estado="AMARILLO" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Toast tipo="warning" mensaje="mf-indicadores está disponible y responde." />
      </div>
    </Card>
  );
}