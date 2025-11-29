/**
 * Button - Componente Primitivo Robusto
 * 
 * Baseado em Material Design 3 + Apple HIG
 * Usa tokens do design system
 * 
 * @version 1.0
 * @date 2025-11-27
 */

import React, { useMemo, useCallback } from 'react';
import { Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';
import { SafeView, SafeText } from './SafeView';
import { triggerPlatformHaptic, isIOS, isAndroid, getPlatformShadow } from '@/theme/platform';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Texto do botão */
  title: string;
  /** Handler de clique */
  onPress?: () => void;
  /** Variante visual */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
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
  /** Estilos customizados */
  style?: ViewStyle;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
  /** Hint de acessibilidade */
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = React.memo(({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  // Handler com haptic feedback
  const handlePress = useCallback(() => {
    if (!isDisabled && onPress) {
      triggerPlatformHaptic('buttonPress');
      onPress();
    }
  }, [isDisabled, onPress]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTILOS POR VARIANTE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const variantStyles = useMemo((): { container: ViewStyle; text: TextStyle } => {
    const baseContainer: ViewStyle = {
      borderRadius: Tokens.radius.lg,
      borderWidth: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: Tokens.touchTargets.min,
      // Platform-specific shadow/elevation
      ...getPlatformShadow('md'),
    };

    const baseText: TextStyle = {
      fontSize: Tokens.typography.sizes.md,
      fontWeight: Tokens.typography.weights.semibold,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? colors.text.disabled : colors.primary.main,
            borderColor: 'transparent',
          },
          text: {
            ...baseText,
            color: colors.text.inverse,
          },
        };

      case 'secondary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? colors.border.light : colors.secondary.main,
            borderColor: 'transparent',
          },
          text: {
            ...baseText,
            color: colors.text.inverse,
          },
        };

      case 'outline':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
            borderColor: isDisabled ? colors.border.light : colors.primary.main,
          },
          text: {
            ...baseText,
            color: isDisabled ? colors.text.disabled : colors.primary.main,
          },
        };

      case 'ghost':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            ...baseText,
            color: isDisabled ? colors.text.disabled : colors.primary.main,
          },
        };

      case 'danger':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? colors.text.disabled : colors.status.error,
            borderColor: 'transparent',
          },
          text: {
            ...baseText,
            color: colors.text.inverse,
          },
        };

      default:
        return {
          container: baseContainer,
          text: baseText,
        };
    }
  }, [isDisabled, colors]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTILOS POR TAMANHO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const sizeStyles = useMemo((): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: Tokens.spacing['4'],
            paddingVertical: Tokens.spacing['2'],
          },
          text: {
            fontSize: Tokens.typography.sizes.sm,
            fontWeight: Tokens.typography.weights.semibold,
          },
        };

      case 'lg':
        return {
          container: {
            paddingHorizontal: Tokens.spacing['8'],
            paddingVertical: Tokens.spacing['4'],
          },
          text: {
            fontSize: Tokens.typography.sizes.lg,
            fontWeight: Tokens.typography.weights.bold,
          },
        };

      default: // md
        return {
          container: {
            paddingHorizontal: Tokens.spacing['6'],
            paddingVertical: Tokens.spacing['3'],
          },
          text: {
            fontSize: Tokens.typography.sizes.md,
            fontWeight: Tokens.typography.weights.semibold,
          },
        };
    }
  }, [size]);

  const containerStyle: ViewStyle = useMemo(() => ({
    ...variantStyles.container,
    ...sizeStyles.container,
    ...(fullWidth && { width: '100%' }),
    ...style,
  }), [variantStyles, sizeStyles, fullWidth, style]);

  // Android ripple effect
  const androidRipple = isAndroid ? {
    color: colors.text.primary,
    borderless: false,
  } : undefined;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        containerStyle,
        pressed && {
          opacity: isIOS ? 0.7 : 0.8,
        },
      ]}
      android_ripple={androidRipple}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text?.color || colors.text.inverse}
        />
      ) : (
        <>
          {leftIcon && (
            <SafeView style={{ marginRight: Tokens.spacing['2'] }}>
              {leftIcon}
            </SafeView>
          )}
          <SafeText
            style={[{ ...variantStyles.text, ...sizeStyles.text }]}
            fallbackText={title}
          >
            {title}
          </SafeText>
          {rightIcon && (
            <SafeView style={{ marginLeft: Tokens.spacing['2'] }}>
              {rightIcon}
            </SafeView>
          )}
        </>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';

export default Button;

