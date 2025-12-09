/**
 * Badge Component - Modern Label/Tag Primitive
 * Baseado em shadcn/ui badges
 * 
 * @version 3.0.0
 */

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export type BadgeVariant = 
  | 'default' 
  | 'secondary' 
  | 'destructive' 
  | 'outline' 
  | 'success' 
  | 'warning';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = React.memo<BadgeProps>(({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  // Variant styles
  const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        backgroundColor: colors.primary,
        borderWidth: 0,
      },
      text: {
        color: colors.primaryForeground,
      },
    },
    secondary: {
      container: {
        backgroundColor: colors.secondary,
        borderWidth: 0,
      },
      text: {
        color: colors.secondaryForeground,
      },
    },
    destructive: {
      container: {
        backgroundColor: colors.destructive,
        borderWidth: 0,
      },
      text: {
        color: colors.destructiveForeground,
      },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      },
      text: {
        color: colors.foreground,
      },
    },
    success: {
      container: {
        backgroundColor: colors.success,
        borderWidth: 0,
      },
      text: {
        color: colors.primaryForeground,
      },
    },
    warning: {
      container: {
        backgroundColor: colors.warning,
        borderWidth: 0,
      },
      text: {
        color: colors.primaryForeground,
      },
    },
  };

  // Size styles
  const sizeStyles: Record<NonNullable<BadgeProps['size']>, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: {
        paddingHorizontal: ModernTokens.spacing['2'],
        paddingVertical: ModernTokens.spacing['0.5'],
        minHeight: 20,
      },
      text: {
        fontSize: ModernTokens.typography.fontSize.xs,
      },
    },
    md: {
      container: {
        paddingHorizontal: ModernTokens.spacing['2.5'],
        paddingVertical: ModernTokens.spacing['1'],
        minHeight: 24,
      },
      text: {
        fontSize: ModernTokens.typography.fontSize.sm,
      },
    },
  };

  const containerStyle: ViewStyle = {
    ...variantStyles[variant].container,
    ...sizeStyles[size].container,
    borderRadius: ModernTokens.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...variantStyles[variant].text,
    ...sizeStyles[size].text,
    fontWeight: ModernTokens.typography.fontWeight.semibold,
    ...textStyle,
  };

  return (
    <Box style={containerStyle}>
      <Text style={textStyleCombined}>
        {children}
      </Text>
    </Box>
  );
});

Badge.displayName = 'Badge';

export default Badge;
