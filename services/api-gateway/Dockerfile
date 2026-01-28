# API Gateway Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy shared package first (needed by services)
COPY shared ./shared
WORKDIR /app/shared
RUN npm ci && npm run build
WORKDIR /app

# Copy service package files
COPY services/api-gateway/package*.json ./
COPY services/api-gateway/tsconfig.json ./
COPY services/api-gateway/nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy service source code
COPY services/api-gateway ./

# Expose port
EXPOSE 3000

# Start in development mode (use start:prod for production)
CMD ["npm", "run", "start:dev"]
