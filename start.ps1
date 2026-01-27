# EasySchool - Startup Script for Windows PowerShell
# This script starts all services (DB, Backend, Frontend) and preserves logs

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

Write-ColorOutput Green "========================================"
Write-ColorOutput Green "EasySchool - Starting All Services"
Write-ColorOutput Green "========================================"
Write-Output ""

# Step 1: Start Docker databases
Write-ColorOutput Yellow "Step 1: Starting PostgreSQL databases..."
$dockerStatus = docker-compose ps 2>$null
if ($dockerStatus -notmatch "Up") {
    docker-compose up -d
    Write-ColorOutput Green "Databases started"
    Start-Sleep -Seconds 5
} else {
    Write-ColorOutput Green "Databases already running"
}

# Step 2: Install dependencies if needed
Write-Output ""
Write-ColorOutput Yellow "Step 2: Checking dependencies..."
if (-not (Test-Path "node_modules")) {
    Write-ColorOutput Yellow "Installing root dependencies..."
    npm install
}

# Step 3: Start backend services
Write-Output ""
Write-ColorOutput Yellow "Step 3: Starting backend services..."

$services = @(
    @{Name="API Gateway"; Port=3000; Path="services/api-gateway"; Log="api-gateway.log"},
    @{Name="Auth Service"; Port=3001; Path="services/auth-service"; Log="auth-service.log"},
    @{Name="School Service"; Port=3002; Path="services/school-service"; Log="school-service.log"},
    @{Name="Student Service"; Port=3003; Path="services/student-service"; Log="student-service.log"},
    @{Name="Teacher Service"; Port=3004; Path="services/teacher-service"; Log="teacher-service.log"},
    @{Name="Parent Service"; Port=3005; Path="services/parent-service"; Log="parent-service.log"},
    @{Name="Attendance Service"; Port=3006; Path="services/attendance-service"; Log="attendance-service.log"},
    @{Name="Exam Service"; Port=3007; Path="services/exam-service"; Log="exam-service.log"},
    @{Name="Fees Service"; Port=3008; Path="services/fees-service"; Log="fees-service.log"},
    @{Name="Communication Service"; Port=3009; Path="services/communication-service"; Log="communication-service.log"}
)

$processes = @()

foreach ($service in $services) {
    Write-ColorOutput Yellow "Starting $($service.Name) (port $($service.Port))..."
    
    Push-Location $service.Path
    
    if (-not (Test-Path "node_modules")) {
        npm install
    }
    
    $logFile = Join-Path $PSScriptRoot "logs\$($service.Log)"
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "start:dev" -RedirectStandardOutput $logFile -RedirectStandardError $logFile
    
    Pop-Location
    
    Write-ColorOutput Green "$($service.Name) started"
    Start-Sleep -Seconds 2
}

# Step 4: Start Frontend
Write-Output ""
Write-ColorOutput Yellow "Step 4: Starting Frontend..."
Push-Location "frontend"

if (-not (Test-Path "node_modules")) {
    Write-ColorOutput Yellow "Installing frontend dependencies..."
    npm install
}

$frontendLog = Join-Path $PSScriptRoot "logs\frontend.log"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -RedirectStandardOutput $frontendLog -RedirectStandardError $frontendLog

Pop-Location
Write-ColorOutput Green "Frontend started"

# Wait for services
Write-Output ""
Write-ColorOutput Yellow "Waiting for services to be ready..."
Start-Sleep -Seconds 5

# Display status
Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "Service Status"
Write-ColorOutput Green "========================================"

function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

foreach ($service in $services) {
    if (Test-Port -Port $service.Port) {
        Write-ColorOutput Green "✓ $($service.Name) (port $($service.Port)) - Running"
    } else {
        Write-ColorOutput Red "✗ $($service.Name) (port $($service.Port)) - Not running"
    }
}

if (Test-Port -Port 5173) {
    Write-ColorOutput Green "✓ Frontend (port 5173) - Running"
} else {
    Write-ColorOutput Red "✗ Frontend (port 5173) - Not running"
}

Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "All services started!"
Write-ColorOutput Green "========================================"
Write-Output ""
Write-ColorOutput Yellow "Service URLs:"
Write-Output "  Frontend:     http://localhost:5173"
Write-Output "  API Gateway:  http://localhost:3000"
Write-Output ""
Write-ColorOutput Yellow "Logs are being saved to the logs/ directory"
Write-Output ""
Write-ColorOutput Yellow "Press Ctrl+C to stop all services"
Write-Output ""

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-ColorOutput Yellow "Shutting down services..."
    docker-compose down
    Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
    Write-ColorOutput Green "Cleanup complete"
}
