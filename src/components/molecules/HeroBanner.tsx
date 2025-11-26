/**
 * HeroBanner - Componente de banner hero com imagem e overlay
 * Design System: Ocean Blue + Coral (Web Reference)
 */

import React from 'react';
import { View, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme';
import { Radius } from '@/theme/tokens';

export interface HeroBannerProps {
  imageUrl: string;
  height?: number;
  overlay?: {
    type: 'gradient' | 'solid';
    direction?: 'top' | 'bottom' | 'left' | 'right';
    opacity?: number;
    color?: string;
  };
  borderRadius?: keyof typeof Radius | number;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

export function HeroBanner({
  imageUrl,
  height = 200,
  overlay,
  borderRadius = 'lg',
  accessibilityLabel,
  children,
}: HeroBannerProps) {
  const { colors, isDark } = useTheme();

  const borderRadiusValue = typeof borderRadius === 'number' ? borderRadius : Radius[borderRadius];

  // Preparar cores do overlay
  const getGradientColors = (): string[] => {
    if (!overlay || overlay.type === 'solid') {
      const opacity = overlay?.opacity ?? 0.5;
      const color = overlay?.color ?? (isDark ? '#000000' : '#000000');
      return [`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`, color];
    }

    // Gradient overlay
    const opacity = overlay.opacity ?? 0.6;
    const baseColor = overlay.color ?? (isDark ? '#000000' : '#000000');
    const transparent = `${baseColor}00`;
    const opaque = `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;

    if (overlay.direction === 'top') {
      return [opaque, transparent];
    } else if (overlay.direction === 'left') {
      return [opaque, transparent];
    } else if (overlay.direction === 'right') {
      return [transparent, opaque];
    } else {
      // bottom (default)
      return [transparent, opaque];
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderRadius: borderRadiusValue,
          overflow: 'hidden',
        },
      ]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        resizeMode="cover"
        accessible={false}
      >
        {overlay && (
          <LinearGradient
            colors={getGradientColors() as [string, string, ...string[]]}
            style={StyleSheet.absoluteFill}
            start={overlay.direction === 'top' ? { x: 0, y: 0 } : { x: 0, y: 0 }}
            end={overlay.direction === 'top' ? { x: 0, y: 1 } : { x: 0, y: 1 }}
          />
        )}
        {children && (
          <View style={styles.content}>
            {children}
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
});

