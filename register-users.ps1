# Script to register users for all roles and verify persistence
# Usage: .\register-users.ps1

$ErrorActionPreference = "Continue"

Write-Host "========================================"
Write-Host "EasySchool - User Registration Script"
Write-Host "========================================"
Write-Host ""

$baseUrl = "http://localhost:3000/api/auth/register"

$users = @(
    @{
        email = "superadmin@easyschool.com"
        password = "Admin123!"
        firstName = "Super"
        lastName = "Admin"
        role = "super_admin"
        schoolId = $null
    },
    @{
        email = "schooladmin@easyschool.com"
        password = "Admin123!"
        firstName = "School"
        lastName = "Admin"
        role = "school_admin"
        schoolId = "school-001"
    },
    @{
        email = "teacher@easyschool.com"
        password = "Teacher123!"
        firstName = "John"
        lastName = "Teacher"
        role = "teacher"
        schoolId = "school-001"
    },
    @{
        email = "parent@easyschool.com"
        password = "Parent123!"
        firstName = "Jane"
        lastName = "Parent"
        role = "parent"
        schoolId = "school-001"
    },
    @{
        email = "student@easyschool.com"
        password = "Student123!"
        firstName = "Bob"
        lastName = "Student"
        role = "student"
        schoolId = "school-001"
    }
)

Write-Host "Registering users for all roles..."
Write-Host ""

foreach ($user in $users) {
    Write-Host "Registering $($user.role): $($user.email)..."
    
    $body = @{
        email = $user.email
        password = $user.password
        firstName = $user.firstName
        lastName = $user.lastName
        role = $user.role
    }
    
    if ($user.schoolId) {
        $body.schoolId = $user.schoolId
    }
    
    $jsonBody = $body | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
        $result = $response.Content | ConvertFrom-Json
        Write-Host "  SUCCESS: User ID $($result.id), Role: $($result.role)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  User already exists (OK)" -ForegroundColor Yellow
        } else {
            Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "Registration Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Check logs with:"
Write-Host "  docker-compose logs auth-service | Select-String 'REGISTRATION'"
Write-Host "  docker-compose logs api-gateway | Select-String 'API GATEWAY'"
Write-Host ""
