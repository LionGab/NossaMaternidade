#!/bin/bash
# Script de setup para integração Mac ao workspace
# Uso: bash scripts/setup-mac.sh

set -e

echo "🍎 Configurando Mac para Nossa Maternidade..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
  exit 1
fi

# 1. Verificar Homebrew
echo -e "${YELLOW}📦 Verificando Homebrew...${NC}"
if ! command -v brew > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Homebrew não encontrado. Instalando...${NC}"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo -e "${GREEN}✅ Homebrew instalado${NC}"
fi

# 2. Verificar Node.js
echo -e "${YELLOW}📦 Verificando Node.js...${NC}"
if ! command -v node > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Node.js não encontrado. Instalando...${NC}"
  brew install node
else
  echo -e "${GREEN}✅ Node.js instalado ($(node --version))${NC}"
fi

# 3. Verificar Bun (optional, but recommended)
echo -e "${YELLOW}📦 Verificando Bun (opcional mas recomendado)...${NC}"
if ! command -v bun > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Bun não encontrado. Instalando para melhor performance...${NC}"
  curl -fsSL https://bun.sh/install | bash
  # Adicionar ao PATH se necessário
  if [ -f "$HOME/.zshrc" ]; then
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc 2>/dev/null || true
  fi
else
  echo -e "${GREEN}✅ Bun instalado ($(bun --version))${NC}"
fi

# Use bun if available, otherwise fallback to npm
if command -v bun > /dev/null 2>&1; then
  PKG_RUNNER="bun"
  PKG_INSTALL="bun install"
else
  PKG_RUNNER="npm"
  PKG_INSTALL="npm install"
fi

echo -e "${GREEN}📦 Usando: $PKG_RUNNER${NC}"

# 4. Verificar Xcode Command Line Tools
echo -e "${YELLOW}📦 Verificando Xcode Command Line Tools...${NC}"
if ! xcode-select -p > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Xcode Command Line Tools não encontrado. Instalando...${NC}"
  xcode-select --install
  echo -e "${YELLOW}⚠️  Aguarde a instalação e execute este script novamente${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Xcode Command Line Tools instalado${NC}"
fi

# 5. Verificar CocoaPods (para iOS)
echo -e "${YELLOW}📦 Verificando CocoaPods...${NC}"
if ! command -v pod > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  CocoaPods não encontrado. Instalando...${NC}"
  sudo gem install cocoapods
else
  echo -e "${GREEN}✅ CocoaPods instalado ($(pod --version))${NC}"
fi

# 6. Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências do projeto...${NC}"
$PKG_INSTALL

# 7. Configurar variáveis de ambiente
echo -e "${YELLOW}⚙️  Configurando variáveis de ambiente...${NC}"
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Arquivo .env.local criado a partir do template${NC}"
    echo -e "${YELLOW}⚠️  Configure as variáveis em .env.local antes de continuar${NC}"
  else
    echo -e "${RED}❌ Template .env.example não encontrado${NC}"
  fi
else
  echo -e "${GREEN}✅ Arquivo .env.local já existe${NC}"
fi

# 8. Limpar cache
echo -e "${YELLOW}🧹 Limpando cache...${NC}"
$PKG_RUNNER run clean

# 9. Configurar Git (line endings)
echo -e "${YELLOW}⚙️  Configurando Git...${NC}"
git config core.autocrlf input || echo -e "${YELLOW}⚠️  Git não configurado (não é um repositório Git)${NC}"

# 10. Dar permissão aos scripts
echo -e "${YELLOW}⚙️  Configurando permissões dos scripts...${NC}"
chmod +x scripts/*.sh 2>/dev/null || true

# 11. Verificar TypeScript
echo -e "${YELLOW}🔍 Verificando TypeScript...${NC}"
if $PKG_RUNNER run typecheck > /dev/null 2>&1; then
  echo -e "${GREEN}✅ TypeScript OK${NC}"
else
  echo -e "${YELLOW}⚠️  Erros de TypeScript encontrados. Execute: $PKG_RUNNER run typecheck${NC}"
fi

# 12. Verificar ESLint
echo -e "${YELLOW}🔍 Verificando ESLint...${NC}"
if $PKG_RUNNER run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✅ ESLint OK${NC}"
else
  echo -e "${YELLOW}⚠️  Erros de ESLint encontrados. Execute: $PKG_RUNNER run lint${NC}"
fi

# 13. Configurar Cursor CLI (opcional)
echo -e "${YELLOW}⚙️  Configurando Cursor CLI (opcional)...${NC}"
if [ -d "/Applications/Cursor.app" ]; then
  if ! command -v cursor > /dev/null 2>&1; then
    if [ -f "$HOME/.zshrc" ]; then
      echo 'export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"' >> ~/.zshrc
      source ~/.zshrc 2>/dev/null || true
      echo -e "${GREEN}✅ Cursor CLI configurado${NC}"
    else
      echo -e "${YELLOW}⚠️  Adicione manualmente ao PATH: /Applications/Cursor.app/Contents/Resources/app/bin${NC}"
    fi
  else
    echo -e "${GREEN}✅ Cursor CLI já configurado${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Cursor não encontrado (opcional)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Configure as variáveis em .env.local"
echo "  2. Execute: $PKG_RUNNER run start"
echo "  3. Para iOS: $PKG_RUNNER run ios"
echo "  4. Para verificar tudo: $PKG_RUNNER run validate"
echo ""
echo "Documentação:"
echo "  - docs/INTEGRACAO_MAC.md - Guia completo"
echo "  - docs/MCP_SETUP.md - Configuração MCP"

