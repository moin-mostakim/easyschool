# EasySchool - Stop Script for Windows PowerShell
# This script stops all running services

Write-Host "Stopping all EasySchool services..." -ForegroundColor Yellow

# Stop Docker containers
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "Docker containers stopped" -ForegroundColor Green

# Stop Node processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "All services stopped" -ForegroundColor Green
