/**
 * Box Component - Modern Layout Primitive
 * Baseado em shadcn/ui + React Native best practices
 * 
 * @version 3.0.0
 */

import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

import { ModernTokens, SpacingKey, getSpacingValue } from '@/theme/modernTokens';
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
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: SpacingKey;

  // Spacing
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  pt?: SpacingKey;
  pr?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;

  m?: SpacingKey;
  mx?: SpacingKey;
  my?: SpacingKey;
  mt?: SpacingKey;
  mr?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;

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
  borderColor?: 'border' | 'input' | 'primary' | 'muted' | 'secondary';

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
  flexWrap,
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
    secondary: colors.secondary,
  };

  const wrapValue = flexWrap || wrap;

  // Build style object, casting to ViewStyle at the end
  const boxStyleObj = {
    // Layout
    ...(flex !== undefined && { flex }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(wrapValue && { flexWrap: wrapValue }),
    ...(gap !== undefined && { gap: getSpacingValue(gap) }),

    // Spacing - Padding
    ...(p !== undefined && { padding: getSpacingValue(p) }),
    ...(px !== undefined && { 
      paddingLeft: getSpacingValue(px),
      paddingRight: getSpacingValue(px),
    }),
    ...(py !== undefined && { 
      paddingTop: getSpacingValue(py),
      paddingBottom: getSpacingValue(py),
    }),
    ...(pt !== undefined && { paddingTop: getSpacingValue(pt) }),
    ...(pr !== undefined && { paddingRight: getSpacingValue(pr) }),
    ...(pb !== undefined && { paddingBottom: getSpacingValue(pb) }),
    ...(pl !== undefined && { paddingLeft: getSpacingValue(pl) }),

    // Spacing - Margin
    ...(m !== undefined && { margin: getSpacingValue(m) }),
    ...(mx !== undefined && { 
      marginLeft: getSpacingValue(mx),
      marginRight: getSpacingValue(mx),
    }),
    ...(my !== undefined && { 
      marginTop: getSpacingValue(my),
      marginBottom: getSpacingValue(my),
    }),
    ...(mt !== undefined && { marginTop: getSpacingValue(mt) }),
    ...(mr !== undefined && { marginRight: getSpacingValue(mr) }),
    ...(mb !== undefined && { marginBottom: getSpacingValue(mb) }),
    ...(ml !== undefined && { marginLeft: getSpacingValue(ml) }),

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

    // Shadow - filter out web-only properties
    ...(shadow && (() => {
      const shadowStyle = ModernTokens.shadows[shadow] as Record<string, unknown>;
      // Remove web-only properties
      const { boxShadow: _boxShadow, ...nativeShadow } = shadowStyle;
      return nativeShadow as ViewStyle;
    })()),

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

  const boxStyle = boxStyleObj as ViewStyle;

  return (
    <View style={boxStyle} {...props}>
      {children}
    </View>
  );
});

Box.displayName = 'Box';

export default Box;
