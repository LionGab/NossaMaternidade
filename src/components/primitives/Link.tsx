/**
 * Link Component - Typography primitive
 * Componente para links com estados (default, hover, visited) e theme-aware
 */

import React, { useState } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import { useThemeColors } from '@/theme';
import { Typography } from '@/theme/tokens';

export interface LinkProps extends Omit<PressableProps, 'children' | 'style'> {
  children: React.ReactNode;
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: boolean | 'hover' | 'always';
  external?: boolean;
  style?: TextStyle;
  onPress?: () => void;
}

const sizeMap = {
  xs: Typography.sizes.xs,
  sm: Typography.sizes.sm,
  md: Typography.sizes.md,
  lg: Typography.sizes.lg,
};

export function Link({
  children,
  href,
  size = 'md',
  weight = 'medium',
  underline = 'hover',
  external = false,
  style,
  onPress,
  ...props
}: LinkProps) {
  const colors = useThemeColors();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (href && external) {
      // Para links externos, você pode usar Linking.openURL(href)
      console.log('Opening external link:', href);
    } else if (href) {
      // Para navegação interna (Expo Router)
      console.log('Navigating to:', href);
    }
  };

  const showUnderline =
    underline === 'always' ||
    (underline === 'hover' && (isHovered || isPressed)) ||
    (underline === true);

  const computedStyle: TextStyle = {
    fontSize: sizeMap[size],
    fontWeight: Typography.weights[weight],
    color: isPressed
      ? colors.primary.dark
      : colors.text.link,
    textDecorationLine: showUnderline ? 'underline' : 'none',
    letterSpacing: Typography.letterSpacing.normal,
    ...style,
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      {...props}
    >
      <RNText style={computedStyle}>{children}</RNText>
    </Pressable>
  );
}
