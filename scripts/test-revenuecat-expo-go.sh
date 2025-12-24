#!/usr/bin/env bash
# ==============================================================================
# Script de Validação - RevenueCat no Expo Go
# ==============================================================================
# Verifica se a implementação RevenueCat está pronta para testes
# Uso: bash scripts/test-revenuecat-expo-go.sh
# ==============================================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "🧪 Validação RevenueCat - Modo Expo Go"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ==============================================================================
# 1. Verificar arquivos essenciais
# ==============================================================================
echo "📁 [1/5] Verificando arquivos..."

files=(
  "src/services/revenuecat.ts"
  "src/state/premium-store.ts"
  "src/screens/PaywallScreen.tsx"
  "src/utils/expo.ts"
  "App.tsx"
)

all_files_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file (não encontrado)"
    all_files_exist=false
  fi
done

if [ "$all_files_exist" = false ]; then
  echo -e "\n${RED}❌ Arquivos faltando. Verifique a estrutura do projeto.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Todos os arquivos encontrados${NC}\n"

# ==============================================================================
# 2. Verificar funções críticas no código
# ==============================================================================
echo "🔍 [2/5] Verificando funções críticas..."

checks=(
  "src/services/revenuecat.ts:initializePurchases"
  "src/services/revenuecat.ts:checkPremiumStatus"
  "src/services/revenuecat.ts:getIsConfigured"
  "src/state/premium-store.ts:debugTogglePremium"
  "src/state/premium-store.ts:syncWithRevenueCat"
  "src/utils/expo.ts:isExpoGo"
  "App.tsx:initPremium"
)

all_checks_pass=true
for check in "${checks[@]}"; do
  file="${check%%:*}"
  func="${check##*:}"

  if grep -q "$func" "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $func em $file"
  else
    echo -e "${RED}✗${NC} $func não encontrada em $file"
    all_checks_pass=false
  fi
done

if [ "$all_checks_pass" = false ]; then
  echo -e "\n${RED}❌ Funções críticas faltando.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Todas as funções críticas encontradas${NC}\n"

# ==============================================================================
# 3. Verificar imports de RevenueCat
# ==============================================================================
echo "📦 [3/5] Verificando imports..."

if grep -q "react-native-purchases" package.json; then
  echo -e "${GREEN}✓${NC} react-native-purchases instalado"
else
  echo -e "${RED}✗${NC} react-native-purchases não encontrado em package.json"
  exit 1
fi

if grep -q "from \"react-native-purchases\"" src/services/revenuecat.ts; then
  echo -e "${GREEN}✓${NC} Imports corretos em revenuecat.ts"
else
  echo -e "${RED}✗${NC} Imports faltando em revenuecat.ts"
  exit 1
fi

echo -e "${GREEN}✅ Imports configurados${NC}\n"

# ==============================================================================
# 4. Verificar detecção de Expo Go
# ==============================================================================
echo "🎯 [4/5] Verificando detecção de Expo Go..."

if grep -q "isExpoGo()" App.tsx; then
  echo -e "${GREEN}✓${NC} App.tsx detecta Expo Go"
else
  echo -e "${YELLOW}⚠${NC}  Detecção de Expo Go não encontrada em App.tsx"
fi

if grep -q "isExpoGo()" src/services/revenuecat.ts; then
  echo -e "${GREEN}✓${NC} revenuecat.ts detecta Expo Go"
else
  echo -e "${YELLOW}⚠${NC}  Detecção de Expo Go não encontrada em revenuecat.ts"
fi

if grep -q "Expo Go detectado" src/services/revenuecat.ts; then
  echo -e "${GREEN}✓${NC} Mensagem de log para Expo Go presente"
else
  echo -e "${YELLOW}⚠${NC}  Mensagem de log faltando"
fi

echo -e "${GREEN}✅ Detecção de Expo Go configurada${NC}\n"

# ==============================================================================
# 5. Verificar TypeScript
# ==============================================================================
echo "⚙️  [5/5] Verificando TypeScript..."

if npm run typecheck > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} TypeScript sem erros"
else
  echo -e "${RED}✗${NC} Erros de TypeScript encontrados"
  echo -e "${YELLOW}Execute: npm run typecheck${NC}"
  exit 1
fi

echo -e "${GREEN}✅ TypeScript validado${NC}\n"

# ==============================================================================
# RESUMO
# ==============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ VALIDAÇÃO COMPLETA - PRONTO PARA TESTAR${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📱 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Iniciar Expo:"
echo -e "   ${YELLOW}npm start${NC}"
echo ""
echo "2. Abrir no celular:"
echo "   - Abra Expo Go"
echo "   - Escaneie o QR code"
echo ""
echo "3. Verificar logs esperados:"
echo -e "   ${GREEN}✓${NC} [RevenueCat] Expo Go detectado"
echo -e "   ${GREEN}✓${NC} [App] RevenueCat isConfigured: false"
echo -e "   ${GREEN}✓${NC} [PremiumStore] No customer info found"
echo ""
echo "4. Testar toggle premium:"
echo "   - Abra tela Paywall"
echo "   - Use botão 'Ativar Premium (DEV)'"
echo "   - Valide acesso às features"
echo ""
echo -e "${BLUE}📖 Guia completo:${NC} docs/TESTE_EXPO_GO.md"
echo ""
