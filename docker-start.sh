#!/bin/bash

# Script para iniciar Trip Recommendator con Docker

echo "🚀 Iniciando Trip Recommendator..."

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📝 Creando archivo .env desde .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado. Por favor, edítalo y añade tu GEMINI_API_KEY"
        echo "   Luego ejecuta este script nuevamente."
        exit 1
    else
        echo "❌ Archivo .env.example no encontrado"
        echo "📝 Creando archivo .env básico..."
        echo "GEMINI_API_KEY=your_api_key_here" > .env
        echo "PORT=3001" >> .env
        echo "✅ Archivo .env creado. Por favor, edítalo y añade tu GEMINI_API_KEY"
        echo "   Luego ejecuta este script nuevamente."
        exit 1
    fi
fi

# Verificar si GEMINI_API_KEY está configurada
if grep -q "your_api_key_here\|your_gemini_api_key_here" .env; then
    echo "⚠️  Por favor, configura tu GEMINI_API_KEY en el archivo .env"
    exit 1
fi

# Construir e iniciar los contenedores
echo "🔨 Construyendo e iniciando contenedores..."
docker-compose up --build -d

echo ""
echo "✅ ¡Proyecto iniciado!"
echo ""
echo "📍 Frontend: http://localhost"
echo "📍 Backend:  http://localhost:3001"
echo ""
echo "📋 Para ver los logs: docker-compose logs -f"
echo "🛑 Para detener: docker-compose down"

