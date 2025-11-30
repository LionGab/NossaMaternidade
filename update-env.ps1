# Script para atualizar .env com as variáveis fornecidas
# Execute: .\update-env.ps1
# Uso: pwsh -ExecutionPolicy Bypass -File update-env.ps1
#
# ⚠️  ATENÇÃO: Este script sobrescreve o .env com valores de exemplo
# Use apenas para desenvolvimento/teste

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Atualizando arquivo .env..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Este script usa valores de EXEMPLO" -ForegroundColor Yellow
Write-Host "   Para valores reais, use update-env-values.ps1 ou edite manualmente" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Deseja continuar? (s/N)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

$envContent = @"
# ============================================
# NOSSA MATERNIDADE - MVP 48h
# ============================================

# SUPABASE (OBRIGATÓRIO)
SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI4Mjc2OCwiZXhwIjoyMDc1ODU4NzY4fQ.K0H61Di0itgPw-CTFVGtWG_XAYwg2mxKS8H_s1WKW-M

# EXPO PUBLIC (cliente pode ver - APENAS keys públicas seguras)
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1

# APIs DE IA (Edge Functions apenas - NÃO usar EXPO_PUBLIC_*)
# Configuradas como secrets no Supabase
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
# ⚠️ ATENÇÃO: Gemini key exposta no cliente (apenas para MVP/dev)
# Para produção, migrar para Edge Functions
EXPO_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
CLAUDE_API_KEY=YOUR_CLAUDE_API_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
PERPLEXITY_API_KEY=YOUR_PERPLEXITY_API_KEY_HERE

# Features
USE_MOCKS=false
ENABLE_AI=true
ENABLE_GAMIFICATION=true
ENABLE_ANALYTICS=true

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=sb_publishable_Yz0SZUEcUxPVgkQLp-jYpQ_4mWkgsxX

# Sentry (opcional)
EXPO_PUBLIC_SENTRY_DSN=

# OneSignal (opcional)
EXPO_PUBLIC_ONESIGNAL_APP_ID=
"@

try {
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    Write-Host "✅ Arquivo .env atualizado com sucesso!" -ForegroundColor Green
    Write-Host "🔄 Reinicie o servidor Expo (Ctrl+C e depois npm start)" -ForegroundColor Yellow
    exit 0
} catch {
    Write-Host "❌ Erro ao atualizar .env: $_" -ForegroundColor Red
    exit 1
}

