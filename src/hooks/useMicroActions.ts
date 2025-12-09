/**
 * Hooks para Micro-ações de Descanso
 * React Query + filtros por perfil
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { microActionsService } from '@/services/supabase/microActionsService';
import {
  getMicroActionsForProfile,
  getSuggestedAction,
  calculateBabyAgeMonths,
  getLifeStageFromBabyAge,
} from '@/services/microActions/filters';
import type {
  MicroAction,
  LifeStage,
  UserProfileForMicroActions,
  FilteredMicroActionsResult,
} from '@/types/microActions';
import { mapLegacyPhaseToLifeStage } from '@/types/microActions';
import { logger } from '@/utils/logger';

// =============================================================================
// CONSTANTES
// =============================================================================

const QUERY_KEY = 'micro-actions-catalog';
const STALE_TIME = 1000 * 60 * 10; // 10 minutos

// =============================================================================
// HOOK: useMicroActionsCatalog
// Busca todas as micro-ações do catálogo
// =============================================================================

export interface UseMicroActionsCatalogResult {
  /** Todas as micro-ações do catálogo */
  actions: MicroAction[];
  /** Se está carregando */
  isLoading: boolean;
  /** Erro, se houver */
  error: Error | null;
  /** Função para recarregar */
  refetch: () => void;
}

/**
 * Hook para buscar todas as micro-ações do catálogo
 */
export function useMicroActionsCatalog(): UseMicroActionsCatalogResult {
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await microActionsService.getAll();
      if (error) {
        logger.error('[useMicroActions] Erro ao buscar catálogo', error);
        throw error;
      }
      return data || [];
    },
    staleTime: STALE_TIME,
  });

  return {
    actions: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

// =============================================================================
// HOOK: useMicroActionsForStage
// Busca micro-ações filtradas por fase
// =============================================================================

export interface UseMicroActionsForStageResult {
  /** Micro-ações filtradas para a fase */
  actions: MicroAction[];
  /** Se está carregando */
  isLoading: boolean;
  /** Erro, se houver */
  error: Error | null;
  /** Função para recarregar */
  refetch: () => void;
}

/**
 * Hook para buscar micro-ações filtradas por fase
 *
 * @param stage - Fase da vida (pregnant, new-mother, experienced-mother)
 */
export function useMicroActionsForStage(
  stage: LifeStage
): UseMicroActionsForStageResult {
  const query = useQuery({
    queryKey: [QUERY_KEY, 'stage', stage],
    queryFn: async () => {
      const { data, error } = await microActionsService.getForStage(stage);
      if (error) {
        logger.error('[useMicroActions] Erro ao buscar por fase', error);
        throw error;
      }
      return data || [];
    },
    staleTime: STALE_TIME,
  });

  return {
    actions: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

// =============================================================================
// HOOK: useMicroActionsForProfile
// Busca e filtra micro-ações baseado no perfil do usuário
// =============================================================================

export interface UseMicroActionsForProfileOptions {
  /** Score de sono (1-10), opcional */
  sleepScore?: number;
  /** Se deve buscar automaticamente */
  enabled?: boolean;
}

export interface UseMicroActionsForProfileResult {
  /** Micro-ações filtradas e ordenadas */
  actions: MicroAction[];
  /** Ações de alta prioridade para o perfil */
  priorityActions: MicroAction[];
  /** Ação sugerida para o momento */
  suggestedAction: MicroAction | null;
  /** Total de ações disponíveis */
  totalCount: number;
  /** Se está carregando */
  isLoading: boolean;
  /** Erro, se houver */
  error: Error | null;
  /** Fase de vida detectada */
  lifeStage: LifeStage;
  /** Função para recarregar */
  refetch: () => void;
}

/**
 * Hook principal para micro-ações baseado no perfil do usuário
 *
 * @param profile - Perfil do usuário (ou dados parciais)
 * @param options - Opções adicionais (sleepScore, enabled)
 */
export function useMicroActionsForProfile(
  profile: Partial<UserProfileForMicroActions> | null | undefined,
  options: UseMicroActionsForProfileOptions = {}
): UseMicroActionsForProfileResult {
  const { sleepScore, enabled = true } = options;

  // Calcular fase de vida
  const lifeStage = useMemo((): LifeStage => {
    if (!profile) return 'new-mother';

    // Se tem life_stage explícito, usar
    if (profile.life_stage) {
      return profile.life_stage;
    }

    // Se tem idade do bebê em meses, calcular
    if (profile.baby_age_months !== undefined && profile.baby_age_months !== null) {
      return getLifeStageFromBabyAge(profile.baby_age_months);
    }

    // Se tem data de nascimento, calcular idade
    if (profile.baby_birth_date) {
      const ageMonths = calculateBabyAgeMonths(profile.baby_birth_date);
      return getLifeStageFromBabyAge(ageMonths);
    }

    // Fallback
    return 'new-mother';
  }, [profile]);

  // Buscar catálogo
  const catalogQuery = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await microActionsService.getAll();
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    enabled,
  });

  // Aplicar filtros
  const filteredResult = useMemo((): FilteredMicroActionsResult => {
    if (!catalogQuery.data) {
      return { actions: [], priorityActions: [], totalCount: 0 };
    }

    const profileForFilter: UserProfileForMicroActions = {
      life_stage: lifeStage,
      baby_birth_date: profile?.baby_birth_date,
      baby_age_months: profile?.baby_age_months,
    };

    return getMicroActionsForProfile(catalogQuery.data, profileForFilter, sleepScore);
  }, [catalogQuery.data, lifeStage, profile, sleepScore]);

  // Ação sugerida
  const suggestedAction = useMemo(() => {
    return getSuggestedAction(filteredResult.actions);
  }, [filteredResult.actions]);

  return {
    actions: filteredResult.actions,
    priorityActions: filteredResult.priorityActions,
    suggestedAction,
    totalCount: filteredResult.totalCount,
    isLoading: catalogQuery.isLoading,
    error: catalogQuery.error as Error | null,
    lifeStage,
    refetch: catalogQuery.refetch,
  };
}

// =============================================================================
// HOOK: useSuggestedMicroAction
// Retorna apenas a ação sugerida do momento
// =============================================================================

export interface UseSuggestedMicroActionResult {
  /** Ação sugerida */
  action: MicroAction | null;
  /** Se está carregando */
  isLoading: boolean;
  /** Erro, se houver */
  error: Error | null;
}

/**
 * Hook simplificado para obter apenas a ação sugerida
 *
 * @param profile - Perfil do usuário
 * @param sleepScore - Score de sono opcional
 */
export function useSuggestedMicroAction(
  profile: Partial<UserProfileForMicroActions> | null | undefined,
  sleepScore?: number
): UseSuggestedMicroActionResult {
  const result = useMicroActionsForProfile(profile, { sleepScore });

  return {
    action: result.suggestedAction,
    isLoading: result.isLoading,
    error: result.error,
  };
}

// =============================================================================
// HOOK: useInvalidateMicroActions
// Invalida cache de micro-ações
// =============================================================================

/**
 * Hook para invalidar cache de micro-ações
 */
export function useInvalidateMicroActions() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  }, [queryClient]);

  return invalidate;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default useMicroActionsForProfile;
