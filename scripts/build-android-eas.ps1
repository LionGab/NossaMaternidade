# Script para fazer build Android via EAS Build (na nuvem)
# Este script contorna o prompt interativo sobre metro.config.js

Write-Host "🚀 Iniciando build Android development via EAS Build..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  O EAS pode avisar sobre metro.config.js, mas está correto." -ForegroundColor Yellow
Write-Host "    Quando perguntar 'Would you like to abort?', responda 'n' (não)" -ForegroundColor Yellow
Write-Host ""

# Executar build
npm run build:dev:android

Write-Host ""
Write-Host "✅ Build iniciado! Acompanhe o progresso no dashboard do EAS." -ForegroundColor Green
Write-Host "   URL: https://expo.dev/accounts/liongab/projects/nossa-maternidade/builds" -ForegroundColor Cyan

