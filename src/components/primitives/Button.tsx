/**
 * Button - Componente Primitivo Robusto
 * 
 * Baseado em Material Design 3 + Apple HIG
 * Usa tokens do design system
 * 
 * @version 1.0
 * @date 2025-11-27
 */

import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS, SIZES } from '@/design-system';
import { SafeView, SafeText } from './SafeView';
import { getShadowFromToken } from '@/utils/shadowHelper';
import { getAnimationConfig } from '@/utils/animationHelper';
import { useTheme } from '@/theme/ThemeContext';

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

export const Button: React.FC<ButtonProps> = ({
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
  const { colors, isDark } = useTheme();
  const isDisabled = disabled || loading;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTILOS POR VARIANTE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const baseContainer: ViewStyle = {
      borderRadius: BORDERS.buttonRadius,
      borderWidth: BORDERS.buttonBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: SIZES.button[size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'],
    };

    const baseText: TextStyle = {
      ...TYPOGRAPHY.button,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? COLORS.neutral[300] : COLORS.primary[500],
            borderColor: 'transparent',
            ...getShadowFromToken('md', COLORS.primary[500]),
          },
          text: {
            ...baseText,
            color: COLORS.neutral[0], // Branco
          },
        };

      case 'secondary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? COLORS.neutral[200] : COLORS.purple[500],
            borderColor: 'transparent',
            ...getShadowFromToken('sm', COLORS.purple[500]),
          },
          text: {
            ...baseText,
            color: COLORS.neutral[0],
          },
        };

      case 'outline':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
            borderColor: isDisabled ? COLORS.neutral[300] : COLORS.primary[500],
          },
          text: {
            ...baseText,
            color: isDisabled ? COLORS.neutral[400] : COLORS.primary[500],
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
            color: isDisabled ? COLORS.neutral[400] : COLORS.primary[500],
          },
        };

      case 'danger':
        return {
          container: {
            ...baseContainer,
            backgroundColor: isDisabled ? COLORS.neutral[300] : COLORS.semantic.danger,
            borderColor: 'transparent',
            ...getShadowFromToken('sm', COLORS.semantic.danger),
          },
          text: {
            ...baseText,
            color: COLORS.neutral[0],
          },
        };

      default:
        return {
          container: baseContainer,
          text: baseText,
        };
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTILOS POR TAMANHO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[2],
          },
          text: {
            ...TYPOGRAPHY.buttonSm,
          },
        };

      case 'lg':
        return {
          container: {
            paddingHorizontal: SPACING[8],
            paddingVertical: SPACING[4],
          },
          text: {
            ...TYPOGRAPHY.button,
            fontSize: TYPOGRAPHY.h5.fontSize,
          },
        };

      default: // md
        return {
          container: {
            paddingHorizontal: SPACING[6],
            paddingVertical: SPACING[3],
          },
          text: {
            ...TYPOGRAPHY.button,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle: ViewStyle = {
    ...variantStyles.container,
    ...sizeStyles.container,
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={containerStyle}
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
          color={variantStyles.text.color}
        />
      ) : (
        <>
          {leftIcon && (
            <SafeView style={{ marginRight: SPACING[2] }}>
              {leftIcon}
            </SafeView>
          )}
          <SafeText
            style={[variantStyles.text, sizeStyles.text]}
            fallbackText={title}
          >
            {title}
          </SafeText>
          {rightIcon && (
            <SafeView style={{ marginLeft: SPACING[2] }}>
              {rightIcon}
            </SafeView>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;

