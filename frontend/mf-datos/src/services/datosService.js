import { estadoCircuitosMock, registrosMock } from '../mocks/datosMock';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export async function getRegistros(fuente, desde, hasta, pagina = 1, tamano = 5) {
  const fuenteNormalizada = (fuente || 'Todas').toUpperCase();
  const paginaSegura = Math.max(1, Number(pagina) || 1);
  const tamanoSeguro = Math.max(1, Number(tamano) || 5);

  const filtrados = registrosMock.filter((registro) => {
    const coincideFuente = fuenteNormalizada === 'TODAS' || registro.fuente === fuenteNormalizada;
    const coincideDesde = !desde || registro.fechaCaptura >= desde;
    const coincideHasta = !hasta || registro.fechaCaptura <= hasta;

    return coincideFuente && coincideDesde && coincideHasta;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamanoSeguro));
  const paginaNormalizada = Math.min(paginaSegura, totalPaginas);
  const inicio = (paginaNormalizada - 1) * tamanoSeguro;
  const registros = filtrados.slice(inicio, inicio + tamanoSeguro);

  return clone({
    registros,
    pagina: paginaNormalizada,
    tamano: tamanoSeguro,
    totalPaginas,
    totalRegistros: filtrados.length,
  });
}

export async function getEstadoCircuitos() {
  return clone(estadoCircuitosMock);
}