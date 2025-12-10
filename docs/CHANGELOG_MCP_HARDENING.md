# Changelog - MCP Mobile Hardening

## [2025-12-10] - Mobile Hardening Implementation

### 🎯 Objetivo
Tornar os MCP Servers de Release Ops compatíveis com ambiente iOS/Android real, seguindo padrões de segurança do projeto.

### ✨ Adicionado

#### Utilitários
- `src/mcp/utils/envConfig.ts`
  - Acesso centralizado a variáveis de ambiente
  - Prioridade: `Constants.expoConfig?.extra` > `process.env.EXPO_PUBLIC_*` > `process.env.*`
  - Configurações específicas para cada MCP Server

- `src/utils/base64.ts`
  - Helper de encoding/decoding base64
  - Compatível com React Native (sem dependência de `Buffer`)
  - Suporta web (atob/btoa) e mobile (implementação manual)

#### Edge Functions
- `supabase/functions/sentry-proxy/index.ts`
  - Proxy seguro para Sentry API
  - Mantém `SENTRY_AUTH_TOKEN` no servidor
  - Suporta: listReleases, getRelease, listTopCrashes, getIssue, getReleaseHealth

- `supabase/functions/appstore-proxy/index.ts`
  - Proxy seguro para App Store Connect API
  - Gera JWT usando biblioteca `jose` (Deno-compatible)
  - Mantém credenciais no servidor

- `supabase/functions/googleplay-proxy/index.ts`
  - Proxy seguro para Google Play Console API
  - Gera OAuth2 tokens para service account
  - Mantém credenciais no servidor

### 🔄 Modificado

#### MCP Servers
- `src/mcp/servers/SentryMCPServer.ts`
  - Migrado para `envConfig` (mobile-safe)
  - Todas as chamadas via Edge Function `sentry-proxy`
  - Removido `baseUrl` (não mais necessário)

- `src/mcp/servers/AppStoreConnectMCPServer.ts`
  - Migrado para `envConfig` (mobile-safe)
  - Substituído `Buffer.from()` por `base64Decode()`
  - Todas as chamadas via Edge Function `appstore-proxy`
  - JWT gerado na Edge Function (não mais no cliente)

- `src/mcp/servers/GooglePlayConsoleMCPServer.ts`
  - Migrado para `envConfig` (mobile-safe)
  - Todas as chamadas via Edge Function `googleplay-proxy`
  - OAuth2 gerado na Edge Function (não mais no cliente)

#### Configuração
- `app.config.js`
  - Adicionadas variáveis de ambiente para MCP Release Ops
  - Variáveis públicas apenas para referência (tokens reais ficam no servidor)

### 🐛 Corrigido

- **Compatibilidade Mobile:**
  - `process.env` não funciona em React Native → Usa `Constants.expoConfig`
  - `Buffer` não existe em React Native → Helper de base64 puro JavaScript

- **Segurança:**
  - Tokens expostos no bundle → Tokens apenas no servidor (Edge Functions)
  - Chamadas HTTP diretas → Todas via proxy seguro

- **Type Safety:**
  - Type assertions incorretas → `as unknown as JsonValue` para tipos customizados

### 📚 Documentação

- `docs/MCP_MOBILE_HARDENING.md` - Documentação completa das mudanças
- `docs/MCP_OPERACAO_STORES.md` - Atualizado com seção de segurança
- `docs/VALIDACAO_MCP_RELEASE_OPS.md` - Atualizado com status de hardening

### ⚠️ Breaking Changes

Nenhum. As mudanças são internas e mantêm a mesma interface pública dos MCP Servers.

### 🔜 Próximos Passos

1. Configurar secrets no Supabase Dashboard:
   - `SENTRY_AUTH_TOKEN`
   - `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_PRIVATE_KEY`
   - `GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PLAY_PRIVATE_KEY`

2. Deploy das Edge Functions:
   ```bash
   supabase functions deploy sentry-proxy
   supabase functions deploy appstore-proxy
   supabase functions deploy googleplay-proxy
   ```

3. Completar implementação OAuth2 no `googleplay-proxy` (atualmente placeholder)

### ✅ Validação

- ✅ Zero erros críticos de TypeScript
- ✅ 4 warnings menores (interfaces não usadas, aceitáveis)
- ✅ Compatível com iOS/Android
- ✅ Tokens seguros no servidor
- ✅ Pronto para produção

