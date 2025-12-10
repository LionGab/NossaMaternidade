-- =============================================================================
-- NOSSA MATERNIDADE - SCHEMA COMPLETO
-- Arquivo: APPLY_ALL_MISSING_TABLES.sql
-- Descrição: Script consolidado para aplicar TODAS as tabelas faltantes de uma vez
-- Ordem: Executar DEPOIS de 07_micro_actions.sql
-- Data: 10 de Dezembro de 2025
-- =============================================================================
--
-- ATENÇÃO: Este arquivo consolida as migrations 08, 09 e 10.
-- Use APENAS se quiser aplicar tudo de uma vez.
-- Caso contrário, execute as migrations individuais na ordem: 08 → 09 → 10
--
-- Tempo estimado de execução: 10-15 segundos
--
-- =============================================================================

\echo '=================================================='
\echo 'NOSSA MATERNIDADE - Aplicando Schema Completo'
\echo '=================================================='
\echo ''
\echo 'Iniciando criação de tabelas faltantes...'
\echo ''

-- =============================================================================
-- PARTE 1: CRIAÇÃO DAS TABELAS
-- (Migration 08)
-- =============================================================================

\echo '[1/3] Criando tabelas de tracking pessoal...'

-- diary_entries
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_response TEXT,
  emotion_detected TEXT CHECK (emotion_detected IN ('bem', 'triste', 'ansiosa', 'cansada', 'calma', NULL)),
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score IS NULL OR (sentiment_score >= -1 AND sentiment_score <= 1)),
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_created ON diary_entries(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_diary_entries_favorite ON diary_entries(user_id) WHERE is_favorite = TRUE AND deleted_at IS NULL;

DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- sleep_logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_hours DECIMAL(3,1) NOT NULL CHECK (duration_hours >= 0 AND duration_hours <= 24),
  quality TEXT CHECK (quality IN ('excelente', 'boa', 'regular', 'ruim', 'pessima', NULL)),
  logged_at TIMESTAMPTZ NOT NULL,
  bedtime TIME,
  wake_time TIME,
  notes TEXT,
  interruptions INTEGER DEFAULT 0,
  felt_rested BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_user ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_logged ON sleep_logs(user_id, logged_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sleep_logs_unique_daily ON sleep_logs(user_id, DATE(logged_at AT TIME ZONE 'America/Sao_Paulo'));

DROP TRIGGER IF EXISTS update_sleep_logs_updated_at ON sleep_logs;
CREATE TRIGGER update_sleep_logs_updated_at
  BEFORE UPDATE ON sleep_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- check_in_logs
CREATE TABLE IF NOT EXISTS check_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL CHECK (emotion IN ('bem', 'triste', 'ansiosa', 'cansada', 'calma')),
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level IS NULL OR energy_level BETWEEN 1 AND 5),
  notes TEXT,
  triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
  activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  ai_insights TEXT,
  suggested_actions TEXT[],
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_check_in_logs_user ON check_in_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_user_logged ON check_in_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_triggers ON check_in_logs USING GIN(triggers);

-- baby_milestones
CREATE TABLE IF NOT EXISTS baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('motor', 'cognitivo', 'linguagem', 'social', 'sensorial')),
  age_months INTEGER NOT NULL CHECK (age_months >= 0 AND age_months <= 60),
  age_range_min INTEGER CHECK (age_range_min >= 0),
  age_range_max INTEGER CHECK (age_range_max <= 60),
  tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  resources_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  is_critical BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_baby_milestones_age ON baby_milestones(age_months);
CREATE INDEX IF NOT EXISTS idx_baby_milestones_category ON baby_milestones(category);

DROP TRIGGER IF EXISTS update_baby_milestones_updated_at ON baby_milestones;
CREATE TRIGGER update_baby_milestones_updated_at
  BEFORE UPDATE ON baby_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- user_baby_milestones
CREATE TABLE IF NOT EXISTS user_baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES baby_milestones(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  baby_age_at_completion INTEGER,
  notes TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

CREATE INDEX IF NOT EXISTS idx_user_milestones_user ON user_baby_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_milestones_completed ON user_baby_milestones(user_id, is_completed);

DROP TRIGGER IF EXISTS update_user_baby_milestones_updated_at ON user_baby_milestones;
CREATE TRIGGER update_user_baby_milestones_updated_at
  BEFORE UPDATE ON user_baby_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'milestone', 'community', 'system', 'content', 'achievement')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,
  action_type TEXT CHECK (action_type IN ('navigate', 'open_chat', 'open_post', 'open_article', 'custom', NULL)),
  action_data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', NULL)),
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = FALSE;

-- guilt_entries
CREATE TABLE IF NOT EXISTS guilt_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('autocuidado', 'trabalho', 'tempo_qualidade', 'amamentacao', 'disciplina', 'educacao', 'saude', 'outro')),
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),
  is_rational BOOLEAN,
  cognitive_distortion TEXT,
  reframe TEXT,
  reflection TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_guilt_entries_user ON guilt_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_guilt_entries_unresolved ON guilt_entries(user_id) WHERE is_resolved = FALSE AND deleted_at IS NULL;

DROP TRIGGER IF EXISTS update_guilt_entries_updated_at ON guilt_entries;
CREATE TRIGGER update_guilt_entries_updated_at
  BEFORE UPDATE ON guilt_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

\echo '✓ Tabelas de tracking criadas!'
\echo ''
\echo '[2/3] Criando tabelas de conteúdo (Mundo Nath)...'

-- content_articles
CREATE TABLE IF NOT EXISTS content_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Nossa Maternidade',
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_phase TEXT[] DEFAULT ARRAY[]::TEXT[],
  reading_time_minutes INTEGER,
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON content_articles(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_articles_fts ON content_articles USING GIN(to_tsvector('portuguese', title || ' ' || content));

DROP TRIGGER IF EXISTS update_content_articles_updated_at ON content_articles;
CREATE TRIGGER update_content_articles_updated_at
  BEFORE UPDATE ON content_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- content_videos (simplificado)
CREATE TABLE IF NOT EXISTS content_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- content_interactions
CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'reel')),
  content_id UUID NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'bookmark', 'share', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interactions_user ON content_interactions(user_id);

\echo '✓ Tabelas de conteúdo criadas!'
\echo ''

-- =============================================================================
-- PARTE 2: HABILITAR RLS
-- (Migration 09)
-- =============================================================================

\echo '[3/3] Habilitando RLS e criando policies...'

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilt_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_interactions ENABLE ROW LEVEL SECURITY;

-- Policies simplificadas
CREATE POLICY "own_data" ON diary_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON sleep_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON check_in_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON user_baby_milestones FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON guilt_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON content_interactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "read_milestones" ON baby_milestones FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "read_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "read_articles" ON content_articles FOR SELECT TO authenticated USING (status = 'published');
CREATE POLICY "read_videos" ON content_videos FOR SELECT TO authenticated USING (status = 'published');

-- Service role full access
CREATE POLICY "service_role_all" ON diary_entries FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON sleep_logs FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON check_in_logs FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON baby_milestones FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON user_baby_milestones FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON notifications FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON guilt_entries FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON content_articles FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON content_videos FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON content_interactions FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

\echo '✓ RLS habilitado e policies criadas!'
\echo ''

-- =============================================================================
-- PARTE 3: SEEDS
-- =============================================================================

\echo 'Inserindo dados iniciais...'

-- Milestones básicos
INSERT INTO baby_milestones (title, description, category, age_months, is_critical, order_index, tips) VALUES
  ('Sorri em resposta', 'Bebê sorri quando você sorri ou fala', 'social', 2, TRUE, 1, ARRAY['Faça muito contato visual', 'Converse com voz suave']),
  ('Levanta a cabeça', 'Levanta a cabeça quando de bruços', 'motor', 2, TRUE, 2, ARRAY['Faça tummy time diariamente']),
  ('Rola de bruços', 'Rola do decúbito ventral para dorsal', 'motor', 4, TRUE, 3, ARRAY['Incentive com brinquedos']),
  ('Balbucia', 'Emite sons como "ba-ba", "ma-ma"', 'linguagem', 6, TRUE, 4, ARRAY['Repita os sons do bebê']),
  ('Senta sem apoio', 'Senta-se sozinho', 'motor', 7, TRUE, 5, ARRAY['Use almofadas ao redor']),
  ('Engatinha', 'Movimenta-se engatinhando', 'motor', 9, TRUE, 6, ARRAY['Torne o ambiente seguro']),
  ('Primeiras palavras', 'Diz "mamã" ou "papá"', 'linguagem', 12, TRUE, 7, ARRAY['Nomeie objetos e pessoas'])
ON CONFLICT DO NOTHING;

\echo '✓ Milestones inseridos!'
\echo ''

-- =============================================================================
-- VERIFICAÇÃO FINAL
-- =============================================================================

\echo '=================================================='
\echo 'Verificando instalação...'
\echo '=================================================='
\echo ''

DO $$
DECLARE
  v_tables INTEGER;
  v_policies INTEGER;
  v_milestones INTEGER;
BEGIN
  -- Contar tabelas criadas
  SELECT COUNT(*) INTO v_tables
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'diary_entries', 'sleep_logs', 'check_in_logs',
      'baby_milestones', 'user_baby_milestones',
      'notifications', 'guilt_entries',
      'content_articles', 'content_videos', 'content_interactions'
    );

  -- Contar policies
  SELECT COUNT(*) INTO v_policies
  FROM pg_policies
  WHERE tablename IN (
      'diary_entries', 'sleep_logs', 'check_in_logs',
      'baby_milestones', 'user_baby_milestones',
      'notifications', 'guilt_entries',
      'content_articles', 'content_videos', 'content_interactions'
    );

  -- Contar milestones
  SELECT COUNT(*) INTO v_milestones FROM baby_milestones;

  -- Relatório
  RAISE NOTICE '';
  RAISE NOTICE '✓ Tabelas criadas: %', v_tables;
  RAISE NOTICE '✓ Policies criadas: %', v_policies;
  RAISE NOTICE '✓ Milestones inseridos: %', v_milestones;
  RAISE NOTICE '';
  RAISE NOTICE '==================================================';;
  RAISE NOTICE 'Instalação concluída com sucesso!';;
  RAISE NOTICE '==================================================';;
  RAISE NOTICE '';
  RAISE NOTICE 'Próximos passos:';
  RAISE NOTICE '1. Testar services do app';
  RAISE NOTICE '2. Regenerar types TypeScript';
  RAISE NOTICE '3. Validar RLS policies';
  RAISE NOTICE '';
END $$;
