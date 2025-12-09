/**
 * Card Component - Modern Container Primitive
 * Baseado em shadcn/ui cards
 * 
 * @version 3.0.0
 */

import React from 'react';
import { ViewStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box, BoxProps } from './Box';
import { Text, TextProps } from './Text';

export interface CardProps extends BoxProps {
  variant?: 'default' | 'elevated' | 'outline';
}

export const Card = React.memo<CardProps>(({ 
  children, 
  variant = 'default',
  style,
  ...props 
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  const variantStyles: Record<NonNullable<CardProps['variant']>, ViewStyle> = {
    default: {
      backgroundColor: colors.card,
      ...ModernTokens.shadows.sm,
    },
    elevated: {
      backgroundColor: colors.card,
      ...ModernTokens.shadows.md,
    },
    outline: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
  };

  return (
    <Box
      rounded="lg"
      p="6"
      style={[variantStyles[variant], style]}
      {...props}
    >
      {children}
    </Box>
  );
});

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends BoxProps {}

export const CardHeader = React.memo<CardHeaderProps>(({ children, ...props }) => (
  <Box direction="column" gap="1.5" mb="4" {...props}>
    {children}
  </Box>
));

CardHeader.displayName = 'CardHeader';

// Card Title
export interface CardTitleProps extends Omit<TextProps, 'variant'> {}

export const CardTitle = React.memo<CardTitleProps>(({ children, ...props }) => (
  <Text variant="h3" {...props}>
    {children}
  </Text>
));

CardTitle.displayName = 'CardTitle';

// Card Description
export interface CardDescriptionProps extends Omit<TextProps, 'variant'> {}

export const CardDescription = React.memo<CardDescriptionProps>(({ children, ...props }) => (
  <Text variant="small" color="muted" {...props}>
    {children}
  </Text>
));

CardDescription.displayName = 'CardDescription';

// Card Content
export interface CardContentProps extends BoxProps {}

export const CardContent = React.memo<CardContentProps>(({ children, p = "6", pt = "0", ...props }) => (
  <Box p={p} pt={pt} {...props}>
    {children}
  </Box>
));

CardContent.displayName = 'CardContent';

// Card Footer
export interface CardFooterProps extends BoxProps {}

export const CardFooter = React.memo<CardFooterProps>(({ children, ...props }) => (
  <Box direction="row" align="center" pt="4" {...props}>
    {children}
  </Box>
));

CardFooter.displayName = 'CardFooter';

export default Card;
