import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Pressable, View, ViewProps } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";

interface CardProps extends ViewProps {
  /**
   * Visual variant:
   * - default: Fundo card padrão (azul claro)
   * - elevated: Com sombra suave e fundo branco
   * - outlined: Borda sutil
   * - soft: Fundo azul suave
   * - accent: Destaque com borda rosa (raro)
   */
  variant?: "default" | "elevated" | "outlined" | "soft" | "accent";
  /** Custom background color override */
  color?: string;
  /** Internal padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Border radius */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Press handler (makes card interactive) */
  onPress?: () => void;
  /** Animate on mount */
  animated?: boolean;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Card content */
  children: React.ReactNode;
}

const PADDING_MAP = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
};

const RADIUS_MAP = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

/**
 * Design System Card Component - Calm FemTech 2025
 *
 * Container com variantes, sombras, bordas e suporte a dark mode.
 * Base azul pastel para superfícies calmas.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="outlined" onPress={handlePress}>
 *   <Text>Clickable card</Text>
 * </Card>
 *
 * <Card variant="accent">
 *   <Text>Highlight card</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = "default",
  color,
  padding = "md",
  radius = "lg",
  onPress,
  animated = false,
  animationDelay = 0,
  children,
  style,
  ...props
}: CardProps) {
  const { card: cardTokens, brand, border: borderTokens, isDark } = useTheme();

  const baseStyle = useMemo(
    () => ({
      backgroundColor: color || cardTokens.base.background,
      borderRadius: RADIUS_MAP[radius],
      padding: PADDING_MAP[padding],
    }),
    [color, cardTokens.base.background, radius, padding]
  );

  const variantStyle = useMemo(
    () => ({
      default: {
        borderWidth: isDark ? 0.5 : 1,  // Subtle border in dark mode
        borderColor: isDark ? borderTokens.subtle : cardTokens.base.border,
      },
      elevated: {
        backgroundColor: color || cardTokens.elevated.background,
        // Dark mode: Use border instead of shadow for better visibility
        ...(isDark
          ? {
              borderWidth: 0.5,
              borderColor: borderTokens.default,
            }
          : {
              shadowColor: brand.primary[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 3,
            }),
      },
      outlined: {
        backgroundColor: color || cardTokens.outlined.background,
        borderWidth: isDark ? 1 : 1,
        borderColor: isDark ? borderTokens.default : cardTokens.outlined.border,
      },
      soft: {
        backgroundColor: color || brand.primary[isDark ? 900 : 50],
        borderWidth: isDark ? 0.5 : 0,  // Add subtle border in dark
        borderColor: isDark ? borderTokens.subtle : "transparent",
      },
      accent: {
        borderWidth: 1.5,
        borderColor: isDark ? brand.accent[400] : brand.accent[300],
        backgroundColor: isDark
          ? `${brand.accent[400]}14` // ~8% opacity em hex
          : brand.accent[50],
      },
    }),
    [isDark, cardTokens, brand, borderTokens, color]
  );

  const combinedStyle = [baseStyle, variantStyle[variant], style];

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View style={combinedStyle} {...props}>
      {children}
    </View>
  );

  if (animated) {
    const animatedContent = (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        style={combinedStyle}
        {...props}
      >
        {children}
      </Animated.View>
    );

    if (onPress) {
      return (
        <Pressable onPress={handlePress} style={{ opacity: 1 }}>
          {animatedContent}
        </Pressable>
      );
    }
    return animatedContent;
  }

  if (onPress) {
    return (
      <Pressable onPress={handlePress} style={{ opacity: 1 }}>
        {content}
      </Pressable>
    );
  }

  return content;
}

/** Legacy export for backward compatibility */
export default Card;
