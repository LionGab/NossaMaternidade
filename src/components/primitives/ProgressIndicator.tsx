/**
 * ProgressIndicator Premium - Indicador de Progresso com Haptic Feedback
 * Suporta variantes linear e circular com animações suaves
 *
 * @example
 * <ProgressIndicator type="linear" progress={0.75} />
 * <ProgressIndicator type="circular" indeterminate />
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Tokens, ColorTokens } from '../../theme';
import { HapticPatterns, triggerHaptic } from '../../theme/haptics';

export type ProgressType = 'linear' | 'circular';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressIndicatorProps {
  /** Tipo do indicador */
  type?: ProgressType;
  /** Progresso (0-1) */
  progress?: number;
  /** Modo indeterminado (loading) */
  indeterminate?: boolean;
  /** Tamanho do indicador */
  size?: ProgressSize;
  /** Cor primária customizada */
  color?: string;
  /** Cor de fundo da track */
  trackColor?: string;
  /** Ativar haptic em milestones (25%, 50%, 75%, 100%) */
  hapticOnMilestones?: boolean;
  /** Estilos customizados */
  style?: ViewStyle;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  type = 'linear',
  progress = 0,
  indeterminate = false,
  size = 'md',
  color,
  trackColor,
  hapticOnMilestones = true,
  style,
  accessibilityLabel,
}) => {
  const { colors, isDark } = useTheme();

  // Refs para animações
  const progressAnim = useRef(new Animated.Value(0)).current;
  const indeterminateAnim = useRef(new Animated.Value(0)).current;
  const lastMilestone = useRef(0);

  // Cores
  const primaryColor = color || colors.primary.main;
  const bgTrackColor = trackColor || (isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)');

  // Tamanhos
  const getSizeValue = () => {
    switch (size) {
      case 'sm':
        return { height: 4, circular: 24 };
      case 'md':
        return { height: 8, circular: 40 };
      case 'lg':
        return { height: 12, circular: 56 };
      default:
        return { height: 8, circular: 40 };
    }
  };

  const sizeValue = getSizeValue();

  // Verificar milestones para haptic
  const checkMilestones = (value: number) => {
    if (!hapticOnMilestones) return;

    const milestones = [0.25, 0.5, 0.75, 1];
    for (const milestone of milestones) {
      if (value >= milestone && lastMilestone.current < milestone) {
        lastMilestone.current = milestone;
        if (milestone === 1) {
          triggerHaptic(HapticPatterns.success);
        } else {
          triggerHaptic(HapticPatterns.stepComplete);
        }
        break;
      }
    }
  };

  // Animação de progresso
  useEffect(() => {
    if (!indeterminate) {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      checkMilestones(clampedProgress);

      Animated.timing(progressAnim, {
        toValue: clampedProgress,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [progress, indeterminate]);

  // Animação indeterminada
  useEffect(() => {
    if (indeterminate) {
      const loop = Animated.loop(
        Animated.timing(indeterminateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      loop.start();
      return () => loop.stop();
    }
  }, [indeterminate]);

  // Renderizar indicador linear
  const renderLinear = () => {
    const width = indeterminate
      ? indeterminateAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['0%', '50%', '0%'],
        })
      : progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        });

    const translateX = indeterminate
      ? indeterminateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['-100%', '200%'],
        })
      : 0;

    return (
      <View
        style={[
          styles.linearTrack,
          {
            height: sizeValue.height,
            backgroundColor: bgTrackColor,
            borderRadius: sizeValue.height / 2,
          },
          style,
        ]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel || 'Indicador de progresso'}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: indeterminate ? undefined : Math.round(progress * 100),
        }}
      >
        <Animated.View
          style={[
            styles.linearProgress,
            {
              width,
              height: sizeValue.height,
              backgroundColor: primaryColor,
              borderRadius: sizeValue.height / 2,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    );
  };

  // Renderizar indicador circular
  const renderCircular = () => {
    const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
    const radius = (sizeValue.circular - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const rotation = indeterminate
      ? indeterminateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        })
      : '0deg';

    const strokeDashoffset = indeterminate
      ? circumference * 0.75
      : progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [circumference, 0],
        });

    return (
      <Animated.View
        style={[
          {
            width: sizeValue.circular,
            height: sizeValue.circular,
            transform: [{ rotate: rotation }],
          },
          style,
        ]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel || 'Indicador de progresso'}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: indeterminate ? undefined : Math.round(progress * 100),
        }}
      >
        {/* SVG simulado com Views */}
        <View
          style={[
            styles.circularTrack,
            {
              width: sizeValue.circular,
              height: sizeValue.circular,
              borderRadius: sizeValue.circular / 2,
              borderWidth: strokeWidth,
              borderColor: bgTrackColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circularProgress,
            {
              width: sizeValue.circular,
              height: sizeValue.circular,
              borderRadius: sizeValue.circular / 2,
              borderWidth: strokeWidth,
              borderColor: primaryColor,
              borderTopColor: 'transparent',
              borderRightColor: indeterminate ? 'transparent' : primaryColor,
              transform: [
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-90deg', '270deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    );
  };

  return type === 'linear' ? renderLinear() : renderCircular();
};

/**
 * Componente de progresso de passos (ex: onboarding)
 */
export const StepProgress: React.FC<{
  currentStep: number;
  totalSteps: number;
  style?: ViewStyle;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
}> = ({ currentStep, totalSteps, style, accessibilityLabel }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.stepContainer, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || `Passo ${currentStep + 1} de ${totalSteps}`}
      accessibilityValue={{
        min: 0,
        max: totalSteps,
        now: currentStep + 1,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            {
              backgroundColor:
                index < currentStep
                  ? colors.primary.main
                  : index === currentStep
                  ? colors.primary.main
                  : 'rgba(255, 255, 255, 0.3)',
              width: index === currentStep ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  linearTrack: {
    width: '100%',
    overflow: 'hidden',
  },
  linearProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
});

export default ProgressIndicator;
