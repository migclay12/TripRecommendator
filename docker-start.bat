@echo off
REM Script para iniciar Trip Recommendator con Docker en Windows

echo 🚀 Iniciando Trip Recommendator...

REM Verificar si existe el archivo .env
if not exist .env (
    echo ⚠️  Archivo .env no encontrado
    echo 📝 Creando archivo .env básico...
    (
        echo GEMINI_API_KEY=your_api_key_here
        echo PORT=3001
    ) > .env
    echo ✅ Archivo .env creado. Por favor, edítalo y añade tu GEMINI_API_KEY
    echo    Luego ejecuta este script nuevamente.
    pause
    exit /b 1
)

REM Construir e iniciar los contenedores
echo 🔨 Construyendo e iniciando contenedores...
docker-compose up --build -d

echo.
echo ✅ ¡Proyecto iniciado!
echo.
echo 📍 Frontend: http://localhost
echo 📍 Backend:  http://localhost:3001
echo.
echo 📋 Para ver los logs: docker-compose logs -f
echo 🛑 Para detener: docker-compose down
pause

