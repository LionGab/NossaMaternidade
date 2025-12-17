# 📱 Push Notifications - Guia de Deploy e Troubleshooting

Sistema completo de notificações push via Expo Push API, criado em janeiro/2025.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Deploy Passo a Passo](#deploy-passo-a-passo)
4. [Configuração](#configuração)
5. [Testes](#testes)
6. [Monitoramento](#monitoramento)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Arquitetura

```
[App Mobile] → [Edge Function] → [Expo Push API] → [Dispositivos]
                      ↓
                [Notification Queue]
                      ↓
                [Cron Jobs] → [Process Queue]
```

### Componentes

| Componente | Localização | Função |
|------------|-------------|---------|
| **Edge Function** | `supabase/functions/notifications/` | API de envio, templates, tokens |
| **Migrations SQL** | `supabase/migrations/009_*.sql` | Tabelas, triggers, cron jobs |
| **Hook Mobile** | `src/hooks/useNotifications.ts` | Auto-registro, listeners |
| **Tela Preferências** | `src/screens/NotificationPreferencesScreen.tsx` | UI de configuração |

---

## ⚙️ Pré-requisitos

### 1. Conta Expo (OBRIGATÓRIO)

```bash
# 1. Criar conta em https://expo.dev/
# 2. Ir em Account Settings → Access Tokens
# 3. Create Token (nome: "Push Notifications API")
# 4. Copiar token (formato: ExpoToken[XXXXX])
```

### 2. Extensões Supabase

- ✅ `pg_cron` - Para cron jobs
- ✅ `pg_net` - Para HTTP requests (chamar Edge Function)

### 3. Variáveis de Ambiente

```bash
# No Supabase Dashboard → Project Settings → Edge Functions
EXPO_PUSH_API_KEY=ExpoToken[XXXXX]
```

---

## 🚀 Deploy Passo a Passo

### PASSO 1: Deploy da Edge Function

```bash
# 1. Fazer login no Supabase CLI
supabase login

# 2. Fazer deploy da função
supabase functions deploy notifications

# 3. Verificar se deployou
supabase functions list
```

**Output esperado:**
```
✓ notifications (deployed)
```

### PASSO 2: Executar Migrations SQL

```bash
# 1. Verificar status das migrations
supabase db diff

# 2. Aplicar migrations
supabase db push

# 3. Verificar tabelas criadas
supabase db exec --sql "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%notification%';"
```

**Tabelas esperadas:**
- `push_tokens`
- `notification_preferences`
- `notification_queue`
- `notification_history`
- `notification_templates`

### PASSO 3: Habilitar Extensões

```sql
-- SQL Editor no Supabase Dashboard

-- 1. Habilitar pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Habilitar pg_net
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. Verificar
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');
```

### PASSO 4: Configurar Cron Jobs

```sql
-- IMPORTANTE: Substituir [PROJECT_ID] e [SERVICE_KEY]

-- JOB 1: Processar fila (a cada 5 minutos)
SELECT cron.schedule(
  'process-notification-queue',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://[PROJECT_ID].supabase.co/functions/v1/notifications/process-queue',
    headers := jsonb_build_object(
      'x-service-key', '[SERVICE_KEY]',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- JOB 2: Agendar notificações diárias (6h AM UTC)
SELECT cron.schedule(
  'schedule-daily-notifications',
  '0 6 * * *',
  $$
  SELECT schedule_daily_notifications();
  $$
);

-- JOB 3: Limpeza de dados antigos (3h AM UTC)
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 3 * * *',
  $$
  SELECT cleanup_old_notifications();
  $$
);
```

**Obter seu PROJECT_ID e SERVICE_KEY:**
```
PROJECT_ID: Dashboard → Project Settings → General → Reference ID
SERVICE_KEY: Dashboard → Project Settings → API → service_role (secret)
```

### PASSO 5: Verificar Cron Jobs

```sql
-- Ver jobs criados
SELECT * FROM get_cron_jobs_status();

-- Ver última execução
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### PASSO 6: Testar Manualmente

```sql
-- Testar scheduler diário
SELECT * FROM test_daily_scheduler();

-- Verificar fila
SELECT * FROM v_notification_queue_stats;
```

### PASSO 7: Deploy do App Mobile

```bash
# 1. Garantir que dependências estão instaladas
npm install

# 2. Verificar variável de ambiente
grep EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL .env

# 3. Rebuild do app
npx expo start -c

# 4. Testar em device físico (simulador NÃO recebe push)
```

---

## 🔧 Configuração

### Horários (Timezone)

Por padrão, pg_cron usa **UTC**. Para horário de Brasília (UTC-3):

| Horário BRT | Horário UTC | Ajuste |
|-------------|-------------|--------|
| 6h AM       | 9h AM       | `'0 9 * * *'` |
| 3h AM       | 6h AM       | `'0 6 * * *'` |
| 8h PM       | 11h PM      | `'0 23 * * *'` |

**Ajustar cron jobs:**
```sql
-- Mudar de 6h AM UTC para 9h AM UTC (6h AM BRT)
SELECT cron.unschedule('schedule-daily-notifications');
SELECT cron.schedule(
  'schedule-daily-notifications',
  '0 9 * * *',  -- <-- Ajustado
  $$ SELECT schedule_daily_notifications(); $$
);
```

### Preferências de Usuário

Cada usuária pode personalizar:
- **Master switch**: Habilita/desabilita tudo
- **Tipos**: Check-in, afirmações, hábitos, comunidade, ciclo
- **Horários**: Check-in (9h), afirmação (8h), hábitos (20h), wellness (14:30h)
- **Som/Vibração**: Toggles individuais

---

## ✅ Testes

### 1. Teste de Registro de Token

```typescript
// No app mobile (console)
import { useNotifications } from '@/hooks/useNotifications';

const notifications = useNotifications();
await notifications.registerToken();

// Verificar no Supabase
SELECT * FROM push_tokens WHERE user_id = 'YOUR_USER_ID';
```

### 2. Teste de Envio Manual

```bash
# Via curl
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/notifications/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_UUID",
    "type": "custom",
    "title": "Teste",
    "body": "Olá, esta é uma notificação de teste!"
  }'
```

### 3. Teste de Templates

```sql
-- Ver templates disponíveis
SELECT template_key, title_template FROM notification_templates WHERE is_active = TRUE;

-- Testar interpolação
SELECT * FROM get_notification_from_template(
  'community_comment',
  '{"author_name": "Maria", "comment_preview": "Adorei seu post!"}'::JSONB
);
```

### 4. Teste de Triggers

```sql
-- Inserir comentário de teste (trigger automático)
INSERT INTO community_comments (post_id, author_id, content) VALUES
  ('POST_UUID', 'AUTHOR_UUID', 'Teste de trigger de notificação');

-- Verificar fila
SELECT * FROM notification_queue WHERE notification_type = 'community_comment' ORDER BY created_at DESC LIMIT 5;
```

---

## 📊 Monitoramento

### Dashboard no Supabase

```sql
-- Estatísticas da fila
SELECT * FROM v_notification_queue_stats;

-- Analytics (últimos 7 dias)
SELECT * FROM v_notification_analytics;

-- Status dos cron jobs
SELECT * FROM get_cron_jobs_status();

-- Tokens ativos por plataforma
SELECT platform, COUNT(*) as total
FROM push_tokens
WHERE is_active = TRUE
GROUP BY platform;
```

### Métricas Importantes

- **Taxa de entrega**: `delivered / (delivered + failed)`
- **Taxa de abertura**: `opened / delivered`
- **Tokens inválidos**: `is_active = FALSE`
- **Fila pendente**: `status = 'pending' AND scheduled_for <= NOW()`

---

## 🐛 Troubleshooting

### Problema 1: Notificações não chegam

**Sintomas:**
- Notificação enviada (success: true)
- Mas não aparece no dispositivo

**Diagnóstico:**
```sql
-- Ver histórico de envios
SELECT * FROM notification_history
WHERE user_id = 'USER_UUID'
ORDER BY sent_at DESC
LIMIT 10;

-- Ver tokens do usuário
SELECT * FROM push_tokens WHERE user_id = 'USER_UUID';
```

**Soluções:**
1. **Token inválido**: Token desatualizado ou device não registrado
   ```sql
   -- Forçar renovação
   DELETE FROM push_tokens WHERE user_id = 'USER_UUID';
   -- Reabrir app para registrar novo token
   ```

2. **Preferências desabilitadas**: Usuária desativou notificações
   ```sql
   SELECT * FROM notification_preferences WHERE user_id = 'USER_UUID';
   -- Verificar notifications_enabled = TRUE
   ```

3. **Device não físico**: Simuladores não recebem push
   - Testar em device físico (iOS ou Android real)

### Problema 2: Cron jobs não executam

**Sintomas:**
- Fila cresce mas não processa
- Notificações diárias não são enviadas

**Diagnóstico:**
```sql
-- Ver última execução dos jobs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

-- Ver jobs ativos
SELECT * FROM cron.job WHERE active = TRUE;
```

**Soluções:**
1. **Extensão não habilitada**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   CREATE EXTENSION IF NOT EXISTS pg_net;
   ```

2. **Job não criado**: Executar comandos `SELECT cron.schedule(...)` novamente

3. **URL errada**: Verificar PROJECT_ID no job
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'process-notification-queue';
   -- Ver campo `command` e verificar URL
   ```

4. **Timezone**: Jobs executando em horário errado (UTC vs BRT)
   - Ver seção [Horários](#horários-timezone)

### Problema 3: Edge Function falha

**Sintomas:**
- Erro 500 ao enviar notificação
- Logs mostram "Internal server error"

**Diagnóstico:**
```bash
# Ver logs da Edge Function
supabase functions logs notifications --tail

# Ou no Dashboard → Edge Functions → notifications → Logs
```

**Soluções:**
1. **EXPO_PUSH_API_KEY não configurada**:
   - Dashboard → Project Settings → Edge Functions → Add Variable
   - Nome: `EXPO_PUSH_API_KEY`
   - Valor: Seu token Expo

2. **Token inválido**: Formato errado do Expo push token
   ```sql
   -- Ver tokens com formato inválido
   SELECT * FROM push_tokens WHERE token NOT LIKE 'ExponentPushToken%';
   ```

3. **Rate limit**: Muitas notificações em pouco tempo
   - Expo limita: 100 mensagens/segundo (sem API key)
   - Com API key: até 10.000 mensagens/segundo

### Problema 4: Badge count não atualiza

**Sintomas:**
- Notificação chega mas badge não aparece
- Badge fica desatualizado

**Soluções:**
```typescript
// No app, chamar ao abrir notificação
import * as Notifications from 'expo-notifications';

// Limpar badge ao abrir app
Notifications.setBadgeCountAsync(0);

// Ou usar o hook
const { clearBadge } = useNotifications();
await clearBadge();
```

### Problema 5: Templates não funcionam

**Sintomas:**
- Notificação enviada mas sem conteúdo
- Erro "Template not found"

**Diagnóstico:**
```sql
-- Ver templates disponíveis
SELECT * FROM notification_templates WHERE is_active = TRUE;

-- Testar interpolação
SELECT * FROM get_notification_from_template('community_comment', '{"author_name": "Teste"}'::JSONB);
```

**Soluções:**
1. **Templates não seedados**: Executar migration 010 novamente
2. **Template key errada**: Verificar tipo correto na chamada
3. **Dados JSON malformados**: Validar formato do `templateData`

---

## 📚 Referências

- [Expo Push Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [pg_cron Extension](https://github.com/citusdata/pg_cron)
- [Expo Push API Reference](https://docs.expo.dev/push-notifications/sending-notifications/)

---

## 📞 Suporte

Para problemas não listados acima:

1. **Verificar logs**: Supabase Dashboard → Edge Functions → Logs
2. **Verificar filas**: `SELECT * FROM v_notification_queue_stats;`
3. **Verificar cron**: `SELECT * FROM get_cron_jobs_status();`
4. **Teste manual**: `SELECT * FROM test_daily_scheduler();`

---

**Última atualização:** Janeiro/2025
**Versão:** 1.0.0
**Autor:** Claude Code (Anthropic)
