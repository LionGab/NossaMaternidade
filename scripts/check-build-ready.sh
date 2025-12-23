#!/bin/bash

# Script de validação pré-build
# Verifica se o projeto está pronto para build de produção

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verificando prontidão para build..."

ERRORS=0
WARNINGS=0

# Verificar se eas.json existe
if [ ! -f "eas.json" ]; then
    echo -e "${RED}❌ eas.json não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ eas.json encontrado${NC}"
fi

# Verificar se app.json existe e tem configurações básicas
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ app.json não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ app.json encontrado${NC}"
    
    # Verificar bundle identifier iOS
    if ! grep -q '"bundleIdentifier"' app.json; then
        echo -e "${YELLOW}⚠️  bundleIdentifier iOS não configurado${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ bundleIdentifier iOS configurado${NC}"
    fi
    
    # Verificar package Android
    if ! grep -q '"package"' app.json; then
        echo -e "${YELLOW}⚠️  package Android não configurado${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ package Android configurado${NC}"
    fi
fi

# Verificar assets
if [ ! -f "assets/icon.png" ]; then
    echo -e "${YELLOW}⚠️  assets/icon.png não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ Ícone do app encontrado${NC}"
fi

if [ ! -f "assets/splash.png" ]; then
    echo -e "${YELLOW}⚠️  assets/splash.png não encontrado${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ Splash screen encontrado${NC}"
fi

# Verificar TypeScript
echo "🔍 Verificando tipos TypeScript..."
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript sem erros${NC}"
else
    echo -e "${RED}❌ Erros de TypeScript encontrados${NC}"
    ERRORS=$((ERRORS + 1))
    npm run typecheck
fi

# Verificar ESLint
echo "🔍 Verificando ESLint..."
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ESLint sem erros e warnings${NC}"
else
    # ESLint retorna erro se tem warnings ou errors
    # Vamos verificar se são apenas warnings
    LINT_OUTPUT=$(npm run lint 2>&1)
    if echo "$LINT_OUTPUT" | grep -q "0 errors"; then
        echo -e "${YELLOW}⚠️  Avisos do ESLint encontrados (aceitável)${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${RED}❌ Erros do ESLint encontrados${NC}"
        ERRORS=$((ERRORS + 1))
        npm run lint
    fi
fi

# Verificar se EAS CLI está instalado
if command -v eas &> /dev/null; then
    echo -e "${GREEN}✅ EAS CLI instalado${NC}"
    
    # Verificar login
    if eas whoami > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Logado no EAS${NC}"
    else
        echo -e "${YELLOW}⚠️  Não logado no EAS. Execute: eas login${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  EAS CLI não instalado. Execute: npm install -g eas-cli${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Projeto pronto para build!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Projeto pronto com $WARNINGS aviso(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erro(s) encontrado(s)${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}   $WARNINGS aviso(s) encontrado(s)${NC}"
    fi
    exit 1
fi

