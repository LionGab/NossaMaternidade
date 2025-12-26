# ✅ CONFIGURAÇÃO FINAL COMPLETA - NOSSA MATERNIDADE

**Data**: 26 de Dezembro de 2025  
**Status**: Aguardando execução  
**Tempo estimado**: 2-3 horas

---

## 📋 RESUMO EXECUTIVO

Este documento lista **TUDO** que precisa ser configurado para deixar o app 100% funcional para produção.

**Pendências críticas:**

1. ✅ Código está pronto
2. ⚠️ Deploy das Edge Functions do Supabase (requer Access Token)
3. ⚠️ Configurar Secrets no EAS (para builds de produção)
4. ⚠️ Configurar Webhook do RevenueCat no Dashboard
5. ⚠️ Criar produtos de assinatura no App Store Connect e Google Play Console

---

## 🎯 PARTE 1: SUPABASE EDGE FUNCTIONS

### O que precisa

**Supabase Access Token** para fazer o deploy das 12 Edge Functions.

### Como obter o Access Token

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em **"Generate new token"**
3. Nome: `Deploy Token Nossa Maternidade`
4. Copie o token gerado (formato: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
5. **Guarde em local seguro** (só aparece uma vez!)

### Funções que serão deployadas

Total: **12 Edge Functions**

1. `ai` - Integração com APIs de IA (Gemini, Claude, OpenAI)
2. `transcribe` - Transcrição de áudio
3. `notifications` - Push notifications
4. `upload-image` - Upload de imagens
5. `delete-account` - Deletar conta do usuário
6. `analytics` - Analytics e tracking
7. `moderate-content` - Moderação de conteúdo da comunidade
8. `export-data` - Exportar dados do usuário (LGPD)
9. `elevenlabs-tts` - Text-to-speech com ElevenLabs
10. `webhook` - Webhook do RevenueCat (CRÍTICO para monetização)
11. `community-feed` - Feed da comunidade
12. `mundo-nath-feed` - Feed do Mundo Nath

### Comando para deploy

**OPÇÃO 1: Script automatizado (recomendado)**

```bash
cd /Users/lion/Documents/Lion/NossaMaternidade
export SUPABASE_ACCESS_TOKEN="sbp_SEU_TOKEN_AQUI"
bash scripts/deploy-edge-functions.sh
```

**OPÇÃO 2: Deploy manual (uma por uma)**

```bash
# 1. Login no Supabase CLI
npx supabase login

# 2. Link do projeto (se ainda não linkou)
npx supabase link --project-ref lqahkqfpynypbmhtffyi

# 3. Setar Access Token
export SUPABASE_ACCESS_TOKEN="sbp_SEU_TOKEN_AQUI"

# 4. Deploy de todas as funções
npx supabase functions deploy ai --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy transcribe --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy notifications --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy upload-image --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy delete-account --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy analytics --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy moderate-content --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy export-data --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy elevenlabs-tts --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy webhook --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy community-feed --project-ref lqahkqfpynypbmhtffyi
npx supabase functions deploy mundo-nath-feed --project-ref lqahkqfpynypbmhtffyi
```

### Verificar deploy bem-sucedido

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/functions
2. Confirme que todas as 12 funções aparecem como "Active"
3. Teste o webhook: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/health
   - Deve retornar: `{"status":"ok","service":"webhook"}`

### Secrets necessários nas Edge Functions

As Edge Functions precisam destes secrets no Supabase (já devem estar configurados, mas verifique):

```bash
# Ver secrets configurados
npx supabase secrets list --project-ref lqahkqfpynypbmhtffyi

# Se faltar algum, configure:
npx supabase secrets set NOME_DO_SECRET="valor" --project-ref lqahkqfpynypbmhtffyi
```

**Secrets necessários:**

- `GEMINI_API_KEY` - API key do Google Gemini
- `OPENAI_API_KEY` - API key do OpenAI (fallback)
- `ANTHROPIC_API_KEY` - API key do Claude/Anthropic (fallback)
- `REVENUECAT_WEBHOOK_SECRET` - Secret do webhook (já configurado: `925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525`)
- `ELEVENLABS_API_KEY` - API key do ElevenLabs (se usar TTS)

---

## 🎯 PARTE 2: EAS SECRETS (BUILDS DE PRODUÇÃO)

### O que precisa

Configurar todas as variáveis de ambiente no EAS para que os builds de produção funcionem.

### Pré-requisitos

```bash
# 1. Instalar EAS CLI (se não tiver)
npm install -g eas-cli

# 2. Login no EAS
eas login

# 3. Configurar projeto (se ainda não configurou)
cd /Users/lion/Documents/Lion/NossaMaternidade
eas build:configure
```

### Secrets obrigatórios

Execute estes comandos (substitua os valores pelos seus):

```bash
# ===== SUPABASE =====
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co" --scope project

eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "SUA_ANON_KEY_AQUI" --scope project

eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1" --scope project

# ===== REVENUECAT (iOS) =====
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_qYAhdJlewUtgaKBDWEAmZsCRIqK" --scope project

# ===== REVENUECAT (Android) =====
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_YSHALitkRyhugtDvYVVQVmqrqDu" --scope project
```

### Onde encontrar os valores

**Supabase Anon Key:**

1. Acesse: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/api
2. Em "Project API keys", copie a **"anon/public"** key
3. Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**RevenueCat Keys:**

- iOS: `appl_qYAhdJlewUtgaKBDWEAmZsCRIqK` (já fornecido)
- Android: `goog_YSHALitkRyhugtDvYVVQVmqrqDu` (já fornecido)

### Secrets opcionais (recomendados para produção)

```bash
# ===== SENTRY (Error Tracking) =====
eas env:create --name EXPO_PUBLIC_SENTRY_DSN --value "SUA_SENTRY_DSN_AQUI" --scope project --sensitive

# ===== IMGUR (Upload de imagens) =====
eas env:create --name EXPO_PUBLIC_IMGUR_CLIENT_ID --value "SUA_IMGUR_CLIENT_ID_AQUI" --scope project
```

### Validar secrets configurados

```bash
# Listar todos os secrets
eas env:list

# Validar usando script
node scripts/validate-secrets.js
```

---

## 🎯 PARTE 3: REVENUECAT WEBHOOK

### O que precisa

Configurar o webhook do RevenueCat no Dashboard para que eventos de assinatura sejam processados.

### Status atual

- ✅ Código implementado: `supabase/functions/webhook/index.ts`
- ✅ Deploy: Edge Function ativa em `https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat`
- ✅ Secret configurado no Supabase
- ⚠️ **PENDENTE**: Configurar no RevenueCat Dashboard

### Passo a passo no Dashboard

1. **Acesse**: https://app.revenuecat.com
2. **Selecione**: Projeto "Nossa Maternidade"
3. **Navegue**: Project Settings → Integrations → Webhooks
4. **Clique**: "+ Add Webhook" ou "Create Webhook"

### Campos a preencher

```
Webhook name: Nossa Maternidade Webhook
Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
Authorization header value: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
Environment: ✅ Production + ✅ Sandbox
App: ✅ All apps
Event type: ✅ All events
```

**Eventos importantes:**

- ✅ INITIAL_PURCHASE
- ✅ RENEWAL
- ✅ CANCELLATION
- ✅ UNCANCELLATION
- ✅ EXPIRATION
- ✅ BILLING_ISSUE
- ✅ PRODUCT_CHANGE
- ✅ SUBSCRIPTION_PAUSED

5. **Clique**: "Save" ou "Create"

### Testar webhook

1. No RevenueCat Dashboard, após salvar o webhook
2. Clique em **"Test"** ou **"Send Test Event"**
3. Selecione event type: **TEST**
4. Clique em **"Send"**

**Verificar logs:**

```bash
npx supabase functions logs webhook --tail --project-ref lqahkqfpynypbmhtffyi
```

Deve aparecer: `✅ [WEBHOOK] RevenueCat event: TEST`

### Verificar no banco de dados

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/editor
2. Vá na tabela `webhook_transactions`
3. Deve aparecer uma linha com:
   - `source`: "revenuecat"
   - `event_type`: "TEST"
   - `status`: "processed"

---

## 🎯 PARTE 4: APP STORE CONNECT (iOS)

### O que precisa

Criar os produtos de assinatura no App Store Connect.

### Produtos necessários

| Product ID                                  | Tipo                        | Preço    | Duração |
| ------------------------------------------- | --------------------------- | -------- | ------- |
| `com.nossamaternidade.subscription.monthly` | Auto-Renewable Subscription | R$ 19,90 | 1 mês   |
| `com.nossamaternidade.subscription.annual`  | Auto-Renewable Subscription | R$ 79,90 | 1 ano   |

### Passo a passo

1. **Acesse**: https://appstoreconnect.apple.com
2. **Vá em**: My Apps → Nossa Maternidade → Subscriptions
3. **Crie Subscription Group**: "Premium" (se ainda não existir)

#### Criar Subscription Mensal

1. **Clique**: "+" para criar nova subscription
2. **Reference Name**: "Premium Monthly"
3. **Subscription ID**: `com.nossamaternidade.subscription.monthly`
4. **Price**: R$ 19,90 / mês
5. **Subscription Duration**: 1 Month
6. **Localization**: Português (Brasil)
   - Name: "Assinatura Mensal Premium"
   - Description: "Acesso ilimitado ao chat NathIA, comunidade premium e todos os recursos avançados."
7. **Review Information**: Preencha conforme necessário
8. **Salve** e **Submit for Review** (se aplicável)

#### Criar Subscription Anual

1. Repita o processo acima com:
   - **Subscription ID**: `com.nossamaternidade.subscription.annual`
   - **Price**: R$ 79,90 / ano
   - **Subscription Duration**: 1 Year

### Configurar Server Notifications (IMPORTANTE)

1. **Vá em**: App Store Connect → My Apps → Nossa Maternidade → App Information
2. **Scroll até**: "App Store Server Notifications"
3. **Production Server URL**:
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
   ```
4. **Sandbox Server URL** (opcional, usar o mesmo):
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
   ```
5. **Salve**

---

## 🎯 PARTE 5: GOOGLE PLAY CONSOLE (Android)

### O que precisa

Criar os produtos de assinatura no Google Play Console.

### Produtos necessários

| Product ID                                  | Tipo         | Preço    | Duração |
| ------------------------------------------- | ------------ | -------- | ------- |
| `com.nossamaternidade.subscription.monthly` | Subscription | R$ 19,90 | 1 mês   |
| `com.nossamaternidade.subscription.annual`  | Subscription | R$ 79,90 | 1 ano   |

### Passo a passo

1. **Acesse**: https://play.google.com/console
2. **Selecione**: App "Nossa Maternidade"
3. **Vá em**: Monetize → Products → Subscriptions
4. **Crie base plan** (se necessário)

#### Criar Subscription Mensal

1. **Clique**: "Create subscription"
2. **Product ID**: `com.nossamaternidade.subscription.monthly`
3. **Name**: "Assinatura Mensal Premium"
4. **Description**: "Acesso ilimitado ao chat NathIA, comunidade premium e todos os recursos avançados."
5. **Billing period**: 1 month
6. **Price**: R$ 19,90
7. **Free trial**: Opcional (ex: 7 dias)
8. **Salve**

#### Criar Subscription Anual

1. Repita com:
   - **Product ID**: `com.nossamaternidade.subscription.annual`
   - **Price**: R$ 79,90
   - **Billing period**: 1 year

### Configurar Real-time Developer Notifications

1. **Vá em**: Google Play Console → Your App → Setup → App Integrity
2. **Scroll até**: "Real-time developer notifications"
3. **Add notification URL**:
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
   ```
4. **Authorization**: (Deixe em branco ou configure Bearer token se necessário)
5. **Salve**

---

## 🎯 PARTE 6: REVENUECAT DASHBOARD

### Configurar Entitlements

1. **Acesse**: https://app.revenuecat.com
2. **Vá em**: Entitlements
3. **Criar Entitlement**:
   - **Identifier**: `premium`
   - **Display Name**: "Premium"
   - **Description**: "Acesso premium completo"

### Configurar Products

1. **Vá em**: Products
2. **Criar Product para iOS**:
   - **Identifier**: `com.nossamaternidade.subscription.monthly`
   - **Type**: Subscription
   - **Store**: App Store Connect
   - **Attach to Entitlement**: `premium`
3. **Repetir para**:
   - `com.nossamaternidade.subscription.annual` (iOS)
   - `com.nossamaternidade.subscription.monthly` (Google Play)
   - `com.nossamaternidade.subscription.annual` (Google Play)

### Configurar Offerings

1. **Vá em**: Offerings
2. **Criar Offering**:
   - **Identifier**: `default`
   - **Display Name**: "Premium Plans"
3. **Adicionar Packages**:
   - Monthly Package → Attach `com.nossamaternidade.subscription.monthly`
   - Annual Package → Attach `com.nossamaternidade.subscription.annual`

---

## ✅ CHECKLIST FINAL

### Supabase

- [ ] Access Token obtido
- [ ] Login no Supabase CLI realizado
- [ ] Projeto linkado (`supabase link`)
- [ ] Todas as 12 Edge Functions deployadas
- [ ] Secrets configurados (GEMINI_API_KEY, OPENAI_API_KEY, etc.)
- [ ] Webhook testado e funcionando

### EAS

- [ ] EAS CLI instalado e logado
- [ ] Projeto configurado (`eas build:configure`)
- [ ] Todos os secrets obrigatórios configurados
- [ ] Secrets validados (`node scripts/validate-secrets.js`)

### RevenueCat

- [ ] Webhook configurado no Dashboard
- [ ] Webhook testado e retornando sucesso
- [ ] Entitlement `premium` criado
- [ ] Products criados (iOS e Android)
- [ ] Offering `default` configurado

### App Store Connect

- [ ] Subscription Group criado
- [ ] Subscription mensal criada
- [ ] Subscription anual criada
- [ ] Server Notifications URL configurada

### Google Play Console

- [ ] Subscription mensal criada
- [ ] Subscription anual criada
- [ ] Real-time Developer Notifications configuradas

---

## 🚀 PRÓXIMOS PASSOS APÓS CONFIGURAÇÃO

1. **Testar pagamentos end-to-end**:
   - Build de desenvolvimento com RevenueCat
   - Testar compra mensal e anual
   - Verificar webhook processando eventos
   - Confirmar premium ativado no Supabase

2. **Build de produção**:

   ```bash
   npm run build:prod:ios
   npm run build:prod:android
   ```

3. **Submissão às lojas**:
   ```bash
   npm run submit:prod:ios
   npm run submit:prod:android
   ```

---

## 📞 SUPORTE E DOCUMENTAÇÃO

- **Supabase**: https://supabase.com/docs
- **EAS**: https://docs.expo.dev/build/introduction/
- **RevenueCat**: https://www.revenuecat.com/docs
- **App Store Connect**: https://developer.apple.com/app-store-connect/
- **Google Play Console**: https://developer.android.com/distribute/console

---

**Última atualização**: 26 de Dezembro de 2025  
**Status**: ⚠️ Aguardando execução
