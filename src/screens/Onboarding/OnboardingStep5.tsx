import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile, UserEmotion } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const feelings = [
  { val: UserEmotion.ANXIOUS, label: 'Ansiosa' },
  { val: UserEmotion.TIRED, label: 'Cansada' },
  { val: UserEmotion.GUILTY, label: 'Culpada' },
  { val: UserEmotion.HAPPY, label: 'Feliz' },
  { val: UserEmotion.CONFUSED, label: 'Confusa' },
];

export default function OnboardingStep5({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const { colors, toggleTheme } = useTheme();
  const TOTAL_STEPS = 8;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background.canvas }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 mb-6">
        <TouchableOpacity accessibilityRole="button" onPress={prevStep} className="p-2 -ml-2">
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Progress Dots */}
        <View className="flex-row gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: step > i + 1 ? colors.primary.main : step === i + 1 ? colors.primary.main : colors.text.disabled,
              }}
            />
          ))}
        </View>

        <TouchableOpacity accessibilityRole="button"
          onPress={toggleTheme}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Sun size={20} color={colors.status.warning} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Como você está se sentindo hoje?
        </Text>
        <Text className="text-base mb-8" style={{ color: colors.text.tertiary }}>
          Seja sincera. Aqui é um lugar livre de julgamentos.
        </Text>

        {/* Chips em 2 linhas */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          {feelings.map((feeling) => {
            const isSelected = formData.currentFeeling === feeling.val;
            return (
              <TouchableOpacity accessibilityRole="button"
                key={feeling.val}
                onPress={() => {
                  updateData('currentFeeling', feeling.val);
                  nextStep();
                }}
                className="px-6 py-3 rounded-full border"
                style={{
                  borderColor: isSelected ? colors.primary.main : colors.text.disabled,
                  backgroundColor: isSelected ? colors.primary.main : colors.background.card,
                }}
                activeOpacity={0.7}
              >
                <Text
                  className="text-sm"
                  style={{
                    color: isSelected ? colors.text.inverse : colors.text.primary,
                  }}
                >
                  {feeling.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
