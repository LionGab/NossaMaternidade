#!/usr/bin/env node
/**
 * Script de Validação de Design Tokens
 * Detecta cores hardcoded e sugere tokens equivalentes
 * 
 * Uso: npm run validate:design
 */

const fs = require('fs');
const path = require('path');

// Tokens disponíveis para sugestões
const TOKEN_SUGGESTIONS = {
  '#FFFFFF': 'colors.background.card ou colors.text.inverse',
  '#000000': 'colors.text.primary (dark mode)',
  '#F8F9FA': 'colors.background.canvas',
  '#020617': 'colors.background.canvas (dark mode)',
  '#0F172A': 'colors.text.primary',
  '#334155': 'colors.text.secondary',
  '#64748B': 'colors.text.tertiary',
  '#6B7280': 'colors.text.tertiary',
  '#94A3B8': 'colors.text.disabled',
  '#004E9A': 'colors.primary.main',
  '#D93025': 'colors.status.error',
  '#236B62': 'colors.status.success',
  '#F59E0B': 'colors.status.warning',
  '#60A5FA': 'colors.primary.main (dark mode)',
  '#CBD5E1': 'colors.border.medium',
};

// Padrões para detectar cores hardcoded
const HEX_PATTERN = /#[0-9A-Fa-f]{3,8}/g;
const RGB_PATTERN = /rgba?\([^)]+\)/g;
const NAMED_COLOR_PATTERN = /\b(white|black|red|blue|green|yellow|orange|pink|purple|gray|grey)\b/gi;

// Arquivos permitidos para ter cores (definições de tokens ou casos legítimos)
const ALLOWED_FILES = [
  'tokens.ts',
  'colors.ts',
  'ThemeContext.tsx',
  'ErrorBoundary.tsx',     // Fallback component - não pode usar hooks/context
  'Theme.ts',              // Arquivo de compatibilidade de tema
  'shadowHelper.ts',       // Define valores de shadow com fallback
  'habits.ts',             // Dados estáticos com cores semânticas
];

// Padrões que são falsos positivos (cores em comentários, fallbacks com tokens já usados)
const ALLOWED_PATTERNS = [
  /ColorTokens\.[a-zA-Z]+\[.*\]/,  // ColorTokens.xxx[] - valores de tokens
  /colors\.raw\./,                  // colors.raw.xxx - acesso raw a tokens
  /\/\/ ?(ColorTokens|Substituído|fallback|#[0-9A-Fa-f]{6})/i, // Comentários de documentação
  /\|\| ['"]?#[0-9A-Fa-f]/,        // Fallbacks: || '#xxx'
  /\|\| ['"]?rgba/,                // Fallbacks: || 'rgba(...)'
  /className=.*\b(white|black)\b/i, // Classes NativeWind com cores (text-white, bg-black)
  /\* +.*=.*rgba\(/,               // Comentários JSDoc com exemplos: * rippleColor="rgba(..."
  /return `rgba\(/,                // Funções que geram cores dinamicamente
  /#access_token/,                 // OAuth token identifier
  /#id/,                           // Fragment identifier
  /includes\(['"]#/,               // String includes com # (URL fragments, tokens)
];

function isAllowedFile(filePath) {
  const fileName = path.basename(filePath);
  return ALLOWED_FILES.some(allowed => fileName.includes(allowed));
}

function isAllowedPattern(line) {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(line));
}

function findViolations(filePath) {
  const violations = [];
  
  // Se for arquivo de tokens, permitir cores
  if (isAllowedFile(filePath)) {
    return violations;
  }

  // Ignorar arquivos dentro de src/design-system/ (sistema legado)
  if (filePath.includes('src/design-system') || filePath.includes('src\\design-system')) {
    return violations;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Detectar uso de src/design-system/ (legado) - mas ignorar se for comentário
  const legacyPattern = /@\/design-system/;
  if (legacyPattern.test(content)) {
    // Verificar se não está em comentário
    const lines = content.split('\n');
    let foundInCode = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Ignorar comentários
      if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
        continue;
      }
      if (legacyPattern.test(line)) {
        foundInCode = true;
        break;
      }
    }
    
    if (foundInCode) {
      violations.push({
        file: filePath,
        line: 1,
        content: 'Uso de src/design-system/ (legado)',
        type: 'legacy',
        suggestion: 'Migre para src/theme/tokens.ts e useTheme() hook',
      });
    }
  }
  
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Ignorar comentários e strings de importação
    if (line.trim().startsWith('//') || line.includes('import ') || line.includes('from ')) {
      return;
    }

    // Ignorar padrões permitidos (fallbacks, comentários de documentação)
    if (isAllowedPattern(line)) {
      return;
    }

    // Detectar hex colors
    const hexMatches = line.match(HEX_PATTERN);
    if (hexMatches) {
      hexMatches.forEach(match => {
        // Ignorar se é um fallback com || 
        if (line.includes(`|| '${match}'`) || line.includes(`|| "${match}"`)) {
          return;
        }
        // Ignorar padrões que não são cores válidas (ex: #access_token, #id, etc)
        // Cores hex válidas têm 3, 4, 6 ou 8 caracteres hexadecimais após o #
        const hexValue = match.substring(1); // Remove o #
        // Verificar se é uma cor válida (3, 4, 6 ou 8 caracteres hex)
        const isValidColor = /^[0-9A-Fa-f]{3}$/.test(hexValue) || 
                             /^[0-9A-Fa-f]{4}$/.test(hexValue) || 
                             /^[0-9A-Fa-f]{6}$/.test(hexValue) || 
                             /^[0-9A-Fa-f]{8}$/.test(hexValue);
        if (!isValidColor) {
          return; // Não é uma cor válida, ignorar (ex: #access_token, #id, etc)
        }
        // Ignorar se está em contexto de URL, string ou identificador
        if (line.includes('url') || line.includes('includes') || line.includes('callback') || 
            line.includes('token') || line.includes('fragment') || line.includes('hash')) {
          // Se o match está dentro de uma string, provavelmente é um identificador
          const matchIndex = line.indexOf(match);
          const beforeMatch = line.substring(0, matchIndex);
          const afterMatch = line.substring(matchIndex + match.length);
          // Verificar se está entre aspas ou em contexto de string
          const quotesBefore = (beforeMatch.match(/['"`]/g) || []).length;
          const quotesAfter = (afterMatch.match(/['"`]/g) || []).length;
          if (quotesBefore % 2 === 1 || quotesAfter % 2 === 1) {
            return; // Está dentro de uma string, provavelmente é um identificador
          }
        }
        const suggestion = TOKEN_SUGGESTIONS[match.toUpperCase()] || TOKEN_SUGGESTIONS[match];
        violations.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type: 'hex',
          suggestion: suggestion || 'Use tokens do design system',
        });
      });
    }

    // Detectar rgb/rgba
    const rgbMatches = line.match(RGB_PATTERN);
    if (rgbMatches) {
      rgbMatches.forEach(match => {
        // Ignorar se é um fallback com ||
        if (line.includes(`|| '${match}'`) || line.includes(`|| "${match}"`)) {
          return;
        }
        violations.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type: match.startsWith('rgba') ? 'rgba' : 'rgb',
          suggestion: 'Use tokens do design system (ex: colors.border.light)',
        });
      });
    }

    // Detectar named colors (apenas em contextos suspeitos)
    if (line.includes('color:') || line.includes('backgroundColor:') || line.includes('borderColor:')) {
      const namedMatches = line.match(NAMED_COLOR_PATTERN);
      if (namedMatches) {
        namedMatches.forEach(match => {
          violations.push({
            file: filePath,
            line: lineNumber,
            content: line.trim(),
            type: 'named',
            suggestion: 'Use tokens do design system',
          });
        });
      }
    }
  });

  return violations;
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    try {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Ignorar pastas específicas
        const dirName = path.basename(filePath);
        if (['node_modules', '.expo', 'dist', 'build', 'android', 'ios', 'web-build', '__tests__'].includes(dirName)) {
          return;
        }
        getAllFiles(filePath, fileList);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        // Ignorar arquivos de teste
        if (!file.includes('.test.') && !file.includes('.spec.')) {
          fileList.push(filePath);
        }
      }
    } catch (err) {
      // Ignorar erros de acesso
    }
  });

  return fileList;
}

function validateProject() {
  const violations = [];
  const filesWithViolations = new Set();

  // Buscar todos arquivos .tsx e .ts em src/
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Pasta src/ não encontrada!');
    process.exit(1);
  }

  const srcFiles = getAllFiles(srcDir);

  console.log(`🔍 Analisando ${srcFiles.length} arquivos...\n`);

  srcFiles.forEach(file => {
    const fileViolations = findViolations(file);
    
    if (fileViolations.length > 0) {
      violations.push(...fileViolations);
      filesWithViolations.add(file);
    }
  });

  const summary = {
    hex: violations.filter(v => v.type === 'hex').length,
    rgb: violations.filter(v => v.type === 'rgb').length,
    rgba: violations.filter(v => v.type === 'rgba').length,
    named: violations.filter(v => v.type === 'named').length,
  };

  return {
    violations,
    totalFiles: srcFiles.length,
    filesWithViolations,
    summary,
  };
}

function printReport(result) {
  console.log('═'.repeat(80));
  console.log('📊 RELATÓRIO DE VALIDAÇÃO DE DESIGN TOKENS');
  console.log('═'.repeat(80));
  console.log(`\n📁 Arquivos analisados: ${result.totalFiles}`);
  console.log(`⚠️  Arquivos com violações: ${result.filesWithViolations.size}`);
  console.log(`🔴 Total de violações: ${result.violations.length}\n`);

  if (result.violations.length === 0) {
    console.log('✅ Nenhuma violação encontrada! Design tokens estão sendo usados corretamente.\n');
    return;
  }

  console.log('📈 Resumo por tipo:');
  console.log(`   • Hex colors: ${result.summary.hex}`);
  console.log(`   • RGB colors: ${result.summary.rgb}`);
  console.log(`   • RGBA colors: ${result.summary.rgba}`);
  console.log(`   • Named colors: ${result.summary.named}\n`);

  // Agrupar por arquivo
  const violationsByFile = new Map();
  result.violations.forEach(v => {
    const relativePath = path.relative(process.cwd(), v.file);
    if (!violationsByFile.has(relativePath)) {
      violationsByFile.set(relativePath, []);
    }
    violationsByFile.get(relativePath).push(v);
  });

  console.log('═'.repeat(80));
  console.log('🔴 VIOLAÇÕES DETALHADAS:\n');

  violationsByFile.forEach((fileViolations, filePath) => {
    console.log(`📄 ${filePath} (${fileViolations.length} violações)`);
    console.log('─'.repeat(80));
    
    fileViolations.forEach(v => {
      const contentPreview = v.content.length > 60 ? v.content.substring(0, 60) + '...' : v.content;
      console.log(`   Linha ${String(v.line).padStart(4, ' ')}: ${contentPreview}`);
      if (v.suggestion) {
        console.log(`   💡 Sugestão: ${v.suggestion}`);
      }
      console.log('');
    });
  });

  console.log('═'.repeat(80));
  console.log('\n💡 DICA: Use `useThemeColors()` hook para acessar tokens do design system.');
  console.log('   Exemplo: const colors = useThemeColors(); colors.text.primary\n');
}

function main() {
  try {
    const result = validateProject();
    printReport(result);

    // Exit code baseado em violações críticas (hex/rgb/rgba)
    const criticalViolations = result.violations.filter(
      v => v.type === 'hex' || v.type === 'rgb' || v.type === 'rgba'
    ).length;

    if (criticalViolations > 0) {
      console.log(`❌ Encontradas ${criticalViolations} violações críticas. Corrija antes de commitar.\n`);
      process.exit(1);
    } else {
      console.log('✅ Nenhuma violação crítica encontrada.\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Erro ao validar design tokens:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateProject };

