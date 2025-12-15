# Premium/IAP Setup - RevenueCat

**Status**: ✅ Código Implementado (100%)
**Configuração**: ⏳ Pendente (RevenueCat Dashboard + API Keys)
**Data**: 15 de dezembro de 2025
**Lançamento**: 06 de janeiro de 2026 (22 dias)

---

## Visão Geral

Sistema de assinaturas Premium implementado com **RevenueCat SDK** para processar compras in-app (iOS + Android).

### O Que Foi Implementado

✅ **SDK instalado**: `react-native-purchases` v9.6.7
✅ **Service layer**: [src/services/purchases.ts](../src/services/purchases.ts)
✅ **Premium store**: [src/state/premium-store.ts](../src/state/premium-store.ts)
✅ **Types**: [src/types/premium.ts](../src/types/premium.ts)
✅ **Paywall UI**: [src/screens/PaywallScreen.tsx](../src/screens/PaywallScreen.tsx)
✅ **Premium Gate**: [src/components/PremiumGate.tsx](../src/components/PremiumGate.tsx)
✅ **App initialization**: [App.tsx:60-70](../App.tsx#L60-L70)
✅ **Auth sync**: [src/api/auth.ts:63-65](../src/api/auth.ts#L63-L65) (login), [src/api/auth.ts:81-82](../src/api/auth.ts#L81-L82) (logout)
✅ **Free limit**: [src/screens/AssistantScreen.tsx:168-174](../src/screens/AssistantScreen.tsx#L168-L174) (10 mensagens)

---

## Arquitetura

```
App Startup
    ↓
App.tsx → initializePurchases()
    ↓
Purchases.configure({ apiKey })
    ↓
syncWithRevenueCat() → getCustomerInfo()
    ↓
usePremiumStore.isPremium = entitlements.active['premium']

User Flow
    ↓
Acessa feature premium → PremiumGate
    ↓
Se !isPremium → Navigate('Paywall')
    ↓
Paywall → getPackages() → Lista planos
    ↓
User clica "Assinar" → purchasePackage(pkg)
    ↓
RevenueCat processa → customerInfo updated
    ↓
syncWithRevenueCat() → isPremium = true
    ↓
Feature desbloqueada ✅
```

---

## Configuração Necessária (Próximos Passos)

### 1. Criar Conta RevenueCat (10 min)

1. Acesse: https://app.revenuecat.com/signup
2. Crie conta (grátis até 10k USD revenue/mês)
3. Crie projeto: **"Nossa Maternidade"**

### 2. Configurar Produtos nas Lojas (30 min)

#### iOS (App Store Connect)

1. Acesse: https://appstoreconnect.apple.com
2. Selecione app: **Nossa Maternidade** (bundleId: `com.nossamaternidade.app`)
3. Vá em **Features** → **Subscriptions** → **Create Subscription Group**
4. Crie 2 produtos:

**Produto 1 - Mensal**:
- Product ID: `nossa_maternidade_monthly`
- Duration: 1 month
- Price: R$ 19,99/mês
- Display Name: Plano Mensal
- Description: Acesso completo mensal

**Produto 2 - Anual**:
- Product ID: `nossa_maternidade_yearly`
- Duration: 1 year
- Price: R$ 119,90/ano
- Display Name: Plano Anual
- Description: Acesso completo anual (economize 50%)

5. Configure **Free Trial**: 7 dias (opcional)
6. Salve e aguarde aprovação (até 24h)

#### Android (Google Play Console)

1. Acesse: https://play.google.com/console
2. Selecione app: **Nossa Maternidade** (package: `com.nossamaternidade.app`)
3. Vá em **Monetization** → **Subscriptions** → **Create subscription**
4. Crie 2 produtos (mesmos IDs do iOS):

**Produto 1 - Mensal**:
- Product ID: `nossa_maternidade_monthly`
- Billing period: Monthly
- Price: R$ 19,99
- Title: Plano Mensal
- Description: Acesso completo mensal

**Produto 2 - Anual**:
- Product ID: `nossa_maternidade_yearly`
- Billing period: Yearly
- Price: R$ 119,90
- Title: Plano Anual
- Description: Economize 50% com o plano anual

5. Configure **Free trial**: 7 dias (opcional)
6. Salve e aguarde aprovação

### 3. Configurar no RevenueCat Dashboard (20 min)

#### 3.1 Conectar Lojas

1. No dashboard RevenueCat, vá em **Project Settings**
2. Clique **App Store Connect**:
   - Upload App Store Connect API Key (.p8 file)
   - Issuer ID + Key ID
   - Salvar
3. Clique **Google Play**:
   - Upload Service Account JSON
   - Salvar

#### 3.2 Adicionar Produtos

1. Vá em **Products**
2. Clique **+ New**
3. Adicione produtos:
   - **iOS Monthly**: `nossa_maternidade_monthly`
   - **iOS Yearly**: `nossa_maternidade_yearly`
   - **Android Monthly**: `nossa_maternidade_monthly`
   - **Android Yearly**: `nossa_maternidade_yearly`

#### 3.3 Criar Entitlement

1. Vá em **Entitlements**
2. Clique **+ New**
3. Criar entitlement:
   - **Identifier**: `premium` (OBRIGATÓRIO - hardcoded no código)
   - **Display name**: Premium Access
   - Produtos vinculados: Todos os 4 produtos criados acima

#### 3.4 Criar Offering

1. Vá em **Offerings**
2. Clique **+ New**
3. Criar offering:
   - **Identifier**: `default` (é buscado automaticamente)
   - Adicionar packages:
     - **Package 1**: Type = MONTHLY, Product = nossa_maternidade_monthly
     - **Package 2**: Type = ANNUAL, Product = nossa_maternidade_yearly

#### 3.5 Copiar API Keys

1. Vá em **API Keys**
2. Copie:
   - **iOS**: `appl_xxxxxxxxxxxx` (Apple App-Specific Shared Secret)
   - **Android**: `goog_xxxxxxxxxxxx` (Google Service Credentials)

### 4. Atualizar Variáveis de Ambiente (5 min)

Criar/editar arquivo `.env.local` (ou adicionar no EAS Secrets):

```bash
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxx
```

**IMPORTANTE**: As API keys do RevenueCat são **públicas** e seguras para serem incluídas no código. Elas identificam apenas o app, não dão acesso a dados sensíveis.

### 5. Testar em Sandbox (30 min)

#### iOS Sandbox

1. Em iPhone/iPad físico:
   - Settings → App Store → Sandbox Account
   - Adicionar conta de teste (criar em https://appstoreconnect.apple.com → Users and Access → Sandbox Testers)
2. Build app: `eas build --profile preview --platform ios`
3. Instalar via TestFlight ou direct install
4. Testar compra → deve processar sem cobrar

#### Android Testing

1. Em Google Play Console:
   - Setup → License Testing
   - Adicionar email de teste
2. Build app: `eas build --profile preview --platform android`
3. Instalar .apk
4. Testar compra → deve processar sem cobrar

---

## Fluxo de Teste

### 1. Verificar Inicialização

Abra o app e verifique os logs:

```
✅ [Purchases] Initialized successfully
✅ [PremiumStore] Premium status checked { isPremium: false }
```

### 2. Abrir Paywall

Navegue para uma feature premium (ex: AssistantScreen após 10 mensagens):

```
✅ [PaywallScreen] Loading plans...
✅ [PaywallScreen] Plans loaded: 2 packages
```

### 3. Selecionar Plano

Selecione plano anual:

```
✅ Selected plan: yearly
✅ Price: R$ 119,90/ano
```

### 4. Realizar Compra

Clique "Assinar Agora":

```
✅ [Purchases] Starting purchase { productId: "nossa_maternidade_yearly" }
✅ [Purchases] Purchase successful
✅ [PremiumStore] Premium status checked { isPremium: true }
✅ Redirected back to app
```

### 5. Verificar Acesso

Tente acessar feature premium:

```
✅ [PremiumGate] Access granted { isPremium: true }
✅ Feature unlocked
```

### 6. Testar Restaurar Compras

Desinstale e reinstale o app → Abra Paywall → Clique "Restaurar Compras":

```
✅ [Purchases] Restore successful
✅ [PremiumStore] Premium restored { isPremium: true }
```

---

## Estrutura de Arquivos

```
src/
├── services/
│   └── purchases.ts                   # RevenueCat service (API calls)
├── state/
│   └── premium-store.ts               # Zustand store (isPremium state)
├── types/
│   └── premium.ts                     # TypeScript types
├── screens/
│   ├── PaywallScreen.tsx              # Tela de assinatura
│   └── AssistantScreen.tsx            # Limite de 10 msgs free
├── components/
│   └── PremiumGate.tsx                # Wrapper para features premium
└── api/
    └── auth.ts                        # Sync RevenueCat on login/logout

App.tsx                                # Inicialização (linha 60-70)
app.config.js                          # API keys config (linha 164-166)
```

---

## Debugging

### Problema: "No offerings found"

**Causa**: Produtos não configurados no RevenueCat ou não vinculados ao offering.

**Solução**:
1. Verifique se produtos existem em **Products** no dashboard
2. Verifique se offering **default** tem packages vinculados
3. Aguarde até 5 minutos para sincronizar

### Problema: "Purchase failed"

**Causa**: Sandbox não configurado ou produto não aprovado nas lojas.

**Solução**:
1. iOS: Verifique sandbox account em Settings
2. Android: Verifique license testing email
3. Aguarde até 24h após criar produtos (Apple review)

### Problema: "isPremium sempre false"

**Causa**: Entitlement "premium" não existe ou não vinculado aos produtos.

**Solução**:
1. Verifique entitlement chamado exatamente **"premium"** (case-sensitive)
2. Verifique se todos os 4 produtos estão vinculados ao entitlement
3. Force sync: `await syncWithRevenueCat()`

### Logs Úteis

```typescript
// Ver status do cliente
const customerInfo = await Purchases.getCustomerInfo();
console.log('Active entitlements:', Object.keys(customerInfo.entitlements.active));
console.log('All entitlements:', customerInfo.entitlements.all);

// Ver offerings
const offerings = await Purchases.getOfferings();
console.log('Current offering:', offerings.current?.identifier);
console.log('Packages:', offerings.current?.availablePackages.length);

// Debug Premium Store
const { isPremium, subscription } = usePremiumStore.getState();
console.log({ isPremium, subscription });
```

---

## Limitações

### Expo Go

❌ **IAP NÃO funciona no Expo Go**. Precisa de **EAS build** ou **bare workflow**.

Motivo: RevenueCat requer native modules que não estão disponíveis no Expo Go.

### Simulador iOS

❌ **Compras reais NÃO funcionam no simulador**. Use **device físico** ou **TestFlight**.

### Emulador Android

⚠️ **Compras sandbox funcionam**, mas requer Google Play Services instalado.

---

## Métricas de Sucesso

Após configuração completa, você deve conseguir:

- [ ] App inicia sem erros do RevenueCat
- [ ] Paywall carrega 2 planos (mensal + anual) com preços reais
- [ ] Compra no sandbox processa com sucesso
- [ ] `isPremium` muda para `true` após compra
- [ ] Features premium desbloqueiam automaticamente
- [ ] Restaurar compras funciona (reinstalar app)
- [ ] Login/logout mantém estado correto do Premium

---

## Próximos Passos (Pós-Lançamento)

### Analytics

Adicionar tracking de conversão:

```typescript
// src/services/purchases.ts
import analytics from '@/services/analytics';

export async function purchasePackage(pkg: PurchasesPackage) {
  analytics.track('purchase_initiated', {
    product_id: pkg.identifier,
    price: pkg.product.price,
  });

  const result = await Purchases.purchasePackage(pkg);

  analytics.track('purchase_completed', {
    product_id: pkg.identifier,
    transaction_id: result.customerInfo.originalAppUserId,
  });

  return result;
}
```

### A/B Testing

Testar diferentes preços:

```typescript
// Criar offerings diferentes: default, premium_v2, etc.
const offering = await Purchases.getOfferings();
const testOffering = offering.all['premium_v2']; // A/B test variant
```

### Promoções

Criar códigos promocionais:

```typescript
// iOS: via App Store Connect → Promotional Offers
// Android: via Google Play Console → Pricing → Promo Codes
```

---

## Suporte

**RevenueCat**:
- Docs: https://www.revenuecat.com/docs
- Community: https://community.revenuecat.com
- Status: https://status.revenuecat.com

**Issues conhecidos**:
- iOS review rejection: Certifique-se de que "Restaurar Compras" está visível
- Android payment: Requer Google Play Services atualizado

---

## Checklist de Produção

Antes do lançamento (06/01/2026):

- [ ] Produtos criados e aprovados nas lojas (iOS + Android)
- [ ] RevenueCat configurado (entitlement "premium" + offering "default")
- [ ] API keys adicionadas no EAS Secrets
- [ ] Build de produção testado em device físico
- [ ] Compra sandbox funciona
- [ ] Restaurar compras funciona
- [ ] Paywall aprovado pela Apple (iOS review)
- [ ] Privacy Policy e Terms of Service atualizados (mencionar assinaturas)
- [ ] Suporte preparado para cancelamentos/refunds

---

**Última atualização**: 15 de dezembro de 2025
**Versão**: 1.0.0
**Autor**: Lion (Claude Code)
