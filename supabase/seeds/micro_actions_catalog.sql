-- =============================================================================
-- NOSSA MATERNIDADE - Seed: Micro Actions Catalog
-- Arquivo: micro_actions_catalog.sql
-- Descrição: 8 micro-ações de descanso para mães
-- Executar APÓS a migration 20251209000001_create_micro_actions_catalog.sql
-- =============================================================================

-- Limpar dados existentes (para re-seed)
DELETE FROM micro_actions_catalog;

-- =============================================================================
-- INSERT: 8 Micro-ações de Descanso
-- =============================================================================

INSERT INTO micro_actions_catalog (
  id,
  category,
  title,
  label_duration,
  description_short,
  description_full,
  can_do_with_baby,
  stages,
  priority
) VALUES

-- 1. Fechar os olhos 30s
(
  'rest_close_eyes_30s',
  'rest',
  '30 segundos de pausa',
  '30 seg',
  'Feche os olhos e deixe o corpo cair um pouquinho. É só isso.',
  E'Sente ou deite onde estiver.\nFeche os olhos por 30 segundos.\nNão precisa pensar em nada certo. Se vier culpa, deixa passar.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  1
),

-- 2. Dois suspiros
(
  'rest_double_sigh',
  'rest',
  'Dois suspiros, só',
  '10 seg',
  'Respire fundo e solte o ar bem devagar. Duas vezes.',
  E'Puxa o ar pelo nariz. Quando o pulmão encher, faz mais um mini suspiro.\nSolta o ar pela boca, bem longo.\nRepete 2x.\nIsso ajuda o cérebro a entender que você não está em perigo agora.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  2
),

-- 3. Janela de descanso com bebê
(
  'rest_with_baby_window',
  'rest',
  'Deite junto, sem culpa',
  '1-2 min',
  'Quando o bebê dormir, deite ao lado e respire.',
  E'Quando o bebê dormir, em vez de já sair fazendo algo, deita ao lado e fica 1-2 minutos só respirando.\nDepois você levanta.\nÉ um mini-descanso, não fracasso.',
  FALSE,
  ARRAY['new-mother', 'experienced-mother']::life_stage[],
  3
),

-- 4. Reduzir estímulos
(
  'rest_reduce_stimulus',
  'rest',
  'Menos 1 coisa irritando',
  '30 seg',
  'Escolha só uma coisa para diminuir agora.',
  E'Agora à noite, escolhe só uma coisa pra diminuir: apagar uma luz, abaixar a TV, ou largar o celular 5 min antes de deitar.\nUm estímulo a menos já ajuda seu cérebro a desligar.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  4
),

-- 5. Relaxar ombros
(
  'rest_relax_shoulders',
  'rest',
  'Solta esses ombros',
  '15 seg',
  'Sobe os ombros até a orelha e solta de uma vez.',
  E'Sobe os ombros como se quisesse encostar na orelha, segura, e solta de uma vez.\nRepete mais 2 vezes.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  5
),

-- 6. Modo avião mental
(
  'rest_mental_airplane_30s',
  'rest',
  '30s sem resolver nada',
  '30 seg',
  'Olhe para um ponto fixo e imagine que ninguém precisa de resposta sua.',
  E'Olha para um ponto fixo no quarto.\nImagina que por 30s, ninguém precisa de resposta sua. Nem bebê, nem família, nem celular.\nRespira devagar.\nDepois você volta para a vida normal.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  6
),

-- 7. Auto-perdão antes de dormir
(
  'rest_self_forgiveness_sleep',
  'rest',
  'Antes de dormir, fala isso',
  '10 seg',
  'Repita: "Hoje eu fiz o possível com o corpo e a cabeça que eu tinha."',
  E'Deitada, antes de pegar no sono, repete em voz baixa ou na cabeça:\n"Hoje eu fiz o possível com o corpo e a cabeça que eu tinha."\nIsso ajuda o cérebro a não deitar na cama brigando com você mesma.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  7
),

-- 8. Uma vitória de hoje
(
  'rest_one_win_today',
  'rest',
  'Uma vitória de hoje',
  '30 seg',
  'Pense em uma coisa que você conseguiu fazer hoje.',
  E'Pode ser ter tomado banho, acalmado o bebê, pedido ajuda ou simplesmente ter levantado da cama.\nUma vitória por dia muda como você se enxerga como mãe.',
  TRUE,
  ARRAY['pregnant', 'new-mother', 'experienced-mother']::life_stage[],
  8
);

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================
DO $$
DECLARE
  seed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO seed_count FROM micro_actions_catalog;
  RAISE NOTICE 'Seed micro_actions_catalog: % micro-ações inseridas', seed_count;
END $$;

-- Listar micro-ações inseridas
SELECT id, title, label_duration, can_do_with_baby, stages
FROM micro_actions_catalog
ORDER BY priority ASC;
