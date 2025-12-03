<!-- b05225e3-02b7-4149-a452-0a1d1a2bfdb9 aa0609ca-cd37-4510-ae20-f5776d153fd8 -->
## Plan para TripRecommendator

### 1. Preparación del proyecto

- **1.1 Crear estructura básica del repo**
- Carpeta `ex00/` como indica el enunciado.
- Subcarpetas mínimas: `frontend/`, `backend/`, `infra/` (para Docker y `docker-compose.yml`).
- **1.2 Inicializar frontend**
- Crear app React + Typescript (por ejemplo con Vite o Create React App) en [`ex00/frontend`](ex00/frontend).
- Configurar TailwindCSS en el frontend.
- **1.3 Inicializar backend sencillo**
- Backend Node/Express en [`ex00/backend`](ex00/backend) solo para exponer endpoints de recomendación y llamadas a APIs externas.
- **1.4 Configurar Docker**
- `infra/Dockerfile.frontend`, `infra/Dockerfile.backend` o un solo Dockerfile multi-stage según prefieras.
- `infra/docker-compose.yml` para levantar frontend, backend y (si es necesario) un servicio auxiliar.

### 2. Diseño funcional y de UX (antes de programar en serio)

- **2.1 Definir flujo principal de usuario**
- Pantalla inicial: input de texto libre (y espacio futuro para voz/imagen/dibujo).
- Flujo: usuario escribe → pulsa "Buscar" → se muestran sugerencias de destinos + mapa con marcadores.
- **2.2 Bocetar vistas principales**
- Vista principal de búsqueda (home): input, botón, lista de resultados, mapa.
- Vista de detalle de destino (opcional en esta primera versión): información básica y ubicación destacada en mapa.
- **2.3 Decisiones de diseño mobile-first**
- Diseño pensado primero para móvil: header sencillo, input ocupando ancho completo, mapa ocupando parte inferior de la pantalla.
- Layout responsivo para tablets y escritorio (uso de grid/flex, breakpoints de Tailwind).
- **2.4 Criterios mínimos de accesibilidad**
- Etiquetas `label` correctas, texto alternativo en imágenes, contraste suficiente, navegación por teclado, roles ARIA básicos.

### 3. Frontend: estructura y componentes base

- **3.1 Configuración global**
- Crear `App.tsx` con rutas básicas (si se usa React Router) o una sola vista sencilla para empezar.
- Definir tema base Tailwind (tipografía, colores, espaciados).
- **3.2 Componentes UI principales**
- `SearchBar` (input de texto + botón de envío + mensajes de ayuda/errores).
- `DestinationList` para mostrar las recomendaciones de viaje devueltas por la API.
- `MapView` basado en Leaflet (u otra librería libre) para mostrar marcadores.
- `Layout` general (header, main, footer) con enfoque mobile-first.
- **3.3 Gestión de estado y llamadas al backend**
- Servicio `apiClient` para comunicar el frontend con el backend (`fetch`/`axios`).
- Manejo de estados: `loading`, `error`, resultados de destinos, selección de destino.

### 4. Integración del mapa interactivo

- **4.1 Elegir librería de mapas**
- Por ejemplo Leaflet.js con `react-leaflet` en [`ex00/frontend`](ex00/frontend).
- **4.2 Configurar el mapa base**
- Componente `MapView` que reciba lista de destinos (lat/lng, nombre, descripción) y pinte marcadores.
- Ajustar el zoom/center automáticamente según los resultados.
- **4.3 Interacción básica con el mapa**
- Click en marcador → resaltar destino en la lista.
- Click en elemento de la lista → centrar mapa en ese destino.

### 5. Backend mínimo con Node/Express

- **5.1 Estructura del backend**
- Punto de entrada (por ejemplo [`ex00/backend/src/index.ts`](ex00/backend/src/index.ts) o `.js`).
- Rutas: `POST /api/recommendations` que reciba el texto libre y devuelva lista de destinos estándar.
- **5.2 Capa de servicios para IA y APIs externas**
- Servicio `aiService` que llame a la API de Gemini (u otra) para interpretar el texto del usuario.
- Servicio `geoService` que traduzca destinos en coordenadas (usando, por ejemplo, una API de geocodificación gratuita si se permite).
- **5.3 Modelo de respuesta unificado**
- Definir un formato uniforme de destino: `{ id, name, description, lat, lng, score }`.
- Asegurar que el backend siempre responde en este formato, aunque cambie el proveedor de IA.

### 6. Integración IA (Gemini u otra similar)

- **6.1 Diseño de la llamada a la IA**
- Definir prompts y parámetros básicos para transformar texto libre en una lista de destinos (nombre y país al menos).
- **6.2 Implementar cliente de IA**
- Cliente encapsulado que reciba el texto del usuario y devuelva destinos intermedios (sin coordenadas todavía).
- Gestión de errores y timeouts.
- **6.3 Integrar IA + geocodificación**
- Por cada destino sugerido, llamar a la API de geocodificación para obtener lat/lng.
- Filtrar resultados poco fiables (sin coordenadas o fuera de rango razonable).

### 7. Accesibilidad y UX

- **7.1 Revisión de accesibilidad básica**
- Añadir labels, `aria-*`, roles adecuados, orden de tabulación correcto.
- Revisión de contraste de colores según buenas prácticas.
- **7.2 Estados de carga y error claros**
- Indicadores de `loading` accesibles (por ejemplo texto visible y `aria-live`).
- Mensajes de error amigables cuando la IA o la API fallen.

### 8. Features avanzadas (si queda tiempo)

- **8.1 Speech-to-text**
- Integrar API de reconocimiento de voz del navegador para rellenar el input de texto (opcional, feature progresiva).
- **8.2 Entrada por imagen**
- Permitir subir una imagen (por ejemplo una foto de un lugar) y enviarla a la IA para extraer ubicación (solo si el proveedor lo soporta).
- **8.3 Dibujo de áreas en el mapa**
- Añadir herramienta para dibujar un área (polígono/círculo) y buscar destinos dentro de esa zona.

### 9. Docker y despliegue local

- **9.1 Dockerizar frontend y backend**
- Crear `Dockerfile` para el frontend (build + servidor estático).
- Crear `Dockerfile` para el backend (Node runtime).
- **9.2 docker-compose**
- `docker-compose.yml` para levantar frontend y backend conectados, exponiendo puertos adecuados.
- **9.3 Variables de entorno**
- Definir uso de `.env` (sin commitear claves) para API keys de IA y servicios externos.

### 10. Documentación y preparación de entrega

- **10.1 README.md completo**
- En [`ex00/README.md`](ex00/README.md) describir: resumen del proyecto, requisitos, cómo ejecutar con y sin Docker, decisiones técnicas y limitaciones.
- **10.2 Limpieza del repositorio**
- Verificar que solo se suben los ficheros necesarios (sin `.env`, sin claves, sin artefactos de build innecesarios si no los piden).
- **10.3 Checklist final vs subject**
- Revisar punto por punto el `subject.txt` para asegurar: React+TS, Tailwind, mapa, IA integrada (o claramente mockeada si el entorno de corrección lo requiere), accesibilidad básica, Docker funcionando.

### To-dos

- [ ] Crear la estructura base del proyecto con carpetas `ex00/frontend`, `ex00/backend` e `infra` y preparar la inicialización de frontend y backend
- [ ] Definir el flujo de usuario, vistas principales y decisiones mobile-first y de accesibilidad antes de programar
- [ ] Implementar la estructura principal del frontend (layout, SearchBar, DestinationList, MapView, estado y llamadas al backend)
- [ ] Implementar el backend mínimo con Express, endpoint de recomendaciones y servicios para IA y geocodificación
- [ ] Integrar la llamada a la IA (Gemini u otra), definir prompts y unirla al flujo del backend
- [ ] Terminar integración del mapa interactivo con resultados (marcadores, interacciones lista-mapa)
- [ ] Revisar y mejorar accesibilidad básica, mensajes de error y estados de carga
- [ ] Crear Dockerfiles y docker-compose para levantar frontend y backend juntos
- [ ] Redactar README.md y limpiar el repositorio para la entrega final