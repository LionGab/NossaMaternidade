# Script PowerShell para atualizar .env com valores reais
# Execute: .\update-env-values.ps1
# Uso: pwsh -ExecutionPolicy Bypass -File update-env-values.ps1
#
# ⚠️  ATENÇÃO: Este script contém valores REAIS de API keys
# NUNCA commite o arquivo .env após executar este script

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Atualizando arquivo .env com valores reais..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Este script contém valores REAIS de API keys" -ForegroundColor Red
Write-Host "   Certifique-se de que o .env está no .gitignore" -ForegroundColor Yellow
Write-Host ""

$envContent = @"
# Configuração de Variáveis de Ambiente - Nossa Maternidade

# INSTRUÇÕES:
# 1. Este arquivo contém valores REAIS - NUNCA commite (já está no .gitignore)
# 2. Para referência, veja env.template (com placeholders)

# ============================================
# VARIÁVEIS PÚBLICAS (EXPO_PUBLIC_*)
# ============================================
# Estas variáveis são seguras para serem incluídas no bundle do app
# Elas são acessadas via process.env.EXPO_PUBLIC_* no código

# MCP Brave Search
BRAVE_API_KEY=BSA_HzGhPTbT2loxQCr5jw95NGgMAqk

# Supabase - URL do projeto
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co

# Supabase - Chave anônima (pública, segura para o app)
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo

# Supabase - URL das Edge Functions
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1

# Google Gemini - API Key para IA
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg

# Google Gemini - Modelo padrão (usado pelas Edge Functions Supabase)
# Valores possíveis: gemini-2.5-flash (default), gemini-2.0-flash-exp, gemini-2.5-pro
# NOTA: Variável OPCIONAL - fallback para gemini-2.5-flash se não configurada
# Esta variável é APENAS para Edge Functions (Supabase), não para o app mobile
# GEMINI_MODEL=gemini-2.5-flash

# Anthropic Claude - API Key
EXPO_PUBLIC_CLAUDE_API_KEY=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

# OpenAI - API Key (recomendado para crise emocional)
EXPO_PUBLIC_OPENAI_API_KEY=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

# Perplexity - API Key (opcional)
EXPO_PUBLIC_PERPLEXITY_API_KEY=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

# Sentry - Error tracking (opcional, mas recomendado para produção)
# Crie uma conta em https://sentry.io e obtenha o DSN
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Feature Flags (opcional)
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# ============================================
# VARIÁVEIS PRIVADAS (NÃO USAR NO APP)
# ============================================
# Estas variáveis são apenas para referência
# NÃO devem ser usadas no código do app mobile
# Use apenas em backend/server-side (Edge Functions Supabase)

# Supabase Service Role Key (NUNCA expor no cliente)
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxNjc4MSwiZXhwIjoyMDc3NDkyNzgxfQ.zOb5c5HhJhOF3-tWAkfo9HxKoUpA2JbsKFS939IPnd4

# Google Gemini API Key (para Edge Functions apenas)
# GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg

# PostgreSQL Connection String (apenas para migrações/admin)
POSTGRES_CONNECTION_STRING=postgresql://postgres:9E2XLJVsYzGGhuKP@db.mnszbkeuerjcevjvdqme.supabase.co:5432/postgres

# ============================================
# NOTAS
# ============================================
# - Todas as variáveis EXPO_PUBLIC_* são incluídas no bundle
# - Variáveis sem EXPO_PUBLIC_* não são acessíveis no app
# - Para mais detalhes, veja: docs/setup-env.md
# - NUNCA commite este arquivo (apenas env.template)
"@

if (Test-Path .env) {
    $response = Read-Host "Arquivo .env já existe. Deseja sobrescrever? (s/N)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit
    }
}

try {
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    
    Write-Host ""
    Write-Host "✅ Arquivo .env atualizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "   - O arquivo .env está no .gitignore (não será commitado)" -ForegroundColor Yellow
    Write-Host "   - NUNCA commite este arquivo com valores reais" -ForegroundColor Red
    Write-Host ""
    Write-Host "Próximo passo: Execute 'npm start -- --clear' para reiniciar o servidor Expo" -ForegroundColor Cyan
    exit 0
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao atualizar .env: $_" -ForegroundColor Red
    exit 1
}

