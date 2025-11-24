import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressIndicator, Button, Input, Avatar } from '../components';
import { Colors } from '../constants/Colors';
import { useHaptics } from '../hooks/useHaptics';
import { nathAvatar } from '../assets/images';

interface OnboardingStep2Props {
  onNext: (name: string) => void;
}

export default function OnboardingStep2({ onNext }: OnboardingStep2Props) {
  const [name, setName] = useState('');
  const haptics = useHaptics();

  const handleNext = () => {
    if (name.trim()) {
      haptics.light();
      onNext(name.trim());
    }
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
          <ProgressIndicator currentStep={2} totalSteps={8} className="flex-1 mx-4" />
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
      <View className="flex-1 px-8 justify-center">
        {/* Title */}
        <Text
          className="text-3xl font-bold mb-2"
          style={{ color: Colors.text.primary }}
        >
          Como você gosta de ser chamada?
        </Text>

        {/* Subtitle */}
        <Text
          className="text-base mb-8"
          style={{ color: Colors.text.secondary }}
        >
          Quero que nossa conversa seja íntima, como amigas.
        </Text>

        {/* Input */}
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Seu nome ou apelido"
          placeholderTextColor={Colors.text.tertiary}
          className="mb-6"
        />

        {/* Button */}
        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={!name.trim()}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

