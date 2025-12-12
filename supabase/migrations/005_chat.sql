-- ============================================
-- NOSSA MATERNIDADE - Migration 005: Chat & AI
-- ============================================
-- Histórico de conversas com NathIA
-- Persistência de contexto para IA
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

-- Tipo de mensagem
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- Status da conversa
CREATE TYPE conversation_status AS ENUM ('active', 'archived', 'deleted');

-- Tipo de conteúdo na mensagem
CREATE TYPE message_content_type AS ENUM ('text', 'audio', 'image');

-- ============================================
-- TABELA: chat_conversations
-- ============================================
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Dados da conversa
  title TEXT DEFAULT 'Nova conversa',
  summary TEXT, -- Resumo gerado por IA
  status conversation_status DEFAULT 'active',

  -- Metadados de contexto
  context_snapshot JSONB, -- Snapshot do contexto do usuário no início da conversa
  topics TEXT[], -- Tópicos discutidos (para categorização)
  sentiment_average DECIMAL(3,2), -- Média de sentimento da conversa

  -- Contadores
  message_count INTEGER DEFAULT 0,
  user_message_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

-- ============================================
-- TABELA: chat_messages
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Conteúdo da mensagem
  role message_role NOT NULL,
  content TEXT NOT NULL,
  content_type message_content_type DEFAULT 'text',

  -- Para mensagens de áudio
  audio_url TEXT,
  audio_duration_seconds INTEGER,
  transcription TEXT,

  -- Para mensagens com imagem
  image_url TEXT,
  image_analysis TEXT,

  -- Metadados de IA
  model_used TEXT, -- 'gpt-4', 'claude-3', etc.
  tokens_used INTEGER,
  response_time_ms INTEGER,

  -- Análise de sentimento da mensagem
  sentiment_score DECIMAL(3,2), -- -1.0 a 1.0

  -- Feedback do usuário
  is_helpful BOOLEAN,
  feedback TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: ai_context_cache
-- ============================================
-- Cache de contexto do usuário para IA
CREATE TABLE ai_context_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Contexto completo em JSONB
  context_data JSONB NOT NULL DEFAULT '{}',

  -- Campos específicos para busca rápida
  current_stage pregnancy_stage,
  current_mood_trend TEXT,
  current_streak INTEGER,
  last_check_in_date DATE,
  days_until_due INTEGER,
  baby_age_days INTEGER,

  -- Resumo textual para prompt da IA
  context_summary TEXT,

  -- Última atualização
  last_updated TIMESTAMPTZ DEFAULT NOW(),

  -- Versão do cache (para invalidação)
  version INTEGER DEFAULT 1
);

-- ============================================
-- TABELA: ai_insights
-- ============================================
-- Insights gerados pela IA sobre a usuária
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Tipo de insight
  insight_type TEXT NOT NULL, -- 'mood_pattern', 'sleep_issue', 'habit_suggestion', etc.
  category TEXT, -- 'emotional', 'physical', 'behavioral'

  -- Conteúdo
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,

  -- Severidade/importância
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),

  -- Status
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  is_acted_upon BOOLEAN DEFAULT FALSE,

  -- Dados de suporte
  supporting_data JSONB,
  confidence_score DECIMAL(3,2), -- 0 a 1

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_conversations_user ON chat_conversations(user_id, status, updated_at DESC);
CREATE INDEX idx_conversations_recent ON chat_conversations(user_id, last_message_at DESC) WHERE status = 'active';

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at);
CREATE INDEX idx_messages_user ON chat_messages(user_id, created_at DESC);

CREATE INDEX idx_ai_context_user ON ai_context_cache(user_id);
CREATE INDEX idx_ai_insights_user ON ai_insights(user_id, is_dismissed, created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar contadores e timestamps na conversa
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations SET
    message_count = message_count + 1,
    user_message_count = CASE WHEN NEW.role = 'user' THEN user_message_count + 1 ELSE user_message_count END,
    last_message_at = NEW.created_at,
    updated_at = NOW(),
    title = CASE
      WHEN message_count = 0 AND NEW.role = 'user'
      THEN LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END
      ELSE title
    END
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_message_update_conversation
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_context_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Conversations
CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI Context (apenas o usuário e serviço)
CREATE POLICY "Users can view own context"
  ON ai_context_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can manage context"
  ON ai_context_cache FOR ALL
  USING (auth.uid() = user_id);

-- AI Insights
CREATE POLICY "Users can view own insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss insights"
  ON ai_insights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES PARA NATHIA
-- ============================================

-- Função para construir contexto completo da usuária
CREATE OR REPLACE FUNCTION build_user_context(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_context JSONB;
  v_profile RECORD;
  v_cycle RECORD;
  v_recent_moods INTEGER[];
  v_habit_completion DECIMAL;
  v_last_check_in RECORD;
BEGIN
  -- Perfil
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;

  -- Configurações de ciclo
  SELECT * INTO v_cycle FROM cycle_settings WHERE user_id = p_user_id;

  -- Últimos 7 moods
  SELECT array_agg(mood_score ORDER BY date DESC)
  INTO v_recent_moods
  FROM (
    SELECT mood_score, date FROM daily_logs
    WHERE user_id = p_user_id AND mood_score IS NOT NULL
    ORDER BY date DESC LIMIT 7
  ) t;

  -- Taxa de conclusão de hábitos (semana)
  SELECT COALESCE(completion_rate, 0) INTO v_habit_completion
  FROM get_weekly_habit_summary(p_user_id);

  -- Último check-in
  SELECT * INTO v_last_check_in
  FROM daily_check_ins
  WHERE user_id = p_user_id
  ORDER BY date DESC LIMIT 1;

  -- Construir JSONB
  v_context := jsonb_build_object(
    'user', jsonb_build_object(
      'name', v_profile.name,
      'stage', v_profile.stage,
      'due_date', v_profile.due_date,
      'baby_birth_date', v_profile.baby_birth_date,
      'interests', v_profile.interests,
      'goals', v_profile.goals,
      'challenges', v_profile.challenges
    ),
    'cycle', jsonb_build_object(
      'cycle_length', v_cycle.cycle_length,
      'period_length', v_cycle.period_length,
      'last_period_start', v_cycle.last_period_start,
      'current_phase', v_cycle.current_phase
    ),
    'emotional_state', jsonb_build_object(
      'recent_moods', v_recent_moods,
      'mood_trend', get_mood_trend(p_user_id),
      'mood_average', get_mood_average(p_user_id, 7),
      'last_check_in', jsonb_build_object(
        'date', v_last_check_in.date,
        'mood', v_last_check_in.mood_score,
        'energy', v_last_check_in.energy_score,
        'how_feeling', v_last_check_in.how_feeling
      )
    ),
    'habits', jsonb_build_object(
      'weekly_completion_rate', v_habit_completion
    ),
    'context_built_at', NOW()
  );

  -- Atualizar cache
  INSERT INTO ai_context_cache (user_id, context_data, current_stage, current_mood_trend, last_updated)
  VALUES (p_user_id, v_context, v_profile.stage, get_mood_trend(p_user_id), NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    context_data = v_context,
    current_stage = v_profile.stage,
    current_mood_trend = get_mood_trend(p_user_id),
    last_updated = NOW(),
    version = ai_context_cache.version + 1;

  RETURN v_context;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar resumo de contexto em texto (para prompt)
CREATE OR REPLACE FUNCTION get_context_summary(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_profile RECORD;
  v_mood_trend TEXT;
  v_summary TEXT;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  v_mood_trend := get_mood_trend(p_user_id);

  v_summary := format(
    'Usuária: %s. Fase: %s. ',
    v_profile.name,
    CASE v_profile.stage
      WHEN 'trying' THEN 'tentando engravidar'
      WHEN 'pregnant' THEN 'grávida'
      WHEN 'postpartum' THEN 'pós-parto'
    END
  );

  IF v_profile.due_date IS NOT NULL AND v_profile.stage = 'pregnant' THEN
    v_summary := v_summary || format('Data prevista: %s. ', v_profile.due_date);
  END IF;

  IF v_profile.baby_birth_date IS NOT NULL THEN
    v_summary := v_summary || format('Bebê nasceu em: %s. ', v_profile.baby_birth_date);
  END IF;

  v_summary := v_summary || format(
    'Tendência de humor: %s. ',
    CASE v_mood_trend
      WHEN 'improving' THEN 'melhorando'
      WHEN 'declining' THEN 'em declínio'
      WHEN 'stable' THEN 'estável'
      ELSE 'dados insuficientes'
    END
  );

  RETURN v_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE chat_conversations IS 'Conversas com NathIA';
COMMENT ON TABLE chat_messages IS 'Mensagens individuais no chat';
COMMENT ON TABLE ai_context_cache IS 'Cache de contexto para a IA - atualizado periodicamente';
COMMENT ON TABLE ai_insights IS 'Insights gerados pela IA sobre padrões da usuária';
COMMENT ON FUNCTION build_user_context IS 'Constrói contexto completo da usuária para a NathIA';
COMMENT ON FUNCTION get_context_summary IS 'Gera resumo textual do contexto para prompt da IA';
