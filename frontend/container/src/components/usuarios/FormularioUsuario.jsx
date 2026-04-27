import React, { useState } from 'react';

const estadoInicial = {
  nombre: '',
  email: '',
  contrasenaTemporal: '',
  rol: 'EJECUTIVO',
};

function validarFormulario(formulario) {
  const errores = {};

  if (!formulario.nombre.trim()) {
    errores.nombre = 'El nombre completo es obligatorio';
  }

  if (!formulario.email.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!/^\S+@\S+\.\S+$/.test(formulario.email.trim())) {
    errores.email = 'Ingresa un email válido';
  }

  if (!formulario.contrasenaTemporal.trim()) {
    errores.contrasenaTemporal = 'La contraseña temporal es obligatoria';
  } else if (formulario.contrasenaTemporal.trim().length < 4) {
    errores.contrasenaTemporal = 'La contraseña temporal debe tener al menos 4 caracteres';
  }

  if (!formulario.rol.trim()) {
    errores.rol = 'El rol es obligatorio';
  }

  return errores;
}

export default function FormularioUsuario({ onCrearUsuario }) {
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (campo) => (event) => {
    setFormulario((actual) => ({ ...actual, [campo]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validaciones = validarFormulario(formulario);
    setErrores(validaciones);

    if (Object.keys(validaciones).length > 0) {
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Alta de usuario</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Nuevo usuario</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
          Nombre completo
          <input
            type="text"
            value={formulario.nombre}
            onChange={handleChange('nombre')}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
            placeholder="Nombre y apellido"
          />
          {errores.nombre ? <span className="mt-2 block text-xs font-medium text-rose-600">{errores.nombre}</span> : null}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={formulario.email}
            onChange={handleChange('email')}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
            placeholder="correo@cordillera.cl"
          />
          {errores.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{errores.email}</span> : null}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Contraseña temporal
          <input
            type="password"
            value={formulario.contrasenaTemporal}
            onChange={handleChange('contrasenaTemporal')}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
            placeholder="Mínimo 4 caracteres"
          />
          {errores.contrasenaTemporal ? <span className="mt-2 block text-xs font-medium text-rose-600">{errores.contrasenaTemporal}</span> : null}
        </label>

        <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
          Rol
          <select
            value={formulario.rol}
            onChange={handleChange('rol')}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
          >
            <option value="EJECUTIVO">EJECUTIVO</option>
            <option value="ANALISTA">ANALISTA</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
          </select>
          {errores.rol ? <span className="mt-2 block text-xs font-medium text-rose-600">{errores.rol}</span> : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="rounded-2xl bg-[#1E5FA8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#174a83] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {enviando ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  );
}