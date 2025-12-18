import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { RootStackScreenProps } from "../types/navigation";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { getIconName } from "../types/icons";

interface ComingSoonParams {
  title?: string;
  description?: string;
  icon?: string;
  emoji?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  relatedRoute?: string;
}

export default function ComingSoonScreen({
  route,
  navigation,
}: RootStackScreenProps<"ComingSoon">) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = (route.params || {}) as ComingSoonParams;

  const {
    title = "Em breve",
    description = "Estamos trabalhando nessa funcionalidade com muito carinho. Logo estará disponível para você!",
    icon = "construct-outline",
    emoji = "🚧",
    primaryCtaLabel = "Voltar",
    secondaryCtaLabel,
    relatedRoute,
  } = params;

  const iconName = getIconName(icon, "construct-outline");

  const handlePrimaryAction = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleSecondaryAction = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (relatedRoute === "Assistant") {
      navigation.navigate("MainTabs", { screen: "Assistant" });
    } else if (relatedRoute === "Community") {
      navigation.navigate("MainTabs", { screen: "Community" });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.secondary }}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={handlePrimaryAction}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.neutral[100] }}
        >
          <Ionicons name="close" size={24} color={colors.neutral[500]} />
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          entering={FadeIn.duration(600)}
          className="items-center"
        >
          {/* Icon */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500).springify()}
            className="mb-6"
          >
            <View
              className="w-28 h-28 rounded-full items-center justify-center"
              style={{
                backgroundColor: colors.primary[50],
                shadowColor: colors.primary[500],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
              }}
            >
              <Ionicons name={iconName} size={40} color={colors.primary[500]} />
              <Text style={{ fontSize: 28, marginTop: 6 }}>{emoji}</Text>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(200).duration(500).springify()}
            className="text-warmGray-900 text-2xl font-semibold text-center mb-3"
          >
            {title}
          </Animated.Text>

          {/* Description */}
          <Animated.Text
            entering={FadeInUp.delay(300).duration(500).springify()}
            className="text-warmGray-500 text-base text-center leading-6 mb-8"
          >
            {description}
          </Animated.Text>

          {/* Primary CTA */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500).springify()}
            className="w-full"
          >
            <Pressable
              onPress={handlePrimaryAction}
              className="w-full py-4 rounded-2xl items-center"
              style={{
                backgroundColor: colors.primary[500],
                shadowColor: colors.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              }}
            >
              <Text className="text-white text-base font-semibold">
                {primaryCtaLabel}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Secondary CTA */}
          {secondaryCtaLabel && (
            <Animated.View
              entering={FadeInUp.delay(500).duration(500).springify()}
              className="w-full mt-3"
            >
              <Pressable
                onPress={handleSecondaryAction}
                className="w-full py-4 rounded-2xl items-center"
                style={{
                  backgroundColor: colors.neutral[100],
                }}
              >
                <Text className="text-warmGray-700 text-base font-semibold">
                  {secondaryCtaLabel}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInUp.delay(600).duration(500).springify()}
        className="items-center pb-8"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="flex-row items-center">
          <Ionicons name="sparkles" size={16} color={colors.primary[500]} />
          <Text className="text-sm ml-2" style={{ color: colors.neutral[400] }}>
            Nossa Maternidade
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
