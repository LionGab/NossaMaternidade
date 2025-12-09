/**
 * CottonCandyCard - Card component with Cotton Candy Tech styling
 *
 * Features:
 * - Rounded-3xl borders (24px)
 * - Glassmorphism effect option
 * - Cotton Candy pink/blue gradients
 * - Soft shadows
 *
 * @version 1.0.0 - Cotton Candy Tech Blue Version
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { getPlatformShadow } from '@/theme/platform';

export interface CottonCandyCardProps {
  children: React.ReactNode;
  /** Enable glassmorphism effect (frosted glass look) */
  glass?: boolean;
  /** Use gradient background instead of solid */
  gradient?: 'pink' | 'blue' | 'pinkBlue' | 'soft' | 'none';
  /** Card padding */
  padding?: keyof typeof Tokens.spacing;
  /** Custom style override */
  style?: ViewStyle;
  /** Shadow intensity */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CottonCandyCard: React.FC<CottonCandyCardProps> = ({
  children,
  glass = false,
  gradient = 'none',
  padding = '4',
  style,
  shadow = 'md',
}) => {
  const { colors, isDark } = useTheme();

  // Gradient configurations
  const gradientColors = {
    pink: [ColorTokens.cottonCandy.pink50, ColorTokens.cottonCandy.pink100] as const,
    blue: [ColorTokens.cottonCandy.blue50, ColorTokens.cottonCandy.blue100] as const,
    pinkBlue: [ColorTokens.cottonCandy.pink50, ColorTokens.cottonCandy.blue50] as const,
    soft: [ColorTokens.cottonCandy.bgGradientStart, ColorTokens.cottonCandy.bgGradientEnd] as const,
    none: [colors.background.card, colors.background.card] as const,
  };

  const selectedGradient = gradientColors[gradient] || gradientColors.none;

  // Base card style
  const baseCardStyle: ViewStyle = {
    borderRadius: Tokens.radius['3xl'], // ⭐ Cotton Candy: rounded-3xl
    overflow: 'hidden',
    backgroundColor: glass ? 'transparent' : colors.background.card,
    borderWidth: 1,
    borderColor: glass ? ColorTokens.neutral[100] : colors.border.light,
    ...getPlatformShadow(shadow),
  };

  // Glass effect (frosted glass blur)
  if (glass && Platform.OS !== 'web') {
    return (
      <View style={[baseCardStyle, style]}>
        <BlurView
          intensity={20} // ⭐ Cotton Candy: glass blur intensity
          tint={isDark ? 'dark' : 'light'}
          style={{
            flex: 1,
            padding: Tokens.spacing[padding],
            backgroundColor: isDark
              ? 'rgba(30, 30, 30, 0.7)' // Dark mode glass
              : 'rgba(255, 255, 255, 0.7)', // Light mode glass
          }}
        >
          {children}
        </BlurView>
      </View>
    );
  }

  // Gradient card
  if (gradient !== 'none') {
    return (
      <View style={[baseCardStyle, style]}>
        <LinearGradient
          colors={selectedGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            padding: Tokens.spacing[padding],
          }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  // Standard solid card
  return (
    <View style={[baseCardStyle, styles.cardContent, { padding: Tokens.spacing[padding] }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    width: '100%',
  },
});

export default CottonCandyCard;
