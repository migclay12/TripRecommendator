# Dockerfile for backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json ./

# Configure npm and install dependencies
# Remove package-lock.json to avoid integrity check issues with corrupted packages
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 10 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set audit false && \
    npm config set fund false && \
    npm cache clean --force && \
    npm install -g npm@latest && \
    rm -f package-lock.json && \
    NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false npm install --no-audit --no-fund --legacy-peer-deps

# Copy source code
COPY src ./src

# Compile TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
# Remove package-lock.json to avoid integrity check issues
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 10 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set audit false && \
    npm config set fund false && \
    npm cache clean --force && \
    npm install -g npm@latest && \
    rm -f package-lock.json && \
    NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false npm install --omit=dev --no-audit --no-fund --legacy-peer-deps

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Command to start the application
CMD ["node", "dist/index.js"]
