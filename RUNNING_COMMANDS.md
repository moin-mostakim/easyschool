# EasySchool - Running Commands Guide

This document provides all the commands needed to run, manage, and monitor the EasySchool microservices system.

## 🚀 Quick Start

### Start All Services
```bash
# Using the startup script (recommended)
./start.sh

# Or using npm
npm start
```

### Stop All Services
```bash
# Using npm
npm stop

# Or manually kill all processes
pkill -f "nest start"
pkill -f "vite"
docker-compose down
```

---

## 📋 Service Ports

| Service | Port | URL |
|---------|------|-----|
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| School Service | 3002 | http://localhost:3002 |
| Student Service | 3003 | http://localhost:3003 |
| Teacher Service | 3004 | http://localhost:3004 |
| Parent Service | 3005 | http://localhost:3005 |
| Attendance Service | 3006 | http://localhost:3006 |
| Exam Service | 3007 | http://localhost:3007 |
| Fees Service | 3008 | http://localhost:3008 |
| Communication Service | 3009 | http://localhost:3009 |
| Frontend | 5173 | http://localhost:5173 |

---

## 🗄️ Database Setup

### Start PostgreSQL Databases
```bash
# Start all databases using Docker Compose
docker-compose up -d

# Or if using docker compose (newer versions)
docker compose up -d
```

### Initialize Databases
```bash
# The start.sh script automatically initializes databases
# Or manually run:
docker exec -i easyschool_auth_db psql -U postgres -c "CREATE DATABASE IF NOT EXISTS easyschool_auth;"
docker exec -i easyschool_school_db psql -U postgres -c "CREATE DATABASE IF NOT EXISTS easyschool_school;"
# ... (similar for other services)
```

### Stop Databases
```bash
docker-compose down
# Or
docker compose down
```

---

## 🔧 Individual Service Commands

### API Gateway
```bash
cd services/api-gateway
npm install
npm run build
npm run start:dev
```

### Auth Service
```bash
cd services/auth-service
npm install
npm run build
npm run start:dev
```

### School Service
```bash
cd services/school-service
npm install
npm run build
npm run start:dev
```

### Student Service
```bash
cd services/student-service
npm install
npm run build
npm run start:dev
```

### Teacher Service
```bash
cd services/teacher-service
npm install
npm run build
npm run start:dev
```

### Parent Service
```bash
cd services/parent-service
npm install
npm run build
npm run start:dev
```

### Attendance Service
```bash
cd services/attendance-service
npm install
npm run build
npm run start:dev
```

### Exam Service
```bash
cd services/exam-service
npm install
npm run build
npm run start:dev
```

### Fees Service
```bash
cd services/fees-service
npm install
npm run build
npm run start:dev
```

### Communication Service
```bash
cd services/communication-service
npm install
npm run build
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Monitoring Commands

### Check Service Status
```bash
# Check if ports are listening
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 5173; do
  if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
    echo "✅ Port $port: Running"
  else
    echo "❌ Port $port: Not running"
  fi
done
```

### View Logs
```bash
# View API Gateway logs
tail -f logs/api-gateway.log

# View Auth Service logs
tail -f logs/auth-service.log

# View all logs
tail -f logs/*.log
```

### Health Check
```bash
# Check API Gateway health
curl http://localhost:3000/health

# Check all services
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
# ... (similar for other services)
```

---

## 🛠️ Development Commands

### Build All Services
```bash
# Build all services
npm run build

# Or build individually
cd services/api-gateway && npm run build
cd services/auth-service && npm run build
# ... (similar for other services)
```

### Install Dependencies
```bash
# Install root dependencies
npm install

# Install all service dependencies
npm install --workspaces

# Or install individually
cd services/api-gateway && npm install
cd services/auth-service && npm install
# ... (similar for other services)
```

### Watch Mode (Auto-reload)
```bash
# All services run in watch mode with start.sh
# Individual watch mode:
cd services/api-gateway && npm run start:dev
```

---

## 🧪 Testing Commands

### Test Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123!@#"}'
```

### Test Token Verification
```bash
# Get token from login response, then:
TOKEN="your-access-token-here"
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Test API Gateway
```bash
curl http://localhost:3000/health
```

---

## 🔄 Restart Commands

### Restart All Services
```bash
# Stop all
npm stop

# Wait a moment
sleep 2

# Start all
npm start
```

### Restart Individual Service
```bash
# Stop specific service
pkill -f "nest start.*api-gateway"

# Start specific service
cd services/api-gateway && npm run start:dev
```

---

## 🗑️ Cleanup Commands

### Clean Build Artifacts
```bash
# Remove all dist folders
find . -type d -name "dist" -exec rm -rf {} +

# Remove all node_modules (be careful!)
find . -type d -name "node_modules" -exec rm -rf {} +

# Clean and reinstall
npm run clean  # if available
npm install
```

### Clean Logs
```bash
# Remove all log files
rm -rf logs/*.log

# Or clear log content
> logs/api-gateway.log
> logs/auth-service.log
```

### Clean Docker
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

---

## 📝 Environment Setup

### Create .env Files
```bash
# API Gateway
cat > services/api-gateway/.env << EOF
JWT_SECRET=your-super-secret-jwt-key-change-in-production
AUTH_SERVICE_URL=http://localhost:3001
SCHOOL_SERVICE_URL=http://localhost:3002
STUDENT_SERVICE_URL=http://localhost:3003
TEACHER_SERVICE_URL=http://localhost:3004
PARENT_SERVICE_URL=http://localhost:3005
ATTENDANCE_SERVICE_URL=http://localhost:3006
EXAM_SERVICE_URL=http://localhost:3007
FEES_SERVICE_URL=http://localhost:3008
COMMUNICATION_SERVICE_URL=http://localhost:3009
EOF

# Auth Service
cat > services/auth-service/.env << EOF
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=easyschool_auth
EOF

# Similar for other services...
```

---

## 🐳 Docker Commands

### Start Databases
```bash
docker-compose up -d
```

### View Running Containers
```bash
docker-compose ps
```

### View Database Logs
```bash
docker-compose logs -f easyschool_auth_db
```

### Access Database
```bash
# Access Auth Service database
docker exec -it easyschool_auth_db psql -U postgres -d easyschool_auth

# Access School Service database
docker exec -it easyschool_school_db psql -U postgres -d easyschool_school
```

### Stop Databases
```bash
docker-compose down
```

---

## 🔍 Troubleshooting Commands

### Check Process Status
```bash
# Check if services are running
ps aux | grep "nest start"
ps aux | grep "vite"
ps aux | grep "node"
```

### Check Port Usage
```bash
# Check what's using a port
lsof -i :3000
lsof -i :3001
# ... (similar for other ports)
```

### Check Database Connections
```bash
# Test database connection
docker exec -it easyschool_auth_db psql -U postgres -c "SELECT version();"
```

### View Recent Errors
```bash
# Check logs for errors
grep -i error logs/*.log | tail -20
```

---

## 📦 Package Management

### Update Dependencies
```bash
# Update all dependencies
npm update

# Update specific package
npm update package-name

# Check for outdated packages
npm outdated
```

### Install New Package
```bash
# In root
npm install package-name

# In specific service
cd services/api-gateway && npm install package-name
```

---

## 🚀 Production Commands

### Build for Production
```bash
# Build all services
npm run build

# Build frontend
cd frontend && npm run build
```

### Run Production Build
```bash
# API Gateway
cd services/api-gateway
NODE_ENV=production node dist/main.js

# Other services similar...
```

---

## 📚 Useful Scripts

### Complete Setup (First Time)
```bash
# 1. Install dependencies
npm install

# 2. Start databases
docker-compose up -d

# 3. Wait for databases
sleep 5

# 4. Start all services
./start.sh
```

### Daily Development
```bash
# Start everything
./start.sh

# In another terminal, watch logs
tail -f logs/*.log
```

### Before Committing
```bash
# Stop all services
npm stop

# Clean build artifacts
find . -type d -name "dist" -exec rm -rf {} +

# Rebuild
npm run build
```

---

## 🔐 Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Change default database passwords
- Use HTTPS in production
- Keep dependencies updated

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start all | `./start.sh` or `npm start` |
| Stop all | `npm stop` |
| Check status | `lsof -i :3000-3009` |
| View logs | `tail -f logs/*.log` |
| Health check | `curl http://localhost:3000/health` |
| Restart | `npm stop && sleep 2 && npm start` |

---

**Last Updated**: 2026-01-27
**Repository**: https://github.com/moin-mostakim/easyschool.git
