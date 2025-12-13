import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAppStore } from "../state/store";
import { MainTabScreenProps } from "../types/navigation";
import DailyCheckIn from "../components/DailyCheckIn";
import { Avatar } from "../components/ui";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";

const QUICK_ACTIONS: { id: string; label: string; icon: string; gradient: [string, string] }[] = [
  { id: "mycare", label: "Meus Cuidados", icon: "heart", gradient: ["#E11D48", "#F43F5E"] },
  { id: "assistant", label: "NathIA", icon: "chatbubble-ellipses", gradient: ["#6BAD78", "#8BC896"] },
  { id: "affirmations", label: "Afirmações", icon: "sparkles", gradient: ["#A78BFA", "#C4B5FD"] },
];

const DAILY_TIPS = [
  {
    id: "1",
    title: "Hidratação é fundamental",
    description: "Beba água regularmente. Seu corpo e seu bebê agradecem!",
    icon: "water",
    color: "#60A5FA",
  },
  {
    id: "2",
    title: "Momento de autocuidado",
    description: "Reserve 15 minutos só para você relaxar e respirar",
    icon: "leaf",
    color: "#6BAD78",
  },
  {
    id: "3",
    title: "Movimento suave",
    description: "Caminhe um pouco hoje. Movimento faz bem para o corpo e mente",
    icon: "walk",
    color: "#A78BFA",
  },
];

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % DAILY_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getStageEmoji = () => {
    switch (userStage) {
      case "trying": return "💕";
      case "pregnant": return "🤰";
      case "postpartum": return "👶";
      default: return "❤️";
    }
  };

  const getStageMessage = () => {
    switch (userStage) {
      case "trying":
        return "Sua jornada está começando com muito amor";
      case "pregnant":
        return "Seu bebê está crescendo com carinho";
      case "postpartum":
        return "Cada dia é uma nova descoberta";
      default:
        return "Bem-vinda à Nossa Maternidade";
    }
  };

  const tip = DAILY_TIPS[currentTip];

  const handleNotifications = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Notificações",
      description: "Em breve você poderá personalizar suas notificações e lembretes de cuidados.",
      emoji: "🔔",
      primaryCtaLabel: "Voltar",
      secondaryCtaLabel: "Falar com NathIA",
      relatedRoute: "Assistant",
    });
  };

  const handleTipPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Dicas Personalizadas",
      description: "Em breve teremos dicas personalizadas baseadas na sua jornada de maternidade.",
      emoji: "💡",
      primaryCtaLabel: "Voltar",
      secondaryCtaLabel: "Ver Afirmações",
      relatedRoute: "Assistant",
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#FFFCF9" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={["#FFF1F2", "#FFF5F7", "#FFFCF9"]}
            locations={[0, 0.5, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
          >
            <Animated.View
              entering={FadeInDown.duration(600).springify()}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-1">
                  <Text className="text-warmGray-400 text-sm font-medium">
                    {getGreeting()},
                  </Text>
                  <Text className="text-warmGray-900 text-4xl font-serif mt-1">
                    {userName || "Mamãe"}
                  </Text>
                </View>
                <Pressable
                  onPress={handleNotifications}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={[{ backgroundColor: "#FFF" }, shadowPresets.md]}
                  accessibilityRole="button"
                  accessibilityLabel="Notificações"
                  accessibilityHint="Abre as configurações de notificações"
                >
                  <Ionicons name="notifications-outline" size={24} color="#78716C" />
                </Pressable>
              </View>

              {/* Daily Check-in CTA */}
              <Animated.View
                entering={FadeInUp.delay(100).duration(500).springify()}
                className="mb-6"
              >
                <DailyCheckIn />
              </Animated.View>

              {/* Main Card */}
              <View
                className="rounded-3xl p-8"
                style={[
                  { backgroundColor: "#E11D48" },
                  shadowPresets.colored("#E11D48", 0.3),
                ]}
                accessibilityRole="header"
              >
                <View className="items-center">
                  <Text className="text-6xl mb-4">{getStageEmoji()}</Text>
                  <Text
                    className="text-white/70 text-xs font-medium mb-2 uppercase tracking-widest"
                    accessibilityRole="text"
                  >
                    Nossa Maternidade
                  </Text>
                  <Text
                    className="text-white text-2xl font-serif text-center mb-3"
                    accessibilityRole="header"
                  >
                    {getStageMessage()}
                  </Text>
                  <Text className="text-white/90 text-center leading-6">
                    &ldquo;Você é mais forte do que imagina e mais amada do que pode ver&rdquo;
                  </Text>
                  <Text className="text-white/60 text-sm mt-3 italic">
                    - Nathália Valente
                  </Text>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600).springify()}
          className="px-6 mb-8"
        >
          <Text
            className="text-warmGray-900 text-xl font-serif mb-5"
            accessibilityRole="header"
          >
            Acesso rápido
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInUp.delay(300 + index * 50).duration(600).springify()}
                className="w-[48%] mx-[1%] mb-4"
              >
                <Pressable
                  onPress={() => {
                    if (action.id === "mycare") navigation.navigate("MyCare");
                    if (action.id === "assistant") navigation.navigate("Assistant");
                    if (action.id === "affirmations") navigation.navigate("Affirmations");
                  }}
                  className="rounded-2xl overflow-hidden"
                  style={shadowPresets.lg}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  accessibilityHint={`Abre a tela de ${action.label}`}
                >
                  <LinearGradient
                    colors={action.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 20, minHeight: 120, justifyContent: "space-between" }}
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <Ionicons name={action.icon as any} size={24} color="#FFFFFF" />
                    </View>
                    <Text className="text-white text-base font-semibold">
                      {action.label}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Daily Tip Carousel */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          className="px-6 mb-8"
        >
          <Text
            className="text-warmGray-900 text-xl font-serif mb-5"
            accessibilityRole="header"
          >
            Dica do dia
          </Text>
          <Pressable
            onPress={handleTipPress}
            className="rounded-3xl p-6"
            style={[{ backgroundColor: "#FFF" }, shadowPresets.lg]}
            accessibilityRole="button"
            accessibilityLabel={`Dica do dia: ${tip.title}`}
            accessibilityHint="Abre mais informações sobre dicas personalizadas"
          >
            <View className="flex-row items-start">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${tip.color}15` }}
              >
                <Ionicons name={tip.icon as any} size={28} color={tip.color} />
              </View>
              <View className="flex-1">
                <Text className="text-warmGray-900 text-lg font-semibold mb-2">
                  {tip.title}
                </Text>
                <Text className="text-warmGray-600 text-sm leading-6">
                  {tip.description}
                </Text>
              </View>
            </View>

            {/* Carousel indicators */}
            <View className="flex-row justify-center mt-5 space-x-2">
              {DAILY_TIPS.map((_, index) => (
                <View
                  key={index}
                  className="h-1.5 rounded-full"
                  style={{
                    width: currentTip === index ? 24 : 8,
                    backgroundColor: currentTip === index ? "#E11D48" : "#E7E5E4",
                  }}
                />
              ))}
            </View>
          </Pressable>
        </Animated.View>

        {/* Community Preview */}
        <Animated.View
          entering={FadeInUp.delay(700).duration(600).springify()}
          className="px-6 mb-8"
        >
          <View className="flex-row items-center justify-between mb-5">
            <Text
              className="text-warmGray-900 text-xl font-serif"
              accessibilityRole="header"
            >
              Mães Valente
            </Text>
            <Pressable
              onPress={() => navigation.navigate("Community")}
              accessibilityRole="button"
              accessibilityLabel="Ver todas as publicações da comunidade"
              accessibilityHint="Navega para a tela completa da comunidade"
            >
              <View className="flex-row items-center">
                <Text className="text-rose-600 text-sm font-semibold mr-1">
                  Ver tudo
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#E11D48" />
              </View>
            </Pressable>
          </View>

          <View
            className="rounded-3xl p-5"
            style={[{ backgroundColor: "#FFF" }, shadowPresets.lg]}
          >
            <Pressable
              onPress={() => navigation.navigate("PostDetail", { postId: "1" })}
              accessibilityRole="button"
              accessibilityLabel="Post de Ana Paula sobre fome no segundo trimestre"
              accessibilityHint="Abre os detalhes e comentários do post"
            >
              <View className="flex-row items-center mb-4">
                <Avatar
                  size={44}
                  isNathalia={false}
                  fallbackIcon="person"
                  fallbackColor="#9E7269"
                  fallbackBgColor="rgba(188, 139, 123, 0.15)"
                  style={{ marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-warmGray-900 text-base font-semibold">
                    Ana Paula
                  </Text>
                  <Text className="text-warmGray-400 text-xs">há 2 horas</Text>
                </View>
                <View className="bg-blush-50 px-3 py-1 rounded-full">
                  <Text className="text-blush-600 text-xs font-medium">
                    Gravidez
                  </Text>
                </View>
              </View>
              <Text className="text-warmGray-700 leading-6 mb-4">
                Meninas, alguém mais sentindo muita fome no segundo trimestre?
                Estou comendo a cada 2 horas! 😅
              </Text>
              <View className="flex-row items-center pt-4 border-t border-warmGray-100">
                <View className="flex-row items-center mr-6">
                  <Ionicons name="heart" size={20} color="#E11D48" />
                  <Text className="text-warmGray-600 text-sm ml-1.5 font-medium">
                    24
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="chatbubble" size={18} color="#A8A29E" />
                  <Text className="text-warmGray-600 text-sm ml-1.5 font-medium">
                    12 respostas
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* Inspirational Quote */}
        <Animated.View
          entering={FadeInUp.delay(900).duration(600).springify()}
          className="px-6"
        >
          <View
            className="rounded-3xl p-6 items-center"
            style={{
              backgroundColor: "#FFF9F3",
              borderWidth: 1,
              borderColor: "#F5E1DB",
            }}
          >
            <Ionicons name="sparkles" size={32} color="#E8B88C" />
            <Text className="text-warmGray-700 text-center text-base leading-7 mt-4 italic">
              Maternidade: onde o amor se torna visível e a força se transforma em ternura
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
