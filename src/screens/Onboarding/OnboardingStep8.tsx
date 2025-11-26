import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun, Brain, BookOpen, Heart, Users } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile, UserNeed } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const needs = [
  { val: UserNeed.CHAT, icon: Brain, title: 'Desabafar', sub: 'Conversar com alguém que entenda' },
  { val: UserNeed.LEARN, icon: BookOpen, title: 'Aprender', sub: 'Dicas práticas sobre o bebê' },
  { val: UserNeed.CALM, icon: Heart, title: 'Acalmar', sub: 'Respirar e diminuir ansiedade' },
  { val: UserNeed.CONNECT, icon: Users, title: 'Conectar', sub: 'Ver relatos de outras mães' },
];

export default function OnboardingStep8({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const { colors, isDark, toggleTheme } = useTheme();
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
          O que você mais precisa AGORA?
        </Text>
        <Text className="text-base mb-8" style={{ color: colors.text.tertiary }}>
          Vou configurar sua tela inicial baseada nisso.
        </Text>

        <View className="space-y-3 pb-4">
          {needs.map((n) => {
            const Icon = n.icon;
            const isSelected = formData.primaryNeed === n.val;
            return (
              <TouchableOpacity accessibilityRole="button"
                key={n.val}
                onPress={() => {
                  updateData('primaryNeed', n.val);
                  nextStep();
                }}
                className="w-full p-4 rounded-xl border flex-row items-center gap-4"
                style={{
                  borderColor: isSelected ? colors.primary.main : colors.border.light,
                  backgroundColor: colors.background.card,
                }}
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: colors.background.elevated,
                  }}
                >
                  <Icon size={20} color={colors.primary.main} />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-bold text-base mb-1"
                    style={{
                      color: colors.text.primary,
                    }}
                  >
                    {n.title}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{
                      color: colors.text.tertiary,
                    }}
                  >
                    {n.sub}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
