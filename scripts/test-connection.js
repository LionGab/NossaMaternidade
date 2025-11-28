#!/usr/bin/env node
/**
 * Script de Teste de Conexão
 * Testa conexão com Supabase e APIs de IA
 * 
 * Uso: npm run test:connection
 */

const https = require('https');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnv() {
  try {
    require('dotenv').config();
    return true;
  } catch (error) {
    log('❌ Erro ao carregar .env:', 'red');
    log(`   ${error.message}`, 'red');
    log('', 'reset');
    log('Execute primeiro: npm run validate:env', 'cyan');
    return false;
  }
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testSupabase() {
  log('🔗 Testando Supabase...', 'cyan');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    log('❌ Credenciais Supabase não configuradas', 'red');
    return false;
  }
  
  try {
    // Testar ping básico
    const startTime = Date.now();
    const response = await httpsGet(`${supabaseUrl}/rest/v1/`, {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    });
    const latency = Date.now() - startTime;
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      log(`✅ Supabase connection: OK (${latency}ms)`, 'green');
      return true;
    } else {
      log(`❌ Supabase connection: HTTP ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Supabase connection: ${error.message}`, 'red');
    return false;
  }
}

async function testGemini() {
  log('🤖 Testando Google Gemini...', 'cyan');
  
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    log('⚠️  Gemini API key não configurada', 'yellow');
    return false;
  }
  
  try {
    const startTime = Date.now();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`;
    const response = await httpsGet(url);
    const latency = Date.now() - startTime;
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      const models = data.models || [];
      const flashModel = models.find(m => m.name.includes('flash'));
      
      log(`✅ Gemini API: OK (${latency}ms)`, 'green');
      if (flashModel) {
        log(`   - Model available: ${flashModel.name}`, 'green');
      }
      return true;
    } else {
      log(`❌ Gemini API: HTTP ${response.statusCode}`, 'red');
      if (response.statusCode === 403) {
        log('   Verifique se a API key está correta', 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Gemini API: ${error.message}`, 'red');
    return false;
  }
}

async function testOpenAI() {
  log('🧠 Testando OpenAI (opcional)...', 'cyan');
  
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    log('ℹ️  OpenAI API key não configurada (opcional)', 'yellow');
    return true; // Not required
  }
  
  try {
    const startTime = Date.now();
    const response = await httpsGet('https://api.openai.com/v1/models', {
      'Authorization': `Bearer ${openaiKey}`,
    });
    const latency = Date.now() - startTime;
    
    if (response.statusCode === 200) {
      log(`✅ OpenAI API: OK (${latency}ms)`, 'green');
      return true;
    } else {
      log(`⚠️  OpenAI API: HTTP ${response.statusCode}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`⚠️  OpenAI API: ${error.message}`, 'yellow');
    return false;
  }
}

async function testAnthropic() {
  log('🧩 Testando Anthropic Claude (opcional)...', 'cyan');
  
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  
  if (!anthropicKey) {
    log('ℹ️  Anthropic API key não configurada (opcional)', 'yellow');
    return true; // Not required
  }
  
  // Anthropic doesn't have a simple ping endpoint, so just validate key format
  if (anthropicKey.startsWith('sk-ant-')) {
    log('✅ Anthropic API key format: OK', 'green');
    return true;
  } else {
    log('⚠️  Anthropic API key format: Inválido', 'yellow');
    return false;
  }
}

async function main() {
  log('', 'reset');
  log('🔍 Nossa Maternidade - Teste de Conexões', 'cyan');
  log('', 'reset');
  
  if (!loadEnv()) {
    process.exit(1);
  }
  
  const results = {
    supabase: await testSupabase(),
    gemini: await testGemini(),
    openai: await testOpenAI(),
    anthropic: await testAnthropic(),
  };
  
  log('', 'reset');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('📊 Resumo dos Testes', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('', 'reset');
  
  // Required
  log('Obrigatórios:', 'cyan');
  log(`   Supabase:  ${results.supabase ? '✅' : '❌'}`, results.supabase ? 'green' : 'red');
  log(`   Gemini:    ${results.gemini ? '✅' : '❌'}`, results.gemini ? 'green' : 'red');
  
  // Optional
  log('', 'reset');
  log('Opcionais (Fallback):', 'cyan');
  log(`   OpenAI:    ${results.openai ? '✅' : '⚠️'}`, results.openai ? 'green' : 'yellow');
  log(`   Claude:    ${results.anthropic ? '✅' : '⚠️'}`, results.anthropic ? 'green' : 'yellow');
  
  log('', 'reset');
  
  const requiredPassed = results.supabase && results.gemini;
  
  if (requiredPassed) {
    log('✅ Todos os testes obrigatórios passaram!', 'green');
    log('', 'reset');
    log('📝 Próximos passos:', 'cyan');
    log('   1. npm start (iniciar desenvolvimento)', 'cyan');
    log('   2. npm run type-check (validar TypeScript)', 'cyan');
    log('   3. npm test (executar testes)', 'cyan');
    log('', 'reset');
    process.exit(0);
  } else {
    log('❌ Alguns testes obrigatórios falharam', 'red');
    log('', 'reset');
    log('📚 Consulte os guias:', 'cyan');
    if (!results.supabase) {
      log('   - docs/SUPABASE_SETUP.md', 'cyan');
    }
    if (!results.gemini) {
      log('   - docs/GEMINI_SETUP.md', 'cyan');
    }
    log('', 'reset');
    process.exit(1);
  }
}

main();
