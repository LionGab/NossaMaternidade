# =============================================================================
# Fix Hookify Error - Desabilitar Hook Problemático
# =============================================================================
# Desabilita o hook stop-hook.sh do plugin ralph-wiggum que causa erro
# "Hookify import error: No module named 'hookify'"
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Hookify Error - Desabilitar Hook Problemático" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Caminhos possíveis do hook (Windows)
$possiblePaths = @(
    "$env:USERPROFILE\.claude\plugins\cache\claude-code-plugins\ralph-wiggum\1.0.0\hooks\stop-hook.sh",
    "$env:APPDATA\.claude\plugins\cache\claude-code-plugins\ralph-wiggum\1.0.0\hooks\stop-hook.sh",
    "$env:LOCALAPPDATA\.claude\plugins\cache\claude-code-plugins\ralph-wiggum\1.0.0\hooks\stop-hook.sh"
)

Write-Host "[*] Procurando hook stop-hook.sh..." -ForegroundColor Yellow

$hookPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $hookPath = $path
        Write-Host "[OK] Hook encontrado: $hookPath" -ForegroundColor Green
        break
    }
}

if (-not $hookPath) {
    Write-Host "[!] Hook nao encontrado nos caminhos padrao." -ForegroundColor Yellow
    Write-Host "    Tentando busca recursiva..." -ForegroundColor Gray
    
    # Busca recursiva
    $searchPaths = @(
        "$env:USERPROFILE\.claude",
        "$env:APPDATA\.claude",
        "$env:LOCALAPPDATA\.claude"
    )
    
    foreach ($basePath in $searchPaths) {
        if (Test-Path $basePath) {
            $found = Get-ChildItem -Path $basePath -Recurse -Filter "stop-hook.sh" -ErrorAction SilentlyContinue
            if ($found) {
                $hookPath = $found[0].FullName
                Write-Host "[OK] Hook encontrado: $hookPath" -ForegroundColor Green
                break
            }
        }
    }
}

if (-not $hookPath) {
    Write-Host "[ERRO] Hook stop-hook.sh nao encontrado." -ForegroundColor Red
    Write-Host "       O erro pode estar vindo de outro lugar." -ForegroundColor Yellow
    Write-Host "       Ou o plugin ralph-wiggum nao esta instalado." -ForegroundColor Yellow
    exit 1
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
    # Renomear arquivo
    Rename-Item -Path $hookPath -NewName "stop-hook.sh.disabled" -Force
    Write-Host "[OK] Hook desabilitado com sucesso!" -ForegroundColor Green
    Write-Host "     Arquivo renomeado para: stop-hook.sh.disabled" -ForegroundColor Gray
} catch {
    Write-Host "[ERRO] Erro ao desabilitar hook: $_" -ForegroundColor Red
    Write-Host "       Tente executar como Administrador ou desabilitar manualmente." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Aplicado com Sucesso!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Feche e reabra o Cursor IDE" -ForegroundColor Gray
Write-Host "  2. O erro 'Hookify import error' nao deve mais aparecer" -ForegroundColor Gray
Write-Host ""
Write-Host "Para reabilitar (se necessario):" -ForegroundColor Yellow
Write-Host "  Renomeie: stop-hook.sh.disabled para stop-hook.sh" -ForegroundColor Gray
Write-Host ""

