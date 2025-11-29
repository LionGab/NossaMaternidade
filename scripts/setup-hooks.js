#!/usr/bin/env node
/**
 * Script de Setup para Git Hooks
 * Configura husky e instala hooks necessários
 * 
 * Uso: node scripts/setup-hooks.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(process.cwd(), '.husky');

console.log('🎨 Nossa Maternidade - Setup de Git Hooks');
console.log('=========================================\n');

// Verificar se estamos em um repositório Git
function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    console.log('✅ Repositório Git detectado');
    return true;
  } catch {
    console.error('❌ Erro: Este diretório não é um repositório Git');
    console.log('💡 Execute: git init');
    return false;
  }
}

// Verificar se husky está instalado
function checkHusky() {
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  const hasHusky = packageJson.devDependencies?.husky || packageJson.dependencies?.husky;
  
  if (!hasHusky) {
    console.log('📦 Instalando husky...');
    execSync('npm install --save-dev husky', { stdio: 'inherit' });
  }
  
  console.log('✅ Husky instalado');
  return true;
}

// Inicializar husky
function initHusky() {
  console.log('\n📦 Inicializando husky...');
  
  try {
    execSync('npx husky', { stdio: 'inherit' });
    console.log('✅ Husky inicializado');
  } catch (error) {
    console.log('⚠️ Husky já pode estar inicializado');
  }
}

// Configurar hooks
function setupHooks() {
  console.log('\n🔧 Configurando hooks...\n');
  
  // Verificar se a pasta .husky existe
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }
  
  // Pre-commit hook
  const preCommitPath = path.join(HOOKS_DIR, 'pre-commit');
  if (fs.existsSync(preCommitPath)) {
    console.log('✅ Pre-commit hook já configurado');
  } else {
    console.log('⚠️ Pre-commit hook não encontrado');
    console.log('💡 Crie o arquivo .husky/pre-commit');
  }
  
  // Commit-msg hook
  const commitMsgPath = path.join(HOOKS_DIR, 'commit-msg');
  if (fs.existsSync(commitMsgPath)) {
    console.log('✅ Commit-msg hook já configurado');
  } else {
    console.log('⚠️ Commit-msg hook não encontrado');
    console.log('💡 Crie o arquivo .husky/commit-msg');
  }
  
  // Tornar hooks executáveis (Unix)
  if (process.platform !== 'win32') {
    try {
      if (fs.existsSync(preCommitPath)) {
        execSync(`chmod +x "${preCommitPath}"`, { stdio: 'pipe' });
      }
      if (fs.existsSync(commitMsgPath)) {
        execSync(`chmod +x "${commitMsgPath}"`, { stdio: 'pipe' });
      }
      console.log('✅ Permissões de execução configuradas');
    } catch {
      console.log('⚠️ Não foi possível configurar permissões');
    }
  }
}

// Verificar configuração do package.json
function checkPackageJson() {
  console.log('\n📋 Verificando package.json...\n');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Verificar script "prepare"
  if (packageJson.scripts?.prepare === 'husky') {
    console.log('✅ Script "prepare" configurado');
  } else {
    console.log('⚠️ Script "prepare" não configurado');
    console.log('💡 Adicione: "prepare": "husky"');
  }
  
  // Verificar script "precommit"
  if (packageJson.scripts?.precommit) {
    console.log('✅ Script "precommit" configurado');
  } else {
    console.log('⚠️ Script "precommit" não configurado');
    console.log('💡 Adicione: "precommit": "npm run validate:design && npm run type-check"');
  }
  
  // Verificar script "validate:design"
  if (packageJson.scripts?.['validate:design']) {
    console.log('✅ Script "validate:design" configurado');
  } else {
    console.log('⚠️ Script "validate:design" não configurado');
    console.log('💡 Adicione: "validate:design": "node scripts/validate-design-tokens.js"');
  }
}

// Testar hooks
function testHooks() {
  console.log('\n🧪 Testando validações...\n');
  
  // Testar validate:design
  console.log('📦 Testando validate:design...');
  try {
    execSync('npm run validate:design --silent', { stdio: 'pipe' });
    console.log('✅ validate:design funciona');
  } catch {
    console.log('⚠️ validate:design falhou (pode ser intencional)');
  }
  
  // Testar type-check
  console.log('📝 Testando type-check...');
  try {
    execSync('npm run type-check --silent 2>&1', { stdio: 'pipe' });
    console.log('✅ type-check funciona');
  } catch {
    console.log('⚠️ type-check falhou (pode haver erros TS)');
  }
}

// Main
function main() {
  if (!checkGitRepo()) {
    process.exit(1);
  }
  
  checkHusky();
  initHusky();
  setupHooks();
  checkPackageJson();
  testHooks();
  
  console.log('\n=========================================');
  console.log('✅ Setup completo!');
  console.log('=========================================\n');
  
  console.log('📋 Próximos passos:');
  console.log('   1. Faça um commit de teste: git commit -m "test: verificar hooks"');
  console.log('   2. O pre-commit vai validar design tokens e TypeScript');
  console.log('   3. O commit-msg vai validar o formato da mensagem\n');
  
  console.log('📖 Formatos de commit válidos:');
  console.log('   feat(home): nova funcionalidade');
  console.log('   fix(chat): correção de bug');
  console.log('   refactor(design): migrar para tokens\n');
}

main();

