import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { Spinner, Toast } from '@shared';
import CambiarRolModal from '../components/usuarios/CambiarRolModal';
import FormularioUsuario from '../components/usuarios/FormularioUsuario';
import TablaUsuarios from '../components/usuarios/TablaUsuarios';
import {
  cambiarRolService,
  crearUsuarioService,
  desactivarUsuarioService,
  getUsuarios,
} from '../services/usuariosService';

function AccesoDenegado() {
  return (
    <div className="flex min-h-[calc(100vh-112px)] items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Acceso restringido</p>
        <h2 className="mt-3 text-lg font-bold tracking-tight text-[#0F172A]">Sin permisos de administrador</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          La gestión de usuarios solo está disponible para administradores del sistema.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex rounded-lg bg-gradient-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const { usuario } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioParaRol, setUsuarioParaRol] = useState(null);
  const [toast, setToast] = useState({ visible: false, tipo: 'success', mensaje: '', id: 0 });

  useEffect(() => {
    let cancelled = false;
    async function cargarUsuarios() {
      try {
        setCargando(true);
        const data = await Promise.resolve(getUsuarios());
        if (!cancelled) setUsuarios(data);
      } catch (error) {
        if (!cancelled) {
          setToast({
            visible: true, tipo: 'error',
            mensaje: error instanceof Error ? error.message : 'No se pudieron cargar los usuarios',
            id: Date.now(),
          });
        }
      } finally {
        if (!cancelled) setCargando(false);
      }
    }
    cargarUsuarios();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const timeout = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    return () => clearTimeout(timeout);
  }, [toast.visible, toast.id]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, tipo, mensaje, id: Date.now() });
  };

  const recargarUsuarios = async () => {
    const data = await Promise.resolve(getUsuarios());
    setUsuarios(data);
  };

  const handleCrearUsuario = async (datos) => {
    try {
      crearUsuarioService(datos);
      await recargarUsuarios();
      mostrarToast('Usuario creado correctamente', 'success');
      setMostrarFormulario(false);
    } catch (error) {
      mostrarToast(error instanceof Error ? error.message : 'No se pudo crear el usuario', 'error');
      throw error;
    }
  };

  const handleConfirmarCambioRol = async (usuarioSeleccionado, nuevoRol) => {
    try {
      cambiarRolService(usuarioSeleccionado.id, nuevoRol);
      await recargarUsuarios();
      mostrarToast(`Rol actualizado a ${nuevoRol} para ${usuarioSeleccionado.nombre}`, 'success');
      setUsuarioParaRol(null);
    } catch (error) {
      mostrarToast(error instanceof Error ? error.message : 'No se pudo cambiar el rol', 'error');
      throw error;
    }
  };

  const handleDesactivarUsuario = async (usuarioSeleccionado) => {
    try {
      desactivarUsuarioService(usuarioSeleccionado.id);
      await recargarUsuarios();
      mostrarToast(`${usuarioSeleccionado.nombre} fue desactivado`, 'success');
    } catch (error) {
      mostrarToast(error instanceof Error ? error.message : 'No se pudo desactivar el usuario', 'error');
      throw error;
    }
  };

  const usuariosConteo = useMemo(() => usuarios.length, [usuarios]);

  if (usuario?.role !== 'ADMINISTRADOR') {
    return <AccesoDenegado />;
  }

  return (
    <div className="w-full space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Administración</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Gestión de Usuarios</h2>
          <p className="mt-1 text-sm text-slate-500">
            {usuariosConteo} usuario{usuariosConteo !== 1 ? 's' : ''} registrado{usuariosConteo !== 1 ? 's' : ''} · Grupo Cordillera
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarFormulario((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          {mostrarFormulario ? '← Ocultar formulario' : '+ Nuevo usuario'}
        </button>
      </div>

      {/* ── New user form (conditional) ── */}
      {mostrarFormulario && (
        <FormularioUsuario onCrearUsuario={handleCrearUsuario} />
      )}

      {/* ── Users table card ── */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Listado</p>
          <h3 className="mt-1 text-base font-semibold text-[#0F172A]">Usuarios del Sistema</h3>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <TablaUsuarios
            usuarios={usuarios}
            onCambiarRol={(u) => setUsuarioParaRol(u)}
            onDesactivar={handleDesactivarUsuario}
          />
        )}
      </div>

      <CambiarRolModal
        usuario={usuarioParaRol}
        onCancelar={() => setUsuarioParaRol(null)}
        onConfirmar={handleConfirmarCambioRol}
      />

      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md px-4 sm:px-0">
          <Toast tipo={toast.tipo} mensaje={toast.mensaje} />
        </div>
      )}
    </div>
  );
}
