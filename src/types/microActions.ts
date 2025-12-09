/**
 * Tipos para Micro-ações de Descanso
 * Catálogo de ações curtas para autocuidado materno
 */

// =============================================================================
// ENUMS E CONSTANTES
// =============================================================================

/**
 * Categorias de micro-ações
 */
export type MicroActionCategory = 'rest' | 'breathe' | 'mindfulness' | 'movement';

/**
 * Fases da vida materna
 */
export type LifeStage = 'pregnant' | 'new-mother' | 'experienced-mother';

/**
 * IDs das micro-ações (slugs)
 * Usar como type-safe reference
 */
export type MicroActionId =
  | 'rest_close_eyes_30s'
  | 'rest_double_sigh'
  | 'rest_with_baby_window'
  | 'rest_reduce_stimulus'
  | 'rest_relax_shoulders'
  | 'rest_mental_airplane_30s'
  | 'rest_self_forgiveness_sleep'
  | 'rest_one_win_today'
  | 'rest_sleep_15min_earlier'; // Futura: para experienced-mother com sleep_score baixo

/**
 * Constantes de IDs para uso em código
 */
export const MICRO_ACTION_IDS = {
  CLOSE_EYES_30S: 'rest_close_eyes_30s',
  DOUBLE_SIGH: 'rest_double_sigh',
  WITH_BABY_WINDOW: 'rest_with_baby_window',
  REDUCE_STIMULUS: 'rest_reduce_stimulus',
  RELAX_SHOULDERS: 'rest_relax_shoulders',
  MENTAL_AIRPLANE_30S: 'rest_mental_airplane_30s',
  SELF_FORGIVENESS_SLEEP: 'rest_self_forgiveness_sleep',
  ONE_WIN_TODAY: 'rest_one_win_today',
  SLEEP_15MIN_EARLIER: 'rest_sleep_15min_earlier',
} as const;

// =============================================================================
// INTERFACES PRINCIPAIS
// =============================================================================

/**
 * Micro-ação do catálogo
 */
export interface MicroAction {
  /** Slug único (ex: rest_close_eyes_30s) */
  id: MicroActionId;

  /** Categoria da ação */
  category: MicroActionCategory;

  /** Título curto */
  title: string;

  /** Label de duração (ex: "30 seg", "1-2 min") */
  label_duration: string;

  /** Descrição curta (1-2 frases) */
  description_short: string;

  /** Descrição completa com instruções (pode ter \n) */
  description_full: string;

  /** Se pode ser feita com bebê por perto */
  can_do_with_baby: boolean;

  /** Fases da vida para as quais é relevante */
  stages: LifeStage[];

  /** Prioridade (menor = maior prioridade) */
  priority?: number;

  /** Timestamps */
  created_at?: string;
  updated_at?: string;
}

/**
 * Perfil do usuário (subset necessário para filtros)
 */
export interface UserProfileForMicroActions {
  /** Fase da vida atual */
  life_stage: LifeStage;

  /** Data de nascimento do bebê (ISO string) */
  baby_birth_date?: string | null;

  /** Idade do bebê em meses (calculada) */
  baby_age_months?: number | null;
}

// =============================================================================
// TIPOS DE FILTRO E PRIORIDADE
// =============================================================================

/**
 * Configuração de prioridade por fase
 */
export interface StagePriorityConfig {
  /** IDs com prioridade alta para esta fase */
  highPriority: MicroActionId[];

  /** IDs excluídos para esta fase */
  excluded: MicroActionId[];
}

/**
 * Opções para filtrar micro-ações
 */
export interface MicroActionFilterOptions {
  /** Fase da vida */
  stage: LifeStage;

  /** Score de sono (opcional, 1-10) */
  sleepScore?: number;

  /** Se deve incluir ações que NÃO podem ser feitas com bebê */
  includeNotWithBaby?: boolean;
}

/**
 * Resultado do filtro de micro-ações
 */
export interface FilteredMicroActionsResult {
  /** Ações filtradas e ordenadas */
  actions: MicroAction[];

  /** Ações de alta prioridade para esta fase */
  priorityActions: MicroAction[];

  /** Total de ações disponíveis */
  totalCount: number;
}

// =============================================================================
// TIPOS DE ANALYTICS/LOGGING
// =============================================================================

/**
 * Contexto onde a micro-ação foi sugerida
 */
export type MicroActionContext = 'home' | 'notification' | 'deeplink' | 'chat' | 'checkin';

/**
 * Razão de abandono da micro-ação
 */
export type MicroActionAbandonReason = 'skipped' | 'dismissed' | 'timeout' | 'navigation';

/**
 * Evento: micro-ação sugerida
 */
export interface MicroActionSuggestedEvent {
  action_id: MicroActionId;
  life_stage: LifeStage;
  context: MicroActionContext;
  timestamp: string;
}

/**
 * Evento: micro-ação completada
 */
export interface MicroActionCompletedEvent {
  action_id: MicroActionId;
  user_id: string;
  completed_at: string;
  duration_seconds?: number;
}

/**
 * Evento: micro-ação abandonada
 */
export interface MicroActionAbandonedEvent {
  action_id: MicroActionId;
  reason: MicroActionAbandonReason;
  timestamp: string;
}

// =============================================================================
// TIPOS DE RESPOSTA DA API
// =============================================================================

/**
 * Resposta do Supabase para micro-ações
 */
export interface MicroActionsResponse {
  data: MicroAction[] | null;
  error: Error | null;
}

/**
 * Estado do hook useMicroActions
 */
export interface UseMicroActionsState {
  /** Ações carregadas */
  actions: MicroAction[];

  /** Se está carregando */
  isLoading: boolean;

  /** Erro, se houver */
  error: Error | null;

  /** Ações de alta prioridade */
  priorityActions: MicroAction[];

  /** Função para recarregar */
  refetch: () => void;
}

// =============================================================================
// HELPERS DE TIPO
// =============================================================================

/**
 * Verifica se é um LifeStage válido
 */
export function isValidLifeStage(value: string): value is LifeStage {
  return ['pregnant', 'new-mother', 'experienced-mother'].includes(value);
}

/**
 * Verifica se é um MicroActionId válido
 */
export function isValidMicroActionId(value: string): value is MicroActionId {
  return Object.values(MICRO_ACTION_IDS).includes(value as MicroActionId);
}

/**
 * Converte fase legada para LifeStage
 */
export function mapLegacyPhaseToLifeStage(
  phase: string | undefined | null
): LifeStage {
  const mapping: Record<string, LifeStage> = {
    tentante: 'pregnant',
    gestacao: 'pregnant',
    pos_parto: 'new-mother',
    primeira_infancia: 'experienced-mother',
    maternidade: 'experienced-mother',
    // Valores do campo motherhood_stage
    trying_to_conceive: 'pregnant',
    pregnant: 'pregnant',
    postpartum: 'new-mother',
    experienced_mother: 'experienced-mother',
  };

  return mapping[phase || ''] || 'new-mother';
}
