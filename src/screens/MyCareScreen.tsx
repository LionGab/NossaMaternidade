import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Dimensions, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps } from "../types/navigation";
import { useAppStore } from "../state/store";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";

import { COLORS as DESIGN_COLORS, SPACING, RADIUS, SHADOWS } from "../theme/design-system";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Usar cores do design system
const COLORS = {
  cardBg: DESIGN_COLORS.background.secondary,
  text: DESIGN_COLORS.neutral[800],
  textMuted: DESIGN_COLORS.neutral[600],
  textLight: DESIGN_COLORS.neutral[400],
  background: DESIGN_COLORS.background.primary,
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
    subtitle: "Um momento só seu",
    icon: "leaf-outline",
    color: DESIGN_COLORS.semantic.success,
    bgColor: `${DESIGN_COLORS.semantic.success}15`,
    description: "Exercícios de respiração para acalmar",
  },
  {
    id: "feelings",
    title: "Como você está?",
    subtitle: "Registro emocional",
    icon: "heart-outline",
    color: DESIGN_COLORS.primary[500],
    bgColor: DESIGN_COLORS.primary[50],
    description: "Espaço seguro para seus sentimentos",
  },
  {
    id: "rest",
    title: "Descanso",
    subtitle: "Sons e meditações",
    icon: "moon-outline",
    color: DESIGN_COLORS.secondary[500],
    bgColor: DESIGN_COLORS.secondary[50],
    description: "Ajuda para relaxar e dormir melhor",
  },
  {
    id: "connect",
    title: "Conexão",
    subtitle: "Comunidade de mães",
    icon: "people-outline",
    color: DESIGN_COLORS.semantic.info,
    bgColor: `${DESIGN_COLORS.semantic.info}15`,
    description: "Você não está sozinha nessa jornada",
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
      navigation.navigate("BreathingExercise");
    } else if (id === "rest") {
      navigation.navigate("RestSounds");
    }
  };

  const handleQuickSupport = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Direct navigation for implemented features
    if (id === "self") {
      navigation.navigate("HabitsEnhanced");
      return;
    }

    if (id === "anxiety") {
      navigation.navigate("BreathingExercise");
      return;
    }

    if (id === "sleep") {
      navigation.navigate("RestSounds");
      return;
    }

    // Coming soon for features not yet implemented
    const supportConfig: Record<string, { title: string; description: string; emoji: string }> = {
      feeding: {
        title: "Amamentação",
        description: "Em breve teremos guias completos e apoio para amamentação.",
        emoji: "🤱",
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
              {/* Hero Image */}
              <View className="mb-6" style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/mycare-image.jpg")}
                  style={{
                    width: SCREEN_WIDTH - 48,
                    height: (SCREEN_WIDTH - 48) * 0.6,
                    borderRadius: 24,
                    resizeMode: "cover",
                  }}
                  accessibilityRole="image"
                  accessibilityLabel="Imagem de cuidados pessoais e bem-estar"
                />
              </View>
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
            style={[
              { backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 24 },
              shadowPresets.lg,
            ]}
            accessibilityRole="summary"
          >
            <View className="flex-row items-start mb-4">
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: DESIGN_COLORS.accent.peach,
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
                  backgroundColor: DESIGN_COLORS.secondary[50],
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
              backgroundColor: `${DESIGN_COLORS.semantic.info}15`,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: DESIGN_COLORS.neutral[200],
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
            accessibilityRole="header"
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
                  accessibilityRole="button"
                  accessibilityLabel={`${section.title}: ${section.subtitle}`}
                  accessibilityHint={section.description}
                >
                  <View
                    style={[
                      {
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        backgroundColor: COLORS.cardBg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 14,
                      },
                      shadowPresets.sm,
                    ]}
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
            accessibilityRole="header"
          >
            Apoio rapido
          </Text>

          <View
            style={[
              { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: 6 },
              shadowPresets.md,
            ]}
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
                accessibilityRole="button"
                accessibilityLabel={`${item.title}: ${item.subtitle}`}
                accessibilityHint="Abre informações sobre este tópico de apoio"
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
              backgroundColor: DESIGN_COLORS.primary[50],
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: DESIGN_COLORS.primary[100],
            }}
            accessibilityRole="button"
            accessibilityLabel="Precisa conversar? Estamos aqui para ouvir você"
            accessibilityHint="Abre o chat com a NathIA para conversar"
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
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={DESIGN_COLORS.primary[500]} />
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
              backgroundColor: DESIGN_COLORS.secondary[50],
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: DESIGN_COLORS.secondary[100],
            }}
            accessibilityRole="button"
            accessibilityLabel="Comunidade Mães Valente"
            accessibilityHint="Navega para a comunidade de mães"
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
                      borderColor: DESIGN_COLORS.secondary[50],
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
                backgroundColor: DESIGN_COLORS.accent.peach,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              accessibilityRole="button"
              accessibilityLabel="Afirmações"
              accessibilityHint="Abre a tela de afirmações positivas"
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
              onPress={() => navigation.navigate("HabitsEnhanced")}
              style={{
                flex: 1,
                marginHorizontal: 6,
                backgroundColor: `${DESIGN_COLORS.semantic.success}80`,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              accessibilityRole="button"
              accessibilityLabel="Meus hábitos"
              accessibilityHint="Abre a tela de hábitos e rastreamento"
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
