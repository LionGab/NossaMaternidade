# Script para verificar e instalar Google Cloud SDK no Windows
# Execute: .\scripts\check-gcloud.ps1

Write-Host "Verificando instalacao do Google Cloud SDK..." -ForegroundColor Cyan

# Verificar se gcloud esta instalado
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue

if ($gcloudPath) {
    Write-Host "Google Cloud SDK encontrado!" -ForegroundColor Green
    Write-Host "Localizacao: $($gcloudPath.Source)" -ForegroundColor Gray
    Write-Host ""
    
    # Verificar versao
    $version = gcloud --version 2>&1 | Select-Object -First 1
    Write-Host "Versao: $version" -ForegroundColor Gray
    Write-Host ""
    
    # Verificar se esta autenticado
    Write-Host "Verificando autenticacao..." -ForegroundColor Cyan
    $account = gcloud config get-value account 2>&1
    if ($account -and $account -notmatch "ERROR") {
        Write-Host "Autenticado como: $account" -ForegroundColor Green
    } else {
        Write-Host "Nao autenticado. Execute: gcloud auth login" -ForegroundColor Yellow
    }
    
    # Verificar projeto configurado
    Write-Host ""
    Write-Host "Verificando projeto..." -ForegroundColor Cyan
    $project = gcloud config get-value project 2>&1
    if ($project -and $project -notmatch "ERROR") {
        Write-Host "Projeto: $project" -ForegroundColor Green
    } else {
        Write-Host "Nenhum projeto configurado. Execute: gcloud config set project SEU_PROJECT_ID" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "Google Cloud SDK nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opcoes de instalacao:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opcao 1: Script automatico (Requer Admin)" -ForegroundColor Green
    Write-Host "   .\scripts\install-gcloud.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opcao 2: Instalador manual" -ForegroundColor Green
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opcao 3: Chocolatey" -ForegroundColor Green
    Write-Host "   choco install gcloudsdk" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opcao 4: Deploy SEM gcloud CLI" -ForegroundColor Green
    Write-Host "   .\scripts\deploy-without-gcloud.ps1" -ForegroundColor Cyan
    Write-Host "   (Mostra alternativas usando Cloud Code ou Console Web)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "RECOMENDADO: Use Cloud Code no VS Code (nao requer gcloud CLI)" -ForegroundColor Magenta
    Write-Host "   Execute: .\scripts\deploy-without-gcloud.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Documentacao completa: CLOUD_CODE_SETUP.md" -ForegroundColor Gray
