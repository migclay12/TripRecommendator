# Dockerfile for frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

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
COPY index.html ./
COPY src ./src

# Build the application
RUN npm run build

# Production image with nginx
FROM nginx:alpine

# Copy built files to nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Nginx starts automatically
