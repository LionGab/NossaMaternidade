# 🔑 Guia de Chaves de Subscription - Nossa Maternidade

**Data**: Dezembro 2024  
**Status**: Chaves identificadas e prontas para configuração

---

## 📋 Chaves Identificadas

Você possui **3 arquivos .p8**:

| Arquivo | Key ID | Tipo | Uso |
|---------|--------|------|-----|
| `AuthKey_RV9893RP92.p8` | `RV9893RP92` | **APNs** | ✅ **Já configurado** - Push Notifications |
| `SubscriptionKey_G5H2MH64SP.p8` | `G5H2MH64SP` | **Subscription** | ⏳ **Configurar** - App Store Subscriptions |
| `SubscriptionKey_XXXXXXXXXX.p8` | `XXXXXXXXXX` | **Subscription** | ⚠️ **Verificar** - Pode ser backup ou antiga |

---

## 🎯 O Que Fazer com Cada Chave

### 1. ✅ APNs Key (`AuthKey_RV9893RP92.p8`)

**Status**: ✅ **Já configurado no Supabase**

- **Onde está**: Supabase Edge Functions Secrets
- **Secrets configurados**:
  - `APNS_KEY_ID` = `RV9893RP92`
  - `APNS_TEAM_ID` = `KZPW4S77UH`
  - `APNS_PRIVATE_KEY` = (conteúdo do arquivo)

**Nada a fazer** - já está pronto para push notifications!

---

### 2. ⏳ Subscription Key (`SubscriptionKey_G5H2MH64SP.p8`)

**Status**: ⏳ **Precisa configurar**

Esta chave é usada para:

#### A) RevenueCat Server-Side Receipt Validation

**Onde configurar**:
1. Acesse: https://app.revenuecat.com
2. Vá em: **Settings** → **API Keys**
3. Role até: **App Store Shared Secret**
4. Cole o conteúdo da chave (ou Key ID: `G5H2MH64SP`)

**Quando usar**:
- Validar receipts de compras no backend
- Verificar assinaturas ativas
- Processar renovações automáticas

#### B) App Store Server Notifications (Webhooks)

**Onde configurar**:
1. App Store Connect → **Users and Access** → **Keys**
2. Encontre a chave `G5H2MH64SP`
3. Configure webhook URL no Supabase Edge Function

**Quando usar**:
- Receber notificações de eventos de subscription
- Processar cancelamentos
- Detectar renovações

#### C) Supabase Edge Functions (Opcional)

Se você quiser validar receipts diretamente no Supabase:

```bash
# Configurar no Supabase
supabase secrets set APP_STORE_SUBSCRIPTION_KEY_ID="G5H2MH64SP"
supabase secrets set APP_STORE_SUBSCRIPTION_KEY="<conteudo-do-arquivo>"
```

**Script PowerShell**:
```powershell
.\scripts\setup-subscription-keys.ps1 -SubscriptionKeyPath "C:\Users\User\Downloads\SubscriptionKey_G5H2MH64SP.p8" -KeyId "G5H2MH64SP"
```

---

### 3. ⚠️ Subscription Key Genérica (`SubscriptionKey_XXXXXXXXXX.p8`)

**Status**: ⚠️ **Verificar se ainda é necessária**

**Possíveis cenários**:
- ✅ **Backup** da chave principal → Pode manter como backup
- ❌ **Chave antiga/revogada** → Pode deletar se não for mais usada
- ✅ **Chave de teste** → Manter se for para ambiente de desenvolvimento

**Recomendação**:
1. Verificar no App Store Connect se esta chave ainda existe
2. Se não for mais usada, **revogar** no Apple Developer Portal
3. Se for backup, manter em local seguro (não no Downloads)

---

## 🚀 Configuração Rápida

### Opção 1: Configurar via Script (Recomendado)

```powershell
# Configurar chave principal de subscription
.\scripts\setup-subscription-keys.ps1 -SubscriptionKeyPath "C:\Users\User\Downloads\SubscriptionKey_G5H2MH64SP.p8" -KeyId "G5H2MH64SP"
```

### Opção 2: Configurar Manualmente

#### RevenueCat Dashboard:
1. https://app.revenuecat.com → Settings → API Keys
2. Adicionar App Store Shared Secret: `G5H2MH64SP`

#### Supabase (se necessário):
```bash
# Ler conteúdo do arquivo
$content = Get-Content "C:\Users\User\Downloads\SubscriptionKey_G5H2MH64SP.p8" -Raw

# Configurar secrets
supabase secrets set APP_STORE_SUBSCRIPTION_KEY_ID="G5H2MH64SP"
supabase secrets set APP_STORE_SUBSCRIPTION_KEY="$content"
```

---

## ✅ Checklist de Configuração

- [x] APNs Key configurada no Supabase
- [ ] Subscription Key configurada no RevenueCat
- [ ] Subscription Key configurada no Supabase (se necessário)
- [ ] Webhook URL configurada no App Store Connect
- [ ] Testes de validação de receipt realizados

---

## 🔒 Segurança

### Arquivos .p8 já protegidos:
- ✅ `*.p8` está no `.gitignore`
- ✅ Arquivos não serão commitados no Git

### Recomendações:
1. **Mover arquivos .p8** para local seguro (não deixar em Downloads)
2. **Revogar chaves antigas** no Apple Developer Portal
3. **Nunca commitar** arquivos .p8 no Git
4. **Usar secrets** no Supabase/EAS, nunca hardcoded

---

## 📚 Referências

- [RevenueCat - App Store Shared Secret](https://docs.revenuecat.com/docs/app-store-shared-secret)
- [App Store Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications)
- [Supabase Edge Functions Secrets](https://supabase.com/docs/guides/functions/secrets)

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas sobre qual chave usar ou onde configurar:
1. Verifique no Apple Developer Portal quais chaves estão ativas
2. Consulte a documentação do RevenueCat
3. Verifique os logs do Supabase Edge Functions

---

**Última atualização**: Dezembro 2024

