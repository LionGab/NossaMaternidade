#!/usr/bin/env node
/**
 * Cursor Auto-fix Engine
 *
 * Aplica correções automáticas para violations de design tokens
 * com base em confidence levels
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Mapeamento de correções de alta confiança (95%+)
const HIGH_CONFIDENCE_FIXES = {
  // Cores hex comuns
  '#FFFFFF': {
    replacements: [
      { pattern: /backgroundColor:\s*['"]#FFFFFF['"]/g, replacement: "backgroundColor: colors.background.card" },
      { pattern: /color:\s*['"]#FFFFFF['"]/g, replacement: "color: colors.text.inverse" },
      { pattern: /['"]#FFFFFF['"]/g, replacement: "colors.background.card" },
    ],
    confidence: 0.95,
  },
  '#000000': {
    replacements: [
      { pattern: /color:\s*['"]#000000['"]/g, replacement: "color: colors.text.primary" },
      { pattern: /backgroundColor:\s*['"]#000000['"]/g, replacement: "backgroundColor: colors.background.canvas" },
      { pattern: /['"]#000000['"]/g, replacement: "colors.text.primary" },
    ],
    confidence: 0.95,
  },
  '#FFF': {
    replacements: [
      { pattern: /backgroundColor:\s*['"]#FFF['"]/g, replacement: "backgroundColor: colors.background.card" },
      { pattern: /color:\s*['"]#FFF['"]/g, replacement: "color: colors.text.inverse" },
      { pattern: /['"]#FFF['"]/g, replacement: "colors.background.card" },
    ],
    confidence: 0.95,
  },
  '#000': {
    replacements: [
      { pattern: /color:\s*['"]#000['"]/g, replacement: "color: colors.text.primary" },
      { pattern: /['"]#000['"]/g, replacement: "colors.text.primary" },
    ],
    confidence: 0.95,
  },
  // Spacing comum
  'padding: 16': {
    replacements: [
      { pattern: /padding:\s*16\b/g, replacement: "padding: Tokens.spacing['4']" },
    ],
    confidence: 0.95,
  },
  'margin: 16': {
    replacements: [
      { pattern: /margin:\s*16\b/g, replacement: "margin: Tokens.spacing['4']" },
    ],
    confidence: 0.95,
  },
  'fontSize: 14': {
    replacements: [
      { pattern: /fontSize:\s*14\b/g, replacement: "fontSize: Tokens.typography.sizes.sm" },
    ],
    confidence: 0.90,
  },
  'fontSize: 16': {
    replacements: [
      { pattern: /fontSize:\s*16\b/g, replacement: "fontSize: Tokens.typography.sizes.md" },
    ],
    confidence: 0.90,
  },
};

// Mapeamento de correções de média confiança (70-94%)
const MEDIUM_CONFIDENCE_FIXES = {
  'rgba(0, 0, 0, 0.1)': {
    replacements: [
      { pattern: /rgba\(0,\s*0,\s*0,\s*0\.1\)/g, replacement: "colors.border.light" },
    ],
    confidence: 0.80,
  },
  'rgba(255, 255, 255, 0.9)': {
    replacements: [
      { pattern: /rgba\(255,\s*255,\s*255,\s*0\.9\)/g, replacement: "colors.background.card" },
    ],
    confidence: 0.75,
  },
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    file: null,
    mode: 'single', // 'single' or 'batch'
    confidence: 'high', // 'high', 'medium', 'low', or 'all'
    dryRun: false,
    verbose: false,
    force: false,
  };

  args.forEach(arg => {
    if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    } else if (arg.startsWith('--mode=')) {
      options.mode = arg.split('=')[1];
    } else if (arg.startsWith('--confidence=')) {
      options.confidence = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--force') {
      options.force = true;
    }
  });

  return options;
}

// Obter violations de um arquivo usando MCP
async function getViolations(filePath) {
  return new Promise((resolve, reject) => {
    const runnerPath = path.join(__dirname, '../src/mcp/runners/design-tokens-runner.js');
    
    if (!fs.existsSync(runnerPath)) {
      reject(new Error(`Runner não encontrado: ${runnerPath}`));
      return;
    }

    const child = spawn('node', [runnerPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    const request = {
      jsonrpc: '2.0',
      id: `auto-fix-${Date.now()}`,
      method: 'design.validate',
      params: { filePath }
    };

    let responseReceived = false;
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        // Bug 1 Fix: Fechar stdin antes de matar o processo no timeout também
        if (child.stdin && !child.stdin.destroyed) {
          child.stdin.end();
        }
        child.kill();
        reject(new Error('Timeout ao obter violations'));
      }
    }, 30000);

    child.stdout.on('data', (data) => {
      output += data.toString();

      // Tentar parsear response assim que receber dados
      try {
        const lines = output.split('\n').filter(l => l.trim());
        for (const line of lines) {
          try {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              responseReceived = true;
              clearTimeout(timeout);
              
              // Bug 1 Fix: Fechar stdin antes de matar o processo
              if (child.stdin && !child.stdin.destroyed) {
                child.stdin.end();
              }
              child.kill();

              if (response.error) {
                reject(new Error(response.error.message));
              } else {
                resolve(response.data || { violations: [] });
              }
              return;
            }
          } catch (e) {
            // Continuar acumulando output
          }
        }
      } catch (e) {
        // Continuar acumulando output
      }
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('exit', (code) => {
      clearTimeout(timeout);

      if (!responseReceived) {
        if (code !== 0) {
          reject(new Error(`Runner exit code ${code}: ${errorOutput}`));
        } else {
          reject(new Error('Response não encontrada'));
        }
      }
    });

    child.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Aplicar fixes em um arquivo
function applyFixes(filePath, violations, options) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  const fixes = [];
  let totalFixes = 0;

  // Bug 2 Fix: Usar violations detectadas pelo MCP para determinar fixes
  // Criar um mapa de violations para facilitar busca
  const violationMap = new Map();
  violations.forEach(v => {
    const key = v.value || v.pattern || v.type;
    if (key) {
      violationMap.set(key, v);
    }
  });

  // Determinar quais fixes aplicar baseado em confidence E violations
  const fixesToApply = [];
  
  if (options.confidence === 'high' || options.confidence === 'all') {
    Object.entries(HIGH_CONFIDENCE_FIXES).forEach(([key, fix]) => {
      // Aplicar fix se houver violation correspondente OU se for modo 'all'
      if (options.confidence === 'all' || violationMap.has(key) || 
          violations.some(v => v.value === key || v.pattern?.includes(key))) {
        fixesToApply.push({ ...fix, key });
      }
    });
  }

  if (options.confidence === 'medium' || options.confidence === 'all') {
    Object.entries(MEDIUM_CONFIDENCE_FIXES).forEach(([key, fix]) => {
      // Aplicar fix se houver violation correspondente OU se for modo 'all'
      if (options.confidence === 'all' || violationMap.has(key) || 
          violations.some(v => v.value === key || v.pattern?.includes(key))) {
        fixesToApply.push({ ...fix, key });
      }
    });
  }

  // Aplicar fixes baseados em violations específicas
  violations.forEach(violation => {
    // Tentar encontrar fix correspondente para a violation
    const violationValue = violation.value || violation.pattern || '';
    
    // Buscar em HIGH_CONFIDENCE_FIXES
    Object.entries(HIGH_CONFIDENCE_FIXES).forEach(([key, fix]) => {
      if (violationValue.includes(key) || key.includes(violationValue)) {
        if (!fixesToApply.find(f => f.key === key)) {
          fixesToApply.push({ ...fix, key });
        }
      }
    });

    // Buscar em MEDIUM_CONFIDENCE_FIXES
    Object.entries(MEDIUM_CONFIDENCE_FIXES).forEach(([key, fix]) => {
      if (violationValue.includes(key) || key.includes(violationValue)) {
        if (!fixesToApply.find(f => f.key === key)) {
          fixesToApply.push({ ...fix, key });
        }
      }
    });
  });

  // Aplicar fixes
  fixesToApply.forEach(fix => {
    fix.replacements.forEach(replacement => {
      const matches = content.match(replacement.pattern);
      if (matches) {
        content = content.replace(replacement.pattern, replacement.replacement);
        totalFixes += matches.length;
        fixes.push({
          pattern: replacement.pattern.toString(),
          replacement: replacement.replacement,
          matches: matches.length,
          confidence: fix.confidence,
        });
      }
    });
  });

  // Bug 3 Fix: Adicionar import de Tokens mesmo quando não há imports existentes
  if (content.includes('Tokens.') && !content.includes("from '@/theme/tokens'") && !content.includes("from '../../theme/tokens'")) {
    const importLine = "import { Tokens } from '@/theme/tokens';";
    // Tentar adicionar após outros imports
    const importMatch = content.match(/(import\s+.*?from\s+['"].*?['"];?\s*\n)+/);
    if (importMatch) {
      // Caso 1: Há imports existentes - adicionar após eles
      content = content.replace(importMatch[0], importMatch[0] + importLine + '\n');
      fixes.push({
        pattern: 'missing Tokens import',
        replacement: importLine,
        matches: 1,
        confidence: 0.95,
      });
      totalFixes++;
    } else {
      // Caso 2: Não há imports - adicionar no início do arquivo
      // Encontrar a primeira linha não-vazia ou comentário
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Pular comentários no início
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
          insertIndex = i;
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importLine);
      content = lines.join('\n');
      fixes.push({
        pattern: 'missing Tokens import (no existing imports)',
        replacement: importLine,
        matches: 1,
        confidence: 0.95,
      });
      totalFixes++;
    }
  }

  // Bug 3 Fix: Adicionar import de useThemeColors mesmo quando não há imports existentes
  if (content.includes('colors.') && !content.includes('useThemeColors') && !content.includes("from '@/hooks/useTheme'")) {
    const importLine = "import { useThemeColors } from '@/hooks/useTheme';";
    const importMatch = content.match(/(import\s+.*?from\s+['"].*?['"];?\s*\n)+/);
    if (importMatch) {
      // Caso 1: Há imports existentes - adicionar após eles
      content = content.replace(importMatch[0], importMatch[0] + importLine + '\n');
      fixes.push({
        pattern: 'missing useThemeColors import',
        replacement: importLine,
        matches: 1,
        confidence: 0.95,
      });
      totalFixes++;
    } else {
      // Caso 2: Não há imports - adicionar no início do arquivo
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Pular comentários no início
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
          insertIndex = i;
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importLine);
      content = lines.join('\n');
      fixes.push({
        pattern: 'missing useThemeColors import (no existing imports)',
        replacement: importLine,
        matches: 1,
        confidence: 0.95,
      });
      totalFixes++;
    }
  }

  return {
    originalContent,
    fixedContent: content,
    fixes,
    totalFixes,
    changed: content !== originalContent,
  };
}

// Processar um arquivo
async function processFile(filePath, options) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Arquivo não encontrado: ${fullPath}`);
    return null;
  }

  if (options.verbose) {
    console.log(`\n📄 Processando: ${fullPath}`);
  }

  try {
    // Obter violations do MCP
    const result = await getViolations(filePath);
    const violations = result.violations || [];

    if (violations.length === 0) {
      if (options.verbose) {
        console.log(`  ✅ Nenhuma violation encontrada`);
      }
      return null;
    }

    if (options.verbose) {
      console.log(`  ⚠️  ${violations.length} violations encontradas`);
    }

    // Aplicar fixes
    const fixResult = applyFixes(fullPath, violations, options);

    if (!fixResult.changed) {
      if (options.verbose) {
        console.log(`  ℹ️  Nenhuma correção aplicável`);
      }
      return null;
    }

    if (options.dryRun) {
      console.log(`\n📝 [DRY-RUN] Correções que seriam aplicadas em ${filePath}:`);
      fixResult.fixes.forEach(fix => {
        console.log(`  - ${fix.pattern} → ${fix.replacement} (${fix.matches}x, confidence: ${(fix.confidence * 100).toFixed(0)}%)`);
      });
      console.log(`  Total: ${fixResult.totalFixes} correções`);
      return fixResult;
    }

    // Aplicar mudanças
    fs.writeFileSync(fullPath, fixResult.fixedContent, 'utf-8');
    console.log(`✅ ${filePath}: ${fixResult.totalFixes} correções aplicadas`);
    
    if (options.verbose) {
      fixResult.fixes.forEach(fix => {
        console.log(`  - ${fix.pattern} → ${fix.replacement} (${fix.matches}x)`);
      });
    }

    return fixResult;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    return null;
  }
}

// Processar todos os arquivos do projeto
async function processBatch(options) {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Diretório src/ não encontrado');
    process.exit(1);
  }

  // Obter todos os arquivos .ts e .tsx
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const dirName = path.basename(filePath);
        if (!['node_modules', '.expo', 'dist', 'build', '__tests__'].includes(dirName)) {
          getAllFiles(filePath, fileList);
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const relativePath = path.relative(process.cwd(), filePath);
        if (!relativePath.includes('.test.') && !relativePath.includes('.spec.')) {
          fileList.push(relativePath);
        }
      }
    });
    return fileList;
  }

  const allFiles = getAllFiles(srcDir);
  console.log(`\n🔍 Encontrados ${allFiles.length} arquivos para processar\n`);

  const results = [];
  for (const file of allFiles) {
    const result = await processFile(file, options);
    if (result) {
      results.push(result);
    }
  }

  const totalFixes = results.reduce((sum, r) => sum + r.totalFixes, 0);
  console.log(`\n📊 Resumo:`);
  console.log(`  Arquivos processados: ${results.length}`);
  console.log(`  Total de correções: ${totalFixes}`);

  return results;
}

// Main
async function main() {
  const options = parseArgs();

  console.log('\n🔧 Cursor Auto-fix Engine\n');
  console.log('═'.repeat(60));

  if (options.dryRun) {
    console.log('⚠️  MODO DRY-RUN: Nenhuma alteração será aplicada\n');
  }

  try {
    if (options.mode === 'batch') {
      await processBatch(options);
    } else if (options.file) {
      await processFile(options.file, options);
    } else {
      console.error('❌ Especifique --file=PATH ou --mode=batch');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
