/**
 * Loading State Component
 * Estado de carregamento consistente em todo o app
 */

import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../theme/design-system";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export function LoadingState({ message, size = "large", fullScreen = false }: LoadingStateProps) {
  const content = (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING["2xl"],
      }}
    >
      <ActivityIndicator size={size} color={COLORS.primary[500]} />
      {message && (
        <Text
          style={{
            ...TYPOGRAPHY.bodyMedium,
            color: COLORS.neutral[600],
            marginTop: SPACING.lg,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.background.primary,
        }}
      >
        {content}
      </View>
    );
  }

  return content;
}
