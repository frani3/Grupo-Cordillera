# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install
# Copiamos el resto del código
COPY . .
# Ejecutamos el build de Webpack
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

# 1. Copiamos los JS que ya vimos que existen
COPY --from=builder /app/dist/. /usr/share/nginx/html/

# 2. EL FIX: Copiamos manualmente el index.html
# (Ajusta la ruta de origen si tu index.html está en /public o en /src)
COPY --from=builder /app/public/index.html /usr/share/nginx/html/

# 3. Permisos
RUN chmod -R 755 /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]