#!/usr/bin/env ts-node
/**
 * Script de Validação de Design Tokens
 * Detecta cores hardcoded e sugere tokens equivalentes
 * 
 * Uso: npm run validate:design
 */

import * as fs from 'fs';
import * as path from 'path';

interface Violation {
  file: string;
  line: number;
  content: string;
  type: 'hex' | 'rgb' | 'rgba' | 'named';
  suggestion?: string;
}

interface ValidationResult {
  violations: Violation[];
  totalFiles: number;
  filesWithViolations: Set<string>;
  summary: {
    hex: number;
    rgb: number;
    rgba: number;
    named: number;
  };
}

// Tokens disponíveis para sugestões
const TOKEN_SUGGESTIONS: Record<string, string> = {
  '#FFFFFF': 'colors.background.card ou colors.text.inverse',
  '#000000': 'colors.text.primary (dark mode)',
  '#F8F9FA': 'colors.background.canvas',
  '#020617': 'colors.background.canvas (dark mode)',
  '#0F172A': 'colors.text.primary',
  '#334155': 'colors.text.secondary',
  '#64748B': 'colors.text.tertiary',
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

// Arquivos e pastas a ignorar
const IGNORE_PATTERNS = [
  'node_modules/**',
  '.expo/**',
  'dist/**',
  'build/**',
  'android/**',
  'ios/**',
  'web-build/**',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/validate-design-tokens.ts',
  '**/tokens.ts', // Tokens.ts pode ter cores hardcoded (é o lugar certo)
  '**/ThemeContext.tsx',
];

// Arquivos permitidos para ter cores (definições de tokens)
const ALLOWED_FILES = [
  'tokens.ts',
  'colors.ts',
  'ThemeContext.tsx',
];

function isAllowedFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  return ALLOWED_FILES.some(allowed => fileName.includes(allowed));
}

function findViolations(filePath: string): Violation[] {
  const violations: Violation[] = [];
  
  // Se for arquivo de tokens, permitir cores
  if (isAllowedFile(filePath)) {
    return violations;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Ignorar comentários e strings de importação
    if (line.trim().startsWith('//') || line.includes('import ') || line.includes('from ')) {
      return;
    }

    // Detectar hex colors
    const hexMatches = line.match(HEX_PATTERN);
    if (hexMatches) {
      hexMatches.forEach(match => {
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

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar pastas específicas
      const dirName = path.basename(filePath);
      if (IGNORE_PATTERNS.some(pattern => dirName.includes(pattern.replace('**/', '').replace('/**', '')))) {
        return;
      }
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function validateProject(): ValidationResult {
  const violations: Violation[] = [];
  const filesWithViolations = new Set<string>();

  // Buscar todos arquivos .tsx e .ts em src/
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Pasta src/ não encontrada!');
    process.exit(1);
  }

  const allFiles = getAllFiles(srcDir);
  const srcFiles = allFiles.filter(file => {
    const relativePath = path.relative(process.cwd(), file);
    // Filtrar arquivos de teste e configs
    return !relativePath.includes('__tests__') && 
           !relativePath.includes('.test.') &&
           !relativePath.includes('.spec.');
  });

  console.log(`🔍 Analisando ${srcFiles.length} arquivos...\n`);

  srcFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    const fileViolations = findViolations(filePath);
    
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

function printReport(result: ValidationResult): void {
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
  const violationsByFile = new Map<string, Violation[]>();
  result.violations.forEach(v => {
    const relativePath = path.relative(process.cwd(), v.file);
    if (!violationsByFile.has(relativePath)) {
      violationsByFile.set(relativePath, []);
    }
    violationsByFile.get(relativePath)!.push(v);
  });

  console.log('═'.repeat(80));
  console.log('🔴 VIOLAÇÕES DETALHADAS:\n');

  violationsByFile.forEach((fileViolations, filePath) => {
    console.log(`📄 ${filePath} (${fileViolations.length} violações)`);
    console.log('─'.repeat(80));
    
    fileViolations.forEach(v => {
      console.log(`   Linha ${v.line.toString().padStart(4, ' ')}: ${v.content.substring(0, 60)}${v.content.length > 60 ? '...' : ''}`);
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

function main(): void {
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

export { validateProject, Violation, ValidationResult };

