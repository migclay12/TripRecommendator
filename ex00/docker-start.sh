#!/bin/bash

# Script to start Trip Recommendator with Docker

echo "Starting Trip Recommendator..."

# Check if we're in the right directory
if [ ! -f docker-compose.yml ]; then
    echo "Error: docker-compose.yml not found"
    echo "Please run this script from the ex00/ directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found"
    echo "Creating .env file from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ".env file created. Please edit it and add your GEMINI_API_KEY"
        echo "Then run this script again."
        exit 1
    else
        echo ".env.example file not found"
        echo "Creating basic .env file..."
        echo "GEMINI_API_KEY=your_api_key_here" > .env
        echo "PORT=3001" >> .env
        echo ".env file created. Please edit it and add your GEMINI_API_KEY"
        echo "Then run this script again."
        exit 1
    fi
fi

# Check if GEMINI_API_KEY is configured
if grep -q "your_api_key_here\|your_gemini_api_key_here" .env; then
    echo "Please configure your GEMINI_API_KEY in the .env file"
    exit 1
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

echo ""
echo "Project started!"
echo ""
echo "Frontend: http://localhost"
echo "Backend:  http://localhost:3001"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
