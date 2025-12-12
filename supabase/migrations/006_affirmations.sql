-- ============================================
-- NOSSA MATERNIDADE - Migration 006: Affirmations
-- ============================================
-- Afirmações diárias para bem-estar
-- Seed com 100+ afirmações em português
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

-- Categoria de afirmação
CREATE TYPE affirmation_category AS ENUM (
  'self_love',
  'strength',
  'motherhood',
  'body_positivity',
  'anxiety_relief',
  'gratitude',
  'empowerment',
  'healing',
  'patience',
  'joy'
);

-- ============================================
-- TABELA: affirmations
-- ============================================
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  text TEXT NOT NULL,
  category affirmation_category NOT NULL,

  -- Segmentação
  recommended_for pregnancy_stage[],
  mood_contexts TEXT[], -- 'anxious', 'sad', 'tired', etc.

  -- Metadados
  author TEXT,
  source TEXT,
  is_active BOOLEAN DEFAULT TRUE,

  -- Estatísticas
  times_shown INTEGER DEFAULT 0,
  times_favorited INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: user_favorite_affirmations
-- ============================================
CREATE TABLE user_favorite_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  affirmation_id UUID NOT NULL REFERENCES affirmations(id) ON DELETE CASCADE,

  favorited_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,

  UNIQUE(user_id, affirmation_id)
);

-- ============================================
-- TABELA: user_daily_affirmations
-- ============================================
-- Registro de afirmações mostradas por dia
CREATE TABLE user_daily_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  affirmation_id UUID NOT NULL REFERENCES affirmations(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  shown_at TIMESTAMPTZ DEFAULT NOW(),

  -- Interação
  was_read BOOLEAN DEFAULT FALSE,
  was_shared BOOLEAN DEFAULT FALSE,
  reaction TEXT, -- 'loved', 'helpful', 'skip'

  UNIQUE(user_id, date)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_affirmations_category ON affirmations(category) WHERE is_active;
CREATE INDEX idx_affirmations_stage ON affirmations USING GIN(recommended_for) WHERE is_active;
CREATE INDEX idx_user_favorites ON user_favorite_affirmations(user_id);
CREATE INDEX idx_user_daily ON user_daily_affirmations(user_id, date DESC);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_affirmations ENABLE ROW LEVEL SECURITY;

-- Afirmações: todos podem ver
CREATE POLICY "Anyone can view affirmations"
  ON affirmations FOR SELECT
  USING (is_active = TRUE);

-- Favoritos
CREATE POLICY "Users can view own favorites"
  ON user_favorite_affirmations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON user_favorite_affirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON user_favorite_affirmations FOR DELETE
  USING (auth.uid() = user_id);

-- Daily affirmations
CREATE POLICY "Users can view own daily affirmations"
  ON user_daily_affirmations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can track daily affirmations"
  ON user_daily_affirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update daily affirmations"
  ON user_daily_affirmations FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES
-- ============================================

-- Função para obter afirmação do dia personalizada
CREATE OR REPLACE FUNCTION get_daily_affirmation(p_user_id UUID)
RETURNS affirmations AS $$
DECLARE
  v_affirmation affirmations;
  v_stage pregnancy_stage;
  v_mood_trend TEXT;
BEGIN
  -- Verificar se já tem afirmação de hoje
  SELECT a.* INTO v_affirmation
  FROM affirmations a
  JOIN user_daily_affirmations uda ON a.id = uda.affirmation_id
  WHERE uda.user_id = p_user_id AND uda.date = CURRENT_DATE;

  IF FOUND THEN
    RETURN v_affirmation;
  END IF;

  -- Pegar contexto da usuária
  SELECT stage INTO v_stage FROM profiles WHERE id = p_user_id;
  v_mood_trend := get_mood_trend(p_user_id);

  -- Selecionar afirmação baseada no contexto
  SELECT * INTO v_affirmation
  FROM affirmations
  WHERE is_active = TRUE
    AND (recommended_for IS NULL OR v_stage = ANY(recommended_for))
    AND id NOT IN (
      SELECT affirmation_id FROM user_daily_affirmations
      WHERE user_id = p_user_id AND date > CURRENT_DATE - 30
    )
  ORDER BY
    CASE
      WHEN v_mood_trend = 'declining' AND category IN ('anxiety_relief', 'strength', 'healing') THEN 0
      WHEN v_mood_trend = 'stable' AND category IN ('gratitude', 'joy') THEN 0
      ELSE 1
    END,
    random()
  LIMIT 1;

  -- Registrar
  IF v_affirmation.id IS NOT NULL THEN
    INSERT INTO user_daily_affirmations (user_id, affirmation_id, date)
    VALUES (p_user_id, v_affirmation.id, CURRENT_DATE)
    ON CONFLICT (user_id, date) DO NOTHING;

    UPDATE affirmations SET times_shown = times_shown + 1 WHERE id = v_affirmation.id;
  END IF;

  RETURN v_affirmation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED: 100+ Afirmações em Português
-- ============================================

-- AUTOAMOR (self_love)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Eu sou digna de amor e cuidado, especialmente de mim mesma.', 'self_love', '{trying,pregnant,postpartum}', '{anxious,sad}'),
('Meu corpo é meu lar e eu o trato com carinho.', 'self_love', '{trying,pregnant,postpartum}', '{tired}'),
('Eu me perdoo por não ser perfeita. Perfeição não existe.', 'self_love', '{trying,pregnant,postpartum}', '{overwhelmed}'),
('Eu mereço descanso, alegria e paz.', 'self_love', '{trying,pregnant,postpartum}', '{tired,stressed}'),
('Hoje eu escolho ser gentil comigo mesma.', 'self_love', '{trying,pregnant,postpartum}', NULL),
('Minha jornada é única e válida.', 'self_love', '{trying,pregnant,postpartum}', '{anxious}'),
('Eu sou suficiente exatamente como sou.', 'self_love', '{trying,pregnant,postpartum}', '{overwhelmed,sad}'),
('Permito-me sentir todas as emoções sem julgamento.', 'self_love', '{trying,pregnant,postpartum}', '{anxious,sad}'),
('Eu me amo incondicionalmente, em todos os meus dias.', 'self_love', '{trying,pregnant,postpartum}', NULL),
('Minha paz interior é minha prioridade.', 'self_love', '{trying,pregnant,postpartum}', '{stressed}');

-- FORÇA (strength)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Eu sou mais forte do que imagino.', 'strength', '{trying,pregnant,postpartum}', '{overwhelmed}'),
('Cada desafio me torna mais resiliente.', 'strength', '{trying,pregnant,postpartum}', '{stressed}'),
('Eu tenho a força necessária para este momento.', 'strength', '{pregnant,postpartum}', '{anxious}'),
('Meu corpo sabe o que fazer. Eu confio nele.', 'strength', '{pregnant}', '{anxious}'),
('Eu sou capaz de enfrentar o que vier.', 'strength', '{trying,pregnant,postpartum}', '{overwhelmed}'),
('Minha coragem é maior que meus medos.', 'strength', '{trying,pregnant,postpartum}', '{anxious}'),
('Eu superei 100% dos meus dias difíceis até aqui.', 'strength', '{trying,pregnant,postpartum}', '{sad,overwhelmed}'),
('Dentro de mim existe uma guerreira.', 'strength', '{trying,pregnant,postpartum}', NULL),
('Eu não desisto. Eu respiro e continuo.', 'strength', '{trying,pregnant,postpartum}', '{stressed}'),
('Minha força vem de dentro, e ela é infinita.', 'strength', '{trying,pregnant,postpartum}', NULL);

-- MATERNIDADE (motherhood)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Eu sou a mãe que meu bebê precisa.', 'motherhood', '{pregnant,postpartum}', '{anxious,overwhelmed}'),
('Não existe manual. Existe amor.', 'motherhood', '{postpartum}', '{overwhelmed}'),
('Cada dia estou aprendendo a ser mãe.', 'motherhood', '{postpartum}', NULL),
('O amor que sinto é meu maior guia.', 'motherhood', '{pregnant,postpartum}', NULL),
('Meu bebê me escolheu, e eu o escolhi.', 'motherhood', '{pregnant,postpartum}', '{anxious}'),
('Ser mãe imperfeita é ser mãe real.', 'motherhood', '{postpartum}', '{overwhelmed}'),
('Eu estou fazendo o meu melhor, e isso é suficiente.', 'motherhood', '{postpartum}', '{tired,overwhelmed}'),
('Cada momento com meu filho é precioso.', 'motherhood', '{postpartum}', NULL),
('A maternidade me transforma todos os dias.', 'motherhood', '{postpartum}', NULL),
('Eu sou a melhor versão de mãe que posso ser hoje.', 'motherhood', '{postpartum}', '{anxious}');

-- CORPO POSITIVO (body_positivity)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Meu corpo está criando vida. Isso é mágico.', 'body_positivity', '{pregnant}', NULL),
('Cada marca conta uma história de amor.', 'body_positivity', '{postpartum}', '{sad}'),
('Meu corpo merece gratidão, não crítica.', 'body_positivity', '{trying,pregnant,postpartum}', '{sad}'),
('Eu honro as mudanças do meu corpo.', 'body_positivity', '{pregnant,postpartum}', NULL),
('Meu corpo sabe crescer, parir e nutrir.', 'body_positivity', '{pregnant,postpartum}', '{anxious}'),
('Beleza não tem forma. Eu sou bela.', 'body_positivity', '{trying,pregnant,postpartum}', '{sad}'),
('Meu corpo é meu parceiro, não meu inimigo.', 'body_positivity', '{trying,pregnant,postpartum}', NULL),
('Eu agradeço por tudo que meu corpo faz por mim.', 'body_positivity', '{trying,pregnant,postpartum}', NULL),
('As mudanças são sinais de uma nova vida.', 'body_positivity', '{pregnant,postpartum}', NULL),
('Meu corpo é sagrado e merece respeito.', 'body_positivity', '{trying,pregnant,postpartum}', NULL);

-- ALÍVIO DE ANSIEDADE (anxiety_relief)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Este momento vai passar. Eu vou ficar bem.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious,stressed}'),
('Eu respiro fundo e solto o que não posso controlar.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('Minha ansiedade não define quem eu sou.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('Eu escolho paz em vez de preocupação.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious,stressed}'),
('Uma coisa de cada vez. Um dia de cada vez.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{overwhelmed}'),
('Eu não preciso ter todas as respostas agora.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('Posso sentir medo e ainda assim agir com coragem.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('Meus pensamentos são apenas pensamentos.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('Eu estou segura neste momento presente.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious}'),
('O futuro não precisa ser resolvido hoje.', 'anxiety_relief', '{trying,pregnant,postpartum}', '{anxious,stressed}');

-- GRATIDÃO (gratitude)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Eu sou grata por este novo dia.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Agradeço pelas pequenas alegrias de hoje.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Minha vida está cheia de bênçãos.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Sou grata pelo amor que me rodeia.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Cada respiração é um presente.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Agradeço ao meu corpo por tudo que faz.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('Sou grata pelas pessoas que me apoiam.', 'gratitude', '{trying,pregnant,postpartum}', NULL),
('A gratidão transforma minha perspectiva.', 'gratitude', '{trying,pregnant,postpartum}', '{sad}'),
('Hoje escolho ver o lado bom das coisas.', 'gratitude', '{trying,pregnant,postpartum}', '{sad}'),
('Sou grata por estar viva e crescendo.', 'gratitude', '{trying,pregnant,postpartum}', NULL);

-- EMPODERAMENTO (empowerment)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Minha voz importa. Minhas escolhas importam.', 'empowerment', '{trying,pregnant,postpartum}', NULL),
('Eu tenho o direito de pedir ajuda.', 'empowerment', '{trying,pregnant,postpartum}', '{overwhelmed}'),
('Eu defino meu próprio sucesso.', 'empowerment', '{trying,pregnant,postpartum}', NULL),
('Posso dizer não sem culpa.', 'empowerment', '{trying,pregnant,postpartum}', '{stressed}'),
('Meus limites são saudáveis e necessários.', 'empowerment', '{trying,pregnant,postpartum}', NULL),
('Eu sou a autora da minha história.', 'empowerment', '{trying,pregnant,postpartum}', NULL),
('Minhas necessidades são válidas.', 'empowerment', '{trying,pregnant,postpartum}', '{tired}'),
('Eu mereço ocupar espaço no mundo.', 'empowerment', '{trying,pregnant,postpartum}', NULL),
('Minha intuição é minha bússola.', 'empowerment', '{trying,pregnant,postpartum}', '{anxious}'),
('Eu confio nas minhas decisões.', 'empowerment', '{trying,pregnant,postpartum}', '{anxious}');

-- CURA (healing)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Cura leva tempo, e eu tenho paciência comigo.', 'healing', '{postpartum}', '{sad}'),
('Eu me permito sentir para poder curar.', 'healing', '{trying,pregnant,postpartum}', '{sad}'),
('Cada dia é uma nova chance de me recuperar.', 'healing', '{postpartum}', '{tired}'),
('Meu corpo está em processo de cura.', 'healing', '{postpartum}', NULL),
('A dor de hoje será força amanhã.', 'healing', '{trying,pregnant,postpartum}', '{sad}'),
('Eu libero o que não me serve mais.', 'healing', '{trying,pregnant,postpartum}', '{stressed}'),
('Permito que a luz entre nas minhas feridas.', 'healing', '{trying,pregnant,postpartum}', '{sad}'),
('Estou me tornando mais inteira a cada dia.', 'healing', '{trying,pregnant,postpartum}', NULL),
('A cura não é linear, e está tudo bem.', 'healing', '{postpartum}', '{sad}'),
('Eu me trato com a gentileza que daria a uma amiga.', 'healing', '{trying,pregnant,postpartum}', '{sad,tired}');

-- PACIÊNCIA (patience)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Tudo acontece no tempo certo.', 'patience', '{trying}', '{anxious}'),
('Eu confio no timing da vida.', 'patience', '{trying,pregnant}', '{anxious}'),
('Paciência é uma forma de amor próprio.', 'patience', '{trying,pregnant,postpartum}', NULL),
('Eu solto a pressa e abraço o presente.', 'patience', '{trying,pregnant,postpartum}', '{stressed}'),
('Cada etapa tem seu propósito.', 'patience', '{trying,pregnant,postpartum}', NULL),
('Eu estou exatamente onde deveria estar.', 'patience', '{trying,pregnant,postpartum}', '{anxious}'),
('A espera faz parte da jornada.', 'patience', '{trying}', '{anxious}'),
('Eu cultivo paz enquanto espero.', 'patience', '{trying}', NULL),
('Meu momento vai chegar.', 'patience', '{trying}', '{sad,anxious}'),
('Eu honro meu processo, mesmo quando é lento.', 'patience', '{trying,pregnant,postpartum}', NULL);

-- ALEGRIA (joy)
INSERT INTO affirmations (text, category, recommended_for, mood_contexts) VALUES
('Eu mereço momentos de alegria.', 'joy', '{trying,pregnant,postpartum}', '{sad}'),
('A felicidade está nos pequenos momentos.', 'joy', '{trying,pregnant,postpartum}', NULL),
('Eu permito que a alegria entre na minha vida.', 'joy', '{trying,pregnant,postpartum}', '{sad}'),
('Hoje eu escolho sorrir.', 'joy', '{trying,pregnant,postpartum}', NULL),
('Minha alegria não depende de perfeição.', 'joy', '{trying,pregnant,postpartum}', NULL),
('Eu celebro cada pequena vitória.', 'joy', '{trying,pregnant,postpartum}', NULL),
('A leveza é possível mesmo em dias difíceis.', 'joy', '{trying,pregnant,postpartum}', '{stressed}'),
('Eu me permito brincar e me divertir.', 'joy', '{trying,pregnant,postpartum}', NULL),
('A vida tem beleza esperando ser notada.', 'joy', '{trying,pregnant,postpartum}', '{sad}'),
('Hoje tem algo bom esperando por mim.', 'joy', '{trying,pregnant,postpartum}', NULL);

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE affirmations IS 'Banco de afirmações para bem-estar das usuárias';
COMMENT ON TABLE user_favorite_affirmations IS 'Afirmações salvas como favoritas';
COMMENT ON TABLE user_daily_affirmations IS 'Histórico de afirmações mostradas por dia';
COMMENT ON FUNCTION get_daily_affirmation IS 'Seleciona afirmação personalizada baseada no contexto da usuária';
