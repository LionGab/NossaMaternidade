-- ============================================
-- NOSSA MATERNIDADE - Migration 010: Notification Triggers
-- ============================================
-- Sistema de triggers para notificações automáticas
-- Implementa PROMPT 3.2 (Templates) e 3.3 (Triggers)
-- ============================================

-- ============================================
-- PARTE 1: SISTEMA DE TEMPLATES
-- ============================================

-- Tabela de templates (i18n ready - futuro suporte a pt-BR/en)
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificador único do template
  template_key TEXT NOT NULL UNIQUE,

  -- Idioma (default pt-BR)
  language TEXT DEFAULT 'pt-BR',

  -- Template strings com placeholders {{variavel}}
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,

  -- Metadados
  category TEXT NOT NULL, -- 'community', 'habit', 'cycle', 'general'
  description TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(template_key, language)
);

-- ============================================
-- SEED: Templates Padrão (pt-BR)
-- ============================================
INSERT INTO notification_templates (template_key, language, title_template, body_template, category, description) VALUES
-- 1. Novo comentário
('community_comment', 'pt-BR',
 'Novo comentário no seu post',
 '{{author_name}} comentou: {{comment_preview}}',
 'community',
 'Notifica autor do post quando recebe comentário'),

-- 2. Novo like (threshold de 5 likes)
('community_like', 'pt-BR',
 'Seu post está fazendo sucesso! 💕',
 '{{like_count}} pessoas curtiram o seu post',
 'community',
 'Notifica após 5+ likes (evita spam)'),

-- 3. Múltiplos likes (threshold 10, 25, 50, 100)
('community_like_milestone', 'pt-BR',
 'Parabéns! Seu post bombou! 🎉',
 'Você atingiu {{like_count}} curtidas no seu post!',
 'community',
 'Marcos de likes (10, 25, 50, 100+)'),

-- 4. Lembrete de hábito
('habit_reminder', 'pt-BR',
 'Hora do seu {{habit_name}} ✨',
 'Não esqueça de registrar hoje!',
 'habit',
 'Lembrete diário de hábito'),

-- 5. Parabéns por hábito completado
('habit_streak', 'pt-BR',
 'Sequência incrível! 🔥',
 '{{streak_count}} dias seguidos de {{habit_name}}. Continue assim!',
 'habit',
 'Celebra streaks de hábitos'),

-- 6. Atualização de ciclo - período chegando
('cycle_period_coming', 'pt-BR',
 'Seu período está chegando',
 'Estimativa: em {{days_until}} dias. Está tudo pronto? 🌸',
 'cycle',
 'Aviso 3 dias antes do período'),

-- 7. Atualização de ciclo - fase fértil
('cycle_fertile_window', 'pt-BR',
 'Você está na janela fértil',
 'Dias {{fertile_start}} a {{fertile_end}} do seu ciclo 💖',
 'cycle',
 'Notifica início da janela fértil'),

-- 8. Nova mensagem em grupo
('community_group_post', 'pt-BR',
 'Nova mensagem em {{group_name}}',
 '{{author_name}}: {{post_preview}}',
 'community',
 'Notifica membros de grupo sobre novo post'),

-- 9. Boas-vindas ao grupo
('community_group_welcome', 'pt-BR',
 'Bem-vinda ao {{group_name}}! 💕',
 'Você agora faz parte desta comunidade incrível',
 'community',
 'Mensagem de boas-vindas ao entrar em grupo'),

-- 10. Check-in diário
('daily_check_in_reminder', 'pt-BR',
 'Como você está hoje? 🌸',
 'Reserve um momento para o seu check-in diário',
 'general',
 'Lembrete de check-in diário'),

-- 11. Afirmação diária
('daily_affirmation', 'pt-BR',
 'Sua afirmação do dia chegou ✨',
 '{{affirmation_text}}',
 'general',
 'Afirmação diária');

-- ============================================
-- PARTE 2: FUNÇÃO DE INTERPOLAÇÃO
-- ============================================

-- Função para interpolar variáveis no template
CREATE OR REPLACE FUNCTION interpolate_template(
  p_template TEXT,
  p_data JSONB
)
RETURNS TEXT AS $$
DECLARE
  v_result TEXT := p_template;
  v_key TEXT;
  v_value TEXT;
BEGIN
  -- Percorrer todas as chaves do JSON
  FOR v_key, v_value IN SELECT * FROM jsonb_each_text(p_data) LOOP
    -- Substituir {{key}} pelo valor
    v_result := replace(v_result, '{{' || v_key || '}}', v_value);
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função principal para gerar notificação a partir de template
CREATE OR REPLACE FUNCTION get_notification_from_template(
  p_template_key TEXT,
  p_data JSONB,
  p_language TEXT DEFAULT 'pt-BR'
)
RETURNS TABLE (
  title TEXT,
  body TEXT,
  template_key TEXT
) AS $$
DECLARE
  v_template RECORD;
BEGIN
  -- Buscar template
  SELECT * INTO v_template
  FROM notification_templates
  WHERE template_key = p_template_key
    AND language = p_language
    AND is_active = TRUE
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found: %', p_template_key;
  END IF;

  -- Retornar título e corpo interpolados
  RETURN QUERY SELECT
    interpolate_template(v_template.title_template, p_data),
    interpolate_template(v_template.body_template, p_data),
    v_template.template_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 3: FUNÇÃO HTTP CALL PARA EDGE FUNCTION
-- ============================================

-- Função para chamar Edge Function /notifications/send
CREATE OR REPLACE FUNCTION send_notification_via_edge(
  p_user_id UUID,
  p_notification_type TEXT,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT '{}'::JSONB
)
RETURNS void AS $$
DECLARE
  v_supabase_url TEXT := current_setting('app.settings.supabase_url', true);
  v_service_key TEXT := current_setting('app.settings.service_role_key', true);
  v_request_id BIGINT;
BEGIN
  -- Queue notification instead of direct HTTP call
  -- Reasoning: Direct HTTP from trigger can cause blocking + failures
  -- Queue is processed by cron job /notifications/process-queue

  INSERT INTO notification_queue (
    user_id,
    notification_type,
    title,
    body,
    data,
    priority,
    scheduled_for
  ) VALUES (
    p_user_id,
    p_notification_type,
    p_title,
    p_body,
    p_data,
    5, -- Default priority
    NOW()
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Failed to queue notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 4: TRIGGERS PARA COMMUNITY
-- ============================================

-- TRIGGER 1: Novo comentário → notificar autor do post
CREATE OR REPLACE FUNCTION notify_on_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author UUID;
  v_author_name TEXT;
  v_comment_preview TEXT;
  v_notification RECORD;
BEGIN
  -- Não notificar se autor comentou no próprio post
  SELECT author_id INTO v_post_author
  FROM community_posts
  WHERE id = NEW.post_id;

  IF v_post_author = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Buscar nome do autor do comentário
  SELECT name INTO v_author_name
  FROM profiles
  WHERE id = NEW.author_id;

  -- Preview do comentário (primeiros 50 chars)
  v_comment_preview := LEFT(NEW.content, 50);
  IF LENGTH(NEW.content) > 50 THEN
    v_comment_preview := v_comment_preview || '...';
  END IF;

  -- Gerar notificação do template
  SELECT * INTO v_notification
  FROM get_notification_from_template(
    'community_comment',
    jsonb_build_object(
      'author_name', v_author_name,
      'comment_preview', v_comment_preview
    )
  );

  -- Enviar notificação
  PERFORM send_notification_via_edge(
    v_post_author,
    'community_comment',
    v_notification.title,
    v_notification.body,
    jsonb_build_object(
      'post_id', NEW.post_id,
      'comment_id', NEW.id,
      'author_id', NEW.author_id
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_comment
  AFTER INSERT ON community_comments
  FOR EACH ROW
  WHEN (NOT NEW.is_deleted)
  EXECUTE FUNCTION notify_on_new_comment();

-- TRIGGER 2: Novo like → notificar autor (threshold de 5 likes)
CREATE OR REPLACE FUNCTION notify_on_like_milestone()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author UUID;
  v_current_likes INTEGER;
  v_notification RECORD;
  v_template_key TEXT;
BEGIN
  -- Buscar autor do post e contagem de likes
  SELECT author_id, likes_count INTO v_post_author, v_current_likes
  FROM community_posts
  WHERE id = NEW.post_id;

  -- Não notificar se autor deu like no próprio post
  IF v_post_author = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Notificar apenas em marcos: 5, 10, 25, 50, 100 likes
  IF v_current_likes = 5 THEN
    v_template_key := 'community_like';
  ELSIF v_current_likes IN (10, 25, 50, 100) THEN
    v_template_key := 'community_like_milestone';
  ELSE
    -- Não é um marco, não notifica
    RETURN NEW;
  END IF;

  -- Gerar notificação
  SELECT * INTO v_notification
  FROM get_notification_from_template(
    v_template_key,
    jsonb_build_object('like_count', v_current_likes::TEXT)
  );

  -- Enviar notificação
  PERFORM send_notification_via_edge(
    v_post_author,
    'community_like',
    v_notification.title,
    v_notification.body,
    jsonb_build_object(
      'post_id', NEW.post_id,
      'like_count', v_current_likes
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_like_milestone
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_like_milestone();

-- TRIGGER 3: Novo post em grupo → notificar membros
CREATE OR REPLACE FUNCTION notify_group_members_on_post()
RETURNS TRIGGER AS $$
DECLARE
  v_group_name TEXT;
  v_author_name TEXT;
  v_post_preview TEXT;
  v_member_id UUID;
  v_notification RECORD;
BEGIN
  -- Só notifica se post estiver em um grupo
  IF NEW.group_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Buscar nome do grupo e autor
  SELECT g.name, p.name INTO v_group_name, v_author_name
  FROM community_groups g, profiles p
  WHERE g.id = NEW.group_id
    AND p.id = NEW.author_id;

  -- Preview do post
  v_post_preview := LEFT(NEW.content, 60);
  IF LENGTH(NEW.content) > 60 THEN
    v_post_preview := v_post_preview || '...';
  END IF;

  -- Gerar notificação do template
  SELECT * INTO v_notification
  FROM get_notification_from_template(
    'community_group_post',
    jsonb_build_object(
      'group_name', v_group_name,
      'author_name', v_author_name,
      'post_preview', v_post_preview
    )
  );

  -- Enviar para todos os membros do grupo (exceto autor)
  FOR v_member_id IN
    SELECT user_id
    FROM group_members
    WHERE group_id = NEW.group_id
      AND user_id != NEW.author_id
  LOOP
    PERFORM send_notification_via_edge(
      v_member_id,
      'community_group_post',
      v_notification.title,
      v_notification.body,
      jsonb_build_object(
        'post_id', NEW.id,
        'group_id', NEW.group_id,
        'author_id', NEW.author_id
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_group_post
  AFTER INSERT ON community_posts
  FOR EACH ROW
  WHEN (NEW.group_id IS NOT NULL AND NOT NEW.is_deleted)
  EXECUTE FUNCTION notify_group_members_on_post();

-- ============================================
-- PARTE 5: FUNÇÕES AUXILIARES PARA CRON JOBS
-- ============================================

-- Função para enfileirar lembretes de hábitos
-- Chamada via cron job diário
CREATE OR REPLACE FUNCTION queue_habit_reminders()
RETURNS TABLE (
  queued_count INTEGER,
  skipped_count INTEGER
) AS $$
DECLARE
  v_queued INTEGER := 0;
  v_skipped INTEGER := 0;
  v_user RECORD;
  v_habit RECORD;
  v_notification RECORD;
  v_reminder_time TIME;
BEGIN
  -- Para cada usuário com hábitos ativos
  FOR v_user IN
    SELECT DISTINCT h.user_id, np.habit_reminder_time
    FROM habits h
    JOIN notification_preferences np ON np.user_id = h.user_id
    WHERE h.is_active = TRUE
      AND np.notifications_enabled = TRUE
      AND np.habit_reminders = TRUE
  LOOP
    v_reminder_time := v_user.habit_reminder_time;

    -- Enfileirar para horário preferido do usuário
    FOR v_habit IN
      SELECT h.id, h.title
      FROM habits h
      WHERE h.user_id = v_user.user_id
        AND h.is_active = TRUE
        -- Hábito não foi completado hoje
        AND NOT EXISTS (
          SELECT 1 FROM habit_completions hc
          WHERE hc.habit_id = h.id
            AND hc.date = CURRENT_DATE
        )
    LOOP
      -- Gerar notificação
      SELECT * INTO v_notification
      FROM get_notification_from_template(
        'habit_reminder',
        jsonb_build_object('habit_name', v_habit.title)
      );

      -- Enfileirar para horário preferido
      INSERT INTO notification_queue (
        user_id,
        notification_type,
        title,
        body,
        data,
        priority,
        scheduled_for
      ) VALUES (
        v_user.user_id,
        'habit_reminder',
        v_notification.title,
        v_notification.body,
        jsonb_build_object('habit_id', v_habit.id),
        3, -- Baixa prioridade
        (CURRENT_DATE + v_reminder_time)::TIMESTAMPTZ
      )
      ON CONFLICT DO NOTHING; -- Evitar duplicatas

      v_queued := v_queued + 1;
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT v_queued, v_skipped;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enfileirar check-in diário
CREATE OR REPLACE FUNCTION queue_daily_check_in_reminders()
RETURNS INTEGER AS $$
DECLARE
  v_queued INTEGER := 0;
  v_user RECORD;
  v_notification RECORD;
BEGIN
  -- Para cada usuário que habilitou check-in reminders
  FOR v_user IN
    SELECT np.user_id, np.check_in_time
    FROM notification_preferences np
    WHERE np.notifications_enabled = TRUE
      AND np.daily_check_in = TRUE
      -- Ainda não fez check-in hoje
      AND NOT EXISTS (
        SELECT 1 FROM daily_check_ins dc
        WHERE dc.user_id = np.user_id
          AND dc.date = CURRENT_DATE
      )
  LOOP
    -- Gerar notificação
    SELECT * INTO v_notification
    FROM get_notification_from_template('daily_check_in_reminder', '{}'::JSONB);

    -- Enfileirar
    INSERT INTO notification_queue (
      user_id,
      notification_type,
      title,
      body,
      priority,
      scheduled_for
    ) VALUES (
      v_user.user_id,
      'daily_check_in',
      v_notification.title,
      v_notification.body,
      4, -- Média prioridade
      (CURRENT_DATE + v_user.check_in_time)::TIMESTAMPTZ
    )
    ON CONFLICT DO NOTHING;

    v_queued := v_queued + 1;
  END LOOP;

  RETURN v_queued;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_notification_templates_key ON notification_templates(template_key, language);
CREATE INDEX idx_notification_templates_category ON notification_templates(category) WHERE is_active;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Templates são públicos (read-only)
CREATE POLICY "Anyone can view active templates"
  ON notification_templates FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER trigger_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE notification_templates IS 'Templates de notificação com suporte i18n';
COMMENT ON FUNCTION interpolate_template IS 'Interpola variáveis {{key}} no template';
COMMENT ON FUNCTION get_notification_from_template IS 'Gera título e corpo a partir do template';
COMMENT ON FUNCTION send_notification_via_edge IS 'Enfileira notificação para processamento assíncrono';
COMMENT ON FUNCTION queue_habit_reminders IS 'Cron job: enfileira lembretes de hábitos diários';
COMMENT ON FUNCTION queue_daily_check_in_reminders IS 'Cron job: enfileira lembretes de check-in diário';

-- ============================================
-- CONFIGURAÇÃO RUNTIME (Supabase)
-- ============================================
-- Estas settings são configuradas no Supabase Dashboard:
-- ALTER DATABASE postgres SET app.settings.supabase_url = 'https://xxx.supabase.co';
-- ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJxxx...';
