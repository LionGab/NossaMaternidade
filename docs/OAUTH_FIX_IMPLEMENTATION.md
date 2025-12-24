# 🔧 Correção OAuth Apple/Google - Implementação

## ✅ Correções Aplicadas

### 1. **Fluxo de Sessão Corrigido**

**Problema**: O código estava tentando extrair tokens manualmente da URL usando `url.hash`, mas não suportava PKCE flow (que usa `code`).

**Solução**: Implementado `createSessionFromRedirect()` que suporta:
- ✅ **PKCE flow**: `code` → `exchangeCodeForSession()`
- ✅ **Implicit flow**: `access_token` + `refresh_token` → `setSession()`

```typescript
async function createSessionFromRedirect(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  
  // PKCE (code)
  if (params?.code) {
    return await client.auth.exchangeCodeForSession(params.code);
  }
  
  // Implicit (tokens)
  if (params?.access_token && params?.refresh_token) {
    return await client.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
  }
}
```

### 2. **Supabase Client Configurado Corretamente**

**Antes**:
```typescript
detectSessionInUrl: typeof window !== "undefined", // ❌ ERRADO
```

**Depois**:
```typescript
detectSessionInUrl: false, // ✅ CORRETO para React Native/Expo
```

**Por quê**: Em native (Expo), não podemos depender do auto-detect. O fluxo manual via `createSessionFromRedirect()` cuida da sessão.

### 3. **Redirect URI Padronizado**

**Antes**: `nossamaternidade://auth/callback` (com barra)

**Depois**: `nossamaternidade://auth-callback` (sem barra, conforme padrão Supabase)

### 4. **Uso de QueryParams do expo-auth-session**

Substituído parsing manual por `QueryParams.getQueryParams()` que trata corretamente:
- Hash fragments (`#access_token=...`)
- Query strings (`?code=...`)
- Erros (`?error=...`)

---

## 📋 Checklist de Configuração

### ✅ 1. Expo app.config.js

```javascript
scheme: "nossamaternidade", // ✅ Já configurado
```

### ⚠️ 2. Supabase Dashboard → Auth → URL Configuration

**CRÍTICO**: Adicionar o redirect URI nas URLs permitidas:

1. Acesse: Supabase Dashboard → Authentication → URL Configuration
2. Em **"Additional Redirect URLs"**, adicione:
   ```
   nossamaternidade://auth-callback
   ```
3. Salve

### ⚠️ 3. Google OAuth Configuration

**No Google Cloud Console**:

1. Criar **OAuth Client ID** tipo **"Web application"** (NÃO Android/iOS)
2. Em **"Authorized redirect URIs"**, adicionar:
   ```
   https://<seu-project-ref>.supabase.co/auth/v1/callback
   ```
   (Esse URL aparece na página do provider Google no Supabase Dashboard)

3. Copiar **Client ID** e **Client Secret**
4. No Supabase Dashboard → Authentication → Providers → Google:
   - Colar Client ID
   - Colar Client Secret
   - Salvar

**IMPORTANTE**: Se você tiver múltiplos client IDs (Android/iOS/Web), o Supabase recomenda concatenar com vírgula, colocando o **Web primeiro**:
```
web-client-id,android-client-id,ios-client-id
```

### ⚠️ 4. Apple OAuth Configuration

**No Apple Developer**:

1. Criar **Service ID** para OAuth
2. Configurar **Return URLs**:
   ```
   https://<seu-project-ref>.supabase.co/auth/v1/callback
   ```
3. No Supabase Dashboard → Authentication → Providers → Apple:
   - Colar Service ID
   - Colar Team ID
   - Colar Key ID
   - Colar Private Key (.p8)
   - Salvar

---

## 🧪 Como Testar

### Teste Apple (iOS)

1. Executar app: `npm run ios`
2. Clicar em "Continuar com Apple"
3. **Esperado**: 
   - Abre modal Apple Sign In
   - Após autenticar, volta pro app
   - Sessão criada automaticamente
   - Navega para Home (não fica preso na tela de login)

### Teste Google

1. Executar app: `npm run android` ou `npm run ios`
2. Clicar em "Continuar com Google"
3. **Esperado**:
   - Abre browser para login Google
   - Após autenticar, volta pro app
   - Sessão criada automaticamente
   - Navega para Home

### Debug

Se ainda der erro:

1. **Verificar logs**:
   ```bash
   # No terminal do Expo
   # Procurar por logs do logger.info/error com contexto "SocialAuth"
   ```

2. **Verificar redirect URI**:
   - Deve aparecer nos logs: `redirectUri: nossamaternidade://auth-callback`
   - Deve estar configurado no Supabase Dashboard

3. **Verificar erro específico**:
   - Se `redirect_uri_mismatch`: Google OAuth mal configurado (client type errado)
   - Se `provider not enabled`: Provider não habilitado no Supabase
   - Se `session null`: `createSessionFromRedirect()` não está sendo chamado ou falhou

---

## 📝 Arquivos Modificados

1. ✅ `src/api/social-auth.ts` - Fluxo OAuth corrigido
2. ✅ `src/api/supabase.ts` - `detectSessionInUrl: false`
3. ✅ `docs/OAUTH_FIX_IMPLEMENTATION.md` - Esta documentação

---

## 🔗 Referências

- [Supabase OAuth para Expo](https://supabase.com/docs/guides/auth/social-login/auth-google#expo)
- [expo-auth-session QueryParams](https://docs.expo.dev/versions/latest/sdk/auth-session/#queryparams)
- [Supabase React Native Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

---

**Última atualização**: 24/12/2025
**Status**: ✅ Implementado e pronto para teste

