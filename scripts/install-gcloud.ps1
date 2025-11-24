# Script para instalar Google Cloud SDK no Windows
# Execute como Administrador: .\scripts\install-gcloud.ps1

param(
    [switch]$SkipDownload,
    [string]$InstallPath = "$env:ProgramFiles\Google\Cloud SDK"
)

Write-Host "🚀 Instalador Google Cloud SDK para Windows" -ForegroundColor Cyan
Write-Host ""

# Verificar se já está instalado
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if ($gcloudPath) {
    Write-Host "✅ Google Cloud SDK já está instalado!" -ForegroundColor Green
    Write-Host "📍 Localização: $($gcloudPath.Source)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Para verificar configuração, execute:" -ForegroundColor Yellow
    Write-Host "   .\scripts\check-gcloud.ps1" -ForegroundColor Gray
    exit 0
}

# Verificar se é Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Este script requer privilégios de Administrador!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Cyan
    Write-Host "1. Execute PowerShell como Administrador e rode este script novamente" -ForegroundColor White
    Write-Host "2. Instale manualmente: https://cloud.google.com/sdk/docs/install" -ForegroundColor White
    Write-Host "3. Use Cloud Code no VS Code (não requer gcloud CLI)" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "📥 Baixando Google Cloud SDK Installer..." -ForegroundColor Cyan

$installerPath = "$env:Temp\GoogleCloudSDKInstaller.exe"
$installerUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"

try {
    if (-not $SkipDownload -or -not (Test-Path $installerPath)) {
        Write-Host "  → Baixando de: $installerUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
        Write-Host "  ✅ Download concluído" -ForegroundColor Green
    } else {
        Write-Host "  → Usando arquivo existente: $installerPath" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "🔧 Iniciando instalador..." -ForegroundColor Cyan
    Write-Host "  → Siga as instruções na janela do instalador" -ForegroundColor Gray
    Write-Host "  → Marque 'Run gcloud init' após a instalação" -ForegroundColor Yellow
    Write-Host ""

    # Executar instalador
    Start-Process -FilePath $installerPath -Wait

    Write-Host ""
    Write-Host "✅ Instalação concluída!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Feche e reabra o terminal PowerShell" -ForegroundColor White
    Write-Host "2. Execute: gcloud init" -ForegroundColor White
    Write-Host "3. Ou execute: .\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "❌ Erro durante instalação: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativas:" -ForegroundColor Yellow
    Write-Host "1. Instale manualmente: https://cloud.google.com/sdk/docs/install" -ForegroundColor White
    Write-Host "2. Use Chocolatey: choco install gcloudsdk" -ForegroundColor White
    Write-Host "3. Use Cloud Code no VS Code (não requer gcloud CLI)" -ForegroundColor White
    Write-Host ""
    exit 1
}

