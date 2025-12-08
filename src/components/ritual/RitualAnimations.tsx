/**
 * RitualAnimations - Animações de fundo para Ritual
 *
 * Componente que renderiza animações de fundo baseadas no tipo de passo do ritual.
 * Referência: app-redesign-studio-ab40635e/src/components/ritual/RitualAnimations.tsx
 * Adaptado para React Native com react-native-reanimated e LinearGradient.
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';
import { ColorTokens } from '@/theme/tokens';
import type { RitualStepType, AnimationType } from '@/types/ritual';

interface RitualAnimationsProps {
  animationType?: AnimationType | 'none';
  stepType?: RitualStepType;
  progress?: number; // 0-100
}

// Componente separado para cada partícula (resolve erro de hooks)
interface ParticleProps {
  index: number;
  isDark: boolean;
}

const Particle = React.memo(function Particle({ index, isDark }: ParticleProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Posição fixa baseada no index para evitar re-renders
  const leftPercent = useMemo(() => (index * 5) % 100, [index]);
  const duration = useMemo(() => 2000 + (index * 150), [index]);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-100, {
        duration,
        easing: Easing.linear,
      }),
      -1
    );
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [translateY, opacity, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute' as const,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: isDark
            ? `${ColorTokens.secondary[400]}30`
            : `${ColorTokens.secondary[400]}30`,
        },
        { left: `${leftPercent}%`, top: '100%' },
        animatedStyle,
      ]}
    />
  );
});

// Partículas flutuantes
const Particles = React.memo(function Particles({ isDark }: { isDark: boolean }) {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((i) => (
        <Particle key={i} index={i} isDark={isDark} />
      ))}
    </View>
  );
});

// Ondas de energia
const Waves = React.memo(function Waves({ isDark }: { isDark: boolean }) {
  const scale1 = useSharedValue(0);
  const scale2 = useSharedValue(0);
  const scale3 = useSharedValue(0);
  const opacity1 = useSharedValue(0.8);
  const opacity2 = useSharedValue(0.8);
  const opacity3 = useSharedValue(0.8);

  useEffect(() => {
    scale1.value = withRepeat(
      withTiming(2.5, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      }),
      -1
    );
    opacity1.value = withRepeat(
      withTiming(0, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      }),
      -1
    );

    const timeout1 = setTimeout(() => {
      scale2.value = withRepeat(
        withTiming(2.5, {
          duration: 3000,
          easing: Easing.out(Easing.ease),
        }),
        -1
      );
      opacity2.value = withRepeat(
        withTiming(0, {
          duration: 3000,
          easing: Easing.out(Easing.ease),
        }),
        -1
      );
    }, 1000);

    const timeout2 = setTimeout(() => {
      scale3.value = withRepeat(
        withTiming(2.5, {
          duration: 3000,
          easing: Easing.out(Easing.ease),
        }),
        -1
      );
      opacity3.value = withRepeat(
        withTiming(0, {
          duration: 3000,
          easing: Easing.out(Easing.ease),
        }),
        -1
      );
    }, 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [scale1, scale2, scale3, opacity1, opacity2, opacity3]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: opacity3.value,
  }));

  const borderColor = isDark
    ? `${ColorTokens.secondary[400]}20`
    : `${ColorTokens.secondary[400]}20`;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 256,
            height: 256,
            borderRadius: 128,
            borderWidth: 2,
            borderColor,
          },
          animatedStyle1,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 256,
            height: 256,
            borderRadius: 128,
            borderWidth: 2,
            borderColor,
          },
          animatedStyle2,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 256,
            height: 256,
            borderRadius: 128,
            borderWidth: 2,
            borderColor,
          },
          animatedStyle3,
        ]}
      />
    </View>
  );
});

// Gradiente animado
const Gradient = React.memo(function Gradient({
  progress,
  isDark
}: {
  progress: number;
  isDark: boolean;
}) {
  const hue = useSharedValue((progress * 3.6 + 340) % 360);

  useEffect(() => {
    hue.value = withRepeat(
      withTiming((progress * 3.6 + 340 + 40) % 360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1
    );
  }, [hue, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.3,
  }));

  const hue1 = (progress * 3.6 + 340) % 360;
  const hue2 = ((progress * 3.6 + 340 + 40) % 360);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <LinearGradient
        colors={
          isDark
            ? [`hsl(${hue1}, 75%, 35%)`, `hsl(${hue2}, 60%, 45%)`] as const
            : [`hsl(${hue1}, 75%, 65%)`, `hsl(${hue2}, 60%, 75%)`] as const
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
});

// Pulso
const Pulse = React.memo(function Pulse(_props: { isDark: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            width: 128,
            height: 128,
            borderRadius: 64,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[
            `${ColorTokens.secondary[400]}20`,
            `${ColorTokens.primary[400]}20`,
          ] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
});

export function RitualAnimations({
  animationType = 'gradient',
  stepType,
  progress = 0,
}: RitualAnimationsProps) {
  const { isDark } = useTheme();

  // Determinar animação baseada no tipo de passo (hooks antes do return condicional)
  const finalAnimationType = useMemo((): AnimationType | 'none' => {
    if (animationType === 'none') return 'none';
    if (animationType !== 'gradient') return animationType as AnimationType;

    switch (stepType) {
      case 'breathing':
        return 'pulse';
      case 'gratitude':
        return 'particles';
      case 'visualization':
        return 'waves';
      default:
        return 'gradient';
    }
  }, [animationType, stepType]);

  if (finalAnimationType === 'none') return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]} pointerEvents="none">
      {finalAnimationType === 'particles' && <Particles isDark={isDark} />}
      {finalAnimationType === 'waves' && <Waves isDark={isDark} />}
      {finalAnimationType === 'gradient' && <Gradient progress={progress} isDark={isDark} />}
      {finalAnimationType === 'pulse' && <Pulse isDark={isDark} />}
    </View>
  );
}
