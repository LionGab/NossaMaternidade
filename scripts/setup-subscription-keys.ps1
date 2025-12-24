# =============================================================================
# Nossa Maternidade - Setup Subscription Keys (PowerShell)
# =============================================================================
# Configura chaves de subscription (RevenueCat/App Store Server Notifications)
# Compatível com Windows PowerShell 5.1+ e PowerShell Core 7+
# =============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionKeyPath = "",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyId = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$UseBase64 = $false
)

# Cores
function Write-Header { param([string]$Text) Write-Host "`n================================================================" -ForegroundColor Cyan; Write-Host "  $Text" -ForegroundColor Cyan; Write-Host "================================================================" -ForegroundColor Cyan; Write-Host "" }
function Write-Step { param([string]$Text) Write-Host "[*] $Text" -ForegroundColor Yellow }
function Write-Success { param([string]$Text) Write-Host "[OK] $Text" -ForegroundColor Green }
function Write-Warning { param([string]$Text) Write-Host "[!] $Text" -ForegroundColor Yellow }
function Write-Error { param([string]$Text) Write-Host "[ERRO] $Text" -ForegroundColor Red }
function Write-Info { param([string]$Text) Write-Host "[INFO] $Text" -ForegroundColor Blue }

Write-Header "Nossa Maternidade - Setup Subscription Keys"

# =============================================================================
# PASSO 1: Identificar arquivos .p8 disponíveis
# =============================================================================

Write-Step "Procurando arquivos .p8 de subscription..."

$downloadsPath = "$env:USERPROFILE\Downloads"
$possibleKeys = @(
    @{ Path = "$downloadsPath\SubscriptionKey_G5H2MH64SP.p8"; KeyId = "G5H2MH64SP"; Type = "Subscription" },
    @{ Path = "$downloadsPath\SubscriptionKey_*.p8"; KeyId = ""; Type = "Subscription (Generic)" },
    @{ Path = "$downloadsPath\AuthKey_RV9893RP92.p8"; KeyId = "RV9893RP92"; Type = "APNs (ja configurado)" }
)

$foundKeys = @()
$seenPaths = @{}

foreach ($keyInfo in $possibleKeys) {
    $files = Get-ChildItem -Path $keyInfo.Path -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        # Evitar duplicatas
        if ($seenPaths.ContainsKey($file.FullName)) {
            continue
        }
        $seenPaths[$file.FullName] = $true
        
        $keyIdFromName = ""
        if ($file.Name -match "SubscriptionKey_([A-Z0-9]+)\.p8") {
            $keyIdFromName = $matches[1]
        } elseif ($file.Name -match "AuthKey_([A-Z0-9]+)\.p8") {
            $keyIdFromName = $matches[1]
        }
        
        $foundKeys += @{
            Path = $file.FullName
            KeyId = if ($keyInfo.KeyId) { $keyInfo.KeyId } else { $keyIdFromName }
            Type = $keyInfo.Type
            Name = $file.Name
        }
    }
}

if ($foundKeys.Count -eq 0) {
    Write-Warning "Nenhum arquivo .p8 encontrado em Downloads"
    Write-Info "Procurando em outros locais..."
    
    # Busca mais ampla
    $searchPaths = @(
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\Documents",
        $PWD
    )
    
    foreach ($searchPath in $searchPaths) {
        if (Test-Path $searchPath) {
            $files = Get-ChildItem -Path $searchPath -Filter "*SubscriptionKey*.p8" -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                $keyId = ""
                if ($file.Name -match "SubscriptionKey_([A-Z0-9]+)\.p8") {
                    $keyId = $matches[1]
                }
                
                $foundKeys += @{
                    Path = $file.FullName
                    KeyId = $keyId
                    Type = "Subscription"
                    Name = $file.Name
                }
            }
        }
    }
}

if ($foundKeys.Count -eq 0) {
    Write-Error "Nenhum arquivo de subscription key encontrado"
    Write-Info "Por favor, forneca o caminho do arquivo .p8"
    exit 1
}

Write-Host ""
Write-Host "Arquivos encontrados:" -ForegroundColor Cyan
foreach ($key in $foundKeys) {
    $status = if ($key.Type -like "*ja configurado*") { "[INFO]" } else { "[*]" }
    Write-Host "  $status $($key.Name) - Key ID: $($key.KeyId) ($($key.Type))" -ForegroundColor Gray
}
Write-Host ""

# =============================================================================
# PASSO 2: Selecionar chave de subscription (não APNs)
# =============================================================================

$subscriptionKeys = $foundKeys | Where-Object { $_.Type -eq "Subscription" -or $_.Type -eq "Subscription (Generic)" }

if ($subscriptionKeys.Count -eq 0) {
    Write-Warning "Nenhuma chave de subscription encontrada (apenas APNs)"
    Write-Info "As chaves de subscription sao usadas para:"
    Write-Host "  - RevenueCat Server-Side Receipt Validation" -ForegroundColor Gray
    Write-Host "  - App Store Server Notifications (webhooks)" -ForegroundColor Gray
    Write-Host "  - Verificacao de assinaturas no backend" -ForegroundColor Gray
    Write-Host ""
    Write-Info "Se voce tem uma chave de subscription, forneca o caminho:"
    $SubscriptionKeyPath = Read-Host "Caminho do arquivo .p8"
    
    if (-not (Test-Path $SubscriptionKeyPath)) {
        Write-Error "Arquivo nao encontrado: $SubscriptionKeyPath"
        exit 1
    }
    
    # Extrair Key ID do nome do arquivo
    $fileName = Split-Path $SubscriptionKeyPath -Leaf
    if ($fileName -match "SubscriptionKey_([A-Z0-9]+)\.p8") {
        $KeyId = $matches[1]
    } else {
        $KeyId = Read-Host "Key ID (ex: G5H2MH64SP)"
    }
} elseif ($subscriptionKeys.Count -eq 1) {
    $selectedKey = $subscriptionKeys[0]
    $SubscriptionKeyPath = $selectedKey.Path
    $KeyId = $selectedKey.KeyId
    Write-Success "Chave selecionada automaticamente: $($selectedKey.Name)"
} else {
    Write-Host "Multiplas chaves de subscription encontradas:" -ForegroundColor Yellow
    # Remover duplicatas por caminho
    $uniqueKeys = @()
    $seenPaths = @{}
    foreach ($key in $subscriptionKeys) {
        if (-not $seenPaths.ContainsKey($key.Path)) {
            $seenPaths[$key.Path] = $true
            $uniqueKeys += $key
        }
    }
    
    for ($i = 0; $i -lt $uniqueKeys.Count; $i++) {
        Write-Host "  [$($i+1)] $($uniqueKeys[$i].Name) - Key ID: $($uniqueKeys[$i].KeyId)" -ForegroundColor Gray
    }
    
    if ($uniqueKeys.Count -eq 1) {
        $selectedKey = $uniqueKeys[0]
        $SubscriptionKeyPath = $selectedKey.Path
        $KeyId = $selectedKey.KeyId
        Write-Success "Chave selecionada automaticamente: $($selectedKey.Name)"
    } else {
        $choice = Read-Host "`nSelecione a chave (1-$($uniqueKeys.Count))"
        try {
            $index = [int]$choice - 1
            if ($index -ge 0 -and $index -lt $uniqueKeys.Count) {
                $selectedKey = $uniqueKeys[$index]
                $SubscriptionKeyPath = $selectedKey.Path
                $KeyId = $selectedKey.KeyId
                Write-Success "Chave selecionada: $($selectedKey.Name)"
            } else {
                Write-Error "Selecao invalida. Use um numero entre 1 e $($uniqueKeys.Count)"
                exit 1
            }
        } catch {
            Write-Error "Selecao invalida. Digite um numero."
            exit 1
        }
    }
}

Write-Host ""

# =============================================================================
# PASSO 3: Carregar conteúdo da chave
# =============================================================================

Write-Header "Carregando chave de subscription"

if (-not (Test-Path $SubscriptionKeyPath)) {
    Write-Error "Arquivo nao encontrado: $SubscriptionKeyPath"
    exit 1
}

try {
    if ($UseBase64) {
        Write-Step "Usando metodo Base64 (recomendado para Windows)..."
        $keyBytes = [System.IO.File]::ReadAllBytes($SubscriptionKeyPath)
        $keyContent = [Convert]::ToBase64String($keyBytes)
        $secretName = "APP_STORE_SUBSCRIPTION_KEY_B64"
        Write-Success "Chave carregada em Base64 (${keyContent.Length} caracteres)"
    } else {
        Write-Step "Carregando chave como texto (preserva quebras de linha)..."
        $keyContent = Get-Content -Path $SubscriptionKeyPath -Raw
        $secretName = "APP_STORE_SUBSCRIPTION_KEY"
        Write-Success "Chave carregada (${keyContent.Length} caracteres)"
    }
} catch {
    Write-Error "Falha ao carregar arquivo: $_"
    exit 1
}

Write-Host ""

# =============================================================================
# PASSO 4: Configurar no Supabase (se necessário)
# =============================================================================

Write-Header "Configurando Secrets no Supabase"

# Verificar Supabase CLI
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Warning "Supabase CLI nao encontrado"
    Write-Info "As chaves de subscription podem ser configuradas manualmente:"
    Write-Host "  - RevenueCat Dashboard: Settings > API Keys" -ForegroundColor Gray
    Write-Host "  - App Store Connect: Users and Access > Keys" -ForegroundColor Gray
    Write-Host "  - Supabase Dashboard: Project Settings > Edge Functions > Secrets" -ForegroundColor Gray
    Write-Host ""
    Write-Info "Key ID: $KeyId"
    Write-Info "Arquivo: $SubscriptionKeyPath"
    exit 0
}

# Configurar Key ID
Write-Step "Configurando APP_STORE_SUBSCRIPTION_KEY_ID..."
try {
    supabase secrets set "APP_STORE_SUBSCRIPTION_KEY_ID=$KeyId" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "APP_STORE_SUBSCRIPTION_KEY_ID configurado: $KeyId"
    } else {
        Write-Warning "Falha ao configurar. Verifique se esta autenticado."
    }
} catch {
    Write-Warning "Erro ao configurar APP_STORE_SUBSCRIPTION_KEY_ID: $_"
}

# Configurar Private Key
Write-Step "Configurando $secretName..."
try {
    $env:TEMP_SUBSCRIPTION_KEY = $keyContent
    supabase secrets set "$secretName=$env:TEMP_SUBSCRIPTION_KEY" 2>&1 | Out-Null
    Remove-Item Env:\TEMP_SUBSCRIPTION_KEY
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$secretName configurado com sucesso"
    } else {
        Write-Warning "Falha ao configurar. Configure manualmente no dashboard."
    }
} catch {
    Write-Error "Erro ao configurar $secretName : $_"
}

Write-Host ""

# =============================================================================
# PASSO 5: Informações sobre uso
# =============================================================================

Write-Header "Informacoes sobre Chaves de Subscription"

Write-Host "Onde usar estas chaves:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. RevenueCat Server-Side Receipt Validation:" -ForegroundColor Yellow
Write-Host "   - RevenueCat Dashboard > Settings > API Keys" -ForegroundColor Gray
Write-Host "   - Adicionar App Store Shared Secret (opcional)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. App Store Server Notifications (Webhooks):" -ForegroundColor Yellow
Write-Host "   - App Store Connect > Users and Access > Keys" -ForegroundColor Gray
Write-Host "   - Configurar webhook URL no Supabase Edge Function" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Supabase Edge Functions:" -ForegroundColor Yellow
Write-Host "   - Usar para validar receipts no backend" -ForegroundColor Gray
Write-Host "   - Verificar assinaturas via App Store API" -ForegroundColor Gray
Write-Host ""

Write-Host "Key ID configurado: $KeyId" -ForegroundColor Cyan
Write-Host "Arquivo: $SubscriptionKeyPath" -ForegroundColor Gray
Write-Host ""

# =============================================================================
# RESUMO FINAL
# =============================================================================

Write-Header "Configuracao Concluida!"

Write-Host "Chave de subscription configurada:" -ForegroundColor Cyan
Write-Host "  - Key ID: $KeyId" -ForegroundColor Gray
Write-Host "  - Secret Name: $secretName" -ForegroundColor Gray
Write-Host ""

Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Configurar RevenueCat Dashboard (se necessario)" -ForegroundColor Gray
Write-Host "  2. Configurar App Store Server Notifications (webhooks)" -ForegroundColor Gray
Write-Host "  3. Testar validacao de receipts no backend" -ForegroundColor Gray
Write-Host ""

if ($UseBase64) {
    Write-Warning "Voce usou Base64. No codigo da Edge Function, decodifique assim:"
    Write-Host "   const privateKey = atob(Deno.env.get('APP_STORE_SUBSCRIPTION_KEY_B64') || '')" -ForegroundColor Gray
    Write-Host ""
}

Write-Success "Setup de Subscription Keys concluido! 🎉"

