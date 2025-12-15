/**
 * Empty State Component
 * Estados vazios acolhedores e consistentes
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../../theme/design-system";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = "document-outline", title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING["3xl"],
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.primary[50],
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.xl,
        }}
      >
        <Ionicons name={icon} size={40} color={COLORS.primary[500]} />
      </View>

      <Text
        style={{
          ...TYPOGRAPHY.headlineSmall,
          color: COLORS.neutral[900],
          textAlign: "center",
          marginBottom: SPACING.md,
        }}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={{
            ...TYPOGRAPHY.bodyMedium,
            color: COLORS.neutral[600],
            textAlign: "center",
            marginBottom: SPACING.xl,
          }}
        >
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={{
            backgroundColor: COLORS.primary[500],
            paddingHorizontal: SPACING["2xl"],
            paddingVertical: SPACING.lg,
            borderRadius: RADIUS.lg,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              ...TYPOGRAPHY.labelLarge,
              color: COLORS.neutral[0],
              fontWeight: "700",
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
