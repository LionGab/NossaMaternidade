#!/usr/bin/env node
/**
 * Smoke Tests Completos - Edge Function /ai
 *
 * Valida:
 * - Teste 2: 200 com JWT (Claude)
 * - Teste 3: 429 rate limiting
 * - Teste 4: Gemini grounding + citations
 *
 * Uso:
 *   node scripts/test-ai-complete.mjs
 *
 * Requer .env.local com:
 *   TEST_EMAIL=teste-ai@nossamaternidade.com
 *   TEST_PASSWORD=TesteSenha123!
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

// Load .env.local
config({ path: envPath });

// Config
const SUPABASE_URL = "https://lqahkqfpynypbmhtffyi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWhrcWZweW55cGJtaHRmZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzcyMTQsImV4cCI6MjA4MTE1MzIxNH0.NBDr1-eUGnOeQIYnWOwxTBZwCzA7E7M_V88iRndajYc";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ai`;

const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

// Validation
if (!TEST_EMAIL || !TEST_PASSWORD) {
  console.error("❌ Erro: Defina TEST_EMAIL e TEST_PASSWORD em .env.local");
  console.error("   Veja: scripts/create-test-user.md\n");
  process.exit(1);
}

let authToken = null;

// ============================================
// HELPERS
// ============================================

async function getAuthToken() {
  console.log("\n🔑 Obtendo JWT...");

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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Auth falhou: ${error.msg || error.error_description}\nCrie o usuário: scripts/create-test-user.md`);
  }

  const data = await response.json();
  authToken = data.access_token;

  console.log(`   ✅ JWT obtido: ${authToken.substring(0, 25)}...${authToken.slice(-5)}`);
  console.log(`   Expires: ${data.expires_in}s\n`);

  return authToken;
}

async function callAI(payload, description = "") {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let json = null;

  try {
    json = JSON.parse(text);
  } catch {
    // Response is not JSON
  }

  return {
    status: response.status,
    text,
    json,
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// TESTES
// ============================================

async function test2_ClaudeDefault() {
  console.log("📋 TESTE 2: 200 com JWT válido (Claude padrão)\n");

  const result = await callAI({
    messages: [
      { role: "user", content: "Responda apenas 'Oi, mãe!' e nada mais." }
    ],
    provider: "claude",
  });

  const passed = result.status === 200 &&
                 result.json?.provider === "claude" &&
                 result.json?.content;

  console.log(`   Status: ${result.status}`);
  console.log(`   Provider: ${result.json?.provider}`);
  console.log(`   Content: ${result.json?.content?.substring(0, 100) || result.text.substring(0, 100)}`);
  console.log(`   Latency: ${result.json?.latency}ms`);
  console.log(`   Tokens: input=${result.json?.usage?.promptTokens}, output=${result.json?.usage?.completionTokens}, total=${result.json?.usage?.totalTokens}`);
  console.log(`   Fallback: ${result.json?.fallback || false}`);
  console.log(`\n   ${passed ? "✅ PASSOU" : "❌ FALHOU"}\n`);

  return passed;
}

async function test4_GeminiGrounding() {
  console.log("📋 TESTE 4: Gemini grounding + citations\n");

  const result = await callAI({
    messages: [
      { role: "user", content: "O que é pré-eclâmpsia? Cite fontes médicas confiáveis." }
    ],
    provider: "gemini",
    grounding: true,
  });

  const hasCitations = result.json?.grounding?.citations && result.json.grounding.citations.length > 0;
  const passed = result.status === 200 &&
                 result.json?.provider === "gemini" &&
                 hasCitations;

  console.log(`   Status: ${result.status}`);
  console.log(`   Provider: ${result.json?.provider}`);
  console.log(`   Content (primeiros 200 chars): ${result.json?.content?.substring(0, 200) || result.text.substring(0, 200)}...`);
  console.log(`   Latency: ${result.json?.latency}ms`);
  console.log(`   Citations: ${result.json?.grounding?.citations?.length || 0}`);

  if (hasCitations) {
    console.log(`\n   📚 Exemplos de citations:`);
    result.json.grounding.citations.slice(0, 3).forEach((c, i) => {
      console.log(`      ${i + 1}. ${c.title || "(sem título)"}`);
      console.log(`         ${c.url || "(sem URL)"}`);
    });
  } else {
    console.log(`   ⚠️ Grounding não retornou citations (pode ser limitação da API)`);
  }

  console.log(`\n   ${passed ? "✅ PASSOU" : "⚠️ FALHOU (grounding pode estar off)"}\n`);

  return passed;
}

async function test3_RateLimit() {
  console.log("📋 TESTE 3: 429 rate limiting (21 requests rápidos)\n");

  let successCount = 0;
  let rateLimitHit = false;
  let first429At = null;

  console.log("   Enviando requests:");

  for (let i = 1; i <= 21; i++) {
    const result = await callAI({
      messages: [{ role: "user", content: `Ping ${i}` }],
      provider: "claude",
    });

    if (result.status === 200) {
      successCount++;
      process.stdout.write(`✓`);
    } else if (result.status === 429) {
      if (!rateLimitHit) {
        first429At = i;
        rateLimitHit = true;
      }
      process.stdout.write(`✗`);
    } else {
      process.stdout.write(`?`);
    }

    // Pequeno delay para não sobrecarregar
    await sleep(50);
  }

  console.log("\n");

  const passed = successCount >= 15 && rateLimitHit;

  console.log(`   Sucessos: ${successCount}/21`);
  console.log(`   Rate limit ativou: ${rateLimitHit ? `Sim (request #${first429At})` : "Não"}`);
  console.log(`   Esperado: ~20 sucessos, depois 429`);
  console.log(`\n   ${passed ? "✅ PASSOU" : "⚠️ FALHOU (timing sensível)"}\n`);

  return passed;
}

// ============================================
// MAIN
// ============================================

async function runTests() {
  console.log("🧪 SMOKE TESTS COMPLETOS - Edge Function /ai");
  console.log("=".repeat(60));
  console.log(`Email: ${TEST_EMAIL}`);
  console.log(`Function: ${FUNCTION_URL}\n`);

  const results = {
    test2: false,
    test3: false,
    test4: false,
  };

  try {
    // Obter JWT
    await getAuthToken();

    // Executar testes
    results.test2 = await test2_ClaudeDefault();
    results.test4 = await test4_GeminiGrounding();
    results.test3 = await test3_RateLimit();

    // Aguardar rate limit resetar
    console.log("⏳ Aguardando 60s para rate limit resetar...\n");
    await sleep(60000);

    // Resumo
    console.log("=".repeat(60));
    console.log("📊 RESUMO DOS TESTES\n");

    const formatResult = (result) => {
      if (result === true) return "✅ PASSOU";
      if (result === false) return "❌ FALHOU";
      return "⏭️ PULADO";
    };

    console.log(`   Teste 2 (Claude 200):      ${formatResult(results.test2)}`);
    console.log(`   Teste 4 (Gemini grounding): ${formatResult(results.test4)}`);
    console.log(`   Teste 3 (Rate limit 429):   ${formatResult(results.test3)}\n`);

    const passedCount = Object.values(results).filter(r => r === true).length;
    const totalCount = Object.values(results).filter(r => r !== null).length;

    console.log(`   RESULTADO FINAL: ${passedCount}/${totalCount} testes passaram`);
    console.log("=".repeat(60));

    if (passedCount === totalCount) {
      console.log("\n🎉 TODOS OS TESTES PASSARAM! Edge Function está pronta para produção.\n");
      process.exit(0);
    } else {
      console.log("\n⚠️ Alguns testes falharam. Revisar logs acima.\n");
      process.exit(1);
    }

  } catch (error) {
    console.error("\n❌ ERRO CRÍTICO:", error.message);
    console.error("\n   Stack trace:");
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar
runTests();
