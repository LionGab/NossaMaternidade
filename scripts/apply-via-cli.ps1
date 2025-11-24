# ============================================
# NOSSA MATERNIDADE - APLICAR SCHEMA VIA CLI
# ============================================

Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║   NOSSA MATERNIDADE - APLICAR SCHEMA SUPABASE        ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$PROJECT_REF = "mnszbkeuerjcevjvdqme"
$SCHEMA_FILE = "supabase/schema.sql"
$SEED_FILE = "supabase/seed.sql"

# Carregar .env (somente as variáveis essenciais)
Write-Host "🔑 Carregando credenciais..." -ForegroundColor Yellow

# Ler SERVICE_ROLE_KEY do .env
$envContent = Get-Content .env -Raw
$SERVICE_ROLE_KEY = ""

foreach ($line in ($envContent -split "`n")) {
    if ($line -match "^SUPABASE_SERVICE_ROLE_KEY=(.+)$") {
        $SERVICE_ROLE_KEY = $matches[1].Trim()
        break
    }
}

if (-not $SERVICE_ROLE_KEY) {
    Write-Host "❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Credenciais carregadas`n" -ForegroundColor Green

# Verificar se Supabase CLI está instalado
Write-Host "🔍 Verificando Supabase CLI..." -ForegroundColor Yellow

try {
    $version = supabase --version 2>&1
    Write-Host "✅ Supabase CLI: $version`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não está instalado" -ForegroundColor Red
    Write-Host "📦 Instale com: npm install -g supabase`n" -ForegroundColor Yellow
    exit 1
}

# Aplicar schema
Write-Host "⏳ Aplicando schema.sql..." -ForegroundColor Yellow

# Criar um arquivo temporário .env só com as variáveis necessárias
$tempEnv = @"
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
"@

$tempEnv | Out-File -FilePath ".env.temp" -Encoding utf8 -NoNewline

try {
    # Usar o db execute com password via stdin
    $env:SUPABASE_DB_PASSWORD = $SERVICE_ROLE_KEY

    Write-Host "📡 Executando SQL no projeto $PROJECT_REF..." -ForegroundColor Cyan

    # Método alternativo: usar o psql diretamente
    $dbHost = "db.$PROJECT_REF.supabase.co"
    $dbPort = "5432"
    $dbName = "postgres"
    $dbUser = "postgres"

    # Ler o conteúdo do schema
    $schemaContent = Get-Content $SCHEMA_FILE -Raw

    Write-Host "`n⚠️ O Supabase CLI requer autenticação interativa." -ForegroundColor Yellow
    Write-Host "⚠️ A conexão direta PostgreSQL está bloqueada por firewall.`n" -ForegroundColor Yellow

    Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                                                       ║" -ForegroundColor Magenta
    Write-Host "║   📋 INSTRUÇÕES PARA APLICAR O SCHEMA                ║" -ForegroundColor Magenta
    Write-Host "║                                                       ║" -ForegroundColor Magenta
    Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

    Write-Host "🌐 MÉTODO RECOMENDADO: Supabase Dashboard`n" -ForegroundColor Green

    Write-Host "1. Abra: https://supabase.com/dashboard/project/$PROJECT_REF/sql" -ForegroundColor White
    Write-Host "2. Clique em 'New query'" -ForegroundColor White
    Write-Host "3. Cole o conteúdo do arquivo: $SCHEMA_FILE" -ForegroundColor White
    Write-Host "4. Clique em 'Run' (ou Ctrl+Enter)" -ForegroundColor White
    Write-Host "5. Repita com: $SEED_FILE`n" -ForegroundColor White

    # Copiar SQL para clipboard (se disponível)
    if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
        Write-Host "📋 Deseja copiar o SQL do schema para a área de transferência? [S/N]: " -ForegroundColor Yellow -NoNewline
        $response = Read-Host

        if ($response -eq "S" -or $response -eq "s") {
            $schemaContent | Set-Clipboard
            Write-Host "✅ SQL copiado para a área de transferência!`n" -ForegroundColor Green
            Write-Host "👉 Cole no SQL Editor do Supabase Dashboard" -ForegroundColor Cyan
        }
    }

    # Abrir browser automaticamente
    Write-Host "🌐 Deseja abrir o SQL Editor do Supabase no navegador? [S/N]: " -ForegroundColor Yellow -NoNewline
    $openBrowser = Read-Host

    if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
        Start-Process "https://supabase.com/dashboard/project/$PROJECT_REF/sql"
        Write-Host "✅ SQL Editor aberto no navegador!`n" -ForegroundColor Green
    }

} finally {
    # Limpar arquivo temporário
    if (Test-Path ".env.temp") {
        Remove-Item ".env.temp" -Force
    }
}

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║   📝 ARQUIVOS SQL                                     ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Schema: $(Resolve-Path $SCHEMA_FILE)" -ForegroundColor White
Write-Host "Seed:   $(Resolve-Path $SEED_FILE)`n" -ForegroundColor White

Write-Host "💡 TIP: Após aplicar o schema, verifique as tabelas criadas no" -ForegroundColor Yellow
Write-Host "   Table Editor: https://supabase.com/dashboard/project/$PROJECT_REF/editor`n" -ForegroundColor Yellow
