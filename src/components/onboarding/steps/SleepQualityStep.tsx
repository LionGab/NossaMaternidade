// components/onboarding/steps/SleepQualityStep.tsx
/**
 * SleepQualityStep - Pergunta sobre qualidade do sono
 * Pergunta 7 do onboarding: "Como está seu sono?"
 */
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft, Check, Moon } from 'lucide-react-native';
import React, { memo } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeContext';
import { getShadowFromToken } from '@/utils/shadowHelper';

import { OnboardingHeader } from '../OnboardingHeader';
import { StepTitle } from '../StepTitle';

export type SleepChallenge =
  | 'dificuldade_dormir'
  | 'acordar_noite'
  | 'sono_leve'
  | 'insonia'
  | 'bebe_acorda'
  | 'ansiedade_noturna'
  | 'sonolencia_dia'
  | 'horarios_irregulares'
  | 'durmo_bem';

interface SleepChallengeOption {
  id: SleepChallenge;
  emoji: string;
  label: string;
  description: string;
}

const SLEEP_CHALLENGES: SleepChallengeOption[] = [
  {
    id: 'dificuldade_dormir',
    emoji: '😶‍🌫️',
    label: 'Dificuldade para dormir',
    description: 'Demoro muito para pegar no sono',
  },
  {
    id: 'acordar_noite',
    emoji: '⏰',
    label: 'Acordo várias vezes',
    description: 'Sono interrompido frequente',
  },
  {
    id: 'sono_leve',
    emoji: '👂',
    label: 'Sono muito leve',
    description: 'Qualquer barulho me acorda',
  },
  {
    id: 'insonia',
    emoji: '🌙',
    label: 'Insônia',
    description: 'Não consigo dormir mesmo cansada',
  },
  {
    id: 'bebe_acorda',
    emoji: '👶',
    label: 'Bebê acorda muito',
    description: 'Noites fragmentadas pelo bebê',
  },
  {
    id: 'ansiedade_noturna',
    emoji: '💭',
    label: 'Ansiedade noturna',
    description: 'Pensamentos que não param',
  },
  {
    id: 'sonolencia_dia',
    emoji: '😪',
    label: 'Sonolência durante o dia',
    description: 'Cansaço mesmo dormindo',
  },
  {
    id: 'horarios_irregulares',
    emoji: '🔄',
    label: 'Horários irregulares',
    description: 'Sem rotina de sono definida',
  },
  {
    id: 'durmo_bem',
    emoji: '😴',
    label: 'Durmo bem',
    description: 'Sono reparador e tranquilo',
  },
];

interface SleepQualityStepProps {
  selectedChallenges: string[];
  onToggleChallenge: (challenge: SleepChallenge) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  progress: number;
  isSmallScreen: boolean;
}

export const SleepQualityStep = memo<SleepQualityStepProps>(
  ({
    selectedChallenges,
    onToggleChallenge,
    onNext,
    onBack,
    step,
    totalSteps,
    progress,
    isSmallScreen,
  }) => {
    const { isDark, toggleTheme, colors } = useTheme();

    const handleToggle = (challenge: SleepChallenge) => {
      // Se selecionar "durmo_bem", limpar outras seleções
      if (challenge === 'durmo_bem') {
        onToggleChallenge('durmo_bem');
      } else {
        // Se já tem "durmo_bem" selecionado, remover antes de adicionar outro
        if (selectedChallenges.includes('durmo_bem')) {
          onToggleChallenge('durmo_bem');
        }
        onToggleChallenge(challenge);
      }
    };

    const canProceed = selectedChallenges.length > 0;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background.canvas }}>
        <View
          className="flex-1"
          style={{
            maxWidth: isSmallScreen ? '100%' : 560,
            alignSelf: 'center',
            paddingHorizontal: isSmallScreen ? 16 : 24,
          }}
        >
          <OnboardingHeader
            step={step}
            totalSteps={totalSteps}
            progress={progress}
            onBack={onBack}
            onToggleTheme={toggleTheme}
            isDark={isDark}
          />

          <View className="items-center mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: isDark ? colors.primary.dark + '30' : colors.primary.light + '30' }}
            >
              <Moon size={32} color={colors.primary.main} />
            </View>
          </View>

          <StepTitle
            title="Como está seu sono?"
            subtitle="O sono é fundamental para seu bem-estar. Conte-nos sobre suas noites."
          />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="gap-3">
              {SLEEP_CHALLENGES.map((option) => {
                const isSelected = selectedChallenges.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleToggle(option.id)}
                    className="flex-row items-center p-4 rounded-2xl"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? colors.primary.dark + '30'
                          : colors.primary.light + '40'
                        : colors.background.card,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary.main : colors.border.light,
                      ...getShadowFromToken('sm', colors.text.primary),
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={option.label}
                  >
                    <Text className="text-2xl mr-3">{option.emoji}</Text>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-base"
                        style={{ color: colors.text.primary }}
                      >
                        {option.label}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.text.secondary }}>
                        {option.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary.main }}
                      >
                        <Check size={16} color={colors.text.inverse} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Navigation buttons */}
          <View className="flex-row gap-3 pb-4">
            <TouchableOpacity
              onPress={onBack}
              className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
              style={{
                backgroundColor: colors.background.card,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <ArrowLeft size={18} color={colors.text.secondary} />
              <Text className="font-semibold ml-2" style={{ color: colors.text.secondary }}>
                Voltar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNext}
              disabled={!canProceed}
              className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
              style={{
                opacity: canProceed ? 1 : 0.5,
                minHeight: 56,
                ...(canProceed ? getShadowFromToken('md', colors.primary.main) : {}),
              }}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Continuar"
              accessibilityState={{ disabled: !canProceed }}
            >
              {canProceed ? (
                <LinearGradient
                  colors={[colors.primary.main, colors.primary.dark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 16,
                  }}
                />
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 16,
                    backgroundColor: colors.border.light,
                  }}
                />
              )}
              <Text className="text-white font-bold">Continuar</Text>
              {canProceed && <ArrowRight size={18} color={colors.text.inverse} className="ml-2" />}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
);

SleepQualityStep.displayName = 'SleepQualityStep';
