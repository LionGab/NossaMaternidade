import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps } from "../types/navigation";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function ProfileScreen({ navigation }: MainTabScreenProps<"Profile">) {
  const insets = useSafeAreaInsets();
  const { colors, theme, setTheme } = useTheme();
  const user = useAppStore((s) => s.user);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  const MENU_ITEMS: MenuItem[] = [
    { id: "edit", label: "Editar perfil", icon: "person-outline", color: colors.neutral[500] },
    { id: "notifications", label: "Notificações", icon: "notifications-outline", color: colors.neutral[500] },
    { id: "privacy", label: "Privacidade", icon: "shield-outline", color: colors.neutral[500] },
    { id: "help", label: "Ajuda e suporte", icon: "help-circle-outline", color: colors.neutral[500] },
    { id: "about", label: "Sobre o app", icon: "information-circle-outline", color: colors.neutral[500] },
  ];

  const getStageLabel = () => {
    switch (user?.stage) {
      case "trying":
        return "Tentando engravidar";
      case "pregnant":
        return "Gravida";
      case "postpartum":
        return "Pos-parto";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    setOnboardingComplete(false);
  };

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Configurações",
      description: "Em breve você poderá personalizar todas as configurações do app.",
      emoji: "⚙️",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleMenuItemPress = async (itemId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const menuConfig: Record<string, { title: string; description: string; emoji: string }> = {
      edit: {
        title: "Editar Perfil",
        description: "Em breve você poderá editar suas informações pessoais e foto de perfil.",
        emoji: "👤",
      },
      notifications: {
        title: "Notificações",
        description: "Em breve você poderá personalizar suas notificações e lembretes.",
        emoji: "🔔",
      },
      privacy: {
        title: "Privacidade",
        description: "Em breve você poderá gerenciar suas configurações de privacidade.",
        emoji: "🔒",
      },
      help: {
        title: "Ajuda e Suporte",
        description: "Em breve teremos uma central de ajuda completa para você.",
        emoji: "💬",
      },
      about: {
        title: "Sobre o App",
        description: "Nossa Maternidade é um app criado com carinho por Nathália Valente para acompanhar você em toda a jornada da maternidade.",
        emoji: "💜",
      },
    };

    const config = menuConfig[itemId];
    if (config) {
      navigation.navigate("ComingSoon", {
        ...config,
        primaryCtaLabel: "Voltar",
        secondaryCtaLabel: itemId === "help" ? "Falar com NathIA" : undefined,
        relatedRoute: itemId === "help" ? "Assistant" : undefined,
      });
    }
  };

  return (
    <View className="flex-1 bg-cream-50">
      <LinearGradient
        colors={[colors.primary[50], colors.secondary[50], colors.background.secondary]}
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={{ paddingTop: insets.top + 20 }}
          className="px-6 pb-8"
        >
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-warmGray-800 text-3xl font-serif">Perfil</Text>
            <Pressable
              onPress={handleSettingsPress}
              className="p-2"
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 12,
                shadowColor: colors.neutral[900],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8
              }}
            >
              <Ionicons name="settings-outline" size={24} color={colors.neutral[500]} />
            </Pressable>
          </View>

          {/* Profile Card */}
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 32,
              padding: 28,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.06,
              shadowRadius: 24
            }}
          >
            <View className="items-center">
              <View
                className="w-28 h-28 rounded-full items-center justify-center mb-5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <Ionicons name="person" size={52} color={colors.neutral[400]} />
              </View>
              <Text className="text-warmGray-800 text-2xl font-serif mb-3">{user?.name || "Usuaria"}</Text>
              <View className="flex-row items-center">
                <View
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: colors.primary[50] }}
                >
                  <Text className="text-rose-600 text-base font-semibold">{getStageLabel()}</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row mt-8 pt-8 border-t border-warmGray-100">
              <View className="flex-1 items-center">
                <Text className="text-warmGray-800 text-2xl font-bold mb-1">0</Text>
                <Text className="text-warmGray-500 text-sm">Posts</Text>
              </View>
              <View className="w-px bg-warmGray-100" />
              <View className="flex-1 items-center">
                <Text className="text-warmGray-800 text-2xl font-bold mb-1">0</Text>
                <Text className="text-warmGray-500 text-sm">Grupos</Text>
              </View>
              <View className="w-px bg-warmGray-100" />
              <View className="flex-1 items-center">
                <Text className="text-warmGray-800 text-2xl font-bold mb-1">
                  {user?.interests?.length || 0}
                </Text>
                <Text className="text-warmGray-500 text-sm">Interesses</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            className="px-6 mb-8"
          >
            <Text className="text-warmGray-800 text-xl font-semibold mb-4">Seus interesses</Text>
            <View className="flex-row flex-wrap">
              {user.interests.map((interest, index) => (
                <Animated.View
                  key={interest}
                  entering={FadeInUp.delay(300 + index * 50).duration(600).springify()}
                >
                  <View
                    className="px-5 py-2.5 mr-2 mb-2"
                    style={{
                      backgroundColor: colors.background.card,
                      borderRadius: 20,
                      shadowColor: colors.neutral[900],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 8
                    }}
                  >
                    <Text className="text-warmGray-700 text-base capitalize">
                      {interest.replace("_", " ")}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Theme Selection */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          className="px-6 mb-8"
        >
          <Text className="text-warmGray-800 text-xl font-semibold mb-4">Aparência</Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 24,
              padding: 20,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12
            }}
          >
            <View className="flex-row justify-between">
              {/* Light Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("light");
                }}
                className="flex-1 items-center"
                style={{
                  backgroundColor: theme === "light" ? colors.primary[50] : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginRight: 8,
                  borderWidth: 2,
                  borderColor: theme === "light" ? colors.primary[500] : "transparent"
                }}
              >
                <Ionicons
                  name="sunny"
                  size={28}
                  color={theme === "light" ? colors.primary[500] : colors.neutral[400]}
                />
                <Text
                  className="text-sm font-semibold mt-2"
                  style={{ color: theme === "light" ? colors.primary[500] : colors.neutral[600] }}
                >
                  Claro
                </Text>
              </Pressable>

              {/* Dark Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("dark");
                }}
                className="flex-1 items-center"
                style={{
                  backgroundColor: theme === "dark" ? colors.primary[50] : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginHorizontal: 8,
                  borderWidth: 2,
                  borderColor: theme === "dark" ? colors.primary[500] : "transparent"
                }}
              >
                <Ionicons
                  name="moon"
                  size={28}
                  color={theme === "dark" ? colors.primary[500] : colors.neutral[400]}
                />
                <Text
                  className="text-sm font-semibold mt-2"
                  style={{ color: theme === "dark" ? colors.primary[500] : colors.neutral[600] }}
                >
                  Escuro
                </Text>
              </Pressable>

              {/* System Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("system");
                }}
                className="flex-1 items-center"
                style={{
                  backgroundColor: theme === "system" ? colors.primary[50] : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginLeft: 8,
                  borderWidth: 2,
                  borderColor: theme === "system" ? colors.primary[500] : "transparent"
                }}
              >
                <Ionicons
                  name="phone-portrait"
                  size={28}
                  color={theme === "system" ? colors.primary[500] : colors.neutral[400]}
                />
                <Text
                  className="text-sm font-semibold mt-2"
                  style={{ color: theme === "system" ? colors.primary[500] : colors.neutral[600] }}
                >
                  Sistema
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          className="px-6"
        >
          <Text className="text-warmGray-800 text-xl font-semibold mb-4">Configuracoes</Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleMenuItemPress(item.id)}
                className={`flex-row items-center px-5 py-5 ${
                  index < MENU_ITEMS.length - 1 ? "border-b border-warmGray-100" : ""
                }`}
              >
                <View
                  className="w-11 h-11 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: colors.background.tertiary }}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text className="flex-1 text-warmGray-700 text-base font-medium">{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          className="px-6 mt-6"
        >
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center"
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 20,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderWidth: 1.5,
              borderColor: colors.primary[200]
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.primary[500]} />
            <Text className="text-rose-500 text-base font-semibold ml-2">Sair da conta</Text>
          </Pressable>
        </Animated.View>

        {/* App Info */}
        <View className="items-center mt-10">
          <Text className="text-warmGray-400 text-base font-medium">Nossa Maternidade</Text>
          <Text className="text-warmGray-400 text-sm mt-1">Por Nathalia</Text>
          <Text className="text-warmGray-300 text-xs mt-2">Versao 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
