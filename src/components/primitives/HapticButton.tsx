/**
 * HapticButton - Botão Premium com Feedback Tátil
 * Componente de botão com haptic feedback integrado
 *
 * @requires expo-haptics
 * @example
 * <HapticButton variant="primary" onPress={handlePress}>
 *   Clique aqui
 * </HapticButton>
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Tokens } from '../../theme';
import { HapticPatterns, triggerHaptic } from '../../theme/haptics';
import { logger } from '../../utils/logger';

export type HapticButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type HapticButtonSize = 'sm' | 'md' | 'lg';

export interface HapticButtonProps {
  /** Conteúdo do botão */
  children: React.ReactNode;
  /** Variante visual do botão */
  variant?: HapticButtonVariant;
  /** Tamanho do botão */
  size?: HapticButtonSize;
  /** Handler de clique */
  onPress?: () => void;
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
  /** Estado de acessibilidade */
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onPress,
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
  accessibilityState,
}) => {
  const { colors } = useTheme();

  const handlePress = useCallback(() => {
    if (disabled || loading) {
      logger.debug('[HapticButton] Press blocked', { disabled, loading });
      return;
    }

    logger.debug('[HapticButton] Press triggered', { onPress: !!onPress });

    if (!disableHaptic) {
      triggerHaptic(HapticPatterns.buttonPress);
    }

    if (onPress) {
      logger.debug('[HapticButton] Calling onPress');
      onPress();
    } else {
      logger.warn('[HapticButton] onPress is undefined');
    }
  }, [disabled, loading, disableHaptic, onPress]);

  // Estilos baseados na variante
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: disabled
              ? colors.text.disabled
              : colors.primary.main,
          },
          text: {
            color: colors.raw.neutral[0],
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: disabled
              ? colors.text.disabled
              : colors.secondary.main,
          },
          text: {
            color: colors.raw.neutral[0],
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: disabled
              ? colors.text.disabled
              : colors.primary.main,
          },
          text: {
            color: disabled ? colors.text.disabled : colors.primary.main,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: disabled ? colors.text.disabled : colors.primary.main,
          },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  // Estilos baseados no tamanho
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: Tokens.spacing['2.5'],
            paddingHorizontal: Tokens.spacing['3'],
            borderRadius: Tokens.radius.md,
            minHeight: Tokens.touchTargets.min, // 44pt mínimo para acessibilidade
          },
          text: {
            fontSize: Tokens.typography.sizes.sm,
          },
        };
      case 'md':
        return {
          container: {
            paddingVertical: Tokens.spacing['3'],
            paddingHorizontal: Tokens.spacing['4'],
            borderRadius: Tokens.radius.lg,
            minHeight: 44,
          },
          text: {
            fontSize: Tokens.typography.sizes.base,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: Tokens.spacing['4'],
            paddingHorizontal: Tokens.spacing['6'],
            borderRadius: Tokens.radius.xl,
            minHeight: 56,
          },
          text: {
            fontSize: Tokens.typography.sizes.lg,
          },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Use Pressable for better web compatibility
  const Component = Platform.OS === 'web' ? Pressable : Pressable;

  return (
    <Component
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        style,
        pressed && Platform.OS !== 'web' && { opacity: 0.7 },
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState || {
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost'
            ? colors.primary.main
            : colors.raw.neutral[0]
          }
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.text,
                sizeStyles.text,
                variantStyles.text,
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default HapticButton;
