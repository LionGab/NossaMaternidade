import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { Tokens } from "../theme/tokens";

interface OfflineBannerProps {
  /** Called when user taps retry button */
  onRetry?: () => void;
  /** Shows loading indicator on retry button */
  isRetrying?: boolean;
}

/**
 * Banner que aparece no topo da tela quando não há conexão
 * Mostra mensagem amigável e botão para tentar novamente
 * Suporta dark mode
 *
 * @example
 * const { isOffline, retry, isChecking } = useNetworkStatus();
 *
 * return (
 *   <>
 *     {isOffline && <OfflineBanner onRetry={retry} isRetrying={isChecking} />}
 *     <MainContent />
 *   </>
 * );
 */
export function OfflineBanner({ onRetry, isRetrying = false }: OfflineBannerProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  // Cores warning adaptadas para dark mode
  const warningColors = isDark
    ? {
        bg: "rgba(245, 158, 11, 0.15)", // warning com transparência
        border: "rgba(245, 158, 11, 0.3)",
        iconBg: "rgba(245, 158, 11, 0.25)",
        iconColor: Tokens.semantic.dark.warning,
        titleColor: Tokens.semantic.dark.warning,
        textColor: "rgba(251, 191, 36, 0.9)", // amber-400
        buttonBg: "rgba(245, 158, 11, 0.2)",
        buttonBorder: "rgba(245, 158, 11, 0.4)",
      }
    : {
        bg: Tokens.semantic.light.warningLight,
        border: "#FDE68A", // amber-200
        iconBg: "#FDE68A",
        iconColor: "#B45309", // amber-700
        titleColor: "#92400E", // amber-800
        textColor: "#B45309", // amber-700
        buttonBg: "#FFFBEB", // amber-50
        buttonBorder: "#FCD34D", // amber-300
      };

  const handleRetry = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetry?.();
  };

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutUp.duration(300)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: warningColors.bg,
        borderBottomWidth: 1,
        borderBottomColor: warningColors.border,
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        entering={FadeIn.delay(100)}
        exiting={FadeOut}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: warningColors.iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={18} color={warningColors.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: warningColors.titleColor,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Sem conexão
            </Text>
            <Text
              style={{
                color: warningColors.textColor,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Algumas funções podem não funcionar.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleRetry}
          disabled={isRetrying}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: warningColors.buttonBg,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: warningColors.buttonBorder,
            opacity: isRetrying ? 0.7 : 1,
          }}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
          accessibilityHint="Verifica se a conexão foi restabelecida"
          accessibilityState={{ disabled: isRetrying }}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color={warningColors.iconColor} />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={16} color={warningColors.iconColor} />
              <Text
                style={{
                  color: warningColors.iconColor,
                  fontSize: 13,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                Tentar
              </Text>
            </>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default OfflineBanner;
