# Script para atualizar .env com as variáveis fornecidas
# Execute: .\update-env.ps1

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
GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
# ⚠️ ATENÇÃO: Gemini key exposta no cliente (apenas para MVP/dev)
# Para produção, migrar para Edge Functions
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
CLAUDE_API_KEY=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
OPENAI_API_KEY=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
PERPLEXITY_API_KEY=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

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

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host "✅ Arquivo .env atualizado com sucesso!" -ForegroundColor Green
Write-Host "🔄 Reinicie o servidor Expo (Ctrl+C e depois npm start)" -ForegroundColor Yellow

