import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "soft" | "outline";
  color?: string;
  bgColor?: string;
  disabled?: boolean;
}

// iOS HIG minimum tap target: 44pt
const SIZE_MAP = {
  sm: { button: 44, icon: 18 },
  md: { button: 44, icon: 22 },
  lg: { button: 52, icon: 26 },
};

export default function IconButton({
  icon,
  onPress,
  size = "md",
  variant = "default",
  color,
  bgColor,
  disabled = false,
}: IconButtonProps) {
  const { colors } = useTheme();

  const handlePress = async () => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const currentSize = SIZE_MAP[size];

  const variantStyles: Record<string, { bg: string; iconColor: string; border?: string }> = {
    default: {
      bg: "transparent",
      iconColor: color || colors.neutral[900],
    },
    filled: {
      bg: bgColor || colors.primary[500],
      iconColor: color || colors.neutral[0],
    },
    soft: {
      bg: bgColor || colors.background.tertiary,
      iconColor: color || colors.neutral[900],
    },
    outline: {
      bg: "transparent",
      iconColor: color || colors.neutral[900],
      border: colors.neutral[200],
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: currentSize.button,
        height: currentSize.button,
        borderRadius: currentSize.button / 2,
        backgroundColor: currentVariant.bg,
        borderWidth: variant === "outline" ? 1.5 : 0,
        borderColor: currentVariant.border ?? "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
      })}
    >
      <Ionicons
        name={icon}
        size={currentSize.icon}
        color={currentVariant.iconColor}
      />
    </Pressable>
  );
}
