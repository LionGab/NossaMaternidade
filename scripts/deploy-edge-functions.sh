#!/bin/bash

# =============================================================================
# Nossa Maternidade - Deploy de Todas as Edge Functions
# =============================================================================
# Faz deploy de todas as Edge Functions do Supabase para produção
# =============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}▶ $1${NC}"
}

# Lista de todas as Edge Functions
FUNCTIONS=(
    "ai"
    "transcribe"
    "notifications"
    "upload-image"
    "delete-account"
    "analytics"
    "moderate-content"
    "export-data"
    "elevenlabs-tts"
    "webhook"
    "community-feed"
    "mundo-nath-feed"
)

print_header "Deploy das Edge Functions - Nossa Maternidade"

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI não encontrado!"
    echo "Instale com: npm install -g supabase"
    exit 1
fi

# Verificar se está autenticado
if ! supabase projects list &> /dev/null 2>&1; then
    print_error "Você precisa fazer login no Supabase!"
    echo "Execute: supabase login"
    exit 1
fi

# Project ref do Nossa Maternidade
PROJECT_REF="lqahkqfpynypbmhtffyi"

# Verificar se o projeto está linkado ou usar project-ref direto
if [ ! -f "supabase/.temp/project-ref" ] && [ -z "$SUPABASE_PROJECT_REF" ]; then
    print_info "Projeto não está linkado localmente, usando --project-ref $PROJECT_REF"
    export SUPABASE_PROJECT_REF="$PROJECT_REF"
fi

print_info "Iniciando deploy de ${#FUNCTIONS[@]} Edge Functions..."
echo ""

# Deploy de cada função
DEPLOYED=0
FAILED=0

for func in "${FUNCTIONS[@]}"; do
    echo -n "Deployando $func... "

    if [ -d "supabase/functions/$func" ]; then
        if supabase functions deploy "$func" --project-ref "$PROJECT_REF" --no-verify-jwt=false 2>/dev/null; then
            print_success "OK"
            ((DEPLOYED++))
        else
            print_error "FALHOU"
            ((FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠️  Não encontrada${NC}"
    fi
done

echo ""
print_header "Resumo do Deploy"

echo -e "Total de funções: ${BOLD}${#FUNCTIONS[@]}${NC}"
echo -e "Deployadas: ${GREEN}$DEPLOYED${NC}"
echo -e "Falharam: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    print_success "Todas as Edge Functions foram deployadas com sucesso!"
    echo ""
    echo "Verifique no dashboard: https://supabase.com/dashboard/project/_/functions"
else
    echo ""
    print_error "Algumas funções falharam. Verifique os logs acima."
    echo ""
    echo "Para deploy individual, use:"
    echo "  supabase functions deploy NOME_DA_FUNCAO"
fi

# Verificar se secrets estão configurados
echo ""
print_info "Verificando secrets configurados..."
SECRETS_OUTPUT=$(supabase secrets list 2>/dev/null || echo "")

if echo "$SECRETS_OUTPUT" | grep -q "GEMINI_API_KEY\|OPENAI_API_KEY\|ANTHROPIC_API_KEY"; then
    print_success "AI API keys configuradas"
else
    echo -e "${YELLOW}⚠️  AI API keys podem não estar configuradas${NC}"
    echo "Configure com: supabase secrets set GEMINI_API_KEY=xxx OPENAI_API_KEY=xxx"
fi

echo ""
echo "Deploy concluído!"
