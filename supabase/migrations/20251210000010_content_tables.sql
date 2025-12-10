-- =============================================================================
-- NOSSA MATERNIDADE - MVP SCHEMA
-- Arquivo: 10_content_tables.sql
-- Descrição: Tabelas de conteúdo editorial (Mundo Nath)
-- Tabelas: content_articles, content_videos, content_audios, content_reels, content_analytics
-- Ordem: Executar DEPOIS de 09_rls_missing_tables.sql
-- Data: 10 de Dezembro de 2025
-- =============================================================================

-- =============================================================================
-- TABELA: content_articles (Artigos do Mundo Nath)
-- Descrição: Conteúdo editorial em formato texto
-- Uso: Feed de artigos educativos e informativos
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,

  -- Conteúdo
  content TEXT NOT NULL,
  cover_image_url TEXT,
  images_urls TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Autoria
  author TEXT DEFAULT 'Nossa Maternidade',
  author_bio TEXT,
  author_avatar_url TEXT,

  -- Categorização
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_phase TEXT[] DEFAULT ARRAY[]::TEXT[], -- Fases da maternidade

  -- Metadados
  reading_time_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('iniciante', 'intermediario', 'avancado', NULL)),
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Engagement (desnormalizado para performance)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Status e publicação
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para content_articles
CREATE INDEX IF NOT EXISTS idx_articles_status ON content_articles(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_articles_published ON content_articles(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_articles_category ON content_articles(category) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_articles_featured ON content_articles(published_at DESC) WHERE is_featured = TRUE AND status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_articles_slug ON content_articles(slug) WHERE deleted_at IS NULL;

-- Índice GIN para full-text search
CREATE INDEX IF NOT EXISTS idx_articles_fts ON content_articles USING GIN(to_tsvector('portuguese', title || ' ' || content));

-- Índice GIN para tags
CREATE INDEX IF NOT EXISTS idx_articles_tags ON content_articles USING GIN(tags);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_content_articles_updated_at ON content_articles;
CREATE TRIGGER update_content_articles_updated_at
  BEFORE UPDATE ON content_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE content_articles IS 'Artigos educativos do Mundo Nath (conteúdo editorial)';

-- =============================================================================
-- TABELA: content_videos (Vídeos do Mundo Nath)
-- Descrição: Vídeos educativos e informativos
-- Uso: Feed de vídeos
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Mídia
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo', 'cloudflare', 's3', 'other')),
  video_id TEXT, -- ID do vídeo no provider

  -- Metadados do vídeo
  duration_seconds INTEGER,
  resolution TEXT CHECK (resolution IN ('360p', '480p', '720p', '1080p', '4k', NULL)),
  file_size_mb INTEGER,

  -- Autoria
  presenter TEXT,
  presenter_bio TEXT,
  presenter_avatar_url TEXT,

  -- Categorização
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_phase TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Metadados
  difficulty_level TEXT CHECK (difficulty_level IN ('iniciante', 'intermediario', 'avancado', NULL)),
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Legendas e acessibilidade
  has_subtitles BOOLEAN DEFAULT FALSE,
  subtitle_languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  transcript TEXT,

  -- Engagement (desnormalizado)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2), -- Percentual de conclusão médio

  -- Status e publicação
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para content_videos
CREATE INDEX IF NOT EXISTS idx_videos_status ON content_videos(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_published ON content_videos(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_category ON content_videos(category) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_featured ON content_videos(published_at DESC) WHERE is_featured = TRUE AND status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_videos_slug ON content_videos(slug) WHERE deleted_at IS NULL;

-- Índice GIN para tags
CREATE INDEX IF NOT EXISTS idx_videos_tags ON content_videos USING GIN(tags);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_content_videos_updated_at ON content_videos;
CREATE TRIGGER update_content_videos_updated_at
  BEFORE UPDATE ON content_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE content_videos IS 'Vídeos educativos do Mundo Nath';

-- =============================================================================
-- TABELA: content_audios (Podcasts/Áudios do Mundo Nath)
-- Descrição: Conteúdo em áudio (meditações, podcasts, histórias)
-- Uso: Feed de áudios
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Mídia
  audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  audio_provider TEXT CHECK (audio_provider IN ('cloudflare', 's3', 'spotify', 'soundcloud', 'other')),

  -- Metadados do áudio
  duration_seconds INTEGER,
  file_size_mb INTEGER,

  -- Autoria
  narrator TEXT,
  narrator_bio TEXT,

  -- Categorização
  type TEXT CHECK (type IN ('meditacao', 'podcast', 'historia', 'respiracao', 'sono', 'outro')),
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_phase TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Metadados
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Transcrição
  transcript TEXT,

  -- Engagement (desnormalizado)
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),

  -- Status e publicação
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para content_audios
CREATE INDEX IF NOT EXISTS idx_audios_status ON content_audios(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audios_published ON content_audios(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audios_type ON content_audios(type) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audios_featured ON content_audios(published_at DESC) WHERE is_featured = TRUE AND status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audios_slug ON content_audios(slug) WHERE deleted_at IS NULL;

-- Índice GIN para tags
CREATE INDEX IF NOT EXISTS idx_audios_tags ON content_audios USING GIN(tags);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_content_audios_updated_at ON content_audios;
CREATE TRIGGER update_content_audios_updated_at
  BEFORE UPDATE ON content_audios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE content_audios IS 'Conteúdo em áudio (meditações, podcasts, histórias)';

-- =============================================================================
-- TABELA: content_reels (Reels/Shorts do Mundo Nath)
-- Descrição: Vídeos curtos estilo TikTok/Reels
-- Uso: Feed de vídeos curtos
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  title TEXT,
  caption TEXT,

  -- Mídia
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_provider TEXT CHECK (video_provider IN ('cloudflare', 's3', 'tiktok', 'instagram', 'youtube_shorts', 'other')),

  -- Metadados do vídeo
  duration_seconds INTEGER CHECK (duration_seconds <= 90), -- Máximo 90 segundos
  aspect_ratio TEXT DEFAULT '9:16' CHECK (aspect_ratio IN ('9:16', '1:1', '16:9')),

  -- Autoria
  creator TEXT,

  -- Categorização
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_phase TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Metadados
  is_premium BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,

  -- Engagement (desnormalizado)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,

  -- Status e publicação
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para content_reels
CREATE INDEX IF NOT EXISTS idx_reels_status ON content_reels(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reels_published ON content_reels(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reels_trending ON content_reels(published_at DESC) WHERE is_trending = TRUE AND status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reels_category ON content_reels(category) WHERE status = 'published' AND deleted_at IS NULL;

-- Índice GIN para tags
CREATE INDEX IF NOT EXISTS idx_reels_tags ON content_reels USING GIN(tags);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_content_reels_updated_at ON content_reels;
CREATE TRIGGER update_content_reels_updated_at
  BEFORE UPDATE ON content_reels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE content_reels IS 'Vídeos curtos (Reels/Shorts) do Mundo Nath';

-- =============================================================================
-- TABELA: content_interactions (Analytics de Conteúdo)
-- Descrição: Rastreamento de interações com conteúdo
-- Uso: Analytics, recomendações, personalização
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Usuária
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo (polimórfico)
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'reel')),
  content_id UUID NOT NULL,

  -- Tipo de interação
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'bookmark', 'share', 'complete', 'skip')),

  -- Contexto da interação
  watch_duration_seconds INTEGER, -- Para vídeos/áudios
  scroll_percentage INTEGER CHECK (scroll_percentage IS NULL OR scroll_percentage BETWEEN 0 AND 100), -- Para artigos
  source TEXT CHECK (source IN ('feed', 'search', 'recommendation', 'notification', 'direct', NULL)),

  -- Metadados
  device_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para content_interactions
CREATE INDEX IF NOT EXISTS idx_interactions_user ON content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_content ON content_interactions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_type ON content_interactions(user_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_interactions_created ON content_interactions(created_at DESC);

-- Índice composto para analytics
CREATE INDEX IF NOT EXISTS idx_interactions_analytics ON content_interactions(content_type, content_id, interaction_type, created_at DESC);

COMMENT ON TABLE content_interactions IS 'Rastreamento de interações das usuárias com conteúdo';

-- =============================================================================
-- HABILITAR RLS
-- =============================================================================

ALTER TABLE content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_interactions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Policies para content_articles
CREATE POLICY "Anyone can read published articles"
  ON content_articles FOR SELECT
  TO authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Service role can manage articles"
  ON content_articles FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policies para content_videos
CREATE POLICY "Anyone can read published videos"
  ON content_videos FOR SELECT
  TO authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Service role can manage videos"
  ON content_videos FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policies para content_audios
CREATE POLICY "Anyone can read published audios"
  ON content_audios FOR SELECT
  TO authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Service role can manage audios"
  ON content_audios FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policies para content_reels
CREATE POLICY "Anyone can read published reels"
  ON content_reels FOR SELECT
  TO authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Service role can manage reels"
  ON content_reels FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policies para content_interactions
CREATE POLICY "Users can manage own interactions"
  ON content_interactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage interactions"
  ON content_interactions FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- FUNÇÕES AUXILIARES
-- =============================================================================

-- Função para incrementar view_count
CREATE OR REPLACE FUNCTION increment_content_view_count(
  p_content_type TEXT,
  p_content_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_content_type = 'article' THEN
    UPDATE content_articles SET view_count = view_count + 1 WHERE id = p_content_id;
  ELSIF p_content_type = 'video' THEN
    UPDATE content_videos SET view_count = view_count + 1 WHERE id = p_content_id;
  ELSIF p_content_type = 'audio' THEN
    UPDATE content_audios SET play_count = play_count + 1 WHERE id = p_content_id;
  ELSIF p_content_type = 'reel' THEN
    UPDATE content_reels SET view_count = view_count + 1 WHERE id = p_content_id;
  ELSE
    RETURN FALSE;
  END IF;

  RETURN FOUND;
END;
$$;

-- Função para buscar conteúdo recomendado
CREATE OR REPLACE FUNCTION get_recommended_content(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  content_type TEXT,
  content_id UUID,
  title TEXT,
  cover_url TEXT,
  category TEXT,
  published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Simplificado: retorna conteúdo mais recente
  -- TODO: implementar algoritmo de recomendação baseado em ML
  RETURN QUERY
  SELECT 'article'::TEXT, id, title, cover_image_url, category, published_at
  FROM content_articles
  WHERE status = 'published' AND deleted_at IS NULL
  ORDER BY published_at DESC
  LIMIT p_limit;
END;
$$;

-- =============================================================================
-- Verificação
-- =============================================================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'content_articles', 'content_videos', 'content_audios',
      'content_reels', 'content_interactions'
    );

  RAISE NOTICE '10_content_tables.sql: % tabelas criadas/verificadas', table_count;
END $$;
