# Dockerfile para el backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Imagen de producción
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código compilado desde el builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]

