# Status RevenueCat - Nossa Maternidade

**Data**: 2025-12-24 01:05:55
**Status**: ⏳ Configuração Pendente

---

## ✅ O Que Já Está Pronto

### Código
- ✅ SDK instalado: `react-native-purchases` v9.6.7
- ✅ Service layer: `src/services/revenuecat.ts`
- ✅ Premium store: `src/state/premium-store.ts`
- ✅ Paywall screen: `src/screens/PaywallScreen.tsx`
- ✅ Premium gate: `src/components/PremiumGate.tsx`

### Identificadores do App
- ✅ iOS Bundle ID: `com.nossamaternidade.app`
- ✅ Android Package: `com.nossamaternidade.app`

### Product IDs (Hardcoded no Código)
- ✅ Mensal: `nossa_maternidade_monthly`
- ✅ Anual: `nossa_maternidade_yearly`

### Entitlement (Hardcoded no Código)
- ✅ Identifier: `premium` (OBRIGATÓRIO - deve ser exatamente este nome)

### Offering (Hardcoded no Código)
- ✅ Identifier: `default` (OBRIGATÓRIO - é buscado automaticamente)

### Variáveis de Ambiente
- ✅ Chave iOS (teste): `test_sHyDAsAlAcvbPaCXagzIPFlNIUS`
- ⚠️ Chave Android: Não configurada (placeholder: `...`)

---

## ⏳ O Que Precisa Ser Feito

### 1. RevenueCat Dashboard - Configurar Apps

#### iOS App
- [ ] Bundle ID: `com.nossamaternidade.app`
- [ ] Gerar chave .p8 do App Store Connect
- [ ] Upload da chave .p8 no RevenueCat
- [ ] Configurar Key ID e Issuer ID

#### Android App
- [ ] Package Name: `com.nossamaternidade.app`
- [ ] Criar Service Account no Google Cloud
- [ ] Gerar Service Account JSON
- [ ] Conceder permissões no Google Play Console
- [ ] Upload do JSON no RevenueCat

### 2. App Store Connect (iOS)

- [ ] Criar Subscription Group: "Nossa Maternidade Premium"
- [ ] Criar produto: `nossa_maternidade_monthly`
  - Price: R$ 19,90/mês
  - Duration: 1 Month
  - Free Trial: 7 days
- [ ] Criar produto: `nossa_maternidade_yearly`
  - Price: R$ 99,00/ano
  - Duration: 1 Year
  - Free Trial: 7 days
- [ ] Aguardar aprovação (até 24h)

### 3. Google Play Console (Android)

- [ ] Criar subscription: `nossa_maternidade_monthly`
  - Price: R$ 19,90
  - Billing period: Monthly
  - Free trial: 7 days
- [ ] Criar subscription: `nossa_maternidade_yearly`
  - Price: R$ 99,00
  - Billing period: Yearly
  - Free trial: 7 days
- [ ] Configurar License Testing (emails de teste)

### 4. RevenueCat Dashboard - Produtos

- [ ] Adicionar produto iOS: `nossa_maternidade_monthly`
- [ ] Adicionar produto iOS: `nossa_maternidade_yearly`
- [ ] Adicionar produto Android: `nossa_maternidade_monthly`
- [ ] Adicionar produto Android: `nossa_maternidade_yearly`

### 5. RevenueCat Dashboard - Entitlements

- [ ] Criar entitlement:
  - Identifier: `premium` (EXATAMENTE este nome)
  - Description: Acesso a todos os recursos premium
  - Vincular produtos: todos os 4 produtos acima

### 6. RevenueCat Dashboard - Offerings

- [ ] Criar offering:
  - Identifier: `default` (EXATAMENTE este nome)
  - Marcar como "Default"
  - Adicionar Package 1:
    - Identifier: `monthly`
    - Product: `nossa_maternidade_monthly`
  - Adicionar Package 2:
    - Identifier: `annual`
    - Product: `nossa_maternidade_yearly`

### 7. Obter API Keys

- [ ] Ir em: Apps & providers → API keys
- [ ] Copiar Public SDK Key iOS: `appl_XXXXXXXXXXXXXXXX`
- [ ] Copiar Public SDK Key Android: `goog_XXXXXXXXXXXXXXXX`

### 8. Atualizar .env.local

```bash
# Substituir chave de teste pela de produção
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_XXXXXXXXXXXXXXXX
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_XXXXXXXXXXXXXXXX
```

---

## 📋 Checklist Rápido

### Configuração Básica
- [x] Código implementado
- [x] Identificadores do app definidos
- [x] Product IDs definidos no código
- [ ] Apps configurados no RevenueCat
- [ ] Produtos criados nas lojas
- [ ] Entitlement criado
- [ ] Offering criado
- [ ] API keys obtidas
- [ ] .env.local atualizado

### Testes
- [ ] Build de desenvolvimento testado
- [ ] Sandbox iOS funcionando
- [ ] Sandbox Android funcionando
- [ ] Compra processa com sucesso
- [ ] `isPremium` muda para `true` após compra
- [ ] Restaurar compras funciona

---

## 🔗 Links Úteis

- RevenueCat Dashboard: https://app.revenuecat.com
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Documentação: `docs/PREMIUM_IAP_SETUP.md`

---

## ⚠️ Importante

1. **Product IDs**: Use EXATAMENTE `nossa_maternidade_monthly` e `nossa_maternidade_yearly` (não `premium_monthly`)
2. **Entitlement**: Deve ser EXATAMENTE `premium` (case-sensitive)
3. **Offering**: Deve ser EXATAMENTE `default` (case-sensitive)
4. **Package Identifiers**: `monthly` e `annual` (não `premium_monthly`)

---

**Última atualização**: 2025-12-24 01:05:55
