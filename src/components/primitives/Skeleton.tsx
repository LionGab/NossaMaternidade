/**
 * Skeleton Component - Modern Loading Placeholder
 * Baseado em shadcn/ui skeletons
 * 
 * @version 3.0.0
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, Easing } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';

export interface SkeletonProps {
  // Size
  width?: number | string;
  height?: number | string;
  
  // Shape
  rounded?: keyof typeof ModernTokens.radius | boolean;
  circle?: boolean;
  
  // Animation
  animated?: boolean;
  
  // Custom style
  style?: ViewStyle;
}

export const Skeleton = React.memo<SkeletonProps>(({
  width = '100%',
  height = 20,
  rounded = 'md',
  circle = false,
  animated = true,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }
    return undefined;
  }, [animated, animatedValue]);

  const opacity = animated
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
      })
    : 0.5;

  const borderRadius = circle 
    ? typeof width === 'number' ? width / 2 : 9999
    : rounded === true 
      ? ModernTokens.radius.md
      : typeof rounded === 'string'
        ? ModernTokens.radius[rounded]
        : 0;

  const finalWidth = circle && typeof height === 'number' ? height : width;
  const containerStyle: ViewStyle = {
    width: typeof finalWidth === 'number' ? finalWidth : undefined,
    height: typeof height === 'number' ? height : undefined,
    borderRadius,
    backgroundColor: colors.muted,
    ...style,
  };

  return (
    <Animated.View style={[containerStyle, { opacity }]} />
  );
});

Skeleton.displayName = 'Skeleton';

// Convenience components for common skeletons

export const SkeletonText = ({ lines = 3, spacing: _spacing = 8, ...props }: { lines?: number; spacing?: number } & Partial<SkeletonProps>) => (
  <Box gap="2">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height={16}
        width={index === lines - 1 ? '60%' : '100%'}
        {...props}
      />
    ))}
  </Box>
);

export const SkeletonAvatar = ({ size = 40, ...props }: { size?: number } & Partial<SkeletonProps>) => (
  <Skeleton
    width={size}
    height={size}
    circle
    {...props}
  />
);

export const SkeletonCard = () => (
  <Box
    p={4}
    rounded="lg"
    borderWidth={1}
    borderColor="border"
    bg="card"
  >
    <Box direction="row" align="center" gap={3} mb={3}>
      <SkeletonAvatar size={40} />
      <Box flex={1}>
        <Skeleton height={16} width="60%" style={{ marginBottom: 8 }} />
        <Skeleton height={12} width="40%" />
      </Box>
    </Box>
    
    <SkeletonText lines={3} />
  </Box>
);

export default Skeleton;
