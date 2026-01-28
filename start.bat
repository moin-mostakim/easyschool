@echo off
REM EasySchool - Startup Script for Windows Batch
REM This script starts all services (DB, Backend, Frontend) and preserves logs

setlocal enabledelayedexpansion

REM Get the script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Colors for output (basic)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

REM Create logs directory
if not exist "logs" mkdir logs

echo.
echo ========================================
echo EasySchool - Starting All Services
echo ========================================
echo.

REM Step 1: Start Docker databases
echo Step 1: Starting PostgreSQL databases...
docker-compose ps >nul 2>&1
if errorlevel 1 (
    echo Starting Docker containers...
    docker-compose up -d >nul 2>&1
    if errorlevel 1 (
        echo Warning: Docker Compose may not be installed or running
        echo Continuing without databases...
    ) else (
        echo Databases started
        timeout /t 5 /nobreak >nul
    )
) else (
    echo Databases already running
)

REM Step 2: Install dependencies if needed
echo.
echo Step 2: Checking dependencies...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

REM Step 3: Start backend services
echo.
echo Step 3: Starting backend services...

REM Define services array (using variables)
set "SERVICE_COUNT=10"
set "SERVICE_1_NAME=API Gateway"
set "SERVICE_1_PORT=3000"
set "SERVICE_1_PATH=services\api-gateway"
set "SERVICE_1_LOG=api-gateway.log"

set "SERVICE_2_NAME=Auth Service"
set "SERVICE_2_PORT=3001"
set "SERVICE_2_PATH=services\auth-service"
set "SERVICE_2_LOG=auth-service.log"

set "SERVICE_3_NAME=School Service"
set "SERVICE_3_PORT=3002"
set "SERVICE_3_PATH=services\school-service"
set "SERVICE_3_LOG=school-service.log"

set "SERVICE_4_NAME=Student Service"
set "SERVICE_4_PORT=3003"
set "SERVICE_4_PATH=services\student-service"
set "SERVICE_4_LOG=student-service.log"

set "SERVICE_5_NAME=Teacher Service"
set "SERVICE_5_PORT=3004"
set "SERVICE_5_PATH=services\teacher-service"
set "SERVICE_5_LOG=teacher-service.log"

set "SERVICE_6_NAME=Parent Service"
set "SERVICE_6_PORT=3005"
set "SERVICE_6_PATH=services\parent-service"
set "SERVICE_6_LOG=parent-service.log"

set "SERVICE_7_NAME=Attendance Service"
set "SERVICE_7_PORT=3006"
set "SERVICE_7_PATH=services\attendance-service"
set "SERVICE_7_LOG=attendance-service.log"

set "SERVICE_8_NAME=Exam Service"
set "SERVICE_8_PORT=3007"
set "SERVICE_8_PATH=services\exam-service"
set "SERVICE_8_LOG=exam-service.log"

set "SERVICE_9_NAME=Fees Service"
set "SERVICE_9_PORT=3008"
set "SERVICE_9_PATH=services\fees-service"
set "SERVICE_9_LOG=fees-service.log"

set "SERVICE_10_NAME=Communication Service"
set "SERVICE_10_PORT=3009"
set "SERVICE_10_PATH=services\communication-service"
set "SERVICE_10_LOG=communication-service.log"

REM Start each service
for /L %%i in (1,1,%SERVICE_COUNT%) do (
    set "SERVICE_NAME=!SERVICE_%%i_NAME!"
    set "SERVICE_PORT=!SERVICE_%%i_PORT!"
    set "SERVICE_PATH=!SERVICE_%%i_PATH!"
    set "SERVICE_LOG=!SERVICE_%%i_LOG!"
    
    echo Starting !SERVICE_NAME! ^(port !SERVICE_PORT!^)...
    
    pushd "!SERVICE_PATH!"
    
    if not exist "node_modules" (
        call npm install
    )
    
    set "LOG_FILE=%SCRIPT_DIR%logs\!SERVICE_LOG!"
    if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"
    set "FULL_SERVICE_PATH=%SCRIPT_DIR!!SERVICE_PATH!"
    start "!SERVICE_NAME!" /MIN cmd /c "cd /d \"!FULL_SERVICE_PATH!\" && npm run start:dev 1>> \"!LOG_FILE!\" 2>> \"!LOG_FILE!\""
    
    popd
    
    echo !SERVICE_NAME! started
    timeout /t 2 /nobreak >nul
)

REM Step 4: Start Frontend
echo.
echo Step 4: Starting Frontend...
pushd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

set "FRONTEND_LOG=%SCRIPT_DIR%logs\frontend.log"
if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"
set "FULL_FRONTEND_PATH=%SCRIPT_DIR%frontend"
start "Frontend" /MIN cmd /c "cd /d \"!FULL_FRONTEND_PATH!\" && npm run dev 1>> \"!FRONTEND_LOG!\" 2>> \"!FRONTEND_LOG!\""

popd
echo Frontend started

REM Wait for services
echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak >nul

REM Display status
echo.
echo ========================================
echo Service Status
echo ========================================

REM Function to test port (using netstat)
for /L %%i in (1,1,%SERVICE_COUNT%) do (
    set "SERVICE_NAME=!SERVICE_%%i_NAME!"
    set "SERVICE_PORT=!SERVICE_%%i_PORT!"
    
    netstat -an | findstr ":!SERVICE_PORT! " >nul 2>&1
    if errorlevel 1 (
        echo [X] !SERVICE_NAME! ^(port !SERVICE_PORT!^) ^- Not running
    ) else (
        echo [OK] !SERVICE_NAME! ^(port !SERVICE_PORT!^) ^- Running
    )
)

netstat -an | findstr ":5173 " >nul 2>&1
if errorlevel 1 (
    echo [X] Frontend ^(port 5173^) ^- Not running
) else (
    echo [OK] Frontend ^(port 5173^) ^- Running
)

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Service URLs:
echo   Frontend:     http://localhost:5173
echo   API Gateway:  http://localhost:3000
echo.
echo Logs are being saved to the logs\ directory
echo.
echo Press Ctrl+C to stop all services
echo.

REM Keep script running and wait for Ctrl+C
:WAIT
timeout /t 1 /nobreak >nul
goto WAIT

REM Cleanup on exit (Ctrl+C)
:cleanup
echo.
echo Shutting down services...
docker-compose down 2>nul
taskkill /F /FI "WINDOWTITLE eq API Gateway*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Auth Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq School Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Student Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Teacher Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Parent Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Attendance Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Exam Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Fees Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Communication Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Frontend*" 2>nul
echo Cleanup complete
exit /b 0
