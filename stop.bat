@echo off
REM EasySchool - Stop Script for Windows Batch
REM This script stops all services

echo.
echo ========================================
echo EasySchool - Stopping All Services
echo ========================================
echo.

echo Stopping Docker containers...
docker-compose down 2>nul

echo Stopping Node.js processes...
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

REM Also try to kill by port
for /L %%i in (3000,1,3009) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%i " ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All services stopped!
echo.
pause
