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
import { Image } from "expo-image";

// Imgur Images
const IMGUR_IMAGES = {
  logo: "https://i.imgur.com/jzb0IgO.jpg",
  nathia: "https://i.imgur.com/oB9ewPG.jpg",
  habits: "https://i.imgur.com/LF2PX1w.jpg",
  content: "https://i.imgur.com/tNIrNIs.jpg",
  sleep: "https://i.imgur.com/w4rZvGG.jpg",
  community: "https://i.imgur.com/OLdeyD6.jpg",
  avatar: "https://i.imgur.com/GDYdiuy.jpg",
};

// Content cards for "Para Você" section with categories
const CONTENT_CARDS = [
  {
    id: "1",
    title: "Alimentos essenciais para o 2º trimestre",
    category: "NUTRIÇÃO",
    image: IMGUR_IMAGES.habits,
    color: "#f4258c",
  },
  {
    id: "2",
    title: "Yoga leve para as costas",
    category: "EXERCÍCIO",
    image: IMGUR_IMAGES.sleep,
    color: "#A78BFA",
  },
  {
    id: "3",
    title: "Comunidade de Mães",
    category: "COMUNIDADE",
    image: IMGUR_IMAGES.community,
    color: "#60A5FA",
  },
  {
    id: "4",
    title: "Meditação guiada",
    category: "BEM-ESTAR",
    image: IMGUR_IMAGES.content,
    color: "#6BAD78",
  },
];

// Community posts for "Mães Valente" section
const COMMUNITY_POSTS = [
  {
    id: "1",
    author: "Valentina",
    avatar: "https://i.imgur.com/oB9ewPG.jpg",
    time: "há 1 hora",
    category: "Dicas Rápidas",
    tag: "FIXADO",
    tagColor: "#6B7280",
    title: "5 coisas que não te contaram sobre o puerpério ✨",
    content: "Mães, preparei uma lista especial hoje. O puerpério é uma montanha-russa, mas saber disso antes ajuda muito!",
    likes: "1.2k",
    comments: "342",
  },
  {
    id: "2",
    author: "Ana Nogueira",
    avatar: null,
    time: "há 45 min",
    category: "Puerpério",
    tag: "DESABAFO",
    tagColor: "#f4258c",
    title: "A amamentação não está sendo fácil",
    content: "Pensei que seria natural, mas estou sofrendo com fissuras e muita sensibilidade...",
    likes: "156",
    comments: "48",
  },
  {
    id: "3",
    author: "Carla Dias",
    avatar: null,
    time: "há 5 horas",
    category: "Tentante",
    tag: "VITÓRIA",
    tagColor: "#10B981",
    title: "O positivo finalmente veio! 🌈",
    content: "Depois de 2 anos de tentativas, hoje recebi o meu milagre. Não desistam mamães!",
    likes: "892",
    comments: "340",
  },
];

const QUICK_ACTIONS = [
  { id: "mycare", label: "Meus Cuidados", icon: "heart", gradient: ["#f4258c", "#F43F5E"] },
  { id: "assistant", label: "NathIA", icon: "chatbubble-ellipses", gradient: ["#6BAD78", "#8BC896"] },
  { id: "affirmations", label: "Afirmações", icon: "sparkles", gradient: ["#A78BFA", "#C4B5FD"] },
] as const;

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

// NathIA Quick Chips - Perguntas frequentes por categoria
const NATHIA_QUICK_CHIPS = [
  { id: "sleep", label: "Bebê não dorme", emoji: "😴", color: "#6366F1" },
  { id: "food", label: "Alimentação", emoji: "🍎", color: "#10B981" },
  { id: "tired", label: "Estou exausta", emoji: "😓", color: "#F59E0B" },
  { id: "colic", label: "Cólica do bebê", emoji: "👶", color: "#EC4899" },
  { id: "breast", label: "Amamentação", emoji: "🤱", color: "#8B5CF6" },
  { id: "anxiety", label: "Ansiedade", emoji: "💭", color: "#14B8A6" },
];

// Dicas contextuais baseadas no horário (memoizada no componente)
const getContextualTip = (hour: number) => {
  if (hour >= 5 && hour < 9) return { text: "Bom dia! Como foi sua noite de sono?", emoji: "🌅" };
  if (hour >= 9 && hour < 12) return { text: "Já tomou seu café da manhã nutritivo?", emoji: "☀️" };
  if (hour >= 12 && hour < 14) return { text: "Hora do almoço! Descanse um pouco também.", emoji: "🥗" };
  if (hour >= 14 && hour < 18) return { text: "Lembrete: Beba água e faça uma pausa.", emoji: "💧" };
  if (hour >= 18 && hour < 21) return { text: "Preparando para a noite? Posso ajudar!", emoji: "🌙" };
  return { text: "Noite tranquila! Estou aqui se precisar.", emoji: "✨" };
};

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.user?.name);

  const [currentTip, setCurrentTip] = useState(0);

  // Carousel automático de dicas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % DAILY_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Memoizar valores calculados
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const contextualTip = React.useMemo(() => {
    const hour = new Date().getHours();
    return getContextualTip(hour);
  }, []);

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
    <View className="flex-1" style={{ backgroundColor: "#f8f5f7" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={["#FFF0F6", "#FFF5F7", "#f8f5f7"]}
            locations={[0, 0.5, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
          >
            <Animated.View
              entering={FadeInDown.duration(600).springify()}
            >
              {/* Header - Boa Noite Mae Style */}
              <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-warmGray-900 text-3xl font-serif">
                  {greeting}, Mãe
                </Text>
                  <Text className="text-warmGray-500 text-sm mt-1">
                    {userName ? `${userName}, ` : ""}24ª Semana
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={handleNotifications}
                    className="mr-3"
                    accessibilityRole="button"
                    accessibilityLabel="Notificações"
                  >
                    <Ionicons name="notifications-outline" size={24} color="#78716C" />
                  </Pressable>
                  <Image
                    source={{ uri: IMGUR_IMAGES.avatar }}
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 24,
                      borderWidth: 3,
                      borderColor: "#FFFFFF"
                    }}
                    contentFit="cover"
                  />
                </View>
              </View>

              {/* Daily Check-in CTA */}
              <Animated.View
                entering={FadeInUp.delay(100).duration(500).springify()}
                className="mb-6"
              >
                <DailyCheckIn />
              </Animated.View>

              {/* Bem-estar Card - Gradient Pink to Blue */}
              <Pressable
                onPress={() => navigation.navigate("Community")}
                accessibilityRole="button"
                accessibilityLabel="Acessar comunidade"
              >
                <LinearGradient
                  colors={["#EC4899", "#A855F7", "#60A5FA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    { borderRadius: 28, padding: 28, minHeight: 200 },
                    shadowPresets.lg,
                  ]}
                >
                  {/* Tag DESTAQUE - Estilo Boa Noite Mãe */}
                  <View className="bg-white/30 self-start px-4 py-2 rounded-full mb-4 flex-row items-center">
                    <Ionicons name="heart" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">Destaque</Text>
                  </View>

                  {/* Content */}
                  <Text className="text-white/90 text-base mb-2">
                    Conecte-se com outras mães
                  </Text>
                  <Text className="text-white text-4xl font-serif mb-4" style={{ letterSpacing: -0.5 }}>
                    Comunidade de{"\n"}Mães
                  </Text>
                  <Text className="text-white/90 text-sm">
                    na mesma jornada que você.
                  </Text>

                  {/* Decorative Icon */}
                  <View className="absolute right-6 bottom-6 opacity-30">
                    <Ionicons name="hand-left" size={64} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </Pressable>

              {/* NathIA Section - Ultraeficaz */}
              <Animated.View
                entering={FadeInUp.delay(200).duration(500).springify()}
                className="mt-4"
              >
                <View
                  className="rounded-3xl overflow-hidden"
                  style={[{ backgroundColor: "#FFFFFF" }, shadowPresets.lg]}
                >
                  {/* Header com Avatar e Status */}
                  <LinearGradient
                    colors={["#FDF2F8", "#FCE7F3", "#FBCFE8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16, paddingBottom: 12 }}
                  >
                    <View className="flex-row items-center">
                      <View className="relative">
                        <Image
                          source={{ uri: IMGUR_IMAGES.nathia }}
                          style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: "#FFFFFF" }}
                          contentFit="cover"
                        />
                        {/* Status Online */}
                        <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <View className="flex-row items-center">
                          <Text className="text-warmGray-900 text-lg font-bold">NathIA</Text>
                          <View className="ml-2 px-2 py-0.5 rounded-full bg-green-100">
                            <Text className="text-green-700 text-xs font-semibold">Online</Text>
                          </View>
                        </View>
                        <Text className="text-warmGray-600 text-sm mt-0.5">
                          {contextualTip.emoji} {contextualTip.text}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>

                  {/* Quick Chips */}
                  <View className="px-4 py-3">
                    <Text className="text-warmGray-500 text-xs font-medium mb-3 uppercase tracking-wide">
                      Perguntas frequentes
                    </Text>
                    <View className="flex-row flex-wrap -mx-1">
                      {NATHIA_QUICK_CHIPS.map((chip) => (
                        <Pressable
                          key={chip.id}
                          onPress={async () => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate("Assistant");
                          }}
                          className="mx-1 mb-2 px-3 py-2 rounded-full flex-row items-center"
                          style={{ backgroundColor: `${chip.color}15` }}
                          accessibilityRole="button"
                          accessibilityLabel={`Perguntar sobre ${chip.label}`}
                        >
                          <Text className="text-base mr-1.5">{chip.emoji}</Text>
                          <Text className="text-sm font-medium" style={{ color: chip.color }}>
                            {chip.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Input Section */}
                  <View className="px-4 pb-4">
                    <Pressable
                      onPress={() => navigation.navigate("Assistant")}
                      className="flex-row items-center rounded-2xl px-4 py-3"
                      style={{ backgroundColor: "#F5F5F4" }}
                      accessibilityRole="button"
                      accessibilityLabel="Enviar mensagem para NathIA"
                    >
                      <Text className="flex-1 text-warmGray-400 text-sm">
                        Pergunte qualquer coisa...
                      </Text>
                      <View className="flex-row items-center">
                        <Pressable
                          onPress={async () => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            navigation.navigate("Assistant");
                          }}
                          className="w-9 h-9 rounded-full items-center justify-center mr-2"
                          style={{ backgroundColor: "#E7E5E4" }}
                          accessibilityRole="button"
                          accessibilityLabel="Falar com NathIA por voz"
                        >
                          <Ionicons name="mic" size={18} color="#78716C" />
                        </Pressable>
                        <View
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{ backgroundColor: "#f4258c" }}
                        >
                          <Ionicons name="send" size={16} color="#FFFFFF" />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
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
                    backgroundColor: currentTip === index ? "#f4258c" : "#E7E5E4",
                  }}
                />
              ))}
            </View>
          </Pressable>
        </Animated.View>

        {/* Para Você - Content Carousel */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          className="mb-8"
        >
          <View className="flex-row items-center justify-between px-6 mb-5">
            <Text
              className="text-warmGray-900 text-xl font-serif"
              accessibilityRole="header"
            >
              Para Você
            </Text>
            <Pressable
              onPress={() => navigation.navigate("MyCare")}
              accessibilityRole="button"
              accessibilityLabel="Ver todo conteúdo"
            >
              <View className="flex-row items-center">
                <Text className="text-rose-600 text-sm font-semibold mr-1">
                  Ver tudo
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#f4258c" />
              </View>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {CONTENT_CARDS.map((card) => (
              <Pressable
                key={card.id}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate("ComingSoon", {
                    title: card.title,
                    description: "Conteúdo exclusivo em breve!",
                    emoji: "✨",
                    primaryCtaLabel: "Voltar",
                    secondaryCtaLabel: "Falar com NathIA",
                    relatedRoute: "Assistant",
                  });
                }}
                className="mr-4 rounded-2xl overflow-hidden"
                style={[{ width: 160 }, shadowPresets.lg]}
                accessibilityRole="button"
                accessibilityLabel={card.title}
              >
                <Image
                  source={{ uri: card.image }}
                  style={{ width: 160, height: 120 }}
                  contentFit="cover"
                  transition={300}
                />
                <View className="p-3 bg-white">
                  <Text
                    className="text-xs font-semibold mb-1"
                    style={{ color: card.color }}
                  >
                    {card.category}
                  </Text>
                  <Text className="text-warmGray-900 text-sm font-medium" numberOfLines={2}>
                    {card.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Community Preview - Mães Valente */}
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
            >
              <View className="flex-row items-center">
                <Text className="text-rose-600 text-sm font-semibold mr-1">
                  Ver tudo
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#f4258c" />
              </View>
            </Pressable>
          </View>

          {/* Posts Feed */}
          {COMMUNITY_POSTS.slice(0, 2).map((post) => (
            <Pressable
              key={post.id}
              onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
              className="rounded-2xl p-4 mb-3"
              style={[{ backgroundColor: "#FFF" }, shadowPresets.md]}
              accessibilityRole="button"
              accessibilityLabel={`Post de ${post.author}: ${post.title}`}
            >
              <View className="flex-row items-center mb-3">
                {post.avatar ? (
                  <Image
                    source={{ uri: post.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                    contentFit="cover"
                  />
                ) : (
                  <Avatar
                    size={40}
                    isNathalia={false}
                    fallbackIcon="person"
                    fallbackColor="#9E7269"
                    fallbackBgColor="rgba(188, 139, 123, 0.15)"
                    style={{ marginRight: 12 }}
                  />
                )}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-warmGray-900 text-sm font-semibold">
                      {post.author}
                    </Text>
                    {post.tag === "FIXADO" && (
                      <Ionicons name="pin" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text className="text-warmGray-400 text-xs">
                    {post.time} • {post.category}
                  </Text>
                </View>
                <View
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${post.tagColor}15` }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: post.tagColor }}
                  >
                    {post.tag}
                  </Text>
                </View>
              </View>
              <Text className="text-warmGray-900 text-base font-semibold mb-1">
                {post.title}
              </Text>
              <Text className="text-warmGray-600 text-sm leading-5 mb-3" numberOfLines={2}>
                {post.content}
              </Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="heart" size={16} color="#f4258c" />
                  <Text className="text-warmGray-500 text-xs ml-1">{post.likes}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="chatbubble-outline" size={14} color="#A8A29E" />
                  <Text className="text-warmGray-500 text-xs ml-1">{post.comments}</Text>
                </View>
                <View className="flex-1" />
                <Pressable
                  className="flex-row items-center px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "#F5F5F4" }}
                >
                  <Ionicons name="arrow-undo-outline" size={14} color="#78716C" />
                  <Text className="text-warmGray-600 text-xs ml-1 font-medium">Responder</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}

          {/* CTA - Compartilhe sua jornada */}
          <Pressable
            onPress={() => navigation.navigate("NewPost")}
            className="rounded-2xl p-4 flex-row items-center justify-center"
            style={{ backgroundColor: "#f4258c" }}
            accessibilityRole="button"
            accessibilityLabel="Compartilhe sua jornada"
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text className="text-white text-sm font-semibold ml-2">
              Compartilhe sua jornada
            </Text>
          </Pressable>
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
