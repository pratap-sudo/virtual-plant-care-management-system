# ============================================================
# Virtual Plant Care Management System - Backend Runner
# ============================================================

$Host.UI.RawUI.WindowTitle = "Virtual Plant Care - Spring Boot Backend"

# Supabase Connection Pooler Credentials
$env:DB_URL = "jdbc:postgresql://aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
$env:DB_USERNAME = "postgres.iizxpudngomxbjiqvtye"
$env:DB_PASSWORD = "tpB0xQk7O6jKiq32"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Green
Write-Host "  Connecting to Supabase Cloud Database" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"

if (-not $env:JAVA_HOME -and (Test-Path "C:\Program Files\Java\jdk-25")) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
    $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
}

.\mvnw.cmd spring-boot:run

