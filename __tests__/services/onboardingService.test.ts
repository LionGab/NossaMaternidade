/**
 * Testes para OnboardingService
 * Gerencia o fluxo de onboarding (modo guest e autenticado)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase, isSupabaseReady } from '../../src/services/supabase';
import { onboardingService, type OnboardingData } from '../../src/services/supabase/onboardingService';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock do Supabase
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
  isSupabaseReady: jest.fn(),
}));

// Mock do logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('OnboardingService', () => {
  const mockUserId = 'user-123';
  const mockOnboardingData: OnboardingData = {
    display_name: 'Maria',
    life_stage_generic: 'postpartum',
    main_goals: ['autocuidado', 'sono'],
    baseline_emotion: 'calma',
    first_focus: 'sono',
    preferred_language_tone: 'acolhedor',
    notification_opt_in: true,
    physical_challenges: ['dor_costas'],
    sleep_challenges: ['dificuldade_dormir'],
    emotional_state: 'bem',
    wellness_goals: ['dormir_melhor'],
    wellness_consent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('completeOnboarding', () => {
    it('deve completar onboarding em modo guest (sem Supabase)', async () => {
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.completeOnboarding(mockOnboardingData);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'nath_onboarding_data',
        JSON.stringify(mockOnboardingData)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_completed', 'true');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_step', '12');
    });

    it('deve completar onboarding com Supabase quando autenticado', async () => {
      (isSupabaseReady as jest.Mock).mockReturnValue(true);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      const result = await onboardingService.completeOnboarding(mockOnboardingData);

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          display_name: 'Maria',
          onboarding_completed: true,
          onboarding_step: 12,
        })
      );
    });

    it('deve salvar localmente mesmo quando Supabase falha', async () => {
      (isSupabaseReady as jest.Mock).mockReturnValue(true);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockEq = jest.fn().mockResolvedValue({ error: { message: 'Database error' } });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      const result = await onboardingService.completeOnboarding(mockOnboardingData);

      // Deve retornar true porque salvou localmente
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'nath_onboarding_data',
        JSON.stringify(mockOnboardingData)
      );
    });
  });

  describe('isOnboardingCompleted', () => {
    it('deve retornar true quando onboarding completado localmente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await onboardingService.isOnboardingCompleted();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('nath_onboarding_completed');
    });

    it('deve verificar Supabase quando não completado localmente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (isSupabaseReady as jest.Mock).mockReturnValue(true);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockSingle = jest.fn().mockResolvedValue({
        data: { onboarding_completed: true },
        error: null,
      });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await onboardingService.isOnboardingCompleted();

      expect(result).toBe(true);
      // Deve sincronizar com local storage
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_completed', 'true');
    });

    it('deve retornar false quando não completado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.isOnboardingCompleted();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentStep', () => {
    it('deve retornar step salvo localmente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');

      const result = await onboardingService.getCurrentStep();

      expect(result).toBe(5);
    });

    it('deve retornar 0 quando não há step salvo', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.getCurrentStep();

      expect(result).toBe(0);
    });

    it('deve buscar step do Supabase quando não há local', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (isSupabaseReady as jest.Mock).mockReturnValue(true);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockSingle = jest.fn().mockResolvedValue({
        data: { onboarding_step: 7 },
        error: null,
      });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await onboardingService.getCurrentStep();

      expect(result).toBe(7);
      // Deve sincronizar com local
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_step', '7');
    });
  });

  describe('saveOnboardingStep', () => {
    it('deve salvar step e dados parciais localmente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.saveOnboardingStep(3, {
        display_name: 'Maria',
      });

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_step', '3');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'nath_onboarding_data',
        JSON.stringify({ display_name: 'Maria' })
      );
    });

    it('deve mesclar com dados existentes', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'nath_onboarding_data') {
          return Promise.resolve(JSON.stringify({ display_name: 'Maria' }));
        }
        return Promise.resolve(null);
      });
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.saveOnboardingStep(4, {
        life_stage_generic: 'pregnant',
      });

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'nath_onboarding_data',
        JSON.stringify({
          display_name: 'Maria',
          life_stage_generic: 'pregnant',
        })
      );
    });
  });

  describe('skipOnboarding', () => {
    it('deve marcar onboarding como pulado', async () => {
      (isSupabaseReady as jest.Mock).mockReturnValue(false);

      const result = await onboardingService.skipOnboarding();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_completed', 'true');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nath_onboarding_step', '12');
    });

    it('deve marcar como incomplete no Supabase', async () => {
      (isSupabaseReady as jest.Mock).mockReturnValue(true);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
      });

      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      const result = await onboardingService.skipOnboarding();

      expect(result).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          onboarding_completed: true,
          onboarding_incomplete: true,
        })
      );
    });
  });

  describe('getLocalOnboardingData', () => {
    it('deve retornar dados salvos localmente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockOnboardingData));

      const result = await onboardingService.getLocalOnboardingData();

      expect(result).toEqual(mockOnboardingData);
    });

    it('deve retornar null quando não há dados', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await onboardingService.getLocalOnboardingData();

      expect(result).toBeNull();
    });
  });

  describe('clearOnboarding', () => {
    it('deve limpar todos os dados de onboarding', async () => {
      await onboardingService.clearOnboarding();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'nath_onboarding_data',
        'nath_onboarding_completed',
        'nath_onboarding_step',
      ]);
    });
  });
});
