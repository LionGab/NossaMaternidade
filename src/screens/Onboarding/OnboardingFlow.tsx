import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../../types/user';
import { logger } from '../../utils/logger';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import OnboardingStep6 from './OnboardingStep6';
import OnboardingStep7 from './OnboardingStep7';
import OnboardingStep8 from './OnboardingStep8';
import OnboardingStep9 from './OnboardingStep9';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingFlow() {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({});

  const updateData = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    let next = step + 1;

    // Skip Timeline (Step 4) if not applicable
    if (step === 3) {
      const needsTimeline = formData.stage === 'Gestante' || formData.stage === 'Puérpera (Recém-nascido)';
      if (!needsTimeline) next = 5;
    }

    if (next > 9) {
      handleFinish();
    } else {
      setStep(next);
    }
  };

  const prevStep = () => {
    let prev = step - 1;
    if (step === 5) {
      const needsTimeline = formData.stage === 'Gestante' || formData.stage === 'Puérpera (Recém-nascido)';
      if (!needsTimeline) prev = 3;
    }
    setStep(Math.max(1, prev));
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('nath_user', JSON.stringify(formData));
      navigation.navigate('Main' as never);
    } catch (error) {
      logger.error('Erro ao salvar dados do usuário', error);
    }
  };

  const props = {
    step,
    formData,
    updateData,
    nextStep,
    prevStep,
  };

  switch (step) {
    case 1:
      return <OnboardingStep1 {...props} />;
    case 2:
      return <OnboardingStep2 {...props} />;
    case 3:
      return <OnboardingStep3 {...props} />;
    case 4:
      return <OnboardingStep4 {...props} />;
    case 5:
      return <OnboardingStep5 {...props} />;
    case 6:
      return <OnboardingStep6 {...props} />;
    case 7:
      return <OnboardingStep7 {...props} />;
    case 8:
      return <OnboardingStep8 {...props} />;
    case 9:
      return <OnboardingStep9 {...props} onFinish={handleFinish} />;
    default:
      return <OnboardingStep1 {...props} />;
  }
}

