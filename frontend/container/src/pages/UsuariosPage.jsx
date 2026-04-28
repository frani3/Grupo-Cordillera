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
    <div className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-xl border border-gray-100 bg-white px-4 text-center shadow-sm">
      <div className="max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-600">Acceso denegado</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900">No tienes permisos para continuar</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          La gestión de usuarios solo está disponible para administradores del sistema.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-gradient-brand px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
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
        if (!cancelled) {
          setUsuarios(data);
        }
      } catch (error) {
        if (!cancelled) {
          setToast({
            visible: true,
            tipo: 'error',
            mensaje: error instanceof Error ? error.message : 'No se pudieron cargar los usuarios',
            id: Date.now(),
          });
        }
      } finally {
        if (!cancelled) {
          setCargando(false);
        }
      }
    }

    cargarUsuarios();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast.visible) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setToast((actual) => ({ ...actual, visible: false }));
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toast.visible, toast.id]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({
      visible: true,
      tipo,
      mensaje,
      id: Date.now(),
    });
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
    <div className="space-y-8 pb-8">
      <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary-600">Administración</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">Gestión de usuarios</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
              Crea usuarios, cambia roles y administra su estado con datos completamente locales.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarFormulario((value) => !value)}
            className="rounded-lg bg-gradient-brand px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {mostrarFormulario ? 'Ocultar formulario' : 'Nuevo usuario'}
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Usuarios cargados: {usuariosConteo}
        </div>
      </section>

      {mostrarFormulario ? (
        <FormularioUsuario onCrearUsuario={handleCrearUsuario} />
      ) : null}

      <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Listado</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-gray-900">Usuarios del sistema</h3>
        </div>

        {cargando ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
            <Spinner />
          </div>
        ) : (
          <TablaUsuarios
            usuarios={usuarios}
            onCambiarRol={(usuarioSeleccionado) => setUsuarioParaRol(usuarioSeleccionado)}
            onDesactivar={handleDesactivarUsuario}
          />
        )}
      </section>

      <CambiarRolModal
        usuario={usuarioParaRol}
        onCancelar={() => setUsuarioParaRol(null)}
        onConfirmar={handleConfirmarCambioRol}
      />

      {toast.visible ? (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md px-4 sm:px-0">
          <Toast tipo={toast.tipo} mensaje={toast.mensaje} />
        </div>
      ) : null}
    </div>
  );
}