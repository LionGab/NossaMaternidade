/**
 * ScreenHeader - Header padronizado para telas
 *
 * Design System 2025 - Calm FemTech
 * Consistência visual em todas as telas principais
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { accessibility, spacing as tokenSpacing, typography } from "../../theme/tokens";

interface ScreenHeaderProps {
  /** Main title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional emoji/icon before title */
  emoji?: string;
  /** Optional icon before title (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Left action (back button, menu, etc.) */
  leftAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };
  /** Right action(s) */
  rightActions?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
    badge?: number;
  }[];
  /** Show animated entrance */
  animated?: boolean;
  /** Custom logo/avatar component */
  logo?: React.ReactNode;
  /** Header variant */
  variant?: "default" | "large" | "transparent";
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * Padronized screen header for all main screens
 *
 * @example
 * ```tsx
 * <ScreenHeader
 *   title="Mães Valente"
 *   subtitle="Comunidade de apoio"
 *   logo={<Image source={{ uri: logoUrl }} />}
 *   rightActions={[{ icon: "search", onPress: handleSearch }]}
 * />
 * ```
 */
export function ScreenHeader({
  title,
  subtitle,
  emoji,
  icon,
  leftAction,
  rightActions,
  animated = true,
  logo,
  variant = "default",
  style,
}: ScreenHeaderProps) {
  const { colors, isDark, spacing } = useTheme();

  const handlePress = async (onPress: () => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Colors based on variant
  const bgColor =
    variant === "transparent"
      ? "transparent"
      : isDark
        ? colors.background.primary
        : colors.background.primary;

  const textPrimary = isDark ? colors.neutral[100] : colors.neutral[900];
  const textSecondary = isDark ? colors.neutral[400] : colors.neutral[500];

  // Typography sizes based on variant
  const titleSize = variant === "large" ? typography.headlineSmall : typography.titleLarge;

  const content = (
    <View
      style={[
        {
          backgroundColor: bgColor,
          paddingHorizontal: spacing.xl,
          paddingTop: tokenSpacing.lg,
          paddingBottom: tokenSpacing.lg,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: Action or Logo + Title */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {leftAction && (
            <Pressable
              onPress={() => handlePress(leftAction.onPress)}
              accessibilityLabel={leftAction.label || "Voltar"}
              accessibilityRole="button"
              style={({ pressed }) => ({
                width: accessibility.minTapTarget,
                height: accessibility.minTapTarget,
                borderRadius: accessibility.minTapTarget / 2,
                alignItems: "center",
                justifyContent: "center",
                marginRight: tokenSpacing.sm,
                backgroundColor: pressed
                  ? isDark
                    ? colors.neutral[800]
                    : colors.primary[50]
                  : "transparent",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons
                name={leftAction.icon}
                size={24}
                color={isDark ? colors.neutral[300] : colors.neutral[600]}
              />
            </Pressable>
          )}

          {logo && (
            <View
              style={{
                marginRight: tokenSpacing.sm,
                width: 32,
                height: 32,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {logo}
            </View>
          )}

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {emoji && (
                <Text style={{ fontSize: 22, marginRight: tokenSpacing.sm }}>{emoji}</Text>
              )}
              {icon && !emoji && (
                <Ionicons
                  name={icon}
                  size={22}
                  color={colors.primary[500]}
                  style={{ marginRight: tokenSpacing.sm }}
                />
              )}
              <Text
                style={{
                  color: textPrimary,
                  fontSize: titleSize.fontSize,
                  fontWeight: "700",
                  fontFamily: "Manrope_700Bold",
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>

            {subtitle && (
              <Text
                style={{
                  color: textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                  fontFamily: "Manrope_500Medium",
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right side: Actions */}
        {rightActions && rightActions.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {rightActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={() => handlePress(action.onPress)}
                accessibilityLabel={action.label || `Ação ${index + 1}`}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  width: accessibility.minTapTarget,
                  height: accessibility.minTapTarget,
                  borderRadius: accessibility.minTapTarget / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: index > 0 ? tokenSpacing.xs : 0,
                  backgroundColor: pressed
                    ? isDark
                      ? colors.neutral[800]
                      : colors.primary[50]
                    : isDark
                      ? colors.neutral[800]
                      : colors.primary[50],
                  borderWidth: 1,
                  borderColor: isDark ? colors.neutral[700] : colors.primary[100],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={isDark ? colors.primary[300] : colors.primary[500]}
                />
                {action.badge !== undefined && action.badge > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: colors.semantic.error,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.neutral[0],
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      {action.badge > 99 ? "99+" : action.badge}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.duration(500).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

export default ScreenHeader;
