#!/bin/bash
# Hook de pre-commit para validacao de design
# Adicione ao .husky/pre-commit ou use com lint-staged

set -e

echo "🎨 Verificando qualidade de design..."

# 1. Verificar cores hardcoded (excluindo arquivos de config/dados)
HARDCODED_COLORS=$(grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "design-system.ts" | grep -v "colors.ts" | grep -v "tailwind.config" | grep -v "store.ts" | grep -v "premium.ts" | wc -l | tr -d ' ')

# Threshold: permitir até 300 cores (legado) - meta é 0
THRESHOLD=300

if [ "$HARDCODED_COLORS" -gt "$THRESHOLD" ]; then
    echo "❌ ERRO: Encontradas $HARDCODED_COLORS cores hardcoded (limite: $THRESHOLD)!"
    echo ""
    echo "Arquivos com cores hardcoded:"
    grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "design-system.ts" | grep -v "colors.ts" | grep -v "tailwind.config" | grep -v "store.ts" | grep -v "premium.ts" | head -10
    echo ""
    echo "💡 Use tokens do design-system.ts:"
    echo "   import { COLORS } from '../theme/design-system';"
    echo "   backgroundColor: COLORS.primary[500]"
    exit 1
elif [ "$HARDCODED_COLORS" -gt "0" ]; then
    echo "⚠️  AVISO: Encontradas $HARDCODED_COLORS cores hardcoded (legado)"
    echo "   Meta: reduzir para 0 gradualmente"
else
    echo "✅ Nenhuma cor hardcoded encontrada"
fi

# 2. Verificar tap targets pequenos (opcional, warning apenas)
SMALL_TARGETS=$(grep -rn "width: [0-3][0-9]," src/ --include="*.tsx" 2>/dev/null | grep -v "borderWidth" | wc -l | tr -d ' ')

if [ "$SMALL_TARGETS" -gt "0" ]; then
    echo "⚠️  AVISO: Encontrados $SMALL_TARGETS possiveis tap targets < 44pt"
    echo "   Verifique se elementos interativos tem minimo 44x44pt"
fi

# 3. Verificar uso de console.log (ja coberto pelo ESLint, mas double-check)
CONSOLE_LOGS=$(grep -rn "console\.log" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "logger" | wc -l | tr -d ' ')

if [ "$CONSOLE_LOGS" -gt "0" ]; then
    echo "⚠️  AVISO: Encontrados $CONSOLE_LOGS console.log"
    echo "   Use logger.* ao inves de console.log"
fi

# 4. Verificar imports de SafeAreaView errado
WRONG_SAFEAREA=$(grep -rn "from ['\"]react-native['\"]" src/ --include="*.tsx" 2>/dev/null | grep "SafeAreaView" | wc -l | tr -d ' ')

if [ "$WRONG_SAFEAREA" -gt "0" ]; then
    echo "❌ ERRO: SafeAreaView importado de react-native!"
    echo "   Use: import { SafeAreaView } from 'react-native-safe-area-context'"
    exit 1
fi

echo ""
echo "🎨 Design quality check passou!"
echo ""
