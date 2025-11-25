import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile, UserStage } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const stages = [
  { val: UserStage.TRYING, label: 'Tentante' },
  { val: UserStage.PREGNANT, label: 'Gestante' },
  { val: UserStage.NEW_MOM, label: 'Puérpera (Recém-nascido)' },
  { val: UserStage.MOM, label: 'Mãe experiente' },
];

export default function OnboardingStep3({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const { isDark, toggleTheme } = useTheme();
  const TOTAL_STEPS = 8;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#020617' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 mb-6">
        <TouchableOpacity accessibilityRole="button" onPress={prevStep} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Progress Dots */}
        <View className="flex-row gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: step > i + 1 ? '#60A5FA' : step === i + 1 ? '#60A5FA' : '#4B5563',
              }}
            />
          ))}
        </View>

        <TouchableOpacity accessibilityRole="button"
          onPress={toggleTheme}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: '#0B1220',
            borderWidth: 1,
            borderColor: 'rgba(148, 163, 184, 0.24)',
          }}
        >
          <Sun size={20} color="#FBBF24" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        <Text className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
          Prazer, {formData.name?.split(' ')[0] || 'mãe'}! Em que fase você está?
        </Text>
        <Text className="text-base mb-8" style={{ color: '#9CA3AF' }}>
          Vou adaptar meus conselhos para o seu momento.
        </Text>

        <View className="space-y-3">
          {stages.map((stage) => {
            const isSelected = formData.stage === stage.val;
            return (
              <TouchableOpacity accessibilityRole="button"
                key={stage.val}
                onPress={() => {
                  updateData('stage', stage.val);
                  nextStep();
                }}
                className="w-full p-4 rounded-xl border-2 flex-row items-center justify-between"
                style={{
                  borderColor: isSelected ? '#3B82F6' : 'rgba(148, 163, 184, 0.24)',
                  backgroundColor: '#0B1220',
                }}
                activeOpacity={0.7}
              >
                <Text className="text-base" style={{ color: '#FFFFFF' }}>
                  {stage.label}
                </Text>
                <View
                  className="w-5 h-5 rounded-full border-2 items-center justify-center"
                  style={{
                    borderColor: isSelected ? '#3B82F6' : 'rgba(148, 163, 184, 0.24)',
                  }}
                >
                  {isSelected && (
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
