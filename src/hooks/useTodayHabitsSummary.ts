/**
 * useTodayHabitsSummary - Hook para resumo de hábitos do dia
 *
 * Retorna totalHabits e completedHabits para o dia atual.
 * TODO: Integrar com habitsService.getUserHabits()
 *
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';

import { habitsService } from '@/services/supabase';
import { logger } from '@/utils/logger';

export interface TodayHabitsSummary {
  totalHabits: number;
  completedHabits: number;
}

export interface UseTodayHabitsSummaryReturn extends TodayHabitsSummary {
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obter resumo dos hábitos do dia
 */
export function useTodayHabitsSummary(): UseTodayHabitsSummaryReturn {
  const [data, setData] = useState<TodayHabitsSummary>({
    totalHabits: 0,
    completedHabits: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Integrar com backend - por enquanto usa habitsService
      const habits = await habitsService.getUserHabits();

      if (habits && habits.length > 0) {
        const completed = habits.filter((h) => h.today_completed).length;
        setData({
          totalHabits: habits.length,
          completedHabits: completed,
        });
      } else {
        // Sem hábitos cadastrados
        setData({ totalHabits: 0, completedHabits: 0 });
      }
    } catch (err) {
      logger.error('[useTodayHabitsSummary] Error fetching habits', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch habits'));
      // Fallback para zero em caso de erro
      setData({ totalHabits: 0, completedHabits: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchHabits,
  };
}

export default useTodayHabitsSummary;
