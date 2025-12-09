# Trip Recommendator

Un sistema inteligente de recomendaciones de viajes impulsado por Google Gemini AI. Describe tu viaje ideal y obtén recomendaciones personalizadas de destinos con mapas interactivos.

## Características

- 🤖 **Recomendaciones con IA**: Utiliza Google Gemini AI para analizar tus preferencias de viaje y sugerir destinos
- 🗺️ **Mapas Interactivos**: Visualiza los destinos recomendados en un mapa interactivo usando Leaflet
- 💬 **Interfaz de Chat**: Interfaz de conversación natural para describir tus deseos de viaje
- 🐳 **Dockerizado**: Completamente containerizado para fácil despliegue y ejecución
- ⚡ **Stack Moderno**: Construido con React, TypeScript, Express y Vite

## Tecnologías

### Frontend
- **React 19** - Librería de UI
- **TypeScript** - Seguridad de tipos
- **Vite** - Herramienta de build y servidor de desarrollo
- **Tailwind CSS** - Estilos
- **React Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Seguridad de tipos
- **Google Gemini AI** - Recomendaciones con IA
- **CORS** - Compartir recursos entre orígenes

### Infraestructura
- **Docker** - Containerización
- **Docker Compose** - Orquestación multi-contenedor
- **Nginx** - Servidor web para frontend

## Requisitos

- **Docker Desktop** (o Docker Engine + Docker Compose)
- **Clave API de Google Gemini** - Obtén una en [Google AI Studio](https://makersuite.google.com/app/apikey)

## Instalación

### Inicio Rápido con Docker (Recomendado)

1. **Clona el repositorio**:
   ```bash
   git clone git@github.com:migclay12/TripRecommendator.git
   cd TripRecommendator
   ```

2. **Navega al directorio del proyecto**:
   ```bash
   cd ex00
   ```

3. **Crea un archivo `.env`**:
   ```
   GEMINI_API_KEY=tu_clave_api_aqui
   PORT=3001
   ```

4. **Inicia la aplicación**:
   ```bash
   ./docker-start.sh
   ```
   
   O manualmente:
   ```bash
   docker-compose up --build
   ```

5. **Accede a la aplicación**:
   - Frontend: http://localhost
   - API Backend: http://localhost:3001

### Configuración de Desarrollo (Sin Docker)

#### Configuración del Backend

1. **Navega al directorio backend**:
   ```bash
   cd ex00/backend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Crea el archivo `.env`**:
   ```
   GEMINI_API_KEY=tu_clave_api_aqui
   PORT=3001
   ```

4. **Ejecuta en modo desarrollo**:
   ```bash
   npm run dev
   ```

#### Configuración del Frontend

1. **Navega al directorio frontend** (en una nueva terminal):
   ```bash
   cd ex00/frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Accede a la aplicación**: http://localhost:5173

## Uso

1. **Abre la aplicación** en tu navegador (http://localhost para Docker, http://localhost:5173 para desarrollo)

2. **Describe tu viaje ideal** en la interfaz de chat. Ejemplos:
   - "Quiero un viaje barato a la playa en Europa"
   - "Buscando destinos de montaña en Asia"
   - "Mejores ciudades para amantes de la comida en Sudamérica"

3. **Visualiza las recomendaciones**: La IA sugerirá destinos con:
   - Nombre del destino y país
   - Descripción de por qué es recomendado
   - Mapa interactivo mostrando las ubicaciones

4. **Interactúa con el mapa**: Haz clic en los marcadores para hacer zoom y ver más detalles

## Estructura del Proyecto

```
TripRecommendator/
├── ex00/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts          # Servidor backend
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.tsx           # Componente principal de React
│   │   │   ├── MapView.tsx       # Componente del mapa
│   │   │   └── ...
│   │   ├── Dockerfile
│   │   ├── nginx.conf            # Configuración de Nginx
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── docker-compose.yml        # Orquestación Docker
│   └── docker-start.sh           # Script de inicio
├── README.md                      # Este archivo (inglés)
└── README.es.md                  # Este archivo (español)
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en el directorio `ex00/`:

```env
GEMINI_API_KEY=tu_clave_api_gemini_aqui
PORT=3001
```

### Endpoints de la API

- `POST /reply` - Envía una solicitud de viaje y obtén recomendaciones
  - Body: `{ "text": "tu descripción de viaje" }`
  - Respuesta: `{ "destinations": [...], "message": "..." }`

## Comandos Docker

```bash
# Iniciar contenedores
cd ex00
docker-compose up --build

# Iniciar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Reconstruir sin caché
docker-compose build --no-cache
```

## Solución de Problemas

### El backend no inicia
- Verifica que `GEMINI_API_KEY` esté configurado en el archivo `.env`
- Revisa los logs: `docker-compose logs backend`
- Asegúrate de que el puerto 3001 no esté en uso

### El frontend no se conecta al backend
- Verifica que ambos contenedores estén corriendo: `docker-compose ps`
- Comprueba que el backend esté funcionando: `curl http://localhost:3001`
- Revisa los logs del frontend: `docker-compose logs frontend`

### Problemas con la clave API
- Asegúrate de que tu clave API de Gemini sea válida
- Verifica la cuota/límites de API en Google AI Studio
- Confirma que la clave esté correctamente configurada en el archivo `.env`

### Conflictos de puertos
- Cambia los puertos en `docker-compose.yml` si 5173 o 3001 están en uso
- Actualiza la URL de la API del frontend si cambia el puerto del backend

## Desarrollo

### Scripts del Backend
- `npm run dev` - Iniciar servidor de desarrollo con hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar build de producción

### Scripts del Frontend
- `npm run dev` - Iniciar servidor de desarrollo Vite
- `npm run build` - Construir para producción
- `npm run lint` - Ejecutar ESLint
- `npm run preview` - Vista previa del build de producción

## Soporte

Para documentación en inglés, consulta [README.md](README.md)
