import { estadoCircuitosMock, registrosMock } from '../mocks/datosMock';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// In-memory cache — mock data is static so TTL is not needed
const _cache = new Map();

export async function getRegistros(fuente, desde, hasta, pagina = 1, tamano = 10) {
  const key = `reg:${fuente}:${desde}:${hasta}:${pagina}:${tamano}`;
  if (_cache.has(key)) return _cache.get(key);

  const fuenteNorm = (fuente || 'Todas').toUpperCase();
  const paginaSafe = Math.max(1, Number(pagina) || 1);
  const tamanoSafe = Math.max(1, Number(tamano) || 10);

  const filtrados = registrosMock.filter((r) => {
    const okFuente = fuenteNorm === 'TODAS' || r.fuente === fuenteNorm;
    const okDesde  = !desde || r.fechaCaptura >= desde;
    const okHasta  = !hasta || r.fechaCaptura <= hasta;
    return okFuente && okDesde && okHasta;
  });

  const totalPaginas    = Math.max(1, Math.ceil(filtrados.length / tamanoSafe));
  const paginaNorm      = Math.min(paginaSafe, totalPaginas);
  const inicio          = (paginaNorm - 1) * tamanoSafe;
  const registros       = filtrados.slice(inicio, inicio + tamanoSafe);

  const result = clone({
    registros,
    pagina: paginaNorm,
    tamano: tamanoSafe,
    totalPaginas,
    totalRegistros: filtrados.length,
  });

  _cache.set(key, result);
  return result;
}

export async function getEstadoCircuitos() {
  if (_cache.has('circuitos')) return _cache.get('circuitos');
  const data = clone(estadoCircuitosMock);
  _cache.set('circuitos', data);
  return data;
}
