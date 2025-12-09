/**
 * useEmotions - Hook para gerenciar check-in emocional
 *
 * Usa React Query para cache, retry e sincronização automática.
 * Encapsula o checkInService para acesso aos dados de emoção.
 *
 * @example
 * const { data: todayEmotion, isLoading } = useTodayEmotion();
 * const { mutate: saveEmotion } = useSaveEmotion();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { checkInService, type EmotionValue, type EmotionRecord } from '@/services/checkInService';
import { logger } from '@/utils/logger';

// Query keys centralizadas
export const emotionKeys = {
  all: ['emotions'] as const,
  today: () => [...emotionKeys.all, 'today'] as const,
  history: (days: number) => [...emotionKeys.all, 'history', days] as const,
  weekly: () => [...emotionKeys.all, 'weekly'] as const,
};

/**
 * Hook para buscar emoção de hoje
 */
export function useTodayEmotion() {
  return useQuery({
    queryKey: emotionKeys.today(),
    queryFn: async (): Promise<EmotionValue | null> => {
      const emotion = await checkInService.getTodayEmotion();
      return emotion;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });
}

/**
 * Hook para buscar histórico de emoções
 */
export function useEmotionHistory(days: number = 7) {
  return useQuery({
    queryKey: emotionKeys.history(days),
    queryFn: async (): Promise<EmotionRecord[]> => {
      const history = await checkInService.getEmotionHistory(days);
      return history;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
  });
}

/**
 * Hook para buscar resumo semanal de emoções
 */
export function useWeeklyEmotionSummary() {
  return useQuery({
    queryKey: emotionKeys.weekly(),
    queryFn: async () => {
      const history = await checkInService.getEmotionHistory(7);
      
      // Calcular resumo
      const emotionCounts: Record<EmotionValue, number> = {
        bem: 0,
        calma: 0,
        cansada: 0,
        triste: 0,
        ansiosa: 0,
      };
      
      history.forEach((record) => {
        if (record.emotion in emotionCounts) {
          emotionCounts[record.emotion]++;
        }
      });
      
      // Encontrar emoção mais frequente
      const mostFrequent = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0];
      
      return {
        totalRecords: history.length,
        emotionCounts,
        mostFrequent: mostFrequent ? (mostFrequent[0] as EmotionValue) : null,
        streak: calculateStreak(history),
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

/**
 * Calcula streak de check-ins consecutivos
 */
function calculateStreak(history: EmotionRecord[]): number {
  if (history.length === 0) return 0;
  
  // Ordenar por data decrescente
  const sorted = [...history].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sorted.length; i++) {
    const recordDate = new Date(sorted[i].created_at);
    recordDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (recordDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Hook para salvar emoção
 */
export function useSaveEmotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emotion: EmotionValue) => {
      const result = await checkInService.saveEmotion(emotion);
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar emoção');
      }
      return { emotion, ...result };
    },
    onSuccess: (data) => {
      // Atualizar cache imediatamente (optimistic update)
      queryClient.setQueryData(emotionKeys.today(), data.emotion);
      
      // Invalidar histórico para refetch
      queryClient.invalidateQueries({ queryKey: emotionKeys.history(7) });
      queryClient.invalidateQueries({ queryKey: emotionKeys.weekly() });
      
      logger.info('[useSaveEmotion] Emoção salva com sucesso', { emotion: data.emotion });
    },
    onError: (error) => {
      logger.error('[useSaveEmotion] Erro ao salvar emoção', error);
    },
  });
}

/**
 * Hook combinado para check-in emocional
 * Retorna dados de hoje + mutation para salvar
 */
export function useEmotionCheckIn() {
  const todayQuery = useTodayEmotion();
  const saveMutation = useSaveEmotion();

  return {
    // Query state
    todayEmotion: todayQuery.data,
    isLoading: todayQuery.isLoading,
    isError: todayQuery.isError,
    error: todayQuery.error,
    refetch: todayQuery.refetch,
    
    // Mutation
    saveEmotion: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}

export default useEmotionCheckIn;
