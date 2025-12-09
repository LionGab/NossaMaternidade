// components/onboarding/OnboardingFlow.tsx
/**
 * OnboardingFlow - Fluxo completo de onboarding com 10 perguntas criteriosas
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useOnboardingStorage } from '@/hooks/useOnboardingStorage';
import { useResponsive } from '@/hooks/useResponsive';
import type { RootStackParamList } from '@/navigation/types';
import { UserStage, UserEmotion, UserSupport } from '@/types/user';
import { logger } from '@/utils/logger';

// Steps
import { FeelingStep } from './steps/FeelingStep';
import { GoalsStep, type WellnessGoal } from './steps/GoalsStep';
import { NameStep } from './steps/NameStep';
import { PhysicalHealthStep, type PhysicalChallenge } from './steps/PhysicalHealthStep';
import { SleepQualityStep, type SleepChallenge } from './steps/SleepQualityStep';
import { StageStep } from './steps/StageStep';
import { SupportStep } from './steps/SupportStep';
import { TermsStep } from './steps/TermsStep';
import { TimelineStep } from './steps/TimelineStep';
import { WelcomeStep } from './steps/WelcomeStep';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingFlow() {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { isSmallScreen } = useResponsive();
  const [isLoading, setIsLoading] = useState(true);

  const {
    step,
    formData,
    sliderValue,
    termsAccepted,
    privacyAccepted,
    TOTAL_STEPS,
    nextStep,
    prevStep,
    updateData,
    setSliderValue,
    toggleTerms,
    togglePrivacy,
    canProceed,
    progress,
    loadProfile,
  } = useOnboardingFlow();

  const { saveUserProfile, saveAcceptanceTimestamps, getUserProfile, isOnboardingCompleted } =
    useOnboardingStorage();

  // Carregar perfil existente ao montar (para retomar onboarding)
  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        const existing = await getUserProfile();
        const completed = await isOnboardingCompleted();

        if (completed) {
          // Onboarding já completo - navegar direto para Main
          logger.info('Onboarding já completo, navegando para Main');
          navigation.navigate('Main' as never);
          return;
        }

        if (existing) {
          // Retomar onboarding com dados existentes
          loadProfile(existing);
          logger.info('Perfil existente carregado, retomando onboarding', {
            step: existing.onboarding_step || 1,
          });
        }
      } catch (error) {
        logger.error('Erro ao carregar perfil existente', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingProfile();
  }, [getUserProfile, isOnboardingCompleted, loadProfile, navigation]);

  const handleFinish = useCallback(async () => {
    if (!canProceed) {
      logger.warn('Tentativa de finalizar onboarding sem aceitar termos');
      return;
    }

    try {
      setIsLoading(true);

      // 1. Salvar timestamps de aceitação (LGPD compliance)
      await saveAcceptanceTimestamps();

      // 2. Salvar perfil completo (Supabase ou local)
      const success = await saveUserProfile({
        ...formData,
        onboarding_completed: true,
        onboarding_step: TOTAL_STEPS,
      });

      if (success) {
        logger.info('Onboarding completado com sucesso', {
          name: formData.name,
          stage: formData.stage,
        });

        // Navegar para Main após pequeno delay (UX)
        setTimeout(() => {
          navigation.navigate('Main' as never);
        }, 300);
      } else {
        logger.error('Falha ao salvar perfil no final do onboarding');
        // TODO: Mostrar erro ao usuário
      }
    } catch (error) {
      logger.error('Erro ao finalizar onboarding', error);
      // TODO: Mostrar erro ao usuário
    } finally {
      setIsLoading(false);
    }
  }, [canProceed, formData, saveUserProfile, saveAcceptanceTimestamps, navigation, TOTAL_STEPS]);

  // Helpers para toggle de arrays (devem vir antes do early return!)
  const handleTogglePhysicalChallenge = useCallback(
    (challenge: PhysicalChallenge) => {
      const current = formData.physical_challenges || [];
      if (challenge === 'nenhum') {
        updateData('physical_challenges', ['nenhum']);
      } else {
        const filtered = current.filter((c) => c !== 'nenhum');
        const newChallenges = filtered.includes(challenge)
          ? filtered.filter((c) => c !== challenge)
          : [...filtered, challenge];
        updateData('physical_challenges', newChallenges);
      }
    },
    [formData.physical_challenges, updateData]
  );

  const handleToggleSleepChallenge = useCallback(
    (challenge: SleepChallenge) => {
      const current = formData.sleep_challenges || [];
      if (challenge === 'durmo_bem') {
        updateData('sleep_challenges', ['durmo_bem']);
      } else {
        const filtered = current.filter((c) => c !== 'durmo_bem');
        const newChallenges = filtered.includes(challenge)
          ? filtered.filter((c) => c !== challenge)
          : [...filtered, challenge];
        updateData('sleep_challenges', newChallenges);
      }
    },
    [formData.sleep_challenges, updateData]
  );

  const handleToggleGoal = useCallback(
    (goal: WellnessGoal) => {
      const current = formData.wellness_goals || [];
      const newGoals = current.includes(goal)
        ? current.filter((g) => g !== goal)
        : [...current, goal];
      updateData('wellness_goals', newGoals);
    },
    [formData.wellness_goals, updateData]
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderiza step atual - 10 perguntas criteriosas
  switch (step) {
    case 1: // Welcome
      return <WelcomeStep onNext={nextStep} isSmallScreen={isSmallScreen} />;

    case 2: // Nome
      return (
        <NameStep
          name={formData.name}
          onChangeName={(text) => updateData('name', text)}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 3: // Fase da maternidade
      return (
        <StageStep
          stage={formData.stage}
          onSelectStage={(stage) => updateData('stage', stage as UserStage)}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          name={formData.name}
          isSmallScreen={isSmallScreen}
        />
      );

    case 4: // Timeline (semanas/idade)
      return (
        <TimelineStep
          stage={formData.stage}
          sliderValue={sliderValue}
          onChangeSlider={setSliderValue}
          onNext={(value) => {
            updateData('timelineInfo', value);
            nextStep();
          }}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 5: // Estado emocional
      return (
        <FeelingStep
          currentFeeling={formData.currentFeeling}
          onSelectFeeling={(feeling) => updateData('currentFeeling', feeling as UserEmotion)}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 6: // Saúde física
      return (
        <PhysicalHealthStep
          selectedChallenges={formData.physical_challenges || []}
          onToggleChallenge={handleTogglePhysicalChallenge}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 7: // Qualidade do sono
      return (
        <SleepQualityStep
          selectedChallenges={formData.sleep_challenges || []}
          onToggleChallenge={handleToggleSleepChallenge}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 8: // Rede de apoio
      return (
        <SupportStep
          supportLevel={formData.supportLevel}
          onSelectSupport={(support) => updateData('supportLevel', support as UserSupport)}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 9: // Objetivos
      return (
        <GoalsStep
          selectedGoals={formData.wellness_goals || []}
          onToggleGoal={handleToggleGoal}
          onNext={nextStep}
          onBack={prevStep}
          step={step}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          isSmallScreen={isSmallScreen}
        />
      );

    case 10: // Termos e preferências
      return (
        <TermsStep
          name={formData.name}
          biggestChallenge={formData.wellness_goals?.[0]}
          termsAccepted={termsAccepted}
          privacyAccepted={privacyAccepted}
          notificationsEnabled={formData.notificationsEnabled || false}
          onToggleTerms={toggleTerms}
          onTogglePrivacy={togglePrivacy}
          onToggleNotifications={(value) => updateData('notificationsEnabled', value)}
          onFinish={handleFinish}
          canProceed={canProceed}
          isSmallScreen={isSmallScreen}
          isLoading={isLoading}
        />
      );

    default:
      return null;
  }
}
