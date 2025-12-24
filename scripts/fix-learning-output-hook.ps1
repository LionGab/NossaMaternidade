# =============================================================================
# Fix Learning Output Style Hook - Desabilitar Hook Problemático
# =============================================================================
# Desabilita o hook session-start.sh do plugin learning-output-style
# que está sendo executado repetidamente
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Learning Output Style Hook" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Caminho do hook
$hookPath = "$env:USERPROFILE\.claude\plugins\cache\claude-code-plugins\learning-output-style\1.0.0\hooks-handlers\session-start.sh"

Write-Host "[*] Procurando hook session-start.sh..." -ForegroundColor Yellow

if (Test-Path $hookPath) {
    Write-Host "[OK] Hook encontrado: $hookPath" -ForegroundColor Green
} else {
    Write-Host "[!] Hook nao encontrado no caminho padrao." -ForegroundColor Yellow
    Write-Host "    Tentando busca recursiva..." -ForegroundColor Gray
    
    # Busca recursiva
    $searchPaths = @(
        "$env:USERPROFILE\.claude",
        "$env:APPDATA\.claude",
        "$env:LOCALAPPDATA\.claude"
    )
    
    $found = $null
    foreach ($basePath in $searchPaths) {
        if (Test-Path $basePath) {
            $found = Get-ChildItem -Path $basePath -Recurse -Filter "session-start.sh" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like "*learning-output-style*" }
            if ($found) {
                $hookPath = $found[0].FullName
                Write-Host "[OK] Hook encontrado: $hookPath" -ForegroundColor Green
                break
            }
        }
    }
    
    if (-not $found) {
        Write-Host "[ERRO] Hook session-start.sh nao encontrado." -ForegroundColor Red
        Write-Host "       O hook pode ter sido removido ou o plugin nao esta instalado." -ForegroundColor Yellow
        exit 1
    }
}

# Verificar se já está desabilitado
$disabledPath = $hookPath + ".disabled"
if (Test-Path $disabledPath) {
    Write-Host "[INFO] Hook ja esta desabilitado: $disabledPath" -ForegroundColor Blue
    Write-Host "       Nada a fazer." -ForegroundColor Green
    exit 0
}

# Desabilitar o hook
Write-Host "[*] Desabilitando hook..." -ForegroundColor Yellow

try {
    # No Windows, arquivos .sh podem não ter permissão de renomeação direta
    # Vamos tentar copiar e depois remover o original
    Copy-Item -Path $hookPath -Destination $disabledPath -Force
    Remove-Item -Path $hookPath -Force
    
    Write-Host "[OK] Hook desabilitado com sucesso!" -ForegroundColor Green
    Write-Host "     Arquivo renomeado para: session-start.sh.disabled" -ForegroundColor Gray
} catch {
    Write-Host "[ERRO] Erro ao desabilitar hook: $_" -ForegroundColor Red
    Write-Host "       Tente executar como Administrador ou desabilitar manualmente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "       Comando manual:" -ForegroundColor Cyan
    Write-Host "       Rename-Item '$hookPath' 'session-start.sh.disabled'" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Aplicado com Sucesso!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Feche e reabra o Cursor IDE" -ForegroundColor Gray
Write-Host "  2. O hook nao deve mais ser executado repetidamente" -ForegroundColor Gray
Write-Host ""
Write-Host "Para reabilitar (se necessario):" -ForegroundColor Yellow
Write-Host "  Renomeie: session-start.sh.disabled para session-start.sh" -ForegroundColor Gray
Write-Host ""

