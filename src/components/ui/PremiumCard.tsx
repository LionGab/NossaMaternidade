/**
 * PremiumCard - Card com design premium e efeitos visuais sofisticados
 *
 * Features:
 * - Gradiente de borda animado
 * - Efeito glassmorphism (blur)
 * - Sombra suave com cor
 * - Micro-interações ao toque
 */

import React, { useCallback } from "react";
import { Pressable, View, ViewStyle, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { brand, neutral, shadows, radius, spacing } from "../../theme/tokens";

interface PremiumCardProps {
  children: React.ReactNode;
  /** Card variant */
  variant?: "default" | "accent" | "glass" | "gradient";
  /** Whether card is pressable */
  pressable?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Disable haptic feedback */
  noHaptic?: boolean;
  /** Custom padding */
  padding?: number;
  /** Border radius */
  borderRadius?: number;
  /** Show animated border */
  animatedBorder?: boolean;
  /** Custom gradient colors for border */
  borderGradientColors?: string[];
  /** Container style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PremiumCard({
  children,
  variant = "default",
  pressable = false,
  onPress,
  noHaptic = false,
  padding = spacing.lg,
  borderRadius = radius.xl,
  animatedBorder = false,
  borderGradientColors,
  style,
  accessibilityLabel,
}: PremiumCardProps) {
  const { isDark } = useTheme();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  // Get variant-specific styles
  const getVariantStyles = useCallback(() => {
    switch (variant) {
      case "accent":
        return {
          backgroundColor: isDark ? brand.accent[900] : brand.accent[50],
          borderColor: isDark ? brand.accent[700] : brand.accent[200],
          shadowColor: brand.accent[500],
        };
      case "glass":
        return {
          backgroundColor: isDark
            ? "rgba(30, 30, 40, 0.8)"
            : "rgba(255, 255, 255, 0.85)",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          shadowColor: isDark ? neutral[900] : neutral[400],
        };
      case "gradient":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          shadowColor: brand.primary[500],
        };
      default:
        return {
          backgroundColor: isDark ? brand.primary[900] : neutral[0],
          borderColor: isDark ? brand.primary[700] : neutral[100],
          shadowColor: isDark ? neutral[900] : neutral[400],
        };
    }
  }, [variant, isDark]);

  const variantStyles = getVariantStyles();

  // Default gradient colors for animated border
  const defaultGradient = [
    brand.accent[400],
    brand.primary[400],
    brand.accent[300],
    brand.primary[500],
    brand.accent[400],
  ] as const;
  const gradientColors: readonly [string, string, ...string[]] =
    borderGradientColors && borderGradientColors.length >= 2
      ? (borderGradientColors as [string, string, ...string[]])
      : defaultGradient;

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    pressed.value = withTiming(1, { duration: 100 });
  }, [scale, pressed]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    pressed.value = withTiming(0, { duration: 200 });
  }, [scale, pressed]);

  const handlePress = useCallback(async () => {
    if (!noHaptic) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [noHaptic, onPress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCardStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      pressed.value,
      [0, 1],
      [
        variantStyles.backgroundColor,
        isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.02)",
      ]
    );

    return {
      backgroundColor: variant === "gradient" ? "transparent" : bgColor,
    };
  });

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        {
          padding,
          borderRadius,
          borderWidth: animatedBorder ? 0 : 1,
          borderColor: variantStyles.borderColor,
          ...shadows.md,
        },
        {
          // Override shadow color after spreading shadows.md
          shadowColor: variantStyles.shadowColor,
        },
        animatedCardStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  // Wrap with gradient border if animated
  const wrappedContent = animatedBorder ? (
    <View style={[styles.gradientBorderContainer, { borderRadius: borderRadius + 2 }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBorder, { borderRadius: borderRadius + 2 }]}
      />
      <View
        style={[
          styles.innerCard,
          {
            borderRadius,
            backgroundColor: variantStyles.backgroundColor,
            margin: 2,
          },
        ]}
      >
        {cardContent}
      </View>
    </View>
  ) : (
    cardContent
  );

  if (pressable || onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedContainerStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        {wrappedContent}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      {wrappedContent}
    </Animated.View>
  );
}

/**
 * GlassCard - Card com efeito glassmorphism
 * Versão simplificada do PremiumCard com blur
 */
interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <PremiumCard variant="glass" style={style}>
      {children}
    </PremiumCard>
  );
}

/**
 * AccentCard - Card com destaque de cor accent
 */
interface AccentCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AccentCard({ children, onPress, style }: AccentCardProps) {
  return (
    <PremiumCard
      variant="accent"
      onPress={onPress}
      pressable={!!onPress}
      style={style}
    >
      {children}
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  gradientBorderContainer: {
    position: "relative",
    overflow: "hidden",
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
  },
  innerCard: {
    overflow: "hidden",
  },
});

export default PremiumCard;
