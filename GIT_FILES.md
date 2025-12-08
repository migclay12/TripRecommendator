# Archivos para Git - Trip Recommendator

Este documento lista qué archivos **SÍ debes subir a Git** y cuáles **NO**.

## ✅ ARCHIVOS QUE SÍ DEBES SUBIR A GIT

### Configuración Docker (Raíz del proyecto)
```
docker-compose.yml
docker-start.sh
docker-start.bat
README.Docker.md
.gitignore
```

### Backend (`ex00/backend/`)
```
Dockerfile
.dockerignore
.gitignore
package.json
package-lock.json
tsconfig.json
src/
  ├── index.ts
  ├── list-models.ts
  └── test-gemini.ts
```

### Frontend (`ex00/frontend/`)
```
Dockerfile
.dockerignore
.gitignore
nginx.conf
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
tailwind.config.js
postcss.config.js
eslint.config.js
index.html
src/
  ├── App.tsx
  ├── App.css
  ├── main.tsx
  ├── index.css
  ├── MapView.tsx
  └── assets/
      └── react.svg
public/
  └── vite.svg
README.md (si existe)
```

## ❌ ARCHIVOS QUE NO DEBES SUBIR A GIT

### Dependencias (Docker las instalará)
```
node_modules/          # En cualquier lugar
**/node_modules/
```

### Archivos compilados (Docker los compilará)
```
dist/                  # En cualquier lugar
**/dist/
dist-ssr/
build/
```

### Archivos con secretos
```
.env                   # En cualquier lugar
.env.local
.env.*.local
**/.env
```

### Archivos temporales
```
*.log
*.tmp
*.temp
.cache/
.vite/
*.tsbuildinfo
```

### Archivos del sistema/editor
```
.DS_Store
.vscode/               # (excepto extensions.json)
.idea/
```

## 📋 Resumen Rápido

**Lo que Git necesita:**
- ✅ Código fuente (`src/`)
- ✅ Archivos de configuración (`package.json`, `tsconfig.json`, etc.)
- ✅ Dockerfiles y docker-compose.yml
- ✅ Scripts de ayuda
- ✅ Documentación

**Lo que Git NO necesita:**
- ❌ `node_modules/` (Docker ejecutará `npm ci`)
- ❌ `dist/` (Docker ejecutará `npm run build`)
- ❌ `.env` (contiene secretos, cada desarrollador crea el suyo)
- ❌ Archivos temporales y logs

## 🚀 Comandos útiles

### Ver qué archivos se subirían a git
```bash
git status
```

### Ver archivos ignorados
```bash
git status --ignored
```

### Añadir todos los archivos necesarios
```bash
git add .
```

### Verificar antes de commit
```bash
git status
# Asegúrate de que NO aparezcan:
# - node_modules/
# - dist/
# - .env
```

## ⚠️ Importante

1. **NUNCA subas `.env`** - Contiene tu API key de Gemini
2. **NUNCA subas `node_modules/`** - Son muy pesados y Docker los instalará
3. **NUNCA subas `dist/`** - Docker compilará el código cuando construya la imagen

Si alguien clona tu repositorio, solo necesita:
1. Clonar el repo
2. Crear un archivo `.env` con su `GEMINI_API_KEY`
3. Ejecutar `docker-compose up --build`

¡Y listo! 🎉

