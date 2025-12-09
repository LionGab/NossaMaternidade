/**
 * Hook para logging de Micro-ações
 * Encapsula analytics para uso em componentes
 */

import { useCallback, useRef, useEffect } from 'react';

import { microActionsAnalytics } from '@/services/analytics/microActionsAnalytics';
import type {
  MicroActionId,
  MicroActionContext,
  MicroActionAbandonReason,
  LifeStage,
} from '@/types/microActions';

// =============================================================================
// TIPOS
// =============================================================================

export interface UseMicroActionLoggerOptions {
  /** ID da micro-ação */
  actionId: MicroActionId;
  /** Contexto onde está sendo exibida */
  context: MicroActionContext;
  /** Fase de vida do usuário (para evento suggested) */
  lifeStage?: LifeStage;
  /** Se deve logar impressão automaticamente no mount */
  logImpressionOnMount?: boolean;
}

export interface UseMicroActionLoggerResult {
  /** Loga que a ação foi sugerida */
  onSuggest: () => void;
  /** Loga que a ação foi completada */
  onComplete: (durationSeconds?: number) => void;
  /** Loga que a ação foi abandonada */
  onAbandon: (reason: MicroActionAbandonReason) => void;
  /** Loga clique no card */
  onClick: () => void;
  /** Loga impressão manual */
  onImpression: () => void;
  /** Timestamp de início (para calcular duração) */
  startTimer: () => void;
  /** Para o timer e retorna duração em segundos */
  stopTimer: () => number;
}

// =============================================================================
// HOOK: useMicroActionLogger
// =============================================================================

/**
 * Hook para facilitar logging de eventos de micro-ações em componentes
 *
 * @example
 * ```tsx
 * function MicroActionCard({ action, lifeStage }) {
 *   const logger = useMicroActionLogger({
 *     actionId: action.id,
 *     context: 'home',
 *     lifeStage,
 *     logImpressionOnMount: true,
 *   });
 *
 *   const handlePress = () => {
 *     logger.onClick();
 *     logger.startTimer();
 *     // Mostrar modal de ação...
 *   };
 *
 *   const handleComplete = () => {
 *     const duration = logger.stopTimer();
 *     logger.onComplete(duration);
 *   };
 *
 *   const handleDismiss = () => {
 *     logger.onAbandon('dismissed');
 *   };
 *
 *   return <Card onPress={handlePress} />;
 * }
 * ```
 */
export function useMicroActionLogger(
  options: UseMicroActionLoggerOptions
): UseMicroActionLoggerResult {
  const { actionId, context, lifeStage = 'new-mother', logImpressionOnMount = false } = options;

  // Ref para timer de duração
  const timerStartRef = useRef<number | null>(null);

  // Log impressão no mount se habilitado
  useEffect(() => {
    if (logImpressionOnMount) {
      microActionsAnalytics.logImpression(actionId, context);
    }
  }, [actionId, context, logImpressionOnMount]);

  // Callbacks estáveis
  const onSuggest = useCallback(() => {
    microActionsAnalytics.logSuggested(actionId, context, lifeStage);
  }, [actionId, context, lifeStage]);

  const onComplete = useCallback(
    (durationSeconds?: number) => {
      microActionsAnalytics.logCompleted(actionId, undefined, durationSeconds);
    },
    [actionId]
  );

  const onAbandon = useCallback(
    (reason: MicroActionAbandonReason) => {
      microActionsAnalytics.logAbandoned(actionId, reason);
    },
    [actionId]
  );

  const onClick = useCallback(() => {
    microActionsAnalytics.logClicked(actionId, context);
  }, [actionId, context]);

  const onImpression = useCallback(() => {
    microActionsAnalytics.logImpression(actionId, context);
  }, [actionId, context]);

  const startTimer = useCallback(() => {
    timerStartRef.current = Date.now();
  }, []);

  const stopTimer = useCallback((): number => {
    if (timerStartRef.current === null) {
      return 0;
    }
    const elapsed = Date.now() - timerStartRef.current;
    timerStartRef.current = null;
    return Math.round(elapsed / 1000); // Converter para segundos
  }, []);

  return {
    onSuggest,
    onComplete,
    onAbandon,
    onClick,
    onImpression,
    startTimer,
    stopTimer,
  };
}

// =============================================================================
// HOOK: useMicroActionTimer
// Timer simples para medir duração
// =============================================================================

export interface UseMicroActionTimerResult {
  /** Inicia o timer */
  start: () => void;
  /** Para o timer e retorna duração em segundos */
  stop: () => number;
  /** Se o timer está rodando */
  isRunning: boolean;
  /** Reseta o timer */
  reset: () => void;
}

/**
 * Hook simples para medir duração de micro-ações
 */
export function useMicroActionTimer(): UseMicroActionTimerResult {
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const stop = useCallback((): number => {
    if (startTimeRef.current === null) return 0;
    const elapsed = Date.now() - startTimeRef.current;
    return Math.round(elapsed / 1000);
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
  }, []);

  const isRunning = startTimeRef.current !== null;

  return { start, stop, isRunning, reset };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default useMicroActionLogger;
