import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;

  // Dados do onboarding
  motherhood_stage?: 'trying_to_conceive' | 'pregnant' | 'postpartum' | 'experienced_mother';
  pregnancy_week?: number;
  baby_birth_date?: string;
  baby_name?: string;
  baby_gender?: 'male' | 'female' | 'unknown' | 'prefer_not_say';

  // Preferências
  emotions?: string[];
  needs?: string[];
  interests?: string[];

  // Configurações
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications_enabled?: boolean;

  // Metadata
  onboarding_completed?: boolean;
  onboarding_step?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  motherhood_stage?: string;
  pregnancy_week?: number;
  baby_birth_date?: string;
  baby_name?: string;
  baby_gender?: string;
  emotions?: string[];
  needs?: string[];
  interests?: string[];
  theme?: string;
  language?: string;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
  onboarding_step?: number;
}

/**
 * Serviço de Perfil
 * Gerencia dados do perfil das usuárias
 */
class ProfileService {
  /**
   * Obter perfil da usuária atual
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log('Usuária não autenticada');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Obter perfil por ID
   */
  async getProfileById(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Atualizar perfil
   */
  async updateProfile(updates: UpdateProfileData): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Usuária não autenticada' };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado ao atualizar perfil:', error);
      return { success: false, error };
    }
  }

  /**
   * Fazer upload de avatar
   */
  async uploadAvatar(uri: string): Promise<{ url: string | null; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { url: null, error: 'Usuária não autenticada' };
      }

      // Ler arquivo como base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      // Gerar nome único para o arquivo
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload de avatar:', uploadError);
        return { url: null, error: uploadError };
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil com nova URL
      await this.updateProfile({ avatar_url: publicUrl } as UpdateProfileData);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erro inesperado ao fazer upload de avatar:', error);
      return { url: null, error };
    }
  }

  /**
   * Deletar avatar
   */
  async deleteAvatar(): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Usuária não autenticada' };
      }

      const profile = await this.getCurrentProfile();
      if (!profile?.avatar_url) {
        return { success: true }; // Já não tem avatar
      }

      // Extrair caminho do arquivo da URL
      const filePath = profile.avatar_url.split('/').slice(-2).join('/');

      // Deletar do storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) {
        console.error('Erro ao deletar avatar:', deleteError);
        return { success: false, error: deleteError };
      }

      // Atualizar perfil removendo URL
      await this.updateProfile({ avatar_url: null } as UpdateProfileData);

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado ao deletar avatar:', error);
      return { success: false, error };
    }
  }

  /**
   * Atualizar passo do onboarding
   */
  async updateOnboardingStep(step: number): Promise<{ success: boolean; error?: any }> {
    return this.updateProfile({ onboarding_step: step });
  }

  /**
   * Completar onboarding
   */
  async completeOnboarding(): Promise<{ success: boolean; error?: any }> {
    return this.updateProfile({
      onboarding_completed: true,
      onboarding_step: 9, // Último passo
    });
  }

  /**
   * Verificar se onboarding foi completado
   */
  async isOnboardingCompleted(): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    return profile?.onboarding_completed ?? false;
  }

  /**
   * Calcular idade do bebê em meses
   */
  calculateBabyAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();

    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();

    return years * 12 + months;
  }

  /**
   * Calcular idade gestacional
   */
  calculatePregnancyAge(pregnancyWeek: number): {
    weeks: number;
    days: number;
    trimester: number;
  } {
    const weeks = pregnancyWeek;
    const days = 0; // Pode ser expandido para incluir dias também

    let trimester = 1;
    if (weeks >= 13) trimester = 2;
    if (weeks >= 27) trimester = 3;

    return { weeks, days, trimester };
  }

  /**
   * Atualizar tema
   */
  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<{ success: boolean; error?: any }> {
    return this.updateProfile({ theme });
  }

  /**
   * Atualizar configurações de notificação
   */
  async updateNotificationSettings(enabled: boolean): Promise<{ success: boolean; error?: any }> {
    return this.updateProfile({ notifications_enabled: enabled });
  }

  /**
   * Deletar conta (delega para userDataService)
   * @deprecated Use userDataService.deleteAccount() ou userDataService.requestAccountDeletion()
   */
  async deleteAccount(): Promise<{ success: boolean; error?: any }> {
    // Importar dinamicamente para evitar circular dependency
    const { userDataService } = await import('./userDataService');
    return await userDataService.requestAccountDeletion();
  }
}

export const profileService = new ProfileService();
export default profileService;
