# Trip Recommendator

An intelligent travel recommendation system powered by Google Gemini AI. Describe your ideal trip and get personalized destination recommendations with interactive maps.

## Features

- 🤖 **AI-Powered Recommendations**: Uses Google Gemini AI to analyze your travel preferences and suggest destinations
- 🗺️ **Interactive Maps**: Visualize recommended destinations on an interactive map using Leaflet
- 💬 **Chat Interface**: Natural conversation interface to describe your travel desires
- 🐳 **Dockerized**: Fully containerized for easy deployment and execution
- ⚡ **Modern Stack**: Built with React, TypeScript, Express, and Vite

## Technologies

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Google Gemini AI** - AI recommendations
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for frontend

## Requirements

- **Docker Desktop** (or Docker Engine + Docker Compose)
- **Google Gemini API Key** - Get one at [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TripRecommendator
   ```

2. **Navigate to the project directory**:
   ```bash
   cd ex00
   ```

3. **Create a `.env` file**:
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```
   
   Or manually create `.env` file with:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3001
   ```

4. **Start the application**:
   ```bash
   ./docker-start.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up --build
   ```

5. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

### Development Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd ex00/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   echo "PORT=3001" >> .env
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
   ```bash
   cd ex00/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Access the application**: http://localhost:5173

## Usage

1. **Open the application** in your browser (http://localhost for Docker, http://localhost:5173 for dev)

2. **Describe your ideal trip** in the chat interface. Examples:
   - "I want a cheap beach trip in Europe"
   - "Looking for mountain destinations in Asia"
   - "Best cities for food lovers in South America"

3. **View recommendations**: The AI will suggest destinations with:
   - Destination name and country
   - Description of why it's recommended
   - Interactive map showing locations

4. **Interact with the map**: Click on markers to zoom in and see more details

## Project Structure

```
TripRecommendator/
├── ex00/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts          # Backend server
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.tsx           # Main React component
│   │   │   ├── MapView.tsx       # Map component
│   │   │   └── ...
│   │   ├── Dockerfile
│   │   ├── nginx.conf            # Nginx configuration
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── docker-compose.yml        # Docker orchestration
│   └── docker-start.sh           # Startup script
├── README.md                      # This file
├── README.es.md                  # Spanish documentation
└── README.Docker.md              # Detailed Docker guide
```

## Configuration

### Environment Variables

Create a `.env` file in the `ex00/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### API Endpoints

- `POST /reply` - Send a travel request and get recommendations
  - Body: `{ "text": "your travel description" }`
  - Response: `{ "destinations": [...], "message": "..." }`

## Docker Commands

```bash
# Start containers
cd ex00
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild without cache
docker-compose build --no-cache
```

## Troubleshooting

### Backend won't start
- Verify `GEMINI_API_KEY` is set in `.env` file
- Check logs: `docker-compose logs backend`
- Ensure port 3001 is not in use

### Frontend can't connect to backend
- Verify both containers are running: `docker-compose ps`
- Check that backend is healthy: `curl http://localhost:3001`
- Review frontend logs: `docker-compose logs frontend`

### API Key issues
- Ensure your Gemini API key is valid
- Check API quota/limits at Google AI Studio
- Verify the key is correctly set in `.env` file

### Port conflicts
- Change ports in `docker-compose.yml` if 80 or 3001 are in use
- Update frontend API URL if backend port changes

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript
- `npm start` - Run production build

### Frontend Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For detailed Docker documentation, see [README.Docker.md](README.Docker.md)

For Spanish documentation, see [README.es.md](README.es.md)

