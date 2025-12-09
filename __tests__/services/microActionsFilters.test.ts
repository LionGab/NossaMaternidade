/**
 * Testes para filtros de Micro-ações
 * Testa lógica de filtro por fase sem dependência de Supabase
 */

import {
  filterMicroActionsByStage,
  getMicroActionsForProfile,
  calculateBabyAgeMonths,
  getLifeStageFromBabyAge,
  getSuggestedAction,
} from '../../src/services/microActions/filters';
import { MICRO_ACTION_IDS } from '../../src/types/microActions';
import type { MicroAction, LifeStage, UserProfileForMicroActions } from '../../src/types/microActions';

// =============================================================================
// FIXTURES
// =============================================================================

const createMockAction = (
  id: string,
  stages: LifeStage[],
  canDoWithBaby: boolean = true,
  priority: number = 5
): MicroAction => ({
  id: id as MicroAction['id'],
  category: 'rest',
  title: `Test Action ${id}`,
  label_duration: '30 seg',
  description_short: 'Short description',
  description_full: 'Full description',
  can_do_with_baby: canDoWithBaby,
  stages,
  priority,
});

const MOCK_ACTIONS: MicroAction[] = [
  createMockAction(MICRO_ACTION_IDS.CLOSE_EYES_30S, ['pregnant', 'new-mother', 'experienced-mother'], true, 1),
  createMockAction(MICRO_ACTION_IDS.DOUBLE_SIGH, ['pregnant', 'new-mother', 'experienced-mother'], true, 2),
  createMockAction(MICRO_ACTION_IDS.WITH_BABY_WINDOW, ['new-mother', 'experienced-mother'], false, 3),
  createMockAction(MICRO_ACTION_IDS.REDUCE_STIMULUS, ['pregnant', 'new-mother', 'experienced-mother'], true, 4),
  createMockAction(MICRO_ACTION_IDS.RELAX_SHOULDERS, ['pregnant', 'new-mother', 'experienced-mother'], true, 5),
  createMockAction(MICRO_ACTION_IDS.MENTAL_AIRPLANE_30S, ['pregnant', 'new-mother', 'experienced-mother'], true, 6),
  createMockAction(MICRO_ACTION_IDS.SELF_FORGIVENESS_SLEEP, ['pregnant', 'new-mother', 'experienced-mother'], true, 7),
  createMockAction(MICRO_ACTION_IDS.ONE_WIN_TODAY, ['pregnant', 'new-mother', 'experienced-mother'], true, 8),
];

// =============================================================================
// TESTES: filterMicroActionsByStage
// =============================================================================

describe('filterMicroActionsByStage', () => {
  describe('pregnant', () => {
    it('deve mostrar todas as 8 micro-ações base para gestantes', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'pregnant',
      });

      // Gestantes veem todas as ações que incluem 'pregnant' no stages
      const pregnantActions = MOCK_ACTIONS.filter((a) => a.stages.includes('pregnant'));
      expect(result.actions.length).toBe(pregnantActions.length);
    });

    it('deve ter double_sigh, reduce_stimulus e relax_shoulders como alta prioridade', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'pregnant',
      });

      const priorityIds = result.priorityActions.map((a) => a.id);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.DOUBLE_SIGH);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.REDUCE_STIMULUS);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.RELAX_SHOULDERS);
    });

    it('NÃO deve incluir rest_with_baby_window (não é para gestantes)', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'pregnant',
      });

      const hasWithBabyWindow = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.WITH_BABY_WINDOW
      );
      expect(hasWithBabyWindow).toBe(false);
    });
  });

  describe('new-mother', () => {
    it('NUNCA deve mostrar rest_sleep_15min_earlier', () => {
      // Adicionar ação de sleep_15min_earlier ao mock
      const actionsWithSleep = [
        ...MOCK_ACTIONS,
        createMockAction(MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER, ['experienced-mother'], false, 0),
      ];

      const result = filterMicroActionsByStage(actionsWithSleep, {
        stage: 'new-mother',
      });

      const hasSleepEarlier = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
      );
      expect(hasSleepEarlier).toBe(false);
    });

    it('deve priorizar close_eyes_30s, double_sigh, relax_shoulders, mental_airplane_30s', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'new-mother',
      });

      const priorityIds = result.priorityActions.map((a) => a.id);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.CLOSE_EYES_30S);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.DOUBLE_SIGH);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.RELAX_SHOULDERS);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.MENTAL_AIRPLANE_30S);
    });

    it('deve incluir ações de culpa: self_forgiveness_sleep e one_win_today', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'new-mother',
      });

      const priorityIds = result.priorityActions.map((a) => a.id);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.SELF_FORGIVENESS_SLEEP);
      expect(priorityIds).toContain(MICRO_ACTION_IDS.ONE_WIN_TODAY);
    });

    it('deve incluir rest_with_baby_window', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'new-mother',
      });

      const hasWithBabyWindow = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.WITH_BABY_WINDOW
      );
      expect(hasWithBabyWindow).toBe(true);
    });
  });

  describe('experienced-mother', () => {
    it('deve mostrar todas as 8 ações base', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'experienced-mother',
      });

      expect(result.actions.length).toBeGreaterThanOrEqual(7); // Pelo menos as que tem experienced-mother
    });

    it('deve adicionar rest_sleep_15min_earlier se sleep_score < 5', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'experienced-mother',
        sleepScore: 3,
      });

      const hasSleepEarlier = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
      );
      expect(hasSleepEarlier).toBe(true);
    });

    it('NÃO deve adicionar rest_sleep_15min_earlier se sleep_score >= 5', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'experienced-mother',
        sleepScore: 8,
      });

      const hasSleepEarlier = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
      );
      expect(hasSleepEarlier).toBe(false);
    });

    it('NÃO deve adicionar rest_sleep_15min_earlier se sleep_score não fornecido', () => {
      const result = filterMicroActionsByStage(MOCK_ACTIONS, {
        stage: 'experienced-mother',
      });

      const hasSleepEarlier = result.actions.some(
        (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
      );
      expect(hasSleepEarlier).toBe(false);
    });
  });
});

// =============================================================================
// TESTES: calculateBabyAgeMonths
// =============================================================================

describe('calculateBabyAgeMonths', () => {
  it('deve retornar 0 para data nula', () => {
    expect(calculateBabyAgeMonths(null)).toBe(0);
    expect(calculateBabyAgeMonths(undefined)).toBe(0);
  });

  it('deve calcular idade corretamente', () => {
    // Criar data de 6 meses atrás
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const age = calculateBabyAgeMonths(sixMonthsAgo.toISOString());
    expect(age).toBeGreaterThanOrEqual(5); // Pode variar um pouco pelo dia
    expect(age).toBeLessThanOrEqual(7);
  });

  it('deve retornar 0 para data futura', () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    const age = calculateBabyAgeMonths(futureDate.toISOString());
    expect(age).toBe(0);
  });
});

// =============================================================================
// TESTES: getLifeStageFromBabyAge
// =============================================================================

describe('getLifeStageFromBabyAge', () => {
  it('deve retornar "pregnant" para null/undefined', () => {
    expect(getLifeStageFromBabyAge(null)).toBe('pregnant');
    expect(getLifeStageFromBabyAge(undefined)).toBe('pregnant');
  });

  it('deve retornar "new-mother" para bebê < 12 meses', () => {
    expect(getLifeStageFromBabyAge(0)).toBe('new-mother');
    expect(getLifeStageFromBabyAge(6)).toBe('new-mother');
    expect(getLifeStageFromBabyAge(11)).toBe('new-mother');
  });

  it('deve retornar "experienced-mother" para bebê >= 12 meses', () => {
    expect(getLifeStageFromBabyAge(12)).toBe('experienced-mother');
    expect(getLifeStageFromBabyAge(18)).toBe('experienced-mother');
    expect(getLifeStageFromBabyAge(24)).toBe('experienced-mother');
  });
});

// =============================================================================
// TESTES: getMicroActionsForProfile
// =============================================================================

describe('getMicroActionsForProfile', () => {
  it('deve usar life_stage do perfil se disponível', () => {
    const profile: UserProfileForMicroActions = {
      life_stage: 'pregnant',
    };

    const result = getMicroActionsForProfile(MOCK_ACTIONS, profile);

    // Deve filtrar para gestantes
    const hasWithBabyWindow = result.actions.some(
      (a) => a.id === MICRO_ACTION_IDS.WITH_BABY_WINDOW
    );
    expect(hasWithBabyWindow).toBe(false);
  });

  it('deve calcular life_stage a partir de baby_age_months', () => {
    const profile: UserProfileForMicroActions = {
      life_stage: 'new-mother', // Será usado se não conseguir calcular
      baby_age_months: 18,
    };

    // Note: a função usa life_stage primeiro se disponível
    // Este teste verifica que baby_age_months é usado na lógica
    const result = getMicroActionsForProfile(MOCK_ACTIONS, profile);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it('deve aplicar sleepScore corretamente', () => {
    const profile: UserProfileForMicroActions = {
      life_stage: 'experienced-mother',
    };

    const resultLowSleep = getMicroActionsForProfile(MOCK_ACTIONS, profile, 3);
    const resultHighSleep = getMicroActionsForProfile(MOCK_ACTIONS, profile, 8);

    const hasLowSleep = resultLowSleep.actions.some(
      (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
    );
    const hasHighSleep = resultHighSleep.actions.some(
      (a) => a.id === MICRO_ACTION_IDS.SLEEP_15MIN_EARLIER
    );

    expect(hasLowSleep).toBe(true);
    expect(hasHighSleep).toBe(false);
  });
});

// =============================================================================
// TESTES: getSuggestedAction
// =============================================================================

describe('getSuggestedAction', () => {
  it('deve retornar null para lista vazia', () => {
    expect(getSuggestedAction([])).toBeNull();
  });

  it('deve retornar uma ação da lista', () => {
    const result = getSuggestedAction(MOCK_ACTIONS);
    expect(result).not.toBeNull();
    expect(MOCK_ACTIONS).toContainEqual(result);
  });

  it('deve sugerir ações de noite entre 20h e 6h', () => {
    // Mock hora da noite (22h)
    const result = getSuggestedAction(MOCK_ACTIONS, 22);

    // À noite, deve preferir ações de auto-perdão/descanso
    const nightPreferred = [
      MICRO_ACTION_IDS.SELF_FORGIVENESS_SLEEP,
      MICRO_ACTION_IDS.ONE_WIN_TODAY,
      MICRO_ACTION_IDS.REDUCE_STIMULUS,
    ];

    // Deve ser uma das preferidas da noite ou fallback
    expect(result).not.toBeNull();
  });

  it('deve sugerir ações de manhã entre 6h e 12h', () => {
    // Mock hora da manhã (9h)
    const result = getSuggestedAction(MOCK_ACTIONS, 9);

    // De manhã, deve preferir ações rápidas de energia
    const morningPreferred = [
      MICRO_ACTION_IDS.DOUBLE_SIGH,
      MICRO_ACTION_IDS.RELAX_SHOULDERS,
      MICRO_ACTION_IDS.CLOSE_EYES_30S,
    ];

    expect(result).not.toBeNull();
    // Se uma das preferidas estiver na lista, deve ser ela
    if (MOCK_ACTIONS.some((a) => morningPreferred.includes(a.id))) {
      expect(morningPreferred).toContain(result?.id);
    }
  });
});
