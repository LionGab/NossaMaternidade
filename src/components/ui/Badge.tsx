/**
 * Badge - Indicador visual de status/contagem
 *
 * Design System 2025 - Calm FemTech
 * Badge padronizado para notificações, tags e indicadores
 */

import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { radius } from "../../theme/tokens";

interface BadgeProps {
  /** Badge content (text or number) */
  children?: React.ReactNode;
  /** Numeric value (alternative to children) */
  count?: number;
  /** Maximum count to show (shows "99+" if exceeded) */
  maxCount?: number;
  /**
   * Visual variant:
   * - primary: Azul pastel
   * - accent: Rosa/pink (destaque)
   * - success: Verde
   * - warning: Âmbar
   * - error: Vermelho
   * - neutral: Cinza
   */
  variant?: "primary" | "accent" | "success" | "warning" | "error" | "neutral";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show as dot only (no content) */
  dot?: boolean;
  /** Outline style instead of filled */
  outline?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

const SIZES = {
  sm: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    fontSize: 10,
    dotSize: 6,
  },
  md: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    fontSize: 11,
    dotSize: 8,
  },
  lg: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    fontSize: 12,
    dotSize: 10,
  },
};

/**
 * Badge component for status indicators, counts, and tags
 *
 * @example
 * ```tsx
 * <Badge count={5} variant="error" />
 * <Badge variant="success">NOVO</Badge>
 * <Badge dot variant="accent" />
 * ```
 */
export function Badge({
  children,
  count,
  maxCount = 99,
  variant = "primary",
  size = "sm",
  dot = false,
  outline = false,
  style,
}: BadgeProps) {
  const { brand, colors, isDark } = useTheme();

  const currentSize = SIZES[size];

  // Get colors based on variant
  const getColors = () => {
    const variants = {
      primary: {
        bg: isDark ? brand.primary[800] : brand.primary[100],
        bgFilled: brand.primary[500],
        text: isDark ? brand.primary[300] : brand.primary[700],
        textFilled: colors.neutral[0],
        border: brand.primary[400],
      },
      accent: {
        bg: isDark ? brand.accent[900] : brand.accent[50],
        bgFilled: isDark ? brand.accent[500] : brand.accent[400],
        text: isDark ? brand.accent[300] : brand.accent[700],
        textFilled: colors.neutral[900], // Navy for AAA contrast
        border: brand.accent[400],
      },
      success: {
        bg: isDark ? "rgba(16, 185, 129, 0.15)" : colors.semantic.successLight,
        bgFilled: colors.semantic.success,
        text: isDark ? "#34D399" : colors.semantic.success,
        textFilled: colors.neutral[0],
        border: colors.semantic.success,
      },
      warning: {
        bg: isDark ? "rgba(245, 158, 11, 0.15)" : colors.semantic.warningLight,
        bgFilled: colors.semantic.warning,
        text: isDark ? "#FBBF24" : "#B45309",
        textFilled: colors.neutral[900],
        border: colors.semantic.warning,
      },
      error: {
        bg: isDark ? "rgba(239, 68, 68, 0.15)" : colors.semantic.errorLight,
        bgFilled: colors.semantic.error,
        text: isDark ? "#F87171" : colors.semantic.error,
        textFilled: colors.neutral[0],
        border: colors.semantic.error,
      },
      neutral: {
        bg: isDark ? colors.neutral[800] : colors.neutral[100],
        bgFilled: isDark ? colors.neutral[600] : colors.neutral[500],
        text: isDark ? colors.neutral[300] : colors.neutral[600],
        textFilled: colors.neutral[0],
        border: isDark ? colors.neutral[600] : colors.neutral[300],
      },
    };

    return variants[variant];
  };

  const colorConfig = getColors();

  // Format count display
  const displayContent = count !== undefined
    ? count > maxCount
      ? `${maxCount}+`
      : count.toString()
    : children;

  // Dot-only mode
  if (dot) {
    return (
      <View
        style={[
          {
            width: currentSize.dotSize,
            height: currentSize.dotSize,
            borderRadius: currentSize.dotSize / 2,
            backgroundColor: outline ? "transparent" : colorConfig.bgFilled,
            borderWidth: outline ? 1.5 : 0,
            borderColor: colorConfig.border,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          minWidth: currentSize.minWidth,
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: radius.full,
          backgroundColor: outline ? colorConfig.bg : colorConfig.bgFilled,
          borderWidth: outline ? 1 : 0,
          borderColor: colorConfig.border,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: outline ? colorConfig.text : colorConfig.textFilled,
          fontSize: currentSize.fontSize,
          fontWeight: "700",
          fontFamily: "Manrope_700Bold",
          textAlign: "center",
        }}
      >
        {displayContent}
      </Text>
    </View>
  );
}

export default Badge;
