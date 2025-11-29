import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useThemeColors } from '../../theme';
import { UserProfile } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function OnboardingStep1({ nextStep }: OnboardingStepProps) {
  const { toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background.canvas }}>
      {/* Top Right Sun Icon */}
      <View className="absolute top-6 right-6 z-10">
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

      {/* Progress Dots */}
      <View className="absolute top-6 left-1/2" style={{ transform: [{ translateX: -32 }] }}>
        <View className="flex-row gap-1">
          <View className="w-2 h-2 rounded-full bg-blue-400" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {/* Circular Illustration */}
        <View className="w-40 h-40 rounded-full mb-6 overflow-hidden border-6 border-white shadow-xl" style={{ borderColor: colors.background.card }}>
          <Image
            source={{ uri: 'https://i.imgur.com/GDYdiuy.jpg' }}
            className="w-full h-full"
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-center mb-1" style={{ color: colors.text.inverse }}>
          Oi, que bom que você{'\n'}chegou.
        </Text>

        {/* Italic Blue Text */}
        <Text className="text-base text-center mb-6 italic max-w-[280px]" style={{ color: colors.primary.main }}>
          "Aqui, você não precisa fingir que está{'\n'}tudo bem."
        </Text>

        {/* Description */}
        <Text className="text-sm text-center mb-10 max-w-[280px] leading-relaxed" style={{ color: colors.text.secondary }}>
          Eu sou a MãesValente. Quero criar um{'\n'}espaço seguro para você.{'\n'}Vamos conversar rapidinho?
        </Text>

        {/* Button */}
        <TouchableOpacity accessibilityRole="button"
          onPress={nextStep}
          className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
          style={{ backgroundColor: colors.primary.main }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">Começar agora</Text>
          <ArrowRight size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
