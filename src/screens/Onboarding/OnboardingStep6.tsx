import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile, UserChallenge } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const challenges = Object.values(UserChallenge);

export default function OnboardingStep6({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
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
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
          O que mais pesa no seu coração agora?
        </Text>
        <Text className="text-base mb-8" style={{ color: '#9CA3AF' }}>
          Vou priorizar conteúdos para te ajudar nisso.
        </Text>

        <View className="space-y-3 pb-4">
          {challenges.map((challenge) => {
            const isSelected = formData.biggestChallenge === challenge;
            return (
              <TouchableOpacity accessibilityRole="button"
                key={challenge}
                onPress={() => {
                  updateData('biggestChallenge', challenge);
                  nextStep();
                }}
                className="w-full p-4 rounded-xl"
                style={{
                  backgroundColor: isSelected ? '#5D4E4B' : '#0B1220',
                  borderWidth: 1,
                  borderColor: isSelected ? '#5D4E4B' : 'transparent',
                }}
                activeOpacity={0.7}
              >
                <Text
                  className="text-base"
                  style={{
                    color: isSelected ? '#FFFFFF' : '#FFFFFF',
                  }}
                >
                  {challenge}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
