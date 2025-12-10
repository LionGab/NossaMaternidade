# Guia de Teste - MCP Release Ops

Guia prático para testar os MCP Servers de Release Ops localmente antes do deploy.

## 🎯 Pré-requisitos

1. Supabase CLI instalado e configurado
2. Projeto Supabase inicializado localmente
3. Variáveis de ambiente configuradas (ou usar mocks)

## 📋 Opções de Teste

### Opção 1: Teste Local com Supabase Local (Recomendado)

#### 1.1. Iniciar Supabase Local

```bash
# Na raiz do projeto
supabase start
```

Isso inicia:
- PostgreSQL local
- Edge Functions runtime
- API Gateway

#### 1.2. Configurar Secrets Locais

```bash
# Criar arquivo .env.local (não commitado)
# supabase/.env.local

SENTRY_AUTH_TOKEN=test_token_here
SENTRY_ORG_SLUG=nossa-maternidade
SENTRY_PROJECT_SLUG=nossa-maternidade-mobile

APP_STORE_CONNECT_ISSUER_ID=test_issuer_id
APP_STORE_CONNECT_KEY_ID=test_key_id
APP_STORE_CONNECT_PRIVATE_KEY=test_private_key_base64

GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL=test@example.com
GOOGLE_PLAY_PRIVATE_KEY=test_private_key_base64
```

#### 1.3. Deploy Local das Edge Functions

```bash
# Deploy local (não precisa de credenciais reais ainda)
supabase functions serve sentry-proxy --no-verify-jwt
supabase functions serve appstore-proxy --no-verify-jwt
supabase functions serve googleplay-proxy --no-verify-jwt
```

#### 1.4. Testar Edge Functions Diretamente

```bash
# Testar sentry-proxy
curl -X POST http://localhost:54321/functions/v1/sentry-proxy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "action": "listReleases",
    "params": {
      "organizationSlug": "nossa-maternidade",
      "projectSlug": "nossa-maternidade-mobile",
      "limit": 5
    }
  }'
```

### Opção 2: Teste com Mocks (Sem APIs Reais)

Criar versões mockadas dos MCPs para teste rápido.

#### 2.1. Criar MCP Mock

```typescript
// src/mcp/servers/__mocks__/SentryMCPServer.ts
import { MCPServer, MCPRequest, MCPResponse, createMCPResponse } from '../../types';

export class SentryMCPServerMock implements MCPServer {
  name = 'sentry-mcp-mock';
  version = '1.0.0';
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return createMCPResponse(request.id, null, {
        code: 'NOT_INITIALIZED',
        message: 'MCP Server not initialized',
      });
    }

    // Mock responses
    if (request.method === 'release.list') {
      return createMCPResponse(request.id, [
        {
          version: '1.0.0+1',
          dateCreated: new Date().toISOString(),
          projects: [{ id: 'test', name: 'Test', slug: 'test' }],
          newGroups: 0,
          ref: '1',
        },
      ]);
    }

    if (request.method === 'health.checkCrashRate') {
      return createMCPResponse(request.id, {
        isHealthy: true,
        crashFreeRate: 99.5,
      });
    }

    return createMCPResponse(request.id, null, {
      code: 'UNKNOWN_METHOD',
      message: `Unknown method: ${request.method}`,
    });
  }

  async shutdown(): Promise<void> {
    this.initialized = false;
  }
}
```

### Opção 3: Teste no App React Native

#### 3.1. Criar Script de Teste

```typescript
// src/scripts/testReleaseOps.ts
import { releaseOpsAgent } from '@/agents';
import { logger } from '@/utils/logger';

async function testReleaseOps() {
  try {
    logger.info('[Test] Inicializando ReleaseOpsAgent...');
    await releaseOpsAgent.initialize();

    logger.info('[Test] Testando getReleaseReadinessReport...');
    const report = await releaseOpsAgent.process({
      release: '1.0.0',
      appId: 'test-app-id',
      packageName: 'com.nossamaternidade.app',
    });

    logger.info('[Test] Report recebido:', report);
    console.log('✅ Release Readiness Report:', JSON.stringify(report, null, 2));

    logger.info('[Test] Testando getStoreStatusSummary...');
    const storeStatus = await releaseOpsAgent.getStoreStatusSummary({
      appId: 'test-app-id',
      packageName: 'com.nossamaternidade.app',
    });

    logger.info('[Test] Store Status recebido:', storeStatus);
    console.log('✅ Store Status:', JSON.stringify(storeStatus, null, 2));

    logger.info('[Test] Testando listCriticalCrashesSince...');
    const crashes = await releaseOpsAgent.listCriticalCrashesSince('2025-12-01', '1.0.0');
    logger.info('[Test] Crashes recebidos:', crashes);
    console.log('✅ Critical Crashes:', JSON.stringify(crashes, null, 2));

    logger.info('[Test] ✅ Todos os testes passaram!');
  } catch (error) {
    logger.error('[Test] Erro nos testes:', error);
    console.error('❌ Erro:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testReleaseOps()
    .then(() => {
      console.log('✅ Testes concluídos com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testes falharam:', error);
      process.exit(1);
    });
}

export { testReleaseOps };
```

#### 3.2. Adicionar ao package.json

```json
{
  "scripts": {
    "test:release-ops": "tsx src/scripts/testReleaseOps.ts"
  }
}
```

#### 3.3. Executar Teste

```bash
npm run test:release-ops
```

## 🧪 Testes Específicos por MCP

### Teste SentryMCPServer

```typescript
// Teste básico
import { sentryMCP } from '@/mcp/servers';

async function testSentry() {
  await sentryMCP.initialize();
  
  const response = await sentryMCP.handleRequest({
    id: 'test-1',
    method: 'release.getCurrent',
    params: {},
  });
  
  console.log('Sentry Current Release:', response);
}
```

### Teste AppStoreConnectMCPServer

```typescript
import { appStoreConnectMCP } from '@/mcp/servers';

async function testAppStore() {
  await appStoreConnectMCP.initialize();
  
  const response = await appStoreConnectMCP.handleRequest({
    id: 'test-1',
    method: 'build.list',
    params: {
      appId: 'test-app-id',
      filter: { version: '1.0.0' },
    },
  });
  
  console.log('App Store Builds:', response);
}
```

### Teste GooglePlayConsoleMCPServer

```typescript
import { googlePlayConsoleMCP } from '@/mcp/servers';

async function testGooglePlay() {
  await googlePlayConsoleMCP.initialize();
  
  const response = await googlePlayConsoleMCP.handleRequest({
    id: 'test-1',
    method: 'track.list',
    params: {
      packageName: 'com.nossamaternidade.app',
    },
  });
  
  console.log('Google Play Tracks:', response);
}
```

## 🔍 Verificação de Configuração

### Verificar envConfig

```typescript
// src/scripts/checkEnvConfig.ts
import { sentryConfig, appStoreConnectConfig, googlePlayConsoleConfig } from '@/mcp/utils/envConfig';
import Constants from 'expo-constants';

console.log('=== Verificação de Configuração ===\n');

console.log('Sentry:');
console.log('  API Token:', sentryConfig.apiToken ? '✅ Configurado' : '❌ Não configurado');
console.log('  Org Slug:', sentryConfig.organizationSlug);
console.log('  Project Slug:', sentryConfig.projectSlug);

console.log('\nApp Store Connect:');
console.log('  Issuer ID:', appStoreConnectConfig.issuerId ? '✅ Configurado' : '❌ Não configurado');
console.log('  Key ID:', appStoreConnectConfig.keyId ? '✅ Configurado' : '❌ Não configurado');
console.log('  Private Key:', appStoreConnectConfig.privateKey ? '✅ Configurado' : '❌ Não configurado');

console.log('\nGoogle Play Console:');
console.log('  Service Account:', googlePlayConsoleConfig.serviceAccountEmail ? '✅ Configurado' : '❌ Não configurado');
console.log('  Private Key:', googlePlayConsoleConfig.privateKey ? '✅ Configurado' : '❌ Não configurado');
console.log('  Package Name:', googlePlayConsoleConfig.packageName);

console.log('\nConstants.expoConfig.extra:');
console.log(JSON.stringify(Constants.expoConfig?.extra, null, 2));
```

## 🐛 Debugging

### Habilitar Logs Detalhados

```typescript
// src/utils/logger.ts - já deve ter níveis de log
// Em desenvolvimento, usar:
logger.setLevel('debug');
```

### Verificar Chamadas Edge Functions

```typescript
// Adicionar logging nas Edge Functions
// supabase/functions/sentry-proxy/index.ts
console.log('[sentry-proxy] Request recebido:', JSON.stringify({ action, params }));
```

### Testar Conexão com Supabase

```typescript
import { supabase } from '@/services/supabase';

async function testSupabaseConnection() {
  const { data, error } = await supabase.functions.invoke('sentry-proxy', {
    body: {
      action: 'listReleases',
      params: {
        organizationSlug: 'test',
        projectSlug: 'test',
        limit: 1,
      },
    },
  });
  
  if (error) {
    console.error('❌ Erro ao chamar Edge Function:', error);
  } else {
    console.log('✅ Edge Function respondeu:', data);
  }
}
```

## ✅ Checklist de Teste

- [ ] Supabase local iniciado (`supabase start`)
- [ ] Edge Functions servindo localmente
- [ ] Variáveis de ambiente configuradas (ou mocks)
- [ ] `envConfig` retornando valores corretos
- [ ] MCP Servers inicializando sem erros
- [ ] Chamadas para Edge Functions funcionando
- [ ] `ReleaseOpsAgent` respondendo corretamente
- [ ] Logs aparecendo corretamente
- [ ] Erros sendo tratados graciosamente

## 🚀 Próximo Passo: Deploy

Após validar localmente:

1. Configurar secrets no Supabase Dashboard
2. Deploy das Edge Functions:
   ```bash
   supabase functions deploy sentry-proxy
   supabase functions deploy appstore-proxy
   supabase functions deploy googleplay-proxy
   ```
3. Testar em ambiente de staging
4. Validar com credenciais reais (opcional)

## 📝 Notas

- **Sem credenciais reais**: Os MCPs funcionam em modo "graceful degradation" (retornam dados mockados ou vazios)
- **Com credenciais reais**: As Edge Functions fazem chamadas reais às APIs
- **Testes locais**: Use `supabase start` para ambiente local completo
- **Testes no app**: Use mocks ou Edge Functions locais

