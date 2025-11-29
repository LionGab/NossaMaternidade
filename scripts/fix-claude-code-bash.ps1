# 🔧 Script de Fix: Claude Code Git Bash no Windows
# Uso: pwsh -ExecutionPolicy Bypass -File scripts/fix-claude-code-bash.ps1

Write-Host "🔧 Configurando Claude Code Git Bash no Windows..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se Git está instalado
Write-Host "1️⃣ Verificando instalação do Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Git instalado: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git não encontrado"
    }
} catch {
    Write-Host "   ❌ Git não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "   📥 Instale o Git em: https://git-scm.com/downloads/win" -ForegroundColor Yellow
    Write-Host "   ⚠️  Durante a instalação, marque 'Add Git to PATH'" -ForegroundColor Yellow
    exit 1
}

# 2. Encontrar caminho do bash.exe
Write-Host ""
Write-Host "2️⃣ Procurando bash.exe..." -ForegroundColor Yellow

$possiblePaths = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files\Git\usr\bin\bash.exe",
    "$env:ProgramFiles\Git\bin\bash.exe",
    "$env:ProgramFiles\Git\usr\bin\bash.exe",
    "$env:ProgramFiles(x86)\Git\bin\bash.exe",
    "$env:ProgramFiles(x86)\Git\usr\bin\bash.exe"
)

$bashPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $bashPath = $path
        Write-Host "   ✅ ENCONTRADO: $path" -ForegroundColor Green
        break
    }
}

if (-not $bashPath) {
    Write-Host "   ❌ bash.exe não encontrado em nenhum dos caminhos padrão" -ForegroundColor Red
    Write-Host ""
    Write-Host "   💡 Tente encontrar manualmente:" -ForegroundColor Yellow
    Write-Host "      1. Abra o File Explorer" -ForegroundColor Yellow
    Write-Host "      2. Navegue até a pasta de instalação do Git" -ForegroundColor Yellow
    Write-Host "      3. Procure por bash.exe em bin/ ou usr/bin/" -ForegroundColor Yellow
    exit 1
}

# 3. Verificar se variável já existe
Write-Host ""
Write-Host "3️⃣ Verificando variável de ambiente..." -ForegroundColor Yellow

$currentValue = [Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", "User")

if ($currentValue -eq $bashPath) {
    Write-Host "   ✅ Variável já configurada corretamente!" -ForegroundColor Green
    Write-Host "      Valor: $currentValue" -ForegroundColor Gray
} else {
    if ($currentValue) {
        Write-Host "   ⚠️  Variável existe mas com valor diferente:" -ForegroundColor Yellow
        Write-Host "      Atual: $currentValue" -ForegroundColor Gray
        Write-Host "      Novo:  $bashPath" -ForegroundColor Gray
    } else {
        Write-Host "   ℹ️  Variável não existe, será criada" -ForegroundColor Cyan
    }

    # 4. Definir variável de ambiente
    Write-Host ""
    Write-Host "4️⃣ Configurando variável de ambiente..." -ForegroundColor Yellow
    
    try {
        [Environment]::SetEnvironmentVariable(
            "CLAUDE_CODE_GIT_BASH_PATH",
            $bashPath,
            "User"
        )
        Write-Host "   ✅ Variável configurada com sucesso!" -ForegroundColor Green
        Write-Host "      Nome:  CLAUDE_CODE_GIT_BASH_PATH" -ForegroundColor Gray
        Write-Host "      Valor: $bashPath" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Erro ao configurar variável: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "   💡 Tente executar como Administrador:" -ForegroundColor Yellow
        Write-Host "      pwsh -ExecutionPolicy Bypass -File scripts/fix-claude-code-bash.ps1" -ForegroundColor Cyan
        exit 1
    }
}

# 5. Verificar configuração
Write-Host ""
Write-Host "5️⃣ Verificando configuração final..." -ForegroundColor Yellow

$finalValue = [Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", "User")
if ($finalValue -eq $bashPath) {
    Write-Host "   ✅ Configuração verificada com sucesso!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erro na verificação" -ForegroundColor Red
    exit 1
}

# 6. Instruções finais
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Feche COMPLETAMENTE o Cursor (todas as janelas)" -ForegroundColor White
Write-Host "   2. Reabra o Cursor" -ForegroundColor White
Write-Host "   3. Tente usar o Claude Code novamente" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: O Cursor precisa ser reiniciado para reconhecer" -ForegroundColor Yellow
Write-Host "   a nova variável de ambiente." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 DICA: Se ainda não funcionar após reiniciar, verifique:" -ForegroundColor Cyan
Write-Host "   - Variável está definida: echo `$env:CLAUDE_CODE_GIT_BASH_PATH" -ForegroundColor Gray
Write-Host "   - Arquivo existe: Test-Path '$bashPath'" -ForegroundColor Gray
Write-Host ""

