-- ============================================
-- NOSSA MATERNIDADE - Migration 004: Habits & Check-ins
-- ============================================
-- Sistema de hábitos e check-ins diários
-- CONTEXTO IMPORTANTE para NathIA
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

-- Categoria de hábito
CREATE TYPE habit_category AS ENUM (
  'self_care',
  'health',
  'mindfulness',
  'connection',
  'growth',
  'nutrition',
  'movement',
  'rest'
);

-- Frequência do hábito
CREATE TYPE habit_frequency AS ENUM (
  'daily',
  'weekly',
  'custom'
);

-- ============================================
-- TABELA: habits (definição de hábitos)
-- ============================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Dados do hábito
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'checkmark-circle',
  color TEXT DEFAULT '#E11D48',
  category habit_category DEFAULT 'self_care',

  -- Configuração de frequência
  frequency habit_frequency DEFAULT 'daily',
  target_days INTEGER[] DEFAULT '{1,2,3,4,5,6,0}', -- 0=domingo, 1=segunda...
  target_count INTEGER DEFAULT 1, -- vezes por dia/semana

  -- Estatísticas (desnormalizadas para performance)
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  last_completed_at TIMESTAMPTZ,

  -- Ordenação
  sort_order INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE, -- hábitos padrão do app

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: habit_completions
-- ============================================
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Notas opcionais
  notes TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),

  UNIQUE(habit_id, date)
);

-- ============================================
-- TABELA: daily_check_ins (CHECK-IN DIÁRIO)
-- ============================================
-- Check-in rápido de humor/energia/sono
-- ESSENCIAL para contexto da NathIA
CREATE TABLE daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,

  -- Scores (1-5)
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 5),
  sleep_score INTEGER CHECK (sleep_score >= 1 AND sleep_score <= 5),

  -- Detalhes opcionais
  sleep_hours DECIMAL(3,1),
  wake_ups INTEGER,

  -- Estado emocional em palavras (para NLP)
  how_feeling TEXT,
  top_emotion TEXT,

  -- O que mais importa hoje
  today_priority TEXT,
  today_intention TEXT,

  -- Notas livres
  notes TEXT,
  gratitude TEXT[],

  -- Metadados de análise
  check_in_time TIME,
  completed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- ============================================
-- TABELA: user_streaks (streaks gerais)
-- ============================================
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  streak_type TEXT NOT NULL, -- 'check_in', 'all_habits', 'specific_habit:{id}'
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, streak_type)
);

-- ============================================
-- TABELA: habit_templates (templates padrão)
-- ============================================
CREATE TABLE habit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  category habit_category,

  -- Segmentação
  recommended_for pregnancy_stage[],
  sort_order INTEGER DEFAULT 0,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_habits_user ON habits(user_id) WHERE is_active;
CREATE INDEX idx_habits_category ON habits(user_id, category);

CREATE INDEX idx_habit_completions_habit ON habit_completions(habit_id, date DESC);
CREATE INDEX idx_habit_completions_user_date ON habit_completions(user_id, date DESC);

CREATE INDEX idx_daily_check_ins_user ON daily_check_ins(user_id, date DESC);
CREATE INDEX idx_daily_check_ins_mood ON daily_check_ins(user_id, mood_score) WHERE mood_score IS NOT NULL;

CREATE INDEX idx_user_streaks_user ON user_streaks(user_id, streak_type);

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar streak quando hábito é completado
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  yesterday DATE := CURRENT_DATE - 1;
  last_completion DATE;
BEGIN
  -- Pegar última completion antes de hoje
  SELECT MAX(date) INTO last_completion
  FROM habit_completions
  WHERE habit_id = NEW.habit_id
    AND date < NEW.date;

  -- Atualizar streak
  IF last_completion = yesterday OR last_completion IS NULL THEN
    -- Continua ou inicia streak
    UPDATE habits SET
      current_streak = CASE
        WHEN last_completion = yesterday THEN current_streak + 1
        ELSE 1
      END,
      best_streak = GREATEST(best_streak, current_streak + 1),
      total_completions = total_completions + 1,
      last_completed_at = NEW.completed_at,
      updated_at = NOW()
    WHERE id = NEW.habit_id;
  ELSE
    -- Quebrou streak, reinicia
    UPDATE habits SET
      current_streak = 1,
      total_completions = total_completions + 1,
      last_completed_at = NEW.completed_at,
      updated_at = NOW()
    WHERE id = NEW.habit_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_habit_completion_streak
  AFTER INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();

-- Trigger updated_at
CREATE TRIGGER trigger_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_daily_check_ins_updated_at
  BEFORE UPDATE ON daily_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_templates ENABLE ROW LEVEL SECURITY;

-- Habits
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Habit Completions
CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Check-ins
CREATE POLICY "Users can view own check-ins"
  ON daily_check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create check-ins"
  ON daily_check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON daily_check_ins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Streaks
CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks"
  ON user_streaks FOR ALL
  USING (auth.uid() = user_id);

-- Habit Templates (público, read-only)
CREATE POLICY "Anyone can view habit templates"
  ON habit_templates FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- SEED: Habit Templates Padrão
-- ============================================
INSERT INTO habit_templates (title, description, icon, color, category, recommended_for, sort_order) VALUES
('Hidratar o corpo', 'Beba 2L de água ao longo do dia', 'water', '#60A5FA', 'health', '{trying,pregnant,postpartum}', 1),
('Momento de gratidão', 'Escreva 3 coisas pelas quais é grata', 'heart', '#F472B6', 'mindfulness', '{trying,pregnant,postpartum}', 2),
('Movimento consciente', '30 minutos de atividade que ama', 'fitness', '#A78BFA', 'movement', '{trying,pregnant,postpartum}', 3),
('Autocuidado', 'Skincare, cuidados pessoais', 'sparkles', '#F59E0B', 'self_care', '{trying,pregnant,postpartum}', 4),
('Meditação e respiro', '10 minutos de paz interior', 'leaf', '#6BAD78', 'mindfulness', '{trying,pregnant,postpartum}', 5),
('Sono reparador', 'Durma 7-8 horas de qualidade', 'moon', '#818CF8', 'rest', '{trying,pregnant,postpartum}', 6),
('Conexão amorosa', 'Tempo de qualidade com quem ama', 'people', '#EC4899', 'connection', '{trying,pregnant,postpartum}', 7),
('Leitura inspiradora', '15 minutos de leitura', 'book', '#14B8A6', 'growth', '{trying,pregnant,postpartum}', 8),
('Vitaminas do dia', 'Tomar suplementos prescritos', 'medical', '#10B981', 'health', '{trying,pregnant}', 9),
('Alimentação nutritiva', 'Comer frutas e vegetais', 'nutrition', '#84CC16', 'nutrition', '{pregnant,postpartum}', 10);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar hábitos de hoje
CREATE OR REPLACE FUNCTION get_today_habit_status(p_user_id UUID)
RETURNS TABLE (
  habit_id UUID,
  habit_title TEXT,
  is_completed BOOLEAN
) AS $$
  SELECT
    h.id as habit_id,
    h.title as habit_title,
    EXISTS(
      SELECT 1 FROM habit_completions hc
      WHERE hc.habit_id = h.id AND hc.date = CURRENT_DATE
    ) as is_completed
  FROM habits h
  WHERE h.user_id = p_user_id
    AND h.is_active = TRUE
  ORDER BY h.sort_order;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função para obter resumo semanal de hábitos
CREATE OR REPLACE FUNCTION get_weekly_habit_summary(p_user_id UUID)
RETURNS TABLE (
  total_habits INTEGER,
  completed_this_week INTEGER,
  completion_rate DECIMAL
) AS $$
DECLARE
  week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT h.id)::INTEGER as total_habits,
    COUNT(DISTINCT hc.id)::INTEGER as completed_this_week,
    CASE
      WHEN COUNT(DISTINCT h.id) > 0 THEN
        ROUND(COUNT(DISTINCT hc.id)::DECIMAL / (COUNT(DISTINCT h.id) * 7) * 100, 1)
      ELSE 0
    END as completion_rate
  FROM habits h
  LEFT JOIN habit_completions hc ON h.id = hc.habit_id
    AND hc.date >= week_start
  WHERE h.user_id = p_user_id
    AND h.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE habits IS 'Hábitos de bem-estar das usuárias';
COMMENT ON TABLE habit_completions IS 'Registro de hábitos completados';
COMMENT ON TABLE daily_check_ins IS 'Check-in diário de humor/energia/sono - CONTEXTO PARA NATHIA';
COMMENT ON COLUMN daily_check_ins.how_feeling IS 'Texto livre para NLP - como está se sentindo';
COMMENT ON COLUMN daily_check_ins.today_intention IS 'Intenção do dia - contexto para IA';
