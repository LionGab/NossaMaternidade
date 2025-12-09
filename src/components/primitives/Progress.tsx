/**
 * Progress Component - Modern Progress Indicators
 * Baseado em shadcn/ui progress
 * 
 * @version 3.0.0
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  style?: ViewStyle;
}

export const Progress = React.memo<ProgressProps>(({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
  indeterminate = false,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const progressValue = useRef(new Animated.Value(0)).current;
  const indeterminateAnim = useRef(new Animated.Value(0)).current;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(indeterminateAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(indeterminateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animated) {
      Animated.spring(progressValue, {
        toValue: percentage,
        tension: 40,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      progressValue.setValue(percentage);
    }
  }, [percentage, animated, indeterminate, progressValue, indeterminateAnim]);

  const sizeConfig = {
    sm: 4,
    md: 8,
    lg: 12,
  };

  const height = sizeConfig[size];

  const variantColors = {
    default: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.destructive,
  };

  const progressColor = variantColors[variant];

  const trackStyle: ViewStyle = {
    height,
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: height / 2,
    overflow: 'hidden',
    ...style,
  };

  const barWidth = progressValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const indeterminateTranslate = indeterminateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-100%', '200%'],
  });

  return (
    <Box>
      <Animated.View style={trackStyle}>
        <Animated.View
          style={{
            height: '100%',
            width: indeterminate ? '50%' : barWidth,
            backgroundColor: progressColor,
            borderRadius: height / 2,
            ...(indeterminate && {
              transform: [{ translateX: indeterminateTranslate }],
            }),
          }}
        />
      </Animated.View>
      
      {showLabel && !indeterminate && (
        <Text 
          size="sm" 
          color="muted"
          style={{ marginTop: ModernTokens.spacing['1'], textAlign: 'center' }}
        >
          {Math.round(percentage)}%
        </Text>
      )}
    </Box>
  );
});

Progress.displayName = 'Progress';

// Circular Progress
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const CircularProgress = React.memo<CircularProgressProps>(({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  // Note: radius would be used with react-native-svg for full circular progress
  // const radius = (size - strokeWidth) / 2;
  // const circumference = radius * 2 * Math.PI;
  
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressValue, {
      toValue: percentage,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [percentage, progressValue]);

  const variantColors = {
    default: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.destructive,
  };

  const progressColor = variantColors[variant];

  return (
    <Box 
      width={size} 
      height={size}
      justify="center"
      align="center"
      style={style}
    >
      {/* Background circle */}
      <Box
        position="absolute"
        width={size}
        height={size}
        rounded="full"
        borderWidth={strokeWidth}
        borderColor="secondary"
        style={{ borderColor: colors.secondary }}
      />
      
      {/* Progress circle - Simplified for React Native */}
      <Box
        position="absolute"
        width={size}
        height={size}
      >
        {/* Note: For full SVG support, use react-native-svg */}
      </Box>
      
      {showLabel && (
        <Text 
          weight="semibold" 
          style={{ 
            fontSize: size * 0.25,
            color: progressColor,
          }}
        >
          {Math.round(percentage)}%
        </Text>
      )}
    </Box>
  );
});

CircularProgress.displayName = 'CircularProgress';

export default Progress;
