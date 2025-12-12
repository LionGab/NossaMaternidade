-- ============================================
-- NOSSA MATERNIDADE - Migration 001: Profiles
-- ============================================
-- Tabela principal de perfis de usuário
-- Sincronizada com auth.users via trigger
-- ============================================

-- Enum para estágio da gravidez
CREATE TYPE pregnancy_stage AS ENUM ('trying', 'pregnant', 'postpartum');

-- Enum para interesses
CREATE TYPE user_interest AS ENUM (
  'nutrition',
  'exercise',
  'mental_health',
  'baby_care',
  'breastfeeding',
  'sleep',
  'relationships',
  'career'
);

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados básicos
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,

  -- Dados de maternidade
  stage pregnancy_stage DEFAULT 'trying',
  due_date DATE,
  baby_birth_date DATE,
  interests user_interest[] DEFAULT '{}',

  -- Dados de onboarding
  age INTEGER CHECK (age >= 13 AND age <= 100),
  location TEXT,
  goals TEXT[],
  challenges TEXT[],
  support_network TEXT[],
  communication_preference TEXT DEFAULT 'friendly',

  -- Metadados
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  has_accepted_terms BOOLEAN DEFAULT FALSE,
  has_accepted_ai_terms BOOLEAN DEFAULT FALSE,

  -- LGPD: soft delete
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_profiles_stage ON profiles(stage) WHERE NOT is_deleted;
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_onboarding ON profiles(has_completed_onboarding) WHERE NOT is_deleted;

-- ============================================
-- TRIGGER: Atualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Criar perfil quando user se registra
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuária'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id AND NOT is_deleted);

-- Usuário pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id AND NOT is_deleted)
  WITH CHECK (auth.uid() = id);

-- Usuário pode ver perfis públicos (para comunidade)
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (
    NOT is_deleted
    AND has_completed_onboarding = TRUE
    AND auth.uid() IS NOT NULL
  );

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE profiles IS 'Perfis de usuárias do Nossa Maternidade';
COMMENT ON COLUMN profiles.stage IS 'Estágio: tentando, grávida ou pós-parto';
COMMENT ON COLUMN profiles.is_deleted IS 'Soft delete para LGPD compliance';
