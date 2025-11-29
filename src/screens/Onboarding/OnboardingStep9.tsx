import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Check, Bell, Shield } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { UserProfile } from '../../types/user';

interface OnboardingStepProps {
  step: number;
  formData: UserProfile;
  updateData: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  onFinish: () => void;
}

export default function OnboardingStep9({ formData, updateData, onFinish }: OnboardingStepProps) {
  const { colors, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.background.canvas }}>
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

      {/* Check Icon */}
      <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: `${colors.status.success}33` }}>
        <Check size={48} color={colors.status.success} strokeWidth={3} />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold mb-4 text-center" style={{ color: colors.text.primary }}>
        Tudo pronto, {formData.name?.split(' ')[0] || 'mãe'}!
      </Text>

      {/* Description */}
      <Text className="text-base mb-8 text-center max-w-[280px]" style={{ color: colors.text.secondary }}>
        Configurei o app para te ajudar com{' '}
        <Text className="font-bold">{formData.biggestChallenge?.toLowerCase()}</Text>.{'\n'}
        Seu refúgio está preparado.
      </Text>

      {/* Notification Permission Card */}
      <View
        className="bg-nath-dark-card p-4 rounded-xl w-full mb-8 flex-row items-center gap-3"
        style={{
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <View className="bg-orange-900/20 p-2 rounded-full">
          <Bell size={20} color={colors.raw.accent.orange} />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
            Lembretes de autocuidado
          </Text>
          <Text className="text-[10px]" style={{ color: colors.text.tertiary }}>
            Posso te mandar um carinho por dia?
          </Text>
        </View>
        <Switch
          value={formData.notificationsEnabled || false}
          onValueChange={(value) => updateData('notificationsEnabled', value)}
          trackColor={{ false: colors.text.disabled, true: colors.primary.main }}
          thumbColor={colors.text.inverse}
        />
      </View>

      {/* Button */}
      <TouchableOpacity accessibilityRole="button"
        onPress={onFinish}
        className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
        style={{ backgroundColor: colors.primary.main }}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base" style={{ color: colors.text.inverse }}>Entrar na minha casa</Text>
        <Shield size={20} color={colors.text.inverse} />
      </TouchableOpacity>

      {/* Footer */}
      <View className="flex-row items-center gap-1 mt-4">
        <Shield size={10} color={colors.text.tertiary} />
        <Text className="text-[10px]" style={{ color: colors.text.tertiary }}>
          Seus dados estão seguros comigo.
        </Text>
      </View>
    </SafeAreaView>
  );
}
