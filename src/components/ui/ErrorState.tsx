/**
 * Error State Component
 * Estados de erro consistentes com opção de retry
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../../theme/design-system";

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
        padding: SPACING["3xl"],
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.semantic.error + "15",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.xl,
        }}
      >
        <Ionicons name="alert-circle" size={40} color={COLORS.semantic.error} />
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

      {onRetry && (
        <Pressable
          onPress={onRetry}
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
            {retryLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
