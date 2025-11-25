/**
 * Script para validar se o arquivo .env está configurado corretamente
 * Execute: node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

const requiredVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL',
  'EXPO_PUBLIC_GEMINI_API_KEY',
];

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'CLAUDE_API_KEY',
  'OPENAI_API_KEY',
  'PERPLEXITY_API_KEY',
  'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_SENTRY_DSN',
  'EXPO_PUBLIC_ONESIGNAL_APP_ID',
];

function validateEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  
  console.log('🔍 Validando arquivo .env...\n');
  
  // Verificar se arquivo existe
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado!');
    console.log('\n💡 Execute um dos scripts para criar:');
    console.log('   - Windows: create-env.bat');
    console.log('   - Linux/Mac: bash create-env.sh');
    process.exit(1);
  }
  
  // Ler arquivo .env
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  // Parse básico do .env
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  let hasErrors = false;
  const missing = [];
  const empty = [];
  
  // Validar variáveis obrigatórias
  console.log('📋 Variáveis Obrigatórias:');
  requiredVars.forEach((varName) => {
    const value = envVars[varName];
    if (!value) {
      missing.push(varName);
      console.log(`   ❌ ${varName} - FALTANDO`);
      hasErrors = true;
    } else if (value === '' || value.includes('sua_') || value.includes('aqui')) {
      empty.push(varName);
      console.log(`   ⚠️  ${varName} - NÃO CONFIGURADO (placeholder)`);
      hasErrors = true;
    } else {
      // Mascarar valor para segurança
      const masked = value.length > 20 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : '***';
      console.log(`   ✅ ${varName} - ${masked}`);
    }
  });
  
  // Validar variáveis opcionais
  console.log('\n📋 Variáveis Opcionais:');
  optionalVars.forEach((varName) => {
    const value = envVars[varName];
    if (!value || value === '') {
      console.log(`   ⚪ ${varName} - Não configurado (opcional)`);
    } else if (value.includes('sua_') || value.includes('aqui')) {
      console.log(`   ⚠️  ${varName} - Placeholder encontrado`);
    } else {
      const masked = value.length > 20 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : '***';
      console.log(`   ✅ ${varName} - ${masked}`);
    }
  });
  
  // Resultado final
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ VALIDAÇÃO FALHOU\n');
    if (missing.length > 0) {
      console.log('Variáveis faltando:');
      missing.forEach((v) => console.log(`   - ${v}`));
    }
    if (empty.length > 0) {
      console.log('\nVariáveis não configuradas (ainda com placeholders):');
      empty.forEach((v) => console.log(`   - ${v}`));
    }
    console.log('\n💡 Configure as variáveis faltantes no arquivo .env');
    process.exit(1);
  } else {
    console.log('✅ VALIDAÇÃO PASSOU - Arquivo .env está configurado corretamente!\n');
    console.log('💡 Próximo passo: Aplicar schema SQL no Supabase');
    console.log('   Veja: APLICAR_SCHEMA_SUPABASE.md');
    process.exit(0);
  }
}

// Executar validação
validateEnv();

