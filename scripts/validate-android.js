#!/usr/bin/env node

/**
 * Script de Validação Pré-Build Android
 * Valida configuração, assets e variáveis de ambiente antes do build
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let hasErrors = false;
let hasWarnings = false;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  hasErrors = true;
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
  hasWarnings = true;
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

// Verificar tamanho de imagem
function checkImageSize(filePath, minWidth, minHeight) {
  if (!fileExists(filePath)) {
    return false;
  }
  // Nota: Para validação real de dimensões, seria necessário usar uma lib como 'sharp'
  // Por enquanto, apenas verificamos se o arquivo existe
  return true;
}

// Validar variáveis de ambiente
function validateEnvVars() {
  info('Validando variáveis de ambiente...');
  
  require('dotenv').config();
  
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const optionalVars = [
    'EXPO_PUBLIC_GEMINI_API_KEY',
    'EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL',
    'EAS_PROJECT_ID',
  ];
  
  let missingRequired = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingRequired.push(varName);
    } else {
      success(`${varName} configurado`);
    }
  });
  
  if (missingRequired.length > 0) {
    error(`Variáveis obrigatórias faltando: ${missingRequired.join(', ')}`);
  }
  
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      warning(`${varName} não configurado (opcional)`);
    } else {
      success(`${varName} configurado`);
    }
  });
}

// Validar configuração do app
function validateAppConfig() {
  info('Validando app.config.js...');
  
  try {
    const appConfig = require('../app.config.js');
    const { expo } = appConfig;
    
    // Validar Android config
    if (!expo.android) {
      error('Configuração Android não encontrada em app.config.js');
      return;
    }
    
    const android = expo.android;
    
    // Validar package name
    if (!android.package || !android.package.match(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/)) {
      error('Package name Android inválido ou ausente');
    } else {
      success(`Package: ${android.package}`);
    }
    
    // Validar versionCode
    if (!android.versionCode || android.versionCode < 1) {
      warning('versionCode não configurado ou inválido (será auto-incrementado pelo EAS)');
    } else {
      success(`Version Code: ${android.versionCode}`);
    }
    
    // Validar ícone
    if (!android.icon || !fileExists(android.icon)) {
      error(`Ícone Android não encontrado: ${android.icon}`);
    } else {
      success(`Ícone: ${android.icon}`);
    }
    
    // Validar adaptive icon
    if (!android.adaptiveIcon || !android.adaptiveIcon.foregroundImage) {
      warning('Adaptive icon não configurado');
    } else if (!fileExists(android.adaptiveIcon.foregroundImage)) {
      error(`Adaptive icon não encontrado: ${android.adaptiveIcon.foregroundImage}`);
    } else {
      success(`Adaptive Icon: ${android.adaptiveIcon.foregroundImage}`);
    }
    
    // Validar splash screen
    if (!android.splash || !android.splash.image) {
      warning('Splash screen Android não configurado');
    } else if (!fileExists(android.splash.image)) {
      error(`Splash screen não encontrado: ${android.splash.image}`);
    } else {
      success(`Splash Screen: ${android.splash.image}`);
    }
    
    // Validar deep links
    if (android.intentFilters && android.intentFilters.length > 0) {
      const hasValidDeepLink = android.intentFilters.some(filter => 
        filter.data && filter.data.some(d => d.host === 'nossamaternidade.com.br')
      );
      if (hasValidDeepLink) {
        success('Deep links configurados para nossamaternidade.com.br');
      } else {
        warning('Deep links configurados mas host não é nossamaternidade.com.br');
      }
    } else {
      warning('Deep links não configurados');
    }
    
  } catch (err) {
    error(`Erro ao ler app.config.js: ${err.message}`);
  }
}

// Validar assets
function validateAssets() {
  info('Validando assets Android...');
  
  const assetsDir = path.resolve('assets');
  
  if (!fs.existsSync(assetsDir)) {
    error('Diretório assets não encontrado');
    return;
  }
  
  // Verificar ícones
  const iconPath = path.join(assetsDir, 'icon.png');
  if (!fileExists(iconPath)) {
    error('assets/icon.png não encontrado');
  } else {
    success('assets/icon.png existe');
  }
  
  const adaptiveIconPath = path.join(assetsDir, 'adaptive-icon.png');
  if (!fileExists(adaptiveIconPath)) {
    warning('assets/adaptive-icon.png não encontrado (recomendado)');
  } else {
    success('assets/adaptive-icon.png existe');
  }
  
  const splashPath = path.join(assetsDir, 'splash.png');
  if (!fileExists(splashPath)) {
    warning('assets/splash.png não encontrado');
  } else {
    success('assets/splash.png existe');
  }
  
  const notificationIconPath = path.join(assetsDir, 'notification-icon.png');
  if (!fileExists(notificationIconPath)) {
    warning('assets/notification-icon.png não encontrado');
  } else {
    success('assets/notification-icon.png existe');
  }
}

// Validar EAS config
function validateEASConfig() {
  info('Validando eas.json...');
  
  if (!fileExists('eas.json')) {
    error('eas.json não encontrado');
    return;
  }
  
  try {
    const easConfig = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
    
    if (!easConfig.build || !easConfig.build.production) {
      error('Perfil de produção não encontrado em eas.json');
      return;
    }
    
    const production = easConfig.build.production;
    
    if (!production.android) {
      error('Configuração Android de produção não encontrada');
      return;
    }
    
    const android = production.android;
    
    if (android.buildType !== 'app-bundle') {
      warning('buildType não é "app-bundle" (recomendado para Google Play)');
    } else {
      success('buildType: app-bundle');
    }
    
    if (android.autoIncrement) {
      success('autoIncrement habilitado');
    } else {
      warning('autoIncrement não habilitado (recomendado)');
    }
    
    // Validar submit config
    if (easConfig.submit && easConfig.submit.production && easConfig.submit.production.android) {
      const submit = easConfig.submit.production.android;
      
      if (!submit.serviceAccountKeyPath) {
        warning('serviceAccountKeyPath não configurado (submit automático não funcionará)');
      } else if (!fileExists(submit.serviceAccountKeyPath)) {
        warning(`Service account key não encontrado: ${submit.serviceAccountKeyPath}`);
        info('  Para criar: https://play.google.com/console/developers -> API access');
      } else {
        success('Service account key encontrado');
      }
      
      if (submit.track) {
        success(`Track: ${submit.track}`);
      }
    } else {
      warning('Configuração de submit não encontrada');
    }
    
  } catch (err) {
    error(`Erro ao ler eas.json: ${err.message}`);
  }
}

// Validar package.json
function validatePackageJson() {
  info('Validando package.json...');
  
  if (!fileExists('package.json')) {
    error('package.json não encontrado');
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!pkg.scripts || !pkg.scripts['build:android']) {
      warning('Script build:android não encontrado em package.json');
    } else {
      success('Script build:android encontrado');
    }
    
    if (!pkg.scripts || !pkg.scripts['submit:android']) {
      warning('Script submit:android não encontrado em package.json');
    } else {
      success('Script submit:android encontrado');
    }
    
  } catch (err) {
    error(`Erro ao ler package.json: ${err.message}`);
  }
}

// Main
function main() {
  log('\n🔍 Validação Pré-Build Android\n', 'blue');
  
  validateEnvVars();
  log('');
  
  validateAppConfig();
  log('');
  
  validateAssets();
  log('');
  
  validateEASConfig();
  log('');
  
  validatePackageJson();
  log('');
  
  // Resumo
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  if (hasErrors) {
    log('❌ Validação falhou! Corrija os erros antes de fazer build.', 'red');
    process.exit(1);
  } else if (hasWarnings) {
    log('⚠️  Validação concluída com avisos. Verifique antes de fazer build.', 'yellow');
    process.exit(0);
  } else {
    log('✅ Validação concluída com sucesso! Pronto para build.', 'green');
    process.exit(0);
  }
}

main();

