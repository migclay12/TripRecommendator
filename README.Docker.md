# Guía de Docker para Trip Recommendator

Este proyecto está completamente dockerizado para que puedas ejecutarlo sin necesidad de tener Node.js o npm instalado.

## Requisitos

- Docker Desktop (o Docker Engine + Docker Compose)
- Archivo `.env` con la variable `GEMINI_API_KEY`

## Configuración inicial

1. **Crea el archivo `.env`** en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`** y añade tu API key de Gemini:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```

## Ejecutar el proyecto

### Opción 1: Usar los scripts de ayuda (Recomendado)

**Linux/Mac:**
```bash
./docker-start.sh
```

**Windows:**
```bash
docker-start.bat
```

Los scripts verifican automáticamente que exista el archivo `.env` y te guían en el proceso.

### Opción 2: Comandos manuales

#### Construir e iniciar los contenedores

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker para backend y frontend
- Inicia ambos contenedores
- Expone el frontend en `http://localhost`
- Expone el backend en `http://localhost:3001`

### Ejecutar en segundo plano

```bash
docker-compose up -d --build
```

### Ver los logs

```bash
# Ver todos los logs
docker-compose logs -f

# Ver solo el backend
docker-compose logs -f backend

# Ver solo el frontend
docker-compose logs -f frontend
```

### Detener los contenedores

```bash
docker-compose down
```

### Detener y eliminar volúmenes

```bash
docker-compose down -v
```

## Estructura

- **Backend**: Contenedor Node.js que ejecuta Express en el puerto 3001
- **Frontend**: Contenedor Nginx que sirve la aplicación React compilada en el puerto 80
- **Red**: Ambos contenedores están en la misma red Docker para comunicarse entre sí

## Puertos

- **Frontend**: `http://localhost` (puerto 80)
- **Backend**: `http://localhost:3001`

## Troubleshooting

### El backend no inicia

1. Verifica que tienes la variable `GEMINI_API_KEY` en tu archivo `.env`
2. Revisa los logs: `docker-compose logs backend`

### El frontend no se conecta al backend

1. Verifica que ambos contenedores están corriendo: `docker-compose ps`
2. El frontend usa `/api` como proxy al backend cuando está en Docker
3. Revisa los logs: `docker-compose logs frontend`

### Reconstruir las imágenes

Si haces cambios en el código, reconstruye las imágenes:

```bash
docker-compose build --no-cache
docker-compose up
```

## Desarrollo

Si quieres desarrollar con hot-reload, puedes ejecutar los servicios individualmente fuera de Docker:

```bash
# Backend
cd ex00/backend
npm install
npm run dev

# Frontend (en otra terminal)
cd ex00/frontend
npm install
npm run dev
```

