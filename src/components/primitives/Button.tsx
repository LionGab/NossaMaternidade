/**
 * Button Component - Modern Interactive Primitive
 * Baseado em shadcn/ui + Material Design 3
 * 
 * @version 3.0.0
 */

import React, { useCallback } from 'react';
import { Pressable, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export type ButtonVariant = 
  | 'default' 
  | 'primary' // Primary Action: rounded-full font-bold shadow-lg
  | 'secondary' 
  | 'destructive' 
  | 'outline' 
  | 'ghost' 
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  
  // Variant & Size
  variant?: ButtonVariant;
  size?: ButtonSize;
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Layout
  fullWidth?: boolean;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  // Custom styles
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = React.memo<ButtonProps>(({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  textStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  const isDisabled = disabled || loading;

  // Variant styles
  const getVariantStyle = useCallback((): { container: ViewStyle; text: TextStyle } => {
    const base: ViewStyle = {
      borderWidth: 1,
      borderRadius: ModernTokens.radius.md,
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...base,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderRadius: Tokens.radius.full, // rounded-full
            ...Tokens.shadows.lg, // shadow-lg
          },
          text: {
            color: colors.primaryForeground,
            fontWeight: Tokens.typography.weights.bold, // font-bold
          },
        };

      case 'default':
        return {
          container: {
            ...base,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primaryForeground,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          },
        };

      case 'secondary':
        return {
          container: {
            ...base,
            backgroundColor: colors.secondary,
            borderColor: colors.secondary,
          },
          text: {
            color: colors.secondaryForeground,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          },
        };

      case 'destructive':
        return {
          container: {
            ...base,
            backgroundColor: colors.destructive,
            borderColor: colors.destructive,
          },
          text: {
            color: colors.destructiveForeground,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          },
        };

      case 'outline':
        return {
          container: {
            ...base,
            backgroundColor: 'transparent',
            borderColor: colors.input,
          },
          text: {
            color: colors.foreground,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          },
        };

      case 'ghost':
        return {
          container: {
            ...base,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            color: colors.foreground,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          },
        };

      case 'link':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: colors.primary,
            fontWeight: ModernTokens.typography.fontWeight.medium,
            textDecorationLine: 'underline',
          },
        };

      default:
        return {
          container: base,
          text: {},
        };
    }
  }, [variant, colors]);

  // Size styles
  const getSizeStyle = useCallback((): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: ModernTokens.spacing['3'],
            paddingVertical: ModernTokens.spacing['1.5'],
            minHeight: 36,
          },
          text: {
            fontSize: ModernTokens.typography.fontSize.sm,
          },
        };

      case 'lg':
        return {
          container: {
            paddingHorizontal: ModernTokens.spacing['8'],
            paddingVertical: ModernTokens.spacing['4'],
            minHeight: 56,
          },
          text: {
            fontSize: ModernTokens.typography.fontSize.lg,
          },
        };

      case 'icon':
        return {
          container: {
            width: 40,
            height: 40,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          text: {
            fontSize: ModernTokens.typography.fontSize.base,
          },
        };

      default: // 'default'
        return {
          container: {
            paddingHorizontal: ModernTokens.spacing['4'],
            paddingVertical: ModernTokens.spacing['2'],
            minHeight: 44,
          },
          text: {
            fontSize: ModernTokens.typography.fontSize.base,
          },
        };
    }
  }, [size]);

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  const containerStyle: ViewStyle = {
    ...variantStyle.container,
    ...sizeStyle.container,
    ...(fullWidth && { width: '100%' }),
    ...(isDisabled && { opacity: 0.5 }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...variantStyle.text,
    ...sizeStyle.text,
    ...textStyle,
  };

  const handlePress = useCallback(() => {
    if (!isDisabled && onPress) {
      onPress();
    }
  }, [isDisabled, onPress]);

  // Android ripple config
  const androidRipple = Platform.OS === 'android' ? {
    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    borderless: false,
  } : undefined;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        containerStyle,
        pressed && Platform.OS === 'ios' && {
          opacity: 0.7,
          transform: [{ scale: 0.98 }],
        },
      ]}
      android_ripple={androidRipple}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variantStyle.text.color || colors.foreground}
        />
      ) : (
        <>
          {leftIcon && (
            <Box mr="2">
              {leftIcon}
            </Box>
          )}
          
          {typeof children === 'string' ? (
            <Text style={textStyleCombined}>
              {children}
            </Text>
          ) : (
            children
          )}
          
          {rightIcon && (
            <Box ml="2">
              {rightIcon}
            </Box>
          )}
        </>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';

export default Button;
