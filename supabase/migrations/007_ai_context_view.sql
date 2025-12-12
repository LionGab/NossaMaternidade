-- ============================================
-- NOSSA MATERNIDADE - Migration 007: AI Context View
-- ============================================
-- VIEW consolidada para NathIA acessar contexto completo
-- CRÍTICO: Fonte única de verdade para a IA
-- ============================================

-- ============================================
-- VIEW: user_context_full
-- ============================================
-- Consolida TODOS os dados relevantes da usuária
-- para a NathIA ter contexto completo
CREATE OR REPLACE VIEW user_context_full AS
SELECT
  -- ============================================
  -- PERFIL BASE
  -- ============================================
  p.id AS user_id,
  p.name,
  p.stage,
  p.due_date,
  p.baby_birth_date,
  p.interests,
  p.goals,
  p.challenges,
  p.support_network,
  p.age,
  p.location,

  -- Dias calculados
  CASE
    WHEN p.stage = 'pregnant' AND p.due_date IS NOT NULL
    THEN p.due_date - CURRENT_DATE
    ELSE NULL
  END AS days_until_due,

  CASE
    WHEN p.baby_birth_date IS NOT NULL
    THEN CURRENT_DATE - p.baby_birth_date
    ELSE NULL
  END AS baby_age_days,

  CASE
    WHEN p.stage = 'pregnant' AND p.due_date IS NOT NULL
    THEN CEIL((280 - (p.due_date - CURRENT_DATE)) / 7.0)::INTEGER
    ELSE NULL
  END AS pregnancy_week,

  -- ============================================
  -- CICLO MENSTRUAL
  -- ============================================
  cs.cycle_length,
  cs.period_length,
  cs.last_period_start,
  cs.current_phase,

  -- Dias desde última menstruação
  CASE
    WHEN cs.last_period_start IS NOT NULL
    THEN CURRENT_DATE - cs.last_period_start
    ELSE NULL
  END AS days_since_period,

  -- ============================================
  -- ESTADO EMOCIONAL (últimos 7 dias)
  -- ============================================
  (
    SELECT ROUND(AVG(mood_score), 1)
    FROM daily_logs dl
    WHERE dl.user_id = p.id
      AND dl.date >= CURRENT_DATE - 7
      AND dl.mood_score IS NOT NULL
  ) AS mood_avg_7d,

  (
    SELECT ROUND(AVG(energy_score), 1)
    FROM daily_logs dl
    WHERE dl.user_id = p.id
      AND dl.date >= CURRENT_DATE - 7
      AND dl.energy_score IS NOT NULL
  ) AS energy_avg_7d,

  (
    SELECT ROUND(AVG(stress_score), 1)
    FROM daily_logs dl
    WHERE dl.user_id = p.id
      AND dl.date >= CURRENT_DATE - 7
      AND dl.stress_score IS NOT NULL
  ) AS stress_avg_7d,

  (
    SELECT ROUND(AVG(sleep_hours), 1)
    FROM daily_logs dl
    WHERE dl.user_id = p.id
      AND dl.date >= CURRENT_DATE - 7
      AND dl.sleep_hours IS NOT NULL
  ) AS sleep_avg_7d,

  get_mood_trend(p.id) AS mood_trend,

  -- ============================================
  -- ÚLTIMO CHECK-IN
  -- ============================================
  (
    SELECT jsonb_build_object(
      'date', dci.date,
      'mood', dci.mood_score,
      'energy', dci.energy_score,
      'sleep', dci.sleep_score,
      'how_feeling', dci.how_feeling,
      'today_intention', dci.today_intention,
      'gratitude', dci.gratitude
    )
    FROM daily_check_ins dci
    WHERE dci.user_id = p.id
    ORDER BY dci.date DESC
    LIMIT 1
  ) AS last_check_in,

  -- ============================================
  -- ÚLTIMO LOG DIÁRIO
  -- ============================================
  (
    SELECT jsonb_build_object(
      'date', dl.date,
      'mood_score', dl.mood_score,
      'moods', dl.moods,
      'energy', dl.energy_score,
      'symptoms', dl.symptoms,
      'feeling_description', dl.feeling_description,
      'highlights', dl.highlights,
      'challenges', dl.challenges
    )
    FROM daily_logs dl
    WHERE dl.user_id = p.id
    ORDER BY dl.date DESC
    LIMIT 1
  ) AS last_daily_log,

  -- ============================================
  -- SINTOMAS RECENTES (últimos 7 dias)
  -- ============================================
  (
    SELECT array_agg(DISTINCT symptom)
    FROM (
      SELECT unnest(symptoms) AS symptom
      FROM daily_logs dl
      WHERE dl.user_id = p.id
        AND dl.date >= CURRENT_DATE - 7
    ) t
    WHERE symptom IS NOT NULL
  ) AS recent_symptoms,

  -- ============================================
  -- HUMORES RECENTES (últimos 7 dias)
  -- ============================================
  (
    SELECT array_agg(DISTINCT mood)
    FROM (
      SELECT unnest(moods) AS mood
      FROM daily_logs dl
      WHERE dl.user_id = p.id
        AND dl.date >= CURRENT_DATE - 7
    ) t
    WHERE mood IS NOT NULL
  ) AS recent_moods,

  -- ============================================
  -- HÁBITOS
  -- ============================================
  (
    SELECT COUNT(*) FROM habits h WHERE h.user_id = p.id AND h.is_active
  )::INTEGER AS total_habits,

  (
    SELECT COUNT(*)
    FROM habit_completions hc
    JOIN habits h ON h.id = hc.habit_id
    WHERE h.user_id = p.id AND hc.date = CURRENT_DATE
  )::INTEGER AS habits_completed_today,

  (
    SELECT COALESCE(MAX(h.current_streak), 0)
    FROM habits h
    WHERE h.user_id = p.id AND h.is_active
  )::INTEGER AS best_habit_streak,

  -- Taxa de conclusão semanal
  (
    SELECT ROUND(
      COUNT(DISTINCT hc.id)::DECIMAL /
      NULLIF(COUNT(DISTINCT h.id) * 7, 0) * 100,
      1
    )
    FROM habits h
    LEFT JOIN habit_completions hc ON h.id = hc.habit_id
      AND hc.date >= date_trunc('week', CURRENT_DATE)::DATE
    WHERE h.user_id = p.id AND h.is_active
  ) AS habit_completion_rate_week,

  -- ============================================
  -- CONVERSAS RECENTES
  -- ============================================
  (
    SELECT COUNT(*)
    FROM chat_conversations cc
    WHERE cc.user_id = p.id AND cc.status = 'active'
  )::INTEGER AS active_conversations,

  (
    SELECT jsonb_agg(jsonb_build_object(
      'title', cc.title,
      'topics', cc.topics,
      'last_message', cc.last_message_at
    ) ORDER BY cc.last_message_at DESC)
    FROM (
      SELECT title, topics, last_message_at
      FROM chat_conversations
      WHERE user_id = p.id AND status = 'active'
      ORDER BY last_message_at DESC
      LIMIT 3
    ) cc
  ) AS recent_conversations,

  -- ============================================
  -- AFIRMAÇÃO DE HOJE
  -- ============================================
  (
    SELECT jsonb_build_object(
      'text', a.text,
      'category', a.category
    )
    FROM user_daily_affirmations uda
    JOIN affirmations a ON a.id = uda.affirmation_id
    WHERE uda.user_id = p.id AND uda.date = CURRENT_DATE
    LIMIT 1
  ) AS today_affirmation,

  -- ============================================
  -- STREAKS
  -- ============================================
  (
    SELECT COALESCE(current_streak, 0)
    FROM user_streaks us
    WHERE us.user_id = p.id AND us.streak_type = 'check_in'
  )::INTEGER AS check_in_streak,

  -- ============================================
  -- ENGAJAMENTO
  -- ============================================
  (
    SELECT COUNT(*)
    FROM community_posts cp
    WHERE cp.author_id = p.id AND NOT cp.is_deleted
  )::INTEGER AS total_posts,

  (
    SELECT COUNT(*)
    FROM community_comments cc
    WHERE cc.author_id = p.id AND NOT cc.is_deleted
  )::INTEGER AS total_comments,

  -- ============================================
  -- TIMESTAMPS
  -- ============================================
  p.created_at AS member_since,
  NOW() AS context_generated_at

FROM profiles p
LEFT JOIN cycle_settings cs ON cs.user_id = p.id
WHERE NOT p.is_deleted;

-- ============================================
-- GRANT para service role
-- ============================================
-- (A view herda as policies das tabelas base)

-- ============================================
-- FUNÇÃO: Gerar resumo textual para prompt
-- ============================================
CREATE OR REPLACE FUNCTION generate_nathia_context_prompt(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  ctx RECORD;
  prompt TEXT := '';
BEGIN
  SELECT * INTO ctx FROM user_context_full WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN 'Usuária não encontrada.';
  END IF;

  -- Nome e fase
  prompt := format(E'## Contexto da Usuária\n\n**Nome:** %s\n', ctx.name);

  prompt := prompt || format(E'**Fase:** %s\n',
    CASE ctx.stage
      WHEN 'trying' THEN 'Tentando engravidar'
      WHEN 'pregnant' THEN 'Grávida'
      WHEN 'postpartum' THEN 'Pós-parto'
    END
  );

  -- Gravidez
  IF ctx.stage = 'pregnant' AND ctx.pregnancy_week IS NOT NULL THEN
    prompt := prompt || format(E'**Semana de gestação:** %s\n', ctx.pregnancy_week);
    prompt := prompt || format(E'**Dias até o parto:** %s\n', ctx.days_until_due);
  END IF;

  -- Bebê
  IF ctx.baby_age_days IS NOT NULL THEN
    prompt := prompt || format(E'**Idade do bebê:** %s dias\n', ctx.baby_age_days);
  END IF;

  -- Estado emocional
  prompt := prompt || E'\n### Estado Emocional (últimos 7 dias)\n';
  prompt := prompt || format(E'- Humor médio: %s/5\n', COALESCE(ctx.mood_avg_7d::TEXT, 'sem dados'));
  prompt := prompt || format(E'- Energia média: %s/5\n', COALESCE(ctx.energy_avg_7d::TEXT, 'sem dados'));
  prompt := prompt || format(E'- Tendência: %s\n',
    CASE ctx.mood_trend
      WHEN 'improving' THEN 'MELHORANDO'
      WHEN 'declining' THEN 'EM DECLÍNIO - atenção'
      WHEN 'stable' THEN 'estável'
      ELSE 'dados insuficientes'
    END
  );

  -- Sintomas
  IF ctx.recent_symptoms IS NOT NULL AND array_length(ctx.recent_symptoms, 1) > 0 THEN
    prompt := prompt || E'\n### Sintomas Recentes\n';
    prompt := prompt || array_to_string(ctx.recent_symptoms, ', ') || E'\n';
  END IF;

  -- Humores detalhados
  IF ctx.recent_moods IS NOT NULL AND array_length(ctx.recent_moods, 1) > 0 THEN
    prompt := prompt || E'\n### Humores Recentes\n';
    prompt := prompt || array_to_string(ctx.recent_moods, ', ') || E'\n';
  END IF;

  -- Hábitos
  prompt := prompt || E'\n### Hábitos\n';
  prompt := prompt || format(E'- Completados hoje: %s/%s\n', ctx.habits_completed_today, ctx.total_habits);
  prompt := prompt || format(E'- Taxa semanal: %s%%\n', COALESCE(ctx.habit_completion_rate_week::TEXT, '0'));
  prompt := prompt || format(E'- Melhor streak: %s dias\n', ctx.best_habit_streak);

  -- Desafios e metas
  IF ctx.challenges IS NOT NULL AND array_length(ctx.challenges, 1) > 0 THEN
    prompt := prompt || E'\n### Desafios\n';
    prompt := prompt || '- ' || array_to_string(ctx.challenges, E'\n- ') || E'\n';
  END IF;

  IF ctx.goals IS NOT NULL AND array_length(ctx.goals, 1) > 0 THEN
    prompt := prompt || E'\n### Metas\n';
    prompt := prompt || '- ' || array_to_string(ctx.goals, E'\n- ') || E'\n';
  END IF;

  -- Último check-in
  IF ctx.last_check_in IS NOT NULL AND ctx.last_check_in->>'how_feeling' IS NOT NULL THEN
    prompt := prompt || E'\n### Como está se sentindo (último registro)\n';
    prompt := prompt || ctx.last_check_in->>'how_feeling' || E'\n';
  END IF;

  RETURN prompt;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON VIEW user_context_full IS 'VIEW consolidada com TODO o contexto da usuária para a NathIA';
COMMENT ON FUNCTION generate_nathia_context_prompt IS 'Gera prompt markdown com contexto para a NathIA';

-- ============================================
-- EXEMPLO DE USO
-- ============================================
-- Para obter contexto em JSONB:
-- SELECT * FROM user_context_full WHERE user_id = 'uuid-aqui';
--
-- Para obter prompt formatado:
-- SELECT generate_nathia_context_prompt('uuid-aqui');
