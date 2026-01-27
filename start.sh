#!/bin/bash

# EasySchool - Startup Script
# This script starts all services (DB, Backend, Frontend) and preserves logs

# Don't exit on error immediately - we want to handle docker-compose gracefully
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p logs

# Detect docker compose command (newer versions use 'docker compose', older use 'docker-compose')
DOCKER_COMPOSE=""
if command -v docker &> /dev/null; then
    if docker compose version &> /dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    fi
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0

    echo -e "${YELLOW}Waiting for $service_name to be ready on port $port...${NC}"
    while [ $attempt -lt $max_attempts ]; do
        if check_port $port; then
            echo -e "${GREEN}$service_name is ready!${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    echo -e "${RED}$service_name failed to start on port $port${NC}"
    return 1
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    if [ -n "$DOCKER_COMPOSE" ]; then
        $DOCKER_COMPOSE down 2>/dev/null || true
    fi
    pkill -f "nest start" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo -e "${GREEN}Cleanup complete${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EasySchool - Starting All Services${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Step 0: Initialize databases and fix configurations
echo -e "${YELLOW}Step 0: Setting up databases and configurations...${NC}"
if [ -f "init-databases.sh" ]; then
    bash init-databases.sh
fi
if [ -f "fix-database-ports.sh" ]; then
    bash fix-database-ports.sh
fi

# Step 1: Start Docker databases
echo -e "${YELLOW}Step 1: Starting PostgreSQL databases...${NC}"
if [ -z "$DOCKER_COMPOSE" ]; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo -e "${YELLOW}Please install Docker Desktop or docker-compose${NC}"
    echo -e "${YELLOW}Continuing without databases...${NC}"
    echo -e "${YELLOW}You can start databases manually later with: docker compose up -d${NC}\n"
else
    if ! $DOCKER_COMPOSE ps 2>/dev/null | grep -q "Up"; then
        echo -e "${YELLOW}Starting Docker containers...${NC}"
        $DOCKER_COMPOSE up -d
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Databases started${NC}"
            sleep 5
        else
            echo -e "${RED}Failed to start databases. Continuing anyway...${NC}"
        fi
    else
        echo -e "${GREEN}Databases already running${NC}"
    fi
fi

# Step 2: Install dependencies if needed
echo -e "\n${YELLOW}Step 2: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    npm install
fi

# Step 3: Start backend services
echo -e "\n${YELLOW}Step 3: Starting backend services...${NC}"

# Start API Gateway
echo -e "${YELLOW}Starting API Gateway (port 3000)...${NC}"
cd services/api-gateway
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing API Gateway dependencies...${NC}"
  npm install
fi
# Build first to ensure dist exists and fix path
echo -e "${YELLOW}Building API Gateway...${NC}"
rm -rf dist
npm run build 2>&1 | tail -3
# Fix main.js path if needed - copy entire src structure
if [ -f "dist/services/api-gateway/src/main.js" ] && [ ! -f "dist/main.js" ]; then
  cp -r dist/services/api-gateway/src/* dist/
  echo -e "${GREEN}Fixed API Gateway build output structure${NC}"
fi
# Verify main.js exists
if [ ! -f "dist/main.js" ]; then
  echo -e "${RED}ERROR: API Gateway dist/main.js not found!${NC}"
  find dist -name "main.js" 2>&1 | head -3
  exit 1
fi
# Start in watch mode (it will rebuild but we have initial build)
npm run start:dev > ../../logs/api-gateway.log 2>&1 &
API_GATEWAY_PID=$!
cd ../..
echo -e "${GREEN}API Gateway started (PID: $API_GATEWAY_PID)${NC}"
sleep 10

# Start Auth Service
echo -e "${YELLOW}Starting Auth Service (port 3001)...${NC}"
cd services/auth-service
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing Auth Service dependencies...${NC}"
  npm install
fi
# Build first to ensure dist exists
echo -e "${YELLOW}Building Auth Service...${NC}"
npm run build 2>&1 | tail -3
# Fix main.js path if needed - copy entire src structure
if [ -f "dist/services/auth-service/src/main.js" ] && [ ! -f "dist/main.js" ]; then
  cp -r dist/services/auth-service/src/* dist/
  echo -e "${GREEN}Fixed Auth Service build output structure${NC}"
fi
# Verify main.js exists before starting
if [ ! -f "dist/main.js" ]; then
  echo -e "${RED}ERROR: dist/main.js not found after build!${NC}"
  echo -e "${YELLOW}Build output:${NC}"
  find dist -name "main.js" 2>&1 | head -5
  exit 1
fi
npm run start:dev > ../../logs/auth-service.log 2>&1 &
AUTH_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Auth Service started (PID: $AUTH_SERVICE_PID)${NC}"
sleep 8

# Start School Service
echo -e "${YELLOW}Starting School Service (port 3002)...${NC}"
cd services/school-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/school-service.log 2>&1 &
SCHOOL_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}School Service started (PID: $SCHOOL_SERVICE_PID)${NC}"
sleep 3

# Start Student Service
echo -e "${YELLOW}Starting Student Service (port 3003)...${NC}"
cd services/student-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/student-service.log 2>&1 &
STUDENT_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Student Service started (PID: $STUDENT_SERVICE_PID)${NC}"
sleep 3

# Start Teacher Service
echo -e "${YELLOW}Starting Teacher Service (port 3004)...${NC}"
cd services/teacher-service
if [ ! -d "node_modules" ]; then
  npm install
fi
if [ ! -f "tsconfig.json" ]; then
  echo -e "${RED}ERROR: tsconfig.json not found in teacher-service${NC}"
  cd ../..
  continue
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/teacher-service.log 2>&1 &
TEACHER_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Teacher Service started (PID: $TEACHER_SERVICE_PID)${NC}"
sleep 3

# Start Parent Service
echo -e "${YELLOW}Starting Parent Service (port 3005)...${NC}"
cd services/parent-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/parent-service.log 2>&1 &
PARENT_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Parent Service started (PID: $PARENT_SERVICE_PID)${NC}"
sleep 3

# Start Attendance Service
echo -e "${YELLOW}Starting Attendance Service (port 3006)...${NC}"
cd services/attendance-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/attendance-service.log 2>&1 &
ATTENDANCE_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Attendance Service started (PID: $ATTENDANCE_SERVICE_PID)${NC}"
sleep 3

# Start Exam Service
echo -e "${YELLOW}Starting Exam Service (port 3007)...${NC}"
cd services/exam-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/exam-service.log 2>&1 &
EXAM_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Exam Service started (PID: $EXAM_SERVICE_PID)${NC}"
sleep 3

# Start Fees Service
echo -e "${YELLOW}Starting Fees Service (port 3008)...${NC}"
cd services/fees-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/fees-service.log 2>&1 &
FEES_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Fees Service started (PID: $FEES_SERVICE_PID)${NC}"
sleep 3

# Start Communication Service
echo -e "${YELLOW}Starting Communication Service (port 3009)...${NC}"
cd services/communication-service
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build > /dev/null 2>&1 || true
npm run start:dev > ../../logs/communication-service.log 2>&1 &
COMMUNICATION_SERVICE_PID=$!
cd ../..
echo -e "${GREEN}Communication Service started (PID: $COMMUNICATION_SERVICE_PID)${NC}"
sleep 3

# Step 4: Start Frontend
echo -e "\n${YELLOW}Step 4: Starting Frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing frontend dependencies...${NC}"
  npm install
fi
# Install crypto-browserify if needed for Vite
if ! npm list crypto-browserify > /dev/null 2>&1; then
  echo -e "${YELLOW}Installing crypto-browserify for Vite...${NC}"
  npm install --save-dev crypto-browserify 2>/dev/null || true
fi
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for services to be ready
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
echo -e "${YELLOW}This may take 30-60 seconds for all services to compile and start...${NC}"
sleep 20

# Check if services are running
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Service Status${NC}"
echo -e "${GREEN}========================================${NC}"

check_service() {
    local port=$1
    local name=$2
    if check_port $port; then
        echo -e "${GREEN}✓${NC} $name (port $port) - Running"
    else
        echo -e "${RED}✗${NC} $name (port $port) - Not running"
    fi
}

check_service 3000 "API Gateway"
check_service 3001 "Auth Service"
check_service 3002 "School Service"
check_service 3003 "Student Service"
check_service 3004 "Teacher Service"
check_service 3005 "Parent Service"
check_service 3006 "Attendance Service"
check_service 3007 "Exam Service"
check_service 3008 "Fees Service"
check_service 3009 "Communication Service"
check_service 5173 "Frontend"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}All services started!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Service URLs:${NC}"
echo -e "  Frontend:     http://localhost:5173"
echo -e "  API Gateway:  http://localhost:3000"
echo -e "\n${YELLOW}Logs are being saved to:${NC}"
echo -e "  logs/api-gateway.log"
echo -e "  logs/auth-service.log"
echo -e "  logs/school-service.log"
echo -e "  logs/student-service.log"
echo -e "  logs/teacher-service.log"
echo -e "  logs/parent-service.log"
echo -e "  logs/attendance-service.log"
echo -e "  logs/exam-service.log"
echo -e "  logs/fees-service.log"
echo -e "  logs/communication-service.log"
echo -e "  logs/frontend.log"
echo -e "\n${YELLOW}To view logs in real-time:${NC}"
echo -e "  tail -f logs/api-gateway.log"
echo -e "  tail -f logs/auth-service.log"
echo -e "  # ... etc"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Keep script running
wait
