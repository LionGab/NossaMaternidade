/**
 * Script automatizado para aplicar schema e seed no Supabase
 *
 * NOTA: Este script requer a SERVICE_ROLE_KEY do Supabase
 *
 * Execute com: npx ts-node scripts/apply-schema-auto.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('\n🤖 Aplicando Schema Automaticamente no Supabase...\n');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Service Role Key:', supabaseServiceRoleKey ? '✅ Configurada' : '❌ NÃO CONFIGURADA');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('\n❌ Erro: SERVICE_ROLE_KEY não configurada!');
  console.error('\n📝 Como obter a SERVICE_ROLE_KEY:');
  console.error('   1. Acesse: https://app.supabase.com');
  console.error('   2. Selecione seu projeto');
  console.error('   3. Vá em Settings > API');
  console.error('   4. Copie a "service_role" key (seção "Project API keys")');
  console.error('   5. Adicione ao .env: SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui');
  console.error('\n⚠️  ATENÇÃO: NUNCA exponha a service_role key no código do cliente!');
  process.exit(1);
}

// Criar cliente Supabase com service_role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSqlFile(filePath: string, fileName: string) {
  console.log(`\n📄 Executando ${fileName}...`);

  try {
    const fullPath = path.join(process.cwd(), filePath);
    const sqlContent = fs.readFileSync(fullPath, 'utf8');

    console.log(`   Lido: ${sqlContent.length} caracteres`);
    console.log(`   Linhas: ${sqlContent.split('\n').length}`);

    // Nota: A API do Supabase não expõe diretamente o endpoint para executar SQL arbitrário
    // Isso precisa ser feito via Management API ou Dashboard
    // Vamos usar uma abordagem alternativa: fazer requisição HTTP direta

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
      },
      body: JSON.stringify({ query: sqlContent })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ Erro HTTP ${response.status}:`, errorText);
      return false;
    }

    console.log(`   ✅ ${fileName} executado com sucesso!`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Erro ao executar ${fileName}:`, error.message);
    return false;
  }
}

async function applySchemaManually() {
  console.log('\n📋 MÉTODO MANUAL RECOMENDADO\n');
  console.log('Infelizmente, a API do Supabase não permite executar SQL arbitrário remotamente');
  console.log('por motivos de segurança. Você precisa aplicar o schema via Dashboard.\n');

  console.log('🚀 OPÇÃO 1: Dashboard (Recomendado)');
  console.log('   1. Acesse: https://app.supabase.com');
  console.log('   2. Vá em SQL Editor → New Query');
  console.log('   3. Copie e cole o conteúdo de: supabase/schema.sql');
  console.log('   4. Clique em RUN');
  console.log('   5. Repita com: supabase/seed.sql\n');

  console.log('🚀 OPÇÃO 2: Supabase CLI (Para Desenvolvedores)');
  console.log('   npm install -g supabase');
  console.log('   supabase login');
  console.log('   supabase link --project-ref mnszbkeuerjcevjvdqme');
  console.log('   supabase db push\n');

  console.log('📚 Documentação: APPLY_SCHEMA_NOW.md\n');
}

async function testSchemaApplied() {
  console.log('\n🧪 Testando se o schema foi aplicado...\n');

  // Criar cliente com anon key para testes
  const testClient = createClient(
    supabaseUrl,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  try {
    // Testar tabela habits
    const { data: habits, error: habitsError } = await testClient
      .from('habits')
      .select('count')
      .limit(1);

    if (habitsError) {
      console.log('   ❌ Tabela "habits" não existe ou não tem RLS configurado');
      return false;
    }

    console.log('   ✅ Tabela "habits" existe');

    // Testar tabela baby_milestones
    const { data: milestones, error: milestonesError } = await testClient
      .from('baby_milestones')
      .select('count')
      .limit(1);

    if (milestonesError) {
      console.log('   ❌ Tabela "baby_milestones" não existe');
      return false;
    }

    console.log('   ✅ Tabela "baby_milestones" existe');

    // Testar storage buckets
    const { data: buckets, error: bucketsError } = await testClient
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('   ⚠️  Storage buckets podem não estar configurados');
    } else {
      console.log(`   ✅ ${buckets?.length || 0} storage buckets encontrados`);
    }

    console.log('\n🎉 Schema parece estar aplicado corretamente!\n');
    return true;

  } catch (error: any) {
    console.error('   ❌ Erro ao testar schema:', error.message);
    return false;
  }
}

// Executar
async function main() {
  // Verificar se o schema já foi aplicado
  const schemaApplied = await testSchemaApplied();

  if (schemaApplied) {
    console.log('✅ O schema já está aplicado! Nada a fazer.\n');
    process.exit(0);
  }

  // Se não, mostrar instruções manuais
  await applySchemaManually();

  console.log('💡 Depois de aplicar o schema, execute este script novamente para testar.\n');
  process.exit(0);
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
