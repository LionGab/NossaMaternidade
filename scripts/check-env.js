#!/usr/bin/env node
/**
 * Script de verificação de variáveis de ambiente
 *
 * Verifica se todas as variáveis obrigatórias estão configuradas
 * antes de rodar o app ou fazer build.
 *
 * Usage:
 *   node scripts/check-env.js
 *   npm run check-env
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Variáveis obrigatórias
const REQUIRED_VARS = [
  {
    name: 'EXPO_PUBLIC_SUPABASE_URL',
    description: 'URL do projeto Supabase',
    example: 'https://seu-projeto.supabase.co',
    link: 'https://app.supabase.com/project/_/settings/api',
  },
  {
    name: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Chave anônima do Supabase',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    link: 'https://app.supabase.com/project/_/settings/api',
  },
  {
    name: 'EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL',
    description: 'URL das Edge Functions',
    example: 'https://seu-projeto.supabase.co/functions/v1',
    link: 'https://app.supabase.com/project/_/settings/api',
  },
];

// Variáveis recomendadas (para features principais)
const RECOMMENDED_VARS = [
  {
    name: 'EXPO_PUBLIC_REVENUECAT_IOS_KEY',
    description: 'Chave pública do RevenueCat para iOS',
    feature: 'In-App Purchases (iOS)',
    link: 'https://app.revenuecat.com/apps/',
  },
  {
    name: 'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY',
    description: 'Chave pública do RevenueCat para Android',
    feature: 'In-App Purchases (Android)',
    link: 'https://app.revenuecat.com/apps/',
  },
];

// Variáveis opcionais
const OPTIONAL_VARS = [
  {
    name: 'EXPO_PUBLIC_GROK_API_KEY',
    description: 'API Key do Grok (alternativa)',
    feature: 'IA alternativa',
  },
  {
    name: 'EXPO_PUBLIC_IMGUR_CLIENT_ID',
    description: 'Client ID do Imgur',
    feature: 'Upload de imagens',
  },
  {
    name: 'EXPO_PUBLIC_ELEVENLABS_VOICE_ID',
    description: 'Voice ID do ElevenLabs',
    feature: 'Voz da NathIA',
  },
];

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}${colors.bright}❌ Arquivo .env.local não encontrado!${colors.reset}\n`);
    console.log(`${colors.yellow}📝 Instruções:${colors.reset}`);
    console.log(`1. Copie o template: ${colors.cyan}cp .env.example .env.local${colors.reset}`);
    console.log(`2. Edite .env.local com suas credenciais reais`);
    console.log(`3. Execute este script novamente\n`);
    process.exit(1);
  }

  return true;
}

function getEnvValue(varName) {
  // Tenta ler do process.env ou do arquivo .env.local
  if (process.env[varName]) {
    return process.env[varName];
  }

  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(new RegExp(`^${varName}=(.*)$`, 'm'));

  return match ? match[1].trim() : null;
}

function isPlaceholder(value) {
  if (!value) return true;

  const placeholders = [
    'sua-chave',
    'seu-projeto',
    'your-',
    '...',
    'example',
    'test',
  ];

  return placeholders.some(p => value.toLowerCase().includes(p));
}

function checkVariables() {
  console.log(`\n${colors.bright}${colors.cyan}🔍 Verificando variáveis de ambiente...${colors.reset}\n`);

  let hasErrors = false;
  let hasWarnings = false;

  // Verificar obrigatórias
  console.log(`${colors.bright}📋 Obrigatórias:${colors.reset}`);
  REQUIRED_VARS.forEach(varInfo => {
    const value = getEnvValue(varInfo.name);

    if (!value || isPlaceholder(value)) {
      console.log(`${colors.red}  ❌ ${varInfo.name}${colors.reset}`);
      console.log(`     ${colors.yellow}${varInfo.description}${colors.reset}`);
      console.log(`     Exemplo: ${colors.cyan}${varInfo.example}${colors.reset}`);
      console.log(`     Obtenha em: ${colors.blue}${varInfo.link}${colors.reset}\n`);
      hasErrors = true;
    } else {
      console.log(`${colors.green}  ✅ ${varInfo.name}${colors.reset}`);
    }
  });

  // Verificar recomendadas
  console.log(`\n${colors.bright}⭐ Recomendadas:${colors.reset}`);
  RECOMMENDED_VARS.forEach(varInfo => {
    const value = getEnvValue(varInfo.name);

    if (!value || isPlaceholder(value)) {
      console.log(`${colors.yellow}  ⚠️  ${varInfo.name}${colors.reset}`);
      console.log(`     Feature: ${varInfo.feature}`);
      console.log(`     ${varInfo.description}`);
      console.log(`     Obtenha em: ${colors.blue}${varInfo.link}${colors.reset}\n`);
      hasWarnings = true;
    } else {
      console.log(`${colors.green}  ✅ ${varInfo.name}${colors.reset}`);
    }
  });

  // Verificar opcionais (apenas mostrar status)
  console.log(`\n${colors.bright}🔧 Opcionais:${colors.reset}`);
  OPTIONAL_VARS.forEach(varInfo => {
    const value = getEnvValue(varInfo.name);
    const status = value && !isPlaceholder(value) ? '✅' : '⚪';
    const color = value && !isPlaceholder(value) ? colors.green : colors.reset;
    console.log(`${color}  ${status} ${varInfo.name}${colors.reset} - ${varInfo.feature}`);
  });

  // Resumo final
  console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (hasErrors) {
    console.log(`${colors.red}${colors.bright}❌ ERRO: Variáveis obrigatórias faltando!${colors.reset}`);
    console.log(`${colors.yellow}Corrija os erros acima antes de continuar.${colors.reset}\n`);
    process.exit(1);
  } else if (hasWarnings) {
    console.log(`${colors.yellow}${colors.bright}⚠️  ATENÇÃO: Algumas features estarão desabilitadas${colors.reset}`);
    console.log(`${colors.yellow}Configure as variáveis recomendadas para experiência completa.${colors.reset}\n`);
    process.exit(0); // Exit com sucesso mas com warning
  } else {
    console.log(`${colors.green}${colors.bright}✅ Tudo configurado corretamente!${colors.reset}\n`);
    process.exit(0);
  }
}

// Main
try {
  checkEnvFile();
  checkVariables();
} catch (error) {
  console.error(`${colors.red}Erro ao verificar ambiente:${colors.reset}`, error.message);
  process.exit(1);
}
