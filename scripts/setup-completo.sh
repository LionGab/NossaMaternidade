#!/bin/bash

# =============================================================================
# Nossa Maternidade - Setup Completo
# =============================================================================
# Script para configurar tudo que for possível automaticamente
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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

PROJECT_REF="lqahkqfpynypbmhtffyi"
PROJECT_DIR="/Users/lion/Documents/Lion/NossaMaternidade"

cd "$PROJECT_DIR"

print_header "Setup Completo - Nossa Maternidade"

# =============================================================================
# 1. Verificar ferramentas instaladas
# =============================================================================

print_header "1. Verificando Ferramentas"

check_tool() {
    if command -v "$1" &> /dev/null; then
        print_success "$1 está instalado"
        return 0
    else
        print_error "$1 não encontrado"
        return 1
    fi
}

MISSING_TOOLS=0

check_tool "supabase" || MISSING_TOOLS=1
check_tool "eas" || MISSING_TOOLS=1
check_tool "node" || MISSING_TOOLS=1

if [ $MISSING_TOOLS -eq 1 ]; then
    print_error "Algumas ferramentas estão faltando. Instale-as primeiro."
    exit 1
fi

# =============================================================================
# 2. Verificar autenticação Supabase
# =============================================================================

print_header "2. Verificando Autenticação Supabase"

if supabase projects list &> /dev/null 2>&1; then
    print_success "Supabase CLI autenticado"
else
    print_warning "Supabase CLI não está autenticado"
    echo "Execute: supabase login"
    echo "Ou pressione Enter para pular..."
    read -r
fi

# =============================================================================
# 3. Verificar autenticação EAS
# =============================================================================

print_header "3. Verificando Autenticação EAS"

if eas whoami &> /dev/null 2>&1; then
    print_success "EAS CLI autenticado"
    eas whoami
else
    print_warning "EAS CLI não está autenticado"
    echo "Execute: eas login"
    echo "Ou pressione Enter para pular..."
    read -r
fi

# =============================================================================
# 4. Listar Edge Functions disponíveis
# =============================================================================

print_header "4. Edge Functions Disponíveis"

FUNCTIONS_DIR="$PROJECT_DIR/supabase/functions"
FUNCTIONS_COUNT=0

if [ -d "$FUNCTIONS_DIR" ]; then
    for func_dir in "$FUNCTIONS_DIR"/*; do
        if [ -d "$func_dir" ] && [ -f "$func_dir/index.ts" ]; then
            func_name=$(basename "$func_dir")
            if [ "$func_name" != "_shared" ]; then
                print_info "  - $func_name"
                ((FUNCTIONS_COUNT++))
            fi
        fi
    done
    print_success "Total: $FUNCTIONS_COUNT Edge Functions encontradas"
else
    print_error "Diretório de funções não encontrado: $FUNCTIONS_DIR"
fi

# =============================================================================
# 5. Verificar secrets do Supabase
# =============================================================================

print_header "5. Verificando Secrets do Supabase"

if supabase projects list &> /dev/null 2>&1; then
    print_info "Listando secrets configurados..."
    SECRETS_OUTPUT=$(supabase secrets list --project-ref "$PROJECT_REF" 2>/dev/null || echo "")
    
    if [ -z "$SECRETS_OUTPUT" ]; then
        print_warning "Não foi possível listar secrets. Verifique se está autenticado."
    else
        echo "$SECRETS_OUTPUT"
        
        REQUIRED_SECRETS=("GEMINI_API_KEY" "REVENUECAT_WEBHOOK_SECRET")
        for secret in "${REQUIRED_SECRETS[@]}"; do
            if echo "$SECRETS_OUTPUT" | grep -q "$secret"; then
                print_success "Secret $secret configurado"
            else
                print_warning "Secret $secret não encontrado"
            fi
        done
    fi
else
    print_warning "Não autenticado no Supabase, pulando verificação de secrets"
fi

# =============================================================================
# 6. Verificar secrets do EAS
# =============================================================================

print_header "6. Verificando Secrets do EAS"

if eas whoami &> /dev/null 2>&1; then
    print_info "Listando secrets configurados no EAS..."
    EAS_SECRETS=$(eas env:list 2>/dev/null || echo "")
    
    if [ -z "$EAS_SECRETS" ]; then
        print_warning "Não foi possível listar secrets do EAS"
    else
        echo "$EAS_SECRETS"
        
        REQUIRED_EAS_SECRETS=("EXPO_PUBLIC_SUPABASE_URL" "EXPO_PUBLIC_SUPABASE_ANON_KEY" "EXPO_PUBLIC_REVENUECAT_IOS_KEY")
        for secret in "${REQUIRED_EAS_SECRETS[@]}"; do
            if echo "$EAS_SECRETS" | grep -q "$secret"; then
                print_success "Secret EAS $secret configurado"
            else
                print_warning "Secret EAS $secret não encontrado"
            fi
        done
    fi
else
    print_warning "Não autenticado no EAS, pulando verificação de secrets"
fi

# =============================================================================
# 7. Resumo e Próximos Passos
# =============================================================================

print_header "Resumo e Próximos Passos"

echo "📋 O que foi verificado:"
echo "  ✅ Ferramentas instaladas"
echo "  ⚠️  Autenticação (verifique acima)"
echo "  ✅ Edge Functions disponíveis: $FUNCTIONS_COUNT"
echo "  ⚠️  Secrets (verifique acima)"

echo ""
echo "📝 Próximos passos manuais:"
echo ""
echo "1. SUPABASE EDGE FUNCTIONS:"
echo "   - Obter Access Token: https://supabase.com/dashboard/account/tokens"
echo "   - Executar: bash scripts/deploy-edge-functions.sh"
echo ""
echo "2. EAS SECRETS:"
echo "   - Configurar secrets obrigatórios"
echo "   - Ver documentação: docs/CONFIGURACAO_FINAL_COMPLETA.md"
echo ""
echo "3. REVENUECAT:"
echo "   - Configurar webhook no Dashboard"
echo "   - Criar entitlement 'premium'"
echo "   - Criar products e offerings"
echo ""
echo "4. APP STORE / GOOGLE PLAY:"
echo "   - Criar produtos de assinatura"
echo "   - Configurar server notifications"
echo ""
echo "📚 Documentação completa:"
echo "   docs/CONFIGURACAO_FINAL_COMPLETA.md"
echo ""

print_success "Setup check completo!"

