/**
 * Error State Component
 * Estados de erro consistentes com opção de retry
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { brand, neutral, spacing, radius, typography, semantic } from "../../theme/tokens";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ 
  title = "Algo deu errado", 
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente"
}: ErrorStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing["3xl"],
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: semantic.light.errorLight,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xl,
        }}
      >
        <Ionicons name="alert-circle" size={40} color={semantic.light.error} />
      </View>

      <Text
        style={{
          ...typography.headlineSmall,
          color: neutral[900],
          textAlign: "center",
          marginBottom: spacing.md,
        }}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={{
            ...typography.bodyMedium,
            color: neutral[600],
            textAlign: "center",
            marginBottom: spacing.xl,
          }}
        >
          {message}
        </Text>
      )}

      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          style={{
            backgroundColor: brand.primary[500],
            paddingHorizontal: spacing["2xl"],
            paddingVertical: spacing.lg,
            borderRadius: radius.lg,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              ...typography.labelLarge,
              color: neutral[0],
              fontWeight: "700",
            }}
          >
            {retryLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
