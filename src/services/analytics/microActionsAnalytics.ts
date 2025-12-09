/**
 * Analytics para Micro-ações de Descanso
 * Tracking de sugestões, completions e abandonos
 */

import { supabase, isSupabaseReady } from '@/services/supabase/supabase';
import { logger } from '@/utils/logger';
import type {
  MicroActionId,
  LifeStage,
  MicroActionContext,
  MicroActionAbandonReason,
  MicroActionSuggestedEvent,
  MicroActionCompletedEvent,
  MicroActionAbandonedEvent,
} from '@/types/microActions';

// =============================================================================
// CONSTANTES
// =============================================================================

const TABLE_EVENTS = 'micro_action_events'; // Tabela opcional para eventos detalhados
const EVENT_TYPES = {
  SUGGESTED: 'micro_action_suggested',
  COMPLETED: 'micro_action_completed',
  ABANDONED: 'micro_action_abandoned',
} as const;

// =============================================================================
// FUNÇÕES DE LOGGING
// =============================================================================

/**
 * Loga quando uma micro-ação é sugerida ao usuário
 *
 * @param actionId - ID da micro-ação
 * @param context - Contexto onde foi sugerida (home, notification, etc)
 * @param lifeStage - Fase de vida do usuário
 */
async function logMicroActionSuggested(
  actionId: MicroActionId,
  context: MicroActionContext,
  lifeStage: LifeStage
): Promise<void> {
  const event: MicroActionSuggestedEvent = {
    action_id: actionId,
    life_stage: lifeStage,
    context,
    timestamp: new Date().toISOString(),
  };

  logger.debug('[MicroActions Analytics] Suggested', event);

  // Tentar salvar no Supabase (fire-and-forget)
  if (isSupabaseReady()) {
    try {
      await supabase.from(TABLE_EVENTS).insert({
        event_type: EVENT_TYPES.SUGGESTED,
        action_id: actionId,
        context,
        life_stage: lifeStage,
        created_at: event.timestamp,
      });
    } catch (error) {
      // Não bloquear por erro de analytics
      logger.warn('[MicroActions Analytics] Erro ao salvar evento suggested', error);
    }
  }
}

/**
 * Loga quando uma micro-ação é completada
 *
 * @param actionId - ID da micro-ação
 * @param userId - ID do usuário (opcional)
 * @param durationSeconds - Tempo em segundos que levou (opcional)
 */
async function logMicroActionCompleted(
  actionId: MicroActionId,
  userId?: string,
  durationSeconds?: number
): Promise<void> {
  const event: MicroActionCompletedEvent = {
    action_id: actionId,
    user_id: userId || 'anonymous',
    completed_at: new Date().toISOString(),
    duration_seconds: durationSeconds,
  };

  logger.info('[MicroActions Analytics] Completed', {
    actionId,
    durationSeconds,
  });

  // Tentar salvar no Supabase
  if (isSupabaseReady()) {
    try {
      await supabase.from(TABLE_EVENTS).insert({
        event_type: EVENT_TYPES.COMPLETED,
        action_id: actionId,
        user_id: userId,
        duration_seconds: durationSeconds,
        created_at: event.completed_at,
      });
    } catch (error) {
      logger.warn('[MicroActions Analytics] Erro ao salvar evento completed', error);
    }
  }
}

/**
 * Loga quando uma micro-ação é abandonada/pulada
 *
 * @param actionId - ID da micro-ação
 * @param reason - Razão do abandono
 */
async function logMicroActionAbandoned(
  actionId: MicroActionId,
  reason: MicroActionAbandonReason
): Promise<void> {
  const event: MicroActionAbandonedEvent = {
    action_id: actionId,
    reason,
    timestamp: new Date().toISOString(),
  };

  logger.debug('[MicroActions Analytics] Abandoned', event);

  // Tentar salvar no Supabase
  if (isSupabaseReady()) {
    try {
      await supabase.from(TABLE_EVENTS).insert({
        event_type: EVENT_TYPES.ABANDONED,
        action_id: actionId,
        reason,
        created_at: event.timestamp,
      });
    } catch (error) {
      logger.warn('[MicroActions Analytics] Erro ao salvar evento abandoned', error);
    }
  }
}

/**
 * Loga impressão de card (quando aparece na tela)
 * Útil para calcular CTR (completions / impressions)
 *
 * @param actionId - ID da micro-ação
 * @param context - Contexto onde foi exibida
 */
async function logMicroActionImpression(
  actionId: MicroActionId,
  context: MicroActionContext
): Promise<void> {
  logger.debug('[MicroActions Analytics] Impression', { actionId, context });

  if (isSupabaseReady()) {
    try {
      await supabase.from(TABLE_EVENTS).insert({
        event_type: 'micro_action_impression',
        action_id: actionId,
        context,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // Silent fail para impressões
    }
  }
}

/**
 * Loga clique em card (antes de completar)
 *
 * @param actionId - ID da micro-ação
 * @param context - Contexto onde foi clicada
 */
async function logMicroActionClicked(
  actionId: MicroActionId,
  context: MicroActionContext
): Promise<void> {
  logger.debug('[MicroActions Analytics] Clicked', { actionId, context });

  if (isSupabaseReady()) {
    try {
      await supabase.from(TABLE_EVENTS).insert({
        event_type: 'micro_action_clicked',
        action_id: actionId,
        context,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // Silent fail
    }
  }
}

// =============================================================================
// FUNÇÕES DE QUERY (para dashboard/relatórios)
// =============================================================================

interface MicroActionStats {
  actionId: MicroActionId;
  impressions: number;
  completions: number;
  abandonments: number;
  completionRate: number;
}

/**
 * Busca estatísticas de uma micro-ação específica
 * Para uso em dashboards/relatórios
 *
 * @param actionId - ID da micro-ação
 * @param sinceDate - Data inicial (ISO string)
 */
async function getMicroActionStats(
  actionId: MicroActionId,
  sinceDate?: string
): Promise<MicroActionStats | null> {
  if (!isSupabaseReady()) return null;

  try {
    // Query de contagem por tipo de evento
    let query = supabase
      .from(TABLE_EVENTS)
      .select('event_type')
      .eq('action_id', actionId);

    if (sinceDate) {
      query = query.gte('created_at', sinceDate);
    }

    const { data, error } = await query;

    if (error || !data) {
      logger.error('[MicroActions Analytics] Erro ao buscar stats', error);
      return null;
    }

    // Contar eventos por tipo
    const impressions = data.filter(
      (e) => e.event_type === 'micro_action_impression'
    ).length;
    const completions = data.filter(
      (e) => e.event_type === EVENT_TYPES.COMPLETED
    ).length;
    const abandonments = data.filter(
      (e) => e.event_type === EVENT_TYPES.ABANDONED
    ).length;

    const completionRate = impressions > 0 ? completions / impressions : 0;

    return {
      actionId,
      impressions,
      completions,
      abandonments,
      completionRate,
    };
  } catch (error) {
    logger.error('[MicroActions Analytics] Exceção ao buscar stats', error);
    return null;
  }
}

/**
 * Busca top micro-ações por completions
 *
 * @param limit - Limite de resultados (default: 5)
 * @param sinceDate - Data inicial (ISO string)
 */
async function getTopCompletedActions(
  limit: number = 5,
  sinceDate?: string
): Promise<Array<{ actionId: string; count: number }>> {
  if (!isSupabaseReady()) return [];

  try {
    // Nota: Esta query pode ser otimizada com RPC no Supabase
    let query = supabase
      .from(TABLE_EVENTS)
      .select('action_id')
      .eq('event_type', EVENT_TYPES.COMPLETED);

    if (sinceDate) {
      query = query.gte('created_at', sinceDate);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    // Contar por action_id
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      counts[row.action_id] = (counts[row.action_id] || 0) + 1;
    });

    // Ordenar e limitar
    return Object.entries(counts)
      .map(([actionId, count]) => ({ actionId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    logger.error('[MicroActions Analytics] Erro ao buscar top actions', error);
    return [];
  }
}

// =============================================================================
// EXPORT
// =============================================================================

export const microActionsAnalytics = {
  /** Loga quando ação é sugerida */
  logSuggested: logMicroActionSuggested,
  /** Loga quando ação é completada */
  logCompleted: logMicroActionCompleted,
  /** Loga quando ação é abandonada */
  logAbandoned: logMicroActionAbandoned,
  /** Loga impressão de card */
  logImpression: logMicroActionImpression,
  /** Loga clique em card */
  logClicked: logMicroActionClicked,
  /** Busca estatísticas de uma ação */
  getStats: getMicroActionStats,
  /** Busca top ações completadas */
  getTopCompleted: getTopCompletedActions,
};

export default microActionsAnalytics;
