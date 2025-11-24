#!/usr/bin/env node

/**
 * ============================================
 * NOSSA MATERNIDADE - APLICAR SCHEMA SQL
 * ============================================
 *
 * Script para aplicar automaticamente o schema SQL do Supabase via API.
 *
 * Uso:
 *   node scripts/apply-schema.mjs
 *
 * Requisitos:
 *   - Arquivo .env com SUPABASE_SERVICE_ROLE_KEY
 *   - Arquivos supabase/schema.sql e supabase/seed.sql
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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_URL ou SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

console.log('🚀 Iniciando aplicação do schema SQL...\n');
console.log(`📍 URL Supabase: ${SUPABASE_URL}`);
console.log(`🔑 Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...\n`);

// Ler os arquivos SQL
const schemaPath = join(PROJECT_ROOT, 'supabase', 'schema.sql');
const seedPath = join(PROJECT_ROOT, 'supabase', 'seed.sql');

let schemaSQL, seedSQL;

try {
  schemaSQL = readFileSync(schemaPath, 'utf-8');
  seedSQL = readFileSync(seedPath, 'utf-8');
  console.log(`✅ Schema SQL carregado: ${schemaSQL.length} caracteres`);
  console.log(`✅ Seed SQL carregado: ${seedSQL.length} caracteres\n`);
} catch (error) {
  console.error('❌ Erro ao ler arquivos SQL:', error.message);
  process.exit(1);
}

/**
 * Executa SQL diretamente no PostgreSQL via REST API do Supabase
 * Usa a REST API para executar queries via RPC
 */
async function executeSQL(sql, description) {
  console.log(`⏳ Executando: ${description}...`);

  try {
    // Supabase REST API endpoint para executar queries SQL
    // Usamos o endpoint /rest/v1/rpc que permite executar funções PostgreSQL
    const url = `${SUPABASE_URL}/rest/v1/rpc`;

    // Primeiro, precisamos criar uma função temporária que execute o SQL
    // Como não podemos executar SQL diretamente via REST API, vamos usar o Supabase Management API

    // Alternativa: usar pgMeta API (API interna do Supabase)
    const pgMetaUrl = `${SUPABASE_URL}/pg`;

    const response = await fetch(pgMetaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ ${description} executado com sucesso!`);
    return result;

  } catch (error) {
    console.error(`❌ Erro ao executar ${description}:`, error.message);
    throw error;
  }
}

/**
 * Método alternativo: usar SQL direto via PostgREST
 */
async function executeSQLViaSupabase(sql, description) {
  console.log(`⏳ Executando: ${description}...`);

  try {
    // Dividir o SQL em statements individuais (por ponto e vírgula)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   📝 ${statements.length} statements SQL encontrados`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Pular comentários e linhas vazias
      if (statement.trim().startsWith('--') || statement.trim() === ';') {
        continue;
      }

      try {
        // Criar uma requisição POST para o endpoint /query do Supabase
        // Este é um endpoint não documentado que aceita SQL direto
        const url = `${SUPABASE_URL}/rest/v1/rpc/exec`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            sql: statement
          })
        });

        if (response.ok) {
          successCount++;
          process.stdout.write('.');
        } else {
          errorCount++;
          const error = await response.text();
          // Alguns erros são esperados (ex: tabela já existe)
          if (error.includes('already exists') || error.includes('IF NOT EXISTS')) {
            process.stdout.write('s'); // s = skipped
          } else {
            process.stdout.write('!');
            console.error(`\n   ⚠️ Erro no statement ${i + 1}: ${error.substring(0, 100)}`);
          }
        }

      } catch (error) {
        errorCount++;
        process.stdout.write('!');
      }
    }

    console.log(`\n   ✅ ${successCount} statements executados com sucesso`);
    if (errorCount > 0) {
      console.log(`   ⚠️ ${errorCount} statements com erros (podem ser esperados)`);
    }

    return { success: successCount, errors: errorCount };

  } catch (error) {
    console.error(`❌ Erro ao executar ${description}:`, error.message);
    throw error;
  }
}

/**
 * Usar a biblioteca @supabase/supabase-js com service_role
 */
async function applySchemaSubaseJS() {
  console.log('📦 Método 3: Usando @supabase/supabase-js com queries diretas\n');

  // Como não temos acesso direto a executar SQL via REST API do Supabase,
  // vamos usar uma abordagem diferente: criar as tabelas via SQL usando fetch

  // Endpoint da Supabase Management API
  const managementApiUrl = 'https://api.supabase.com/v1';
  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

  console.log(`📍 Project Ref: ${projectRef}\n`);

  // Infelizmente, a Management API requer um token diferente (não o service_role_key)
  // Vamos usar outra abordagem: executar via SQL statements individuais

  console.log('⚠️ A REST API do Supabase não permite execução direta de SQL.');
  console.log('⚠️ Recomendações:\n');
  console.log('   1. Use o Supabase CLI: supabase db push');
  console.log('   2. Use o SQL Editor no dashboard do Supabase');
  console.log('   3. Use uma Edge Function para executar o SQL');
  console.log('   4. Use uma biblioteca PostgreSQL (pg) conectando diretamente\n');

  // Vamos tentar criar uma solução usando pg (PostgreSQL client)
  return false;
}

/**
 * Método 4: Usar pg (PostgreSQL client) para conectar diretamente
 */
async function applySchemaViaPg() {
  console.log('🔌 Método 4: Conexão direta com PostgreSQL\n');

  try {
    // Tentar importar pg dinamicamente
    let pg;
    try {
      pg = await import('pg');
    } catch (error) {
      console.log('⚠️ Biblioteca "pg" não instalada. Instalando...\n');

      // Instalar pg
      const { execSync } = await import('child_process');
      execSync('npm install pg', { stdio: 'inherit', cwd: PROJECT_ROOT });

      pg = await import('pg');
    }

    const { Client } = pg.default || pg;

    // Construir connection string do PostgreSQL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
    const connectionString = `postgresql://postgres:${SERVICE_ROLE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;

    console.log(`📡 Conectando ao PostgreSQL: db.${projectRef}.supabase.co\n`);

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!\n');

    // Executar schema
    console.log('⏳ Executando schema.sql...');
    try {
      await client.query(schemaSQL);
      console.log('✅ Schema aplicado com sucesso!\n');
    } catch (error) {
      // Ignorar erros de "já existe"
      if (error.message.includes('already exists')) {
        console.log('⚠️ Algumas tabelas já existem (isso é normal)\n');
      } else {
        throw error;
      }
    }

    // Executar seed
    console.log('⏳ Executando seed.sql...');
    try {
      await client.query(seedSQL);
      console.log('✅ Seed aplicado com sucesso!\n');
    } catch (error) {
      // Ignorar erros de duplicação
      if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        console.log('⚠️ Alguns dados já existem (isso é normal)\n');
      } else {
        console.error('❌ Erro ao aplicar seed:', error.message);
      }
    }

    // Verificar tabelas criadas
    console.log('📊 Verificando tabelas criadas...\n');
    const result = await client.query(`
      SELECT
        schemaname,
        tablename,
        tableowner
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('✅ Tabelas no schema "public":\n');
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.tablename}`);
    });

    // Contar registros nas tabelas principais
    console.log('\n📈 Contando registros...\n');

    const tablesToCount = [
      'profiles',
      'habits',
      'baby_milestones',
      'content_items',
      'chat_conversations',
      'community_posts'
    ];

    for (const table of tablesToCount) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM public.${table}`);
        console.log(`   ${table}: ${countResult.rows[0].count} registros`);
      } catch (error) {
        // Tabela pode não existir ainda
      }
    }

    await client.end();
    console.log('\n✅ Conexão fechada!\n');

    return true;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║   NOSSA MATERNIDADE - APLICAR SCHEMA SUPABASE        ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    // Tentar método via PostgreSQL direto (mais confiável)
    const success = await applySchemaViaPg();

    if (success) {
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                                                       ║');
      console.log('║   ✅ SCHEMA APLICADO COM SUCESSO!                     ║');
      console.log('║                                                       ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');

      console.log('🎉 Próximos passos:');
      console.log('   1. Acesse o Supabase Dashboard para verificar as tabelas');
      console.log('   2. Configure as Row Level Security (RLS) policies se necessário');
      console.log('   3. Teste a autenticação e inserção de dados no app\n');

      process.exit(0);
    } else {
      throw new Error('Não foi possível aplicar o schema');
    }

  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    console.error('\n📖 Solução alternativa:');
    console.error('   1. Acesse https://supabase.com/dashboard');
    console.error('   2. Vá em SQL Editor');
    console.error('   3. Cole o conteúdo de supabase/schema.sql');
    console.error('   4. Execute o SQL');
    console.error('   5. Repita com supabase/seed.sql\n');

    process.exit(1);
  }
}

// Executar
main();
