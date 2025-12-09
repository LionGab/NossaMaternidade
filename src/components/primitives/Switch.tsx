/**
 * Switch Component - Modern Toggle with Smooth Animation
 * Baseado em shadcn/ui switch
 * 
 * @version 3.0.0
 */

import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, ViewStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';

export interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export const Switch = React.memo<SwitchProps>(({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  style,
  accessibilityLabel,
  testID,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled && onValueChange) {
      // Scale animation on press
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onValueChange(!value);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: { width: 36, height: 20, thumbSize: 16, padding: 2 },
    md: { width: 44, height: 24, thumbSize: 20, padding: 2 },
    lg: { width: 52, height: 28, thumbSize: 24, padding: 2 },
  };

  const { width, height, thumbSize, padding } = sizeConfig[size];

  const trackStyle: ViewStyle = {
    width,
    height,
    borderRadius: height / 2,
    backgroundColor: value 
      ? colors.primary 
      : isDark ? colors.input : colors.muted,
    justifyContent: 'center',
    padding,
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - thumbSize - padding * 2],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Animated.View 
        style={[
          trackStyle,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <Animated.View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: colors.background,
            ...ModernTokens.shadows.sm,
            transform: [{ translateX: thumbTranslateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
});

Switch.displayName = 'Switch';

export default Switch;
