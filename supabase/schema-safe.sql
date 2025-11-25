-- ============================================
-- NOSSA MATERNIDADE - SAFE MIGRATION SCRIPT
-- Pode ser executado múltiplas vezes sem erros
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  motherhood_stage TEXT CHECK (motherhood_stage IN (
    'trying_to_conceive', 'pregnant', 'postpartum', 'experienced_mother'
  )),
  pregnancy_week INTEGER,
  baby_birth_date DATE,
  baby_name TEXT,
  baby_gender TEXT CHECK (baby_gender IN ('male', 'female', 'unknown', 'prefer_not_say')),
  emotions JSONB DEFAULT '[]'::jsonb,
  needs JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "Usuárias podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuárias podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Perfis são criados automaticamente" ON public.profiles;

CREATE POLICY "Usuárias podem ver seu próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuárias podem atualizar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Perfis são criados automaticamente" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- TABELA: chat_conversations
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  model TEXT DEFAULT 'gemini-pro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: chat_messages
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuárias veem suas próprias conversas" ON public.chat_conversations;
DROP POLICY IF EXISTS "Usuárias veem mensagens de suas conversas" ON public.chat_messages;

CREATE POLICY "Usuárias veem suas próprias conversas" ON public.chat_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuárias veem mensagens de suas conversas" ON public.chat_messages FOR ALL
  USING (conversation_id IN (SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()));

-- ============================================
-- TABELA: content_items
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'audio', 'article', 'reels')),
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  duration INTEGER,
  author_name TEXT,
  author_avatar_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_premium BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: user_content_interactions
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_content_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
  is_liked BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  progress_seconds INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Conteúdos publicados são visíveis para todos" ON public.content_items;
DROP POLICY IF EXISTS "Usuárias gerenciam suas próprias interações" ON public.user_content_interactions;

CREATE POLICY "Conteúdos publicados são visíveis para todos" ON public.content_items FOR SELECT USING (is_published = true);
CREATE POLICY "Usuárias gerenciam suas próprias interações" ON public.user_content_interactions FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TABELA: habits
-- ============================================
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  category TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: user_habits
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  custom_name TEXT,
  custom_target INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, habit_id)
);

-- ============================================
-- TABELA: habit_logs
-- ============================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_habit_id UUID REFERENCES public.user_habits(id) ON DELETE CASCADE NOT NULL,
  completed_at DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_habit_id, completed_at)
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hábitos são visíveis para todos" ON public.habits;
DROP POLICY IF EXISTS "Usuárias gerenciam seus próprios hábitos" ON public.user_habits;
DROP POLICY IF EXISTS "Usuárias gerenciam seus próprios logs" ON public.habit_logs;

CREATE POLICY "Hábitos são visíveis para todos" ON public.habits FOR SELECT USING (true);
CREATE POLICY "Usuárias gerenciam seus próprios hábitos" ON public.user_habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuárias gerenciam seus próprios logs" ON public.habit_logs FOR ALL
  USING (user_habit_id IN (SELECT id FROM public.user_habits WHERE user_id = auth.uid()));

-- ============================================
-- TABELA: community_posts
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_reported BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: community_comments
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: community_likes
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- Add unique constraints if they don't exist (workaround)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_user_id_post_id_key') THEN
    ALTER TABLE public.community_likes ADD CONSTRAINT community_likes_user_id_post_id_key UNIQUE (user_id, post_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_user_id_comment_id_key') THEN
    ALTER TABLE public.community_likes ADD CONSTRAINT community_likes_user_id_comment_id_key UNIQUE (user_id, comment_id);
  END IF;
END $$;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts aprovados são visíveis para todos" ON public.community_posts;
DROP POLICY IF EXISTS "Usuárias podem criar posts" ON public.community_posts;
DROP POLICY IF EXISTS "Usuárias podem editar seus próprios posts" ON public.community_posts;
DROP POLICY IF EXISTS "Comentários são visíveis para todos" ON public.community_comments;
DROP POLICY IF EXISTS "Usuárias podem comentar" ON public.community_comments;
DROP POLICY IF EXISTS "Usuárias gerenciam suas curtidas" ON public.community_likes;

CREATE POLICY "Posts aprovados são visíveis para todos" ON public.community_posts FOR SELECT USING (is_approved = true);
CREATE POLICY "Usuárias podem criar posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuárias podem editar seus próprios posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Comentários são visíveis para todos" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Usuárias podem comentar" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuárias gerenciam suas curtidas" ON public.community_likes FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TABELA: baby_milestones
-- ============================================
CREATE TABLE IF NOT EXISTS public.baby_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('motor', 'cognitivo', 'linguagem', 'social', 'sensorial')),
  age_months INTEGER NOT NULL,
  tips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: user_baby_milestones
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_baby_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES public.baby_milestones(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

ALTER TABLE public.baby_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_baby_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Milestones são visíveis para todos" ON public.baby_milestones;
DROP POLICY IF EXISTS "Usuárias gerenciam progresso de seus bebês" ON public.user_baby_milestones;

CREATE POLICY "Milestones são visíveis para todos" ON public.baby_milestones FOR SELECT USING (true);
CREATE POLICY "Usuárias gerenciam progresso de seus bebês" ON public.user_baby_milestones FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON public.chat_conversations;
DROP TRIGGER IF EXISTS update_content_items_updated_at ON public.content_items;
DROP TRIGGER IF EXISTS update_user_content_interactions_updated_at ON public.user_content_interactions;
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
DROP TRIGGER IF EXISTS update_community_comments_updated_at ON public.community_comments;
DROP TRIGGER IF EXISTS update_user_baby_milestones_updated_at ON public.user_baby_milestones;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_content_interactions_updated_at BEFORE UPDATE ON public.user_content_interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON public.community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_baby_milestones_updated_at BEFORE UPDATE ON public.user_baby_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO: Criar perfil automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ÍNDICES (IF NOT EXISTS)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON public.content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON public.content_items(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_user_id ON public.user_content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_habits_user_id ON public.user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_habit_id ON public.habit_logs(user_habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON public.habit_logs(completed_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON public.community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_comment_id ON public.community_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_baby_milestones_age_months ON public.baby_milestones(age_months);
CREATE INDEX IF NOT EXISTS idx_user_baby_milestones_user_id ON public.user_baby_milestones(user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('community', 'community', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies (safe drop and create)
DROP POLICY IF EXISTS "Avatares são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuárias podem fazer upload de avatares" ON storage.objects;
DROP POLICY IF EXISTS "Conteúdos são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Posts da comunidade são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuárias podem fazer upload em posts" ON storage.objects;

CREATE POLICY "Avatares são públicos" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Usuárias podem fazer upload de avatares" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Conteúdos são públicos" ON storage.objects FOR SELECT USING (bucket_id = 'content');
CREATE POLICY "Posts da comunidade são públicos" ON storage.objects FOR SELECT USING (bucket_id = 'community');
CREATE POLICY "Usuárias podem fazer upload em posts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'community' AND auth.role() = 'authenticated');

-- ============================================
-- FIM DO SCRIPT SEGURO
-- ============================================
SELECT 'Schema aplicado com sucesso!' AS resultado;
