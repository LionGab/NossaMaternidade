#!/bin/bash
# Script para criar arquivo .env no Linux/macOS
# Execute: bash create-env.sh ou chmod +x create-env.sh && ./create-env.sh

echo "============================================"
echo "Criando arquivo .env..."
echo "============================================"

cat > .env << 'EOF'
# ============================================
# NOSSA MATERNIDADE - MVP 48h
# ============================================

# ============================================
# SUPABASE (OBRIGATÓRIO)
# ============================================

# URLs e keys públicas (podem ser expostas no cliente)
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1

# Service Role Key (NUNCA expor no cliente - usar apenas Edge Functions/server-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI4Mjc2OCwiZXhwIjoyMDc1ODU4NzY4fQ.K0H61Di0itgPw-CTFVGtWG_XAYwg2mxKS8H_s1WKW-M

# ============================================
# APIs DE IA (Edge Functions apenas - NÃO usar EXPO_PUBLIC_*)
# ============================================

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
CLAUDE_API_KEY=YOUR_CLAUDE_API_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
PERPLEXITY_API_KEY=YOUR_PERPLEXITY_API_KEY_HERE

# ============================================
# FEATURE FLAGS
# ============================================
USE_MOCKS=false
ENABLE_AI=true
ENABLE_GAMIFICATION=true
ENABLE_ANALYTICS=true

# ============================================
# STRIPE (OPCIONAL)
# ============================================
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=sb_publishable_Yz0SZUEcUxPVgkQLp-jYpQ_4mWkgsxX

# ============================================
# MONITORAMENTO (OPCIONAL)
# ============================================
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
EOF

echo ""
echo "✅ Arquivo .env criado com sucesso!"
echo ""
echo "⚠️  IMPORTANTE: Verifique que o arquivo .env está no .gitignore"
echo "   (já deve estar configurado)"
echo ""
echo "Próximo passo: Execute 'npm start' para reiniciar o servidor"

