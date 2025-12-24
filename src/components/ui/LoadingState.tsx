/**
 * Loading State Component
 * Estado de carregamento consistente em todo o app
 */

import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { brand, neutral, spacing, typography } from "../../theme/tokens";

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
        padding: spacing["2xl"],
      }}
    >
      <ActivityIndicator size={size} color={brand.primary[500]} />
      {message && (
        <Text
          style={{
            ...typography.bodyMedium,
            color: neutral[600],
            marginTop: spacing.lg,
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
          backgroundColor: brand.primary[50],
        }}
      >
        {content}
      </View>
    );
  }

  return content;
}
