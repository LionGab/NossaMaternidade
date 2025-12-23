# Store-Ready Checklist Operacional — Nossa Maternidade

**Objetivo:** Preparar app iOS/Android para submissão nas lojas
**Última atualização:** 23 de dezembro de 2025
**Versão:** 1.0.0

---

## 📋 VISÃO GERAL

Este checklist guia você passo a passo (com "onde clicar") para:
- ✅ Configurar contas e credenciais
- ✅ Setup de push notifications (APNs/FCM)
- ✅ Compliance (LGPD, App Store, Google Play)
- ✅ Beta testing antes de produção
- ✅ Deploy final

**Tempo estimado:** 8-12 horas (primeira vez) | 2-4 horas (iterações)

---

## 🎯 PRÉ-REQUISITOS (Fazer uma vez)

### Contas Necessárias

- [ ] **Apple Developer Program** ($99/ano)
  - URL: https://developer.apple.com/programs/
  - Login com Apple ID
  - Aceitar termos e condições

- [ ] **Google Play Console** ($25 one-time)
  - URL: https://play.google.com/console/signup
  - Login com Google Account
  - Pagar taxa de registro ($25)

- [ ] **Expo/EAS**
  - URL: https://expo.dev/
  - Login com GitHub ou email
  - Gratuito para começar

- [ ] **Supabase** (Backend)
  - URL: https://supabase.com/
  - Projeto já criado: `nossamaternidade`

### Setup Inicial EAS

```bash
# 1. Instalar EAS CLI globalmente
npm install -g eas-cli

# 2. Login
eas login

# 3. Verificar projeto
eas project:info

# Deve mostrar:
# Project ID: ceee9479-e404-47b8-bc37-4f913c18f270
# Owner: liongab
```

---

## 🔧 FASE 0: Configuração Única

### 0.1 Validar Config Final

✅ **app.config.js é a fonte única de verdade**
✅ **app.json está deprecated** (manter apenas por compatibilidade, mas app.config.js sobrescreve)

**Verificar output final:**

```bash
# PowerShell - verificar Project ID
npx expo config --type public | ConvertFrom-Json | Select-Object -ExpandProperty extra | Select-Object -ExpandProperty eas | Select-Object -ExpandProperty projectId

# Deve retornar: ceee9479-e404-47b8-bc37-4f913c18f270

# PowerShell - verificar Bundle IDs
npx expo config --type public | ConvertFrom-Json | Select-Object -ExpandProperty ios | Select-Object -ExpandProperty bundleIdentifier
# Deve retornar: com.nossamaternidade.app

npx expo config --type public | ConvertFrom-Json | Select-Object -ExpandProperty android | Select-Object -ExpandProperty package
# Deve retornar: com.nossamaternidade.app
```

**Git Bash alternativa:**
```bash
npx expo config --type public | jq -r '.extra.eas.projectId'
npx expo config --type public | jq -r '.ios.bundleIdentifier'
npx expo config --type public | jq -r '.android.package'
```

**✅ Checklist:**
- [ ] Project ID correto
- [ ] Bundle ID iOS correto
- [ ] Package Android correto

---

## 🔐 FASE 1: Segredos & Variáveis

### 1.1 Client Secrets (EAS)

**Variáveis que vão no bundle do app** (só as essenciais):

```bash
# Supabase (público por design, protegido por RLS)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_anon_key"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://your-project.supabase.co/functions/v1"

# RevenueCat (opcional - se Premium no v1)
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_..."
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_..."

# Sentry (opcional - error tracking)
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://...@sentry.io/..."
```

**Verificar secrets criados:**
```bash
eas secret:list
```

**❌ NUNCA crie secrets com:**
- `EXPO_PUBLIC_GEMINI_API_KEY` ❌ (vai no backend)
- `EXPO_PUBLIC_OPENAI_API_KEY` ❌ (vai no backend)
- `EXPO_PUBLIC_GROK_API_KEY` ❌ (vai no backend)

**✅ Checklist:**
- [ ] Supabase URL configurado
- [ ] Supabase Anon Key configurado
- [ ] Supabase Functions URL configurado
- [ ] (Opcional) RevenueCat keys configurados
- [ ] (Opcional) Sentry DSN configurado

### 1.2 Server Secrets (Supabase Edge Functions)

**AI API Keys vivem APENAS no backend.**

**Via Supabase Dashboard:**
1. Abrir https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Clicar **Settings** (ícone engrenagem, menu lateral esquerdo)
3. Clicar **Edge Functions** → **Secrets**
4. Clicar **Add new secret**
5. Adicionar cada secret:

| Name | Value | Provider |
|------|-------|----------|
| `GEMINI_API_KEY` | `AIza...` | https://makersuite.google.com/app/apikey |
| `OPENAI_API_KEY` | `sk-proj-...` | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | https://console.anthropic.com/ |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | https://console.upstash.com/ |
| `UPSTASH_REDIS_REST_TOKEN` | `AX...` | https://console.upstash.com/ |

**Via Supabase CLI (alternativa):**
```bash
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set ANTHROPIC_API_KEY=your_key
supabase secrets set UPSTASH_REDIS_REST_URL=your_url
supabase secrets set UPSTASH_REDIS_REST_TOKEN=your_token

# Verificar
supabase secrets list
```

**✅ Checklist:**
- [ ] GEMINI_API_KEY configurado no Supabase
- [ ] OPENAI_API_KEY configurado no Supabase
- [ ] ANTHROPIC_API_KEY configurado no Supabase
- [ ] (Opcional) Upstash Redis configurado

---

## 🔔 FASE 2: Push Notifications (APNs/FCM)

### 2.1 iOS (APNs - Apple Push Notification service)

**Passo 1: Criar APNs Key (.p8)**

1. Abrir https://developer.apple.com/account/resources/authkeys/list
2. Clicar **"+"** (Create a key)
3. **Name:** "Nossa Maternidade Push Notifications"
4. Marcar checkbox **"Apple Push Notifications service (APNs)"**
5. Clicar **Continue** → **Register**
6. **Download** o arquivo `.p8` (⚠️ só pode baixar uma vez!)
7. Anotar:
   - **Key ID** (10 caracteres, ex: `AB12CD34EF`)
   - **Team ID** (encontrado em https://developer.apple.com/account - canto superior direito)

**Passo 2: Configurar APNs no EAS**

```bash
# Opção A: Interativo (recomendado)
eas credentials

# Selecione:
# → iOS
# → Push Notifications
# → Upload a new key
# → Forneça o caminho do arquivo .p8, Key ID e Team ID

# Opção B: Via comando direto
eas credentials:configure --platform ios
```

**Campos necessários:**
- Path do arquivo `.p8`
- Key ID (10 caracteres)
- Team ID (10 caracteres)

**✅ Checklist:**
- [ ] APNs Key (.p8) criado e baixado
- [ ] Key ID e Team ID anotados
- [ ] APNs configurado no EAS

### 2.2 Android (FCM - Firebase Cloud Messaging)

**⚠️ IMPORTANTE:** Nossa Maternidade **NÃO usa Firebase SDK no client** (verificado via código).

**FCM é usado apenas para push notifications** (não precisa de `google-services.json` no app).

**Passo 1: Criar Firebase Project**

1. Abrir https://console.firebase.google.com/
2. Clicar **"Add project"**
3. **Project name:** "Nossa Maternidade"
4. Desabilitar Google Analytics (opcional)
5. Clicar **Create project**

**Passo 2: Registrar App Android**

1. No Firebase Console, clicar ⚙️ **Project settings**
2. Na aba **General**, seção **Your apps**, clicar **Android icon**
3. **Android package name:** `com.nossamaternidade.app` (⚠️ deve ser EXATO)
4. **App nickname:** "Nossa Maternidade Android"
5. **Skip** o download do `google-services.json` (não precisamos no client)
6. Clicar **Next** → **Continue to console**

**Passo 3: Habilitar Cloud Messaging API (Legacy)**

1. No Firebase Console, clicar **Project settings** (⚙️)
2. Aba **Cloud Messaging**
3. Na seção **Cloud Messaging API (Legacy)**, clicar **⋮** (três pontos) → **Manage API in Google Cloud Console**
4. Clicar **ENABLE** (se desabilitado)

**Passo 4: Obter Server Key**

1. Voltar ao Firebase Console → **Project settings** → **Cloud Messaging**
2. Copiar **Server key** (formato: `AAAA...`)

**Passo 5: Configurar FCM no EAS**

```bash
# Opção A: Interativo
eas credentials

# Selecione:
# → Android
# → FCM Server Key
# → Paste the server key

# Opção B: Via comando direto
eas credentials:configure --platform android
```

**Cole o Server Key quando solicitado.**

**✅ Checklist:**
- [ ] Firebase project criado
- [ ] App Android registrado (package: `com.nossamaternidade.app`)
- [ ] Cloud Messaging API (Legacy) habilitado
- [ ] Server Key copiado
- [ ] FCM configurado no EAS

### 2.3 Testar Push (3 Estados - OBRIGATÓRIO)

**Após configurar APNs + FCM, testar ANTES de submeter:**

**Estados de teste:**
1. **Foreground** (app aberto)
2. **Background** (app minimizado)
3. **Killed** (app fechado / cold start)

**Como testar:**

1. Build de desenvolvimento:
   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

2. Instalar no device físico (simulador não recebe push)

3. Enviar notificação de teste via Expo Push Tool:
   - URL: https://expo.dev/notifications
   - Push token do device (obter via app)
   - Título: "Teste Nossa Maternidade"
   - Mensagem: "Verificando push notifications"

4. Verificar se:
   - ✅ Notificação aparece nos 3 estados
   - ✅ Deep link funciona (se configurado)
   - ✅ Badge count incrementa (iOS)

**✅ Checklist:**
- [ ] Push funciona em Foreground
- [ ] Push funciona em Background
- [ ] Push funciona em Killed state
- [ ] Deep link navega corretamente (se aplicável)

---

## 📱 FASE 3: Compliance (Bloqueadores de Review)

### 3.1 App Store Connect (iOS)

**Passo 1: Criar App ID**

1. Abrir https://developer.apple.com/account/resources/identifiers/list
2. Clicar **"+"** → **App IDs**
3. **Description:** "Nossa Maternidade"
4. **Bundle ID:** `com.nossamaternidade.app` (⚠️ Explicit)
5. **Capabilities:**
   - ✅ Push Notifications
   - ✅ Sign in with Apple (se usar)
   - ✅ Associated Domains (se usar deep links)
6. Clicar **Continue** → **Register**

**Passo 2: Criar App no App Store Connect**

1. Abrir https://appstoreconnect.apple.com/apps
2. Clicar **"+"** → **New App**
3. **Platforms:** iOS
4. **Name:** "Nossa Maternidade"
5. **Primary Language:** Portuguese (Brazil)
6. **Bundle ID:** Selecionar `com.nossamaternidade.app`
7. **SKU:** `NOSSA_MATERNIDADE_2025` (único, sem espaços)
8. **User Access:** Full Access
9. Clicar **Create**

**Passo 3: Export Compliance (Criptografia)**

1. Na página do app, ir para **App Information**
2. Seção **Export Compliance Information**
3. Preencher:

| Pergunta | Resposta | Justificativa |
|----------|----------|---------------|
| Does your app use encryption? | **Yes** | App usa HTTPS/TLS |
| Is your app exempt from U.S. encryption regulations? | **Yes** | Category 5, Part 2 exemption |
| Does your app contain proprietary encryption? | **No** | Usa apenas TLS padrão |
| Have you obtained ERN (Encryption Registration Number)? | **No** | Not required under exemption |

**⚠️ IMPORTANTE:** `ITSAppUsesNonExemptEncryption: false` já está em `app.config.js` (linha 77).

**Passo 4: Age Rating**

1. Ir para **App Information** → **Age Rating**
2. Clicar **Edit**
3. Preencher questionário:
   - **Medical/Treatment Information:** Frequent/Intense (dados de saúde)
   - **Unrestricted Web Access:** Yes (se app tem browser)
   - Outros: None/Infrequent
4. **Rating:** Provavelmente **12+** (devido a dados médicos)

**Passo 5: App Privacy (Nutrition Label)**

1. Ir para **App Privacy**
2. Clicar **Get Started**
3. **Collect data?** Yes
4. Adicionar cada tipo de dado:

**Data Types coletados:**

| Category | Type | Purpose | Linked to User | Tracking |
|----------|------|---------|----------------|----------|
| Health & Fitness | Health | App Functionality | Yes | No |
| Contact Info | Email Address | App Functionality | Yes | No |
| Contact Info | Name | App Functionality | Yes | No |
| Identifiers | User ID | App Functionality | Yes | No |
| Usage Data | Product Interaction | Analytics | Yes | No |

**Third-party providers:**
- ✅ Supabase (Analytics + Auth)
- ✅ RevenueCat (Subscriptions) - se Premium
- ✅ Sentry (Crash Reporting) - se configurado

5. Clicar **Publish** quando terminar

**✅ Checklist:**
- [ ] App ID criado no Apple Developer
- [ ] App criado no App Store Connect
- [ ] Export Compliance preenchido
- [ ] Age Rating configurado
- [ ] App Privacy (nutrition label) completo

### 3.2 Google Play Console (Android)

**Passo 1: Criar App**

1. Abrir https://play.google.com/console/
2. Clicar **Create app**
3. **App name:** "Nossa Maternidade"
4. **Default language:** Portuguese (Brazil)
5. **App or game:** App
6. **Free or paid:** Free (ou Paid se cobrar install)
7. Aceitar termos
8. Clicar **Create app**

**Passo 2: IARC Rating (Content Rating)**

1. No menu lateral, clicar **Content rating**
2. **Email:** `privacidade@nossamaternidade.com.br`
3. **Category:** Utility or Productivity (ou Health & Fitness se disponível)
4. Preencher questionário:
   - **Violence:** No
   - **Sexual Content:** No
   - **Language:** No
   - **Controlled Substances:** No
   - **User-Generated Content:** Yes (Community posts)
   - **Realistic Depiction:** No
   - **Health Information:** Yes (Pregnancy tracking)
5. Clicar **Save** → **Calculate rating**
6. **Rating:** Provavelmente **Everyone** ou **Teen** (dependendo de respostas)

**Passo 3: Data Safety (Privacy)**

1. No menu lateral, clicar **Data safety**
2. **Does your app collect or share user data?** Yes
3. Adicionar tipos de dados:

**Data collected:**

| Category | Type | Purpose | Optional | Shared |
|----------|------|---------|----------|--------|
| Personal info | Name | App functionality | No | No |
| Personal info | Email address | App functionality | No | No |
| Health and fitness | Health info | App functionality | No | No |
| App activity | App interactions | Analytics | Yes | No |

**Security practices:**
- ✅ Data is encrypted in transit (HTTPS/TLS)
- ✅ Data is encrypted at rest (Supabase)
- ✅ Users can request data deletion (LGPD)

4. Clicar **Save**

**Passo 4: Permissões (Declarations)**

1. Ir para **App content** → **App access**
2. **Restricted features:** Nenhuma (a menos que use SMS/Calls)
3. Ir para **Permissions**
4. Revisar lista e **remover permissões não usadas**:
   - ❌ `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` (se não usa GPS)
   - ❌ Outras permissões desnecessárias

**⚠️ Permissões reduzem conversão e aumentam scrutiny na review.**

**✅ Checklist:**
- [ ] App criado no Google Play Console
- [ ] IARC Content Rating completo
- [ ] Data Safety preenchido
- [ ] Permissões revisadas (remover não usadas)

---

## 🧪 FASE 4: Beta Testing (Obrigatório antes de produção)

### 4.1 iOS TestFlight

**Passo 1: Criar Build**

```bash
# Build de produção (mas para TestFlight)
eas build --profile production --platform ios

# Aguardar build (15-30 min)
# URL do build: https://expo.dev/accounts/liongab/projects/nossamaternidade/builds/...
```

**Passo 2: Submeter para TestFlight**

```bash
# Após build completo
eas submit --platform ios --latest

# Ou especificar build ID
eas submit --platform ios --id BUILD_ID
```

**Passo 3: Configurar TestFlight no App Store Connect**

1. Abrir https://appstoreconnect.apple.com/apps
2. Selecionar app "Nossa Maternidade"
3. Ir para **TestFlight** (aba superior)
4. Esperar build processar (5-10 min)
5. Preencher **Export Compliance** (se pedido - mesmas respostas da Fase 3.1)
6. Ir para **External Testing** → **"+"** → **Create Group**
7. **Group name:** "Beta Testers"
8. Adicionar **≥5 testadores** via email
9. **What to Test:** "Versão beta - teste de funcionalidades principais"
10. Clicar **Submit for Review** → Aguardar aprovação (24-48h)

**Passo 4: Testar com Usuários Reais**

**Fluxos críticos:**
- [ ] Login social (Google/Apple)
- [ ] Onboarding (6 steps + NathIA 5 steps)
- [ ] Permissões (Camera, Notifications)
- [ ] Push notifications (3 estados)
- [ ] AI chat (NathIA) - 5 mensagens
- [ ] Ciclo menstrual - adicionar período
- [ ] Daily check-in (mood/energy/sleep)
- [ ] (Premium) Tentar feature bloqueada → Paywall → Compra sandbox

**✅ Checklist:**
- [ ] Build iOS submetido para TestFlight
- [ ] ≥5 testadores adicionados
- [ ] Build aprovado no TestFlight
- [ ] Todos fluxos críticos testados
- [ ] Bugs críticos corrigidos

### 4.2 Android Internal Testing

**Passo 1: Criar Build AAB**

```bash
# Build de produção (AAB para Play Store)
eas build --profile production --platform android

# Aguardar build (10-20 min)
```

**Passo 2: Submeter para Internal Testing**

```bash
# Após build completo
eas submit --platform android --latest --track internal

# Ou especificar build ID
eas submit --platform android --id BUILD_ID --track internal
```

**Passo 3: Configurar Internal Testers**

1. Abrir https://play.google.com/console/
2. Selecionar app "Nossa Maternidade"
3. Ir para **Testing** → **Internal testing**
4. Criar **release**:
   - Upload já feito via `eas submit`
   - **Release name:** "v1.0.0 Beta"
   - **Release notes (pt-BR):** "Primeira versão beta para testes internos"
5. Ir para **Testers** → **Create email list**
6. **List name:** "Beta Testers"
7. Adicionar **≥5 emails**
8. Clicar **Save** → **Start rollout**

**Passo 4: Testar com Usuários Reais**

**Mesmos fluxos críticos do iOS.**

**✅ Checklist:**
- [ ] Build Android (AAB) submetido
- [ ] ≥5 testadores adicionados
- [ ] Release iniciado (Internal testing)
- [ ] Todos fluxos críticos testados
- [ ] Bugs críticos corrigidos

---

## 🚀 FASE 5: Observabilidade (Antes de Produção)

### 5.1 Sentry (Error Tracking)

**Passo 1: Criar Projeto Sentry**

1. Abrir https://sentry.io/
2. Criar conta (free tier suficiente)
3. Clicar **Create Project**
4. **Platform:** React Native
5. **Project name:** "nossa-maternidade"
6. Copiar **DSN** (formato: `https://...@sentry.io/...`)

**Passo 2: Configurar DSN**

```bash
# Via EAS secret
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://...@sentry.io/..."
```

**Passo 3: Sourcemaps (CRÍTICO)**

**⚠️ Sem sourcemaps, crashes aparecem como código minificado (inútil para debug).**

```bash
# Criar auth token no Sentry
# 1. Ir para https://sentry.io/settings/account/api/auth-tokens/
# 2. Criar token com scope: "project:releases"
# 3. Copiar token

# Configurar como secret (NUNCA commitar)
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value "sntrys_..."
```

**app.config.js já está configurado** (verificar `plugins` section).

**✅ Checklist:**
- [ ] Projeto Sentry criado
- [ ] DSN configurado como secret
- [ ] Auth token configurado (sourcemaps)
- [ ] Teste: forçar crash e verificar no Sentry

---

## 💰 FASE 6: Monetização (Condicional - se Premium no v1)

### 6.1 RevenueCat Setup

**Passo 1: Criar Conta RevenueCat**

1. Abrir https://app.revenuecat.com/
2. Criar conta (free até $10k MRR)
3. **Project name:** "Nossa Maternidade"

**Passo 2: Configurar App Store Connect Integration**

1. No RevenueCat Dashboard → **Apps**
2. Clicar **"+ New"**
3. **Platform:** iOS
4. **App name:** "Nossa Maternidade iOS"
5. **Bundle ID:** `com.nossamaternidade.app`
6. **Shared Secret:** (obter do App Store Connect)
   - Abrir https://appstoreconnect.apple.com/apps
   - App → **App Information** → **App-Specific Shared Secret** → **Manage**
   - Copiar shared secret
7. Colar no RevenueCat
8. Clicar **Save**

**Passo 3: Configurar Google Play Integration**

1. No RevenueCat Dashboard → **Apps** → **"+ New"**
2. **Platform:** Android
3. **App name:** "Nossa Maternidade Android"
4. **Package name:** `com.nossamaternidade.app`
5. **Service Account JSON:**
   - Ir para https://console.cloud.google.com/
   - Selecionar projeto Firebase
   - **IAM & Admin** → **Service Accounts** → **Create Service Account**
   - **Name:** "RevenueCat"
   - **Role:** "Pub/Sub Admin" (se usar real-time updates)
   - Criar + Download JSON
6. Upload JSON no RevenueCat
7. Clicar **Save**

**Passo 4: Criar Produtos nas Lojas**

**iOS (App Store Connect):**
1. https://appstoreconnect.apple.com/apps → App → **Subscriptions**
2. Criar **Subscription Group**:
   - **Reference name:** "Nossa Maternidade Premium"
3. Criar **Auto-Renewable Subscription**:
   - **Product ID:** `premium_monthly` (deve bater com RevenueCat)
   - **Price:** R$ 29,90/mês (tier correspondente)
   - **Subscription duration:** 1 month
4. Repetir para `premium_annual`:
   - **Price:** R$ 299,00/ano (save 16%)

**Android (Google Play Console):**
1. https://play.google.com/console/ → App → **Monetize** → **Subscriptions**
2. Criar **Subscription**:
   - **Product ID:** `premium_monthly` (⚠️ MESMO que iOS)
   - **Name:** "Premium Mensal"
   - **Price:** R$ 29,90/mês
   - **Billing period:** Monthly
3. Repetir para `premium_annual`

**Passo 5: Criar Offerings no RevenueCat**

1. No RevenueCat Dashboard → **Offerings**
2. **"+ New Offering"**
3. **Identifier:** `default`
4. **Description:** "Premium Subscription"
5. Adicionar **Packages**:
   - Package 1: `monthly` → `premium_monthly`
   - Package 2: `annual` → `premium_annual` (badge "Save 16%")
6. **Make current** (ativa offering)

**Passo 6: Obter API Keys**

1. RevenueCat Dashboard → **Project settings** → **API keys**
2. Copiar:
   - **Public iOS Key:** `appl_...`
   - **Public Android Key:** `goog_...`

```bash
# Configurar como secrets
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_..."
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_..."
```

**Passo 7: Testar Sandbox**

**iOS:**
1. Criar **Sandbox Tester** no App Store Connect:
   - https://appstoreconnect.apple.com/access/testers
   - Email: `beta+ios@nossamaternidade.com.br`
2. No device, Settings → App Store → Sandbox Account → Login
3. Testar compra no app

**Android:**
1. Criar **License Tester** no Google Play Console:
   - **Settings** → **License testing**
   - Adicionar email: `beta+android@nossamaternidade.com.br`
2. Testar compra no app

**✅ Checklist:**
- [ ] Projeto RevenueCat criado
- [ ] iOS integration configurado (Shared Secret)
- [ ] Android integration configurado (Service Account JSON)
- [ ] Produtos criados nas lojas (monthly + annual)
- [ ] Offerings criados no RevenueCat
- [ ] API keys configurados como secrets
- [ ] Sandbox testing OK (iOS + Android)
- [ ] "Restore purchases" funciona

---

## 🎨 FASE 7: Polimento (Antes de Submeter)

### 7.1 Screenshots & Marketing Assets

**iOS (App Store Connect):**

**Required sizes (por device):**
- iPhone 6.9" (iPhone 16 Pro Max): 1320x2868 px
- iPhone 6.7" (iPhone 15 Pro Max): 1290x2796 px
- iPad Pro 13" (M4): 2048x2732 px

**Mínimo:** 3 screenshots por size
**Recomendado:** 5-8 screenshots

**Android (Google Play Console):**

**Required sizes:**
- Phone: 16:9 aspect (1080x1920 px mín)
- 7" Tablet: 1024x600 px mín
- 10" Tablet: 1920x1200 px mín

**Mínimo:** 2 screenshots por size
**Recomendado:** 4-8 screenshots

**Ferramentas:**
- Figma template: https://www.figma.com/community/file/app-store-screenshots
- Expo Screenshot Generator: `npx expo-screenshot`

**✅ Checklist:**
- [ ] Screenshots iOS criados (3+ por device)
- [ ] Screenshots Android criados (2+ por device)
- [ ] App icon finalizado (1024x1024 px)
- [ ] Feature graphic Android (1024x500 px)

### 7.2 Textos de Loja

**Preparar textos em português (pt-BR):**

**Nome do app:** "Nossa Maternidade"
**Subtitle (iOS):** "Acolhimento e cuidado na gravidez" (max 30 chars)
**Short description (Android):** "Sua companheira na jornada da maternidade" (max 80 chars)

**Description (ambas as lojas):**

```
Nossa Maternidade é sua companheira de confiança durante a gravidez e maternidade.

✨ RECURSOS PRINCIPAIS:
• NathIA - Assistente de IA especializada em saúde materna
• Rastreamento do ciclo menstrual e ovulação
• Diário de humor e check-ins diários
• Comunidade segura de mães
• Hábitos de bem-estar personalizados

🔐 SEGURANÇA E PRIVACIDADE:
• Dados criptografados e seguros
• Conforme LGPD (Lei Geral de Proteção de Dados)
• Você controla seus dados 100%

💝 FEITO COM AMOR:
Criado por Nathalia Valente, doula e educadora perinatal, para oferecer acolhimento baseado em evidências científicas e humanização.

📱 PREMIUM (Opcional):
• Chat ilimitado com NathIA
• Publicação na comunidade
• Exportação avançada de dados
• Suporte prioritário

⚠️ IMPORTANTE: Este app não substitui consulta médica. Sempre consulte seu obstetra.
```

**Keywords (iOS) - max 100 chars:**
```
gravidez,maternidade,gestação,bebê,parto,ciclo,ovulação,IA
```

**✅ Checklist:**
- [ ] Nome finalizado
- [ ] Subtitle/Short description escrito
- [ ] Description completo (pt-BR)
- [ ] Keywords otimizados (iOS)

---

## 📤 FASE 8: Submissão Final

### 8.1 Build de Produção

**Verificar antes:**
```bash
# Quality gate completo
npm run quality-gate

# Verificar se não há console.log
npm run check-build-ready

# Verificar versão no app.config.js
# version: "1.0.0" (primeiro launch)
```

**Criar builds:**
```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android

# Ou ambos
eas build --profile production --platform all
```

**Aguardar builds (20-40 min).**

**✅ Checklist:**
- [ ] Quality gate passou
- [ ] Versão correta (1.0.0)
- [ ] Build iOS completo
- [ ] Build Android completo

### 8.2 Submeter para Review

**iOS:**
```bash
eas submit --platform ios --latest
```

**No App Store Connect:**
1. Ir para app → **App Store** (aba)
2. **Version:** 1.0.0
3. **What's New:** "Primeira versão da Nossa Maternidade! 🎉"
4. Upload screenshots (feitos na Fase 7.1)
5. Preencher description (Fase 7.2)
6. **App Review Information:**
   - **Contact:** `contato@nossamaternidade.com.br`
   - **Notes:** "App de acompanhamento de gravidez com IA. Teste login: [fornecer credenciais]"
7. **Version Release:** Automatic (ou Manual se quiser controlar)
8. Clicar **Add for Review** → **Submit for Review**

**Android:**
```bash
eas submit --platform android --latest --track production
```

**No Google Play Console:**
1. Ir para **Production** release
2. **Release name:** "v1.0.0 - Launch"
3. **Release notes (pt-BR):**
   ```
   Primeira versão da Nossa Maternidade!

   - NathIA: assistente de IA para saúde materna
   - Rastreamento de ciclo menstrual
   - Check-ins diários de bem-estar
   - Comunidade segura
   ```
4. **Start rollout to Production**
5. **Roll out:** 100% (ou staged rollout: 10% → 50% → 100%)

**✅ Checklist:**
- [ ] Build iOS submetido
- [ ] App Store metadata completo
- [ ] Build Android submetido
- [ ] Google Play metadata completo

---

## ⏱️ TEMPOS DE REVIEW

**iOS (App Store):**
- **Review time:** 24-48 horas (média)
- **Se rejeitado:** corrigir + resubmeter (mais 24-48h)

**Android (Google Play):**
- **Review time:** 2-7 dias (média)
- **Staged rollout:** pode começar em 1-2 dias

**📅 Recomendação:** Submeter com **7+ dias** de antecedência de qualquer deadline.

---

## 🐛 TROUBLESHOOTING

### Build Falhou

```bash
# Ver logs completos
eas build:view BUILD_ID

# Problemas comuns:
# 1. Dependencies incompatíveis → npm install
# 2. TypeScript errors → npm run typecheck
# 3. ESLint errors → npm run lint:fix
# 4. Secrets faltando → eas secret:list
```

### Push Não Funciona

```bash
# 1. Verificar credentials
eas credentials --platform ios
eas credentials --platform android

# 2. Verificar Project ID
npx expo config --type public | jq -r '.extra.eas.projectId'

# 3. Testar token manual via https://expo.dev/notifications
```

### App Rejeitado (iOS)

**Razões comuns:**
1. **Guideline 2.1 - Performance:** App crashes → usar Sentry + fix bugs
2. **Guideline 4.3 - Spam:** App muito simples → adicionar mais features
3. **Guideline 5.1.1 - Privacy:** Privacy policy ausente → adicionar URL em app.config.js
4. **Guideline 2.3.10 - Accurate Metadata:** Screenshots não representam app → refazer

**Ação:** Ler rejection note → corrigir → resubmeter via **Resolution Center**.

### App Rejeitado (Android)

**Razões comuns:**
1. **Medical Claims:** App promete diagnóstico → remover claims médicos
2. **Data Safety:** Inconsistências → revisar Data Safety form
3. **Permissions:** Justificativas faltando → adicionar em declaration

**Ação:** Corrigir via Play Console → Submit update.

---

## ✅ CHECKLIST FINAL PRÉ-SUBMISSÃO

**Segurança:**
- [ ] Nenhuma API key no client (verificar SECURITY.md)
- [ ] Secrets configurados no EAS
- [ ] Secrets configurados no Supabase
- [ ] HTTPS only (verificar app.config.js)

**Compliance:**
- [ ] Privacy Policy URL ativa
- [ ] Terms of Service URL ativo
- [ ] AI Disclaimer URL ativo
- [ ] LGPD: Export + Delete funcionando

**Funcional:**
- [ ] Quality gate passa (TypeScript + ESLint + Build + console.log)
- [ ] Push notifications funciona (3 estados)
- [ ] Login social funciona (Google/Apple)
- [ ] AI chat funciona (NathIA)
- [ ] Onboarding completo (6 + 5 steps)
- [ ] Deep links funcionam (se aplicável)

**Marketing:**
- [ ] Screenshots finalizados
- [ ] App icon finalizado
- [ ] Descriptions escritos (pt-BR)
- [ ] Keywords otimizados

**Beta:**
- [ ] ≥5 testadores iOS (TestFlight)
- [ ] ≥5 testadores Android (Internal)
- [ ] Bugs críticos corrigidos
- [ ] Feedback incorporado

**Premium (se aplicável):**
- [ ] Produtos criados (iOS + Android)
- [ ] RevenueCat configurado
- [ ] Sandbox testing OK
- [ ] Restore purchases funciona

---

## 🎉 PÓS-LANÇAMENTO

**Monitoramento (primeiras 48h):**
- [ ] Crash rate < 1% (Sentry)
- [ ] Push delivery > 90% (Expo Dashboard)
- [ ] API errors < 5% (Supabase Logs)
- [ ] User feedback (reviews)

**Iteração:**
- [ ] Responder reviews (ambas lojas)
- [ ] Hotfixes via EAS Update (se bugs não-nativos)
- [ ] Planejar v1.1 com feedback

---

## 📞 SUPORTE

**Dúvidas específicas:**
- **Expo/EAS:** https://docs.expo.dev/
- **App Store:** https://developer.apple.com/support/
- **Google Play:** https://support.google.com/googleplay/android-developer/

**Contato interno:**
- **Tech Lead:** Lion (eugabrielmktd@gmail.com)
- **Privacidade/LGPD:** privacidade@nossamaternidade.com.br

---

**Document Owner:** Lion (eugabrielmktd@gmail.com)
**Last Updated:** December 23, 2025
**Version:** 1.0.0
