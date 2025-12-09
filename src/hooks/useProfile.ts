/**
 * useProfile - Hook para buscar e atualizar perfil do usuário
 *
 * Usa React Query para cache, retry e sincronização automática.
 * Segue padrão de arquitetura onde hooks encapsulam services.
 *
 * @example
 * const { data: profile, isLoading, refetch } = useProfile();
 * const { mutate: updateProfile } = useUpdateProfile();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { profileService, type UpdateProfileData } from '@/services/profileService';
import type { UserProfile } from '@/types/user';
import { logger } from '@/utils/logger';

// Query keys centralizadas
export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  byId: (id: string) => [...profileKeys.all, id] as const,
  onboarding: () => [...profileKeys.all, 'onboarding'] as const,
};

/**
 * Hook para buscar perfil do usuário atual
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async (): Promise<UserProfile | null> => {
      const profile = await profileService.getCurrentProfile();
      return profile;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos (anteriormente cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para buscar perfil por ID
 */
export function useProfileById(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byId(userId ?? ''),
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      return await profileService.getProfileById(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook para atualizar perfil
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      const result = await profileService.updateProfile(updates);
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Erro ao atualizar perfil');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidar cache do perfil para refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
      logger.info('[useUpdateProfile] Perfil atualizado com sucesso');
    },
    onError: (error) => {
      logger.error('[useUpdateProfile] Erro ao atualizar perfil', error);
    },
  });
}

/**
 * Hook para upload de avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uri: string) => {
      const result = await profileService.uploadAvatar(uri);
      if (!result.url) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Erro ao fazer upload');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
      logger.info('[useUploadAvatar] Avatar atualizado com sucesso');
    },
    onError: (error) => {
      logger.error('[useUploadAvatar] Erro ao fazer upload de avatar', error);
    },
  });
}

/**
 * Hook para deletar avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await profileService.deleteAvatar();
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Erro ao deletar avatar');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
      logger.info('[useDeleteAvatar] Avatar removido com sucesso');
    },
    onError: (error) => {
      logger.error('[useDeleteAvatar] Erro ao deletar avatar', error);
    },
  });
}

/**
 * Hook para verificar status do onboarding
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey: profileKeys.onboarding(),
    queryFn: async () => {
      const completed = await profileService.isOnboardingCompleted();
      return { completed };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

/**
 * Hook para completar onboarding
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await profileService.completeOnboarding();
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Erro ao completar onboarding');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      logger.info('[useCompleteOnboarding] Onboarding completado');
    },
    onError: (error) => {
      logger.error('[useCompleteOnboarding] Erro ao completar onboarding', error);
    },
  });
}

/**
 * Hook para atualizar passo do onboarding
 */
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: number) => {
      const result = await profileService.updateOnboardingStep(step);
      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Erro ao atualizar passo');
      }
      return { step, ...result };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.onboarding() });
    },
  });
}

export default useProfile;
