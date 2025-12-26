#!/bin/bash

# =============================================================================
# Nossa Maternidade - Configurar Secrets do EAS
# =============================================================================
# Script para configurar todos os secrets obrigatórios no EAS
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

print_header "Configurar Secrets do EAS - Nossa Maternidade"

# Verificar se EAS está instalado e autenticado
if ! command -v eas &> /dev/null; then
    print_error "EAS CLI não encontrado!"
    echo "Instale com: npm install -g eas-cli"
    exit 1
fi

if ! eas whoami &> /dev/null 2>&1; then
    print_error "EAS CLI não está autenticado!"
    echo "Execute: eas login"
    exit 1
fi

print_success "EAS CLI autenticado"
eas whoami

# Obter anon key do Supabase
print_info "Obtendo anon key do Supabase..."
API_KEYS_OUTPUT=$(supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null)
# Extrai a linha com 'anon' e pega o segundo campo (KEY VALUE)
ANON_KEY=$(echo "$API_KEYS_OUTPUT" | grep "anon" | awk -F'|' '{print $2}' | xargs)

if [ -z "$ANON_KEY" ]; then
    print_error "Não foi possível obter a anon key do Supabase"
    print_warning "Execute os comandos em COMANDOS_EAS_SECRETS.txt manualmente"
    exit 1
fi

print_success "Anon key obtida: ${ANON_KEY:0:20}..."

# Configurações
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_FUNCTIONS_URL="${SUPABASE_URL}/functions/v1"
REVENUECAT_IOS_KEY="appl_qYAhdJlewUtgaKBDWEAmZsCRIqK"
REVENUECAT_ANDROID_KEY="goog_YSHALitkRyhugtDvYVVQVmqrqDu"

print_header "Configurando Secrets"

# Função para configurar secret
setup_secret() {
    local name=$1
    local value=$2
    local description=$3
    
    print_info "Configurando $name..."
    
    if eas env:create --name "$name" --value "$value" --scope project --environment production --non-interactive 2>&1 | grep -q "already exists\|Created"; then
        print_success "$name configurado"
    else
        # Tentar atualizar se já existe
        if eas env:update --name "$name" --value "$value" --scope project --environment production --non-interactive 2>&1 | grep -q "Updated\|already exists"; then
            print_success "$name atualizado"
        else
            print_warning "$name - verifique manualmente"
        fi
    fi
}

# Secrets obrigatórios
setup_secret "EXPO_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" "URL do projeto Supabase"
setup_secret "EXPO_PUBLIC_SUPABASE_ANON_KEY" "$ANON_KEY" "Chave anônima do Supabase"
setup_secret "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" "$SUPABASE_FUNCTIONS_URL" "URL das Edge Functions"
setup_secret "EXPO_PUBLIC_REVENUECAT_IOS_KEY" "$REVENUECAT_IOS_KEY" "Chave pública do RevenueCat para iOS"
setup_secret "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY" "$REVENUECAT_ANDROID_KEY" "Chave pública do RevenueCat para Android"

print_header "Resumo"

print_info "Secrets configurados:"
echo "  - EXPO_PUBLIC_SUPABASE_URL"
echo "  - EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "  - EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
echo "  - EXPO_PUBLIC_REVENUECAT_IOS_KEY"
echo "  - EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"

print_info "Para verificar, execute:"
echo "  eas env:list"

print_success "Configuração de secrets concluída!"

