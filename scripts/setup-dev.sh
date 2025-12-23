#!/bin/bash
# Script de setup do ambiente de desenvolvimento
# Uso: npm run setup-dev (ou bun run setup-dev)

set -e

echo "🚀 Configurando ambiente de desenvolvimento..."

# Use bun if available, otherwise fallback to npm
if command -v bun > /dev/null 2>&1; then
  PKG_RUNNER="bun"
  PKG_INSTALL="bun install"
else
  PKG_RUNNER="npm"
  PKG_INSTALL="npm install"
fi

echo "📦 Usando: $PKG_RUNNER"

# Instalar dependências
echo "📦 Instalando dependências..."
$PKG_INSTALL

# Verificar variáveis de ambiente
if [ ! -f .env.local ]; then
  echo "⚠️  Arquivo .env.local não encontrado. Copiando template..."
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado. Configure as variáveis necessárias."
  else
    echo "⚠️  Template não encontrado. Crie um arquivo .env.local manualmente."
  fi
else
  echo "✅ Arquivo .env.local encontrado."
fi

# Verificar TypeScript
echo "🔍 Verificando TypeScript..."
$PKG_RUNNER run typecheck || {
  echo "⚠️  Erros de TypeScript encontrados. Corrija antes de continuar."
}

# Verificar ESLint
echo "🔍 Verificando ESLint..."
$PKG_RUNNER run lint || {
  echo "⚠️  Erros de ESLint encontrados. Corrija antes de continuar."
}

# Verificar Prettier
echo "🔍 Verificando formatação..."
$PKG_RUNNER run format:check || {
  echo "⚠️  Arquivos não formatados. Execute: $PKG_RUNNER run format"
}

echo ""
echo "✅ Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. Configure as variáveis em .env.local"
echo "  2. Execute: $PKG_RUNNER start"
echo "  3. Para Android: $PKG_RUNNER run android"
echo "  4. Para iOS (macOS only): $PKG_RUNNER run ios"
