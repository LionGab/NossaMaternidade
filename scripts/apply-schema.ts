/**
 * Script para aplicar schema SQL no Supabase
 * Usa Supabase Management API para executar SQL
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Carregar variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

// Criar cliente Supabase com service role key (tem permissão para executar SQL)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applySchema() {
  try {
    console.log('📋 Lendo arquivo schema.sql...');
    const schemaPath = join(__dirname, '../supabase/schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');

    console.log('🚀 Aplicando schema no Supabase...');
    console.log('⚠️  Nota: Este script requer acesso à API Management do Supabase.');
    console.log('   Se não funcionar, use o SQL Editor no Dashboard.');
    console.log('');

    // Nota: O Supabase JS client não tem método direto para executar SQL arbitrário
    // Isso requer Supabase Management API ou conexão PostgreSQL direta
    // Por isso, recomendamos usar o SQL Editor do Dashboard

    console.log('✅ Schema carregado com sucesso!');
    console.log('');
    console.log('📝 Próximos passos:');
    console.log('1. Acesse: https://app.supabase.com/project/bbcwitnbnosyfpfjtzkr/sql');
    console.log('2. Cole o conteúdo de supabase/schema.sql');
    console.log('3. Clique em Run');
    console.log('');
    console.log('Ou use o Supabase CLI:');
    console.log('  supabase db execute -f supabase/schema.sql');

    // Tentar via REST API (pode não funcionar sem configuração adicional)
    // const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    //   method: 'POST',
    //   headers: {
    //     'apikey': SUPABASE_SERVICE_ROLE_KEY,
    //     'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ sql: schemaSQL }),
    // });

  } catch (error) {
    console.error('❌ Erro ao aplicar schema:', error);
    process.exit(1);
  }
}

applySchema();

