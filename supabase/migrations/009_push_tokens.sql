-- ============================================
-- NOSSA MATERNIDADE - Migration 009: Push Notifications
-- ============================================
-- Armazena tokens de push notification (Expo)
-- Suporta múltiplos dispositivos por usuário
-- Rastreia preferências de notificação
-- ============================================

-- ============================================
-- TABELA: push_tokens
-- ============================================
-- Um usuário pode ter múltiplos dispositivos
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Token do Expo Push
  token TEXT NOT NULL,

  -- Informações do dispositivo
  device_id TEXT, -- Identificador único do dispositivo
  device_name TEXT, -- "iPhone de Maria", "Galaxy S24"
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),

  -- Status do token
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  failed_count INTEGER DEFAULT 0, -- Incrementa a cada falha de envio
  last_error TEXT, -- Último erro de envio

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Token deve ser único
  UNIQUE(token)
);

-- ============================================
-- TABELA: notification_preferences
-- ============================================
-- Preferências granulares de notificação por usuário
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Master switch
  notifications_enabled BOOLEAN DEFAULT TRUE,

  -- Tipos de notificação
  daily_check_in BOOLEAN DEFAULT TRUE,
  daily_affirmation BOOLEAN DEFAULT TRUE,
  habit_reminders BOOLEAN DEFAULT TRUE,
  wellness_reminders BOOLEAN DEFAULT TRUE,

  -- Comunidade
  community_comments BOOLEAN DEFAULT TRUE,
  community_likes BOOLEAN DEFAULT TRUE,
  community_mentions BOOLEAN DEFAULT TRUE,

  -- NathIA Chat
  chat_reminders BOOLEAN DEFAULT TRUE,

  -- Ciclo menstrual
  cycle_reminders BOOLEAN DEFAULT TRUE,
  period_predictions BOOLEAN DEFAULT TRUE,

  -- Horários personalizados (24h format)
  check_in_time TIME DEFAULT '09:00',
  affirmation_time TIME DEFAULT '08:00',
  habit_reminder_time TIME DEFAULT '20:00',
  wellness_time TIME DEFAULT '14:30',

  -- Preferências de som/vibração
  sound_enabled BOOLEAN DEFAULT TRUE,
  vibration_enabled BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: notification_queue
-- ============================================
-- Fila de notificações pendentes (para batch processing)
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Dados da notificação
  notification_type TEXT NOT NULL, -- 'comment', 'like', 'habit_reminder', etc.
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}', -- Dados extras (post_id, conversation_id, etc.)

  -- Status de processamento
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Metadados
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10), -- 1 = baixa, 10 = urgente
  ttl_seconds INTEGER DEFAULT 3600, -- Time-to-live da notificação (1 hora default)
  collapse_key TEXT, -- Agrupar notificações similares (ex: multiple likes)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: notification_history
-- ============================================
-- Histórico de notificações enviadas (para analytics)
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Dados da notificação (denormalized for history)
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',

  -- Resultado do envio
  status TEXT NOT NULL, -- 'delivered', 'failed', 'expired'
  expo_receipt_id TEXT, -- ID do recibo do Expo
  error_code TEXT, -- 'DeviceNotRegistered', 'MessageTooBig', etc.
  error_message TEXT,

  -- Analytics
  opened_at TIMESTAMPTZ, -- Quando o usuário abriu a notificação
  action_taken TEXT, -- 'opened', 'dismissed', 'action_button'

  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_push_tokens_user ON push_tokens(user_id) WHERE is_active;
CREATE INDEX idx_push_tokens_token ON push_tokens(token);
CREATE INDEX idx_push_tokens_platform ON push_tokens(platform, is_active);

CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

CREATE INDEX idx_notification_queue_status ON notification_queue(status, scheduled_for);
CREATE INDEX idx_notification_queue_user ON notification_queue(user_id, status);
CREATE INDEX idx_notification_queue_type ON notification_queue(notification_type, status);

CREATE INDEX idx_notification_history_user ON notification_history(user_id, sent_at DESC);
CREATE INDEX idx_notification_history_type ON notification_history(notification_type, sent_at DESC);
CREATE INDEX idx_notification_history_date ON notification_history(sent_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create notification preferences when profile is created
CREATE OR REPLACE FUNCTION create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_notification_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences();

-- Update timestamps
CREATE TRIGGER trigger_push_tokens_updated_at
  BEFORE UPDATE ON push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notification_prefs_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- Push Tokens
CREATE POLICY "Users can view own push tokens"
  ON push_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push tokens"
  ON push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push tokens"
  ON push_tokens FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push tokens"
  ON push_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notification Queue (service role only for write, user can view own)
CREATE POLICY "Users can view own notification queue"
  ON notification_queue FOR SELECT
  USING (auth.uid() = user_id);

-- Notification History (user can view own)
CREATE POLICY "Users can view own notification history"
  ON notification_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para registrar ou atualizar push token
CREATE OR REPLACE FUNCTION upsert_push_token(
  p_user_id UUID,
  p_token TEXT,
  p_platform TEXT,
  p_device_id TEXT DEFAULT NULL,
  p_device_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_token_id UUID;
BEGIN
  -- Desativar tokens antigos do mesmo dispositivo (se device_id fornecido)
  IF p_device_id IS NOT NULL THEN
    UPDATE push_tokens
    SET is_active = FALSE, updated_at = NOW()
    WHERE user_id = p_user_id
      AND device_id = p_device_id
      AND token != p_token;
  END IF;

  -- Inserir ou atualizar token
  INSERT INTO push_tokens (user_id, token, platform, device_id, device_name)
  VALUES (p_user_id, p_token, p_platform, p_device_id, p_device_name)
  ON CONFLICT (token) DO UPDATE SET
    user_id = p_user_id,
    platform = p_platform,
    device_id = COALESCE(p_device_id, push_tokens.device_id),
    device_name = COALESCE(p_device_name, push_tokens.device_name),
    is_active = TRUE,
    failed_count = 0,
    last_error = NULL,
    last_used_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_token_id;

  RETURN v_token_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar token como inválido (após muitas falhas)
CREATE OR REPLACE FUNCTION mark_token_failed(
  p_token TEXT,
  p_error TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE push_tokens
  SET
    failed_count = failed_count + 1,
    last_error = p_error,
    is_active = CASE WHEN failed_count >= 3 THEN FALSE ELSE is_active END,
    updated_at = NOW()
  WHERE token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar tokens ativos de um usuário
CREATE OR REPLACE FUNCTION get_user_push_tokens(p_user_id UUID)
RETURNS TABLE (
  token TEXT,
  platform TEXT,
  device_name TEXT
) AS $$
  SELECT token, platform, device_name
  FROM push_tokens
  WHERE user_id = p_user_id
    AND is_active = TRUE
    AND failed_count < 3
  ORDER BY last_used_at DESC;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função para limpar tokens inativos e histórico antigo
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Remover tokens inativos há mais de 30 dias
  DELETE FROM push_tokens
  WHERE is_active = FALSE
    AND updated_at < NOW() - INTERVAL '30 days';

  -- Remover tokens que falharam muito há mais de 7 dias
  DELETE FROM push_tokens
  WHERE failed_count >= 5
    AND updated_at < NOW() - INTERVAL '7 days';

  -- Limpar fila de notificações antigas (processadas ou canceladas)
  DELETE FROM notification_queue
  WHERE status IN ('sent', 'cancelled', 'failed')
    AND created_at < NOW() - INTERVAL '7 days';

  -- Limpar histórico com mais de 90 dias (LGPD)
  DELETE FROM notification_history
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE push_tokens IS 'Tokens de push notification (Expo) por dispositivo';
COMMENT ON TABLE notification_preferences IS 'Preferências de notificação por usuário';
COMMENT ON TABLE notification_queue IS 'Fila de notificações pendentes para processamento em batch';
COMMENT ON TABLE notification_history IS 'Histórico de notificações enviadas para analytics';

COMMENT ON COLUMN push_tokens.failed_count IS 'Contador de falhas - token desativado após 3 falhas';
COMMENT ON COLUMN notification_queue.collapse_key IS 'Agrupa notificações similares (ex: múltiplos likes)';
COMMENT ON COLUMN notification_queue.ttl_seconds IS 'Time-to-live - notificação expira após este tempo';

COMMENT ON FUNCTION upsert_push_token IS 'Registra ou atualiza push token - desativa tokens antigos do mesmo dispositivo';
COMMENT ON FUNCTION mark_token_failed IS 'Marca token como falho - desativa após 3 falhas consecutivas';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Limpa dados antigos para LGPD compliance';
