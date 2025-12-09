/**
 * Filtros e lógica de exibição de Micro-ações
 * Regras específicas por fase da vida
 */

import type {
  MicroAction,
  MicroActionId,
  LifeStage,
  StagePriorityConfig,
  MicroActionFilterOptions,
  FilteredMicroActionsResult,
  UserProfileForMicroActions,
} from '@/types/microActions';
import { MICRO_ACTION_IDS, mapLegacyPhaseToLifeStage } from '@/types/microActions';

// =============================================================================
// CONFIGURAÇÕES DE PRIORIDADE POR FASE
// =============================================================================

/**
 * Configuração de prioridade e exclusões por fase
 */
const STAGE_PRIORITY_CONFIG: Record<LifeStage, StagePriorityConfig> = {
  /**
   * PREGNANT (Gestante)
   * - Mostrar TODAS as 8 micro-ações
   * - Prioridade extra: double_sigh, reduce_stimulus, relax_shoulders
   */
  pregnant: {
    highPriority: [
      MICRO_ACTION_IDS.DOUBLE_SIGH,
      MICRO_ACTION_IDS.REDUCE_STIMULUS,
      MICRO_ACTION_IDS.RELAX_SHOULDERS,
    ] as MicroActionId[],
    excluded: [],
  },

  /**
   * NEW-MOTHER (Puérpera, até ~12 meses)
   * - NUNCA mostrar "rest_sleep_15min_earlier"
   * - Priorizar: close_eyes_30s, double_sigh, relax_shoulders, mental_airplane_30s
   * - Janelas: rest_with_baby_window (só quando bebê dormindo)
   * - Culpa: rest_self_forgiveness_sleep, rest_one_win_today
   */
  'new-mother': {
    highPriority: [
      MICRO_ACTION_IDS.CLOSE_EYES_30S,
      MICRO_ACTION_IDS.DOUBLE_SIGH,
      MICRO_ACTION_IDS.RELAX_SHOULDERS,
      MICRO_ACTION_IDS.MENTAL_AIRPLANE_30S,
      MICRO_ACTION_IDS.SELF_FORGIVENESS_SLEEP,
      MICRO_ACTION_IDS.ONE_WIN_TODAY,
    ] as MicroActionId[],
    excluded: [MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER] as MicroActionId[],
  },

  /**
   * EXPERIENCED-MOTHER (bebê >= 18 meses)
   * - Mostrar todas (8 base)
   * - Adicionar "rest_sleep_15min_earlier" se sleep_score < 5
   */
  'experienced-mother': {
    highPriority: [
      MICRO_ACTION_IDS.CLOSE_EYES_30S,
      MICRO_ACTION_IDS.DOUBLE_SIGH,
      MICRO_ACTION_IDS.REDUCE_STIMULUS,
    ] as MicroActionId[],
    excluded: [],
  },
};

// =============================================================================
// FUNÇÕES DE FILTRO
// =============================================================================

/**
 * Filtra micro-ações por fase da vida
 *
 * @param actions - Lista de micro-ações
 * @param options - Opções de filtro
 */
export function filterMicroActionsByStage(
  actions: MicroAction[],
  options: MicroActionFilterOptions
): FilteredMicroActionsResult {
  const { stage, sleepScore, includeNotWithBaby = true } = options;
  const config = STAGE_PRIORITY_CONFIG[stage];

  // 1. Filtrar por fase (stages contém a fase)
  let filtered = actions.filter((action) => action.stages.includes(stage));

  // 2. Remover excluídas
  filtered = filtered.filter((action) => !config.excluded.includes(action.id));

  // 3. Filtrar por can_do_with_baby se necessário
  if (!includeNotWithBaby) {
    filtered = filtered.filter((action) => action.can_do_with_baby);
  }

  // 4. Para experienced-mother: adicionar sleep_15min_earlier se sleep_score < 5
  if (stage === 'experienced-mother' && sleepScore !== undefined && sleepScore < 5) {
    // Verificar se já existe na lista (pode ter sido adicionada manualmente)
    const hasSleepAction = filtered.some(
      (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
    );

    if (!hasSleepAction) {
      // Criar ação placeholder (em produção viria do DB)
      const sleepAction: MicroAction = {
        id: MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER,
        category: 'rest',
        title: 'Dormir 15min mais cedo',
        label_duration: '15 min',
        description_short: 'Tente deitar 15 minutos mais cedo hoje.',
        description_full:
          'Hoje, tente ir pra cama 15 minutos antes do seu horário normal.\n' +
          'Não precisa dormir imediatamente. Só ficar deitada já ajuda.\n' +
          'Seu sono importa tanto quanto o do bebê.',
        can_do_with_baby: false,
        stages: ['experienced-mother'],
        priority: 0,
      };
      filtered.unshift(sleepAction);
    }
  }

  // 5. Ordenar por prioridade
  filtered.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  // 6. Separar ações de alta prioridade
  const priorityActions = filtered.filter((action) =>
    config.highPriority.includes(action.id)
  );

  // 7. Reordenar: alta prioridade primeiro, depois o resto
  const nonPriority = filtered.filter(
    (action) => !config.highPriority.includes(action.id)
  );
  const sortedActions = [...priorityActions, ...nonPriority];

  return {
    actions: sortedActions,
    priorityActions,
    totalCount: sortedActions.length,
  };
}

/**
 * Obtém micro-ações filtradas para o perfil do usuário
 *
 * @param actions - Lista de micro-ações do catálogo
 * @param profile - Perfil do usuário
 * @param sleepScore - Score de sono opcional (1-10)
 */
export function getMicroActionsForProfile(
  actions: MicroAction[],
  profile: UserProfileForMicroActions,
  sleepScore?: number
): FilteredMicroActionsResult {
  // Mapear fase legada se necessário
  const stage = profile.life_stage || mapLegacyPhaseToLifeStage(undefined);

  return filterMicroActionsByStage(actions, {
    stage,
    sleepScore,
    includeNotWithBaby: true,
  });
}

/**
 * Calcula idade do bebê em meses a partir da data de nascimento
 *
 * @param birthDate - Data de nascimento (ISO string ou Date)
 */
export function calculateBabyAgeMonths(birthDate: string | Date | null | undefined): number {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const now = new Date();

  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  // Ajustar se ainda não passou o dia do mês
  if (now.getDate() < birth.getDate()) {
    return Math.max(0, months - 1);
  }

  return Math.max(0, months);
}

/**
 * Determina LifeStage com base na idade do bebê
 *
 * @param babyAgeMonths - Idade do bebê em meses
 */
export function getLifeStageFromBabyAge(babyAgeMonths: number | null | undefined): LifeStage {
  if (babyAgeMonths === null || babyAgeMonths === undefined) {
    return 'pregnant';
  }

  if (babyAgeMonths < 12) {
    return 'new-mother';
  }

  return 'experienced-mother';
}

/**
 * Obtém a ação sugerida do momento (para exibir em destaque)
 *
 * @param actions - Lista de micro-ações filtradas
 * @param currentHour - Hora atual (0-23)
 */
export function getSuggestedAction(
  actions: MicroAction[],
  currentHour: number = new Date().getHours()
): MicroAction | null {
  if (!actions.length) return null;

  // Lógica de sugestão por hora do dia
  // Noite (20-6): ações de auto-perdão e descanso
  // Manhã (6-12): ações rápidas de energia
  // Tarde (12-20): ações de pausa e ombros

  const nightActions = [
    MICRO_ACTION_IDS.SELF_FORGIVENESS_SLEEP,
    MICRO_ACTION_IDS.ONE_WIN_TODAY,
    MICRO_ACTION_IDS.REDUCE_STIMULUS,
  ];

  const morningActions = [
    MICRO_ACTION_IDS.DOUBLE_SIGH,
    MICRO_ACTION_IDS.RELAX_SHOULDERS,
    MICRO_ACTION_IDS.CLOSE_EYES_30S,
  ];

  const afternoonActions = [
    MICRO_ACTION_IDS.MENTAL_AIRPLANE_30S,
    MICRO_ACTION_IDS.RELAX_SHOULDERS,
    MICRO_ACTION_IDS.WITH_BABY_WINDOW,
  ];

  let preferredIds: MicroActionId[];

  if (currentHour >= 20 || currentHour < 6) {
    preferredIds = nightActions;
  } else if (currentHour >= 6 && currentHour < 12) {
    preferredIds = morningActions;
  } else {
    preferredIds = afternoonActions;
  }

  // Encontrar primeira ação preferida disponível
  for (const id of preferredIds) {
    const found = actions.find((a) => a.id === id);
    if (found) return found;
  }

  // Fallback: primeira ação da lista
  return actions[0];
}

// =============================================================================
// EXPORT
// =============================================================================

export const microActionsFilters = {
  filterByStage: filterMicroActionsByStage,
  getForProfile: getMicroActionsForProfile,
  calculateBabyAge: calculateBabyAgeMonths,
  getStageFromBabyAge: getLifeStageFromBabyAge,
  getSuggested: getSuggestedAction,
  STAGE_CONFIG: STAGE_PRIORITY_CONFIG,
};

export default microActionsFilters;
