/**
 * Input Component - Modern Form Input Primitive
 * Baseado em shadcn/ui inputs
 * 
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { 
  TextInput, 
  TextInputProps, 
  ViewStyle, 
  TextStyle,
  Platform,
} from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  // State
  error?: boolean;
  disabled?: boolean;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Styling
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  
  // Variants
  variant?: 'default' | 'filled';
  
  // Size
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.memo<InputProps>(({
  error = false,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  variant = 'default',
  size = 'md',
  onFocus,
  onBlur,
  ...props
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Size styles
  const sizeStyles: Record<NonNullable<InputProps['size']>, { container: ViewStyle; input: TextStyle }> = {
    sm: {
      container: {
        minHeight: 36,
        paddingHorizontal: ModernTokens.spacing['2'],
      },
      input: {
        fontSize: ModernTokens.typography.fontSize.sm,
      },
    },
    md: {
      container: {
        minHeight: 44,
        paddingHorizontal: ModernTokens.spacing['3'],
      },
      input: {
        fontSize: ModernTokens.typography.fontSize.base,
      },
    },
    lg: {
      container: {
        minHeight: 56,
        paddingHorizontal: ModernTokens.spacing['4'],
      },
      input: {
        fontSize: ModernTokens.typography.fontSize.lg,
      },
    },
  };

  const baseContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: ModernTokens.radius.md,
    backgroundColor: variant === 'filled' ? colors.muted : colors.background,
    borderColor: error 
      ? colors.destructive
      : isFocused 
        ? colors.ring 
        : colors.input,
    ...sizeStyles[size].container,
    ...(disabled && { opacity: 0.5 }),
    ...(Platform.OS === 'web' && isFocused && {
      outlineWidth: 2,
      outlineColor: colors.ring,
      outlineStyle: 'solid',
      outlineOffset: 2,
    } as ViewStyle),
  };

  const baseInputStyle: TextStyle = {
    flex: 1,
    color: colors.foreground,
    fontFamily: ModernTokens.typography.fontFamily.sans,
    ...sizeStyles[size].input,
  };

  return (
    <Box 
      style={[baseContainerStyle, containerStyle]}
    >
      {leftIcon && (
        <Box mr="2">
          {leftIcon}
        </Box>
      )}
      
      <TextInput
        style={[baseInputStyle, inputStyle]}
        placeholderTextColor={colors.mutedForeground}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessible={true}
        accessibilityRole="text"
        accessibilityState={{
          disabled,
        }}
        {...props}
      />
      
      {rightIcon && (
        <Box ml="2">
          {rightIcon}
        </Box>
      )}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;
