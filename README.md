# Proyecto Grupo Cordillera - Guía de Desarrollo e Integración

Este documento establece las normas técnicas y de colaboración para el desarrollo del ecosistema de microfrontends. Es obligatorio seguir estas directrices para asegurar la integridad de la arquitectura y el despliegue en contenedores.

## 1. Reglas de Arquitectura y Desarrollo

Para mantener la estabilidad del proyecto, se deben respetar las siguientes restricciones técnicas:

### Arquitectura de Microfrontends (Module Federation)
* **Aislamiento:** Cada microfrontend (MFE) reside en un contenedor independiente. Está estrictamente prohibido importar archivos físicos entre módulos (ej. `import from "../../otro-mfe"`).
* **Comunicación:** La integración se realiza exclusivamente a través de Webpack Module Federation en tiempo de ejecución.
* **Dependencias:** Si falta funcionalidad, crear un mock local o solicitar la exportación oficial del componente.

### Estándar de Contenedores y Docker
* **Build System:** Proceso multi-stage. La salida de Webpack debe ir a `/app/dist` y copiarse a `/usr/share/nginx/html/` en la imagen final.
* **Servidor Web:** Se utiliza Nginx. No modificar Dockerfile o nginx.conf sin coordinación con DevOps (Fran).
* **Persistencia:** Cambios en red o puertos deben reflejarse en el archivo `docker-compose.yml` principal.

### Integración de Datos y Backend
* **Estandarización:** Usar interfaces y modelos en `src/data/` o `src/mocks/`. No crear estructuras de datos arbitrarias.
* **Lógica de Negocio:** La lógica compleja reside en el Backend Core. El Frontend solo visualiza y gestiona estado mediante JSON.
* **Mocks:** No instalar librerías adicionales (como Faker.js). Usar archivos de respaldo existentes para consistencia con MS1-MS4.

### Estilo Visual
* **Framework:** Sistema de diseño basado exclusivamente en Tailwind CSS.
* **Componentes:** No instalar librerías externas (Material UI, AntD, etc.) para cumplir con el rendimiento de la HU-08.

---

## 2. Guía de Uso de IA para Desarrolladores

Para evitar alucinaciones de la IA, copie y pegue el siguiente prompt en su chat (Copilot, ChatGPT, Claude) antes de solicitar código:

> **PROMPT DE CONTEXTO OBLIGATORIO:**
> Actúa como un experto en Arquitectura de Microfrontends y Docker. Trabajamos en el proyecto "Grupo Cordillera" con estas reglas:
> 1. **Tecnología:** Webpack Module Federation. Host (3000) consume mf-datos (3001), mf-indicadores (3002) y mf-reportes (3003).
> 2. **Docker:** Cada MFE es un contenedor aislado. Prohibido importar archivos entre carpetas raíz de diferentes módulos.
> 3. **Build:** Salida de producción es la carpeta /dist servida por Nginx.
> 4. **UI:** Tailwind CSS puro. Sin librerías de componentes externas.
> 5. **Datos:** Usar esquemas de src/data/. Lógica reside en el Backend.
> 6. **Objetivo:** Código ligero, modular y respetar las 16 HU definidas.

---

## 3. Comandos de Operación

Ejecutar desde la raíz del proyecto:

* **Levantar entorno completo:** `docker compose up --build -d`
* **Verificar estado:** `docker ps`
* **Reconstruir servicio:** `docker compose up --build -d [nombre]`
* **Limpiar caché de build:** `docker builder prune -f`
* **Detener el sistema:** `docker compose down`