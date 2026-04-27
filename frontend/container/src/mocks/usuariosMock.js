const rolesValidos = ['EJECUTIVO', 'ANALISTA', 'ADMINISTRADOR'];

let usuarios = [
  { id: 1, nombre: 'Ana Torres', email: 'ana.torres@cordillera.cl', rol: 'ADMINISTRADOR', activo: true },
  { id: 2, nombre: 'Bruno Castillo', email: 'bruno.castillo@cordillera.cl', rol: 'EJECUTIVO', activo: true },
  { id: 3, nombre: 'Carla Molina', email: 'carla.molina@cordillera.cl', rol: 'ANALISTA', activo: true },
  { id: 4, nombre: 'Diego Pérez', email: 'diego.perez@cordillera.cl', rol: 'EJECUTIVO', activo: true },
  { id: 5, nombre: 'Elena Rojas', email: 'elena.rojas@cordillera.cl', rol: 'ANALISTA', activo: false },
  { id: 6, nombre: 'Fernando Silva', email: 'fernando.silva@cordillera.cl', rol: 'ADMINISTRADOR', activo: false },
];

function cloneUsuarios() {
  return usuarios.map((usuario) => ({ ...usuario }));
}

function getNextId() {
  return usuarios.reduce((maximo, usuario) => Math.max(maximo, usuario.id), 0) + 1;
}

export function getUsuariosMock() {
  return cloneUsuarios();
}

export function crearUsuario(datos) {
  const nuevoUsuario = {
    id: getNextId(),
    nombre: String(datos.nombre ?? '').trim(),
    email: String(datos.email ?? '').trim().toLowerCase(),
    rol: rolesValidos.includes(datos.rol) ? datos.rol : 'EJECUTIVO',
    activo: true,
  };

  usuarios = [...usuarios, nuevoUsuario];
  return { ...nuevoUsuario };
}

export function cambiarRol(id, nuevoRol) {
  if (!rolesValidos.includes(nuevoRol)) {
    throw new Error('Rol inválido');
  }

  let usuarioActualizado = null;
  usuarios = usuarios.map((usuario) => {
    if (usuario.id !== id) {
      return usuario;
    }

    usuarioActualizado = { ...usuario, rol: nuevoRol };
    return usuarioActualizado;
  });

  if (!usuarioActualizado) {
    throw new Error('Usuario no encontrado');
  }

  return { ...usuarioActualizado };
}

export function desactivarUsuario(id) {
  const usuarioObjetivo = usuarios.find((usuario) => usuario.id === id);

  if (!usuarioObjetivo) {
    throw new Error('Usuario no encontrado');
  }

  if (usuarioObjetivo.activo && usuarioObjetivo.rol === 'ADMINISTRADOR') {
    const administradoresActivos = usuarios.filter(
      (usuario) => usuario.activo && usuario.rol === 'ADMINISTRADOR'
    );

    if (administradoresActivos.length === 1) {
      throw new Error('No se puede desactivar el último administrador del sistema');
    }
  }

  usuarios = usuarios.map((usuario) =>
    usuario.id === id ? { ...usuario, activo: false } : usuario
  );

  return { ...usuarios.find((usuario) => usuario.id === id) };
}