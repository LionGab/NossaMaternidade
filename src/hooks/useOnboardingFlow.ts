// hooks/useOnboardingFlow.ts
/**
 * Hook para gerenciar o fluxo de onboarding com 10 perguntas criteriosas
 *
 * Fluxo das 10 perguntas:
 * 1. Welcome - Boas-vindas
 * 2. Nome - Como quer ser chamada
 * 3. Fase - Estágio da maternidade
 * 4. Timeline - Detalhes da fase (semanas/idade)
 * 5. Emoção - Estado emocional atual
 * 6. Saúde Física - Desafios físicos
 * 7. Sono - Qualidade e desafios do sono
 * 8. Apoio - Rede de suporte
 * 9. Objetivos - Metas com o app
 * 10. Termos - Aceite e preferências
 */
import { useReducer, useCallback, useMemo } from 'react';

import { UserProfile, UserStage } from '@/types/user';

import { useHaptics } from './useHaptics';

type OnboardingState = {
  step: number;
  formData: UserProfile;
  sliderValue: number;
  termsAccepted: boolean;
  privacyAccepted: boolean;
};

type OnboardingAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; key: keyof UserProfile; value: UserProfile[keyof UserProfile] }
  | { type: 'SET_SLIDER'; value: number }
  | { type: 'TOGGLE_TERMS' }
  | { type: 'TOGGLE_PRIVACY' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; step: number }
  | { type: 'LOAD_PROFILE'; profile: UserProfile };

const TOTAL_STEPS = 10;

const initialState: OnboardingState = {
  step: 1,
  formData: {},
  sliderValue: 20,
  termsAccepted: false,
  privacyAccepted: false,
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'NEXT_STEP': {
      const needsTimeline =
        state.formData.stage === UserStage.PREGNANT || state.formData.stage === UserStage.NEW_MOM;

      // Lógica de skip: se está no step 3 e não precisa de timeline, pula para 5
      const next = state.step === 3 && !needsTimeline ? 5 : state.step + 1;

      return {
        ...state,
        step: Math.min(next, TOTAL_STEPS),
      };
    }

    case 'PREV_STEP': {
      const needsTimeline =
        state.formData.stage === UserStage.PREGNANT || state.formData.stage === UserStage.NEW_MOM;

      // Lógica reversa: se está no step 5 e não precisa de timeline, volta para 3
      const prev = state.step === 5 && !needsTimeline ? 3 : state.step - 1;

      return {
        ...state,
        step: Math.max(1, prev),
      };
    }

    case 'UPDATE_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.key]: action.value,
        },
      };

    case 'SET_SLIDER':
      return {
        ...state,
        sliderValue: Math.max(0, Math.min(42, action.value)), // Validação: 0-42 semanas
      };

    case 'TOGGLE_TERMS':
      return {
        ...state,
        termsAccepted: !state.termsAccepted,
      };

    case 'TOGGLE_PRIVACY':
      return {
        ...state,
        privacyAccepted: !state.privacyAccepted,
      };

    case 'SET_STEP':
      return {
        ...state,
        step: Math.max(1, Math.min(TOTAL_STEPS, action.step)),
      };

    case 'LOAD_PROFILE':
      return {
        ...state,
        formData: action.profile,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export const useOnboardingFlow = () => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const haptics = useHaptics();

  const nextStep = useCallback(() => {
    haptics.medium();
    dispatch({ type: 'NEXT_STEP' });
  }, [haptics]);

  const prevStep = useCallback(() => {
    haptics.light();
    dispatch({ type: 'PREV_STEP' });
  }, [haptics]);

  const updateData = useCallback(
    <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
      haptics.light();
      dispatch({ type: 'UPDATE_DATA', key, value });
    },
    [haptics]
  );

  const setSliderValue = useCallback((value: number) => {
    dispatch({ type: 'SET_SLIDER', value });
  }, []);

  const toggleTerms = useCallback(() => {
    haptics.light();
    dispatch({ type: 'TOGGLE_TERMS' });
  }, [haptics]);

  const togglePrivacy = useCallback(() => {
    haptics.light();
    dispatch({ type: 'TOGGLE_PRIVACY' });
  }, [haptics]);

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const loadProfile = useCallback((profile: UserProfile) => {
    dispatch({ type: 'LOAD_PROFILE', profile });
  }, []);

  const reset = useCallback(() => {
    haptics.light();
    dispatch({ type: 'RESET' });
  }, [haptics]);

  const canProceed = useMemo(
    () => state.termsAccepted && state.privacyAccepted,
    [state.termsAccepted, state.privacyAccepted]
  );

  const progress = useMemo(() => ((state.step - 1) / (TOTAL_STEPS - 1)) * 100, [state.step]);

  const isStepValid = useCallback(
    (stepNumber: number): boolean => {
      switch (stepNumber) {
        case 1: // Welcome - sempre válido
          return true;
        case 2: // Nome - obrigatório
          return !!state.formData.name && state.formData.name.trim().length >= 2;
        case 3: // Fase da maternidade - obrigatório
          return !!state.formData.stage;
        case 4: // Timeline (semanas/idade) - pode ser pulado se não aplicável
          return true;
        case 5: // Estado emocional - obrigatório
          return !!state.formData.currentFeeling;
        case 6: // Saúde física - pelo menos um desafio selecionado ou "nenhum"
          return (
            !!state.formData.physical_challenges && state.formData.physical_challenges.length > 0
          );
        case 7: // Sono - pelo menos um desafio selecionado ou "durmo bem"
          return !!state.formData.sleep_challenges && state.formData.sleep_challenges.length > 0;
        case 8: // Rede de apoio - obrigatório
          return !!state.formData.supportLevel;
        case 9: // Objetivos - pelo menos um objetivo selecionado
          return !!state.formData.wellness_goals && state.formData.wellness_goals.length > 0;
        case 10: // Termos - ambos aceitos
          return state.termsAccepted && state.privacyAccepted;
        default:
          return false;
      }
    },
    [state.formData, state.termsAccepted, state.privacyAccepted]
  );

  return {
    // State
    step: state.step,
    formData: state.formData,
    sliderValue: state.sliderValue,
    termsAccepted: state.termsAccepted,
    privacyAccepted: state.privacyAccepted,

    // Constants
    TOTAL_STEPS,

    // Actions
    nextStep,
    prevStep,
    updateData,
    setSliderValue,
    toggleTerms,
    togglePrivacy,
    setStep,
    loadProfile,
    reset,

    // Computed
    canProceed,
    progress,
    isStepValid,
  };
};
