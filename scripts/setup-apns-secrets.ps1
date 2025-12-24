# =============================================================================
# Nossa Maternidade - Setup APNs Secrets (PowerShell)
# =============================================================================
# Configura os secrets APNs no Supabase Edge Functions para Push Notifications
# Compatível com Windows PowerShell 5.1+ e PowerShell Core 7+
# =============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$P8Path = "",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyId = "RV9893RP92",
    
    [Parameter(Mandatory=$false)]
    [string]$TeamId = "KZPW4S77UH",
    
    [Parameter(Mandatory=$false)]
    [switch]$UseBase64 = $false
)

# Cores
function Write-Header { param([string]$Text) Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan; Write-Host "  $Text" -ForegroundColor Cyan; Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan }
function Write-Step { param([string]$Text) Write-Host "▶ $Text" -ForegroundColor Yellow }
function Write-Success { param([string]$Text) Write-Host "✅ $Text" -ForegroundColor Green }
function Write-Warning { param([string]$Text) Write-Host "⚠️  $Text" -ForegroundColor Yellow }
function Write-Error { param([string]$Text) Write-Host "❌ $Text" -ForegroundColor Red }
function Write-Info { param([string]$Text) Write-Host "ℹ️  $Text" -ForegroundColor Blue }

Write-Header "Nossa Maternidade - Setup APNs Secrets"

# =============================================================================
# PASSO 1: Verificar Dependências
# =============================================================================

Write-Step "Verificando dependências..."

# Verificar Supabase CLI
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Error "Supabase CLI não encontrado!"
    Write-Info "Instale com: npm install -g supabase"
    Write-Info "Ou: npm install -g @supabase/supabase-js"
    exit 1
}

$supabaseVersion = supabase --version 2>&1
Write-Success "Supabase CLI: $supabaseVersion"

# Verificar login
Write-Step "Verificando autenticação no Supabase..."
try {
    supabase projects list 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Autenticado no Supabase"
    } else {
        Write-Warning "Não autenticado. Execute: supabase login"
        Write-Info "Tentando continuar mesmo assim..."
    }
} catch {
    Write-Warning "Não foi possível verificar autenticação. Execute: supabase login"
}

# Verificar projeto linkado
Write-Step "Verificando projeto linkado..."
if (Test-Path "supabase\.temp\project-ref") {
    $projectRef = Get-Content "supabase\.temp\project-ref" -Raw | ForEach-Object { $_.Trim() }
    Write-Success "Projeto linkado: $projectRef"
} else {
    Write-Warning "Projeto não linkado. Execute: supabase link --project-ref SEU_PROJECT_REF"
    Write-Info "Ou execute: .\scripts\configure-supabase.ps1"
}

Write-Host ""

# =============================================================================
# PASSO 2: Localizar arquivo .p8
# =============================================================================

Write-Header "Localizando arquivo .p8"

if ([string]::IsNullOrWhiteSpace($P8Path)) {
    # Tentar localizações comuns
    $commonPaths = @(
        "$env:USERPROFILE\Downloads\AuthKey_$KeyId.p8",
        "$env:USERPROFILE\Downloads\*.p8",
        "$env:USERPROFILE\Desktop\*.p8",
        "$PWD\*.p8"
    )
    
    Write-Info "Procurando arquivo .p8 em locais comuns..."
    
    $found = $false
    foreach ($pattern in $commonPaths) {
        $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
        if ($files) {
            $P8Path = $files[0].FullName
            Write-Success "Arquivo encontrado: $P8Path"
            $found = $true
            break
        }
    }
    
    if (-not $found) {
        Write-Warning "Arquivo .p8 não encontrado automaticamente."
        $P8Path = Read-Host "Digite o caminho completo do arquivo .p8 (ex: C:\Users\User\Downloads\AuthKey_RV9893RP92.p8)"
    }
}

# Validar caminho
if (-not (Test-Path $P8Path)) {
    Write-Error "Arquivo não encontrado: $P8Path"
    Write-Info "Certifique-se de que o arquivo existe e o caminho está correto."
    exit 1
}

Write-Success "Arquivo .p8 validado: $P8Path"

# Verificar extensão
if (-not $P8Path.EndsWith(".p8")) {
    Write-Warning "O arquivo não tem extensão .p8. Continuando mesmo assim..."
}

Write-Host ""

# =============================================================================
# PASSO 3: Carregar conteúdo do .p8
# =============================================================================

Write-Header "Carregando arquivo .p8"

try {
    if ($UseBase64) {
        Write-Step "Usando método Base64 (recomendado para Windows)..."
        $p8Bytes = [System.IO.File]::ReadAllBytes($P8Path)
        $p8Content = [Convert]::ToBase64String($p8Bytes)
        $secretName = "APNS_PRIVATE_KEY_B64"
        Write-Success "Arquivo carregado em Base64 (${p8Content.Length} caracteres)"
        Write-Info "⚠️  IMPORTANTE: Você precisará decodificar APNS_PRIVATE_KEY_B64 no código da Edge Function"
    } else {
        Write-Step "Carregando arquivo como texto (preserva quebras de linha)..."
        $p8Content = Get-Content -Path $P8Path -Raw
        $secretName = "APNS_PRIVATE_KEY"
        Write-Success "Arquivo carregado (${p8Content.Length} caracteres)"
    }
} catch {
    Write-Error "Falha ao carregar arquivo: $_"
    exit 1
}

Write-Host ""

# =============================================================================
# PASSO 4: Configurar Secrets no Supabase
# =============================================================================

Write-Header "Configurando Secrets no Supabase"

# APNS_KEY_ID
Write-Step "Configurando APNS_KEY_ID..."
try {
    supabase secrets set "APNS_KEY_ID=$KeyId" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "APNS_KEY_ID configurado: $KeyId"
    } else {
        Write-Warning "Falha ao configurar APNS_KEY_ID. Verifique se está autenticado."
    }
} catch {
    Write-Warning "Erro ao configurar APNS_KEY_ID: $_"
}

# APNS_TEAM_ID
Write-Step "Configurando APNS_TEAM_ID..."
try {
    supabase secrets set "APNS_TEAM_ID=$TeamId" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "APNS_TEAM_ID configurado: $TeamId"
    } else {
        Write-Warning "Falha ao configurar APNS_TEAM_ID. Verifique se está autenticado."
    }
} catch {
    Write-Warning "Erro ao configurar APNS_TEAM_ID: $_"
}

# APNS_PRIVATE_KEY (ou APNS_PRIVATE_KEY_B64)
Write-Step "Configurando $secretName..."
try {
    # Usar variável de ambiente temporária para evitar problemas de escaping
    $env:TEMP_APNS_KEY = $p8Content
    supabase secrets set "$secretName=$env:TEMP_APNS_KEY" 2>&1 | Out-Null
    Remove-Item Env:\TEMP_APNS_KEY
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$secretName configurado com sucesso"
    } else {
        Write-Warning "Falha ao configurar $secretName. Tentando método alternativo..."
        
        # Método alternativo: salvar em arquivo temporário e usar
        $tempFile = [System.IO.Path]::GetTempFileName()
        Set-Content -Path $tempFile -Value $p8Content -NoNewline
        $tempContent = Get-Content -Path $tempFile -Raw
        
        supabase secrets set "$secretName=$tempContent" 2>&1 | Out-Null
        Remove-Item $tempFile -Force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "$secretName configurado (método alternativo)"
        } else {
            Write-Error "Falha ao configurar $secretName mesmo com método alternativo."
            Write-Info "Configure manualmente no Supabase Dashboard:"
            Write-Info "  Settings → Edge Functions → Secrets → Add new secret"
        }
    }
} catch {
    Write-Error "Erro ao configurar $secretName : $_"
    Write-Info "Configure manualmente no Supabase Dashboard"
}

Write-Host ""

# =============================================================================
# PASSO 5: Verificar Secrets Configurados
# =============================================================================

Write-Header "Verificando Secrets Configurados"

Write-Step "Listando secrets do Supabase..."
try {
    $secrets = supabase secrets list 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host $secrets
        
        # Verificar se os secrets existem (sem mostrar valores)
        $secretsText = $secrets -join "`n"
        
        $hasKeyId = $secretsText -match "APNS_KEY_ID"
        $hasTeamId = $secretsText -match "APNS_TEAM_ID"
        $hasPrivateKey = $secretsText -match "APNS_PRIVATE_KEY"
        
        Write-Host ""
        if ($hasKeyId) { Write-Success "APNS_KEY_ID: ✅ Configurado" } else { Write-Warning "APNS_KEY_ID: ❌ Não encontrado" }
        if ($hasTeamId) { Write-Success "APNS_TEAM_ID: ✅ Configurado" } else { Write-Warning "APNS_TEAM_ID: ❌ Não encontrado" }
        if ($hasPrivateKey) { Write-Success "$secretName : ✅ Configurado" } else { Write-Warning "$secretName : ❌ Não encontrado" }
    } else {
        Write-Warning "Não foi possível listar secrets. Verifique autenticação."
    }
} catch {
    Write-Warning "Erro ao verificar secrets: $_"
}

Write-Host ""

# =============================================================================
# PASSO 6: Segurança (Gitignore)
# =============================================================================

Write-Header "Verificando Segurança"

Write-Step "Verificando .gitignore..."
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    
    $patterns = @("*.p8", "AuthKey_*.p8")
    $allProtected = $true
    
    foreach ($pattern in $patterns) {
        if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
            Write-Warning "Padrão não encontrado no .gitignore: $pattern"
            Add-Content $gitignorePath "`n$pattern"
            Write-Success "Adicionado ao .gitignore: $pattern"
            $allProtected = $false
        }
    }
    
    if ($allProtected) {
        Write-Success "Arquivos .p8 já estão protegidos no .gitignore"
    }
} else {
    Write-Warning ".gitignore não encontrado. Criando..."
    @"
*.p8
AuthKey_*.p8
"@ | Out-File $gitignorePath -Encoding UTF8
    Write-Success ".gitignore criado com proteção para .p8"
}

# Verificar se o arquivo atual está no git
Write-Step "Verificando se arquivo .p8 está sendo rastreado pelo Git..."
try {
    git check-ignore $P8Path 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Arquivo está sendo ignorado pelo Git ✅"
    } else {
        Write-Warning "Arquivo NÃO está sendo ignorado pelo Git!"
        Write-Info "Execute: git rm --cached $P8Path (se já foi commitado)"
    }
} catch {
    Write-Info "Git não disponível ou arquivo não está no repositório"
}

Write-Host ""

# =============================================================================
# RESUMO FINAL
# =============================================================================

Write-Header "Configuração Concluída!"

Write-Host "Secrets configurados:" -ForegroundColor Cyan
Write-Host "  - APNS_KEY_ID: $KeyId" -ForegroundColor Gray
Write-Host "  - APNS_TEAM_ID: $TeamId" -ForegroundColor Gray
Write-Host "  - $secretName : ✅" -ForegroundColor Gray
Write-Host ""

Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Verifique os secrets: supabase secrets list" -ForegroundColor Gray
Write-Host "  2. Se usou Base64, atualize a Edge Function para decodificar APNS_PRIVATE_KEY_B64" -ForegroundColor Gray
Write-Host "  3. Revogue a chave antiga (7NM7SXW7DV) no Apple Developer Portal" -ForegroundColor Yellow
Write-Host "  4. Teste as notificações push em desenvolvimento" -ForegroundColor Gray
Write-Host ""

if ($UseBase64) {
    Write-Warning "⚠️  Você usou Base64. No código da Edge Function, decodifique assim:"
    Write-Host "   const privateKey = atob(Deno.env.get('APNS_PRIVATE_KEY_B64') || '')" -ForegroundColor Gray
    Write-Host ""
}

Write-Success "Setup APNs concluído! 🎉"

