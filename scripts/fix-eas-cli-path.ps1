# =============================================================================
# Fix EAS CLI Path - Configurar PATH do npm no PowerShell
# =============================================================================
# Adiciona o caminho do npm ao PATH do PowerShell para reconhecer comandos globais
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix EAS CLI Path - Configurar PATH" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se EAS CLI está instalado
Write-Host "[*] Verificando instalacao do EAS CLI..." -ForegroundColor Yellow

$easInstalled = npm list -g eas-cli 2>&1 | Select-String "eas-cli"
if ($easInstalled) {
    Write-Host "[OK] EAS CLI esta instalado globalmente" -ForegroundColor Green
    $easVersion = npx eas-cli --version 2>&1
    Write-Host "     Versao: $easVersion" -ForegroundColor Gray
} else {
    Write-Host "[!] EAS CLI nao encontrado globalmente" -ForegroundColor Yellow
    Write-Host "    Instalando..." -ForegroundColor Gray
    npm install -g eas-cli
}

Write-Host ""

# Obter caminho do npm
Write-Host "[*] Obtendo caminho do npm..." -ForegroundColor Yellow

$npmPrefix = npm config get prefix
$npmBinPath = Join-Path $npmPrefix "node_modules\.bin"

if (Test-Path $npmBinPath) {
    Write-Host "[OK] Caminho encontrado: $npmBinPath" -ForegroundColor Green
} else {
    # Tentar caminho alternativo
    $npmBinPath = "$env:APPDATA\npm"
    if (Test-Path $npmBinPath) {
        Write-Host "[OK] Caminho alternativo encontrado: $npmBinPath" -ForegroundColor Green
    } else {
        Write-Host "[ERRO] Caminho do npm nao encontrado" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Verificar se já está no PATH
Write-Host "[*] Verificando PATH atual..." -ForegroundColor Yellow

$currentPath = $env:PATH
if ($currentPath -like "*$npmBinPath*") {
    Write-Host "[OK] Caminho ja esta no PATH" -ForegroundColor Green
} else {
    Write-Host "[!] Caminho nao esta no PATH" -ForegroundColor Yellow
    Write-Host "    Adicionando ao PATH da sessao atual..." -ForegroundColor Gray
    
    $env:PATH = "$npmBinPath;$env:PATH"
    Write-Host "[OK] PATH atualizado para esta sessao" -ForegroundColor Green
}

Write-Host ""

# Testar comando eas
Write-Host "[*] Testando comando 'eas'..." -ForegroundColor Yellow

try {
    $easVersion = eas --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Comando 'eas' funcionando!" -ForegroundColor Green
        Write-Host "     Versao: $easVersion" -ForegroundColor Gray
    } else {
        Write-Host "[!] Comando 'eas' ainda nao funciona nesta sessao" -ForegroundColor Yellow
        Write-Host "    Use 'npx eas-cli' ou reinicie o PowerShell" -ForegroundColor Gray
    }
} catch {
    Write-Host "[!] Comando 'eas' nao encontrado" -ForegroundColor Yellow
    Write-Host "    Use 'npx eas-cli' como alternativa" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# SOLUÇÃO PERMANENTE: Adicionar ao PATH do usuário
# =============================================================================

Write-Host "[*] Configurando PATH permanente..." -ForegroundColor Yellow

try {
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($userPath -notlike "*$npmBinPath*") {
        Write-Host "[*] Adicionando ao PATH do usuario..." -ForegroundColor Yellow
        [Environment]::SetEnvironmentVariable("Path", "$userPath;$npmBinPath", "User")
        Write-Host "[OK] PATH permanente configurado!" -ForegroundColor Green
        Write-Host "     Reinicie o PowerShell para aplicar" -ForegroundColor Gray
    } else {
        Write-Host "[OK] PATH permanente ja esta configurado" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERRO] Falha ao configurar PATH permanente: $_" -ForegroundColor Red
    Write-Host "       Voce pode precisar de permissoes de administrador" -ForegroundColor Yellow
}

Write-Host ""

# =============================================================================
# RESUMO E ALTERNATIVAS
# =============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Configuracao Concluida!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opcoes para usar EAS CLI:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Usar npx (recomendado - sempre funciona):" -ForegroundColor Yellow
Write-Host "   npx eas-cli build --platform ios" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Usar script npm (ja configurado):" -ForegroundColor Yellow
Write-Host "   npm run eas:build:ios" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Reiniciar PowerShell e usar 'eas' diretamente:" -ForegroundColor Yellow
Write-Host "   eas build --platform ios" -ForegroundColor Gray
Write-Host ""
Write-Host "Para verificar se 'eas' funciona:" -ForegroundColor Cyan
Write-Host "   eas --version" -ForegroundColor Gray
Write-Host ""

