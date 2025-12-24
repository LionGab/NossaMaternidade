/**
 * FAB - Floating Action Button
 *
 * Design System 2025 - Calm FemTech
 * Botão flutuante padronizado com tamanho consistente
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { shadows } from "../../theme/tokens";

interface FABProps {
  /** Icon to display (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Press handler */
  onPress: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /**
   * Visual variant:
   * - primary: Azul pastel (ação principal calma)
   * - accent: Rosa/pink (destaque máximo, CTAs principais)
   * - gradient: Gradiente azul
   */
  variant?: "primary" | "accent" | "gradient";
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Show entrance animation */
  animated?: boolean;
  /** Animation delay */
  animationDelay?: number;
  /** Additional style */
  style?: ViewStyle;
  /** Disabled state */
  disabled?: boolean;
}

// Padronized sizes (consistent across app)
const SIZES = {
  sm: { container: 48, icon: 22 },
  md: { container: 56, icon: 26 },
  lg: { container: 64, icon: 30 },
};

/**
 * Floating Action Button with consistent design
 *
 * @example
 * ```tsx
 * <FAB
 *   icon="add"
 *   onPress={handleNewPost}
 *   variant="accent"
 *   accessibilityLabel="Criar novo post"
 * />
 * ```
 */
export function FAB({
  icon = "add",
  onPress,
  size = "md",
  variant = "accent",
  accessibilityLabel = "Ação principal",
  animated = true,
  animationDelay = 300,
  style,
  disabled = false,
}: FABProps) {
  const { brand, colors, isDark } = useTheme();

  const currentSize = SIZES[size];

  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case "accent":
        return {
          bg: isDark ? brand.accent[500] : brand.accent[400],
          icon: colors.neutral[900], // Navy text for AAA contrast
          shadow: brand.accent[400],
        };
      case "gradient":
        return {
          bg: brand.primary[500],
          icon: colors.neutral[0],
          shadow: brand.primary[500],
          gradient: [brand.primary[400], brand.primary[600]] as const,
        };
      case "primary":
      default:
        return {
          bg: brand.primary[500],
          icon: colors.neutral[0],
          shadow: brand.primary[500],
        };
    }
  };

  const colorConfig = getColors();

  const buttonContent = (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        {
          width: currentSize.container,
          height: currentSize.container,
          borderRadius: currentSize.container / 2,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed && !disabled ? 0.92 : 1 }],
        },
        !colorConfig.gradient && {
          backgroundColor: colorConfig.bg,
          ...shadows.lg,
          shadowColor: colorConfig.shadow,
        },
        style,
      ]}
    >
      {colorConfig.gradient ? (
        <LinearGradient
          colors={colorConfig.gradient}
          style={{
            width: currentSize.container,
            height: currentSize.container,
            borderRadius: currentSize.container / 2,
            alignItems: "center",
            justifyContent: "center",
            ...shadows.lg,
          }}
        >
          <Ionicons name={icon} size={currentSize.icon} color={colorConfig.icon} />
        </LinearGradient>
      ) : (
        <Ionicons name={icon} size={currentSize.icon} color={colorConfig.icon} />
      )}
    </Pressable>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInUp.delay(animationDelay).duration(400)}>
        {buttonContent}
      </Animated.View>
    );
  }

  return buttonContent;
}

export default FAB;
