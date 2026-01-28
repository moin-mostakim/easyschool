# EasySchool - Full Docker Setup

This document describes how to run the entire EasySchool system using Docker Compose.

## 🐳 What's Included

The Docker setup includes:
- **9 PostgreSQL Databases** (one for each microservice)
- **10 Backend Services**:
  - API Gateway (port 3000)
  - Auth Service (port 3001)
  - School Service (port 3002)
  - Student Service (port 3003)
  - Teacher Service (port 3004)
  - Parent Service (port 3005)
  - Attendance Service (port 3006)
  - Exam Service (port 3007)
  - Fees Service (port 3008)
  - Communication Service (port 3009)
- **Frontend** (port 5173)

## 🚀 Quick Start

### Start All Services
```bash
docker-compose up -d
```

This will:
1. Build all Docker images
2. Start all databases
3. Start all backend services
4. Start the frontend
5. Configure networking between services

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway
docker-compose logs -f frontend
docker-compose logs -f auth-service
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ Deletes Data)
```bash
docker-compose down -v
```

## 📋 Service URLs

Once running, access:
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🔧 Features

- **Auto-restart**: All services restart automatically on failure (`restart: unless-stopped`)
- **Hot Reload**: Source code is mounted as volumes for development
- **Health Checks**: Database health checks ensure services start in correct order
- **Isolated Networks**: All services communicate via Docker network
- **Persistent Data**: Database volumes persist data between restarts

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │ (Port 5173)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Gateway │ (Port 3000)
└──────┬──────┘
       │
       ├──► Auth Service (3001)
       ├──► School Service (3002)
       ├──► Student Service (3003)
       ├──► Teacher Service (3004)
       ├──► Parent Service (3005)
       ├──► Attendance Service (3006)
       ├──► Exam Service (3007)
       ├──► Fees Service (3008)
       └──► Communication Service (3009)
       │
       ▼
┌─────────────┐
│  Databases  │ (PostgreSQL x9)
└─────────────┘
```

## 🔐 Environment Variables

All services are configured with environment variables in `docker-compose.yml`:
- Database connections use Docker service names (e.g., `postgres-auth`)
- Service URLs use Docker service names (e.g., `http://auth-service:3001`)
- JWT secrets and other configs are set per service

## 📝 Development Notes

- **Hot Reload**: Code changes are reflected immediately (volumes mounted)
- **Node Modules**: Excluded from volume mounts for performance
- **Logs**: Use `docker-compose logs` to debug issues
- **Rebuild**: Use `docker-compose build` to rebuild images after Dockerfile changes

## 🐛 Troubleshooting

### Services Not Starting
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs [service-name]

# Restart a specific service
docker-compose restart [service-name]
```

### Port Conflicts
If ports are already in use, stop conflicting services or change ports in `docker-compose.yml`.

### Database Connection Issues
Ensure databases are healthy before services start (health checks configured).

### Rebuild After Changes
```bash
# Rebuild specific service
docker-compose build [service-name]

# Rebuild all services
docker-compose build

# Rebuild and restart
docker-compose up -d --build
```

## 🎯 Next Steps

1. Start services: `docker-compose up -d`
2. Wait for all services to be ready (~1-2 minutes)
3. Access frontend: http://localhost:5173
4. Login with super admin:
   - Email: `superadmin@easyschool.com`
   - Password: `admin123`

## 📚 Additional Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec api-gateway sh

# Scale services (if needed)
docker-compose up -d --scale student-service=2

# View resource usage
docker stats
```
