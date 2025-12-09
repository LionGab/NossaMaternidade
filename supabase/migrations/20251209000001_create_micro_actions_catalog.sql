-- =============================================================================
-- NOSSA MATERNIDADE - Micro Actions Catalog
-- Arquivo: 20251209000001_create_micro_actions_catalog.sql
-- Descrição: Catálogo de 8 micro-ações de descanso para mães
-- =============================================================================

-- =============================================================================
-- ENUM: Categoria de micro-ações
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'micro_action_category') THEN
    CREATE TYPE micro_action_category AS ENUM ('rest', 'breathe', 'mindfulness', 'movement');
  END IF;
END $$;

-- =============================================================================
-- ENUM: Fases da vida (stages)
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'life_stage') THEN
    CREATE TYPE life_stage AS ENUM ('pregnant', 'new-mother', 'experienced-mother');
  END IF;
END $$;

-- =============================================================================
-- TABELA: micro_actions_catalog
-- Descrição: Catálogo de micro-ações para descanso e autocuidado
-- =============================================================================
CREATE TABLE IF NOT EXISTS micro_actions_catalog (
  -- Identificador único (slug semântico)
  id TEXT PRIMARY KEY,

  -- Categoria da ação
  category micro_action_category NOT NULL DEFAULT 'rest',

  -- Conteúdo principal
  title TEXT NOT NULL,
  label_duration TEXT NOT NULL, -- Ex: "30 seg", "1-2 min"
  description_short TEXT NOT NULL, -- Descrição curta (1-2 frases)
  description_full TEXT NOT NULL, -- Descrição completa com instruções (preserva \n)

  -- Contexto de uso
  can_do_with_baby BOOLEAN NOT NULL DEFAULT TRUE,
  stages life_stage[] NOT NULL DEFAULT ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],

  -- Prioridade para ordenação/sugestão
  priority INTEGER DEFAULT 0, -- Menor = maior prioridade

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_micro_actions_catalog_category
  ON micro_actions_catalog(category);

CREATE INDEX IF NOT EXISTS idx_micro_actions_catalog_stages
  ON micro_actions_catalog USING GIN(stages);

CREATE INDEX IF NOT EXISTS idx_micro_actions_catalog_priority
  ON micro_actions_catalog(priority ASC);

-- =============================================================================
-- TRIGGER: updated_at automático
-- =============================================================================
CREATE OR REPLACE FUNCTION update_micro_actions_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_micro_actions_catalog_updated_at ON micro_actions_catalog;
CREATE TRIGGER trigger_micro_actions_catalog_updated_at
  BEFORE UPDATE ON micro_actions_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_micro_actions_catalog_updated_at();

-- =============================================================================
-- RLS: Desabilitado para leitura pública (catálogo global)
-- =============================================================================
ALTER TABLE micro_actions_catalog ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer pessoa pode ler (incluindo anon)
CREATE POLICY "micro_actions_catalog_public_read"
  ON micro_actions_catalog
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================
COMMENT ON TABLE micro_actions_catalog IS 'Catálogo de micro-ações de descanso para mães';
COMMENT ON COLUMN micro_actions_catalog.id IS 'Slug único da ação (ex: rest_close_eyes_30s)';
COMMENT ON COLUMN micro_actions_catalog.stages IS 'Fases da vida para as quais a ação é relevante';
COMMENT ON COLUMN micro_actions_catalog.description_full IS 'Descrição completa com quebras de linha (\n)';
COMMENT ON COLUMN micro_actions_catalog.can_do_with_baby IS 'Se pode ser feita com bebê por perto';

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'micro_actions_catalog'
  ) INTO table_exists;

  RAISE NOTICE 'Migration 20251209000001: micro_actions_catalog criada: %',
    CASE WHEN table_exists THEN 'SIM' ELSE 'NÃO' END;
END $$;
