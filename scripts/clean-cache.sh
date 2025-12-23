#!/bin/bash
# Script para limpar caches do projeto
# Uso: npm run clean (ou bun run clean)

set -e

echo "🧹 Limpando caches..."

# Limpar cache do Expo
if [ -d ".expo" ]; then
  echo "🗑️  Removendo .expo..."
  rm -rf .expo
fi

# Limpar cache do Metro (local e global)
if [ -d ".metro-cache" ]; then
  echo "🗑️  Removendo .metro-cache (local)..."
  rm -rf .metro-cache
fi

# Limpar cache global do Metro (~/.metro-cache)
if [ -d "$HOME/.metro-cache" ]; then
  echo "🗑️  Removendo ~/.metro-cache (global)..."
  if rm -rf "$HOME/.metro-cache" 2>/dev/null; then
    echo "✅ Cache global removido"
  else
    echo "⚠️  Não foi possível remover cache global (permissões insuficientes)"
    echo "   Execute manualmente: rm -rf ~/.metro-cache"
  fi
fi

# Limpar cache do node_modules
if [ -d "node_modules/.cache" ]; then
  echo "🗑️  Removendo node_modules/.cache..."
  rm -rf node_modules/.cache
fi

# Limpar TypeScript build info
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo "✅ Caches limpos!"
echo ""
echo "Execute: npm run start:clear para reiniciar com cache limpo"
