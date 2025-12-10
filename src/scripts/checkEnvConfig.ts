/**
 * Script de Verificação - Configuração de Ambiente
 * 
 * Verifica se as variáveis de ambiente estão configuradas corretamente
 * Versão Node.js pura (sem dependências React Native)
 * 
 * Uso:
 *   npm run check:env-config
 *   ou
 *   npx tsx src/scripts/checkEnvConfig.ts
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */

import * as fs from 'fs';
import * as path from 'path';

function checkEnvConfig() {
  console.log('========================================');
  console.log('Verificação de Configuração - MCP Release Ops');
  console.log('========================================\n');

  // Ler app.config.js
  const appConfigPath = path.join(process.cwd(), 'app.config.js');
  let appConfigExtra: Record<string, unknown> = {};
  
  if (fs.existsSync(appConfigPath)) {
    try {
      // Usar require para carregar app.config.js
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      delete require.cache[require.resolve(appConfigPath)];
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const appConfig = require(appConfigPath);
      appConfigExtra = appConfig?.expo?.extra || {};
    } catch (error) {
      console.log('⚠️ Não foi possível ler app.config.js:', error instanceof Error ? error.message : String(error));
    }
  }

  // Verificar variáveis de ambiente
  const checkVar = (name: string, fromConfig?: unknown, fromEnv?: string) => {
    const value = fromConfig || fromEnv || process.env[`EXPO_PUBLIC_${name}`] || process.env[name];
    return {
      configured: !!value,
      source: fromConfig ? 'app.config.js' : fromEnv ? 'process.env' : 'não encontrado',
      value: value ? (typeof value === 'string' && value.length > 20 ? `${value.substring(0, 20)}...` : String(value)) : 'não configurado',
    };
  };

  // Sentry
  console.log('📊 Sentry Configuration:');
  const sentryToken = checkVar('SENTRY_AUTH_TOKEN', appConfigExtra.sentryAuthToken);
  const sentryOrg = checkVar('SENTRY_ORG_SLUG', appConfigExtra.sentryOrgSlug, 'nossa-maternidade');
  const sentryProject = checkVar('SENTRY_PROJECT_SLUG', appConfigExtra.sentryProjectSlug, 'nossa-maternidade-mobile');
  console.log('  API Token:', sentryToken.configured ? '✅ Configurado' : '❌ Não configurado', `(${sentryToken.source})`);
  console.log('  Org Slug:', sentryOrg.value);
  console.log('  Project Slug:', sentryProject.value);
  console.log('');

  // App Store Connect
  console.log('🍎 App Store Connect Configuration:');
  const appStoreIssuer = checkVar('APP_STORE_CONNECT_ISSUER_ID', appConfigExtra.appStoreConnectIssuerId);
  const appStoreKeyId = checkVar('APP_STORE_CONNECT_KEY_ID', appConfigExtra.appStoreConnectKeyId);
  const appStoreKey = checkVar('APP_STORE_CONNECT_PRIVATE_KEY', appConfigExtra.appStoreConnectPrivateKey);
  console.log('  Issuer ID:', appStoreIssuer.configured ? '✅ Configurado' : '❌ Não configurado', `(${appStoreIssuer.source})`);
  console.log('  Key ID:', appStoreKeyId.configured ? '✅ Configurado' : '❌ Não configurado', `(${appStoreKeyId.source})`);
  console.log('  Private Key:', appStoreKey.configured ? '✅ Configurado' : '❌ Não configurado', `(${appStoreKey.source})`);
  console.log('');

  // Google Play Console
  console.log('🤖 Google Play Console Configuration:');
  const playEmail = checkVar('GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL', appConfigExtra.googlePlayServiceAccountEmail);
  const playKey = checkVar('GOOGLE_PLAY_PRIVATE_KEY', appConfigExtra.googlePlayPrivateKey);
  const playPackage = checkVar('GOOGLE_PLAY_PACKAGE_NAME', appConfigExtra.googlePlayPackageName, 'com.nossamaternidade.app');
  console.log('  Service Account:', playEmail.configured ? '✅ Configurado' : '❌ Não configurado', `(${playEmail.source})`);
  console.log('  Private Key:', playKey.configured ? '✅ Configurado' : '❌ Não configurado', `(${playKey.source})`);
  console.log('  Package Name:', playPackage.value);
  console.log('');

  // Resumo
  console.log('========================================');
  const allConfigured =
    sentryToken.configured &&
    appStoreIssuer.configured &&
    appStoreKeyId.configured &&
    appStoreKey.configured &&
    playEmail.configured &&
    playKey.configured;

  if (allConfigured) {
    console.log('✅ Todas as configurações estão presentes!');
  } else {
    console.log('⚠️ Algumas configurações estão faltando.');
    console.log('   Os MCPs funcionarão em modo graceful degradation.');
    console.log('   Configure as variáveis em app.config.js ou .env');
    console.log('');
    console.log('   Para configurar:');
    console.log('   1. Adicione em app.config.js > extra: { ... }');
    console.log('   2. Ou use variáveis EXPO_PUBLIC_* no .env');
    console.log('   3. Ou configure secrets no Supabase (para Edge Functions)');
  }
  console.log('========================================\n');
}

// Executar se chamado diretamente
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (require.main === module) {
  checkEnvConfig();
}

export { checkEnvConfig };

