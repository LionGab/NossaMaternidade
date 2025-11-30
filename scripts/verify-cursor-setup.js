#!/usr/bin/env node

/**
 * Script de Verificação: Configuração Claude no Cursor
 * 
 * Verifica se todas as configurações necessárias estão aplicadas
 * para uso otimizado do Claude no Cursor com Plano Max.
 * 
 * Data: 29/11/2025
 * Projeto: Nossa Maternidade
 */

const fs = require('fs');
const path = require('path');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function cross() {
  return `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

// Verificações
const checks = {
  cursorSettings: false,
  cursorRules: false,
  packageJson: false,
  docs: false,
  cursorIgnore: false,
};

let errors = [];
let warnings = [];

console.log('\n');
log('═══════════════════════════════════════════════════════════', 'cyan');
log('  Verificação: Claude no Cursor - Configuração Otimizada', 'cyan');
log('═══════════════════════════════════════════════════════════', 'cyan');
console.log('\n');

// 1. Verificar .cursor/settings.json
log('1. Verificando .cursor/settings.json...', 'blue');
const settingsPath = path.join(process.cwd(), '.cursor', 'settings.json');
if (fs.existsSync(settingsPath)) {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const requiredSettings = [
      'cursor.ai.model',
      'cursor.ai.enableCodebaseIndexing',
      'cursor.ai.contextWindow',
    ];
    
    const missing = requiredSettings.filter(key => !settings[key]);
    
    if (missing.length === 0) {
      log(`   ${checkmark()} Arquivo existe e contém configurações necessárias`, 'green');
      checks.cursorSettings = true;
    } else {
      log(`   ${warning()} Arquivo existe mas faltam configurações: ${missing.join(', ')}`, 'yellow');
      warnings.push(`Configurações faltando em .cursor/settings.json: ${missing.join(', ')}`);
    }
  } catch (error) {
    log(`   ${cross()} Erro ao ler arquivo: ${error.message}`, 'red');
    errors.push(`Erro ao ler .cursor/settings.json: ${error.message}`);
  }
} else {
  log(`   ${cross()} Arquivo não encontrado`, 'red');
  errors.push('.cursor/settings.json não encontrado');
}

// 2. Verificar .cursorrules ou .cursor/rules
log('\n2. Verificando regras do Cursor...', 'blue');
const cursorRulesPath = path.join(process.cwd(), '.cursorrules');
const cursorRulesDirPath = path.join(process.cwd(), '.cursor', 'rules');

if (fs.existsSync(cursorRulesPath) || fs.existsSync(cursorRulesDirPath)) {
  log(`   ${checkmark()} Arquivo de regras encontrado`, 'green');
  checks.cursorRules = true;
} else {
  log(`   ${warning()} Arquivo de regras não encontrado (opcional mas recomendado)`, 'yellow');
  warnings.push('Arquivo .cursorrules ou .cursor/rules não encontrado');
}

// 3. Verificar package.json
log('\n3. Verificando package.json...', 'blue');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verificar scripts úteis
    const usefulScripts = ['type-check', 'lint', 'test'];
    const hasScripts = usefulScripts.filter(script => packageJson.scripts?.[script]);
    
    log(`   ${checkmark()} package.json válido`, 'green');
    log(`   ${checkmark()} Scripts disponíveis: ${hasScripts.length}/${usefulScripts.length}`, 'green');
    checks.packageJson = true;
  } catch (error) {
    log(`   ${cross()} Erro ao ler package.json: ${error.message}`, 'red');
    errors.push(`Erro ao ler package.json: ${error.message}`);
  }
} else {
  log(`   ${cross()} package.json não encontrado`, 'red');
  errors.push('package.json não encontrado');
}

// 4. Verificar documentação
log('\n4. Verificando documentação...', 'blue');
const docsPath = path.join(process.cwd(), 'docs', 'CURSOR_CLAUDE_SETUP.md');
if (fs.existsSync(docsPath)) {
  log(`   ${checkmark()} Guia de configuração encontrado`, 'green');
  checks.docs = true;
} else {
  log(`   ${warning()} Guia de configuração não encontrado`, 'yellow');
  warnings.push('docs/CURSOR_CLAUDE_SETUP.md não encontrado');
}

// 5. Verificar .cursorignore
log('\n5. Verificando .cursorignore...', 'blue');
const cursorIgnorePath = path.join(process.cwd(), '.cursorignore');
if (fs.existsSync(cursorIgnorePath)) {
  try {
    const cursorIgnoreContent = fs.readFileSync(cursorIgnorePath, 'utf8');
    const importantExclusions = [
      'node_modules',
      '.expo',
      'dist',
      'build',
      'coverage'
    ];
    const hasImportantExclusions = importantExclusions.some(exclusion => 
      cursorIgnoreContent.includes(exclusion)
    );
    
    if (hasImportantExclusions) {
      log(`   ${checkmark()} Arquivo existe com exclusões importantes`, 'green');
      checks.cursorIgnore = true;
    } else {
      log(`   ${warning()} Arquivo existe mas pode estar incompleto`, 'yellow');
      warnings.push('.cursorignore pode não estar excluindo arquivos importantes');
    }
  } catch (error) {
    log(`   ${cross()} Erro ao ler arquivo: ${error.message}`, 'red');
    errors.push(`Erro ao ler .cursorignore: ${error.message}`);
  }
} else {
  log(`   ${warning()} Arquivo não encontrado (recomendado para economia de tokens)`, 'yellow');
  warnings.push('.cursorignore não encontrado - recomenda-se criar para economizar 30-50% de tokens');
}

// 6. Verificar estrutura do projeto
log('\n6. Verificando estrutura do projeto...', 'blue');
const requiredDirs = ['src', '.cursor'];
const missingDirs = requiredDirs.filter(dir => {
  const dirPath = path.join(process.cwd(), dir);
  return !fs.existsSync(dirPath);
});

if (missingDirs.length === 0) {
  log(`   ${checkmark()} Estrutura do projeto OK`, 'green');
} else {
  log(`   ${warning()} Diretórios faltando: ${missingDirs.join(', ')}`, 'yellow');
  warnings.push(`Diretórios faltando: ${missingDirs.join(', ')}`);
}

// Resumo
console.log('\n');
log('═══════════════════════════════════════════════════════════', 'cyan');
log('  Resumo da Verificação', 'cyan');
log('═══════════════════════════════════════════════════════════', 'cyan');
console.log('\n');

const allChecks = Object.values(checks);
const passedChecks = allChecks.filter(Boolean).length;
const totalChecks = allChecks.length;

log(`Verificações passadas: ${passedChecks}/${totalChecks}`, passedChecks === totalChecks ? 'green' : 'yellow');
console.log('\n');

// Mostrar erros
if (errors.length > 0) {
  log('❌ ERROS ENCONTRADOS:', 'red');
  errors.forEach((error, index) => {
    log(`   ${index + 1}. ${error}`, 'red');
  });
  console.log('\n');
}

// Mostrar avisos
if (warnings.length > 0) {
  log('⚠️  AVISOS:', 'yellow');
  warnings.forEach((warning, index) => {
    log(`   ${index + 1}. ${warning}`, 'yellow');
  });
  console.log('\n');
}

// Instruções finais
if (errors.length === 0 && warnings.length === 0) {
  log('✅ Tudo configurado corretamente!', 'green');
  console.log('\n');
  log('Próximos passos:', 'cyan');
  log('1. Configure sua API Key do Claude no Cursor (Settings > AI Models)', 'blue');
  log('2. Ative Codebase Indexing (Settings > Features)', 'blue');
  log('3. Selecione Claude Sonnet 4.5 como modelo padrão', 'blue');
  log('4. Teste o chat com Ctrl+L (ou Cmd+L no Mac)', 'blue');
  console.log('\n');
} else if (errors.length === 0) {
  log('✅ Configuração básica OK, mas há avisos', 'yellow');
  console.log('\n');
  log('Recomendações:', 'cyan');
  warnings.forEach((warning) => {
    log(`   • ${warning}`, 'yellow');
  });
  console.log('\n');
} else {
  log('❌ Há erros que precisam ser corrigidos', 'red');
  console.log('\n');
  log('Consulte docs/CURSOR_CLAUDE_SETUP.md para instruções detalhadas', 'blue');
  console.log('\n');
}

// Informações adicionais
log('═══════════════════════════════════════════════════════════', 'cyan');
log('  Informações Adicionais', 'cyan');
log('═══════════════════════════════════════════════════════════', 'cyan');
console.log('\n');

log('📚 Documentação:', 'blue');
log('   • Guia completo: docs/CURSOR_CLAUDE_SETUP.md', 'cyan');
log('   • Regras do projeto: .cursorrules', 'cyan');
log('   • Configurações: .cursor/settings.json', 'cyan');
console.log('\n');

log('🔗 Links Úteis:', 'blue');
log('   • Cursor Docs: https://docs.cursor.com', 'cyan');
log('   • Claude Console: https://console.anthropic.com', 'cyan');
log('   • Claude Settings: https://claude.ai/settings', 'cyan');
console.log('\n');

log('⚡ Atalhos do Cursor:', 'blue');
log('   • Chat: Ctrl+L (Windows/Linux) ou Cmd+L (Mac)', 'cyan');
log('   • Composer: Ctrl+Shift+I (Windows/Linux) ou Cmd+Shift+I (Mac)', 'cyan');
log('   • Settings: Ctrl+, (Windows/Linux) ou Cmd+, (Mac)', 'cyan');
console.log('\n');

// Exit code
process.exit(errors.length > 0 ? 1 : 0);

