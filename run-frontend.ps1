# ============================================================
# Virtual Plant Care Management System - Frontend Runner
# ============================================================

$Host.UI.RawUI.WindowTitle = "Virtual Plant Care - React Frontend"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Starting React + Vite Frontend (Port 5173)..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path "$PSScriptRoot\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Running npm install first..." -ForegroundColor Yellow
    npm install
}

npm run dev
