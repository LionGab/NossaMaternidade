/**
 * Text Component - Modern Typography Primitive
 * Baseado em shadcn/ui + React Native best practices
 * 
 * @version 3.0.0
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

export type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' 
  | 'p' | 'blockquote' | 'lead' 
  | 'large' | 'small' | 'muted';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  children: React.ReactNode;

  // Variant (shadcn/ui inspired)
  variant?: TextVariant;

  // Size override
  size?: keyof typeof ModernTokens.typography.fontSize;

  // Color
  color?: 'foreground' | 'muted' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning';

  // Weight
  weight?: keyof typeof ModernTokens.typography.fontWeight;

  // Alignment
  align?: 'left' | 'center' | 'right' | 'justify';

  // Line height
  leading?: keyof typeof ModernTokens.typography.lineHeight;

  // Letter spacing
  tracking?: keyof typeof ModernTokens.typography.letterSpacing;

  // Decorations
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;

  // Truncate
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

  // Custom style
  style?: TextStyle;

  // Accessibility
  accessibilityRole?: RNTextProps['accessibilityRole'];
  accessibilityLabel?: string;
}

// Variant styles mapping (shadcn/ui inspired)
const variantStyles: Record<TextVariant, Partial<TextStyle>> = {
  h1: {
    fontSize: ModernTokens.typography.fontSize['4xl'],
    fontWeight: ModernTokens.typography.fontWeight.extrabold,
    lineHeight: ModernTokens.typography.fontSize['4xl'] * ModernTokens.typography.lineHeight.tight,
    letterSpacing: ModernTokens.typography.letterSpacing.tighter,
  },
  h2: {
    fontSize: ModernTokens.typography.fontSize['3xl'],
    fontWeight: ModernTokens.typography.fontWeight.semibold,
    lineHeight: ModernTokens.typography.fontSize['3xl'] * ModernTokens.typography.lineHeight.tight,
    letterSpacing: ModernTokens.typography.letterSpacing.tight,
  },
  h3: {
    fontSize: ModernTokens.typography.fontSize['2xl'],
    fontWeight: ModernTokens.typography.fontWeight.semibold,
    lineHeight: ModernTokens.typography.fontSize['2xl'] * ModernTokens.typography.lineHeight.tight,
  },
  h4: {
    fontSize: ModernTokens.typography.fontSize.xl,
    fontWeight: ModernTokens.typography.fontWeight.semibold,
    lineHeight: ModernTokens.typography.fontSize.xl * ModernTokens.typography.lineHeight.tight,
  },
  p: {
    fontSize: ModernTokens.typography.fontSize.base,
    fontWeight: ModernTokens.typography.fontWeight.normal,
    lineHeight: ModernTokens.typography.fontSize.base * ModernTokens.typography.lineHeight.relaxed,
  },
  blockquote: {
    fontSize: ModernTokens.typography.fontSize.base,
    fontWeight: ModernTokens.typography.fontWeight.medium,
    fontStyle: 'italic',
    lineHeight: ModernTokens.typography.fontSize.base * ModernTokens.typography.lineHeight.relaxed,
  },
  lead: {
    fontSize: ModernTokens.typography.fontSize.lg,
    fontWeight: ModernTokens.typography.fontWeight.normal,
    lineHeight: ModernTokens.typography.fontSize.lg * ModernTokens.typography.lineHeight.relaxed,
  },
  large: {
    fontSize: ModernTokens.typography.fontSize.lg,
    fontWeight: ModernTokens.typography.fontWeight.semibold,
    lineHeight: ModernTokens.typography.fontSize.lg * ModernTokens.typography.lineHeight.normal,
  },
  small: {
    fontSize: ModernTokens.typography.fontSize.sm,
    fontWeight: ModernTokens.typography.fontWeight.medium,
    lineHeight: ModernTokens.typography.fontSize.sm * ModernTokens.typography.lineHeight.normal,
  },
  muted: {
    fontSize: ModernTokens.typography.fontSize.sm,
    fontWeight: ModernTokens.typography.fontWeight.normal,
    lineHeight: ModernTokens.typography.fontSize.sm * ModernTokens.typography.lineHeight.normal,
  },
};

export const Text = React.memo<TextProps>(({
  children,
  variant = 'p',
  size,
  color = 'foreground',
  weight,
  align = 'left',
  leading,
  tracking,
  italic,
  underline,
  strikethrough,
  uppercase,
  lowercase,
  capitalize,
  numberOfLines,
  ellipsizeMode = 'tail',
  style,
  accessibilityRole = 'text',
  accessibilityLabel,
  ...props
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  // Color mapping
  const colorMap: Record<NonNullable<TextProps['color']>, string> = {
    foreground: colors.foreground,
    muted: colors.mutedForeground,
    primary: colors.primary,
    secondary: colors.secondaryForeground,
    destructive: colors.destructive,
    success: colors.success,
    warning: colors.warning,
  };

  const textStyle: TextStyle = {
    // Base variant styles
    ...variantStyles[variant],

    // Size override
    ...(size && { fontSize: ModernTokens.typography.fontSize[size] }),

    // Color
    color: colorMap[color],

    // Weight override
    ...(weight && { fontWeight: ModernTokens.typography.fontWeight[weight] }),

    // Alignment
    textAlign: align,

    // Line height override
    ...(leading && { lineHeight: ModernTokens.typography.fontSize[size || 'base'] * ModernTokens.typography.lineHeight[leading] }),

    // Letter spacing override
    ...(tracking && { letterSpacing: ModernTokens.typography.letterSpacing[tracking] }),

    // Decorations
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecorationLine: 'underline' }),
    ...(strikethrough && { textDecorationLine: 'line-through' }),
    ...(uppercase && { textTransform: 'uppercase' }),
    ...(lowercase && { textTransform: 'lowercase' }),
    ...(capitalize && { textTransform: 'capitalize' }),

    // Font family
    fontFamily: ModernTokens.typography.fontFamily.sans,

    // Custom style (highest priority)
    ...style,
  };

  return (
    <RNText
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {children}
    </RNText>
  );
});

Text.displayName = 'Text';

// Convenience components (shadcn/ui style)
export const H1 = (props: Omit<TextProps, 'variant'>) => <Text variant="h1" {...props} />;
export const H2 = (props: Omit<TextProps, 'variant'>) => <Text variant="h2" {...props} />;
export const H3 = (props: Omit<TextProps, 'variant'>) => <Text variant="h3" {...props} />;
export const H4 = (props: Omit<TextProps, 'variant'>) => <Text variant="h4" {...props} />;
export const P = (props: Omit<TextProps, 'variant'>) => <Text variant="p" {...props} />;
export const Lead = (props: Omit<TextProps, 'variant'>) => <Text variant="lead" {...props} />;
export const Large = (props: Omit<TextProps, 'variant'>) => <Text variant="large" {...props} />;
export const Small = (props: Omit<TextProps, 'variant'>) => <Text variant="small" {...props} />;
export const Muted = (props: Omit<TextProps, 'variant'>) => <Text variant="muted" color="muted" {...props} />;
export const Blockquote = (props: Omit<TextProps, 'variant'>) => <Text variant="blockquote" {...props} />;

export default Text;
