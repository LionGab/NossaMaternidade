import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps } from "../types/navigation";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";

const MENU_ITEMS = [
  { id: "edit", label: "Editar perfil", icon: "person-outline", color: "#78716C" },
  { id: "notifications", label: "Notificações", icon: "notifications-outline", color: "#78716C" },
  { id: "privacy", label: "Privacidade", icon: "shield-outline", color: "#78716C" },
  { id: "help", label: "Ajuda e suporte", icon: "help-circle-outline", color: "#78716C" },
  { id: "about", label: "Sobre o app", icon: "information-circle-outline", color: "#78716C" },
];

export default function ProfileScreen({ navigation }: MainTabScreenProps<"Profile">) {
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

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
        colors={["#FFF5F7", "#FFF9F3", "#FFFCF9"]}
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
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8
              }}
            >
              <Ionicons name="settings-outline" size={24} color="#78716C" />
            </Pressable>
          </View>

          {/* Profile Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 32,
              padding: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.06,
              shadowRadius: 24
            }}
          >
            <View className="items-center">
              <View
                className="w-28 h-28 rounded-full items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(188, 139, 123, 0.15)" }}
              >
                <Ionicons name="person" size={52} color="#9E7269" />
              </View>
              <Text className="text-warmGray-800 text-2xl font-serif mb-3">{user?.name || "Usuaria"}</Text>
              <View className="flex-row items-center">
                <View
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: "rgba(225, 29, 72, 0.1)" }}
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
                      backgroundColor: "#FFFFFF",
                      borderRadius: 20,
                      shadowColor: "#000",
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

        {/* Menu Items */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          className="px-6"
        >
          <Text className="text-warmGray-800 text-xl font-semibold mb-4">Configuracoes</Text>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: "#000",
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
                  style={{ backgroundColor: "rgba(120, 113, 108, 0.08)" }}
                >
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text className="flex-1 text-warmGray-700 text-base font-medium">{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#D6D3D1" />
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
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderWidth: 1.5,
              borderColor: "rgba(225, 29, 72, 0.2)"
            }}
          >
            <Ionicons name="log-out-outline" size={22} color="#E11D48" />
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
