# Gemini CLI Helper Script para Windows PowerShell
# Uso: .\scripts\gemini-cli.ps1 [comandos do gemini]

# Verifica se a API key está no .env
$envFile = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "GEMINI_API_KEY=(.+)") {
        $apiKey = $matches[1].Trim()
        $env:GEMINI_API_KEY = $apiKey
        Write-Host "✅ API Key carregada do .env" -ForegroundColor Green
    } elseif ($envContent -match "EXPO_PUBLIC_GEMINI_API_KEY=(.+)") {
        $apiKey = $matches[1].Trim()
        $env:GEMINI_API_KEY = $apiKey
        Write-Host "✅ API Key carregada do .env (EXPO_PUBLIC_GEMINI_API_KEY)" -ForegroundColor Green
    }
}

# Se não encontrou no .env, tenta variável de ambiente do sistema
if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️  GEMINI_API_KEY não encontrada no .env" -ForegroundColor Yellow
    Write-Host "   Configure via: `$env:GEMINI_API_KEY='sua_chave'" -ForegroundColor Yellow
}

# Executa o Gemini CLI
if ($args.Count -eq 0) {
    # Modo interativo
    Write-Host "🚀 Iniciando Gemini CLI..." -ForegroundColor Cyan
    npx -y @google/gemini-cli
} else {
    # Passa os argumentos para o CLI
    npx -y @google/gemini-cli $args
}

