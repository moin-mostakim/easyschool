# Auth Service Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy shared package first (needed by services)
COPY shared ./shared
WORKDIR /app/shared
RUN npm ci && npm run build
WORKDIR /app

# Copy service package files
COPY services/auth-service/package*.json ./
COPY services/auth-service/tsconfig.json ./
COPY services/auth-service/nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy service source code
COPY services/auth-service ./

# Expose port
EXPOSE 3001

# Start in development mode
CMD ["npm", "run", "start:dev"]
