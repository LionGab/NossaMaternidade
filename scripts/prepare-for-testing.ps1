# =============================================================================
# Script de Preparação para Testes - Nossa Maternidade
# =============================================================================
# Este script prepara o aplicativo para testes:
# 1. Instala dependências (se necessário)
# 2. Cria arquivo .env do template (se não existir)
# 3. Valida configurações
# 4. Verifica se está pronto para rodar
# =============================================================================

Write-Host "🚀 Preparando Nossa Maternidade para testes..." -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# =============================================================================
# 1. Verificar e instalar dependências
# =============================================================================
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "  ⚠️  node_modules não encontrado" -ForegroundColor Yellow
    Write-Host "  📥 Instalando dependências (isso pode levar alguns minutos)..." -ForegroundColor Cyan
    
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  ✅ Dependências instaladas com sucesso!" -ForegroundColor Green
}
else {
    Write-Host "  ✅ node_modules encontrado" -ForegroundColor Green
}

Write-Host ""

# =============================================================================
# 2. Criar arquivo .env do template (se não existir)
# =============================================================================
Write-Host "🔐 Verificando arquivo .env..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "  ⚠️  Arquivo .env não encontrado" -ForegroundColor Yellow
    
    if (Test-Path "env.template") {
        Write-Host "  📝 Criando .env a partir do template..." -ForegroundColor Cyan
        Copy-Item "env.template" ".env"
        Write-Host "  ✅ Arquivo .env criado!" -ForegroundColor Green
        Write-Host "  ⚠️  IMPORTANTE: Configure as variáveis de ambiente no arquivo .env" -ForegroundColor Yellow
        Write-Host "     Variáveis obrigatórias:" -ForegroundColor Yellow
        Write-Host "     - EXPO_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
        Write-Host "     - EXPO_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Yellow
        Write-Host "     - EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ❌ env.template não encontrado!" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "  ✅ Arquivo .env encontrado" -ForegroundColor Green
}

Write-Host ""

# =============================================================================
# 3. Validar variáveis de ambiente
# =============================================================================
Write-Host "🔍 Validando variáveis de ambiente..." -ForegroundColor Yellow

if (Test-Path "scripts/validate-env.js") {
    node scripts/validate-env.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "  ⚠️  Algumas variáveis de ambiente não estão configuradas" -ForegroundColor Yellow
        Write-Host "  💡 Configure as variáveis no arquivo .env antes de testar" -ForegroundColor Cyan
    }
}
else {
    Write-Host "  ⚠️  Script de validação não encontrado" -ForegroundColor Yellow
}

Write-Host ""

# =============================================================================
# 4. Verificar TypeScript (se disponível)
# =============================================================================
Write-Host "📝 Verificando TypeScript..." -ForegroundColor Yellow

if (Test-Path "node_modules/.bin/tsc") {
    Write-Host "  🔍 Executando type-check..." -ForegroundColor Cyan
    & node_modules/.bin/tsc --noEmit 2>&1 | Select-Object -First 20
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ TypeScript: Sem erros críticos" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  TypeScript: Alguns erros encontrados (pode não impedir testes)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ⚠️  TypeScript não encontrado (será instalado com dependências)" -ForegroundColor Yellow
}

Write-Host ""

# =============================================================================
# 5. Resumo e próximos passos
# =============================================================================
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ PREPARAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure as variáveis de ambiente no arquivo .env:" -ForegroundColor White
Write-Host "   - EXPO_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - EXPO_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "   - EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Para iniciar o app em modo desenvolvimento:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host "   ou" -ForegroundColor Gray
Write-Host "   npx expo start" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. Para testar em dispositivo físico:" -ForegroundColor White
Write-Host "   - Instale o Expo Go no seu celular" -ForegroundColor Gray
Write-Host "   - Escaneie o QR code que aparecerá no terminal" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Para testar em emulador/simulador:" -ForegroundColor White
Write-Host "   - Android: npm run android" -ForegroundColor Yellow
Write-Host "   - iOS: npm run ios" -ForegroundColor Yellow
Write-Host ""

Write-Host "5. Para testar no navegador (web):" -ForegroundColor White
Write-Host "   npm run web" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   - README.md - Visão geral do projeto" -ForegroundColor Gray
Write-Host "   - docs/EXPO_GO_COMPATIBILITY.md - Compatibilidade com Expo Go" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Tudo pronto para testar!" -ForegroundColor Green
Write-Host ""

