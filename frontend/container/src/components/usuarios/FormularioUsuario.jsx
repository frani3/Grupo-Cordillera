import React, { useState } from 'react';

const estadoInicial = {
  nombre: '',
  email: '',
  contrasenaTemporal: '',
  rol: 'EJECUTIVO',
};

function validarFormulario(formulario) {
  const errores = {};
  if (!formulario.nombre.trim())
    errores.nombre = 'El nombre completo es obligatorio';
  if (!formulario.email.trim())
    errores.email = 'El email es obligatorio';
  else if (!/^\S+@\S+\.\S+$/.test(formulario.email.trim()))
    errores.email = 'Ingresa un email válido';
  if (!formulario.contrasenaTemporal.trim())
    errores.contrasenaTemporal = 'La contraseña temporal es obligatoria';
  else if (formulario.contrasenaTemporal.trim().length < 4)
    errores.contrasenaTemporal = 'Mínimo 4 caracteres';
  if (!formulario.rol.trim())
    errores.rol = 'El rol es obligatorio';
  return errores;
}

const fieldLabel = 'block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500';
const fieldInput = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

function SpinnerInline() {
  return <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />;
}

export default function FormularioUsuario({ onCrearUsuario }) {
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (campo) => (event) =>
    setFormulario((actual) => ({ ...actual, [campo]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validaciones = validarFormulario(formulario);
    setErrores(validaciones);
    if (Object.keys(validaciones).length > 0) return;
    setEnviando(true);
    try {
      await onCrearUsuario({
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        contrasenaTemporal: formulario.contrasenaTemporal.trim(),
        rol: formulario.rol,
      });
      setFormulario(estadoInicial);
      setErrores({});
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Alta de Usuario</p>
        <h3 className="mt-1 text-base font-semibold text-[#0F172A]">Nuevo Usuario</h3>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={`${fieldLabel} md:col-span-2`}>
            Nombre completo
            <input
              type="text"
              value={formulario.nombre}
              onChange={handleChange('nombre')}
              placeholder="Nombre y apellido"
              className={fieldInput}
            />
            {errores.nombre && <span className="mt-1.5 block text-[10px] font-semibold text-red-500">{errores.nombre}</span>}
          </label>

          <label className={fieldLabel}>
            Email
            <input
              type="email"
              value={formulario.email}
              onChange={handleChange('email')}
              placeholder="correo@cordillera.cl"
              className={fieldInput}
            />
            {errores.email && <span className="mt-1.5 block text-[10px] font-semibold text-red-500">{errores.email}</span>}
          </label>

          <label className={fieldLabel}>
            Contraseña temporal
            <input
              type="password"
              value={formulario.contrasenaTemporal}
              onChange={handleChange('contrasenaTemporal')}
              placeholder="Mínimo 4 caracteres"
              className={fieldInput}
            />
            {errores.contrasenaTemporal && <span className="mt-1.5 block text-[10px] font-semibold text-red-500">{errores.contrasenaTemporal}</span>}
          </label>

          <label className={`${fieldLabel} md:col-span-2`}>
            Rol
            <select value={formulario.rol} onChange={handleChange('rol')} className={fieldInput}>
              <option value="EJECUTIVO">Ejecutivo</option>
              <option value="ANALISTA">Analista</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
            {errores.rol && <span className="mt-1.5 block text-[10px] font-semibold text-red-500">{errores.rol}</span>}
          </label>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enviando ? <><SpinnerInline /><span>Creando...</span></> : <span>Crear usuario →</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
