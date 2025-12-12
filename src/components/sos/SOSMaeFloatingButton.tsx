/**
 * SOSMaeFloatingButton - Botão flutuante de acesso rápido ao SOS Mãe
 *
 * Botão flutuante com animação de pulso para acesso rápido ao SOS Mãe
 * em qualquer tela do app.
 * 
 * Otimizado para iOS (App Store) com SafeArea support.
 * 
 * Referência: app-redesign-studio-ab40635e/src/components/sos/SOSMaeFloatingButton.tsx
 * Adaptado para React Native com react-native-reanimated.
 */

import { AlertCircle } from 'lucide-react-native';
import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { PlatformNavigation } from '@/theme/platform';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SOSMaeFloatingButtonProps {
  style?: object;
}

export function SOSMaeFloatingButton({ style }: SOSMaeFloatingButtonProps) {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  // Cálculo dinâmico da posição: SafeArea + altura da tab bar + espaçamento
  const tabBarHeight = PlatformNavigation.tabBarHeight;
  const bottomOffset = insets.bottom + tabBarHeight + Tokens.spacing['4'];

  // Animação de pulso contínuo
  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.3, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('SOSMae');
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: bottomOffset,
          right: Tokens.spacing['4'],
          zIndex: 50,
          ...Platform.select({
            ios: {
              // iOS: garantir que está acima de tudo
              elevation: 10,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        style,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="SOS Mãe - Ajuda emocional urgente"
        accessibilityHint="Toque para acessar suporte emergencial, recursos de ajuda e contatos de emergência para mães"
        style={{
          minWidth: 64,
          minHeight: 64,
          ...Platform.select({
            ios: {
              // iOS: garantir touch target mínimo
              minWidth: 44,
              minHeight: 44,
            },
          }),
        }}
      >
        <Animated.View style={buttonAnimatedStyle}>
          {/* Badge de pulso */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                inset: -4,
                borderRadius: 32,
                backgroundColor: isDark ? ColorTokens.secondary[600] : ColorTokens.secondary[500],
              },
              pulseAnimatedStyle,
            ]}
          />

          {/* Botão principal */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              overflow: 'hidden',
              ...Tokens.shadows.xl,
            }}
          >
            <LinearGradient
              colors={
                isDark
                  ? [ColorTokens.secondary[600], ColorTokens.secondary[500]]
                  : [ColorTokens.secondary[500], ColorTokens.secondary[600]]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={28} color={ColorTokens.neutral[0]} />
            </LinearGradient>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

