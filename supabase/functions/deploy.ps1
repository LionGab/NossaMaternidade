# ============================================
# Deploy Supabase Edge Functions (PowerShell)
# ============================================

param(
    [string]$Function = "all",
    [switch]$SetSecrets,
    [switch]$TestAfterDeploy,
    [switch]$Logs
)

Write-Host "🚀 Nossa Maternidade - Supabase Edge Functions Deploy" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Supabase CLI está instalado
Write-Host "🔍 Verificando Supabase CLI..." -ForegroundColor Yellow
$supabaseVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase CLI não instalado!" -ForegroundColor Red
    Write-Host "Instale com: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Supabase CLI: $supabaseVersion" -ForegroundColor Green
Write-Host ""

# Verificar se está linkado ao projeto
Write-Host "🔗 Verificando link ao projeto..." -ForegroundColor Yellow
$linkStatus = supabase status 2>&1
if ($linkStatus -match "not linked") {
    Write-Host "⚠️  Projeto não linkado!" -ForegroundColor Yellow
    Write-Host "Linkando ao projeto bbcwitnbnosyfpfjtzkr..." -ForegroundColor Yellow
    supabase link --project-ref bbcwitnbnosyfpfjtzkr
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha ao linkar projeto!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Projeto linkado" -ForegroundColor Green
Write-Host ""

# Configurar secrets se solicitado
if ($SetSecrets) {
    Write-Host "🔑 Configurando secrets..." -ForegroundColor Yellow

    # Ler do .env
    $envPath = "..\..\. env"
    if (Test-Path $envPath) {
        $geminiKey = (Get-Content $envPath | Select-String "^GEMINI_API_KEY=").Line.Split("=")[1]

        if ($geminiKey) {
            Write-Host "Configurando GEMINI_API_KEY..." -ForegroundColor Yellow
            supabase secrets set GEMINI_API_KEY=$geminiKey
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ GEMINI_API_KEY configurado" -ForegroundColor Green
            } else {
                Write-Host "❌ Falha ao configurar GEMINI_API_KEY" -ForegroundColor Red
            }
        }
    }
    Write-Host ""
}

# Deploy functions
Write-Host "📦 Deploying functions..." -ForegroundColor Yellow
Write-Host ""

if ($Function -eq "all") {
    # Deploy todas as funções
    $functions = @("chat-ai")

    foreach ($fn in $functions) {
        Write-Host "Deploying $fn..." -ForegroundColor Cyan
        supabase functions deploy $fn --no-verify-jwt

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $fn deployed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to deploy $fn" -ForegroundColor Red
            exit 1
        }
        Write-Host ""
    }
} else {
    # Deploy função específica
    Write-Host "Deploying $Function..." -ForegroundColor Cyan
    supabase functions deploy $Function --no-verify-jwt

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Function deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy $Function" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Testar após deploy se solicitado
if ($TestAfterDeploy) {
    Write-Host "🧪 Testando função..." -ForegroundColor Yellow
    $testBody = '{"message":"Olá, teste rápido","history":[]}'

    Write-Host "Enviando mensagem de teste..." -ForegroundColor Cyan
    supabase functions invoke chat-ai --body $testBody --no-verify-jwt

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Teste passou!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Teste falhou, verifique os logs" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Mostrar logs se solicitado
if ($Logs) {
    Write-Host "📜 Mostrando logs..." -ForegroundColor Yellow
    Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Gray
    Write-Host ""
    supabase functions logs chat-ai --follow
}

# Resumo final
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Teste no app: npm run ios ou npm run android" -ForegroundColor White
Write-Host "2. Ver logs: supabase functions logs chat-ai --follow" -ForegroundColor White
Write-Host "3. Testar via curl:" -ForegroundColor White
Write-Host '   curl -X POST https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai \' -ForegroundColor Gray
Write-Host '   -H "Authorization: Bearer YOUR_ANON_KEY" \' -ForegroundColor Gray
Write-Host '   -H "Content-Type: application/json" \' -ForegroundColor Gray
Write-Host '   -d ''{"message":"teste"}''' -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 URL da função:" -ForegroundColor Yellow
Write-Host "https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai" -ForegroundColor Cyan
Write-Host ""

# Exemplos de uso do script
Write-Host "💡 Exemplos de uso:" -ForegroundColor Yellow
Write-Host ".\deploy.ps1                           # Deploy todas as funções" -ForegroundColor White
Write-Host ".\deploy.ps1 -SetSecrets               # Configurar secrets e fazer deploy" -ForegroundColor White
Write-Host ".\deploy.ps1 -TestAfterDeploy          # Deploy e testar" -ForegroundColor White
Write-Host ".\deploy.ps1 -Logs                     # Deploy e mostrar logs" -ForegroundColor White
Write-Host ".\deploy.ps1 -Function chat-ai         # Deploy apenas chat-ai" -ForegroundColor White
Write-Host ".\deploy.ps1 -SetSecrets -TestAfterDeploy -Logs  # Tudo junto" -ForegroundColor White
