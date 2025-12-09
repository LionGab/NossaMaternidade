// components/onboarding/steps/GoalsStep.tsx
/**
 * GoalsStep - Pergunta sobre objetivos com o app
 * Pergunta 9 do onboarding: "O que você quer alcançar?"
 */
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft, Check, Target } from 'lucide-react-native';
import React, { memo } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeContext';
import { getShadowFromToken } from '@/utils/shadowHelper';

import { OnboardingHeader } from '../OnboardingHeader';
import { StepTitle } from '../StepTitle';

export type WellnessGoal =
  | 'dormir_melhor'
  | 'reduzir_ansiedade'
  | 'autocuidado'
  | 'apoio_emocional'
  | 'rotina_organizada'
  | 'amamentacao_sucesso'
  | 'conexao_bebe'
  | 'tempo_para_mim'
  | 'rede_apoio'
  | 'informacao_confiavel';

interface WellnessGoalOption {
  id: WellnessGoal;
  emoji: string;
  label: string;
  description: string;
}

const WELLNESS_GOALS: WellnessGoalOption[] = [
  {
    id: 'dormir_melhor',
    emoji: '😴',
    label: 'Dormir melhor',
    description: 'Melhorar qualidade do sono',
  },
  {
    id: 'reduzir_ansiedade',
    emoji: '🧘',
    label: 'Reduzir ansiedade',
    description: 'Encontrar mais calma e paz',
  },
  {
    id: 'autocuidado',
    emoji: '💆',
    label: 'Praticar autocuidado',
    description: 'Cuidar de mim mesma',
  },
  {
    id: 'apoio_emocional',
    emoji: '💝',
    label: 'Apoio emocional',
    description: 'Ter alguém para conversar',
  },
  {
    id: 'rotina_organizada',
    emoji: '📋',
    label: 'Organizar rotina',
    description: 'Estruturar o dia a dia',
  },
  {
    id: 'amamentacao_sucesso',
    emoji: '🤱',
    label: 'Amamentação',
    description: 'Suporte para amamentar',
  },
  {
    id: 'conexao_bebe',
    emoji: '👶',
    label: 'Conexão com bebê',
    description: 'Fortalecer vínculo',
  },
  {
    id: 'tempo_para_mim',
    emoji: '⏰',
    label: 'Tempo para mim',
    description: 'Encontrar momentos pessoais',
  },
  {
    id: 'rede_apoio',
    emoji: '👥',
    label: 'Criar rede de apoio',
    description: 'Conectar com outras mães',
  },
  {
    id: 'informacao_confiavel',
    emoji: '📚',
    label: 'Informação confiável',
    description: 'Aprender sobre maternidade',
  },
];

interface GoalsStepProps {
  selectedGoals: string[];
  onToggleGoal: (goal: WellnessGoal) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  progress: number;
  isSmallScreen: boolean;
}

export const GoalsStep = memo<GoalsStepProps>(
  ({
    selectedGoals,
    onToggleGoal,
    onNext,
    onBack,
    step,
    totalSteps,
    progress,
    isSmallScreen,
  }) => {
    const { isDark, toggleTheme, colors } = useTheme();

    const canProceed = selectedGoals.length > 0 && selectedGoals.length <= 5;

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
              <Target size={32} color={colors.primary.main} />
            </View>
          </View>

          <StepTitle
            title="O que você quer alcançar?"
            subtitle="Selecione até 5 objetivos. Vamos personalizar sua experiência baseado nisso."
          />

          {/* Counter */}
          <View className="flex-row justify-center mb-4">
            <View
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: selectedGoals.length > 5
                  ? colors.status.error + '20'
                  : colors.primary.main + '20',
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: selectedGoals.length > 5 ? colors.status.error : colors.primary.main,
                }}
              >
                {selectedGoals.length} de 5 selecionados
              </Text>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="gap-3">
              {WELLNESS_GOALS.map((option) => {
                const isSelected = selectedGoals.includes(option.id);
                const isDisabled = !isSelected && selectedGoals.length >= 5;

                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => onToggleGoal(option.id)}
                    disabled={isDisabled}
                    className="flex-row items-center p-4 rounded-2xl"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? colors.primary.dark + '30'
                          : colors.primary.light + '40'
                        : colors.background.card,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary.main : colors.border.light,
                      opacity: isDisabled ? 0.5 : 1,
                      ...getShadowFromToken('sm', colors.text.primary),
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected, disabled: isDisabled }}
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

GoalsStep.displayName = 'GoalsStep';
