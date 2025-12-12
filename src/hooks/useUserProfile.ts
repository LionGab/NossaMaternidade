/**
 * useUserProfile - Hook para dados do perfil do usuário
 *
 * Retorna nome e avatar do usuário logado.
 * TODO: Integrar com profileService.getCurrentProfile()
 *
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';

import { profileService } from '@/services/supabase';
import { logger } from '@/utils/logger';

export interface UserProfileData {
  name: string;
  avatarUrl?: string;
}

export interface UseUserProfileReturn {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obter dados do perfil do usuário
 */
export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Integrar com backend - por enquanto usa profileService
      const currentProfile = await profileService.getCurrentProfile();

      if (currentProfile) {
        setProfile({
          name: currentProfile.name || currentProfile.display_name || 'amiga',
          avatarUrl: currentProfile.avatar_url,
        });
      } else {
        // Fallback para mock se não houver perfil
        setProfile({ name: 'amiga' });
      }
    } catch (err) {
      logger.error('[useUserProfile] Error fetching profile', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      // Fallback para mock em caso de erro
      setProfile({ name: 'amiga' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}

export default useUserProfile;
