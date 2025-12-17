# Sistema de Notificações - Nossa Maternidade

Sistema completo de push notifications com **templates automáticos** e **triggers inteligentes**.

---

## 📋 RESUMO

### O QUÊ?

Sistema de notificações push que:
- **Templates**: Mensagens pré-definidas com variáveis interpoladas
- **Triggers**: Envio automático baseado em eventos do banco
- **i18n Ready**: Suporte futuro para múltiplos idiomas
- **Queue-based**: Processamento assíncrono para performance

### POR QUÊ IMPORTA?

1. **Engagement**: Notificações oportunas aumentam retenção
2. **Automatização**: Zero código manual para notificações comuns
3. **Consistência**: Mensagens padronizadas e profissionais
4. **Escalabilidade**: Queue evita sobrecarga no banco
5. **LGPD**: Respeita preferências do usuário

---

## 🏗️ ARQUITETURA

```
┌──────────────────────────────────────────────────────────┐
│                    USER ACTIONS                           │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  DATABASE TRIGGERS                                        │
│  - Novo comentário → trigger_notify_comment              │
│  - Novo like → trigger_notify_like_milestone             │
│  - Novo post em grupo → trigger_notify_group_post        │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  TEMPLATE SYSTEM                                          │
│  - get_notification_from_template()                       │
│  - interpolate_template()                                 │
│  - notification_templates table                           │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  NOTIFICATION QUEUE                                       │
│  - notification_queue table                               │
│  - Priorização (1-10)                                     │
│  - TTL e retry logic                                      │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  CRON JOB (Supabase)                                      │
│  - POST /notifications/process-queue                      │
│  - Executa a cada 1 minuto                                │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  EDGE FUNCTION /notifications                             │
│  - Verifica preferências do usuário                       │
│  - Busca push tokens ativos                               │
│  - Envia via Expo Push API                                │
└───────────┬──────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  EXPO PUSH API                                            │
│  - Entrega notificação para dispositivo                   │
│  - Retorna receipt para tracking                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📝 TEMPLATES DISPONÍVEIS

### 1. Comunidade

| Template Key | Quando Dispara | Variáveis |
|--------------|----------------|-----------|
| `community_comment` | Novo comentário no post do usuário | `{{author_name}}`, `{{comment_preview}}` |
| `community_like` | Post atinge 5 likes | `{{like_count}}` |
| `community_like_milestone` | Post atinge 10/25/50/100 likes | `{{like_count}}` |
| `community_group_post` | Novo post em grupo que participa | `{{group_name}}`, `{{author_name}}`, `{{post_preview}}` |
| `community_group_welcome` | Entra em novo grupo | `{{group_name}}` |

### 2. Hábitos

| Template Key | Quando Dispara | Variáveis |
|--------------|----------------|-----------|
| `habit_reminder` | Cron diário (horário preferido) | `{{habit_name}}` |
| `habit_streak` | Completa hábito (streak 3+) | `{{streak_count}}`, `{{habit_name}}` |

### 3. Ciclo Menstrual

| Template Key | Quando Dispara | Variáveis |
|--------------|----------------|-----------|
| `cycle_period_coming` | 3 dias antes do período previsto | `{{days_until}}` |
| `cycle_fertile_window` | Início da janela fértil | `{{fertile_start}}`, `{{fertile_end}}` |

### 4. Geral

| Template Key | Quando Dispara | Variáveis |
|--------------|----------------|-----------|
| `daily_check_in_reminder` | Cron diário (horário preferido) | Nenhuma |
| `daily_affirmation` | Cron diário (horário preferido) | `{{affirmation_text}}` |

---

## 🚀 COMO USAR

### Método 1: Triggers Automáticos (Zero Código)

Já configurado! Os triggers disparam automaticamente quando:

```sql
-- Exemplo: Novo comentário
INSERT INTO community_comments (post_id, author_id, content)
VALUES ('post-uuid', 'user-uuid', 'Parabéns pelo post!');
-- ✅ Trigger envia notificação automaticamente para autor do post
```

### Método 2: Edge Function com Template

```typescript
// Client-side (app)
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/notifications/send-templated`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: targetUserId,
      type: 'habit_streak',
      templateKey: 'habit_streak',
      templateData: {
        habit_name: 'Meditação',
        streak_count: '7',
      },
      data: {
        habit_id: 'habit-uuid',
      },
      priority: 'high',
      language: 'pt-BR', // opcional, default pt-BR
    }),
  }
);

const result = await response.json();
// {
//   success: true,
//   sent: 1,
//   failed: 0,
//   errors: [],
//   template: {
//     title: "Sequência incrível! 🔥",
//     body: "7 dias seguidos de Meditação. Continue assim!"
//   }
// }
```

### Método 3: SQL Direto (Server-side)

```sql
-- Chamar stored procedure diretamente
SELECT send_notification_via_edge(
  'user-uuid',
  'habit_streak',
  'Sequência incrível! 🔥',
  '7 dias seguidos de Meditação',
  '{"habit_id": "habit-uuid"}'::jsonb
);
```

---

## 🔧 CONFIGURAÇÃO

### 1. Deploy da Migration

```bash
# Aplicar migration 010
supabase db push

# Verificar tabelas criadas
supabase db diff
```

### 2. Configurar Cron Jobs (Supabase Dashboard)

**Cron → Create a new cron job:**

#### A) Process Notification Queue
```
Name: process-notification-queue
Schedule: */1 * * * * (every minute)
SQL:
SELECT net.http_post(
  url := current_setting('app.settings.supabase_url') || '/functions/v1/notifications/process-queue',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
  )
);
```

#### B) Daily Habit Reminders
```
Name: queue-habit-reminders
Schedule: 0 8 * * * (8am daily)
SQL:
SELECT queue_habit_reminders();
```

#### C) Daily Check-in Reminders
```
Name: queue-check-in-reminders
Schedule: 0 9 * * * (9am daily)
SQL:
SELECT queue_daily_check_in_reminders();
```

### 3. Configurar Database Settings

No Supabase Dashboard → SQL Editor:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://xxx.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJxxx...';
```

⚠️ **IMPORTANTE**: Substitua pelos valores reais do seu projeto.

---

## 📊 MONITORAMENTO

### Ver Fila de Notificações

```sql
-- Pendentes
SELECT * FROM notification_queue
WHERE status = 'pending'
ORDER BY priority DESC, scheduled_for ASC;

-- Falhas recentes
SELECT * FROM notification_queue
WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Ver Histórico de Envios

```sql
-- Últimas 100 notificações enviadas
SELECT
  nh.*,
  p.name as user_name
FROM notification_history nh
JOIN profiles p ON p.id = nh.user_id
WHERE nh.status = 'delivered'
ORDER BY nh.sent_at DESC
LIMIT 100;

-- Taxa de entrega por tipo
SELECT
  notification_type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
  ROUND(100.0 * SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) / COUNT(*), 2) as delivery_rate
FROM notification_history
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY notification_type
ORDER BY total DESC;
```

### Ver Templates Ativos

```sql
SELECT
  template_key,
  category,
  title_template,
  body_template
FROM notification_templates
WHERE is_active = TRUE
ORDER BY category, template_key;
```

---

## 🎨 CRIAR NOVO TEMPLATE

### SQL

```sql
INSERT INTO notification_templates (
  template_key,
  language,
  title_template,
  body_template,
  category,
  description
) VALUES (
  'custom_milestone',
  'pt-BR',
  'Parabéns! Você conquistou {{achievement_name}}! 🎉',
  'Continue assim para desbloquear mais conquistas',
  'achievement',
  'Notifica quando usuário completa conquista'
);
```

### Usar Template

```typescript
// Via Edge Function
await fetch(`${SUPABASE_URL}/functions/v1/notifications/send-templated`, {
  // ...
  body: JSON.stringify({
    templateKey: 'custom_milestone',
    templateData: {
      achievement_name: 'Primeira Semana de Hábitos',
    },
  }),
});
```

---

## 🌍 SUPORTE i18n (Futuro)

O sistema já está preparado para múltiplos idiomas:

```sql
-- Template em inglês
INSERT INTO notification_templates (
  template_key,
  language,
  title_template,
  body_template,
  category
) VALUES (
  'habit_streak',
  'en-US',
  'Amazing streak! 🔥',
  '{{streak_count}} days in a row of {{habit_name}}. Keep it up!',
  'habit'
);

-- Buscar template em inglês
SELECT * FROM get_notification_from_template(
  'habit_streak',
  '{"habit_name": "Meditation", "streak_count": "7"}'::jsonb,
  'en-US'
);
```

---

## 🧪 TESTAR SISTEMA

### 1. Testar Template Diretamente

```sql
-- Interpolar variáveis
SELECT interpolate_template(
  'Olá {{name}}, você tem {{count}} mensagens',
  '{"name": "Maria", "count": "3"}'::jsonb
);
-- Resultado: "Olá Maria, você tem 3 mensagens"

-- Buscar template completo
SELECT * FROM get_notification_from_template(
  'community_comment',
  '{"author_name": "Ana", "comment_preview": "Adorei seu post!"}'::jsonb
);
-- Resultado:
-- title: "Novo comentário no seu post"
-- body: "Ana comentou: Adorei seu post!"
```

### 2. Testar Trigger Manualmente

```sql
-- Inserir comentário de teste
INSERT INTO community_comments (post_id, author_id, content)
SELECT
  cp.id as post_id,
  (SELECT id FROM profiles LIMIT 1 OFFSET 1) as author_id,
  'Comentário de teste para notificação'
FROM community_posts cp
LIMIT 1;

-- Verificar se notificação foi enfileirada
SELECT * FROM notification_queue
WHERE notification_type = 'community_comment'
ORDER BY created_at DESC
LIMIT 1;
```

### 3. Processar Fila Manualmente

```bash
# Via curl
curl -X POST "${SUPABASE_URL}/functions/v1/notifications/process-queue" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}"

# Resultado:
# {
#   "processed": 5,
#   "sent": 4,
#   "failed": 1
# }
```

---

## ⚠️ TROUBLESHOOTING

### Notificação Não Chegou

1. **Verificar Fila**:
   ```sql
   SELECT * FROM notification_queue WHERE user_id = 'user-uuid' ORDER BY created_at DESC;
   ```

2. **Verificar Preferências**:
   ```sql
   SELECT * FROM notification_preferences WHERE user_id = 'user-uuid';
   ```

3. **Verificar Push Tokens**:
   ```sql
   SELECT * FROM push_tokens WHERE user_id = 'user-uuid' AND is_active = TRUE;
   ```

4. **Ver Histórico**:
   ```sql
   SELECT * FROM notification_history
   WHERE user_id = 'user-uuid'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

### Template Não Encontrado

```sql
-- Listar templates disponíveis
SELECT template_key, language FROM notification_templates WHERE is_active = TRUE;

-- Verificar template específico
SELECT * FROM notification_templates WHERE template_key = 'seu-template';
```

### Trigger Não Disparou

```sql
-- Verificar se trigger está ativo
SELECT
  t.tgname as trigger_name,
  c.relname as table_name,
  pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
WHERE c.relname IN ('community_comments', 'post_likes', 'community_posts');
```

---

## 📈 MÉTRICAS

### Dashboard de Notificações

```sql
-- Resumo últimas 24h
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') as pendentes,
  COUNT(*) FILTER (WHERE status = 'sent') as enviadas,
  COUNT(*) FILTER (WHERE status = 'failed') as falhas,
  AVG(EXTRACT(EPOCH FROM (sent_at - created_at))) FILTER (WHERE status = 'sent') as avg_latency_seconds
FROM notification_queue
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Por tipo de notificação (última semana)
SELECT
  notification_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'delivered') as entregues,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as abertas,
  ROUND(100.0 * COUNT(*) FILTER (WHERE opened_at IS NOT NULL) / NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0), 2) as open_rate_percent
FROM notification_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY notification_type
ORDER BY total DESC;
```

---

## 🔐 SEGURANÇA

### RLS (Row Level Security)

Todas as tabelas têm RLS habilitado:

- **push_tokens**: Usuário só vê/edita próprios tokens
- **notification_preferences**: Usuário só vê/edita próprias preferências
- **notification_queue**: Usuário vê própria fila (service role pode escrever)
- **notification_history**: Usuário vê próprio histórico
- **notification_templates**: Público (read-only)

### Validações

- JWT obrigatório (exceto endpoints de serviço com `x-service-key`)
- Rate limiting: 100 notificações/min por usuário
- Batch size máximo: 100 notificações por request
- TTL: Notificações expiram após 1 hora (configurável)

---

## 📚 REFERÊNCIAS

- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Cron Jobs](https://supabase.com/docs/guides/database/extensions/pg_cron)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/trigger-definition.html)

---

*Última atualização: 2025-12-17*
*Versão: 1.1.0*
