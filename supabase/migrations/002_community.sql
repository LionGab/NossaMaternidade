-- ============================================
-- NOSSA MATERNIDADE - Migration 002: Community
-- ============================================
-- Posts, comentários, grupos e likes
-- Sistema de comunidade para mães
-- ============================================

-- Enum para categoria de grupo
CREATE TYPE group_category AS ENUM (
  'first_time_moms',
  'experienced_moms',
  'trying_to_conceive',
  'pregnancy',
  'postpartum',
  'breastfeeding',
  'twins',
  'special_needs',
  'single_moms',
  'career_moms',
  'fitness',
  'mental_health',
  'recipes',
  'general'
);

-- Enum para tipo de post
CREATE TYPE post_type AS ENUM (
  'text',
  'image',
  'poll',
  'question',
  'announcement',
  'milestone'
);

-- ============================================
-- TABELA: community_groups
-- ============================================
CREATE TABLE community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  description TEXT,
  category group_category DEFAULT 'general',
  image_url TEXT,

  -- Configurações
  is_private BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT FALSE,

  -- Contadores (desnormalizados para performance)
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,

  -- Metadados
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: group_members
-- ============================================
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(group_id, user_id)
);

-- ============================================
-- TABELA: community_posts
-- ============================================
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES community_groups(id) ON DELETE SET NULL,

  -- Conteúdo
  content TEXT NOT NULL CHECK (char_length(content) <= 5000),
  image_url TEXT,
  type post_type DEFAULT 'text',

  -- Contadores (desnormalizados para performance)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Moderação
  is_pinned BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_reason TEXT,

  -- Soft delete
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: post_likes
-- ============================================
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(post_id, user_id)
);

-- ============================================
-- TABELA: community_comments
-- ============================================
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,

  content TEXT NOT NULL CHECK (char_length(content) <= 2000),

  -- Contadores
  likes_count INTEGER DEFAULT 0,

  -- Soft delete
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: comment_likes
-- ============================================
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  comment_id UUID NOT NULL REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(comment_id, user_id)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_group ON community_posts(group_id);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC) WHERE NOT is_deleted;
CREATE INDEX idx_posts_pinned ON community_posts(is_pinned, created_at DESC) WHERE NOT is_deleted;

CREATE INDEX idx_comments_post ON community_comments(post_id);
CREATE INDEX idx_comments_created_at ON community_comments(created_at DESC) WHERE NOT is_deleted;

CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- ============================================
-- TRIGGERS: Atualizar contadores
-- ============================================
-- Trigger para atualizar likes_count em posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Trigger para atualizar comments_count em posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comments_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- Trigger para atualizar member_count em grupos
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_group_member_count
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Grupos: todos autenticados podem ver grupos públicos
CREATE POLICY "Anyone can view public groups"
  ON community_groups FOR SELECT
  USING (NOT is_private OR auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = id
  ));

-- Grupos: criador pode editar
CREATE POLICY "Creator can update group"
  ON community_groups FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Membros: usuário pode ver suas participações
CREATE POLICY "Users can view own memberships"
  ON group_members FOR SELECT
  USING (auth.uid() = user_id);

-- Membros: usuário pode entrar em grupo
CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Membros: usuário pode sair de grupo
CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  USING (auth.uid() = user_id);

-- Posts: todos autenticados podem ver posts públicos
CREATE POLICY "Users can view posts"
  ON community_posts FOR SELECT
  USING (
    NOT is_deleted
    AND NOT is_hidden
    AND auth.uid() IS NOT NULL
  );

-- Posts: usuário pode criar posts
CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Posts: autor pode editar
CREATE POLICY "Authors can update own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = author_id AND NOT is_deleted)
  WITH CHECK (auth.uid() = author_id);

-- Posts: autor pode deletar (soft delete)
CREATE POLICY "Authors can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Likes: usuário pode ver likes
CREATE POLICY "Users can view likes"
  ON post_likes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Likes: usuário pode dar like
CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Likes: usuário pode remover like
CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários: todos autenticados podem ver
CREATE POLICY "Users can view comments"
  ON community_comments FOR SELECT
  USING (NOT is_deleted AND auth.uid() IS NOT NULL);

-- Comentários: usuário pode criar
CREATE POLICY "Users can create comments"
  ON community_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Comentários: autor pode editar
CREATE POLICY "Authors can update own comments"
  ON community_comments FOR UPDATE
  USING (auth.uid() = author_id AND NOT is_deleted)
  WITH CHECK (auth.uid() = author_id);

-- Comment likes
CREATE POLICY "Users can view comment likes"
  ON comment_likes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE community_posts IS 'Posts da comunidade de mães';
COMMENT ON TABLE community_comments IS 'Comentários nos posts';
COMMENT ON TABLE community_groups IS 'Grupos temáticos da comunidade';
COMMENT ON TABLE post_likes IS 'Likes nos posts (tabela de junção)';
