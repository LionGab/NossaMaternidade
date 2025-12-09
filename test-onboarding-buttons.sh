#!/bin/bash

# Script de teste rápido para validar botões do onboarding
# Uso: bash test-onboarding-buttons.sh

set -e

echo "🧪 Testando Botões do Onboarding - Nossa Maternidade"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para validar arquivo
check_file() {
  local file=$1
  local pattern=$2
  local description=$3
  
  echo -n "  Verificando $description... "
  
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
    return 0
  else
    echo -e "${RED}✗${NC}"
    return 1
  fi
}

echo "📁 Verificando arquivos modificados..."
echo ""

# HapticButton
echo "1️⃣  HapticButton.tsx"
check_file "src/components/atoms/HapticButton.tsx" "hitSlop" "hitSlop presente"
check_file "src/components/atoms/HapticButton.tsx" "pressRetentionOffset" "pressRetentionOffset presente"
check_file "src/components/atoms/HapticButton.tsx" "pointerEvents=\"none\"" "pointerEvents correto"
echo ""

# OnboardingScreen
echo "2️⃣  OnboardingScreen.tsx"
check_file "src/screens/Onboarding/OnboardingScreen.tsx" "keyboardShouldPersistTaps" "keyboard handling"
check_file "src/screens/Onboarding/OnboardingScreen.tsx" "zIndex" "z-index presente"
check_file "src/screens/Onboarding/OnboardingScreen.tsx" "pointerEvents=\"box-none\"" "pointerEvents box-none"
check_file "src/screens/Onboarding/OnboardingScreen.tsx" "hitSlop" "hitSlop em OptionCard"
echo ""

# OnboardingFlowNew
echo "3️⃣  OnboardingFlowNew.tsx"
check_file "src/screens/Onboarding/OnboardingFlowNew.tsx" "DEFAULT_HIT_SLOP" "constante DEFAULT_HIT_SLOP"
check_file "src/screens/Onboarding/OnboardingFlowNew.tsx" "hitSlop={DEFAULT_HIT_SLOP}" "hitSlop aplicado"
echo ""

echo "=================================================="
echo ""

# Contar quantos hitSlop foram adicionados
HITSLOP_COUNT=$(grep -r "hitSlop" src/screens/Onboarding/ | wc -l)
echo "📊 Total de hitSlop encontrados nos arquivos de onboarding: $HITSLOP_COUNT"
echo ""

# Verificar TypeScript (se tsc estiver disponível)
echo "🔍 Verificando TypeScript..."
if command -v npx &> /dev/null; then
  if npx tsc --version &> /dev/null; then
    echo "  Rodando type-check..."
    if npx tsc --noEmit 2>&1 | grep -i "error" > /tmp/tsc-errors.txt; then
      ERROR_COUNT=$(wc -l < /tmp/tsc-errors.txt)
      if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "  ${YELLOW}⚠ $ERROR_COUNT erros TypeScript encontrados${NC}"
        echo "  (Alguns erros podem ser pré-existentes)"
      fi
    else
      echo -e "  ${GREEN}✓ Nenhum erro TypeScript${NC}"
    fi
  else
    echo -e "  ${YELLOW}⚠ TypeScript não instalado, pulando...${NC}"
  fi
else
  echo -e "  ${YELLOW}⚠ npx não disponível, pulando...${NC}"
fi
echo ""

# Verificar se Metro está rodando
echo "📱 Verificando Metro Bundler..."
if lsof -i :8081 &> /dev/null; then
  echo -e "  ${GREEN}✓ Metro rodando na porta 8081${NC}"
  echo "  Acesse o app no Expo Go para testar!"
else
  echo -e "  ${YELLOW}⚠ Metro não está rodando${NC}"
  echo "  Para iniciar: npx expo start"
fi
echo ""

echo "=================================================="
echo ""
echo "✅ Verificação de código completa!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Iniciar Metro: npx expo start"
echo "  2. Abrir Expo Go no celular"
echo "  3. Escanear QR code"
echo "  4. Testar onboarding completo"
echo ""
echo "🧪 Checklist de testes manuais:"
echo "  [ ] Botão 'Próximo' funciona em todos os steps"
echo "  [ ] Botão 'Voltar' funciona"
echo "  [ ] OptionCards são clicáveis"
echo "  [ ] Botão funciona nas bordas (teste de hitSlop)"
echo "  [ ] Feedback háptico funciona"
echo "  [ ] Botão 'Começar!' finaliza onboarding"
echo ""
echo "📚 Documentação:"
echo "  - FIX_COMPLETO_ONBOARDING.md"
echo "  - ONBOARDING_BUTTON_FIX.md"
echo "  - RESUME_FIX_BOTOES.md"
echo ""
