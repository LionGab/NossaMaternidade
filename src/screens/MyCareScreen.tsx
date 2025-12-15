import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps } from "../types/navigation";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Paleta suave e acolhedora
const COLORS = {
  background: "#FBF9F7",
  cardBg: "#FFFFFF",
  lilac: "#D4C4E8",
  lilacSoft: "#EDE7F6",
  rose: "#F5D0D0",
  roseSoft: "#FDF0F0",
  blueCalm: "#C5DAE8",
  blueSoft: "#E8F2F8",
  sage: "#D4E5D7",
  sageSoft: "#EDF5EE",
  peach: "#F5E0D4",
  peachSoft: "#FDF6F2",
  text: "#4A4A4A",
  textMuted: "#7A7A7A",
  textLight: "#9A9A9A",
};

const DAILY_AFFIRMATIONS = [
  "Voce esta fazendo o melhor que pode, e isso e suficiente",
  "Nao existe mae perfeita, existe mae presente",
  "Cuidar de voce tambem e cuidar do seu bebe",
  "Seus sentimentos sao validos, todos eles",
  "Uma mae descansada e uma mae mais presente",
  "Pedir ajuda e um ato de coragem, nao de fraqueza",
  "Cada dia e uma nova chance de se conectar",
];

const CARE_SECTIONS = [
  {
    id: "breathe",
    title: "Respira comigo",
    subtitle: "Um momento so seu",
    icon: "leaf-outline",
    color: COLORS.sage,
    bgColor: COLORS.sageSoft,
    description: "Exercicios de respiracao para acalmar",
  },
  {
    id: "feelings",
    title: "Como voce esta?",
    subtitle: "Registro emocional",
    icon: "heart-outline",
    color: COLORS.rose,
    bgColor: COLORS.roseSoft,
    description: "Espaco seguro para seus sentimentos",
  },
  {
    id: "rest",
    title: "Descanso",
    subtitle: "Sons e meditacoes",
    icon: "moon-outline",
    color: COLORS.lilac,
    bgColor: COLORS.lilacSoft,
    description: "Ajuda para relaxar e dormir melhor",
  },
  {
    id: "connect",
    title: "Conexao",
    subtitle: "Comunidade de maes",
    icon: "people-outline",
    color: COLORS.blueCalm,
    bgColor: COLORS.blueSoft,
    description: "Voce nao esta sozinha nessa jornada",
  },
];

const QUICK_SUPPORT = [
  {
    id: "anxiety",
    emoji: "🫂",
    title: "Ansiedade",
    subtitle: "Tecnicas de alivio",
  },
  {
    id: "sleep",
    emoji: "😴",
    title: "Sono do bebe",
    subtitle: "Dicas praticas",
  },
  {
    id: "feeding",
    emoji: "🤱",
    title: "Amamentacao",
    subtitle: "Apoio e guias",
  },
  {
    id: "self",
    emoji: "💆‍♀️",
    title: "Autocuidado",
    subtitle: "Momentos para si",
  },
];

export default function MyCareScreen({ navigation }: MainTabScreenProps<"MyCare">) {
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.user?.name);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const todayAffirmation = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
  }, []);

  const handleCardPress = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigation based on card type
    if (id === "connect") {
      navigation.navigate("Community");
    } else if (id === "feelings") {
      navigation.navigate("DailyLog", {});
    } else if (id === "breathe") {
      navigation.navigate("ComingSoon", {
        title: "Respira Comigo",
        description: "Em breve teremos exercícios guiados de respiração para te ajudar a relaxar.",
        emoji: "🧘",
        primaryCtaLabel: "Voltar",
        secondaryCtaLabel: "Falar com NathIA",
        relatedRoute: "Assistant",
      });
    } else if (id === "rest") {
      navigation.navigate("ComingSoon", {
        title: "Descanso",
        description: "Em breve teremos sons relaxantes e meditações guiadas para você.",
        emoji: "🌙",
        primaryCtaLabel: "Voltar",
        secondaryCtaLabel: "Ver Afirmações",
        relatedRoute: "Assistant",
      });
    }
  };

  const handleQuickSupport = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const supportConfig: Record<string, { title: string; description: string; emoji: string }> = {
      anxiety: {
        title: "Ansiedade",
        description: "Em breve teremos técnicas de alívio e exercícios para ajudar com a ansiedade.",
        emoji: "🫂",
      },
      sleep: {
        title: "Sono do Bebê",
        description: "Em breve teremos dicas práticas para ajudar seu bebê a dormir melhor.",
        emoji: "😴",
      },
      feeding: {
        title: "Amamentação",
        description: "Em breve teremos guias completos e apoio para amamentação.",
        emoji: "🤱",
      },
      self: {
        title: "Autocuidado",
        description: "Em breve teremos sugestões de momentos de autocuidado para você.",
        emoji: "💆‍♀️",
      },
    };

    const config = supportConfig[id];
    if (config) {
      navigation.navigate("ComingSoon", {
        ...config,
        primaryCtaLabel: "Voltar",
        secondaryCtaLabel: "Falar com NathIA",
        relatedRoute: "Assistant",
      });
    }
  };

  const handleTalkPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header - Suave e acolhedor */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={["#F5EEF8", "#FDF5F5", COLORS.background]}
            locations={[0, 0.5, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 }}
          >
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              {/* Greeting */}
              <View className="mb-6">
                <Text
                  style={{ color: COLORS.textLight, fontSize: 15, fontWeight: "500" }}
                >
                  {greeting}{userName ? `, ${userName}` : ""}
                </Text>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 28,
                    fontWeight: "600",
                    marginTop: 4,
                    letterSpacing: -0.5,
                  }}
                >
                  Como voce esta hoje?
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Affirmation Card - Principal */}
        <Animated.View
          entering={FadeIn.delay(150).duration(600)}
          className="px-5 mb-6"
        >
          <View
            style={{
              backgroundColor: COLORS.cardBg,
              borderRadius: 24,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 20,
              elevation: 2,
            }}
          >
            <View className="flex-row items-start mb-4">
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: COLORS.peachSoft,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Text style={{ fontSize: 22 }}>🌸</Text>
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 13,
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Lembrete do dia
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: COLORS.text,
                fontSize: 20,
                fontWeight: "500",
                lineHeight: 30,
                fontStyle: "italic",
              }}
            >
              &ldquo;{todayAffirmation}&rdquo;
            </Text>

            <View
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: "#F5F5F5",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: COLORS.lilacSoft,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 14 }}>💜</Text>
              </View>
              <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                Nathalia Valente
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Belonging Message */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600).springify()}
          className="px-5 mb-6"
        >
          <View
            style={{
              backgroundColor: COLORS.blueSoft,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "#D6E6F2",
            }}
          >
            <View className="flex-row items-center">
              <Text style={{ fontSize: 28, marginRight: 14 }}>🤱</Text>
              <View className="flex-1">
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 17,
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  Voce pertence aqui
                </Text>
                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  Este e seu espaco seguro. Sem julgamentos, apenas acolhimento.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Care Sections - 2x2 Grid */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(600).springify()}
          className="px-5 mb-6"
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 16,
            }}
          >
            Cuidados para voce
          </Text>

          <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
            {CARE_SECTIONS.map((section, index) => (
              <Animated.View
                key={section.id}
                entering={FadeInUp.delay(300 + index * 60).duration(500).springify()}
                style={{ width: "50%", padding: 6 }}
              >
                <Pressable
                  onPress={() => handleCardPress(section.id)}
                  style={{
                    backgroundColor: section.bgColor,
                    borderRadius: 20,
                    padding: 18,
                    minHeight: 140,
                  }}
                >
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: COLORS.cardBg,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 8,
                    }}
                  >
                    <Ionicons
                      name={section.icon as any}
                      size={24}
                      color={section.color}
                    />
                  </View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 2,
                    }}
                  >
                    {section.title}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textMuted,
                      fontSize: 13,
                    }}
                  >
                    {section.subtitle}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Support Section */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          className="px-5 mb-6"
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 16,
            }}
          >
            Apoio rapido
          </Text>

          <View
            style={{
              backgroundColor: COLORS.cardBg,
              borderRadius: 20,
              padding: 6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.03,
              shadowRadius: 12,
            }}
          >
            {QUICK_SUPPORT.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleQuickSupport(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < QUICK_SUPPORT.length - 1 ? 1 : 0,
                  borderBottomColor: "#F5F5F5",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: COLORS.background,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textMuted,
                      fontSize: 14,
                      marginTop: 2,
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Emergency Support - Calmo e discreto */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          className="px-5 mb-6"
        >
          <Pressable
            onPress={handleTalkPress}
            style={{
              backgroundColor: COLORS.roseSoft,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "#F5E0E0",
            }}
          >
            <View className="flex-row items-center">
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  backgroundColor: COLORS.cardBg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.rose} />
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Precisa conversar?
                </Text>
                <Text
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  Estamos aqui para ouvir voce
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Community Banner */}
        <Animated.View
          entering={FadeInUp.delay(550).duration(600).springify()}
          className="px-5 mb-6"
        >
          <Pressable
            onPress={() => navigation.navigate("Community")}
            style={{
              backgroundColor: COLORS.lilacSoft,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "#E0D4F0",
            }}
          >
            <View className="flex-row items-center mb-3">
              <Text style={{ fontSize: 24, marginRight: 10 }}>💜</Text>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 17,
                  fontWeight: "600",
                }}
              >
                Comunidade Maes Valente
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 15,
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
              Conecte-se com outras maes que entendem sua jornada. Trocar experiencias faz toda diferenca.
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row" style={{ marginRight: 12 }}>
                {["🧡", "💛", "💚"].map((emoji, i) => (
                  <View
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: COLORS.cardBg,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: i > 0 ? -8 : 0,
                      borderWidth: 2,
                      borderColor: COLORS.lilacSoft,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{emoji}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
                +50 mil maes conectadas
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Bottom Actions */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          className="px-5"
        >
          <View className="flex-row" style={{ marginHorizontal: -6 }}>
            <Pressable
              onPress={() => navigation.navigate("Affirmations")}
              style={{
                flex: 1,
                marginHorizontal: 6,
                backgroundColor: COLORS.peach,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="sparkles-outline" size={20} color={COLORS.text} />
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 15,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Afirmações
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Habits")}
              style={{
                flex: 1,
                marginHorizontal: 6,
                backgroundColor: COLORS.sage,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkbox-outline" size={20} color={COLORS.text} />
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 15,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Meus habitos
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Gentle Footer Message */}
        <Animated.View
          entering={FadeInUp.delay(650).duration(600).springify()}
          className="px-5 mt-8"
        >
          <View style={{ alignItems: "center", paddingVertical: 16 }}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>🌷</Text>
            <Text
              style={{
                color: COLORS.textLight,
                fontSize: 14,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Lembre-se: descansar tambem e cuidar.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
