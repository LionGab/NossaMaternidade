/**
 * EmptyState - Premium Empty State Component
 *
 * Design System 2025 - Calm FemTech
 * Estados vazios acolhedores, consistentes e com suporte a dark mode
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { accessibility, radius, spacing, typography } from "../../theme/tokens";

interface EmptyStateProps {
  /** Icon to display (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Main title */
  title: string;
  /** Supporting message */
  message?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button handler */
  onAction?: () => void;
  /** Visual variant */
  variant?: "default" | "compact" | "centered";
  /** Show animation on mount */
  animated?: boolean;
  /** Custom emoji instead of icon */
  emoji?: string;
}

/**
 * Premium Empty State component with dark mode support
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="chatbubbles-outline"
 *   title="Nenhuma conversa ainda"
 *   message="Comece uma conversa com a NathIA"
 *   actionLabel="Iniciar conversa"
 *   onAction={handleStart}
 * />
 * ```
 */
export function EmptyState({
  icon = "document-outline",
  title,
  message,
  actionLabel,
  onAction,
  variant = "default",
  animated = true,
  emoji,
}: EmptyStateProps) {
  const { colors, isDark, brand } = useTheme();

  const handleAction = async () => {
    if (onAction) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAction();
    }
  };

  // Colors based on theme
  const iconBgColor = isDark ? brand.primary[900] : brand.primary[50];
  const iconColor = isDark ? brand.primary[300] : brand.primary[500];
  const titleColor = isDark ? colors.neutral[100] : colors.neutral[900];
  const messageColor = isDark ? colors.neutral[400] : colors.neutral[600];
  const buttonBgColor = brand.primary[500];
  const buttonTextColor = colors.neutral[0];

  // Variant-specific padding
  const containerPadding = variant === "compact" ? spacing.xl : spacing["3xl"];
  const iconSize = variant === "compact" ? 64 : 80;
  const emojiSize = variant === "compact" ? 32 : 40;

  const content = (
    <View
      style={{
        flex: variant === "centered" ? 1 : undefined,
        alignItems: "center",
        justifyContent: "center",
        padding: containerPadding,
      }}
    >
      {/* Icon/Emoji Container */}
      <Animated.View
        entering={animated ? FadeIn.delay(100).duration(400) : undefined}
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 2,
          backgroundColor: iconBgColor,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xl,
        }}
      >
        {emoji ? (
          <Text style={{ fontSize: emojiSize }}>{emoji}</Text>
        ) : (
          <Ionicons name={icon} size={emojiSize} color={iconColor} />
        )}
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={animated ? FadeInUp.delay(200).duration(400) : undefined}
        style={{
          ...typography.headlineSmall,
          color: titleColor,
          textAlign: "center",
          marginBottom: message ? spacing.md : actionLabel ? spacing.xl : 0,
          fontFamily: "Manrope_700Bold",
        }}
      >
        {title}
      </Animated.Text>

      {/* Message */}
      {message && (
        <Animated.Text
          entering={animated ? FadeInUp.delay(300).duration(400) : undefined}
          style={{
            ...typography.bodyMedium,
            color: messageColor,
            textAlign: "center",
            marginBottom: actionLabel ? spacing.xl : 0,
            lineHeight: 22,
            maxWidth: 280,
          }}
        >
          {message}
        </Animated.Text>
      )}

      {/* CTA Button */}
      {actionLabel && onAction && (
        <Animated.View entering={animated ? FadeInUp.delay(400).duration(400) : undefined}>
          <Pressable
            onPress={handleAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            style={({ pressed }) => ({
              backgroundColor: buttonBgColor,
              paddingHorizontal: spacing["2xl"],
              paddingVertical: spacing.lg,
              borderRadius: radius.lg,
              minHeight: accessibility.minTapTarget,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text
              style={{
                ...typography.labelLarge,
                color: buttonTextColor,
                fontWeight: "700",
                fontFamily: "Manrope_700Bold",
              }}
            >
              {actionLabel}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={{ flex: variant === "centered" ? 1 : undefined }}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

export default EmptyState;
