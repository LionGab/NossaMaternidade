/**
 * Smoke tests para Edge Function /ai
 */

const SUPABASE_URL = "https://lqahkqfpynypbmhtffyi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWhrcWZweW55cGJtaHRmZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzcyMTQsImV4cCI6MjA4MTE1MzIxNH0.NBDr1-eUGnOeQIYnWOwxTBZwCzA7E7M_V88iRndajYc";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ai`;
const TEST_EMAIL = "teste-ai@nossamaternidade.com";
const TEST_PASSWORD = "TesteSenha123!";

let authToken = null;

async function getAuthToken() {
  console.log("\n🔑 Obtendo token de autenticação...");
  console.log("   ⚠️ Para testes completos, é necessário:");
  console.log("   1. Criar usuário no Supabase Dashboard (Authentication > Users)");
  console.log("   2. Fazer login via app mobile e capturar o access_token");
  console.log("   3. Substituir authToken no código\n");
  console.log("   ⏭️ Testes 2-5 precisam de token válido");

  // Tentar fazer login se usuário já existir
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    authToken = data.access_token;
    console.log(`   ✅ Login bem-sucedido: ${authToken.substring(0, 20)}...`);
    return authToken;
  } else {
    const error = await response.json();
    console.log(`   ❌ Login falhou: ${error.msg || error.error_description}`);
    console.log(`   → Signup pode estar desabilitado no Supabase`);
    return null;
  }
}

async function test1_NoAuth() {
  console.log("\n📋 TESTE 1: 401 sem Authorization header");
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Oi" }],
      provider: "claude",
    }),
  });

  const data = await response.json();
  const passed = response.status === 401 && data.code === 401;
  console.log(`   Status: ${response.status}`);
  console.log(`   Response: ${JSON.stringify(data)}`);
  console.log(`   ${passed ? "✅ PASSOU" : "❌ FALHOU"}`);
  return passed;
}

async function test2_ValidToken() {
  console.log("\n📋 TESTE 2: 200 com token válido + chat simples");
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Diga apenas 'Oi!' e nada mais." }],
      provider: "claude",
    }),
  });

  const data = await response.json();
  const passed = response.status === 200 && data.content && data.provider === "claude";
  console.log(`   Status: ${response.status}`);
  console.log(`   Provider: ${data.provider}`);
  console.log(`   Content: ${data.content?.substring(0, 100)}...`);
  console.log(`   Latency: ${data.latency}ms`);
  console.log(`   Tokens: ${data.usage?.totalTokens}`);
  console.log(`   ${passed ? "✅ PASSOU" : "❌ FALHOU"}`);
  return passed;
}

async function test3_RateLimit() {
  console.log("\n📋 TESTE 3: 429 rate limiting (21 requests rápidos)");
  let successCount = 0;
  let rateLimitHit = false;

  for (let i = 1; i <= 21; i++) {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: `Teste ${i}` }],
        provider: "claude",
      }),
    });

    if (response.status === 200) {
      successCount++;
    } else if (response.status === 429) {
      rateLimitHit = true;
      console.log(`   → Request ${i}: 429 Rate Limit (esperado após 20)`);
      break;
    } else {
      console.log(`   → Request ${i}: Status ${response.status} (inesperado)`);
    }

    // Pequeno delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const passed = successCount >= 15 && rateLimitHit;
  console.log(`   Sucessos: ${successCount}/21`);
  console.log(`   Rate limit ativado: ${rateLimitHit ? "Sim" : "Não"}`);
  console.log(`   ${passed ? "✅ PASSOU" : "❌ FALHOU (mas pode ser timing)"}`);
  return passed;
}

async function test4_Grounding() {
  console.log("\n📋 TESTE 4: Grounding com pergunta médica");
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "O que é pré-eclâmpsia?" }],
      provider: "gemini",
      grounding: true,
    }),
  });

  const data = await response.json();
  const hasCitations = data.grounding?.citations && data.grounding.citations.length > 0;
  const passed = response.status === 200 && data.provider === "gemini" && hasCitations;

  console.log(`   Status: ${response.status}`);
  console.log(`   Provider: ${data.provider}`);
  console.log(`   Content: ${data.content?.substring(0, 150)}...`);
  console.log(`   Citations: ${data.grounding?.citations?.length || 0}`);
  if (hasCitations) {
    console.log(`   Exemplo: ${data.grounding.citations[0].title} - ${data.grounding.citations[0].url}`);
  }
  console.log(`   ${passed ? "✅ PASSOU" : "⚠️ FALHOU (grounding pode estar indisponível)"}`);
  return passed;
}

async function test5_Fallback() {
  console.log("\n📋 TESTE 5: Fallback (simular erro Claude)");
  console.log("   ⚠️ Teste manual: não é possível simular erro Claude via API");
  console.log("   Para testar: temporariamente desabilite ANTHROPIC_API_KEY no Supabase");
  console.log("   Comando: supabase secrets unset ANTHROPIC_API_KEY");
  console.log("   ⏭️ PULADO");
  return null;
}

async function runTests() {
  console.log("🧪 SMOKE TESTS - Edge Function /ai\n");
  console.log("=".repeat(60));

  const results = {
    test1: false,
    test2: false,
    test3: false,
    test4: false,
    test5: null,
  };

  try {
    // Teste 1: Não precisa de auth
    results.test1 = await test1_NoAuth();

    // Obter token para os demais testes
    await getAuthToken();

    // Testes 2-5 (apenas se tiver token)
    if (authToken) {
      results.test2 = await test2_ValidToken();
      results.test3 = await test3_RateLimit();
      results.test4 = await test4_Grounding();
      results.test5 = await test5_Fallback();
    } else {
      console.log("\n⚠️ Sem token de autenticação - Testes 2-5 pulados");
      results.test2 = null;
      results.test3 = null;
      results.test4 = null;
    }

    // Resumo
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMO DOS TESTES\n");

    function formatResult(result) {
      if (result === true) return "✅ PASSOU";
      if (result === false) return "❌ FALHOU";
      return "⏭️ PULADO";
    }

    console.log(`   Teste 1 (401 sem auth):     ${formatResult(results.test1)}`);
    console.log(`   Teste 2 (200 com token):    ${formatResult(results.test2)}`);
    console.log(`   Teste 3 (429 rate limit):   ${formatResult(results.test3)}`);
    console.log(`   Teste 4 (grounding):        ${formatResult(results.test4)}`);
    console.log(`   Teste 5 (fallback):         ${formatResult(results.test5)}\n`);

    const passedCount = Object.values(results).filter(r => r === true).length;
    const totalCount = Object.values(results).filter(r => r !== null).length;

    console.log(`   RESULTADO FINAL: ${passedCount}/${totalCount} testes passaram`);
    console.log("=".repeat(60));

    // Limpeza: aguardar 60s para rate limit resetar
    if (!results.test3) {
      console.log("\n⏳ Aguardando 60s para rate limit resetar...");
      await new Promise(resolve => setTimeout(resolve, 60000));
    }

  } catch (error) {
    console.error("\n❌ ERRO CRÍTICO:", error.message);
    process.exit(1);
  }
}

// Executar
runTests();
