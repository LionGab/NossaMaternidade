/**
 * Box Component - Modern Layout Primitive
 * Baseado em shadcn/ui + React Native best practices
 * 
 * @version 3.0.0
 */

import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

export interface BoxProps extends Omit<ViewProps, 'style'> {
  children?: React.ReactNode;

  // Layout
  flex?: number;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 
    | 'flex-start' 
    | 'center' 
    | 'flex-end' 
    | 'space-between' 
    | 'space-around' 
    | 'space-evenly';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: keyof typeof ModernTokens.spacing;

  // Spacing
  p?: keyof typeof ModernTokens.spacing;
  px?: keyof typeof ModernTokens.spacing;
  py?: keyof typeof ModernTokens.spacing;
  pt?: keyof typeof ModernTokens.spacing;
  pr?: keyof typeof ModernTokens.spacing;
  pb?: keyof typeof ModernTokens.spacing;
  pl?: keyof typeof ModernTokens.spacing;

  m?: keyof typeof ModernTokens.spacing;
  mx?: keyof typeof ModernTokens.spacing;
  my?: keyof typeof ModernTokens.spacing;
  mt?: keyof typeof ModernTokens.spacing;
  mr?: keyof typeof ModernTokens.spacing;
  mb?: keyof typeof ModernTokens.spacing;
  ml?: keyof typeof ModernTokens.spacing;

  // Size
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  // Border
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  rounded?: keyof typeof ModernTokens.radius;
  roundedTop?: keyof typeof ModernTokens.radius;
  roundedBottom?: keyof typeof ModernTokens.radius;

  // Background & Colors
  bg?: 'background' | 'card' | 'muted' | 'accent' | 'primary' | 'secondary' | 'transparent';
  borderColor?: 'border' | 'input' | 'primary' | 'muted';

  // Shadow
  shadow?: keyof typeof ModernTokens.shadows;

  // Position
  position?: 'relative' | 'absolute';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll';

  // Opacity
  opacity?: number;

  // Custom style
  style?: ViewStyle;
}

export const Box = React.memo<BoxProps>(({
  children,
  
  // Layout
  flex,
  direction = 'column',
  align,
  justify,
  wrap,
  gap,

  // Spacing
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,

  // Size
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,

  // Border
  borderWidth,
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  rounded,
  roundedTop,
  roundedBottom,

  // Background & Colors
  bg = 'transparent',
  borderColor,

  // Shadow
  shadow,

  // Position
  position,
  top,
  right,
  bottom,
  left,
  zIndex,

  // Overflow
  overflow,

  // Opacity
  opacity,

  // Custom
  style,
  ...props
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  // Background color mapping
  const bgColorMap: Record<NonNullable<BoxProps['bg']>, string> = {
    background: colors.background,
    card: colors.card,
    muted: colors.muted,
    accent: colors.accent,
    primary: colors.primary,
    secondary: colors.secondary,
    transparent: 'transparent',
  };

  // Border color mapping
  const borderColorMap: Record<NonNullable<BoxProps['borderColor']>, string> = {
    border: colors.border,
    input: colors.input,
    primary: colors.primary,
    muted: colors.muted,
  };

  const boxStyle: ViewStyle = {
    // Layout
    ...(flex !== undefined && { flex }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...(gap !== undefined && { gap: ModernTokens.spacing[gap] }),

    // Spacing - Padding
    ...(p !== undefined && { padding: ModernTokens.spacing[p] }),
    ...(px !== undefined && { 
      paddingLeft: ModernTokens.spacing[px],
      paddingRight: ModernTokens.spacing[px],
    }),
    ...(py !== undefined && { 
      paddingTop: ModernTokens.spacing[py],
      paddingBottom: ModernTokens.spacing[py],
    }),
    ...(pt !== undefined && { paddingTop: ModernTokens.spacing[pt] }),
    ...(pr !== undefined && { paddingRight: ModernTokens.spacing[pr] }),
    ...(pb !== undefined && { paddingBottom: ModernTokens.spacing[pb] }),
    ...(pl !== undefined && { paddingLeft: ModernTokens.spacing[pl] }),

    // Spacing - Margin
    ...(m !== undefined && { margin: ModernTokens.spacing[m] }),
    ...(mx !== undefined && { 
      marginLeft: ModernTokens.spacing[mx],
      marginRight: ModernTokens.spacing[mx],
    }),
    ...(my !== undefined && { 
      marginTop: ModernTokens.spacing[my],
      marginBottom: ModernTokens.spacing[my],
    }),
    ...(mt !== undefined && { marginTop: ModernTokens.spacing[mt] }),
    ...(mr !== undefined && { marginRight: ModernTokens.spacing[mr] }),
    ...(mb !== undefined && { marginBottom: ModernTokens.spacing[mb] }),
    ...(ml !== undefined && { marginLeft: ModernTokens.spacing[ml] }),

    // Size
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(minWidth !== undefined && { minWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(maxHeight !== undefined && { maxHeight }),

    // Border
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderTopWidth !== undefined && { borderTopWidth }),
    ...(borderRightWidth !== undefined && { borderRightWidth }),
    ...(borderBottomWidth !== undefined && { borderBottomWidth }),
    ...(borderLeftWidth !== undefined && { borderLeftWidth }),
    ...(rounded !== undefined && { borderRadius: ModernTokens.radius[rounded] }),
    ...(roundedTop !== undefined && { 
      borderTopLeftRadius: ModernTokens.radius[roundedTop],
      borderTopRightRadius: ModernTokens.radius[roundedTop],
    }),
    ...(roundedBottom !== undefined && { 
      borderBottomLeftRadius: ModernTokens.radius[roundedBottom],
      borderBottomRightRadius: ModernTokens.radius[roundedBottom],
    }),
    ...(borderColor && { borderColor: borderColorMap[borderColor] }),

    // Background
    ...(bg && { backgroundColor: bgColorMap[bg] }),

    // Shadow
    ...(shadow && ModernTokens.shadows[shadow]),

    // Position
    ...(position && { position }),
    ...(top !== undefined && { top }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(zIndex !== undefined && { zIndex }),

    // Overflow
    ...(overflow && { overflow }),

    // Opacity
    ...(opacity !== undefined && { opacity }),

    // Custom style (highest priority)
    ...style,
  };

  return (
    <View style={boxStyle} {...props}>
      {children}
    </View>
  );
});

Box.displayName = 'Box';

export default Box;
