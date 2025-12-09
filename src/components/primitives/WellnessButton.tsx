/**
 * 🔘 WellnessButton Component - Primitive
 *
 * Button component com Wellness Design System
 * Design inspirado em Flo, Calm, Clue
 *
 * @example
 * ```tsx
 * <WellnessButton variant="primary" size="md" onPress={() => {}}>
 *   Começar agora
 * </WellnessButton>
 * ```
 */

import * as Haptics from 'expo-haptics';
import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Tokens } from '../../theme/tokens';

import { Text } from './Text';

export interface WellnessButtonProps {
  // Content
  children: React.ReactNode;
  onPress: () => void;

  // Variants
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  // State
  loading?: boolean;
  disabled?: boolean;

  // Layout
  fullWidth?: boolean;

  // Accessibility
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const WellnessButton: React.FC<WellnessButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  hapticFeedback = true,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { isDark } = useTheme();
  const theme = isDark ? Tokens.wellness.dark : Tokens.wellness.light;

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  // Get button base style from component tokens
  const getBaseStyle = () => {
    return Tokens.wellness.components.button.sizes[size];
  };

  // Get button background color
  const getBackgroundColor = (): string => {
    if (variant === 'ghost') return 'transparent';
    if (variant === 'outline') return 'transparent';

    if (variant === 'primary') return theme.brand.primary;
    if (variant === 'secondary') return theme.brand.secondary;

    return theme.brand.primary;
  };

  // Get button text color
  const getTextColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return theme.brand.primary;
    }

    return theme.text.inverse;
  };

  // Get border color
  const getBorderColor = (): string | undefined => {
    if (variant === 'outline') return theme.brand.primary;
    return undefined;
  };

  const baseStyle = getBaseStyle();

  const buttonStyle: ViewStyle = {
    ...baseStyle,
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 2 : 0,
    borderRadius: Tokens.wellness.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled || loading ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    ...(variant === 'primary' && Tokens.wellness.shadows.primary),
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: baseStyle.fontSize,
    fontWeight: '600',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={buttonStyle}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default WellnessButton;
