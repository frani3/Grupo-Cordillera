import { cambiarRol, crearUsuario, desactivarUsuario, getUsuariosMock } from '../mocks/usuariosMock';

export function getUsuarios() {
  return getUsuariosMock();
}

export function crearUsuarioService(datos) {
  return crearUsuario(datos);
}

export function cambiarRolService(id, nuevoRol) {
  return cambiarRol(id, nuevoRol);
}

export function desactivarUsuarioService(id) {
  return desactivarUsuario(id);
}