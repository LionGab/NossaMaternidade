// components/onboarding/steps/PhysicalHealthStep.tsx
/**
 * PhysicalHealthStep - Pergunta sobre desafios físicos
 * Pergunta 6 do onboarding: "Quais desafios físicos você enfrenta?"
 */
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native';
import React, { memo } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeContext';
import { getShadowFromToken } from '@/utils/shadowHelper';

import { OnboardingHeader } from '../OnboardingHeader';
import { StepTitle } from '../StepTitle';

export type PhysicalChallenge =
  | 'dor_costas'
  | 'dor_pelvica'
  | 'cansaco_extremo'
  | 'amamentacao'
  | 'recuperacao_parto'
  | 'dor_cicatriz'
  | 'incontinencia'
  | 'dor_cabeca'
  | 'nenhum';

interface PhysicalChallengeOption {
  id: PhysicalChallenge;
  emoji: string;
  label: string;
  description: string;
}

const PHYSICAL_CHALLENGES: PhysicalChallengeOption[] = [
  {
    id: 'dor_costas',
    emoji: '🦴',
    label: 'Dor nas costas',
    description: 'Dor lombar ou nas costas',
  },
  {
    id: 'dor_pelvica',
    emoji: '🩺',
    label: 'Dor pélvica',
    description: 'Desconforto na região pélvica',
  },
  {
    id: 'cansaco_extremo',
    emoji: '😴',
    label: 'Cansaço extremo',
    description: 'Fadiga constante',
  },
  {
    id: 'amamentacao',
    emoji: '🤱',
    label: 'Dificuldade amamentação',
    description: 'Dor ou dificuldade para amamentar',
  },
  {
    id: 'recuperacao_parto',
    emoji: '🏥',
    label: 'Recuperação do parto',
    description: 'Ainda em recuperação física',
  },
  {
    id: 'dor_cicatriz',
    emoji: '🩹',
    label: 'Dor na cicatriz',
    description: 'Cesariana ou episiotomia',
  },
  {
    id: 'incontinencia',
    emoji: '💧',
    label: 'Incontinência',
    description: 'Escape de urina',
  },
  {
    id: 'dor_cabeca',
    emoji: '🤕',
    label: 'Dor de cabeça',
    description: 'Enxaqueca ou dor frequente',
  },
  {
    id: 'nenhum',
    emoji: '✨',
    label: 'Estou bem fisicamente',
    description: 'Sem desafios físicos',
  },
];

interface PhysicalHealthStepProps {
  selectedChallenges: string[];
  onToggleChallenge: (challenge: PhysicalChallenge) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  progress: number;
  isSmallScreen: boolean;
}

export const PhysicalHealthStep = memo<PhysicalHealthStepProps>(
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

    const handleToggle = (challenge: PhysicalChallenge) => {
      // Se selecionar "nenhum", limpar outras seleções
      if (challenge === 'nenhum') {
        onToggleChallenge('nenhum');
      } else {
        // Se já tem "nenhum" selecionado, remover antes de adicionar outro
        if (selectedChallenges.includes('nenhum')) {
          onToggleChallenge('nenhum');
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

          <StepTitle
            title="Como está seu corpo?"
            subtitle="Selecione os desafios físicos que você enfrenta. Isso nos ajuda a personalizar seu cuidado."
          />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="gap-3">
              {PHYSICAL_CHALLENGES.map((option) => {
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

PhysicalHealthStep.displayName = 'PhysicalHealthStep';
