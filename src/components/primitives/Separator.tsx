/**
 * Separator Component - Modern Visual Divider
 * Baseado em shadcn/ui separator
 * 
 * @version 3.0.0
 */

import React from 'react';
import { ViewStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  label?: string;
  variant?: 'default' | 'dashed' | 'dotted';
  thickness?: number;
  spacing?: keyof typeof ModernTokens.spacing;
  style?: ViewStyle;
}

export const Separator = React.memo<SeparatorProps>(({
  orientation = 'horizontal',
  decorative = false,
  label,
  variant = 'default',
  thickness = 1,
  spacing,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  const isHorizontal = orientation === 'horizontal';

  const lineStyle: ViewStyle = {
    backgroundColor: colors.border,
    ...(isHorizontal ? {
      height: thickness,
      width: '100%',
    } : {
      width: thickness,
      height: '100%',
    }),
    ...(variant === 'dashed' && {
      borderStyle: 'dashed',
      borderWidth: thickness,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    }),
    ...(variant === 'dotted' && {
      borderStyle: 'dotted',
      borderWidth: thickness,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    }),
  };

  const containerStyle: ViewStyle = {
    ...(isHorizontal ? {
      flexDirection: 'row',
      alignItems: 'center',
      ...(spacing && {
        marginVertical: ModernTokens.spacing[spacing],
      }),
    } : {
      flexDirection: 'column',
      justifyContent: 'center',
      ...(spacing && {
        marginHorizontal: ModernTokens.spacing[spacing],
      }),
    }),
    ...style,
  };

  if (label && isHorizontal) {
    return (
      <Box style={containerStyle}>
        <Box style={{ ...lineStyle, flex: 1 }} />
        <Text 
          size="sm" 
          color="muted"
          style={{ 
            marginHorizontal: ModernTokens.spacing['4'],
          }}
        >
          {label}
        </Text>
        <Box style={{ ...lineStyle, flex: 1 }} />
      </Box>
    );
  }

  return (
    <Box
      style={{ ...lineStyle, ...containerStyle }}
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'adjustable'}
    />
  );
});

Separator.displayName = 'Separator';

export default Separator;
