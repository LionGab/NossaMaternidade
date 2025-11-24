import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Check, Bell, Shield } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: (key: keyof UserProfile, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  onFinish: () => void;
}

export default function OnboardingStep9({ formData, updateData, onFinish }: OnboardingStepProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 items-center justify-center px-6" style={{ backgroundColor: '#020617' }}>
      {/* Top Right Sun Icon */}
      <View className="absolute top-6 right-6 z-10">
        <TouchableOpacity
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

      {/* Check Icon */}
      <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: '#065F4633' }}>
        <Check size={48} color="#34D399" strokeWidth={3} />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold mb-4 text-center" style={{ color: '#FFFFFF' }}>
        Tudo pronto, {formData.name?.split(' ')[0] || 'mãe'}!
      </Text>

      {/* Description */}
      <Text className="text-base mb-8 text-center max-w-[280px]" style={{ color: '#D1D5DB' }}>
        Configurei o app para te ajudar com{' '}
        <Text className="font-bold">{formData.biggestChallenge?.toLowerCase()}</Text>.{'\n'}
        Seu refúgio está preparado.
      </Text>

      {/* Notification Permission Card */}
      <View
        className="bg-nath-dark-card p-4 rounded-xl w-full mb-8 flex-row items-center gap-3"
        style={{
          backgroundColor: '#0B1220',
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.24)',
        }}
      >
        <View className="bg-orange-900/20 p-2 rounded-full">
          <Bell size={20} color="#FB923C" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1" style={{ color: '#FFFFFF' }}>
            Lembretes de autocuidado
          </Text>
          <Text className="text-[10px]" style={{ color: '#9CA3AF' }}>
            Posso te mandar um carinho por dia?
          </Text>
        </View>
        <Switch
          value={formData.notificationsEnabled || false}
          onValueChange={(value) => updateData('notificationsEnabled', value)}
          trackColor={{ false: '#4B5563', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={onFinish}
        className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
        style={{ backgroundColor: '#3B82F6' }}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">Entrar na minha casa</Text>
        <Shield size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex-row items-center gap-1 mt-4">
        <Shield size={10} color="#9CA3AF" />
        <Text className="text-[10px]" style={{ color: '#9CA3AF' }}>
          Seus dados estão seguros comigo.
        </Text>
      </View>
    </SafeAreaView>
  );
}
