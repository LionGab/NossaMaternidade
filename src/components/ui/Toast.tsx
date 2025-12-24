/**
 * Toast Component - Sistema de notificações
 * Substitui alerts e console.log para feedback ao usuário
 */

import React, { useCallback, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { neutral, spacing, radius, shadows, typography, semantic } from "../../theme/tokens";

// Local aliases for cleaner code
const COLORS = { neutral, semantic: semantic.light };
const SPACING = spacing;
const RADIUS = radius;
const SHADOWS = shadows;
const TYPOGRAPHY = typography;

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastConfig {
  onDismiss: () => void;
}

const TOAST_COLORS = {
  success: COLORS.semantic.success,
  error: COLORS.semantic.error,
  info: COLORS.semantic.info,
  warning: COLORS.semantic.warning,
} as const;

const TOAST_ICONS = {
  success: "checkmark-circle" as const,
  error: "close-circle" as const,
  info: "information-circle" as const,
  warning: "warning" as const,
};

export function Toast({ message, type = "info", duration = 3000, action, onDismiss }: ToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [fadeAnim, onDismiss, slideAnim]);

  useEffect(() => {
    // Animar entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [dismiss, duration, fadeAnim, slideAnim]);

  const color = TOAST_COLORS[type];
  const icon = TOAST_ICONS[type];

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 60,
        left: SPACING.lg,
        right: SPACING.lg,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Pressable
        onPress={dismiss}
        style={{
          backgroundColor: COLORS.neutral[0],
          borderRadius: RADIUS.xl,
          padding: SPACING.lg,
          flexDirection: "row",
          alignItems: "center",
          borderLeftWidth: 4,
          borderLeftColor: color,
          ...SHADOWS.lg,
        }}
      >
        <Ionicons name={icon} size={24} color={color} style={{ marginRight: SPACING.md }} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...TYPOGRAPHY.bodyMedium,
              color: COLORS.neutral[900],
              fontWeight: "600",
            }}
          >
            {message}
          </Text>
          {action && (
            <Pressable
              onPress={() => {
                action.onPress();
                dismiss();
              }}
              style={{ marginTop: SPACING.xs }}
            >
              <Text
                style={{
                  ...TYPOGRAPHY.labelSmall,
                  color: color,
                  fontWeight: "700",
                }}
              >
                {action.label}
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={dismiss} style={{ marginLeft: SPACING.md }}>
          <Ionicons name="close" size={20} color={COLORS.neutral[400]} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
