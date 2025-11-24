/**
 * Text Component - Typography primitive
 * Componente para textos body com variants e theme-aware
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useThemeColors } from '@/theme';
import { Typography } from '@/theme/tokens';

export type TextVariant = 'body' | 'caption' | 'label' | 'overline' | 'small';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'link' | 'success' | 'warning' | 'error';

export interface CustomTextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  size?: TextSize;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  children: React.ReactNode;
  style?: TextStyle;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  body: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },
  caption: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.regular,
    letterSpacing: Typography.letterSpacing.wide,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
    letterSpacing: Typography.letterSpacing.wide,
  },
  overline: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  small: {
    fontSize: Typography.sizes.xs,
    lineHeight: Typography.lineHeights.xs,
    fontWeight: Typography.weights.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },
};

const sizeMap: Record<TextSize, number> = {
  xs: Typography.sizes.xs,
  sm: Typography.sizes.sm,
  md: Typography.sizes.md,
  lg: Typography.sizes.lg,
  xl: Typography.sizes.xl,
};

export function Text({
  variant = 'body',
  size,
  color = 'primary',
  align = 'left',
  weight,
  italic = false,
  underline = false,
  strikethrough = false,
  children,
  style,
  ...props
}: CustomTextProps) {
  const colors = useThemeColors();

  const colorMap: Record<TextColor, string> = {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    tertiary: colors.text.tertiary,
    disabled: colors.text.disabled,
    inverse: colors.text.inverse,
    link: colors.text.link,
    success: colors.text.success,
    warning: colors.text.warning,
    error: colors.text.error,
  };

  const computedStyle: TextStyle = {
    ...variantStyles[variant],
    ...(size && { fontSize: sizeMap[size] }),
    color: colorMap[color],
    textAlign: align,
    ...(weight && { fontWeight: Typography.weights[weight] }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecorationLine: 'underline' }),
    ...(strikethrough && { textDecorationLine: 'line-through' }),
    ...style,
  };

  return (
    <RNText style={computedStyle} {...props}>
      {children}
    </RNText>
  );
}

// Convenience exports
export const Body = (props: Omit<CustomTextProps, 'variant'>) => <Text variant="body" {...props} />;
export const Caption = (props: Omit<CustomTextProps, 'variant'>) => <Text variant="caption" {...props} />;
export const Label = (props: Omit<CustomTextProps, 'variant'>) => <Text variant="label" {...props} />;
export const Overline = (props: Omit<CustomTextProps, 'variant'>) => <Text variant="overline" {...props} />;
export const Small = (props: Omit<CustomTextProps, 'variant'>) => <Text variant="small" {...props} />;
