#!/bin/bash

# Script de verificação de configuração para produção
# Nossa Maternidade - 2025

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

echo ""
echo "🔍 Verificando configuração para produção..."
echo "=========================================="
echo ""

# =========================================
# 1. eas.json - Apple IDs
# =========================================
echo -e "${CYAN}📱 1. eas.json - Apple IDs${NC}"
echo "----------------------------------------"

if grep -q "YOUR_APP_STORE_CONNECT_APP_ID" eas.json 2>/dev/null; then
  echo -e "  ${RED}❌ App Store Connect ID não configurado${NC}"
  echo -e "    ${YELLOW}💡 Substitua YOUR_APP_STORE_CONNECT_APP_ID em eas.json:100${NC}"
  ((FAILED++))
else
  echo -e "  ${GREEN}✅ App Store Connect ID configurado${NC}"
  ((PASSED++))
fi

if grep -q "YOUR_APPLE_TEAM_ID" eas.json 2>/dev/null; then
  echo -e "  ${RED}❌ Apple Team ID não configurado${NC}"
  echo -e "    ${YELLOW}💡 Substitua YOUR_APPLE_TEAM_ID em eas.json:101${NC}"
  ((FAILED++))
else
  echo -e "  ${GREEN}✅ Apple Team ID configurado${NC}"
  ((PASSED++))
fi

echo ""

# =========================================
# 2. Google Play Service Account (Android - Opcional)
# =========================================
echo -e "${CYAN}🤖 2. Google Play Service Account (Android - Opcional)${NC}"
echo "----------------------------------------"

if [ -f "google-play-service-account.json" ]; then
  echo -e "  ${GREEN}✅ Arquivo encontrado${NC}"
  ((PASSED++))
  
  # Verificar estrutura JSON
  if command -v jq &> /dev/null; then
    if jq empty google-play-service-account.json 2>/dev/null; then
      echo -e "  ${GREEN}✅ JSON válido${NC}"
      ((PASSED++))
    else
      echo -e "  ${RED}❌ JSON inválido${NC}"
      ((FAILED++))
    fi
  else
    echo -e "  ${YELLOW}⚠️  jq não instalado - não foi possível validar JSON${NC}"
    ((WARNINGS++))
  fi
  
  # Verificar se está no .gitignore
  if git check-ignore google-play-service-account.json &> /dev/null; then
    echo -e "  ${GREEN}✅ Arquivo está no .gitignore${NC}"
    ((PASSED++))
  else
    echo -e "  ${RED}❌ Arquivo NÃO está no .gitignore${NC}"
    echo -e "    ${YELLOW}💡 Adicione: google-play-service-account.json${NC}"
    ((FAILED++))
  fi
else
  echo -e "  ${YELLOW}⚠️  Arquivo não encontrado (opcional se não for publicar no Android)${NC}"
  echo -e "    ${CYAN}💡 Se precisar: docs/GOOGLE_PLAY_SERVICE_ACCOUNT.md${NC}"
  ((WARNINGS++))
fi

echo ""

# =========================================
# 3. EAS Secrets
# =========================================
echo -e "${CYAN}🔐 3. EAS Secrets${NC}"
echo "----------------------------------------"

if command -v eas &> /dev/null; then
  if eas secret:list 2>/dev/null | grep -q "EXPO_PUBLIC_SUPABASE_URL"; then
    echo -e "  ${GREEN}✅ Supabase URL configurado${NC}"
    ((PASSED++))
  else
    echo -e "  ${YELLOW}⚠️  Supabase URL não configurado${NC}"
    echo -e "    ${CYAN}💡 Execute: eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value '...'${NC}"
    ((WARNINGS++))
  fi
  
  if eas secret:list 2>/dev/null | grep -q "EXPO_PUBLIC_REVENUECAT_IOS_KEY"; then
    echo -e "  ${GREEN}✅ RevenueCat iOS Key configurado${NC}"
    ((PASSED++))
  else
    echo -e "  ${YELLOW}⚠️  RevenueCat iOS Key não configurado${NC}"
    ((WARNINGS++))
  fi
  
  if eas secret:list 2>/dev/null | grep -q "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY"; then
    echo -e "  ${GREEN}✅ RevenueCat Android Key configurado${NC}"
    ((PASSED++))
  else
    echo -e "  ${YELLOW}⚠️  RevenueCat Android Key não configurado (opcional se não for publicar no Android)${NC}"
    ((WARNINGS++))
  fi
else
  echo -e "  ${YELLOW}⚠️  EAS CLI não instalado${NC}"
  echo -e "    ${CYAN}💡 Instale: npm install -g eas-cli${NC}"
  ((WARNINGS++))
fi

echo ""

# =========================================
# 4. Supabase Secrets (Edge Functions)
# =========================================
echo -e "${CYAN}🗄️  4. Supabase Secrets (Edge Functions)${NC}"
echo "----------------------------------------"

if command -v supabase &> /dev/null; then
  if supabase secrets list 2>/dev/null | grep -q "GEMINI_API_KEY"; then
    echo -e "  ${GREEN}✅ Gemini API Key configurado${NC}"
    ((PASSED++))
  else
    echo -e "  ${YELLOW}⚠️  Gemini API Key não configurado${NC}"
    echo -e "    ${CYAN}💡 Execute: supabase secrets set GEMINI_API_KEY='...'${NC}"
    ((WARNINGS++))
  fi
  
  if supabase secrets list 2>/dev/null | grep -q "OPENAI_API_KEY"; then
    echo -e "  ${GREEN}✅ OpenAI API Key configurado${NC}"
    ((PASSED++))
  else
    echo -e "  ${YELLOW}⚠️  OpenAI API Key não configurado${NC}"
    ((WARNINGS++))
  fi
else
  echo -e "  ${YELLOW}⚠️  Supabase CLI não instalado${NC}"
  echo -e "    ${CYAN}💡 Instale: npm install -g supabase${NC}"
  ((WARNINGS++))
fi

echo ""

# =========================================
# 5. Edge Functions
# =========================================
echo -e "${CYAN}⚡ 5. Edge Functions${NC}"
echo "----------------------------------------"

FUNCTIONS=("ai" "notifications" "transcribe" "upload-image" "delete-account" "moderate-content" "export-data" "webhook")

for func in "${FUNCTIONS[@]}"; do
  if [ -f "supabase/functions/$func/index.ts" ]; then
    echo -e "  ${GREEN}✅ $func existe${NC}"
    ((PASSED++))
  else
    echo -e "  ${RED}❌ $func não encontrado${NC}"
    ((FAILED++))
  fi
done

echo ""

# =========================================
# RESUMO
# =========================================
echo "=========================================="
echo -e "${CYAN}📊 RESUMO${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Passou: $PASSED${NC}"
echo -e "${RED}❌ Falhou: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 Tudo configurado! Pronto para produção.${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Alguns itens precisam ser corrigidos antes do build.${NC}"
  exit 1
fi
