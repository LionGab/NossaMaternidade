@echo off
REM Script para criar arquivo .env no Windows
REM Execute: create-env.bat

echo ============================================
echo Criando arquivo .env...
echo ============================================

(
echo # ============================================
echo # NOSSA MATERNIDADE - MVP 48h
echo # ============================================
echo.
echo # ============================================
echo # SUPABASE (OBRIGATÓRIO)
echo # ============================================
echo.
echo # URLs e keys públicas (podem ser expostas no cliente)
echo EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
echo EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
echo EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1
echo.
echo # Service Role Key (NUNCA expor no cliente - usar apenas Edge Functions/server-side)
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI4Mjc2OCwiZXhwIjoyMDc1ODU4NzY4fQ.K0H61Di0itgPw-CTFVGtWG_XAYwg2mxKS8H_s1WKW-M
echo.
echo # ============================================
echo # APIs DE IA (Edge Functions apenas - NÃO usar EXPO_PUBLIC_*)
echo # ============================================
echo.
echo GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
echo CLAUDE_API_KEY=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
echo OPENAI_API_KEY=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
echo PERPLEXITY_API_KEY=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
echo.
echo # ============================================
echo # FEATURE FLAGS
echo # ============================================
echo USE_MOCKS=false
echo ENABLE_AI=true
echo ENABLE_GAMIFICATION=true
echo ENABLE_ANALYTICS=true
echo.
echo # ============================================
echo # STRIPE (OPCIONAL)
echo # ============================================
echo EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=sb_publishable_Yz0SZUEcUxPVgkQLp-jYpQ_4mWkgsxX
echo.
echo # ============================================
echo # MONITORAMENTO (OPCIONAL)
echo # ============================================
echo EXPO_PUBLIC_SENTRY_DSN=
echo EXPO_PUBLIC_ONESIGNAL_APP_ID=
) > .env

echo.
echo ✅ Arquivo .env criado com sucesso!
echo.
echo ⚠️  IMPORTANTE: Verifique que o arquivo .env está no .gitignore
echo    (já deve estar configurado)
echo.
echo Próximo passo: Execute 'npm start' para reiniciar o servidor
pause

