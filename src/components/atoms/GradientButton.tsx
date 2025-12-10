/**
 * GradientButton - Botão com gradiente embutido
 *
 * Componente de botão com gradiente de cores personalizável,
 * feedback háptico integrado e suporte a ícones.
 *
 * @requires expo-linear-gradient
 * @requires expo-haptics
 *
 * @example
 * <GradientButton
 *   title="Entrar"
 *   onPress={handleLogin}
 *   gradientColors={['#FF6B9D', '#BA68C8']}
 * />
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

export type GradientButtonSize = 'sm' | 'md' | 'lg';

export interface GradientButtonProps {
  /** Texto do botão */
  title: string;
  /** Handler de clique */
  onPress?: () => void;
  /** Cores do gradiente (array de cores) */
  gradientColors?: string[];
  /** Ponto de início do gradiente (x, y) */
  startPoint?: { x: number; y: number };
  /** Ponto de fim do gradiente (x, y) */
  endPoint?: { x: number; y: number };
  /** Tamanho do botão */
  size?: GradientButtonSize;
  /** Estado de carregamento */
  loading?: boolean;
  /** Estado desabilitado */
  disabled?: boolean;
  /** Ocupar largura total */
  fullWidth?: boolean;
  /** Ícone à esquerda */
  leftIcon?: React.ReactNode;
  /** Ícone à direita */
  rightIcon?: React.ReactNode;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Estilos customizados do container */
  style?: ViewStyle;
  /** Estilos customizados do texto */
  textStyle?: TextStyle;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
  /** Hint de acessibilidade */
  accessibilityHint?: string;
  /** Test ID para testes */
  testID?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradientColors = ['#FF6B9D', '#BA68C8'], // Rosa → Roxo (padrão)
  startPoint = { x: 0, y: 0 },
  endPoint = { x: 1, y: 0 }, // Gradiente horizontal (esquerda → direita)
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disableHaptic = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const handlePress = useCallback(() => {
    if (isDisabled) return;

    // Haptic feedback (iOS/Android)
    if (!disableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress?.();
  }, [isDisabled, disableHaptic, onPress]);

  // Estilos baseados no tamanho
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: Tokens.spacing['2.5'],
            paddingHorizontal: Tokens.spacing['4'],
            minHeight: 44, // 44pt mínimo para acessibilidade (iOS)
          },
          text: {
            fontSize: Tokens.typography.sizes.sm,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: Tokens.spacing['4'],
            paddingHorizontal: Tokens.spacing['8'],
            minHeight: 56,
          },
          text: {
            fontSize: Tokens.typography.sizes.lg,
          },
        };
      default: // md
        return {
          container: {
            paddingVertical: Tokens.spacing['3'],
            paddingHorizontal: Tokens.spacing['6'],
            minHeight: 48,
          },
          text: {
            fontSize: Tokens.typography.sizes.base,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Cores do gradiente (se disabled, usar cinza)
  // Garantir que sempre tenha pelo menos 2 elementos para o tipo readonly [string, string, ...string[]]
  const finalGradientColors: readonly [string, string, ...string[]] = (() => {
    if (isDisabled) {
      return [colors.text.disabled, colors.border.medium];
    }
    if (gradientColors.length >= 2) {
      return gradientColors as unknown as readonly [string, string, ...string[]];
    }
    // Fallback: garantir pelo menos 2 cores
    return [gradientColors[0] || '#FF6B9D', gradientColors[1] || '#BA68C8', ...gradientColors.slice(2)];
  })();

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.touchableContainer,
        fullWidth && styles.fullWidth,
        style,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      <LinearGradient
        colors={finalGradientColors}
        start={startPoint}
        end={endPoint}
        style={[
          styles.gradient,
          sizeStyles.container,
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                sizeStyles.text,
                textStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: Tokens.radius.full, // Botão pill (fully rounded)
    overflow: 'hidden', // Clip do gradiente
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Tokens.radius.full,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF', // Texto sempre branco (contraste com gradiente rosa/roxo)
    fontWeight: '700', // Bold
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: Tokens.spacing['2'],
  },
  rightIcon: {
    marginLeft: Tokens.spacing['2'],
  },
});

export default GradientButton;
