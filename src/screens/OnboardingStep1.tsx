import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressIndicator, Button, Avatar } from '../components';
import { Colors } from '../theme';
import { useHaptics } from '../hooks/useHaptics';
import { Ionicons } from '@expo/vector-icons';
import { nathAvatar } from '../assets/images';

interface OnboardingStep1Props {
  onNext: () => void;
}

export default function OnboardingStep1({ onNext }: OnboardingStep1Props) {
  const haptics = useHaptics();

  const handleNext = () => {
    haptics.light();
    onNext();
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background.dark }}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-8">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1" />
          <ProgressIndicator currentStep={1} totalSteps={8} className="flex-1 mx-4" />
          <Avatar
            size={40}
            source={nathAvatar}
            onPress={() => {
              // Toggle theme ou abrir menu
            }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Illustration */}
        <View className="w-64 h-64 rounded-full mb-8 items-center justify-center bg-warm/20">
          <Text className="text-8xl">🤱</Text>
        </View>

        {/* Title */}
        <Text
          className="text-3xl font-bold text-center mb-4"
          style={{ color: Colors.text.primary }}
        >
          Oi, que bom que você chegou.
        </Text>

        {/* Quote */}
        <Text
          className="text-lg italic text-center mb-4"
          style={{ color: Colors.primary.main }}
        >
          "Aqui, você não precisa fingir que está tudo bem."
        </Text>

        {/* Description */}
        <Text
          className="text-base text-center mb-8 leading-6"
          style={{ color: Colors.text.secondary }}
        >
          Eu sou a MãesValentes. Quero criar um espaço seguro para você. Vamos
          conversar rapidinho?
        </Text>

        {/* Button */}
        <Button
          title="Começar agora"
          onPress={handleNext}
          fullWidth
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}

