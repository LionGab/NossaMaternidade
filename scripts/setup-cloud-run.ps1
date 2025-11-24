# Script de setup para Cloud Run no Windows
# Verifica pre-requisitos e configura o ambiente

param(
    [string]$ProjectId = "",
    [string]$Region = "us-central1"
)

Write-Host "Setup Cloud Run - Nossa Maternidade" -ForegroundColor Cyan
Write-Host ""

# Verificar gcloud
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudPath) {
    Write-Host "Google Cloud SDK nao encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\scripts\check-gcloud.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Google Cloud SDK encontrado" -ForegroundColor Green

# Verificar autenticacao
Write-Host ""
Write-Host "Verificando autenticacao..." -ForegroundColor Cyan
$account = gcloud config get-value account 2>&1
if (-not $account -or $account -match "ERROR") {
    Write-Host "Nao autenticado. Fazendo login..." -ForegroundColor Yellow
    gcloud auth login
} else {
    Write-Host "Autenticado como: $account" -ForegroundColor Green
}

# Configurar projeto
if ($ProjectId) {
    Write-Host ""
    Write-Host "Configurando projeto: $ProjectId" -ForegroundColor Cyan
    gcloud config set project $ProjectId
} else {
    $currentProject = gcloud config get-value project 2>&1
    if (-not $currentProject -or $currentProject -match "ERROR") {
        Write-Host ""
        Write-Host "Nenhum projeto configurado!" -ForegroundColor Yellow
        Write-Host "Execute: .\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID" -ForegroundColor Cyan
        exit 1
    }
    Write-Host "Projeto atual: $currentProject" -ForegroundColor Green
}

# Habilitar APIs necessarias
Write-Host ""
Write-Host "Habilitando APIs necessarias..." -ForegroundColor Cyan
$apis = @(
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "containerregistry.googleapis.com",
    "secretmanager.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "  -> Habilitando $api..." -ForegroundColor Gray
    gcloud services enable $api --quiet 2>&1 | Out-Null
}

Write-Host "APIs habilitadas" -ForegroundColor Green

# Criar secrets (se nao existirem)
Write-Host ""
Write-Host "Configurando secrets..." -ForegroundColor Cyan
Write-Host "Voce precisara criar os secrets manualmente:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  gcloud secrets create supabase-anon-key --data-file=-" -ForegroundColor Gray
Write-Host "  gcloud secrets create gemini-api-key --data-file=-" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou use o Google Cloud Console: https://console.cloud.google.com/security/secret-manager" -ForegroundColor Cyan

# Verificar service.yaml
Write-Host ""
Write-Host "Verificando service.yaml..." -ForegroundColor Cyan
if (Test-Path "service.yaml") {
    $serviceContent = Get-Content "service.yaml" -Raw
    if ($serviceContent -match "PROJECT_ID") {
        Write-Host "service.yaml contem PROJECT_ID placeholder!" -ForegroundColor Yellow
        Write-Host "   Edite service.yaml e substitua PROJECT_ID pelo seu ID de projeto" -ForegroundColor Gray
    } else {
        Write-Host "service.yaml parece estar configurado" -ForegroundColor Green
    }
} else {
    Write-Host "service.yaml nao encontrado!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure os secrets (veja acima)" -ForegroundColor White
Write-Host "2. Edite service.yaml se necessario" -ForegroundColor White
Write-Host "3. Execute: npm run deploy:cloud-run" -ForegroundColor White
Write-Host ""
Write-Host "Ou use Cloud Code no VS Code para deploy visual" -ForegroundColor Magenta
