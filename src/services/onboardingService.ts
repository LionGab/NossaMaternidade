/**
 * onboardingService
 * Gerencia o fluxo de onboarding e salva dados do perfil
 */

import { supabase } from './supabase';
import { logger } from '@/utils/logger';

// ======================
// 🎯 TYPES
// ======================

export interface OnboardingData {
  display_name: string;
  life_stage_generic: string;
  main_goals: string[];
  baseline_emotion: string;
  first_focus: string;
  preferred_language_tone?: string | null;
  notification_opt_in: boolean;
}

// ======================
// 🔧 ONBOARDING SERVICE
// ======================

class OnboardingService {
  /**
   * Completa o onboarding e salva todos os dados do perfil
   */
  async completeOnboarding(data: OnboardingData): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.error('No authenticated user found');
        return false;
      }

      // Atualizar perfil com dados do onboarding
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          life_stage_generic: data.life_stage_generic,
          main_goals: data.main_goals,
          baseline_emotion: data.baseline_emotion,
          first_focus: data.first_focus,
          preferred_language_tone: data.preferred_language_tone,
          notification_opt_in: data.notification_opt_in,
          onboarding_completed: true,
          onboarding_step: 7,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        logger.error('Failed to save onboarding data', error);
        return false;
      }

      logger.info('Onboarding completed successfully', {
        userId: user.id,
        displayName: data.display_name,
      });

      return true;
    } catch (error) {
      logger.error('Error completing onboarding', error);
      return false;
    }
  }

  /**
   * Salva progresso parcial do onboarding (útil para multi-step)
   */
  async saveOnboardingStep(step: number, partialData: Partial<OnboardingData>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.error('No authenticated user found');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...partialData,
          onboarding_step: step,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        logger.error('Failed to save onboarding step', error, { step });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error saving onboarding step', error);
      return false;
    }
  }

  /**
   * Verifica se o usuário já completou o onboarding
   */
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        logger.error('Failed to check onboarding status', error);
        return false;
      }

      return data?.onboarding_completed ?? false;
    } catch (error) {
      logger.error('Error checking onboarding status', error);
      return false;
    }
  }

  /**
   * Retorna o passo atual do onboarding (útil para retomar)
   */
  async getCurrentStep(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return 0;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_step')
        .eq('id', user.id)
        .single();

      if (error) {
        logger.error('Failed to get onboarding step', error);
        return 0;
      }

      return data?.onboarding_step ?? 0;
    } catch (error) {
      logger.error('Error getting onboarding step', error);
      return 0;
    }
  }

  /**
   * Pula o onboarding (útil para testes ou casos especiais)
   */
  async skipOnboarding(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.error('No authenticated user found');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 7,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        logger.error('Failed to skip onboarding', error);
        return false;
      }

      logger.info('Onboarding skipped', { userId: user.id });
      return true;
    } catch (error) {
      logger.error('Error skipping onboarding', error);
      return false;
    }
  }
}

export const onboardingService = new OnboardingService();
