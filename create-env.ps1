# Script PowerShell para criar arquivo .env no Windows
# Execute: .\create-env.ps1
# Uso: pwsh -ExecutionPolicy Bypass -File create-env.ps1

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Criando arquivo .env..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto (onde está package.json)" -ForegroundColor Red
    exit 1
}

if (Test-Path ".env") {
    $response = Read-Host "Arquivo .env já existe. Deseja sobrescrever? (s/N)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "Removendo .env existente..." -ForegroundColor Yellow
    Remove-Item ".env" -Force
}

if (Test-Path "env.template") {
    try {
        Copy-Item "env.template" ".env" -Force
        Write-Host "✅ Arquivo .env criado a partir de env.template!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
        Write-Host "   1. Edite o arquivo .env e preencha os valores reais" -ForegroundColor Yellow
        Write-Host "   2. Verifique que o arquivo .env está no .gitignore (já deve estar)" -ForegroundColor Yellow
        Write-Host "   3. NUNCA commite o arquivo .env com valores reais" -ForegroundColor Red
        Write-Host ""
        Write-Host "Próximo passo: Edite .env com seus valores reais, depois execute 'npm start -- --clear'" -ForegroundColor Cyan
        exit 0
    } catch {
        Write-Host "❌ Erro ao criar .env: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Arquivo env.template não encontrado!" -ForegroundColor Red
    Write-Host "   Crie o arquivo env.template primeiro." -ForegroundColor Yellow
    exit 1
}

