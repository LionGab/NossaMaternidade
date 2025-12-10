# MCP Operação de Stores e Release

Documentação dos MCP Servers e Agent focados em operação de produção (iOS/Android Stores e saúde de release).

## 📋 Visão Geral

Este conjunto de MCPs e agentes permite monitorar e operar o app Nossa Maternidade em produção, integrando:

- **Sentry**: Crash tracking e saúde de release
- **App Store Connect**: Builds, reviews e status iOS
- **Google Play Console**: Tracks, ANRs e status Android

## 🎯 MCP Servers

### SentryMCPServer

**Arquivo**: `src/mcp/servers/SentryMCPServer.ts`

**Métodos disponíveis**:

- `release.list` - Lista releases do projeto
- `release.get` - Obtém detalhes de um release específico
- `release.getCurrent` - Obtém release atual (baseado em Constants)
- `crash.listTop` - Lista top crashes de um release
- `crash.getIssue` - Obtém detalhes de uma issue específica
- `health.getReleaseHealth` - Obtém saúde de um release (crash-free rate, sessions, etc)
- `health.checkCrashRate` - Verifica se crash rate está acima do threshold

**Configuração** (variáveis de ambiente):

```bash
SENTRY_AUTH_TOKEN=your_token
SENTRY_ORG_SLUG=nossa-maternidade
SENTRY_PROJECT_SLUG=nossa-maternidade-mobile
```

**Status**: ✅ Implementado (skeleton completo, API real requer token)

---

### AppStoreConnectMCPServer

**Arquivo**: `src/mcp/servers/AppStoreConnectMCPServer.ts`

**Métodos disponíveis**:

- `build.list` - Lista builds de um app
- `build.get` - Obtém detalhes de um build específico
- `review.getStatus` - Obtém status de review de uma versão
- `rating.getAppStoreRatings` - Obtém ratings do App Store (TODO: implementação completa)
- `version.list` - Lista versões de um app
- `version.get` - Obtém detalhes de uma versão específica

**Configuração** (variáveis de ambiente):

```bash
APP_STORE_CONNECT_ISSUER_ID=your_issuer_id
APP_STORE_CONNECT_KEY_ID=your_key_id
APP_STORE_CONNECT_PRIVATE_KEY=your_private_key_base64_or_pem
```

**Status**: ✅ Implementado (skeleton completo, API real requer JWT library)

**Nota**: Implementação completa requer biblioteca JWT (`jsonwebtoken` ou `jose`) para gerar tokens de autenticação.

---

### GooglePlayConsoleMCPServer

**Arquivo**: `src/mcp/servers/GooglePlayConsoleMCPServer.ts`

**Métodos disponíveis**:

- `track.list` - Lista tracks de um app (production, beta, alpha, internal)
- `anr.getStats` - Obtém estatísticas de ANR (Application Not Responding)
- `dataSafety.getIssues` - Obtém issues de Data Safety
- `release.getStatus` - Obtém status de release em um track específico

**Configuração** (variáveis de ambiente):

```bash
GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PLAY_PRIVATE_KEY=your_private_key_base64_or_json
GOOGLE_PLAY_PACKAGE_NAME=com.nossamaternidade.app
```

**Status**: ✅ Implementado (skeleton completo, API real requer OAuth2 library)

**Nota**: Implementação completa requer biblioteca OAuth2 (`google-auth-library`) para gerar access tokens.

---

## 🤖 ReleaseOpsAgent

**Arquivo**: `src/agents/release/ReleaseOpsAgent.ts`

Agente especializado em operações de release e saúde de app em produção.

### Métodos Principais

#### `process(input: ReleaseOpsInput)`

Analisa readiness de um release e retorna relatório completo.

**Input**:
```typescript
{
  release?: string;        // Versão do release (default: 'current')
  sinceDate?: string;      // Data para filtrar crashes
  appId?: string;          // App Store Connect app ID
  packageName?: string;     // Google Play package name
}
```

**Output**: `ReleaseReadinessReport`

**Exemplo de uso**:
```typescript
import { releaseOpsAgent } from '@/agents';

const report = await releaseOpsAgent.process({
  release: '1.0.3',
  appId: '1234567890',
  packageName: 'com.nossamaternidade.app',
});

console.log(report.isReady); // true/false
console.log(report.recommendations); // Array de recomendações
```

#### `getStoreStatusSummary(input?)`

Obtém resumo de status das stores (iOS e Android).

**Exemplo**:
```typescript
const summary = await releaseOpsAgent.getStoreStatusSummary({
  appId: '1234567890',
  packageName: 'com.nossamaternidade.app',
});

console.log(summary.ios?.state); // 'READY_FOR_SALE', 'IN_REVIEW', etc.
console.log(summary.android?.status); // 'completed', 'draft', etc.
```

#### `listCriticalCrashesSince(sinceDate, release?)`

Lista crashes críticos desde uma data específica.

**Exemplo**:
```typescript
const crashes = await releaseOpsAgent.listCriticalCrashesSince(
  '2025-12-01',
  '1.0.3'
);

crashes.forEach(crash => {
  console.log(`${crash.title}: ${crash.count} ocorrências`);
});
```

### Integração com AgentOrchestrator

O `ReleaseOpsAgent` usa o `AgentOrchestrator` para fazer chamadas MCP:

```typescript
// Internamente, o agente faz:
await orchestrator.callMCP('sentry', 'health.checkCrashRate', {
  release: '1.0.3',
  threshold: 1.5,
});
```

## 🔧 Configuração e Uso

### 1. Variáveis de Ambiente

Adicione as variáveis necessárias ao `.env` ou `app.json`:

```bash
# Sentry
SENTRY_AUTH_TOKEN=...
SENTRY_ORG_SLUG=nossa-maternidade
SENTRY_PROJECT_SLUG=nossa-maternidade-mobile

# App Store Connect
APP_STORE_CONNECT_ISSUER_ID=...
APP_STORE_CONNECT_KEY_ID=...
APP_STORE_CONNECT_PRIVATE_KEY=...

# Google Play Console
GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PLAY_PRIVATE_KEY=...
GOOGLE_PLAY_PACKAGE_NAME=com.nossamaternidade.app
```

### 2. Inicialização

Os MCPs são carregados automaticamente via `AgentOrchestrator` quando necessário (lazy loading). O `ReleaseOpsAgent` pode ser inicializado sob demanda:

```typescript
import { releaseOpsAgent } from '@/agents';

// Inicializar (se necessário)
await releaseOpsAgent.initialize();

// Usar
const report = await releaseOpsAgent.process({ release: '1.0.3' });
```

### 3. Integração no AgentsContext

Para usar no contexto React Native, adicione ao `AgentsContext`:

```typescript
// src/contexts/AgentsContext.tsx
import { ReleaseOpsAgent, releaseOpsAgent } from '@/agents';

// No provider:
const [releaseOpsAgentState, setReleaseOpsAgent] = useState<ReleaseOpsAgent | null>(null);

// Inicializar sob demanda:
const initializeReleaseOps = useCallback(async () => {
  if (!releaseOpsAgentState) {
    await releaseOpsAgent.initialize();
    setReleaseOpsAgent(releaseOpsAgent);
  }
}, [releaseOpsAgentState]);
```

## 📊 Exemplos de Perguntas que o Agente Responde

- "Este release está saudável o suficiente para promover?"
- "Qual o crash rate da versão 1.0.3?"
- "Quais os principais crashes da última versão?"
- "Em que estágio está a última build no App Store Connect?"
- "O que está em produção no Google Play Console?"
- "Há issues de Data Safety pendentes?"

## 🚧 Próximos Passos

### Integrações Reais de API

1. **SentryMCPServer**: ✅ Pronto (requer apenas token configurado)
2. **AppStoreConnectMCPServer**: ⚠️ Requer biblioteca JWT (`jsonwebtoken` ou `jose`)
3. **GooglePlayConsoleMCPServer**: ⚠️ Requer biblioteca OAuth2 (`google-auth-library`)

### Melhorias Futuras

- [ ] Implementar cache de resultados (evitar múltiplas chamadas)
- [ ] Adicionar alertas automáticos (crash rate alto, rejection, etc)
- [ ] Integrar com CI/CD (bloquear deploy se não saudável)
- [ ] Dashboard de métricas agregadas
- [ ] Histórico de releases e tendências

### Outros MCPs Planejados

- `NotificationMCPServer` - Push notifications (OneSignal/Expo)
- `DocsMCPServer` - Documentação (Notion/GitHub)
- `RevenueCatMCPServer` - Monetização e assinaturas

## 📝 Notas Técnicas

- **Lazy Loading**: Os MCPs de produção são carregados sob demanda (não são essenciais no startup)
- **Error Handling**: Todos os métodos retornam `null` ou arrays vazios em caso de erro (graceful degradation)
- **TypeScript Strict**: Todos os tipos são strict, zero `any`
- **Logging**: Usa `logger` do projeto (nunca `console.log`)

## 🔐 Segurança e Compatibilidade Mobile

### Arquitetura de Segurança

Todos os MCP Servers de Release Ops usam **Edge Functions** como proxy para manter tokens seguros no servidor:

- **SentryMCPServer** → `supabase/functions/sentry-proxy`
- **AppStoreConnectMCPServer** → `supabase/functions/appstore-proxy`
- **GooglePlayConsoleMCPServer** → `supabase/functions/googleplay-proxy`

**Benefícios:**
- ✅ Tokens nunca expostos no bundle do app
- ✅ Compatível com React Native (sem `process.env` direto)
- ✅ Compatível com iOS/Android (sem `Buffer` do Node.js)
- ✅ Centralização de autenticação no servidor

### Configuração de Variáveis de Ambiente

**No App (app.config.js):**
```javascript
extra: {
  sentryAuthToken: process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN || '',
  sentryOrgSlug: process.env.EXPO_PUBLIC_SENTRY_ORG_SLUG || 'nossa-maternidade',
  // ... outras variáveis
}
```

**Nas Edge Functions (Deno.env):**
```bash
# Configurar no Supabase Dashboard ou via CLI
supabase secrets set SENTRY_AUTH_TOKEN=your_token_here
supabase secrets set APP_STORE_CONNECT_ISSUER_ID=your_issuer_id
supabase secrets set APP_STORE_CONNECT_KEY_ID=your_key_id
supabase secrets set APP_STORE_CONNECT_PRIVATE_KEY=your_private_key
supabase secrets set GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL=your_email
supabase secrets set GOOGLE_PLAY_PRIVATE_KEY=your_private_key
```

### Utilitários Criados

- **`src/mcp/utils/envConfig.ts`**: Acesso centralizado a variáveis via `Constants.expoConfig` (mobile-safe)
- **`src/utils/base64.ts`**: Helper de base64 compatível com React Native (substitui `Buffer`)

## 🔗 Referências

- [Sentry API Docs](https://docs.sentry.io/api/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Google Play Console API](https://developers.google.com/android-publisher)

## 📚 Exemplos Práticos

Veja `EXEMPLO_USO_RELEASE_OPS.md` para exemplos completos de uso do `ReleaseOpsAgent`.

## 🚀 Deploy das Edge Functions

Para ativar os MCPs em produção:

```bash
# Deploy das Edge Functions
supabase functions deploy sentry-proxy
supabase functions deploy appstore-proxy
supabase functions deploy googleplay-proxy

# Configurar secrets
supabase secrets set SENTRY_AUTH_TOKEN=your_token
# ... (ver seção de configuração acima)
```

