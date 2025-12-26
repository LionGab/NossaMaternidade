#!/bin/bash

# =============================================================================
# Nossa Maternidade - Gerar Comandos EAS Secrets
# =============================================================================
# Gera os comandos exatos para configurar secrets no EAS
# =============================================================================

set -e

PROJECT_REF="lqahkqfpynypbmhtffyi"

# Obter anon key do Supabase
echo "Obtendo anon key do Supabase..."
API_KEYS_OUTPUT=$(supabase projects api-keys --project-ref "$PROJECT_REF" 2>/dev/null)
ANON_KEY=$(echo "$API_KEYS_OUTPUT" | grep "anon" | awk -F'|' '{print $2}' | xargs)

if [ -z "$ANON_KEY" ]; then
    echo "❌ Não foi possível obter a anon key"
    exit 1
fi

# Configurações
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_FUNCTIONS_URL="${SUPABASE_URL}/functions/v1"
REVENUECAT_IOS_KEY="appl_qYAhdJlewUtgaKBDWEAmZsCRIqK"
REVENUECAT_ANDROID_KEY="goog_YSHALitkRyhugtDvYVVQVmqrqDu"

# Gerar arquivo de comandos
cat > COMANDOS_EAS_SECRETS.txt << COMMANDS
# ===================================================================
# COMANDOS EAS SECRETS - Nossa Maternidade
# ===================================================================
# Execute estes comandos no terminal, um por vez
# ===================================================================

# 1. SUPABASE URL
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL" --scope project

# 2. SUPABASE ANON KEY
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$ANON_KEY" --scope project

# 3. SUPABASE FUNCTIONS URL
eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "$SUPABASE_FUNCTIONS_URL" --scope project

# 4. REVENUECAT iOS KEY
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "$REVENUECAT_IOS_KEY" --scope project

# 5. REVENUECAT ANDROID KEY
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "$REVENUECAT_ANDROID_KEY" --scope project

# ===================================================================
# VERIFICAR DEPOIS
# ===================================================================
# eas env:list
# ===================================================================
COMMANDS

echo "✅ Comandos gerados em: COMANDOS_EAS_SECRETS.txt"
echo ""
echo "Para executar todos de uma vez:"
echo "  bash scripts/setup-eas-secrets.sh"
echo ""
echo "Ou copie e cole cada comando de: COMANDOS_EAS_SECRETS.txt"
