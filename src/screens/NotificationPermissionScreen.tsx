/**
 * Nossa Maternidade - NotificationPermissionScreen
 * Premium UX inspired by Headspace, Calm, and Flo
 * Pre-permission priming pattern with notification preview
 */

import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  registerForPushNotifications,
  initializeNotifications,
  markNotificationSetupComplete,
  skipNotificationSetup,
} from "../services/notifications";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../theme/design-system";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"NotificationPermission">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Notification preview component - shows how notifications will look
const NotificationPreview = ({ delay }: { delay: number }) => (
  <Animated.View
    entering={SlideInRight.duration(600).delay(delay).springify()}
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
      ...SHADOWS.md,
      borderWidth: 1,
      borderColor: "rgba(244, 63, 94, 0.1)",
    }}
  >
    <LinearGradient
      colors={[COLORS.primary[400], COLORS.primary[500]]}
      style={{
        width: 40,
        height: 40,
        borderRadius: RADIUS.lg,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md,
      }}
    >
      <Ionicons name="heart" size={20} color="#FFFFFF" />
    </LinearGradient>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: COLORS.neutral[800],
          marginBottom: 2,
        }}
      >
        Nossa Maternidade
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: COLORS.neutral[600],
        }}
        numberOfLines={1}
      >
        Bom dia! Como você está se sentindo hoje? 💕
      </Text>
    </View>
    <Text style={{ fontSize: 11, color: COLORS.neutral[400] }}>agora</Text>
  </Animated.View>
);

const NotificationPreview2 = ({ delay }: { delay: number }) => (
  <Animated.View
    entering={SlideInRight.duration(600).delay(delay).springify()}
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
      ...SHADOWS.sm,
      borderWidth: 1,
      borderColor: "rgba(167, 139, 250, 0.1)",
    }}
  >
    <LinearGradient
      colors={[COLORS.secondary[400], COLORS.secondary[500]]}
      style={{
        width: 40,
        height: 40,
        borderRadius: RADIUS.lg,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md,
      }}
    >
      <Ionicons name="sparkles" size={20} color="#FFFFFF" />
    </LinearGradient>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: COLORS.neutral[800],
          marginBottom: 2,
        }}
      >
        Sua afirmação do dia
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: COLORS.neutral[600],
        }}
        numberOfLines={1}
      >
        Você é forte e capaz. Confie no processo ✨
      </Text>
    </View>
    <Text style={{ fontSize: 11, color: COLORS.neutral[400] }}>8:00</Text>
  </Animated.View>
);

export default function NotificationPermissionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const token = await registerForPushNotifications();

      if (token) {
        await initializeNotifications();
        await markNotificationSetupComplete();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await skipNotificationSetup();
      }
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await skipNotificationSetup();
    } finally {
      setIsLoading(false);
      // Navigation handled by RootNavigator
    }
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await skipNotificationSetup();
    // Navigation handled by RootNavigator
  };

  return (
    <LinearGradient
      colors={["#FFF0F6", "#FAF5FF", "#FFFFFF"]}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACING.xl,
          paddingTop: insets.top + SPACING["2xl"],
          paddingBottom: insets.bottom + SPACING.xl,
        }}
      >
        {/* Header with bell animation */}
        <Animated.View
          entering={FadeInUp.duration(800).springify()}
          style={{
            alignItems: "center",
            marginBottom: SPACING["2xl"],
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: RADIUS.full,
              padding: SPACING.xl,
              ...SHADOWS.lg,
            }}
          >
            <LinearGradient
              colors={[COLORS.primary[400], COLORS.secondary[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications" size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Title - REFINADO */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200).springify()}
          style={{ marginBottom: SPACING.xl }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: COLORS.neutral[900],
              textAlign: "center",
              letterSpacing: -0.8,
              lineHeight: 38,
            }}
          >
            Nunca perca um{"\n"}momento importante 💜
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300).springify()}
          style={{ marginBottom: SPACING["2xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              color: COLORS.neutral[600],
              textAlign: "center",
              lineHeight: 24,
              paddingHorizontal: SPACING.md,
            }}
          >
            Lembretes carinhosos para cuidar de você durante essa jornada especial
          </Text>
        </Animated.View>

        {/* Notification Previews - Like real notifications */}
        <Animated.View
          entering={FadeIn.duration(400).delay(500)}
          style={{
            marginBottom: SPACING["2xl"],
            paddingHorizontal: SPACING.xs,
          }}
        >
          <NotificationPreview delay={600} />
          <NotificationPreview2 delay={750} />
        </Animated.View>

        {/* Benefits List */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(900).springify()}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            marginBottom: SPACING["2xl"],
          }}
        >
          {[
            { icon: "sunny", text: "Check-in diário às 9h", color: "#F59E0B" },
            { icon: "sparkles", text: "Afirmações positivas às 8h", color: COLORS.secondary[500] },
            { icon: "leaf", text: "Lembretes de hábitos às 20h", color: "#10B981" },
            { icon: "moon", text: "Momento de relaxar às 14:30", color: "#6366F1" },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: SPACING.sm,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: `${item.color}15`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: SPACING.md,
                }}
              >
                <Ionicons name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                  color: COLORS.neutral[700],
                  flex: 1,
                }}
              >
                {item.text}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.semantic.success} />
            </View>
          ))}
        </Animated.View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Buttons */}
        <Animated.View entering={FadeInDown.duration(600).delay(1100).springify()}>
          {/* Primary Button */}
          <Pressable
            onPress={handleEnableNotifications}
            disabled={isLoading}
            style={({ pressed }) => ({
              marginBottom: SPACING.md,
              opacity: isLoading ? 0.8 : pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={[COLORS.primary[500], COLORS.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: RADIUS.xl,
                paddingVertical: SPACING.lg + 2,
                alignItems: "center",
                ...SHADOWS.md,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={isLoading ? "hourglass-outline" : "notifications"}
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: SPACING.sm }}
                />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: TYPOGRAPHY.labelLarge.fontSize,
                    fontWeight: "700",
                  }}
                >
                  {isLoading ? "Configurando..." : "Ativar lembretes"}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Secondary Button */}
          <Pressable
            onPress={handleSkip}
            disabled={isLoading}
            style={({ pressed }) => ({
              paddingVertical: SPACING.md,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: COLORS.neutral[500],
                fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                fontWeight: "500",
              }}
            >
              Configurar depois
            </Text>
          </Pressable>

          {/* Privacy note */}
          <Animated.View
            entering={FadeIn.duration(400).delay(1300)}
            style={{ alignItems: "center", marginTop: SPACING.sm }}
          >
            <Text
              style={{
                color: COLORS.neutral[400],
                fontSize: 11,
                textAlign: "center",
              }}
            >
              Você pode alterar isso a qualquer momento nas configurações
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
