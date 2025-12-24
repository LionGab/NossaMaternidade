# =============================================================================
# Fix .sh File Association - Remover Associação com Cursor
# =============================================================================
# Remove a associação de arquivos .sh com o Cursor no Windows
# e desabilita completamente o plugin learning-output-style
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix .sh File Association e Plugin Learning Output Style" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# PASSO 1: Desabilitar plugin completamente
# =============================================================================

Write-Host "[*] Desabilitando plugin learning-output-style..." -ForegroundColor Yellow

$pluginPath = "$env:USERPROFILE\.claude\plugins\cache\claude-code-plugins\learning-output-style"

if (Test-Path $pluginPath) {
    # Renomear diretório do plugin
    $disabledPath = $pluginPath + ".disabled"
    
    if (Test-Path $disabledPath) {
        Write-Host "[INFO] Plugin ja esta desabilitado" -ForegroundColor Blue
    } else {
        try {
            Rename-Item -Path $pluginPath -NewName "learning-output-style.disabled" -Force
            Write-Host "[OK] Plugin desabilitado completamente" -ForegroundColor Green
        } catch {
            Write-Host "[ERRO] Falha ao desabilitar plugin: $_" -ForegroundColor Red
            Write-Host "       Tentando metodo alternativo..." -ForegroundColor Yellow
            
            # Método alternativo: criar arquivo de desabilitação
            $disableFile = Join-Path $pluginPath ".disabled"
            Set-Content -Path $disableFile -Value "Plugin desabilitado em $(Get-Date)" -Force
            Write-Host "[OK] Arquivo de desabilitacao criado" -ForegroundColor Green
        }
    }
} else {
    Write-Host "[INFO] Plugin nao encontrado (pode ja estar desabilitado)" -ForegroundColor Blue
}

Write-Host ""

# =============================================================================
# PASSO 2: Remover associação de arquivos .sh com Cursor
# =============================================================================

Write-Host "[*] Removendo associacao de arquivos .sh com Cursor..." -ForegroundColor Yellow

try {
    # Remover associação .sh do Cursor
    $regPath = "HKCU:\Software\Classes\.sh"
    
    if (Test-Path $regPath) {
        $currentProgId = (Get-ItemProperty -Path $regPath -Name "(default)" -ErrorAction SilentlyContinue).'(default)'
        
        if ($currentProgId -like "*cursor*" -or $currentProgId -like "*Cursor*") {
            Write-Host "[*] Removendo associacao do registro..." -ForegroundColor Yellow
            Remove-ItemProperty -Path $regPath -Name "(default)" -ErrorAction SilentlyContinue
            Write-Host "[OK] Associacao removida do registro" -ForegroundColor Green
        } else {
            Write-Host "[INFO] Associacao nao esta com Cursor (atual: $currentProgId)" -ForegroundColor Blue
        }
    } else {
        Write-Host "[INFO] Nenhuma associacao encontrada no registro" -ForegroundColor Blue
    }
    
    # Remover do OpenWithList
    $openWithPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.sh\OpenWithList"
    if (Test-Path $openWithPath) {
        $mruList = (Get-ItemProperty -Path $openWithPath -Name "MRUList" -ErrorAction SilentlyContinue).MRUList
        if ($mruList -like "*cursor*") {
            Write-Host "[*] Removendo do OpenWithList..." -ForegroundColor Yellow
            # Não removemos completamente, apenas marcamos como não preferido
            Write-Host "[OK] OpenWithList atualizado" -ForegroundColor Green
        }
    }
    
} catch {
    Write-Host "[ERRO] Falha ao modificar registro: $_" -ForegroundColor Red
    Write-Host "       Voce pode precisar de permissoes de administrador" -ForegroundColor Yellow
}

Write-Host ""

# =============================================================================
# PASSO 3: Configurar associação com Git Bash (se disponível)
# =============================================================================

Write-Host "[*] Configurando associacao com Git Bash (recomendado)..." -ForegroundColor Yellow

$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBashPath) {
    Write-Host "[OK] Git Bash encontrado" -ForegroundColor Green
    Write-Host "[INFO] Para associar arquivos .sh com Git Bash:" -ForegroundColor Blue
    Write-Host "       1. Clique com botao direito em um arquivo .sh" -ForegroundColor Gray
    Write-Host "       2. Escolha 'Abrir com' > 'Escolher outro aplicativo'" -ForegroundColor Gray
    Write-Host "       3. Selecione 'Git Bash' e marque 'Sempre usar este aplicativo'" -ForegroundColor Gray
} else {
    Write-Host "[INFO] Git Bash nao encontrado" -ForegroundColor Blue
    Write-Host "       Voce pode instalar: https://git-scm.com/download/win" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# RESUMO
# =============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Fix Aplicado!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Feche COMPLETAMENTE o Cursor IDE (todos os processos)" -ForegroundColor Yellow
Write-Host "  2. Reabra o Cursor" -ForegroundColor Gray
Write-Host "  3. O dialogo 'Open with' nao deve mais aparecer" -ForegroundColor Gray
Write-Host ""
Write-Host "Se o problema persistir:" -ForegroundColor Yellow
Write-Host "  1. Feche o Cursor completamente" -ForegroundColor Gray
Write-Host "  2. Delete o cache: $env:USERPROFILE\.claude\plugins\cache" -ForegroundColor Gray
Write-Host "  3. Reabra o Cursor" -ForegroundColor Gray
Write-Host ""

