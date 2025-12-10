-- =============================================================================
-- NOSSA MATERNIDADE - MVP SCHEMA
-- Arquivo: 09_rls_missing_tables.sql
-- Descrição: RLS Policies para tabelas criadas em 08_missing_core_tables.sql
-- Tabelas: diary_entries, sleep_logs, check_in_logs, baby_milestones, user_baby_milestones, notifications, guilt_entries
-- Ordem: Executar DEPOIS de 08_missing_core_tables.sql
-- Data: 10 de Dezembro de 2025
-- =============================================================================

-- =============================================================================
-- HABILITAR RLS EM TODAS AS NOVAS TABELAS
-- =============================================================================

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilt_entries ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES: diary_entries (DADOS PRIVADOS)
-- Regra: Apenas a própria usuária pode ver/editar
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own diary entries" ON diary_entries;
DROP POLICY IF EXISTS "Service role full access diary_entries" ON diary_entries;

-- Usuária pode gerenciar próprias entradas
CREATE POLICY "Users can manage own diary entries"
  ON diary_entries FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role tem acesso total
CREATE POLICY "Service role full access diary_entries"
  ON diary_entries FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: sleep_logs (DADOS PRIVADOS)
-- Regra: Apenas a própria usuária pode ver/editar
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own sleep logs" ON sleep_logs;
DROP POLICY IF EXISTS "Service role full access sleep_logs" ON sleep_logs;

-- Usuária pode gerenciar próprios logs de sono
CREATE POLICY "Users can manage own sleep logs"
  ON sleep_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role tem acesso total
CREATE POLICY "Service role full access sleep_logs"
  ON sleep_logs FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: check_in_logs (DADOS PRIVADOS)
-- Regra: Apenas a própria usuária pode ver/editar
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own check-ins" ON check_in_logs;
DROP POLICY IF EXISTS "Service role full access check_in_logs" ON check_in_logs;

-- Usuária pode gerenciar próprios check-ins
CREATE POLICY "Users can manage own check-ins"
  ON check_in_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role tem acesso total
CREATE POLICY "Service role full access check_in_logs"
  ON check_in_logs FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: baby_milestones (BIBLIOTECA PÚBLICA)
-- Regra: Todos podem ler, apenas service_role pode criar/editar
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can read milestones" ON baby_milestones;
DROP POLICY IF EXISTS "Service role can manage milestones" ON baby_milestones;

-- Qualquer autenticado pode ler milestones
CREATE POLICY "Anyone can read milestones"
  ON baby_milestones FOR SELECT
  TO authenticated
  USING (TRUE);

-- Apenas service_role pode criar/modificar milestones
CREATE POLICY "Service role can manage milestones"
  ON baby_milestones FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: user_baby_milestones (PROGRESSO PRIVADO)
-- Regra: Usuária gerencia próprio progresso, pode ler milestones de todos
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own milestone progress" ON user_baby_milestones;
DROP POLICY IF EXISTS "Service role full access user_baby_milestones" ON user_baby_milestones;

-- Usuária pode gerenciar próprio progresso
CREATE POLICY "Users can manage own milestone progress"
  ON user_baby_milestones FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role tem acesso total
CREATE POLICY "Service role full access user_baby_milestones"
  ON user_baby_milestones FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: notifications (DADOS PRIVADOS)
-- Regra: Usuária vê apenas próprias notificações
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Service role full access notifications" ON notifications;

-- Usuária pode ver próprias notificações
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Usuária pode marcar como lida (UPDATE apenas is_read e read_at)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role pode criar/gerenciar notificações
CREATE POLICY "Service role full access notifications"
  ON notifications FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- RLS POLICIES: guilt_entries (DADOS PRIVADOS)
-- Regra: Apenas a própria usuária pode ver/editar
-- =============================================================================

DROP POLICY IF EXISTS "Users can manage own guilt entries" ON guilt_entries;
DROP POLICY IF EXISTS "Service role full access guilt_entries" ON guilt_entries;

-- Usuária pode gerenciar próprias entradas de culpa
CREATE POLICY "Users can manage own guilt entries"
  ON guilt_entries FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role tem acesso total
CREATE POLICY "Service role full access guilt_entries"
  ON guilt_entries FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- FUNÇÕES AUXILIARES
-- =============================================================================

-- Função para obter estatísticas de check-ins da semana
CREATE OR REPLACE FUNCTION get_weekly_mood_stats(p_user_id UUID)
RETURNS TABLE (
  emotion TEXT,
  count BIGINT,
  avg_intensity NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    check_in_logs.emotion,
    COUNT(*) AS count,
    ROUND(AVG(intensity), 1) AS avg_intensity
  FROM check_in_logs
  WHERE user_id = p_user_id
    AND logged_at >= NOW() - INTERVAL '7 days'
  GROUP BY emotion
  ORDER BY count DESC;
END;
$$;

-- Função para obter média de sono da semana
CREATE OR REPLACE FUNCTION get_weekly_sleep_average(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_average NUMERIC;
BEGIN
  SELECT ROUND(AVG(duration_hours), 1) INTO v_average
  FROM sleep_logs
  WHERE user_id = p_user_id
    AND logged_at >= NOW() - INTERVAL '7 days';

  RETURN COALESCE(v_average, 0);
END;
$$;

-- Função para obter progresso de milestones por categoria
CREATE OR REPLACE FUNCTION get_milestone_progress(p_user_id UUID)
RETURNS TABLE (
  category TEXT,
  total BIGINT,
  completed BIGINT,
  percentage INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  WITH user_milestones AS (
    SELECT
      bm.category,
      COUNT(*) AS total,
      SUM(CASE WHEN ubm.is_completed = TRUE THEN 1 ELSE 0 END) AS completed
    FROM baby_milestones bm
    LEFT JOIN user_baby_milestones ubm ON bm.id = ubm.milestone_id AND ubm.user_id = p_user_id
    GROUP BY bm.category
  )
  SELECT
    um.category::TEXT,
    um.total,
    um.completed,
    ROUND((um.completed::NUMERIC / NULLIF(um.total, 0)) * 100)::INTEGER AS percentage
  FROM user_milestones um
  ORDER BY um.category;
END;
$$;

-- Função para obter notificações não lidas
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM notifications
  WHERE user_id = p_user_id
    AND is_read = FALSE
    AND (expires_at IS NULL OR expires_at > NOW());

  RETURN v_count;
END;
$$;

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_as_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_read = TRUE,
    read_at = NOW()
  WHERE id = p_notification_id
    AND user_id = p_user_id
    AND is_read = FALSE;

  RETURN FOUND;
END;
$$;

-- Função para obter check-in de hoje
CREATE OR REPLACE FUNCTION get_today_check_in(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  emotion TEXT,
  intensity INTEGER,
  energy_level INTEGER,
  notes TEXT,
  logged_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id,
    cl.emotion,
    cl.intensity,
    cl.energy_level,
    cl.notes,
    cl.logged_at
  FROM check_in_logs cl
  WHERE cl.user_id = p_user_id
    AND DATE(cl.logged_at AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE
  ORDER BY cl.logged_at DESC
  LIMIT 1;
END;
$$;

-- Função para obter entradas do diário favoritas
CREATE OR REPLACE FUNCTION get_favorite_diary_entries(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  content TEXT,
  ai_response TEXT,
  emotion_detected TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.content,
    de.ai_response,
    de.emotion_detected,
    de.created_at
  FROM diary_entries de
  WHERE de.user_id = p_user_id
    AND de.is_favorite = TRUE
    AND de.deleted_at IS NULL
  ORDER BY de.created_at DESC
  LIMIT p_limit;
END;
$$;

-- =============================================================================
-- TRIGGERS: Atualizar cache no profiles
-- =============================================================================

-- Trigger para atualizar last_emotion_update no profiles quando fizer check-in
CREATE OR REPLACE FUNCTION update_profile_emotion_from_checkin()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    current_emotion = NEW.emotion,
    last_emotion_update = NEW.logged_at
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_profile_emotion ON check_in_logs;
CREATE TRIGGER trigger_update_profile_emotion
  AFTER INSERT ON check_in_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_emotion_from_checkin();

-- =============================================================================
-- Verificação
-- =============================================================================

DO $$
DECLARE
  rls_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Contar policies criadas
  SELECT COUNT(*) INTO rls_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN (
      'diary_entries', 'sleep_logs', 'check_in_logs',
      'baby_milestones', 'user_baby_milestones',
      'notifications', 'guilt_entries'
    );

  -- Contar funções criadas
  SELECT COUNT(*) INTO function_count
  FROM pg_proc
  WHERE proname IN (
    'get_weekly_mood_stats',
    'get_weekly_sleep_average',
    'get_milestone_progress',
    'get_unread_notifications_count',
    'mark_notification_as_read',
    'get_today_check_in',
    'get_favorite_diary_entries',
    'update_profile_emotion_from_checkin'
  );

  RAISE NOTICE '09_rls_missing_tables.sql: % policies criadas, % funções criadas',
    rls_count, function_count;
END $$;
