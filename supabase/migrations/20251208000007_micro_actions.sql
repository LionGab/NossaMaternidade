-- =============================================================================
-- NOSSA MATERNIDADE - MVP SCHEMA
-- Arquivo: 07_micro_actions.sql
-- Descrição: Tabela de micro-ações para a Home Screen
-- Ordem: Executar DEPOIS de 05_rls_policies.sql
-- =============================================================================

-- =============================================================================
-- TABELA: micro_actions
-- Descrição: Micro-ações sugeridas para as usuárias na Home Screen
-- Nota: Tabela global (não vinculada a usuário específico)
-- =============================================================================

CREATE TABLE IF NOT EXISTS micro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Conteúdo
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT, -- Ex: "5 min", "10 min", "15 min"
  icon TEXT, -- Emoji ou código de ícone

  -- Categorização
  category TEXT, -- Ex: "wellness", "self-care", "mindfulness", "exercise"
  tags TEXT[],

  -- Prioridade e ordenação
  priority INTEGER DEFAULT 0, -- Menor número = maior prioridade
  sort_order INTEGER DEFAULT 0,

  -- Visibilidade
  active BOOLEAN DEFAULT TRUE,
  target_phase TEXT[], -- Fases da maternidade que devem ver esta ação
  target_emotion TEXT[], -- Emoções que devem ver esta ação

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Índices para micro_actions
CREATE INDEX IF NOT EXISTS idx_micro_actions_active ON micro_actions(active, priority, sort_order) WHERE active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_micro_actions_category ON micro_actions(category) WHERE active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_micro_actions_priority ON micro_actions(priority ASC, sort_order ASC) WHERE active = TRUE AND deleted_at IS NULL;

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_micro_actions_updated_at ON micro_actions;
CREATE TRIGGER update_micro_actions_updated_at
  BEFORE UPDATE ON micro_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE micro_actions IS 'Micro-ações sugeridas para as usuárias na Home Screen';
COMMENT ON COLUMN micro_actions.priority IS 'Menor número = maior prioridade (ordem crescente)';
COMMENT ON COLUMN micro_actions.target_phase IS 'Array de fases da maternidade que devem ver esta ação (ex: ["gestacao", "pos_parto"])';
COMMENT ON COLUMN micro_actions.target_emotion IS 'Array de emoções que devem ver esta ação (ex: ["ansiosa", "cansada"])';

-- =============================================================================
-- HABILITAR RLS
-- =============================================================================

ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Policy: Qualquer usuário autenticado pode ler micro-ações ativas
CREATE POLICY "micro_actions_select_active"
  ON micro_actions
  FOR SELECT
  TO authenticated
  USING (
    active = TRUE
    AND deleted_at IS NULL
  );

-- Policy: Apenas service role pode inserir/atualizar/deletar
-- (Para produção, você pode criar uma função RPC ou usar service role)
-- NOTA: Esta policy bloqueia INSERT/UPDATE/DELETE para usuários autenticados
-- Para adicionar micro-ações, use o service role ou crie uma Edge Function
-- Alternativamente, você pode remover esta restrição se quiser permitir
-- que usuários autenticados adicionem suas próprias micro-ações

-- =============================================================================
-- DADOS INICIAIS (SEED)
-- =============================================================================

-- Inserir micro-ações de exemplo
INSERT INTO micro_actions (title, description, duration, icon, category, priority, sort_order) VALUES
  ('Respiração Consciente', 'Pare por 2 minutos e respire profundamente. Isso ajuda a acalmar a mente e reduzir a ansiedade.', '2 min', '🧘', 'wellness', 1, 1),
  ('Gratidão do Dia', 'Anote 3 coisas pelas quais você é grata hoje. A gratidão transforma nossa perspectiva.', '3 min', '🙏', 'mindfulness', 2, 2),
  ('Alongamento Suave', 'Faça alguns alongamentos leves para aliviar a tensão do corpo. Perfeito para gestantes e mães.', '5 min', '🤸', 'exercise', 3, 3),
  ('Momento de Silêncio', 'Encontre um lugar tranquilo e fique em silêncio por alguns minutos. Acalme sua mente.', '5 min', '🌙', 'mindfulness', 4, 4),
  ('Água e Hidratação', 'Beba um copo de água e respire. A hidratação é essencial, especialmente na gestação e amamentação.', '1 min', '💧', 'wellness', 5, 5),
  ('Auto-Cuidado Básico', 'Cuide de você: lave o rosto, passe um hidratante, ou apenas respire. Você merece esse cuidado.', '5 min', '✨', 'self-care', 6, 6),
  ('Conexão com o Bebê', 'Coloque a mão na barriga (se gestante) ou abrace seu bebê. Sinta a conexão e o amor.', '3 min', '👶', 'wellness', 7, 7),
  ('Pausa para o Chá', 'Prepare um chá quente e aproveite o momento. Chás de camomila ou erva-doce são ótimos.', '5 min', '☕', 'self-care', 8, 8),
  ('Caminhada Curta', 'Dê uma volta curta, mesmo que seja dentro de casa. O movimento ajuda a liberar endorfina.', '10 min', '🚶', 'exercise', 9, 9),
  ('Música Relaxante', 'Coloque uma música calma e feche os olhos. Deixe a música acalmar sua mente e corpo.', '5 min', '🎵', 'mindfulness', 10, 10)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Verificação
-- =============================================================================

DO $$
DECLARE
  table_count INTEGER;
  seed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = 'micro_actions';

  SELECT COUNT(*) INTO seed_count
  FROM micro_actions
  WHERE deleted_at IS NULL;

  RAISE NOTICE '07_micro_actions.sql: Tabela criada: %, Micro-ações inseridas: %', 
    CASE WHEN table_count > 0 THEN 'SIM' ELSE 'NÃO' END,
    seed_count;
END $$;

