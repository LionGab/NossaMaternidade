# 🔐 Configurar Nova Chave APNs no Supabase

**App**: Nossa Maternidade
**Nova APN Key ID**: `RV9893RP92` ✅
**Team ID**: `KZPW4S77UH` ✅
**Status**: Pronto para configurar no Supabase

---

## ✅ O QUE VOCÊ TEM

| Item | Valor | Status |
|------|-------|--------|
| APN Key ID (novo) | `RV9893RP92` | ✅ |
| Apple Team ID | `KZPW4S77UH` | ✅ |
| Arquivo .p8 | `AuthKey_RV9893RP92.p8` | ✅ (você baixou) |
| Bundle ID | `br.com.nossamaternidade.app` | ✅ |

---

## 🎯 CONFIGURAÇÃO NO SUPABASE

### OPÇÃO 1: Configurar via Supabase CLI (Recomendado)

#### Passo 1: Instalar Supabase CLI
```bash
# Se ainda não tem instalado
npm install -g supabase

# Verificar instalação
supabase --version
```

#### Passo 2: Login no Supabase
```bash
supabase login

# Vai abrir navegador para autenticação
# Ou use access token do dashboard
```

#### Passo 3: Link ao Projeto
```bash
# No diretório do projeto
cd ~/path/to/NossaMaternidade

# Link ao projeto Supabase
supabase link --project-ref SEU_PROJECT_REF

# Project Ref: encontre em Supabase Dashboard → Settings → General
```

#### Passo 4: Configurar Secrets
```bash
# 1. APNS_KEY_ID (Nova chave!)
supabase secrets set APNS_KEY_ID="RV9893RP92"

# 2. APNS_TEAM_ID
supabase secrets set APNS_TEAM_ID="KZPW4S77UH"

# 3. APNS_PRIVATE_KEY (conteúdo do arquivo .p8)
supabase secrets set APNS_PRIVATE_KEY="$(cat AuthKey_RV9893RP92.p8)"

# IMPORTANTE: Execute o comando acima no mesmo diretório onde está o arquivo .p8
```

**⚠️ CRÍTICO**: O arquivo `.p8` deve estar no diretório atual quando rodar o comando!

Se der erro "file not found":
```bash
# Verificar onde está o arquivo
ls -la AuthKey_RV9893RP92.p8

# Ou especificar caminho completo
supabase secrets set APNS_PRIVATE_KEY="$(cat /Users/User/Downloads/AuthKey_RV9893RP92.p8)"
```

#### Passo 5: Verificar Secrets Configurados
```bash
# Listar secrets (sem mostrar valores)
supabase secrets list

# Deve mostrar:
# APNS_KEY_ID
# APNS_TEAM_ID
# APNS_PRIVATE_KEY
```

---

### OPÇÃO 2: Configurar via Supabase Dashboard

Se preferir interface gráfica:

#### Passo 1: Acessar Dashboard
```
1. Acesse: https://supabase.com/dashboard
2. Selecione projeto "Nossa Maternidade"
3. Menu lateral → "Settings" → "Vault"
```

#### Passo 2: Criar Secrets

**Secret 1: APNS_KEY_ID**
```
- Name: APNS_KEY_ID
- Value: RV9893RP92
- Clique em "Add Secret"
```

**Secret 2: APNS_TEAM_ID**
```
- Name: APNS_TEAM_ID
- Value: KZPW4S77UH
- Clique em "Add Secret"
```

**Secret 3: APNS_PRIVATE_KEY**
```
1. Abra o arquivo AuthKey_RV9893RP92.p8 no editor de texto
2. Copie TODO o conteúdo (incluindo -----BEGIN e -----END)
3. Name: APNS_PRIVATE_KEY
4. Value: [Cole o conteúdo completo do .p8]
5. Clique em "Add Secret"
```

**Formato esperado do APNS_PRIVATE_KEY:**
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
[várias linhas de base64]
...A7FX0uB+
-----END PRIVATE KEY-----
```

---

### OPÇÃO 3: Configurar via Edge Function Environment

Se seus Edge Functions usam variáveis de ambiente:

#### Passo 1: Criar arquivo .env.local
```bash
# No diretório supabase/functions/
cd supabase/functions

# Criar arquivo de ambiente
touch .env.local
```

#### Passo 2: Adicionar Variáveis
```bash
# Edite supabase/functions/.env.local
APNS_KEY_ID=RV9893RP92
APNS_TEAM_ID=KZPW4S77UH
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[conteúdo do .p8]
-----END PRIVATE KEY-----"
```

**⚠️ IMPORTANTE**: NÃO commite `.env.local` no Git!

```bash
# Adicione ao .gitignore
echo "supabase/functions/.env.local" >> .gitignore
```

---

## 🔧 TESTAR CONFIGURAÇÃO

### Teste 1: Verificar Secrets no Supabase
```bash
supabase secrets list

# Deve listar 3 secrets:
# - APNS_KEY_ID
# - APNS_TEAM_ID
# - APNS_PRIVATE_KEY
```

### Teste 2: Testar Edge Function de Notificações

Se você tem uma Edge Function de push notifications:

```bash
# Deploy da function (se ainda não fez)
supabase functions deploy send-push-notification

# Testar localmente
supabase functions serve send-push-notification
```

Ou teste via Dashboard:
```
Supabase Dashboard → Edge Functions → send-push-notification → "Invoke"

Body de teste:
{
  "deviceToken": "test-token",
  "title": "Teste",
  "body": "Testando push notification"
}
```

---

## 📝 ATUALIZAR CÓDIGO (Se Necessário)

Se você tiver código que usa as chaves APNs, verifique:

### Edge Function de Push Notifications

**Arquivo**: `supabase/functions/send-push-notification/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const APNS_KEY_ID = Deno.env.get('APNS_KEY_ID')!; // RV9893RP92
const APNS_TEAM_ID = Deno.env.get('APNS_TEAM_ID')!; // KZPW4S77UH
const APNS_PRIVATE_KEY = Deno.env.get('APNS_PRIVATE_KEY')!;

// Usar nas requisições para APNs
const apnsUrl = `https://api.push.apple.com/3/device/${deviceToken}`;
const headers = {
  'authorization': `bearer ${jwtToken}`,
  'apns-topic': 'br.com.nossamaternidade.app', // Bundle ID
};
```

---

## ⚠️ CHECKLIST DE SEGURANÇA

Antes de continuar, confirme:

- [ ] ✅ Revogou a chave antiga (`7NM7SXW7DV`)
- [ ] ✅ Baixou o arquivo `.p8` da nova chave
- [ ] ✅ Guardou `.p8` em local seguro (1Password, Bitwarden)
- [ ] ✅ Configurou 3 secrets no Supabase
- [ ] ✅ NÃO commitou `.p8` ou conteúdo da chave no Git
- [ ] ✅ Adicionou `.env.local` ao `.gitignore`

---

## 🆘 TROUBLESHOOTING

### Erro: "Secret already exists"
**Solução**: Delete o secret antigo primeiro
```bash
supabase secrets unset APNS_KEY_ID
supabase secrets set APNS_KEY_ID="RV9893RP92"
```

### Erro: "Invalid private key format"
**Solução**: Verifique que copiou TODO o conteúdo do `.p8`, incluindo:
```
-----BEGIN PRIVATE KEY-----
[conteúdo]
-----END PRIVATE KEY-----
```

### Erro: "file not found: AuthKey_RV9893RP92.p8"
**Solução**: Especifique caminho completo
```bash
# Encontre o arquivo
find ~ -name "AuthKey_RV9893RP92.p8"

# Use caminho completo
supabase secrets set APNS_PRIVATE_KEY="$(cat /caminho/completo/AuthKey_RV9893RP92.p8)"
```

### Edge Function não consegue enviar push
**Possíveis causas**:
1. Bundle ID incorreto no cabeçalho `apns-topic`
2. Token JWT mal formado
3. Device token inválido

**Solução**:
```typescript
// Verificar bundle ID
const bundleId = 'br.com.nossamaternidade.app'; // EXATO!

// Log para debug
console.log('APNS_KEY_ID:', Deno.env.get('APNS_KEY_ID'));
console.log('APNS_TEAM_ID:', Deno.env.get('APNS_TEAM_ID'));
```

---

## 📊 VALORES DE REFERÊNCIA

Para copiar/colar:

```bash
# APN Key ID (nova)
RV9893RP92

# Team ID
KZPW4S77UH

# Bundle ID
br.com.nossamaternidade.app

# APNs Production URL
https://api.push.apple.com

# APNs Sandbox URL (para testes)
https://api.sandbox.push.apple.com
```

---

## 🎯 PRÓXIMO PASSO DEPOIS DE CONFIGURAR

Depois de configurar os secrets:

1. ✅ **Testar push notifications** (em dev)
2. ✅ **Configurar RevenueCat** (próximo item)
3. ✅ **Criar In-App Purchases**
4. ✅ **Primeiro build EAS**

---

## 📚 RECURSOS

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Supabase Secrets Management](https://supabase.com/docs/guides/cli/managing-config#managing-secrets)
- [APNs Provider API](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server)
- [Push Notifications with Supabase](https://supabase.com/docs/guides/functions/examples/push-notifications)

---

**Data**: 24 de dezembro de 2024
**Status**: Pronto para configurar
**Tempo estimado**: 10 minutos
