# 🚀 PLANO DE LANÇAMENTO NOSSA MATERNIDADE - 10 DIAS EXECUTÁVEIS

**Data de Criação:** 26 de Dezembro de 2025
**Última Atualização:** 26 de Dezembro de 2025
**Versão:** 1.0
**Status do Código:** 95% Pronto | **Bloqueador:** RevenueCat + Legal Docs

---

## 📋 RESUMO EXECUTIVO (TL;DR - 60 SEGUNDOS)

### Situação Atual
- ✅ **Código:** 95% pronto (TypeScript 0 errors, SDK instalado, webhook deployado)
- ❌ **Bloqueador P0:** RevenueCat dashboard NÃO configurado
- ❌ **Bloqueador P0:** Legal docs NÃO publicadas (Privacy Policy, Terms, AI Disclaimer)
- ❌ **Bloqueador P0:** Produtos de subscription NÃO criados nas stores

### Objetivo
Lançar o app "Nossa Maternidade" na **App Store (iOS)** e **Google Play (Android)** em **10 dias úteis**.

### Estratégia
**Dia 1-2:** Legal + RevenueCat
**Dia 3-5:** App Store Connect + Google Play Console
**Dia 6-8:** Testing + Production Builds
**Dia 9-10:** Submission + Launch Prep

### Métricas de Sucesso
- [ ] iOS app aprovado na App Store
- [ ] Android app aprovado no Google Play
- [ ] Compras funcionando (sandbox + produção)
- [ ] Webhook sincronizando status premium
- [ ] Zero crashes críticos
- [ ] Rating > 4.0 estrelas (primeiro mês)

---

## ⚠️ BLOQUEADORES CRÍTICOS (P0 - FAZER PRIMEIRO)

Sem estes itens, as lojas **rejeitam automaticamente** o app:

### 1. Legal Documentation (URLs Públicas)
```
❌ https://nossamaternidade.com.br/privacidade (Privacy Policy)
❌ https://nossamaternidade.com.br/termos (Terms of Service)
❌ https://nossamaternidade.com.br/ai-disclaimer (AI Disclaimer)
```
**Status:** NÃO publicados
**Prazo:** Dia 1 (2 horas)
**Consequência se faltarem:** Rejeição automática pela Apple e Google

### 2. RevenueCat Dashboard
```
❌ Entitlement "premium" criado
❌ Offering "default" criado
❌ Produtos iOS sincronizados
❌ Produtos Android sincronizados
❌ Webhook configurado com authorization header
```
**Status:** Dashboard existe, mas NÃO configurado
**Prazo:** Dia 1 (3 horas)
**Consequência se faltarem:** Compras não funcionam

### 3. App Store Connect (iOS)
```
❌ App criado
❌ Subscription group criado
❌ Produto mensal criado (com.nossamaternidade.subscription.monthly)
❌ Produto anual criado (com.nossamaternidade.subscription.annual)
❌ Free trial 7 dias configurado
```
**Status:** Conta ativa, mas produtos NÃO criados
**Prazo:** Dia 2 (3 horas)

### 4. Google Play Console (Android)
```
❌ App criado
❌ Subscription mensal criada (com.nossamaternidade.subscription.monthly)
❌ Subscription anual criada (com.nossamaternidade.subscription.annual)
❌ Free trial 7 dias configurado
```
**Status:** Conta ativa, mas produtos NÃO criados
**Prazo:** Dia 3 (3 horas)

---

## 🎯 VALORES HARDCODED NO CÓDIGO (NÃO ALTERAR)

**CRÍTICO:** Estes valores estão hardcoded no app e DEVEM ser usados EXATAMENTE como estão:

### Bundle IDs / Package Names
```javascript
// iOS (app.config.js line 59)
bundleIdentifier: "br.com.nossamaternidade.app"

// Android (app.config.js line 95)
package: "com.nossamaternidade.app"
```

### Product IDs
```javascript
// src/types/premium.ts lines 110-112
MONTHLY: "com.nossamaternidade.subscription.monthly"
YEARLY: "com.nossamaternidade.subscription.annual"
```

### Entitlement & Offering
```javascript
// src/types/premium.ts lines 115-117
ENTITLEMENTS.PREMIUM: "premium"  // EXACT match required

// src/services/revenuecat.ts (buscado automaticamente)
Offering: "default"  // EXACT match required
```

### Prices
```javascript
// src/types/premium.ts lines 153-171
Monthly: R$ 19,90/mês
Annual: R$ 79,90/ano (67% savings)
Trial: 7 days
```

### Webhook
```
URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
Secret: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
```

---

## 📅 TIMELINE DETALHADO - 10 DIAS

### DIA 1 - LEGAL + REVENUECAT SETUP (8 HORAS)

**Objetivo:** Publicar legal docs + configurar RevenueCat completamente
**Success Criteria:**
- [ ] Legal docs acessíveis em URLs públicas
- [ ] RevenueCat entitlement "premium" ativo
- [ ] RevenueCat offering "default" configurado
- [ ] Webhook testado e funcionando

#### Hora 1-2: Legal Documentation (2h)

**Opção A: Notion Pages (mais rápido - 30min)**
```bash
# 1. Criar conta em notion.so
# 2. Criar 3 páginas (Privacy, Terms, AI Disclaimer)
# 3. Publish to web → Copiar URLs públicas
# 4. Testar acessibilidade
```

**Opção B: GitHub Pages (recomendado - 1h)**
```bash
# 1. Criar repositório legal-docs
cd /tmp && mkdir nossamaternidade-legal && cd nossamaternidade-legal
git init

# 2. Criar HTML pages (usar templates LGPD-compliant)
# - privacidade.html
# - termos.html
# - ai-disclaimer.html

# 3. Deploy
gh repo create nossamaternidade-legal --public --source=. --push
# Enable Pages: Settings → Pages → Source: main branch

# 4. URLs resultantes:
# https://USERNAME.github.io/nossamaternidade-legal/privacidade.html
# https://USERNAME.github.io/nossamaternidade-legal/termos.html
# https://USERNAME.github.io/nossamaternidade-legal/ai-disclaimer.html
```

**Checklist de Conteúdo Obrigatório:**

Privacy Policy DEVE incluir:
- [ ] Dados coletados (nome, email, dados de gravidez, chat logs)
- [ ] AI providers (OpenAI/Google Gemini)
- [ ] Direitos LGPD (acesso, correção, exclusão, portabilidade)
- [ ] Contact: privacidade@nossamaternidade.com.br
- [ ] RevenueCat subscription data handling

Terms of Service DEVE incluir:
- [ ] Medical disclaimer (app NÃO é dispositivo médico)
- [ ] Subscription terms (preço, renovação, cancelamento)
- [ ] Lei aplicável (Brasil)

AI Disclaimer DEVE incluir:
- [ ] NathIA usa AI (OpenAI/Google Gemini)
- [ ] Não substitui profissional de saúde
- [ ] Limitações de precisão

**STOP Checkpoint:** Abrir URLs em browser → TODAS devem carregar.

---

#### Hora 3-4: RevenueCat Dashboard (2h)

**Passo 1: Criar Conta (10min)**
```bash
# 1. Ir para https://app.revenuecat.com/signup
# 2. Sign up: nath@nossamaternidade.com.br
# 3. Criar projeto: "Nossa Maternidade"
```

**Passo 2: Adicionar iOS App (15min)**
```bash
# Dashboard → Apps → + New → Apple App Store

Bundle ID: br.com.nossamaternidade.app  # EXACT MATCH
App Name: Nossa Maternidade iOS

# Shared Secret (obter de App Store Connect):
# 1. https://appstoreconnect.apple.com
# 2. My Apps → Nossa Maternidade → App Information
# 3. App-Specific Shared Secret → Generate
# 4. Copiar 32-char secret
# 5. Colar no RevenueCat
```

**Passo 3: Adicionar Android App (15min)**
```bash
# Dashboard → Apps → + New → Google Play

Package Name: com.nossamaternidade.app  # EXACT MATCH
App Name: Nossa Maternidade Android

# Service Account JSON:
# (Se não existe, criar no Google Cloud Console)
# 1. https://console.cloud.google.com
# 2. IAM & Admin → Service Accounts → Create
# 3. Grant role: Pub/Sub Admin
# 4. Create Key → JSON → Download
# 5. Upload no RevenueCat
```

**Passo 4: Criar Entitlement (10min)**
```bash
# Dashboard → Entitlements → + New

Identifier: premium  # CRITICAL: exact match to code
Display Name: Nossa Maternidade Premium
```

**STOP Checkpoint:** Entitlement mostra "Active" no dashboard.

**Passo 5: Criar Offering (15min)**
```bash
# Dashboard → Offerings → + New

Identifier: default  # CRITICAL: exact match to code
Display Name: Default Offering
Is Current: ✅ (toggle ON)
```

**Passo 6: Adicionar Packages (20min)**
```bash
# Click no offering "default" → + Add Package

Package 1:
  Package ID: $rc_monthly
  Product: (conectar depois de criar nas stores)

Package 2:
  Package ID: $rc_annual
  Product: (conectar depois de criar nas stores)
```

**Passo 7: Obter API Keys (5min)**
```bash
# Dashboard → API Keys → Public app-specific API keys

iOS key: appl_XXXXXXXXXXXXX
Android key: goog_XXXXXXXXXXXXX

# Salvar em .env.local:
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_XXXXXXXXXXXXX
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_XXXXXXXXXXXXX
```

**STOP Checkpoint:** API keys visíveis e salvos.

---

#### Hora 5-6: Webhook Configuration (2h)

**Passo 1: Verificar Deployment (10min)**
```bash
cd /Users/lion/Documents/Lion/NossaMaternidade

# Webhook já está deployado (confirmado na docs)
# Verificar status:
npx supabase functions list
# Deve mostrar: webhook (deployed)
```

**Passo 2: Configurar Webhook no RevenueCat (20min)**
```bash
# Dashboard → Integrations → Webhooks → + Add

Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat

Authorization Header:
Bearer 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525

# NOTA: RevenueCat adiciona "Bearer " automaticamente
# Então só colocar o secret sem "Bearer"

Events: ✅ ALL (check all boxes)
  - Initial Purchase
  - Renewal
  - Cancellation
  - Expiration
  - Billing Issue
  - Product Change
  - Test

Save
```

**Passo 3: Testar Webhook (30min)**
```bash
# Terminal 1: Watch logs
npx supabase functions logs webhook --tail

# Browser: RevenueCat Dashboard
# Integrations → Webhooks → Find webhook → "Send Test Event"
# Event type: Test
# Click "Send"

# Terminal 1 deve mostrar:
# [WEBHOOK] RevenueCat event: TEST for [user_id]

# Verificar banco de dados:
# Supabase Dashboard → Table Editor → webhook_transactions
# Deve ter 1 linha:
#   source: "revenuecat"
#   event_type: "TEST"
#   status: "processed"
```

**STOP Checkpoint:**
- [ ] Webhook mostra "Active" no RevenueCat
- [ ] Test event recebido com sucesso
- [ ] Log no banco de dados

---

#### Hora 7-8: Quality Gate (2h)

```bash
cd /Users/lion/Documents/Lion/NossaMaternidade

# 1. Run quality gate
npm run quality-gate

# Deve passar 100%:
# ✓ TypeScript check (0 errors)
# ✓ ESLint check (0 errors)
# ✓ Build check
# ✓ No console.log

# 2. Verificar versão
# app.config.js:
#   version: "1.0.0"
#   ios.buildNumber: "1"
#   android.versionCode: 1
```

**STOP Checkpoint:** Quality gate 100% verde.

**DIA 1 ENTREGÁVEIS:**
✅ Legal docs publicados
✅ RevenueCat projeto configurado
✅ Entitlement "premium" criado
✅ Offering "default" criado
✅ Webhook testado
✅ Quality gate passou

---

### DIA 2 - APP STORE CONNECT (IOS) (8 HORAS)

**Objetivo:** Criar subscriptions no App Store Connect
**Success Criteria:**
- [ ] App criado
- [ ] 2 produtos criados (monthly, annual)
- [ ] Free trial 7 dias configurado
- [ ] Produtos aprovados
- [ ] Sincronizados com RevenueCat

#### Hora 1-2: App Creation (2h)

```bash
# 1. Login: https://appstoreconnect.apple.com
# 2. My Apps → + → New App

Platform: iOS
Name: Nossa Maternidade
Primary Language: Portuguese (Brazil)
Bundle ID: br.com.nossamaternidade.app  # EXACT MATCH
SKU: nossamaternidade-ios-v1
User Access: Full Access

Create
```

**App Information:**
```
Category: Medical (Primary) + Health & Fitness (Secondary)
Age Rating: 12+ (medical content)
Privacy Policy URL: [URL do Dia 1]
```

**STOP Checkpoint:** App aparece em "My Apps".

---

#### Hora 3-5: Subscriptions (3h)

**Passo 1: Create Subscription Group (20min)**
```bash
# Features → In-App Purchases → Subscriptions → + Create Subscription Group

Reference Name: Nossa Maternidade Premium
App Name: Nossa Maternidade Premium  # customer-facing
```

**Passo 2: Create Monthly Subscription (1h)**
```bash
# Inside group → + Create Subscription

Reference Name: Monthly Premium
Product ID: com.nossamaternidade.subscription.monthly  # EXACT MATCH
Duration: 1 Month

Create

# Subscription Prices:
+ Add subscription price
Price: R$ 19,90 (Brazil)
Availability: Brazil (or All countries)

# Introductory Offer (Free Trial):
Set Up Introductory Offer
Type: Free Trial
Duration: 7 Days
Countries: Brazil (or All)

# Localization (Portuguese):
Display Name: Plano Mensal Premium
Description:
"""
Acesso completo aos recursos premium:
• Conversas ilimitadas com NathIA
• Mensagens de voz
• Conteúdo exclusivo
• Sem anúncios

Teste grátis por 7 dias, depois R$ 19,90/mês.
Cancele a qualquer momento.
"""

Save
```

**Passo 3: Create Annual Subscription (1h)**
```bash
# Repeat with:
Product ID: com.nossamaternidade.subscription.annual  # EXACT MATCH
Duration: 1 Year
Price: R$ 79,90
Free Trial: 7 Days
Display Name: Plano Anual Premium
Description: (similar, mention savings 67%)
```

**Passo 4: Submit for Review (20min)**
```bash
# Click "Submit for Review" on each subscription
# Status: Waiting for Review → In Review → Approved (24-48h)
```

**STOP Checkpoint:** 2 subscriptions criadas e submetidas.

---

#### Hora 6-7: Sync to RevenueCat (1.5h)

**Passo 1: Get API Key (30min)**
```bash
# App Store Connect → Users and Access → Keys → App Store Connect API
# + Generate Key

Name: RevenueCat Integration
Access: Admin
Generate

# Download .p8 file (SAVE SECURELY - can't redownload)
# Note Key ID and Issuer ID
```

**Passo 2: Upload to RevenueCat (15min)**
```bash
# RevenueCat Dashboard → Apps → iOS app
# App Store Connect API Key section

Issuer ID: [from App Store Connect]
Key ID: [from App Store Connect]
Private Key: [upload .p8 file]

Save
```

**Passo 3: Fetch Products (10min)**
```bash
# Dashboard → Apps → iOS app → "Fetch Products"
# Wait 10-30 seconds

# Verify products appear:
# - com.nossamaternidade.subscription.monthly ✓
# - com.nossamaternidade.subscription.annual ✓
```

**Passo 4: Link to Offering (15min)**
```bash
# Dashboard → Offerings → "default"

Edit Monthly Package ($rc_monthly):
  Product: com.nossamaternidade.subscription.monthly
  Save

Edit Annual Package ($rc_annual):
  Product: com.nossamaternidade.subscription.annual
  Save
```

**STOP Checkpoint:** Produtos vinculados ao offering.

---

#### Hora 8: Sandbox Test Account (30min)

```bash
# App Store Connect → Users and Access → Sandbox → Testers
# + Create Tester

Email: sandbox.test+nossamaternidade@gmail.com  # MUST be unique
Password: Test@1234
Country: Brazil

Create
```

**DIA 2 ENTREGÁVEIS:**
✅ App iOS criado
✅ Subscription group configurado
✅ 2 produtos criados e submetidos
✅ Free trial 7 dias habilitado
✅ Produtos sincronizados com RevenueCat
✅ Sandbox account criada

---

### DIA 3 - GOOGLE PLAY CONSOLE (ANDROID) (8 HORAS)

**Objetivo:** Criar subscriptions no Google Play Console
**Success Criteria:**
- [ ] App criado
- [ ] 2 subscriptions criadas
- [ ] Base plans configurados
- [ ] Free trial 7 dias adicionado
- [ ] Produtos sincronizados com RevenueCat

#### Hora 1-2: App Creation (2h)

```bash
# 1. Login: https://play.google.com/console
# 2. All apps → Create app

App name: Nossa Maternidade
Default language: Portuguese (Brazil)
App or game: App
Free or paid: Free

Declarations:
  ✅ Developer Program Policies
  ✅ US export laws

Create app
```

**Store Listing:**
```
Short description (80 chars):
"Sua companheira na maternidade com IA - NathIA por Nathália Valente"

Full description (4000 chars):
[Similar to iOS, adapted for Portuguese]

App icon: 512x512 PNG
Feature graphic: 1024x500 PNG
Screenshots: Min 2, max 8 (phone + tablet)
Category: Health & Fitness
Contact email: suporte@nossamaternidade.com.br
Privacy Policy: [URL do Dia 1]
```

**STOP Checkpoint:** Store listing completa.

---

#### Hora 3-5: Subscriptions (3h)

```bash
# Monetize → Subscriptions → Create subscription

Product ID: com.nossamaternidade.subscription.monthly  # EXACT MATCH
Name: Nossa Maternidade Premium - Mensal
Description: [similar to iOS]

Create → Continue to base plans

# Base Plan:
Base plan ID: monthly-base
Billing period: 1 Month
Price: R$ 19,90 (Brazil)
Renewal type: Auto-renewing
Grace period: 3 days

Save

# Add free trial offer:
+ Add offer
Offer ID: monthly-trial-7d
Offer type: Free trial
Duration: 7 days
Eligibility: New customers only

Save

Activate subscription
```

**Repeat para Annual:**
```
Product ID: com.nossamaternidade.subscription.annual
Base plan ID: annual-base
Billing period: 1 Year
Price: R$ 79,90
Offer: 7 days free trial
```

**STOP Checkpoint:** 2 subscriptions "Active".

---

#### Hora 6-7: Sync to RevenueCat (1.5h)

```bash
# RevenueCat Dashboard → Apps → Android app
# Service Account JSON já foi enviado (Dia 1)

# Fetch Products:
Apps → Android app → "Fetch Products"

# Verify:
# - com.nossamaternidade.subscription.monthly ✓
# - com.nossamaternidade.subscription.annual ✓

# Offerings já estão configurados (cross-platform)
```

---

#### Hora 8: Internal Testing Setup (1h)

```bash
# Testing → Internal testing → Testers tab
# Create email list: "Nossa Maternidade Team"
# Add emails: your.email@gmail.com, etc.

Save

# Monetize → Subscriptions → Select subscription → Testing tab
# Add same emails to "License Testing"
```

**DIA 3 ENTREGÁVEIS:**
✅ App Android criado
✅ Store listing completa
✅ 2 subscriptions criadas
✅ Base plans configurados
✅ Free trial 7 dias adicionado
✅ Produtos sincronizados com RevenueCat
✅ Internal testing configurado

---

### DIA 4-5 - SANDBOX TESTING (2 DIAS)

**Objetivo:** Validar fluxo de compra end-to-end
**Success Criteria:**
- [ ] Compras sandbox funcionam (iOS + Android)
- [ ] Webhook recebe eventos
- [ ] Premium status sincroniza
- [ ] Renovação funciona
- [ ] Cancelamento funciona

#### Dia 4 - iOS Testing

**Build Development:**
```bash
cd /Users/lion/Documents/Lion/NossaMaternidade
npm run quality-gate
eas build --profile development --platform ios
```

**Test Checklist:**
```
1. Launch app in simulator
2. Complete onboarding
3. Navigate to paywall
4. Tap "Subscribe"
5. RevenueCat offerings load (R$ 19,90 / R$ 79,90)
6. Tap monthly plan
7. iOS payment sheet appears
8. Sign in with sandbox account
9. Confirm purchase (no charge)
10. Premium badge activates
11. Check webhook logs (INITIAL_PURCHASE event)
12. Verify database (is_premium: true)
```

**Edge Cases:**
```
- Cancel purchase → No webhook
- Network failure → Error message
- Already subscribed → "Manage Subscription"
- Restore purchases → Premium restored
- Wait 5 min → Expiration event (sandbox)
```

#### Dia 5 - Android Testing

**Build Development:**
```bash
eas build --profile development --platform android
```

**Test Checklist:** (same as iOS)

**Cross-Platform Testing:**
```
- Purchase on iOS → Status syncs via webhook
- Login on Android → Premium shows
- Webhook resilience test
```

**DIA 4-5 ENTREGÁVEIS:**
✅ iOS sandbox testing completo
✅ Android sandbox testing completo
✅ Webhook recebe todos event types
✅ Premium status sincroniza corretamente
✅ Edge cases validados

---

### DIA 6 - PRE-PRODUCTION CHECKLIST (8 HORAS)

**Objetivo:** Validação final antes de production builds
**Success Criteria:**
- [ ] Legal docs verificados
- [ ] Quality gate 100%
- [ ] RevenueCat production mode
- [ ] Alerts configurados

#### Hora 1-2: Legal Compliance

```bash
# Verify URLs accessible:
curl -I [privacy URL]  # 200 OK
curl -I [terms URL]    # 200 OK
curl -I [AI URL]       # 200 OK

# Verify LGPD compliance:
# - Data collection disclosure ✓
# - AI provider disclosure ✓
# - User rights ✓
# - Contact email ✓
```

#### Hora 3-4: Code Quality

```bash
npm run quality-gate  # Must pass 100%
npm test -- --coverage
npm audit --production  # Fix critical vulnerabilities
grep -r "console\.log" src/  # Should be empty
```

#### Hora 5-6: RevenueCat Production

```bash
# Dashboard → Project Settings
# Production mode: ON ✓
# Offering "default": CURRENT ✓
# Webhook: Active ✓

# Send test event → Verify logs
```

#### Hora 7-8: Environment Variables

```bash
# Verify .env.local:
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_REVENUECAT_IOS_KEY=...
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=...

# Verify EAS secrets:
eas secret:list
```

**DIA 6 ENTREGÁVEIS:**
✅ Legal compliance verificada
✅ Quality gate 100%
✅ RevenueCat production ready
✅ Environment variables OK

---

### DIA 7-8 - PRODUCTION BUILDS (2 DIAS)

**Objetivo:** Build production binaries
**Success Criteria:**
- [ ] iOS build (.ipa) successful
- [ ] Android build (.aab) successful
- [ ] TestFlight distributed
- [ ] Internal testing distributed

#### Dia 7 - iOS Build

```bash
cd /Users/lion/Documents/Lion/NossaMaternidade

# Clean
npm run clean:all && npm install

# Tag version
git tag -a v1.0.0 -m "Production v1.0.0"
git push origin v1.0.0

# Build + Submit
eas build --profile production --platform ios --auto-submit

# Monitor:
# https://expo.dev → Builds → Wait 20-30 min

# TestFlight:
# App Store Connect → TestFlight
# Add External Testers
# Test core features
```

#### Dia 8 - Android Build

```bash
# Build + Submit
eas build --profile production --platform android --auto-submit

# Monitor:
# Play Console → Internal testing → Wait for processing

# Test same checklist as iOS
```

**DIA 7-8 ENTREGÁVEIS:**
✅ iOS production build
✅ Android production build
✅ TestFlight distributed
✅ Internal testing complete
✅ Bugs críticos resolvidos

---

### DIA 9 - STORE SUBMISSION (8 HORAS)

**Objetivo:** Submeter para review
**Success Criteria:**
- [ ] iOS submetido
- [ ] Android submetido
- [ ] Metadata finalizado
- [ ] Review notes preparados

#### Hora 1-3: iOS Submission

**App Store Listing:**
```
Name: Nossa Maternidade
Subtitle: Sua companheira na maternidade com IA
Description: [4000 chars max - prepare beforehand]
Keywords: gravidez,maternidade,IA,assistente,ciclo,menstrual
Screenshots: Upload all required sizes
Privacy Policy: [URL]
```

**Review Information:**
```
Demo Account:
  Email: reviewer@nossamaternidade.com.br
  Password: AppReview2025!

Review Notes:
"""
Teste de assinaturas: Use conta demo (já é premium)
Funcionalidades: Chat NathIA, rastreador de ciclo
Aviso médico: App NÃO é dispositivo médico
Privacidade: Dados criptografados, conforme LGPD
"""

Age Rating: 12+ (medical content)

Export Compliance: Yes (HTTPS only)

Submit for Review
```

**STOP Checkpoint:** Status "Waiting for Review".

---

#### Hora 4-6: Android Submission

**Production Release:**
```
# Play Console → Production → Create new release

Release name: 1.0.0

Release notes (Portuguese):
"""
Lançamento inicial do Nossa Maternidade!

🎉 Recursos:
• NathIA - assistente de IA
• Rastreador de ciclo
• Assinaturas premium (R$ 19,90/mês)
• Teste grátis 7 dias
"""

Review release → Start rollout to Production
Rollout: 20% (staged rollout)

Confirm
```

**STOP Checkpoint:** Status "In review".

---

#### Hora 7-8: Post-Submission Monitoring

**Set Up Alerts:**
```
# App Store Connect: Enable email notifications
# Play Console: Enable review alerts
# RevenueCat: Webhook monitoring
# Sentry: Error alerts (if configured)
```

**DIA 9 ENTREGÁVEIS:**
✅ iOS submetido
✅ Android submetido
✅ Metadata completo
✅ Review notes prontos
✅ Monitoring configurado

---

### DIA 10 - LAUNCH PREP + CONTINGENCY (8 HORAS)

**Objetivo:** Preparar lançamento e rollback plan
**Success Criteria:**
- [ ] Review responses preparadas
- [ ] Marketing materials prontos
- [ ] Support system operacional
- [ ] Rollback plan testado

#### Hora 1-2: Review Response Templates

```markdown
# Template: Privacy Update
Subject: Privacy Policy Updated - Resubmission

Dear App Review Team,
Updated Privacy Policy includes:
1. AI provider disclosure (OpenAI, Google Gemini)
2. LGPD compliance
3. Contact email for privacy

URL: [privacy URL]
Please review.

Best regards,
Nathália Valente
```

#### Hora 3-4: Marketing Materials

```markdown
# Social Media Post
🎉 Lançamento: Nossa Maternidade App!

✨ NathIA - assistente de IA 24/7
🤰 Rastreador de ciclo
💬 Comunidade de mães

🎁 Teste GRÁTIS por 7 dias!

iOS: [link]
Android: [link]

#NossaMaternidade #Maternidade #IA
```

#### Hora 5-6: Support System

```bash
# Create support email: suporte@nossamaternidade.com.br
# Set auto-reply (response within 24h)
# Create FAQ document
```

#### Hora 7: Rollback Plan

**Option 1: Kill Switch (2h)**
```sql
-- Feature flag in Supabase
INSERT INTO feature_flags (name, enabled)
VALUES ('ai_chat_enabled', false);

-- App checks on startup
-- Show maintenance screen if disabled
```

**Option 2: Emergency Build (6h)**
```bash
git revert HEAD
# Increment version to 1.0.1
eas build --profile production --platform all
# Request expedited review (critical bug)
```

**Option 3: Halt Rollout (Android only)**
```bash
# Play Console → Production → Halt rollout
```

#### Hora 8: Final Checklist

```markdown
# GO/NO-GO Decision

## GO Criteria (all YES):
- [ ] App Review: "In Review" or "Approved"
- [ ] No critical bugs in testing
- [ ] Webhook tested in last 24h
- [ ] Legal docs accessible
- [ ] Support email operational

## NO-GO (any triggers delay):
- [ ] Critical bug found
- [ ] Rejection pending fix
- [ ] Webhook failing
- [ ] Legal docs inaccessible
```

**DIA 10 ENTREGÁVEIS:**
✅ Response templates prontos
✅ Marketing materials preparados
✅ Support system operacional
✅ Rollback plan testado
✅ Final checklist completo

---

## 📊 MÉTRICAS DE SUCESSO (PRIMEIRO MÊS)

### Downloads
- Dia 1: 100-500
- Semana 1: 1.000-5.000
- Mês 1: 5.000-20.000

### Subscriptions
- Trial starts: 20-30% dos downloads
- Trial → Paid: 15-25%
- Meta: 50-200 pagantes no Mês 1

### Revenue
- MRR Meta: R$ 1.000-4.000 (Mês 1)
- ARPU: R$ 15-25

### Quality
- Crash rate: < 1%
- Rating: > 4.0 estrelas
- Response time support: < 24h

---

## 🚨 ARQUIVOS CRÍTICOS (NÃO MODIFICAR SEM VALIDAR)

1. `/Users/lion/Documents/Lion/NossaMaternidade/app.config.js`
   - Bundle ID iOS: `br.com.nossamaternidade.app`
   - Package Android: `com.nossamaternidade.app`
   - Version numbers

2. `/Users/lion/Documents/Lion/NossaMaternidade/src/types/premium.ts`
   - Product IDs (lines 109-112)
   - Entitlement (line 116)
   - Prices (lines 153-171)

3. `/Users/lion/Documents/Lion/NossaMaternidade/supabase/functions/webhook/index.ts`
   - Webhook handler
   - Event processing

4. `/Users/lion/Documents/Lion/NossaMaternidade/src/state/premium-store.ts`
   - Premium state management

5. `/Users/lion/Documents/Lion/NossaMaternidade/eas.json`
   - Build profiles
   - Submission config

6. `/Users/lion/Documents/Lion/NossaMaternidade/.env.local`
   - API keys (NEVER commit)

---

## 📞 EMERGENCY CONTACTS

```
Apple Developer Support: https://developer.apple.com/contact/
Google Play Support: https://support.google.com/googleplay/android-developer
RevenueCat Support: support@revenuecat.com
Supabase Support: support@supabase.com
Expo Support: https://expo.dev/contact
```

---

## ✅ FINAL VERIFICATION BEFORE LAUNCH

```bash
# Run this command on Day 10:
npm run quality-gate && \
curl -I [privacy URL] && \
curl -I [terms URL] && \
curl -I [AI disclaimer URL] && \
echo "✅ ALL SYSTEMS GO!"
```

Se TODAS as verificações passarem → **LAUNCH! 🚀**

---

**Este plano foi criado com base em:**
- Exploration de 3 agentes (RevenueCat, Backend, Premium Gating)
- Análise de arquivos críticos do código
- Status documents (STATUS_REVENUECAT.md, PLANO_LANCAMENTO_IOS_ANDROID.md)
- Best practices para App Store e Google Play submission

**Executado por:** Claude Code (Plan Agent)
**Data:** 26 de Dezembro de 2025
**Versão do Plano:** 1.0 - ULTRA-DETALHADO
**Tempo Estimado Total:** 80 horas (10 dias úteis) + 32 horas monitoring (4 dias)
