#!/bin/bash

# Script para configurar todos os secrets no EAS Build
# Execute após fazer login: eas login

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Configuração de Secrets no EAS${NC}"
echo ""

# Verificar se está logado
if ! eas whoami &> /dev/null; then
    echo -e "${RED}❌ Você precisa estar logado no EAS primeiro!${NC}"
    echo "Execute: eas login"
    exit 1
fi

echo -e "${GREEN}✅ Logado no EAS${NC}"
echo ""

echo -e "${YELLOW}📋 Secrets que você precisa configurar:${NC}"
echo ""
echo "1. EXPO_PUBLIC_SUPABASE_URL"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value \"https://seu-projeto.supabase.co\""
echo ""
echo "2. EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value \"sua-chave-anon-aqui\""
echo ""
echo "3. EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value \"https://seu-projeto.supabase.co/functions/v1\""
echo ""
echo "4. EXPO_PUBLIC_OPENAI_API_KEY"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value \"sk-sua-chave-aqui\""
echo ""
echo "5. EXPO_PUBLIC_GROK_API_KEY (opcional)"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value \"xai-sua-chave-aqui\""
echo ""
echo "6. EXPO_PUBLIC_IMGUR_CLIENT_ID (opcional)"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_IMGUR_CLIENT_ID --value \"seu-client-id\""
echo ""
echo "7. EXPO_PUBLIC_ELEVENLABS_API_KEY (opcional - para voz)"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_API_KEY --value \"sua-chave-aqui\""
echo ""
echo "8. EXPO_PUBLIC_REVENUECAT_API_KEY_IOS (opcional - para premium)"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_API_KEY_IOS --value \"sua-chave-aqui\""
echo ""
echo "9. EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID (opcional - para premium)"
echo "   Comando: eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID --value \"sua-chave-aqui\""
echo ""
echo "10. EXPO_PUBLIC_ENABLE_AI_FEATURES (opcional)"
echo "    Comando: eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value \"true\""
echo ""

echo "Para verificar todos os secrets configurados:"
echo "  eas secret:list"
echo ""
