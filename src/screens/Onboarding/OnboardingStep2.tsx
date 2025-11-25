import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function OnboardingStep2({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
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
      <View className="flex-1 px-6 justify-center">
        <Text className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
          Como você gosta de ser chamada?
        </Text>
        <Text className="text-base mb-8" style={{ color: '#9CA3AF' }}>
          Quero que nossa conversa seja íntima, como amigas.
        </Text>

        <TextInput accessibilityLabel="Text input field"
          value={formData.name || ''}
          onChangeText={(text) => updateData('name', text)}
          placeholder="Seu nome ou apelido"
          placeholderTextColor="#9CA3AF"
          autoFocus
          className="w-full px-4 py-4 rounded-xl border text-base"
          style={{
            backgroundColor: '#0B1220',
            borderColor: 'rgba(148, 163, 184, 0.24)',
            color: '#FFFFFF',
          }}
        />
      </View>

      {/* Button */}
      <View className="px-6 pb-8">
        <TouchableOpacity accessibilityRole="button"
          onPress={nextStep}
          disabled={!formData.name}
          className="w-full py-4 rounded-xl items-center justify-center"
          style={{
            backgroundColor: formData.name ? '#3B82F6' : '#1D2843',
            opacity: formData.name ? 1 : 0.5,
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
