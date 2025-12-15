#!/bin/bash
# Pre-commit hook para quality gates
# Instalar: ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit

set -e

echo "🔍 Running quality gates..."

# Type check
echo "📝 Running TypeScript type check..."
bun run typecheck || {
  echo "❌ TypeScript errors found. Please fix before committing."
  exit 1
}

# Lint
echo "🔧 Running ESLint..."
bun run lint || {
  echo "❌ ESLint errors found. Please fix before committing."
  exit 1
}

# Build readiness check (opcional - pode ser lento)
# echo "🏗️  Checking build readiness..."
# bun run check-build-ready || {
#   echo "⚠️  Build readiness check failed. Continue anyway? (y/n)"
#   read -r response
#   if [ "$response" != "y" ]; then
#     exit 1
#   fi
# }

echo "✅ All quality gates passed!"
exit 0
