/**
 * Onboarding Service
 * Gerencia o processo de onboarding do usuário
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '@/utils/logger';

import { supabase } from './supabase';

const ONBOARDING_KEY = '@onboarding_completed';

export interface OnboardingData {
  userId: string;
  fullName?: string;
  dueDate?: string;
  babyName?: string;
  weeks?: number;
  hasPartner?: boolean;
  primaryConcerns?: string[];
  completedAt?: string;
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
      const { error } = await supabase.from('user_profile').upsert({
        user_id: data.userId,
        full_name: data.fullName,
        due_date: data.dueDate,
        baby_name: data.babyName,
        pregnancy_weeks: data.weeks,
        has_partner: data.hasPartner,
        primary_concerns: data.primaryConcerns,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error('[OnboardingService] Erro ao salvar dados', { error });
        return { error };
      }

      await this.markOnboardingComplete(data.userId);
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
}

export const onboardingService = new OnboardingService();
export default onboardingService;
