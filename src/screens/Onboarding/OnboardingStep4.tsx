import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sun, Moon } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { Button } from '../../components';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function OnboardingStep4({ step, formData, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const TOTAL_STEPS = 9;
  const [sliderValue, setSliderValue] = useState(20);
  
  const isPregnant = formData.stage === 'Gestante';
  const maxVal = isPregnant ? 42 : 24;
  const label = isPregnant ? 'Semanas de gestação' : 'Meses do bebê';

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#020617' : '#FFFFFF' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 mb-6">
        <TouchableOpacity accessibilityRole="button" onPress={prevStep} className="p-2 -ml-2">
          <ArrowLeft size={24} color={colors.text.secondary} />
        </TouchableOpacity>

        <View className="flex-row gap-1">
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <View
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: step > i + 1 ? 16 : step === i + 1 ? 16 : 6,
                backgroundColor:
                  step > i + 1
                    ? colors.primary.main
                    : step === i + 1
                    ? `${colors.primary.main}80`
                    : isDark
                    ? colors.border.light
                    : '#E5E7EB',
              }}
            />
          ))}
        </View>

        <TouchableOpacity accessibilityRole="button"
          onPress={toggleTheme}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: isDark ? '#0B1220' : '#F3F4F6',
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color={colors.text.primary} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 justify-center items-center">
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
          Conta um pouquinho mais...
        </Text>
        <Text className="text-base mb-12 text-center" style={{ color: colors.text.secondary }}>
          {isPregnant
            ? 'Assim te aviso sobre sintomas comuns dessa semana.'
            : 'Para acompanhar os saltos de desenvolvimento.'}
        </Text>

        <Text className="text-6xl font-bold mb-2" style={{ color: colors.primary.main }}>
          {sliderValue}
        </Text>
        <Text className="text-sm font-medium mb-12 uppercase tracking-widest" style={{ color: colors.text.secondary }}>
          {isPregnant ? 'Semanas' : 'Meses'}
        </Text>

        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={maxVal}
          value={sliderValue}
          onValueChange={setSliderValue}
          minimumTrackTintColor={colors.primary.main}
          maximumTrackTintColor={isDark ? colors.border.light : '#E5E7EB'}
          thumbTintColor={colors.primary.main}
        />
      </View>

      <View className="px-6 pb-8">
        <Button
          title="Confirmar"
          onPress={() => {
            updateData('timelineInfo', `${sliderValue} ${isPregnant ? 'semanas' : 'meses'}`);
            nextStep();
          }}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

