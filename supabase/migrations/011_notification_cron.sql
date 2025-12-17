-- ============================================
-- NOSSA MATERNIDADE - Migration 011: Notification Cron Jobs
-- ============================================
-- Configura pg_cron para processar notificações automaticamente
-- Complementa migration 010 (triggers e templates)
-- ============================================

-- ============================================
-- PARTE 1: FUNÇÕES ADICIONAIS DE SCHEDULING
-- ============================================

-- Função para enfileirar afirmações diárias
CREATE OR REPLACE FUNCTION queue_daily_affirmation_reminders()
RETURNS INTEGER AS $$
DECLARE
  v_queued INTEGER := 0;
  v_user RECORD;
  v_affirmation TEXT;
  v_notification RECORD;
BEGIN
  -- Para cada usuário que habilitou afirmações diárias
  FOR v_user IN
    SELECT np.user_id, np.affirmation_time
    FROM notification_preferences np
    WHERE np.notifications_enabled = TRUE
      AND np.daily_affirmation = TRUE
      -- Ainda não recebeu afirmação hoje
      AND NOT EXISTS (
        SELECT 1 FROM notification_queue nq
        WHERE nq.user_id = np.user_id
          AND nq.notification_type = 'daily_affirmation'
          AND nq.created_at::DATE = CURRENT_DATE
      )
  LOOP
    -- Buscar afirmação aleatória do dia do usuário (se já selecionada)
    -- Se não, escolher aleatória
    SELECT text INTO v_affirmation
    FROM affirmations
    WHERE is_active = TRUE
    ORDER BY RANDOM()
    LIMIT 1;

    IF v_affirmation IS NULL THEN
      -- Fallback se não houver afirmações no banco
      v_affirmation := 'Você é forte, capaz e merece todo o amor do mundo 💕';
    END IF;

    -- Gerar notificação do template
    SELECT * INTO v_notification
    FROM get_notification_from_template(
      'daily_affirmation',
      jsonb_build_object('affirmation_text', v_affirmation)
    );

    -- Enfileirar para horário preferido
    INSERT INTO notification_queue (
      user_id,
      notification_type,
      title,
      body,
      priority,
      scheduled_for
    ) VALUES (
      v_user.user_id,
      'daily_affirmation',
      v_notification.title,
      v_notification.body,
      5, -- Média-alta prioridade
      (CURRENT_DATE + v_user.affirmation_time)::TIMESTAMPTZ
    )
    ON CONFLICT DO NOTHING;

    v_queued := v_queued + 1;
  END LOOP;

  RETURN v_queued;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enfileirar lembretes de wellness (hidratação, movimento)
CREATE OR REPLACE FUNCTION queue_wellness_reminders()
RETURNS INTEGER AS $$
DECLARE
  v_queued INTEGER := 0;
  v_user RECORD;
  v_notification RECORD;
BEGIN
  -- Para cada usuário que habilitou wellness reminders
  FOR v_user IN
    SELECT np.user_id, np.wellness_time
    FROM notification_preferences np
    WHERE np.notifications_enabled = TRUE
      AND np.wellness_reminders = TRUE
      -- Evitar spam: só envia se não enviou hoje
      AND NOT EXISTS (
        SELECT 1 FROM notification_queue nq
        WHERE nq.user_id = np.user_id
          AND nq.notification_type = 'wellness_reminder'
          AND nq.created_at::DATE = CURRENT_DATE
      )
  LOOP
    -- Alternar entre mensagens de hidratação e movimento
    -- Usar dia da semana para variar
    IF EXTRACT(DOW FROM CURRENT_DATE) IN (1, 3, 5) THEN
      -- Segunda, quarta, sexta: hidratação
      v_notification.title := 'Hora de se hidratar 💧';
      v_notification.body := 'Beba um copo de água agora. Seu corpo agradece!';
    ELSE
      -- Outros dias: movimento
      v_notification.title := 'Hora de se movimentar ✨';
      v_notification.body := 'Faça uma pausa para alongar ou caminhar um pouco';
    END IF;

    -- Enfileirar
    INSERT INTO notification_queue (
      user_id,
      notification_type,
      title,
      body,
      priority,
      scheduled_for
    ) VALUES (
      v_user.user_id,
      'wellness_reminder',
      v_notification.title,
      v_notification.body,
      3, -- Baixa prioridade
      (CURRENT_DATE + v_user.wellness_time)::TIMESTAMPTZ
    )
    ON CONFLICT DO NOTHING;

    v_queued := v_queued + 1;
  END LOOP;

  RETURN v_queued;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função mestre que executa todos os schedulers diários
CREATE OR REPLACE FUNCTION schedule_daily_notifications()
RETURNS TABLE (
  task TEXT,
  queued_count INTEGER,
  success BOOLEAN
) AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- 1. Check-in diário
  BEGIN
    v_count := queue_daily_check_in_reminders();
    RETURN QUERY SELECT 'check_in'::TEXT, v_count, TRUE;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'check_in'::TEXT, 0, FALSE;
  END;

  -- 2. Afirmações diárias
  BEGIN
    v_count := queue_daily_affirmation_reminders();
    RETURN QUERY SELECT 'affirmation'::TEXT, v_count, TRUE;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'affirmation'::TEXT, 0, FALSE;
  END;

  -- 3. Lembretes de hábitos
  BEGIN
    SELECT queued_count INTO v_count FROM queue_habit_reminders();
    RETURN QUERY SELECT 'habits'::TEXT, v_count, TRUE;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'habits'::TEXT, 0, FALSE;
  END;

  -- 4. Wellness reminders
  BEGIN
    v_count := queue_wellness_reminders();
    RETURN QUERY SELECT 'wellness'::TEXT, v_count, TRUE;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'wellness'::TEXT, 0, FALSE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 2: CONFIGURAÇÃO DO PG_CRON
-- ============================================
-- IMPORTANTE: pg_cron precisa ser habilitado no Supabase Dashboard
-- Dashboard → Database → Extensions → pg_cron → Enable

-- CRON JOB 1: Processar fila de notificações (a cada 5 minutos)
-- Este job chama a Edge Function /notifications/process-queue
-- Nota: Você precisa substituir [PROJECT_ID] e [SERVICE_KEY] manualmente

/*
SELECT cron.schedule(
  'process-notification-queue',
  '*/5 * * * *', -- A cada 5 minutos
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
*/

-- CRON JOB 2: Agendar notificações diárias (todo dia às 6h AM - horário de Brasília)
-- Este job enfileira todas as notificações diárias de uma vez
-- A fila será processada ao longo do dia conforme o horário preferido de cada usuária

/*
SELECT cron.schedule(
  'schedule-daily-notifications',
  '0 6 * * *', -- 6h AM todo dia (horário do servidor - ajustar se necessário)
  $$
  SELECT schedule_daily_notifications();
  $$
);
*/

-- CRON JOB 3: Limpeza de dados antigos (todo dia às 3h AM)
-- Remove tokens inativos, fila processada, histórico antigo

/*
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 3 * * *', -- 3h AM todo dia
  $$
  SELECT cleanup_old_notifications();
  $$
);
*/

-- ============================================
-- PARTE 3: FUNÇÕES DE GESTÃO DO CRON
-- ============================================

-- Verificar status dos cron jobs
CREATE OR REPLACE FUNCTION get_cron_jobs_status()
RETURNS TABLE (
  jobid BIGINT,
  jobname TEXT,
  schedule TEXT,
  active BOOLEAN,
  last_run TIMESTAMPTZ
) AS $$
BEGIN
  -- Retorna jobs do pg_cron
  RETURN QUERY
  SELECT
    j.jobid,
    j.jobname,
    j.schedule,
    j.active,
    (SELECT MAX(end_time) FROM cron.job_run_details WHERE jobid = j.jobid) as last_run
  FROM cron.job j
  ORDER BY j.jobname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Testar scheduler manualmente (útil para debug)
CREATE OR REPLACE FUNCTION test_daily_scheduler()
RETURNS TABLE (
  task TEXT,
  queued_count INTEGER,
  success BOOLEAN
) AS $$
BEGIN
  RAISE NOTICE 'Testing daily notification scheduler...';
  RETURN QUERY SELECT * FROM schedule_daily_notifications();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PARTE 4: MONITORING & ANALYTICS
-- ============================================

-- View para monitorar notificações pendentes
CREATE OR REPLACE VIEW v_notification_queue_stats AS
SELECT
  notification_type,
  status,
  COUNT(*) as count,
  MIN(created_at) as oldest,
  MAX(created_at) as newest,
  COUNT(*) FILTER (WHERE scheduled_for <= NOW()) as ready_to_send
FROM notification_queue
GROUP BY notification_type, status
ORDER BY notification_type, status;

-- View para analytics de notificações enviadas (últimos 7 dias)
CREATE OR REPLACE VIEW v_notification_analytics AS
SELECT
  DATE(sent_at) as date,
  notification_type,
  status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE opened_at IS NOT NULL) /
    NULLIF(COUNT(*) FILTER (WHERE status = 'delivered'), 0),
    2
  ) as open_rate_pct
FROM notification_history
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at), notification_type, status
ORDER BY date DESC, notification_type;

-- ============================================
-- PARTE 5: SETUP INICIAL
-- ============================================

-- Garantir que todos os usuários existentes tenham preferências
INSERT INTO notification_preferences (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON FUNCTION queue_daily_affirmation_reminders IS 'Cron job: enfileira afirmações diárias personalizadas';
COMMENT ON FUNCTION queue_wellness_reminders IS 'Cron job: enfileira lembretes de hidratação e movimento';
COMMENT ON FUNCTION schedule_daily_notifications IS 'Função mestre: executa todos os schedulers diários de uma vez';
COMMENT ON FUNCTION get_cron_jobs_status IS 'Monitoramento: verifica status e última execução dos cron jobs';
COMMENT ON FUNCTION test_daily_scheduler IS 'Debug: testa scheduler manualmente sem aguardar cron';

COMMENT ON VIEW v_notification_queue_stats IS 'Dashboard: estatísticas da fila de notificações por tipo e status';
COMMENT ON VIEW v_notification_analytics IS 'Analytics: métricas de entrega e abertura (últimos 7 dias)';

-- ============================================
-- INSTRUÇÕES DE CONFIGURAÇÃO
-- ============================================

/*
PASSO A PASSO PARA ATIVAR OS CRON JOBS NO SUPABASE:

1. Habilitar extensão pg_cron:
   - Dashboard → Database → Extensions → pg_cron → Enable

2. Habilitar extensão pg_net (para HTTP calls):
   - Dashboard → Database → Extensions → pg_net → Enable

3. Configurar variáveis de ambiente (opcional - se quiser usar app.settings.*):
   - SQL Editor → Execute:

   ALTER DATABASE postgres SET app.settings.supabase_url = 'https://[PROJECT_ID].supabase.co';
   ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJ...';

4. Criar os cron jobs:
   - Copie os comandos SELECT cron.schedule(...) acima
   - Substitua [PROJECT_ID] pelo seu project ID
   - Substitua [SERVICE_KEY] pela sua service role key
   - Execute no SQL Editor

5. Verificar se os jobs foram criados:
   SELECT * FROM get_cron_jobs_status();

6. Testar o scheduler manualmente (antes do cron executar):
   SELECT * FROM test_daily_scheduler();

7. Monitorar a fila:
   SELECT * FROM v_notification_queue_stats;

8. Ver analytics:
   SELECT * FROM v_notification_analytics;

TIMEZONE:
- Por padrão, pg_cron usa UTC
- Para usar horário de Brasília (UTC-3), ajuste os horários:
  - 6h AM BRT = 9h AM UTC
  - 3h AM BRT = 6h AM UTC
- Ou configure o timezone do servidor no Supabase Dashboard

TROUBLESHOOTING:
- Se os jobs não executam: verifique cron.job_run_details
  SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

- Se Edge Function falha: verifique logs no Dashboard → Edge Functions → Logs

- Se notificações não chegam: verifique v_notification_queue_stats
*/
