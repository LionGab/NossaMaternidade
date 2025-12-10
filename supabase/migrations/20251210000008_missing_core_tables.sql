-- =============================================================================
-- NOSSA MATERNIDADE - MVP SCHEMA
-- Arquivo: 08_missing_core_tables.sql
-- Descrição: Tabelas críticas faltantes identificadas na auditoria
-- Tabelas: diary_entries, sleep_logs, check_in_logs, baby_milestones, user_baby_milestones, notifications, guilt_entries
-- Ordem: Executar DEPOIS de 07_micro_actions.sql
-- Data: 10 de Dezembro de 2025
-- =============================================================================

-- =============================================================================
-- TABELA: diary_entries (Refúgio)
-- Descrição: Entradas do diário privado da usuária
-- Service: diaryService.ts
-- Uso: Desabafos privados com resposta da IA
-- =============================================================================

CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamento
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo
  content TEXT NOT NULL,
  ai_response TEXT,

  -- Análise emocional
  emotion_detected TEXT CHECK (emotion_detected IN ('bem', 'triste', 'ansiosa', 'cansada', 'calma', NULL)),
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score IS NULL OR (sentiment_score >= -1 AND sentiment_score <= 1)),

  -- Metadados
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para diary_entries
CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_created ON diary_entries(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_diary_entries_favorite ON diary_entries(user_id) WHERE is_favorite = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_diary_entries_emotion ON diary_entries(emotion_detected) WHERE emotion_detected IS NOT NULL AND deleted_at IS NULL;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE diary_entries IS 'Entradas do diário privado (Refúgio) das usuárias';

-- =============================================================================
-- TABELA: sleep_logs (Sleep Tracker)
-- Descrição: Registro de horas de sono
-- Service: sleepService.ts
-- Uso: Tracking de qualidade e quantidade de sono
-- =============================================================================

CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamento
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados do sono
  duration_hours DECIMAL(3,1) NOT NULL CHECK (duration_hours >= 0 AND duration_hours <= 24),
  quality TEXT CHECK (quality IN ('excelente', 'boa', 'regular', 'ruim', 'pessima', NULL)),

  -- Quando dormiu
  logged_at TIMESTAMPTZ NOT NULL,
  bedtime TIME,
  wake_time TIME,

  -- Notas e contexto
  notes TEXT,
  interruptions INTEGER DEFAULT 0,
  felt_rested BOOLEAN,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para sleep_logs
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_logged ON sleep_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_logged_at ON sleep_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_quality ON sleep_logs(quality) WHERE quality IS NOT NULL;

-- Índice único para evitar duplicatas no mesmo dia
CREATE UNIQUE INDEX IF NOT EXISTS idx_sleep_logs_unique_daily
  ON sleep_logs(user_id, DATE(logged_at AT TIME ZONE 'America/Sao_Paulo'));

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_sleep_logs_updated_at ON sleep_logs;
CREATE TRIGGER update_sleep_logs_updated_at
  BEFORE UPDATE ON sleep_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sleep_logs IS 'Registro de sono das usuárias (tracking de qualidade)';

-- =============================================================================
-- TABELA: check_in_logs (Check-ins Emocionais)
-- Descrição: Registro diário de estado emocional
-- Service: checkInService.ts
-- Uso: Tracking de humor e gatilhos emocionais
-- =============================================================================

CREATE TABLE IF NOT EXISTS check_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamento
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Estado emocional
  emotion TEXT NOT NULL CHECK (emotion IN ('bem', 'triste', 'ansiosa', 'cansada', 'calma')),
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level IS NULL OR energy_level BETWEEN 1 AND 5),

  -- Contexto
  notes TEXT,
  triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
  activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,

  -- Análise IA
  ai_insights TEXT,
  suggested_actions TEXT[],

  -- Timestamps
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para check_in_logs
CREATE INDEX IF NOT EXISTS idx_check_in_logs_user ON check_in_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_user_logged ON check_in_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_emotion ON check_in_logs(emotion);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_logged_at ON check_in_logs(logged_at DESC);

-- Índice GIN para busca em triggers
CREATE INDEX IF NOT EXISTS idx_check_in_logs_triggers ON check_in_logs USING GIN(triggers);

COMMENT ON TABLE check_in_logs IS 'Check-ins emocionais diários das usuárias';

-- =============================================================================
-- TABELA: baby_milestones (Marcos do Desenvolvimento)
-- Descrição: Milestones padrão do desenvolvimento infantil
-- Service: milestonesService.ts
-- Uso: Biblioteca de marcos por idade
-- =============================================================================

CREATE TABLE IF NOT EXISTS baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Definição do milestone
  title TEXT NOT NULL,
  description TEXT,

  -- Categorização
  category TEXT NOT NULL CHECK (category IN ('motor', 'cognitivo', 'linguagem', 'social', 'sensorial')),
  age_months INTEGER NOT NULL CHECK (age_months >= 0 AND age_months <= 60),
  age_range_min INTEGER CHECK (age_range_min >= 0),
  age_range_max INTEGER CHECK (age_range_max <= 60),

  -- Recursos
  tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  resources_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,

  -- Metadados
  is_critical BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para baby_milestones
CREATE INDEX IF NOT EXISTS idx_baby_milestones_age ON baby_milestones(age_months);
CREATE INDEX IF NOT EXISTS idx_baby_milestones_category ON baby_milestones(category);
CREATE INDEX IF NOT EXISTS idx_baby_milestones_age_category ON baby_milestones(age_months, category);
CREATE INDEX IF NOT EXISTS idx_baby_milestones_critical ON baby_milestones(is_critical) WHERE is_critical = TRUE;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_baby_milestones_updated_at ON baby_milestones;
CREATE TRIGGER update_baby_milestones_updated_at
  BEFORE UPDATE ON baby_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE baby_milestones IS 'Marcos do desenvolvimento infantil (biblioteca padrão)';

-- =============================================================================
-- TABELA: user_baby_milestones (Progresso Individual)
-- Descrição: Tracking de milestones por usuária
-- Service: milestonesService.ts
-- Uso: Marcar milestones como completados
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamentos
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES baby_milestones(id) ON DELETE CASCADE,

  -- Progresso
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  baby_age_at_completion INTEGER, -- idade em meses quando completou

  -- Notas pessoais
  notes TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[], -- URLs de fotos

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: um milestone por usuário
  UNIQUE(user_id, milestone_id)
);

-- Índices para user_baby_milestones
CREATE INDEX IF NOT EXISTS idx_user_milestones_user ON user_baby_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_milestones_milestone ON user_baby_milestones(milestone_id);
CREATE INDEX IF NOT EXISTS idx_user_milestones_completed ON user_baby_milestones(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_user_milestones_user_date ON user_baby_milestones(user_id, completed_at DESC) WHERE is_completed = TRUE;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_user_baby_milestones_updated_at ON user_baby_milestones;
CREATE TRIGGER update_user_baby_milestones_updated_at
  BEFORE UPDATE ON user_baby_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_baby_milestones IS 'Progresso individual dos milestones de cada usuária';

-- =============================================================================
-- TABELA: notifications (Sistema de Notificações)
-- Descrição: Push notifications e notificações in-app
-- Uso: Lembretes, alertas, novidades
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Destinatário
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tipo e conteúdo
  type TEXT NOT NULL CHECK (type IN ('reminder', 'milestone', 'community', 'system', 'content', 'achievement')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,

  -- Ação (deep link)
  action_type TEXT CHECK (action_type IN ('navigate', 'open_chat', 'open_post', 'open_article', 'custom', NULL)),
  action_data JSONB DEFAULT '{}'::jsonb,

  -- Estado
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Agendamento e envio
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', NULL)),

  -- Metadados
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for) WHERE delivery_status = 'pending' AND scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS 'Sistema de notificações push e in-app';

-- =============================================================================
-- TABELA: guilt_entries (Sistema de Culpa Materna)
-- Descrição: Rastreamento e ressignificação de culpa
-- Service: guiltService.ts
-- Uso: Ferramenta terapêutica para lidar com culpa materna
-- =============================================================================

CREATE TABLE IF NOT EXISTS guilt_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamento
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Descrição da culpa
  title TEXT NOT NULL,
  description TEXT,

  -- Categorização
  category TEXT CHECK (category IN ('autocuidado', 'trabalho', 'tempo_qualidade', 'amamentacao', 'disciplina', 'educacao', 'saude', 'outro')),
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),

  -- Análise e reflexão
  is_rational BOOLEAN, -- IA ajuda a identificar se é racional ou não
  cognitive_distortion TEXT, -- Tipo de distorção cognitiva
  reframe TEXT, -- Ressignificação sugerida pela IA
  reflection TEXT, -- Reflexão da usuária

  -- Resolução
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para guilt_entries
CREATE INDEX IF NOT EXISTS idx_guilt_entries_user ON guilt_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_guilt_entries_user_created ON guilt_entries(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_guilt_entries_unresolved ON guilt_entries(user_id) WHERE is_resolved = FALSE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_guilt_entries_category ON guilt_entries(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_guilt_entries_intensity ON guilt_entries(intensity DESC) WHERE deleted_at IS NULL;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_guilt_entries_updated_at ON guilt_entries;
CREATE TRIGGER update_guilt_entries_updated_at
  BEFORE UPDATE ON guilt_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE guilt_entries IS 'Registro e ressignificação de culpa materna';

-- =============================================================================
-- DADOS INICIAIS (SEED) - Baby Milestones
-- =============================================================================

-- Milestones de 0-3 meses
INSERT INTO baby_milestones (title, description, category, age_months, age_range_min, age_range_max, is_critical, order_index, tips) VALUES
  ('Sorri em resposta', 'Bebê sorri quando você sorri ou fala com ele', 'social', 2, 1, 3, TRUE, 1, ARRAY['Faça muito contato visual', 'Converse com voz suave', 'Sorria bastante para o bebê']),
  ('Levanta a cabeça', 'Consegue levantar a cabeça brevemente quando está de bruços', 'motor', 2, 1, 3, TRUE, 2, ARRAY['Faça tummy time diariamente', 'Coloque brinquedos à frente', 'Comece com 1-2 minutos']),
  ('Segue objetos com os olhos', 'Acompanha objetos em movimento com o olhar', 'sensorial', 2, 1, 3, TRUE, 3, ARRAY['Use brinquedos coloridos', 'Mova lentamente', 'Tente diferentes direções']),
  ('Reconhece vozes familiares', 'Acalma-se com voz da mãe/cuidadores', 'cognitivo', 3, 2, 4, FALSE, 4, ARRAY['Fale muito com o bebê', 'Cante canções de ninar', 'Leia histórias simples']),

-- Milestones de 4-6 meses
  ('Rola de bruços para costas', 'Consegue rolar do decúbito ventral para dorsal', 'motor', 4, 3, 5, TRUE, 5, ARRAY['Incentive com brinquedos ao lado', 'Pratique em superfície segura', 'Nunca deixe sozinho em altura']),
  ('Ri alto', 'Gargalhadas espontâneas', 'social', 4, 3, 5, FALSE, 6, ARRAY['Brinque de esconder o rosto', 'Faça sons engraçados', 'Responda aos sorrisos']),
  ('Pega objetos', 'Estende a mão e pega objetos', 'motor', 5, 4, 6, TRUE, 7, ARRAY['Ofereça brinquedos seguros', 'Varie texturas', 'Estimule com objetos coloridos']),
  ('Balbucia', 'Emite sons como "ba-ba", "ma-ma"', 'linguagem', 6, 5, 7, TRUE, 8, ARRAY['Repita os sons do bebê', 'Converse muito', 'Leia livros infantis']),

-- Milestones de 7-12 meses
  ('Senta sem apoio', 'Senta-se sozinho por vários minutos', 'motor', 7, 6, 8, TRUE, 9, ARRAY['Use almofadas ao redor inicialmente', 'Incentive com brinquedos à frente', 'Não force, respeite o tempo']),
  ('Engatinha', 'Movimenta-se engatinhando', 'motor', 9, 7, 10, TRUE, 10, ARRAY['Torne o ambiente seguro', 'Incentive com brinquedos', 'Alguns bebês pulam essa fase']),
  ('Fica em pé com apoio', 'Fica de pé segurando em móveis', 'motor', 9, 8, 11, TRUE, 11, ARRAY['Ofereça móveis estáveis', 'Proteja quinas', 'Use tapetes antiderrapantes']),
  ('Primeiras palavras', 'Diz "mamã" ou "papá" com significado', 'linguagem', 12, 10, 14, TRUE, 12, ARRAY['Nomeie objetos e pessoas', 'Comemore cada palavra nova', 'Evite linguagem infantilizada demais'])
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Verificação
-- =============================================================================

DO $$
DECLARE
  table_count INTEGER;
  milestone_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'diary_entries', 'sleep_logs', 'check_in_logs',
      'baby_milestones', 'user_baby_milestones',
      'notifications', 'guilt_entries'
    );

  SELECT COUNT(*) INTO milestone_count
  FROM baby_milestones;

  RAISE NOTICE '08_missing_core_tables.sql: % tabelas criadas, % milestones inseridos',
    table_count, milestone_count;
END $$;
