/**
 * Script para testar conexão básica com Supabase e Gemini
 * Execute: node scripts/test-connection.js
 */

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const geminiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

console.log('\n🔍 Testando Configuração do Projeto...\n');
console.log('='.repeat(50));

// Validar variáveis de ambiente
console.log('\n1️⃣ Validando Variáveis de Ambiente:');
let hasErrors = false;

if (!supabaseUrl) {
  console.log('   ❌ EXPO_PUBLIC_SUPABASE_URL não configurada');
  hasErrors = true;
} else {
  console.log(`   ✅ EXPO_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
}

if (!supabaseAnonKey) {
  console.log('   ❌ EXPO_PUBLIC_SUPABASE_ANON_KEY não configurada');
  hasErrors = true;
} else {
  console.log(`   ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`);
}

if (!geminiKey) {
  console.log('   ⚠️  EXPO_PUBLIC_GEMINI_API_KEY não configurada (opcional para alguns testes)');
} else {
  console.log(`   ✅ EXPO_PUBLIC_GEMINI_API_KEY: ${geminiKey.substring(0, 20)}...`);
}

if (hasErrors) {
  console.log('\n❌ Erro: Configure as variáveis de ambiente no arquivo .env');
  console.log('   Execute: npm run validate:env');
  process.exit(1);
}

// Testar conexão Supabase
async function testSupabase() {
  console.log('\n2️⃣ Testando Conexão com Supabase:');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testar query simples
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      // Se erro for "relation does not exist", schema não foi aplicado
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        console.log('   ⚠️  Tabelas não encontradas - Schema SQL não aplicado');
        console.log('   💡 Aplique o schema: Veja APLICAR_SCHEMA_SUPABASE.md');
        return false;
      }
      
      console.log(`   ❌ Erro: ${error.message}`);
      return false;
    }
    
    console.log('   ✅ Conexão estabelecida com sucesso!');
    console.log('   ✅ Schema aplicado corretamente');
    return true;
  } catch (error) {
    console.log(`   ❌ Erro inesperado: ${error.message}`);
    return false;
  }
}

// Testar Gemini API (se configurado)
async function testGemini() {
  if (!geminiKey) {
    console.log('\n3️⃣ Testando Gemini API:');
    console.log('   ⚪ Pulado (chave não configurada)');
    return true;
  }
  
  console.log('\n3️⃣ Testando Gemini API:');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Responda apenas: OK'
            }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.log(`   ❌ Erro: ${error.error?.message || 'Chave inválida'}`);
      return false;
    }
    
    console.log('   ✅ Gemini API funcionando corretamente!');
    return true;
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    return false;
  }
}

// Testar Cloud Run Backend
async function testCloudRun() {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://copy-of-nossa-maternidade0555-854690283424.us-west1.run.app';

  console.log('\n4️⃣ Testando Cloud Run Backend:');
  console.log(`   📍 URL: ${backendUrl}`);

  try {
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      console.log('   ✅ Cloud Run Backend está online!');
      return true;
    } else {
      console.log(`   ⚠️  Cloud Run retornou status ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('   ⚠️  Timeout - Backend pode estar em cold start');
    } else {
      console.log(`   ⚠️  Cloud Run não acessível: ${error.message}`);
    }
    console.log('   💡 O app funciona em modo offline/mock se o backend não estiver disponível');
    return false;
  }
}

// Executar todos os testes
async function runTests() {
  const supabaseOk = await testSupabase();
  const geminiOk = await testGemini();
  const cloudRunOk = await testCloudRun();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Resumo dos Testes:\n');

  // Cloud Run é opcional para desenvolvimento local
  if (supabaseOk && geminiOk) {
    console.log('✅ Testes principais passaram!');
    if (cloudRunOk) {
      console.log('✅ Cloud Run Backend disponível');
    } else {
      console.log('⚪ Cloud Run não verificado (opcional em dev)');
    }
    console.log('🎉 O projeto está configurado corretamente!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Alguns testes falharam:');
    if (!supabaseOk) {
      console.log('   - Supabase: Verifique conexão e schema SQL');
    }
    if (!geminiOk && geminiKey) {
      console.log('   - Gemini: Verifique chave API');
    }
    console.log('\n💡 Veja os guias:');
    console.log('   - APLICAR_SCHEMA_SUPABASE.md');
    console.log('   - docs/ENV_SETUP_MVP.md\n');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});

