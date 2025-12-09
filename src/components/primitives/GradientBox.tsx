/**
 * GradientBox Component - Modern Gradient Container
 * Suporta gradientes lineares e radiais com animações
 * 
 * @version 3.0.0
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ModernTokens } from '@/theme/modernTokens';

import { Box, BoxProps } from './Box';

export interface GradientBoxProps extends Omit<BoxProps, 'bg'> {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  preset?: keyof typeof ModernTokens.gradients.maternal | keyof typeof ModernTokens.gradients.functional;
}

export const GradientBox = React.memo<GradientBoxProps>(({
  children,
  colors: colorsProp,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  locations,
  preset,
  style,
  ...props
}) => {
  // Use preset colors if provided
  const colors = preset 
    ? (ModernTokens.gradients.maternal[preset as keyof typeof ModernTokens.gradients.maternal] ||
       ModernTokens.gradients.functional[preset as keyof typeof ModernTokens.gradients.functional] ||
       colorsProp)
    : colorsProp;

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      locations={locations}
      style={style}
    >
      <Box {...props}>
        {children}
      </Box>
    </LinearGradient>
  );
});

GradientBox.displayName = 'GradientBox';

// Preset gradient components for common use cases
export const MaternalGradient: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <GradientBox
    colors={ModernTokens.gradients.maternal.primary}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={style}
  >
    {children}
  </GradientBox>
);

export const SuccessGradient: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <GradientBox
    colors={ModernTokens.gradients.functional.success}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={style}
  >
    {children}
  </GradientBox>
);

export const SunsetGradient: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <GradientBox
    colors={ModernTokens.gradients.maternal.sunset}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={style}
  >
    {children}
  </GradientBox>
);

export const OceanGradient: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <GradientBox
    colors={ModernTokens.gradients.maternal.ocean}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={style}
  >
    {children}
  </GradientBox>
);

export default GradientBox;
