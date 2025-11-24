#!/usr/bin/env node

/**
 * ============================================
 * NOSSA MATERNIDADE - APLICAR SCHEMA SQL VIA HTTP
 * ============================================
 *
 * Script para aplicar schema SQL via Supabase API (sem conexão direta PostgreSQL)
 *
 * Uso:
 *   node scripts/apply-schema-http.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter o diretório do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Carregar variáveis de ambiente
const envPath = join(PROJECT_ROOT, '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const SUPABASE_URL = envVars.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_URL ou SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║   NOSSA MATERNIDADE - APLICAR SCHEMA VIA HTTP        ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log(`📍 URL Supabase: ${SUPABASE_URL}`);
console.log(`📍 Project Ref: ${PROJECT_REF}\n`);

// Ler os arquivos SQL
const schemaPath = join(PROJECT_ROOT, 'supabase', 'schema.sql');
const seedPath = join(PROJECT_ROOT, 'supabase', 'seed.sql');

const schemaSQL = readFileSync(schemaPath, 'utf-8');
const seedSQL = readFileSync(seedPath, 'utf-8');

console.log(`✅ Schema SQL carregado: ${schemaSQL.length} caracteres`);
console.log(`✅ Seed SQL carregado: ${seedSQL.length} caracteres\n`);

/**
 * Tenta aplicar o SQL usando diferentes métodos HTTP
 */
async function tryHttpMethods() {
  console.log('🔍 Tentando diferentes métodos HTTP para aplicar o SQL...\n');

  // Método 1: Supabase Edge Function (se existir)
  console.log('📡 Método 1: Verificando Edge Functions...');
  try {
    const functionsUrl = `${SUPABASE_URL}/functions/v1/execute-sql`;
    const response = await fetch(functionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql: schemaSQL })
    });

    if (response.ok) {
      console.log('✅ Schema aplicado via Edge Function!\n');
      return true;
    }
  } catch (error) {
    console.log('⚠️ Edge Function não disponível\n');
  }

  // Método 2: Usar a REST API para criar tabelas individualmente
  console.log('📡 Método 2: Criando tabelas via REST API (limitado)...\n');

  // A REST API do Supabase não permite criar tabelas, apenas manipular dados
  console.log('⚠️ REST API não suporta DDL (CREATE TABLE)\n');

  // Método 3: Supabase Management API
  console.log('📡 Método 3: Usando Supabase Management API...\n');

  try {
    // A Management API requer um Personal Access Token diferente
    // Que deve ser gerado em: https://supabase.com/dashboard/account/tokens
    console.log('⚠️ Management API requer Personal Access Token (não service_role_key)\n');
  } catch (error) {
    console.log('⚠️ Management API não disponível\n');
  }

  return false;
}

/**
 * Criar um guia interativo para o usuário
 */
function showInteractiveGuide() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   ℹ️  COMO APLICAR O SCHEMA MANUALMENTE               ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('🔐 OPÇÃO 1: Via Supabase Dashboard (RECOMENDADO)\n');
  console.log('   1. Acesse: https://supabase.com/dashboard/project/' + PROJECT_REF);
  console.log('   2. Clique em "SQL Editor" no menu lateral');
  console.log('   3. Clique em "New query"');
  console.log('   4. Cole o conteúdo de: supabase/schema.sql');
  console.log('   5. Clique em "Run" ou pressione Ctrl+Enter');
  console.log('   6. Repita com: supabase/seed.sql\n');

  console.log('🖥️  OPÇÃO 2: Via Supabase CLI\n');
  console.log('   1. Instale o Supabase CLI:');
  console.log('      npm install -g supabase');
  console.log('   2. Faça login:');
  console.log('      supabase login');
  console.log('   3. Link com o projeto:');
  console.log('      supabase link --project-ref ' + PROJECT_REF);
  console.log('   4. Aplique as migrations:');
  console.log('      supabase db push');
  console.log('   5. Ou execute diretamente:');
  console.log('      supabase db execute --file supabase/schema.sql');
  console.log('      supabase db execute --file supabase/seed.sql\n');

  console.log('📋 OPÇÃO 3: Copiar SQL para clipboard\n');
  console.log('   O SQL está disponível em:');
  console.log('   - Schema: ' + join(PROJECT_ROOT, 'supabase', 'schema.sql'));
  console.log('   - Seed:   ' + join(PROJECT_ROOT, 'supabase', 'seed.sql') + '\n');

  console.log('⚡ OPÇÃO 4: Criar Edge Function (Avançado)\n');
  console.log('   1. Criar função em: supabase/functions/execute-sql/index.ts');
  console.log('   2. Deploy: supabase functions deploy execute-sql');
  console.log('   3. Usar esta função para executar SQL via HTTP\n');

  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   💡 POR QUE NÃO FUNCIONA AUTOMATICAMENTE?           ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('A Supabase não fornece um endpoint HTTP público para executar');
  console.log('SQL arbitrário por questões de segurança. As opções são:\n');
  console.log('• Conexão direta PostgreSQL (bloqueada por firewall/VPN)');
  console.log('• Supabase CLI (requer autenticação interativa)');
  console.log('• SQL Editor no dashboard (manual mas seguro)');
  console.log('• Edge Functions (requer setup adicional)\n');
}

/**
 * Gerar comando pronto para copiar
 */
function generateReadyCommands() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   📝 COMANDOS PRONTOS PARA COPIAR                     ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('# Instalar Supabase CLI (executar uma vez)');
  console.log('npm install -g supabase\n');

  console.log('# Fazer login no Supabase (executar uma vez)');
  console.log('supabase login\n');

  console.log('# Link com o projeto (executar uma vez)');
  console.log('supabase link --project-ref ' + PROJECT_REF + '\n');

  console.log('# Aplicar schema');
  console.log('supabase db execute --file supabase/schema.sql\n');

  console.log('# Aplicar seed');
  console.log('supabase db execute --file supabase/seed.sql\n');

  console.log('# OU aplicar ambos de uma vez');
  console.log('supabase db push\n');

  console.log('# Verificar status');
  console.log('supabase db diff\n');
}

/**
 * Verificar se Supabase CLI está instalado
 */
async function checkSupabaseCLI() {
  console.log('🔍 Verificando se Supabase CLI está instalado...\n');

  try {
    const { execSync } = await import('child_process');

    try {
      const version = execSync('supabase --version', { encoding: 'utf-8' });
      console.log('✅ Supabase CLI encontrado:', version.trim());

      console.log('\n💡 Você pode executar agora:\n');
      console.log('   supabase db execute --file supabase/schema.sql');
      console.log('   supabase db execute --file supabase/seed.sql\n');

      return true;
    } catch (error) {
      console.log('⚠️ Supabase CLI não está instalado\n');
      console.log('📦 Para instalar, execute:');
      console.log('   npm install -g supabase\n');

      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const httpSuccess = await tryHttpMethods();

  if (!httpSuccess) {
    console.log('\n⚠️ Não foi possível aplicar o schema automaticamente via HTTP\n');

    await checkSupabaseCLI();

    showInteractiveGuide();
    generateReadyCommands();

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║   ✨ RECOMENDAÇÃO                                     ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('Use a OPÇÃO 1 (Dashboard) se você quer algo rápido e visual');
    console.log('Use a OPÇÃO 2 (CLI) se você quer automatizar no futuro\n');

    console.log('📌 Links úteis:');
    console.log('   • Dashboard: https://supabase.com/dashboard/project/' + PROJECT_REF);
    console.log('   • SQL Editor: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql');
    console.log('   • Docs CLI: https://supabase.com/docs/guides/cli\n');
  }
}

main();
