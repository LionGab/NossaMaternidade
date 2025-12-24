/**
 * AlertModal - Custom modal to replace native Alert.alert
 *
 * Follows Apple HIG and Material Design 3 guidelines
 * Supports multiple button configurations
 *
 * @version 1.0.0
 */

import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { neutral, typography, spacing, accessibility } from "../../theme/tokens";

// Local aliases for cleaner code
const COLORS = { neutral };
const TYPOGRAPHY = typography;
const SPACING = spacing;
const ACCESSIBILITY = accessibility;

export interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export function AlertModal({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
  icon,
  iconColor,
}: AlertModalProps) {
  const { colors, isDark } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onDismiss();
  };

  const getButtonStyle = (style?: "default" | "cancel" | "destructive") => {
    switch (style) {
      case "destructive":
        return {
          backgroundColor: colors.semantic.error,
          textColor: COLORS.neutral[0],
        };
      case "cancel":
        return {
          backgroundColor: colors.background.tertiary,
          textColor: colors.text.primary,
        };
      default:
        return {
          backgroundColor: colors.primary[500],
          textColor: COLORS.neutral[0],
        };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable
        onPress={onDismiss}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING.lg,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.background.card,
            borderRadius: 24,
            padding: SPACING.lg,
            width: "100%",
            maxWidth: 340,
            shadowColor: colors.neutral[900],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          {/* Icon */}
          {icon && (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: iconColor
                  ? `${iconColor}20`
                  : isDark
                    ? colors.primary[800]
                    : colors.primary[50],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: SPACING.md,
                alignSelf: "center",
              }}
            >
              <Ionicons
                name={icon}
                size={28}
                color={iconColor || colors.primary[500]}
              />
            </View>
          )}

          {/* Title */}
          <Text
            style={{
              color: colors.text.primary,
              fontSize: TYPOGRAPHY.titleLarge.fontSize,
              fontFamily: "DMSerifDisplay_400Regular",
              textAlign: "center",
              marginBottom: SPACING.xs,
            }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: TYPOGRAPHY.bodyMedium.fontSize,
              lineHeight: 22,
              textAlign: "center",
              marginBottom: SPACING.lg,
            }}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View
            style={{
              flexDirection: buttons.length <= 2 ? "row" : "column",
              gap: SPACING.sm,
            }}
          >
            {buttons.map((button, index) => {
              const buttonStyle = getButtonStyle(button.style);
              return (
                <Pressable
                  key={index}
                  onPress={() => handleButtonPress(button)}
                  style={{
                    flex: buttons.length <= 2 ? 1 : undefined,
                    backgroundColor: buttonStyle.backgroundColor,
                    borderRadius: 16,
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.md,
                    alignItems: "center",
                    minHeight: ACCESSIBILITY.minTapTarget,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: buttonStyle.textColor,
                      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                      fontWeight: "600",
                    }}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Hook to manage AlertModal state
 */
export function useAlertModal() {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<AlertModalProps, "visible" | "onDismiss">>({
    title: "",
    message: "",
  });

  const show = React.useCallback(
    (alertConfig: Omit<AlertModalProps, "visible" | "onDismiss">) => {
      setConfig(alertConfig);
      setVisible(true);
    },
    []
  );

  const hide = React.useCallback(() => {
    setVisible(false);
  }, []);

  const AlertModalComponent = React.useCallback(
    () => (
      <AlertModal
        visible={visible}
        onDismiss={hide}
        {...config}
      />
    ),
    [visible, config, hide]
  );

  return {
    show,
    hide,
    AlertModal: AlertModalComponent,
  };
}
