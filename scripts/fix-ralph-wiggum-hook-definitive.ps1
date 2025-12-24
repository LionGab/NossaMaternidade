# =============================================================================
# Fix Ralph-Wiggum Hook - Solução Definitiva
# =============================================================================
# Remove completamente o hook problemático ou cria um stub vazio
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Ralph-Wiggum Hook - Solução Definitiva" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$hookPath = "C:\Users\User\.claude\plugins\cache\claude-code-plugins\ralph-wiggum\1.0.0\hooks\stop-hook.sh"
$hookDir = Split-Path $hookPath -Parent

Write-Host "[*] Verificando hook stop-hook.sh..." -ForegroundColor Yellow

# Verificar se o diretório existe
if (-not (Test-Path $hookDir)) {
    Write-Host "[INFO] Diretorio do hook nao encontrado" -ForegroundColor Blue
    Write-Host "       Plugin pode nao estar instalado" -ForegroundColor Gray
    exit 0
}

# Verificar se o hook existe
if (Test-Path $hookPath) {
    Write-Host "[!] Hook ainda existe (nao foi desabilitado corretamente)" -ForegroundColor Yellow
    Write-Host "[*] Criando stub vazio no lugar do hook..." -ForegroundColor Yellow
    
    try {
        # Criar um stub vazio que apenas retorna sucesso
        @"
#!/usr/bin/env bash
# Hook desabilitado - retorna sucesso imediatamente
exit 0
"@ | Out-File -FilePath $hookPath -Encoding UTF8 -Force
        
        Write-Host "[OK] Hook substituido por stub vazio" -ForegroundColor Green
    } catch {
        Write-Host "[ERRO] Falha ao criar stub: $_" -ForegroundColor Red
        Write-Host "[*] Tentando renomear novamente..." -ForegroundColor Yellow
        
        try {
            Rename-Item -Path $hookPath -NewName "stop-hook.sh.disabled" -Force
            Write-Host "[OK] Hook renomeado para .disabled" -ForegroundColor Green
        } catch {
            Write-Host "[ERRO] Falha ao renomear: $_" -ForegroundColor Red
        }
    }
} elseif (Test-Path "$hookPath.disabled") {
    Write-Host "[OK] Hook ja esta desabilitado (.disabled)" -ForegroundColor Green
} else {
    Write-Host "[INFO] Hook nao encontrado (pode ja ter sido removido)" -ForegroundColor Blue
}

Write-Host ""

# Verificar se há outros hooks problemáticos
Write-Host "[*] Verificando outros hooks do plugin..." -ForegroundColor Yellow

$allHooks = Get-ChildItem -Path $hookDir -Filter "*.sh" -ErrorAction SilentlyContinue
if ($allHooks) {
    Write-Host "     Hooks encontrados:" -ForegroundColor Gray
    foreach ($hook in $allHooks) {
        $status = if ($hook.Name -like "*.disabled") { "[DESABILITADO]" } else { "[ATIVO]" }
        Write-Host "     - $($hook.Name) $status" -ForegroundColor Gray
    }
} else {
    Write-Host "     Nenhum hook encontrado" -ForegroundColor Gray
}

Write-Host ""

# Opção nuclear: desabilitar plugin completamente
Write-Host "[*] Opcao adicional: Desabilitar plugin completamente..." -ForegroundColor Yellow

$pluginPath = "C:\Users\User\.claude\plugins\cache\claude-code-plugins\ralph-wiggum"
if (Test-Path $pluginPath) {
    $disabledPluginPath = "$pluginPath.disabled"
    
    if (-not (Test-Path $disabledPluginPath)) {
        $choice = Read-Host "     Deseja desabilitar o plugin completamente? (S/N)"
        if ($choice -eq "S" -or $choice -eq "s" -or $choice -eq "Y" -or $choice -eq "y") {
            try {
                Rename-Item -Path $pluginPath -NewName "ralph-wiggum.disabled" -Force
                Write-Host "[OK] Plugin desabilitado completamente" -ForegroundColor Green
                Write-Host "     Reinicie o Cursor para aplicar" -ForegroundColor Gray
            } catch {
                Write-Host "[ERRO] Falha ao desabilitar plugin: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "[INFO] Plugin mantido ativo" -ForegroundColor Blue
        }
    } else {
        Write-Host "[OK] Plugin ja esta desabilitado" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Aplicado!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Feche COMPLETAMENTE o Cursor IDE" -ForegroundColor Yellow
Write-Host "  2. Reabra o Cursor" -ForegroundColor Gray
Write-Host "  3. O erro do hook nao deve mais aparecer" -ForegroundColor Gray
Write-Host ""
Write-Host "Se o problema persistir:" -ForegroundColor Yellow
Write-Host "  Execute este script novamente e escolha desabilitar o plugin" -ForegroundColor Gray
Write-Host ""

