# 📋 Nossa Maternidade - Resumo de Configuração Completo

**Status**: ✅ **CONFIGURAÇÃO COMPLETA - PRONTO PARA BUILD**
**Data**: 24 de dezembro de 2024

---

## 🎯 TODOS OS IDs E CREDENCIAIS

| Item | Valor | Onde Usar |
|------|-------|-----------|
| **Bundle ID** | `br.com.nossamaternidade.app` | app.json, App Store, RevenueCat |
| **App Store Connect ID** | `6756980888` | eas.json |
| **Apple Team ID** | `KZPW4S77UH` | eas.json, Supabase |
| **SKU** | `nossamaternidade001` | eas.json |
| **APN Key ID (NOVA)** | `RV9893RP92` ✅ | Supabase |
| **APN Key ID (ANTIGA)** | ~~`7NM7SXW7DV`~~ | ❌ REVOGADA |
| **Expo Project ID** | `ceee9479-e404-47b8-bc37-4f913c18f270` | app.json |
| **Developer ID** | `f483d4df-0161-497b-8936-729c4674d1ab` | Apple Developer |

---

## ✅ ARQUIVOS CONFIGURADOS

### app.json
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "br.com.nossamaternidade.app" ✅
    }
  }
}
```

### eas.json
```json
{
  "submit": {
    "production": {
      "ios": {
        "sku": "nossamaternidade001",      ✅
        "ascAppId": "6756980888",          ✅
        "appleTeamId": "KZPW4S77UH"        ✅
      }
    }
  }
}
```

---

## 🔐 SECRETS NECESSÁRIOS NO SUPABASE

```bash
# Configurar via CLI:
supabase secrets set APNS_KEY_ID="RV9893RP92"
supabase secrets set APNS_TEAM_ID="KZPW4S77UH"
supabase secrets set APNS_PRIVATE_KEY="$(cat AuthKey_RV9893RP92.p8)"
```

**Guia completo**: [`docs/CONFIGURE_APNS_SUPABASE.md`](docs/CONFIGURE_APNS_SUPABASE.md)

---

## 🛒 IN-APP PURCHASES (RevenueCat + App Store)

### Produtos a Criar:

**Produto 1: Mensal**
- Product ID: `nossa_maternidade_monthly`
- Display Name: Premium Mensal
- Duration: 1 Month
- Price: R$ 29,90/mês

**Produto 2: Anual**
- Product ID: `nossa_maternidade_yearly`
- Display Name: Premium Anual
- Duration: 1 Year
- Price: R$ 299,90/ano

### Entitlement:
- Identifier: `premium`
- Produtos vinculados: monthly + yearly

**Guia completo**: [`docs/NEXT_STEPS_BUILD_AND_PUBLISH.md`](docs/NEXT_STEPS_BUILD_AND_PUBLISH.md) (Fase 2 e 3)

---

## 📱 COMANDOS PRINCIPAIS

### Build
```bash
# Primeiro build de produção
eas build --platform ios --profile production

# Monitorar build
eas build:list
```

### Submit
```bash
# Upload para App Store Connect
eas submit --platform ios --profile production
```

### Secrets
```bash
# Ver secrets do Supabase
supabase secrets list

# Configurar novo secret
supabase secrets set NOME_DO_SECRET="valor"
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

| Guia | Propósito | Tempo |
|------|-----------|-------|
| [`docs/APP_STORE_SETUP_GUIDE.md`](docs/APP_STORE_SETUP_GUIDE.md) | Setup completo App Store | 350 linhas |
| [`docs/NEXT_STEPS_BUILD_AND_PUBLISH.md`](docs/NEXT_STEPS_BUILD_AND_PUBLISH.md) | Roadmap de publicação | 600 linhas |
| [`docs/CONFIGURE_APNS_SUPABASE.md`](docs/CONFIGURE_APNS_SUPABASE.md) | Configurar push notifications | 250 linhas |
| [`docs/REVENUECAT_USAGE.md`](docs/REVENUECAT_USAGE.md) | Como usar RevenueCat | 400 linhas |

---

## ⏱️ CRONOGRAMA ESTIMADO

| Fase | Tempo | Status |
|------|-------|--------|
| ✅ Configuração básica | 30 min | COMPLETO |
| ⏳ Segurança (APNs) | 15 min | EM PROGRESSO |
| ⏳ RevenueCat | 15 min | AGUARDANDO |
| ⏳ In-App Purchases | 30 min | AGUARDANDO |
| ⏳ Build EAS | 20 min | AGUARDANDO |
| ⏳ Screenshots | 1-2h | AGUARDANDO |
| ⏳ Submissão | 20 min | AGUARDANDO |
| 🕐 Review Apple | 3-5 dias | - |
| **TOTAL** | **~5h + review** | **20% COMPLETO** |

---

## 🎯 PRÓXIMAS 3 AÇÕES (Ordem Exata)

### 1. Configurar Secrets APNs no Supabase
**Tempo**: 10 minutos
```bash
supabase secrets set APNS_KEY_ID="RV9893RP92"
supabase secrets set APNS_TEAM_ID="KZPW4S77UH"
supabase secrets set APNS_PRIVATE_KEY="$(cat AuthKey_RV9893RP92.p8)"
```
**Guia**: [`docs/CONFIGURE_APNS_SUPABASE.md`](docs/CONFIGURE_APNS_SUPABASE.md)

### 2. Configurar RevenueCat Dashboard
**Tempo**: 15 minutos
```
1. https://app.revenuecat.com
2. Bundle ID: br.com.nossamaternidade.app
3. Conectar App Store Connect
4. Criar entitlement "premium"
```

### 3. Criar In-App Purchases
**Tempo**: 30 minutos
```
1. App Store Connect → Subscriptions
2. Criar grupo "Nossa Maternidade Premium"
3. Produto monthly: nossa_maternidade_monthly
4. Produto yearly: nossa_maternidade_yearly
5. Vincular no RevenueCat
```

---

## ⚠️ ALERTAS CRÍTICOS

### 🔴 URGENTE
- [ ] Confirmar que chave antiga `7NM7SXW7DV` foi revogada
- [ ] Guardar arquivo `AuthKey_RV9893RP92.p8` em local seguro
- [ ] Configurar secrets no Supabase

### 🟡 IMPORTANTE
- [ ] Não commitar arquivo `.p8` no Git
- [ ] Não compartilhar Key ID ou Private Key publicamente
- [ ] Criar conta de teste demo antes de submeter app

### 🟢 RECOMENDADO
- [ ] Fazer backup do arquivo `.p8` em 2 locais diferentes
- [ ] Documentar onde guardou as credenciais
- [ ] Testar push notifications antes do build de produção

---

## 📊 PROGRESSO GERAL

```
Configuração App Store:        ████████████████░░ 90%
Segurança (APNs):              ████████████░░░░░░ 70%
RevenueCat:                    ░░░░░░░░░░░░░░░░░░  0%
In-App Purchases:              ░░░░░░░░░░░░░░░░░░  0%
Build & Submit:                ░░░░░░░░░░░░░░░░░░  0%
Screenshots & Info:            ░░░░░░░░░░░░░░░░░░  0%

PROGRESSO TOTAL:               ███░░░░░░░░░░░░░░░ 20%
```

---

## 🆘 LINKS ÚTEIS

| Recurso | URL |
|---------|-----|
| App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer | https://developer.apple.com/account |
| RevenueCat Dashboard | https://app.revenuecat.com |
| Supabase Dashboard | https://supabase.com/dashboard |
| Expo Dashboard | https://expo.dev/accounts/liongab |
| EAS Builds | https://expo.dev/accounts/liongab/projects/nossa-maternidade/builds |

---

## ✅ CHECKLIST COMPLETO

### Configuração Básica
- [x] Bundle ID configurado
- [x] App criado no App Store Connect
- [x] App Store Connect ID obtido
- [x] Apple Team ID obtido
- [x] SKU configurado
- [x] eas.json atualizado
- [x] TypeScript check passou

### Segurança
- [x] Nova chave APNs gerada
- [ ] Chave antiga revogada
- [ ] Arquivo .p8 guardado em local seguro
- [ ] Secrets configurados no Supabase

### RevenueCat
- [ ] Dashboard configurado
- [ ] Bundle ID adicionado
- [ ] App Store Connect conectado
- [ ] Entitlement "premium" criado

### In-App Purchases
- [ ] Subscription group criado
- [ ] Produto monthly criado
- [ ] Produto yearly criado
- [ ] Produtos vinculados no RevenueCat

### Build & Deploy
- [ ] Primeiro build EAS executado
- [ ] Build aprovado (sem erros)
- [ ] Upload para App Store Connect
- [ ] Build processado no App Store

### App Store Info
- [ ] Screenshots adicionados (mínimo 3)
- [ ] Descrição completa escrita
- [ ] Privacy policy configurada
- [ ] Age rating definido
- [ ] Conta demo criada

### Review
- [ ] Testado com TestFlight
- [ ] Checklist pré-submissão completo
- [ ] Submetido para review
- [ ] Aprovado pela Apple ✨

---

**Última atualização**: 24 de dezembro de 2024, 15:30 BRT
**Próxima ação**: Configurar secrets APNs no Supabase
