#!/usr/bin/env node
/**
 * Script de Validação de Variáveis de Ambiente
 * Verifica se todas as variáveis necessárias estão configuradas
 * 
 * Uso: npm run validate:env
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Variáveis obrigatórias
const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'GEMINI_API_KEY',
];

// Variáveis opcionais (mas recomendadas para produção)
const OPTIONAL_VARS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'SENTRY_DSN',
  'EXPO_PUBLIC_API_URL',
];

// Variáveis para deploy
const DEPLOY_VARS = [
  'APPLE_ID',
  'GOOGLE_PLAY_SERVICE_ACCOUNT_JSON',
];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ Arquivo .env não encontrado', 'red');
    log('', 'reset');
    log('📝 Crie o arquivo .env com:', 'cyan');
    log('   1. Copie .env.example para .env', 'cyan');
    log('   2. Preencha as variáveis necessárias', 'cyan');
    log('   3. Execute novamente: npm run validate:env', 'cyan');
    log('', 'reset');
    log('📚 Guias de setup:', 'cyan');
    log('   - Supabase: docs/SUPABASE_SETUP.md', 'cyan');
    log('   - Gemini: docs/GEMINI_SETUP.md', 'cyan');
    process.exit(1);
  }
  
  return true;
}

function loadEnv() {
  try {
    require('dotenv').config();
    return true;
  } catch (error) {
    log('❌ Erro ao carregar .env:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

function validateRequiredVars() {
  const missing = [];
  const invalid = [];
  
  REQUIRED_VARS.forEach(varName => {
    const value = process.env[varName];
    
    if (!value) {
      missing.push(varName);
    } else if (value.includes('your-') || value.includes('xxx')) {
      invalid.push(varName);
    }
  });
  
  return { missing, invalid };
}

function validateOptionalVars() {
  const missing = [];
  
  OPTIONAL_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  return missing;
}

function validateDeployVars() {
  const missing = [];
  
  DEPLOY_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  return missing;
}

function validateSupabaseUrl() {
  const url = process.env.SUPABASE_URL;
  
  if (!url) return { valid: false, message: 'Não configurado' };
  
  if (!url.startsWith('https://')) {
    return { valid: false, message: 'Deve começar com https://' };
  }
  
  if (!url.includes('.supabase.co')) {
    return { valid: false, message: 'Deve ser um domínio Supabase (.supabase.co)' };
  }
  
  return { valid: true, message: 'OK' };
}

function validateApiKeys() {
  const results = {};
  
  // Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.startsWith('AIza')) {
    results.gemini = { valid: true, message: 'OK' };
  } else if (geminiKey) {
    results.gemini = { valid: false, message: 'Formato inválido (deve começar com AIza)' };
  } else {
    results.gemini = { valid: false, message: 'Não configurado' };
  }
  
  // OpenAI (opcional)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.startsWith('sk-')) {
    results.openai = { valid: true, message: 'OK' };
  } else if (openaiKey) {
    results.openai = { valid: false, message: 'Formato inválido (deve começar com sk-)' };
  }
  
  // Anthropic (opcional)
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey && anthropicKey.startsWith('sk-ant-')) {
    results.anthropic = { valid: true, message: 'OK' };
  } else if (anthropicKey) {
    results.anthropic = { valid: false, message: 'Formato inválido (deve começar com sk-ant-)' };
  }
  
  return results;
}

function main() {
  log('', 'reset');
  log('🔍 Nossa Maternidade - Validação de Variáveis de Ambiente', 'cyan');
  log('', 'reset');
  
  // 1. Verificar se .env existe
  if (!validateEnvFile()) {
    return;
  }
  
  // 2. Carregar .env
  if (!loadEnv()) {
    return;
  }
  
  log('✅ Arquivo .env encontrado', 'green');
  log('', 'reset');
  
  // 3. Validar variáveis obrigatórias
  log('📋 Validando variáveis obrigatórias...', 'cyan');
  const { missing, invalid } = validateRequiredVars();
  
  if (missing.length > 0) {
    log('', 'reset');
    log('❌ Variáveis obrigatórias faltando:', 'red');
    missing.forEach(v => log(`   - ${v}`, 'red'));
    log('', 'reset');
    log('📚 Consulte os guias:', 'cyan');
    log('   - docs/SUPABASE_SETUP.md', 'cyan');
    log('   - docs/GEMINI_SETUP.md', 'cyan');
    process.exit(1);
  }
  
  if (invalid.length > 0) {
    log('', 'reset');
    log('⚠️  Variáveis com valores de exemplo (não configuradas):', 'yellow');
    invalid.forEach(v => log(`   - ${v}`, 'yellow'));
    log('', 'reset');
    log('Por favor, preencha com valores reais.', 'yellow');
    process.exit(1);
  }
  
  log('✅ Todas as variáveis obrigatórias configuradas', 'green');
  log('', 'reset');
  
  // 4. Validar Supabase URL
  log('🔗 Validando Supabase URL...', 'cyan');
  const supabaseValidation = validateSupabaseUrl();
  if (supabaseValidation.valid) {
    log(`✅ Supabase URL: ${supabaseValidation.message}`, 'green');
  } else {
    log(`❌ Supabase URL: ${supabaseValidation.message}`, 'red');
    process.exit(1);
  }
  log('', 'reset');
  
  // 5. Validar API Keys
  log('🔑 Validando API Keys...', 'cyan');
  const apiKeyValidation = validateApiKeys();
  
  Object.entries(apiKeyValidation).forEach(([provider, result]) => {
    const icon = result.valid ? '✅' : '❌';
    const color = result.valid ? 'green' : 'red';
    log(`${icon} ${provider}: ${result.message}`, color);
  });
  log('', 'reset');
  
  // 6. Variáveis opcionais
  const missingOptional = validateOptionalVars();
  if (missingOptional.length > 0) {
    log('⚠️  Variáveis opcionais faltando:', 'yellow');
    missingOptional.forEach(v => log(`   - ${v}`, 'yellow'));
    log('', 'reset');
    log('Essas variáveis são recomendadas para produção.', 'yellow');
    log('', 'reset');
  }
  
  // 7. Variáveis de deploy
  const missingDeploy = validateDeployVars();
  if (missingDeploy.length > 0) {
    log('ℹ️  Variáveis de deploy faltando (necessárias para publicação):', 'cyan');
    missingDeploy.forEach(v => log(`   - ${v}`, 'cyan'));
    log('', 'reset');
  }
  
  // 8. Resumo
  log('✅ Validação concluída com sucesso!', 'green');
  log('', 'reset');
  log('📝 Próximos passos:', 'cyan');
  log('   1. npm run test:connection (testar conexão com Supabase)', 'cyan');
  log('   2. npm run type-check (validar TypeScript)', 'cyan');
  log('   3. npm start (iniciar desenvolvimento)', 'cyan');
  log('', 'reset');
}

main();
