-- ============================================
-- NOSSA MATERNIDADE - Migration 003: Cycle & Daily Logs
-- ============================================
-- Tracking de ciclo menstrual e logs diários
-- CRÍTICO: Dados para contexto da NathIA
-- Análise sentimental e estado emocional
-- ============================================

-- ============================================
-- ENUMS para análise rica
-- ============================================

-- Humor detalhado para análise sentimental
CREATE TYPE mood_type AS ENUM (
  -- Positivos
  'happy', 'excited', 'grateful', 'peaceful', 'confident', 'energetic', 'hopeful', 'loving',
  -- Neutros
  'neutral', 'calm', 'tired', 'sleepy',
  -- Desafiadores
  'anxious', 'worried', 'sad', 'frustrated', 'overwhelmed', 'irritable', 'lonely', 'stressed',
  -- Específicos maternidade
  'hormonal', 'nesting', 'bonding', 'touched_out', 'mom_guilt', 'empowered'
);

-- Sintomas físicos
CREATE TYPE symptom_type AS ENUM (
  -- Comuns gravidez
  'nausea', 'fatigue', 'headache', 'backache', 'cramping', 'bloating',
  'breast_tenderness', 'mood_swings', 'food_cravings', 'food_aversions',
  -- Ciclo
  'spotting', 'heavy_flow', 'light_flow', 'pms',
  -- Pós-parto
  'postpartum_bleeding', 'breastfeeding_pain', 'night_sweats', 'hair_loss',
  -- Gerais
  'insomnia', 'dizziness', 'swelling', 'constipation', 'heartburn',
  'baby_movement', 'braxton_hicks', 'contractions'
);

-- Nível de fluxo menstrual
CREATE TYPE flow_level AS ENUM ('spotting', 'light', 'medium', 'heavy', 'very_heavy');

-- Atividade sexual
CREATE TYPE sex_activity_type AS ENUM ('protected', 'unprotected', 'none');

-- Nível de descarga
CREATE TYPE discharge_level AS ENUM ('none', 'light', 'medium', 'heavy', 'egg_white');

-- Energia level (1-5)
CREATE TYPE energy_level AS ENUM ('very_low', 'low', 'moderate', 'high', 'very_high');

-- ============================================
-- TABELA: cycle_settings
-- ============================================
-- Configurações do ciclo da usuária
CREATE TABLE cycle_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Configurações base
  cycle_length INTEGER DEFAULT 28 CHECK (cycle_length >= 21 AND cycle_length <= 45),
  period_length INTEGER DEFAULT 5 CHECK (period_length >= 2 AND period_length <= 10),
  last_period_start DATE,

  -- Fase atual (calculada)
  current_phase TEXT,

  -- Notificações
  notify_period_prediction BOOLEAN DEFAULT TRUE,
  notify_fertile_window BOOLEAN DEFAULT TRUE,
  notify_ovulation BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: cycle_logs
-- ============================================
-- Logs específicos do ciclo menstrual
CREATE TABLE cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  is_period BOOLEAN DEFAULT FALSE,
  flow flow_level,

  -- Sintomas (array para múltiplos)
  symptoms symptom_type[] DEFAULT '{}',

  -- Detecção de ovulação
  ovulation_test_positive BOOLEAN,
  cervical_mucus discharge_level,

  -- Notas
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- ============================================
-- TABELA: daily_logs (CONTEXTO RICO PARA IA)
-- ============================================
-- Log diário completo - BASE para análise sentimental
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,

  -- ============================================
  -- DADOS FÍSICOS
  -- ============================================
  temperature DECIMAL(4,2) CHECK (temperature >= 35 AND temperature <= 42),
  weight_kg DECIMAL(5,2) CHECK (weight_kg >= 30 AND weight_kg <= 200),
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  water_ml INTEGER CHECK (water_ml >= 0 AND water_ml <= 10000),
  exercise_minutes INTEGER DEFAULT 0,
  exercise_type TEXT,

  -- ============================================
  -- DADOS EMOCIONAIS (ANÁLISE SENTIMENTAL)
  -- ============================================
  -- Humor principal (1-5 escala)
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),

  -- Humores detalhados (array para múltiplos sentimentos)
  moods mood_type[] DEFAULT '{}',

  -- Nível de energia
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 5),

  -- Nível de estresse
  stress_score INTEGER CHECK (stress_score >= 1 AND stress_score <= 5),

  -- Nível de ansiedade
  anxiety_score INTEGER CHECK (anxiety_score >= 1 AND anxiety_score <= 5),

  -- Sentimento geral em texto livre (para NLP)
  feeling_description TEXT,

  -- ============================================
  -- DADOS DE SAÚDE
  -- ============================================
  symptoms symptom_type[] DEFAULT '{}',
  medications TEXT[],
  supplements TEXT[],

  -- Específicos maternidade
  sex_activity sex_activity_type,
  discharge discharge_level,

  -- Bebê (pós-parto)
  baby_sleep_hours DECIMAL(3,1),
  breastfeeding_count INTEGER,
  pumping_ml INTEGER,
  baby_mood TEXT,

  -- ============================================
  -- NOTAS E CONTEXTO
  -- ============================================
  notes TEXT,
  gratitude_notes TEXT[],
  highlights TEXT[],
  challenges TEXT[],

  -- Tags para categorização
  tags TEXT[] DEFAULT '{}',

  -- ============================================
  -- METADADOS
  -- ============================================
  -- Análise sentimental computada
  sentiment_score DECIMAL(3,2), -- -1.0 a 1.0 (negativo a positivo)
  sentiment_magnitude DECIMAL(3,2), -- 0 a 1.0 (intensidade)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- ============================================
-- TABELA: weight_logs
-- ============================================
-- Histórico de peso (importante para gravidez)
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_cycle_logs_user_date ON cycle_logs(user_id, date DESC);
CREATE INDEX idx_cycle_logs_period ON cycle_logs(user_id, is_period) WHERE is_period = TRUE;

CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, date DESC);
CREATE INDEX idx_daily_logs_mood ON daily_logs(user_id, mood_score) WHERE mood_score IS NOT NULL;
CREATE INDEX idx_daily_logs_sentiment ON daily_logs(user_id, sentiment_score) WHERE sentiment_score IS NOT NULL;

CREATE INDEX idx_weight_logs_user_date ON weight_logs(user_id, date DESC);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER trigger_cycle_settings_updated_at
  BEFORE UPDATE ON cycle_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cycle_logs_updated_at
  BEFORE UPDATE ON cycle_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE cycle_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Cycle Settings
CREATE POLICY "Users can view own cycle settings"
  ON cycle_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycle settings"
  ON cycle_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle settings"
  ON cycle_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cycle Logs
CREATE POLICY "Users can view own cycle logs"
  ON cycle_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycle logs"
  ON cycle_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle logs"
  ON cycle_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycle logs"
  ON cycle_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Logs
CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Weight Logs
CREATE POLICY "Users can view own weight logs"
  ON weight_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs"
  ON weight_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs"
  ON weight_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES AUXILIARES PARA IA
-- ============================================

-- Função para calcular média de humor dos últimos N dias
CREATE OR REPLACE FUNCTION get_mood_average(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(mood_score), 0)
  FROM daily_logs
  WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - p_days
    AND mood_score IS NOT NULL;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função para obter tendência de humor
CREATE OR REPLACE FUNCTION get_mood_trend(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  avg_last_week DECIMAL;
  avg_prev_week DECIMAL;
BEGIN
  SELECT AVG(mood_score) INTO avg_last_week
  FROM daily_logs
  WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - 7
    AND mood_score IS NOT NULL;

  SELECT AVG(mood_score) INTO avg_prev_week
  FROM daily_logs
  WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - 14
    AND date < CURRENT_DATE - 7
    AND mood_score IS NOT NULL;

  IF avg_last_week IS NULL OR avg_prev_week IS NULL THEN
    RETURN 'insufficient_data';
  ELSIF avg_last_week > avg_prev_week + 0.5 THEN
    RETURN 'improving';
  ELSIF avg_last_week < avg_prev_week - 0.5 THEN
    RETURN 'declining';
  ELSE
    RETURN 'stable';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE cycle_logs IS 'Logs do ciclo menstrual';
COMMENT ON TABLE daily_logs IS 'Logs diários completos - BASE para análise sentimental da NathIA';
COMMENT ON COLUMN daily_logs.mood_score IS 'Humor 1-5 (1=muito mal, 5=ótimo)';
COMMENT ON COLUMN daily_logs.moods IS 'Array de humores detalhados para análise sentimental';
COMMENT ON COLUMN daily_logs.feeling_description IS 'Texto livre para NLP e análise sentimental';
COMMENT ON COLUMN daily_logs.sentiment_score IS 'Score computado de sentimento (-1 a 1)';
COMMENT ON FUNCTION get_mood_trend IS 'Retorna tendência de humor: improving, stable, declining';
