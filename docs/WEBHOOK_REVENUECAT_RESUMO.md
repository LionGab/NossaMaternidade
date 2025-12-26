# 🔗 Webhook RevenueCat - Resumo Completo

## 📊 Status Atual

| Item | Status | Detalhes |
|------|--------|----------|
| **Código** | ✅ Implementado | `supabase/functions/webhook/index.ts` |
| **Deploy** | ✅ Deployado | Edge Function ativa |
| **Secret** | ✅ Configurado | No Supabase Secrets |
| **Dashboard** | ⚠️ Pendente | Precisa configurar no RevenueCat |

---

## 🔑 Informações Essenciais

### URL do Webhook
```
https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
```

### Bearer Token (Secret)
```
925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
```

⚠️ **IMPORTANTE**: 
- No RevenueCat Dashboard, coloque **APENAS o valor** (sem "Bearer")
- O RevenueCat adiciona "Bearer " automaticamente ao enviar

---

## ⚙️ Configuração no RevenueCat Dashboard

### Passo a Passo

1. **Acesse**: https://app.revenuecat.com
2. **Selecione**: Projeto "Nossa Maternidade"
3. **Navegue**: Project Settings → Integrations → Webhooks
4. **Clique**: "+ Add Webhook" ou "Create Webhook"

### Campos a Preencher

```
Webhook name: Nossa Maternidade Webhook
Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
Authorization header value: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
Environment: Production + Sandbox ✅
App: All apps ✅
Event type: All events ✅
  - ✅ INITIAL_PURCHASE
  - ✅ RENEWAL
  - ✅ CANCELLATION
  - ✅ UNCANCELLATION
  - ✅ EXPIRATION
  - ✅ BILLING_ISSUE
  - ✅ PRODUCT_CHANGE
  - ✅ SUBSCRIPTION_PAUSED
```

5. **Clique**: "Save" ou "Create"

---

## 🧪 Testar Webhook

### 1. Enviar Teste do Dashboard

1. No RevenueCat Dashboard, após salvar o webhook
2. Clique em **"Test"** ou **"Send Test Event"**
3. Selecione event type: **TEST**
4. Clique em **"Send"**

### 2. Verificar Logs

**No Supabase Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi
2. Vá em: **Logs** → **Edge Functions** → **webhook**
3. Procure por: `✅ [WEBHOOK] RevenueCat event: TEST`

**Via Terminal:**
```bash
npx supabase functions logs webhook --tail --project-ref lqahkqfpynypbmhtffyi
```

### 3. Verificar Banco de Dados

No Supabase Dashboard → Table Editor → `webhook_transactions`:

Deve aparecer uma linha:
- `source`: "revenuecat"
- `event_type`: "TEST"
- `status`: "processed"

---

## 📋 Eventos Processados

O webhook processa os seguintes eventos:

| Evento | Descrição | Ação |
|--------|-----------|------|
| `INITIAL_PURCHASE` | Primeira compra | Ativa premium no usuário |
| `RENEWAL` | Renovação | Mantém premium ativo |
| `CANCELLATION` | Cancelamento | Marca como cancelado (mantém até expirar) |
| `UNCANCELLATION` | Reativação | Reativa premium |
| `EXPIRATION` | Expiração | Remove premium |
| `BILLING_ISSUE` | Problema de cobrança | Notifica usuário |
| `PRODUCT_CHANGE` | Mudança de produto | Atualiza plano |
| `SUBSCRIPTION_PAUSED` | Pausado | Pausa acesso premium |

---

## 🔒 Segurança

### Autenticação

O webhook valida o Bearer token:

```typescript
// RevenueCat envia:
Authorization: Bearer 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525

// Código valida:
const token = authHeader.replace("Bearer ", "");
return token === REVENUECAT_WEBHOOK_SECRET;
```

### Idempotência

- ✅ Previne processamento duplicado de eventos
- ✅ Usa cache em memória + banco de dados
- ✅ TTL: 24 horas

### Logging

- ✅ Todos os eventos são logados em `webhook_transactions`
- ✅ Inclui: event_id, event_type, status, processed_at
- ✅ Para auditoria e debug

---

## 🐛 Troubleshooting

### Webhook Não Recebe Eventos

1. **Verificar URL no Dashboard**
   - Deve ser exatamente: `https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat`

2. **Verificar Secret**
   - No Dashboard: `925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525`
   - No Supabase: Verificar secret `REVENUECAT_WEBHOOK_SECRET`

3. **Verificar Logs**
   ```bash
   npx supabase functions logs webhook --tail
   ```
   - Se aparecer erro 401: Secret incorreto
   - Se aparecer erro 404: URL incorreta

### Evento Não Processa

1. **Verificar tabela `webhook_transactions`**
   - Se status = "failed": Verificar error message
   - Se status = "processed": Evento já foi processado (idempotência)

2. **Verificar usuário existe**
   - `app_user_id` deve ser UUID do usuário no Supabase
   - Ou email do usuário

3. **Verificar logs do Edge Function**
   - Procurar por erros específicos

---

## 📚 Arquivos Relacionados

- **Código**: `supabase/functions/webhook/index.ts`
- **Documentação**: `docs/VERIFICACAO_WEBHOOK_REVENUECAT.md`
- **Setup Premium**: `docs/PREMIUM_IAP_SETUP.md`
- **Plano de Lançamento**: `docs/PLANO_LANCAMENTO_10_DIAS.md`

---

## ✅ Checklist Final

- [x] Código implementado ✅
- [x] Deploy realizado ✅
- [x] Secret configurado no Supabase ✅
- [ ] Webhook configurado no RevenueCat Dashboard ⚠️
- [ ] Teste enviado e processado ⚠️
- [ ] Logs verificados ⚠️

---

## 🔗 Links Úteis

- **RevenueCat Dashboard**: https://app.revenuecat.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi
- **RevenueCat Webhook Docs**: https://www.revenuecat.com/docs/webhooks
- **Supabase Functions Docs**: https://supabase.com/docs/guides/functions

---

**Última Atualização**: 2025-12-26  
**Status**: ⚠️ Aguardando configuração no Dashboard

