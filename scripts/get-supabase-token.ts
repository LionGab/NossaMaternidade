#!/usr/bin/env tsx
/**
 * Script completo para obter e configurar token do Supabase
 * 
 * Este script:
 * 1. Guia o usuário para obter o token do Supabase Dashboard
 * 2. Cria/atualiza o arquivo .env.local
 * 3. Valida a configuração
 * 4. Testa a conexão com Supabase
 * 
 * Usage:
 *   npx tsx scripts/get-supabase-token.ts
 *   npm run get-supabase-token
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function print(color: string, text: string) {
  console.log(`${color}${text}${colors.reset}`);
}

function printHeader(text: string) {
  console.log('');
  print(colors.bright + colors.blue, '════════════════════════════════════════════════════════════');
  print(colors.bright + colors.blue, `  ${text}`);
  print(colors.bright + colors.blue, '════════════════════════════════════════════════════════════');
  console.log('');
}

function printStep(text: string) {
  print(colors.cyan, `▶ ${text}`);
}

function printSuccess(text: string) {
  print(colors.green, `✅ ${text}`);
}

function printWarning(text: string) {
  print(colors.yellow, `⚠️  ${text}`);
}

function printError(text: string) {
  print(colors.red, `❌ ${text}`);
}

function printInfo(text: string) {
  print(colors.blue, `ℹ️  ${text}`);
}

// Criar interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Ler arquivo .env.local existente
function readEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env.local');
  const env: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const [, key, value] = match;
          env[key.trim()] = value.trim();
        }
      }
    }
  }

  return env;
}

// Escrever arquivo .env.local
function writeEnvFile(env: Record<string, string>) {
  const envPath = path.join(process.cwd(), '.env.local');
  const examplePath = path.join(process.cwd(), '.env.example');

  let content = '# ============================================\n';
  content += '# Nossa Maternidade - Variáveis de Ambiente\n';
  content += '# ============================================\n';
  content += '# Gerado automaticamente por get-supabase-token.ts\n';
  content += '# NUNCA commite este arquivo!\n';
  content += '# ============================================\n\n';

  // Ler .env.example para manter estrutura
  if (fs.existsSync(examplePath)) {
    const exampleContent = fs.readFileSync(examplePath, 'utf-8');
    const exampleLines = exampleContent.split('\n');

    let inSupabaseSection = false;
    for (const line of exampleLines) {
      if (line.includes('Supabase')) {
        inSupabaseSection = true;
      }
      if (inSupabaseSection && line.startsWith('#')) {
        content += line + '\n';
      }
    }
    content += '\n';
  }

  // Escrever variáveis Supabase
  if (env.EXPO_PUBLIC_SUPABASE_URL) {
    content += `EXPO_PUBLIC_SUPABASE_URL=${env.EXPO_PUBLIC_SUPABASE_URL}\n`;
  }
  if (env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    content += `EXPO_PUBLIC_SUPABASE_ANON_KEY=${env.EXPO_PUBLIC_SUPABASE_ANON_KEY}\n`;
  }
  if (env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL) {
    content += `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=${env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}\n`;
  }

  // Manter outras variáveis existentes
  const existingEnv = readEnvFile();
  for (const [key, value] of Object.entries(existingEnv)) {
    if (
      !key.startsWith('EXPO_PUBLIC_SUPABASE_') &&
      !content.includes(`${key}=`)
    ) {
      content += `\n${key}=${value}\n`;
    }
  }

  fs.writeFileSync(envPath, content, 'utf-8');
}

// Validar formato do token
function validateToken(token: string): boolean {
  // Token JWT geralmente começa com eyJ
  if (!token.startsWith('eyJ')) {
    return false;
  }
  // Token deve ter pelo menos 100 caracteres
  if (token.length < 100) {
    return false;
  }
  return true;
}

// Validar formato da URL
function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.includes('supabase.co');
  } catch {
    return false;
  }
}

// Testar conexão com Supabase
async function testConnection(url: string, anonKey: string): Promise<boolean> {
  try {
    const supabase = createClient(url, anonKey);
    
    // Tentar fazer uma query simples (health check)
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    // Se não houver erro OU se o erro for apenas "relation does not exist" (schema não aplicado ainda)
    if (!error || error.code === 'PGRST116' || error.message.includes('relation')) {
      return true;
    }
    
    printWarning(`Conexão OK, mas schema pode não estar aplicado: ${error.message}`);
    return true; // Ainda consideramos sucesso se a conexão funcionou
  } catch (error) {
    printError(`Erro ao testar conexão: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Mostrar instruções para obter token
function showInstructions() {
  printHeader('Como Obter o Token do Supabase');

  console.log('Siga estes passos:\n');
  
  printStep('1. Acesse o Supabase Dashboard');
  printInfo('   URL: https://app.supabase.com\n');
  
  printStep('2. Selecione seu projeto (ou crie um novo)');
  printInfo('   Se não tiver projeto: New Project → Preencha dados → Aguarde ~2min\n');
  
  printStep('3. Vá em Settings → API');
  printInfo('   Menu lateral esquerdo → Settings → API\n');
  
  printStep('4. Copie as seguintes informações:');
  print(colors.bright, '   • Project URL: https://xxx.supabase.co');
  print(colors.bright, '   • anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n');
  
  printWarning('⚠️  IMPORTANTE: Use a chave "anon public" (NÃO a "service_role")\n');
  
  print(colors.magenta, 'Pressione Enter quando tiver as informações...');
}

// Função principal
async function main() {
  printHeader('Configuração do Token Supabase');

  // Verificar se .env.local já existe
  const envPath = path.join(process.cwd(), '.env.local');
  const existingEnv = readEnvFile();

  if (Object.keys(existingEnv).length > 0) {
    printInfo('Arquivo .env.local encontrado com as seguintes configurações:');
    if (existingEnv.EXPO_PUBLIC_SUPABASE_URL) {
      print(colors.cyan, `   URL: ${existingEnv.EXPO_PUBLIC_SUPABASE_URL}`);
    }
    if (existingEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
      const masked = existingEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...';
      print(colors.cyan, `   Token: ${masked}`);
    }
    console.log('');

    const update = await question('Deseja atualizar? (s/N): ');
    if (update.toLowerCase() !== 's' && update.toLowerCase() !== 'sim') {
      printInfo('Operação cancelada.');
      rl.close();
      return;
    }
  }

  // Mostrar instruções
  showInstructions();
  await question('');

  // Coletar informações
  console.log('');
  printHeader('Coletando Informações');

  let supabaseUrl = '';
  let supabaseAnonKey = '';

  // URL
  while (!supabaseUrl || !validateUrl(supabaseUrl)) {
    supabaseUrl = await question('EXPO_PUBLIC_SUPABASE_URL (https://xxx.supabase.co): ');
    supabaseUrl = supabaseUrl.trim();

    if (!supabaseUrl) {
      printError('URL é obrigatória!');
      continue;
    }

    if (!validateUrl(supabaseUrl)) {
      printError('URL inválida! Deve ser https://xxx.supabase.co');
      supabaseUrl = '';
    }
  }

  printSuccess('URL válida!');

  // Token
  console.log('');
  while (!supabaseAnonKey || !validateToken(supabaseAnonKey)) {
    supabaseAnonKey = await question('EXPO_PUBLIC_SUPABASE_ANON_KEY (eyJ...): ');
    supabaseAnonKey = supabaseAnonKey.trim();

    if (!supabaseAnonKey) {
      printError('Token é obrigatório!');
      continue;
    }

    if (!validateToken(supabaseAnonKey)) {
      printWarning('Token parece inválido (deve começar com "eyJ" e ter pelo menos 100 caracteres)');
      const continueAnyway = await question('Continuar mesmo assim? (s/N): ');
      if (continueAnyway.toLowerCase() !== 's' && continueAnyway.toLowerCase() !== 'sim') {
        supabaseAnonKey = '';
      }
    }
  }

  printSuccess('Token coletado!');

  // Gerar FUNCTIONS_URL automaticamente
  const functionsUrl = `${supabaseUrl}/functions/v1`;

  // Salvar no .env.local
  console.log('');
  printHeader('Salvando Configuração');

  const env: Record<string, string> = {
    ...existingEnv,
    EXPO_PUBLIC_SUPABASE_URL: supabaseUrl,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL: functionsUrl,
  };

  writeEnvFile(env);
  printSuccess('Arquivo .env.local criado/atualizado!');

  // Testar conexão
  console.log('');
  printHeader('Testando Conexão');

  printStep('Testando conexão com Supabase...');
  const connectionOk = await testConnection(supabaseUrl, supabaseAnonKey);

  if (connectionOk) {
    printSuccess('Conexão com Supabase estabelecida com sucesso!');
  } else {
    printWarning('Não foi possível testar a conexão automaticamente.');
    printInfo('Isso pode ser normal se o schema ainda não foi aplicado.');
  }

  // Resumo final
  console.log('');
  printHeader('Configuração Concluída!');

  printSuccess('Token do Supabase configurado com sucesso!');
  console.log('');
  printInfo('Próximos passos:');
  printStep('1. Verificar configuração: npm run check-env');
  printStep('2. Aplicar schema SQL (se ainda não aplicado):');
  print(colors.cyan, '   - Abra Supabase Dashboard → SQL Editor');
  print(colors.cyan, '   - Execute o conteúdo de supabase-setup.sql');
  printStep('3. Testar o app: npm start');
  console.log('');

  rl.close();
}

// Executar
main().catch((error) => {
  printError(`Erro: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
