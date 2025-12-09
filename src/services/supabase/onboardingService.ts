/**
 * Onboarding Service
 * Gerencia o processo de onboarding do usuário
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '@/utils/logger';

import { profileService } from './profileService';
import { supabase } from './supabase';

const ONBOARDING_KEY = '@onboarding_completed';

export interface OnboardingData {
  userId?: string;
  fullName?: string;
  display_name?: string;
  dueDate?: string;
  babyName?: string;
  weeks?: number;
  hasPartner?: boolean;
  primaryConcerns?: string[];
  completedAt?: string;
  preferred_language_tone?: string;
  support_system?: string;
  daily_habits?: string[];
  life_stage_generic?: string;
  main_goals?: string[];
  baseline_emotion?: string;
  first_focus?: string;
  notification_opt_in?: boolean;
  sleep_quality?: string;
  sleep_hours?: number;
  sleep_challenges?: string[];
  physical_challenges?: string[];
  physical_pain_level?: number;
  emotion_intensity?: number;
  partner_relationship?: string;
  feels_isolated?: boolean;
  stress_level?: number;
  stress_triggers?: string[];
  coping_mechanisms?: string[];
  energy_level?: string;
  fatigue_pattern?: string;
  mental_health_concerns?: string[];
  previous_mental_health_support?: boolean;
  interested_in_resources?: boolean;
  goal_setting_style?: string;
  wants_reminders?: boolean;
  wants_progress_tracking?: boolean;
  notification_preferences?: Record<string, boolean>;
}

class OnboardingService {
  /**
   * Marca onboarding como completo no AsyncStorage
   */
  async markOnboardingComplete(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify({ userId, completedAt: new Date().toISOString() }));
      logger.info('[OnboardingService] Onboarding marcado como completo', { userId });
    } catch (error) {
      logger.error('[OnboardingService] Erro ao marcar onboarding completo', { error });
      throw error;
    }
  }

  /**
   * Verifica se usuário completou onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!data) return false;

      const parsed = JSON.parse(data);
      return parsed.userId === userId;
    } catch (error) {
      logger.error('[OnboardingService] Erro ao verificar onboarding', { error });
      return false;
    }
  }

  /**
   * Salva dados de onboarding no perfil do usuário
   */
  async saveOnboardingData(data: OnboardingData): Promise<{ error: Error | null }> {
    try {
      // Converter arrays para strings se necessário (para campos que esperam string)
      const supportSystemValue = Array.isArray(data.support_system) 
        ? data.support_system.join(', ') 
        : data.support_system;
      
      const dailyHabitsValue = Array.isArray(data.daily_habits)
        ? data.daily_habits
        : data.daily_habits;

      const { error } = await supabase.from('user_profile').upsert({
        user_id: data.userId,
        full_name: data.fullName,
        due_date: data.dueDate,
        baby_name: data.babyName,
        pregnancy_weeks: data.weeks,
        has_partner: data.hasPartner,
        primary_concerns: data.primaryConcerns,
        preferred_language_tone: data.preferred_language_tone ?? undefined,
        support_system: supportSystemValue ?? undefined,
        daily_habits: dailyHabitsValue ?? undefined,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error('[OnboardingService] Erro ao salvar dados', { error });
        return { error };
      }

      if (data.userId) {
        await this.markOnboardingComplete(data.userId);
      }
      return { error: null };
    } catch (error) {
      logger.error('[OnboardingService] Erro inesperado ao salvar dados', { error });
      return { error: error as Error };
    }
  }

  /**
   * Limpa dados de onboarding (para reset)
   */
  async clearOnboardingData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      logger.info('[OnboardingService] Dados de onboarding limpos');
    } catch (error) {
      logger.error('[OnboardingService] Erro ao limpar dados', { error });
      throw error;
    }
  }

  /**
   * Verifica se onboarding foi completado (compatibilidade com código existente)
   * Usa profileService internamente
   */
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      return await profileService.isOnboardingCompleted();
    } catch (error) {
      logger.error('[OnboardingService] Erro ao verificar onboarding completo', { error });
      return false;
    }
  }

  /**
   * Completa onboarding (compatibilidade com código existente)
   * Usa profileService internamente
   */
  async completeOnboarding(data?: Partial<OnboardingData>): Promise<{ success: boolean; error?: Error }> {
    try {
      // Se dados foram fornecidos, salvar primeiro
      if (data && data.userId) {
        const saveResult = await this.saveOnboardingData(data as OnboardingData);
        if (saveResult.error) {
          return { success: false, error: saveResult.error };
        }
      }

      // Marcar como completo no perfil
      const result = await profileService.completeOnboarding();
      if (result.error) {
        // Converter erro para Error se necessário
        const errorObj = result.error instanceof Error 
          ? result.error 
          : new Error(typeof result.error === 'string' ? result.error : 'Erro ao completar onboarding');
        return { success: false, error: errorObj };
      }

      return { success: true };
    } catch (error) {
      logger.error('[OnboardingService] Erro ao completar onboarding', { error });
      return { success: false, error: error as Error };
    }
  }

  /**
   * Obtém o step atual do onboarding do usuário
   * Retorna 0 se não houver step definido ou se onboarding estiver completo
   */
  async getCurrentStep(): Promise<number> {
    try {
      const profile = await profileService.getCurrentProfile();
      if (!profile) {
        return 0;
      }

      // Se onboarding está completo, retorna 0
      if (profile.onboarding_completed) {
        return 0;
      }

      // Retorna o step atual ou 0 como padrão
      return profile.onboarding_step ?? 0;
    } catch (error) {
      logger.error('[OnboardingService] Erro ao obter step atual', { error });
      return 0;
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;
