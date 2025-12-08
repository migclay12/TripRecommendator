# Dockerfile para el frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY index.html ./
COPY public ./public
COPY src ./src

# Construir la aplicación
RUN npm run build

# Imagen de producción con nginx
FROM nginx:alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Nginx se inicia automáticamente

