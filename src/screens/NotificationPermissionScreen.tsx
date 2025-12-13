/**
 * Nossa Maternidade - NotificationPermissionScreen
 * Notification permission request with benefit cards
 */

import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
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

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  description,
  delay,
}: FeatureCardProps) => (
  <Animated.View
    entering={FadeInDown.duration(500).delay(delay).springify()}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: RADIUS["2xl"],
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.sm,
    }}
  >
    <View
      style={{
        backgroundColor: iconBgColor,
        borderRadius: RADIUS.full,
        padding: SPACING.md,
        marginRight: SPACING.lg,
      }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: TYPOGRAPHY.bodyLarge.fontSize,
          fontWeight: "600",
          color: COLORS.neutral[800],
          marginBottom: 2,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: TYPOGRAPHY.bodySmall.fontSize,
          color: COLORS.neutral[600],
          lineHeight: 18,
        }}
      >
        {description}
      </Text>
    </View>
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
        // Initialize all notification schedules
        await initializeNotifications();
        await markNotificationSetupComplete();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("NathIAOnboarding");
      } else {
        // Permission denied
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await skipNotificationSetup();
        navigation.replace("NathIAOnboarding");
      }
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await skipNotificationSetup();
      navigation.replace("NathIAOnboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await skipNotificationSetup();
    navigation.replace("NathIAOnboarding");
  };

  return (
    <LinearGradient
      colors={["#FFF1F2", "#FCE7F3", "#FAE8FF", COLORS.background.primary]}
      locations={[0, 0.3, 0.6, 1]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACING["2xl"],
          paddingTop: insets.top + SPACING["4xl"],
          paddingBottom: insets.bottom + SPACING["2xl"],
          justifyContent: "center",
        }}
      >
        {/* Icon */}
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          style={{
            alignItems: "center",
            marginBottom: SPACING["3xl"],
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: RADIUS.full,
              padding: SPACING["2xl"],
              ...SHADOWS.lg,
            }}
          >
            <LinearGradient
              colors={[COLORS.primary[500], COLORS.secondary[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Title and Description */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200).springify()}
          style={{ marginBottom: SPACING["3xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.displaySmall.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              textAlign: "center",
              marginBottom: SPACING.md,
              letterSpacing: -0.5,
            }}
          >
            Fique conectada
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              color: COLORS.neutral[600],
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Receba lembretes gentis para cuidar de você e acompanhar sua jornada
          </Text>
        </Animated.View>

        {/* Features */}
        <View style={{ marginBottom: SPACING["3xl"] }}>
          <FeatureCard
            icon="heart"
            iconColor={COLORS.primary[500]}
            iconBgColor={COLORS.primary[50]}
            title="Check-in diário"
            description="Como você está se sentindo hoje?"
            delay={400}
          />

          <FeatureCard
            icon="sparkles"
            iconColor={COLORS.secondary[500]}
            iconBgColor={COLORS.secondary[50]}
            title="Afirmações diárias"
            description="Mensagens de amor e encorajamento"
            delay={500}
          />

          <FeatureCard
            icon="leaf"
            iconColor={COLORS.semantic.success}
            iconBgColor="#DCFCE7"
            title="Hábitos saudáveis"
            description="Lembretes para seus rituais de bem-estar"
            delay={600}
          />

          <FeatureCard
            icon="moon"
            iconColor="#6366F1"
            iconBgColor="#EEF2FF"
            title="Momento de descanso"
            description="Pausa para respirar e relaxar"
            delay={700}
          />
        </View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(800).springify()}
        >
          <Pressable
            onPress={handleEnableNotifications}
            disabled={isLoading}
            style={{
              marginBottom: SPACING.md,
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            <LinearGradient
              colors={[COLORS.primary[500], COLORS.secondary[500]]}
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
                {isLoading ? (
                  <Ionicons
                    name="sync-outline"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: SPACING.sm }}
                  />
                ) : (
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: SPACING.sm }}
                  />
                )}
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: TYPOGRAPHY.labelLarge.fontSize,
                    fontWeight: "700",
                  }}
                >
                  {isLoading ? "Configurando..." : "Ativar notificações"}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handleSkip}
            disabled={isLoading}
            style={{
              paddingVertical: SPACING.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.neutral[500],
                fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                fontWeight: "500",
              }}
            >
              Agora não
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
