import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps } from "../types/navigation";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { IconName } from "../types/icons";
import { SPACING, RADIUS } from "../theme/tokens";

// COLORS compatibility mapping (from design-system.ts)
const DS_COLORS = {
  primary: {
    50: "#F7FBFD",
    100: "#E8F3F9",
    200: "#DCE9F1",
    300: "#B4D7E8",
    400: "#96C7DE",
    500: "#7DB9D5",
    600: "#5BA3C7",
    700: "#4488AB",
    800: "#376E8C",
    900: "#2B576D",
  },
  secondary: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },
  accent: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  surface: {
    roseSoft: "#FDF0F0",
    peachSoft: "#FDF6F2",
    lilacBorder: "#E0D4F0",
    roseBorder: "#F5E0E0",
    blueBorder: "#D6E6F2",
  },
  feeling: {
    amada: "#FB7185",
  },
  legacyAccent: {
    peach: "#FED7AA",
  },
} as const;

// Overlay compatibility mapping
const OVERLAY = {
  white: {
    strong: "rgba(255, 255, 255, 0.2)",
    text: "rgba(255, 255, 255, 0.7)",
    textStrong: "rgba(255, 255, 255, 0.8)",
  },
} as const;

// Foto da Nathalia com o bebê Thales
const NATHALIA_AVATAR_URL = "https://i.imgur.com/37dbPJE.jpg";

// Logo Comunidade Mães Valente
const MAES_VALENTE_LOGO_URL = "https://i.imgur.com/U5ttbqK.jpg";

/**
 * Cores semânticas para tela de cuidados
 * Mapeadas para o design-system azul pastel
 */
const getCareColors = (isDark: boolean) => ({
  // Lilac/Roxo suave - descanso e meditação
  lilac: isDark ? DS_COLORS.secondary[400] : DS_COLORS.secondary[300],
  lilacSoft: isDark ? "rgba(92, 163, 219, 0.15)" : DS_COLORS.secondary[50],
  // Rose/Rosa suave - sentimentos e emoções
  rose: isDark ? DS_COLORS.feeling.amada : DS_COLORS.feeling.amada,
  roseSoft: isDark ? "rgba(254, 205, 211, 0.15)" : DS_COLORS.surface.roseSoft,
  // Blue/Azul calmo - conexão e comunidade
  blueCalm: isDark ? DS_COLORS.primary[400] : DS_COLORS.primary[300],
  blueSoft: isDark ? "rgba(125, 185, 213, 0.15)" : DS_COLORS.primary[50],
  // Sage/Verde suave - respiração e bem-estar
  sage: isDark ? DS_COLORS.accent[400] : DS_COLORS.accent[200],
  sageSoft: isDark ? "rgba(20, 184, 166, 0.15)" : DS_COLORS.accent[50],
  // Peach/Pêssego - afirmações e positividade
  peach: isDark ? DS_COLORS.legacyAccent.peach : DS_COLORS.legacyAccent.peach,
  peachSoft: isDark ? "rgba(254, 215, 170, 0.15)" : DS_COLORS.surface.peachSoft,
  // Bordas sutis
  borderLilac: isDark ? "rgba(92, 163, 219, 0.3)" : DS_COLORS.surface.lilacBorder,
  borderRose: isDark ? "rgba(254, 205, 211, 0.3)" : DS_COLORS.surface.roseBorder,
  borderBlue: isDark ? "rgba(125, 185, 213, 0.3)" : DS_COLORS.surface.blueBorder,
});

// Afirmações no estilo Nathalia - autênticas, jovens, sem julgamentos
const DAILY_AFFIRMATIONS = [
  "Você tá fazendo o melhor que pode, e isso já é demais 💕",
  "Não existe mãe perfeita, existe mãe real e presente",
  "Cuidar de você também é cuidar do seu bebê, tá?",
  "Seus sentimentos são válidos, todos eles, sempre",
  "Descansa, mãe! Você merece esse respiro",
  "Pedir ajuda é força, não fraqueza. Eu peço toda hora!",
  "Cada dia é uma chance nova de se conectar com seu filho",
  "Você não precisa dar conta de tudo. Ninguém precisa.",
  "Seu corpo fez um milagre. Respeita ele 🙏",
  "Não deixa ninguém te julgar. Você sabe o que é melhor pra você.",
];

type CareColors = ReturnType<typeof getCareColors>;

const getCareSections = (careColors: CareColors) => [
  {
    id: "breathe",
    title: "Respira comigo",
    subtitle: "Um momento so seu",
    icon: "leaf-outline",
    color: careColors.sage,
    bgColor: careColors.sageSoft,
    description: "Exercicios de respiracao para acalmar",
  },
  {
    id: "feelings",
    title: "Como voce esta?",
    subtitle: "Registro emocional",
    icon: "heart-outline",
    color: careColors.rose,
    bgColor: careColors.roseSoft,
    description: "Espaco seguro para seus sentimentos",
  },
  {
    id: "rest",
    title: "Descanso",
    subtitle: "Sons e meditacoes",
    icon: "moon-outline",
    color: careColors.lilac,
    bgColor: careColors.lilacSoft,
    description: "Ajuda para relaxar e dormir melhor",
  },
  {
    id: "connect",
    title: "Conexao",
    subtitle: "Comunidade de maes",
    icon: "people-outline",
    color: careColors.blueCalm,
    bgColor: careColors.blueSoft,
    description: "Voce nao esta sozinha nessa jornada",
  },
];

// Apoio rápido - Temas que Nathalia aborda (puerpério recente)
const QUICK_SUPPORT = [
  {
    id: "anxiety",
    emoji: "🫂",
    title: "Ansiedade materna",
    subtitle: "Técnicas que me ajudam",
  },
  {
    id: "sleep",
    emoji: "😴",
    title: "Sono (ou a falta dele)",
    subtitle: "Como eu sobrevivo",
  },
  {
    id: "feeding",
    emoji: "🤱",
    title: "Amamentação",
    subtitle: "Minha jornada e dicas",
  },
  {
    id: "body",
    emoji: "🩷",
    title: "Corpo pós-parto",
    subtitle: "Respeitar o tempo",
  },
];

export default function MyCareScreen({ navigation }: MainTabScreenProps<"MyCare">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const userName = useAppStore((s) => s.user?.name);

  // Cores semânticas para esta tela
  const careColors = useMemo(() => getCareColors(isDark), [isDark]);
  const careSections = useMemo(() => getCareSections(careColors), [careColors]);

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

    // Mapeamento de quick support para contexto emocional da NathIA
    const emotionalContextMap: Record<string, "ansiosa" | "cansada" | "bem" | "amada"> = {
      anxiety: "ansiosa",
      sleep: "cansada",
      feeding: "bem",
      body: "amada",
    };

    const emotionalContext = emotionalContextMap[id];
    if (emotionalContext) {
      navigation.navigate("Assistant", { emotionalContext });
    }
  };

  const handleTalkPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.secondary }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header - Suave e acolhedor */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={
              isDark
                ? [colors.background.primary, colors.background.secondary, colors.background.tertiary]
                : [colors.primary[50], colors.secondary[50], colors.background.secondary]
            }
            locations={[0, 0.5, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 }}
          >
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              {/* Greeting */}
              <View className="mb-6">
                <Text
                  style={{ color: colors.neutral[400], fontSize: 15, fontWeight: "500" }}
                >
                  {greeting}{userName ? `, ${userName}` : ""}
                </Text>
                <Text
                  style={{
                    color: colors.neutral[700],
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

        {/* Affirmation Card - Com foto da Nathalia */}
        <Animated.View
          entering={FadeIn.delay(150).duration(600)}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: RADIUS.xl,
              padding: SPACING.xl,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 20,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: SPACING.md }}>
              {/* Avatar da Nathalia com zoom */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  overflow: "hidden",
                  marginRight: SPACING.md,
                  borderWidth: 2,
                  borderColor: DS_COLORS.primary[200],
                }}
              >
                <Image
                  source={{ uri: NATHALIA_AVATAR_URL }}
                  style={{
                    width: 68,
                    height: 68,
                    marginTop: -10,
                    marginLeft: -10,
                  }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: isDark ? colors.neutral[100] : colors.neutral[800],
                      fontSize: 15,
                      fontWeight: "700",
                      fontFamily: "Manrope_700Bold",
                    }}
                  >
                    Nathalia Valente
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={DS_COLORS.primary[500]}
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <Text
                  style={{
                    color: colors.neutral[500],
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  Recado do dia pra você 💕
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: isDark ? colors.neutral[100] : colors.neutral[700],
                fontSize: 18,
                fontWeight: "500",
                fontFamily: "Manrope_500Medium",
                lineHeight: 28,
              }}
            >
              {`"${todayAffirmation}"`}
            </Text>

            {/* Ações */}
            <View
              style={{
                marginTop: SPACING.lg,
                paddingTop: SPACING.md,
                borderTopWidth: 1,
                borderTopColor: isDark ? colors.neutral[700] : colors.neutral[100],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("Affirmations")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: SPACING.xs,
                }}
              >
                <Ionicons name="heart-outline" size={18} color={DS_COLORS.accent[500]} />
                <Text style={{ color: DS_COLORS.accent[500], fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
                  Ver mais afirmações
                </Text>
              </Pressable>
              <Pressable
                onPress={handleTalkPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: DS_COLORS.primary[50],
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  borderRadius: RADIUS.full,
                }}
              >
                <Ionicons name="sparkles" size={14} color={DS_COLORS.primary[500]} />
                <Text style={{ color: DS_COLORS.primary[600], fontSize: 12, fontWeight: "600", marginLeft: 4 }}>
                  Falar com NathIA
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Belonging Message - Tom Nathalia */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <Pressable
            onPress={() => navigation.navigate("MundoDaNath")}
            style={{
              backgroundColor: isDark ? DS_COLORS.primary[900] : DS_COLORS.primary[50],
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: isDark ? DS_COLORS.primary[700] : DS_COLORS.primary[100],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 28, marginRight: SPACING.md }}>🤱</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: isDark ? colors.neutral[100] : colors.neutral[700],
                    fontSize: 16,
                    fontWeight: "700",
                    fontFamily: "Manrope_700Bold",
                    marginBottom: 4,
                  }}
                >
                  Ei, você não tá sozinha!
                </Text>
                <Text
                  style={{
                    color: colors.neutral[500],
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  Eu também passo por isso. Vem pro meu cantinho 💕
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={DS_COLORS.primary[400]} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Care Sections - 2x2 Grid - Calm FemTech */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <Text
            style={{
              color: isDark ? colors.neutral[100] : colors.neutral[700],
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Manrope_700Bold",
              marginBottom: SPACING.md,
            }}
          >
            Cuidados pra você
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 }}>
            {careSections.map((section, index) => (
              <Animated.View
                key={section.id}
                entering={FadeInUp.delay(300 + index * 60).duration(500).springify()}
                style={{ width: "50%", padding: 6 }}
              >
                <Pressable
                  onPress={() => handleCardPress(section.id)}
                  style={({ pressed }) => ({
                    backgroundColor: isDark ? colors.neutral[800] : colors.background.card,
                    borderRadius: RADIUS.xl,
                    padding: SPACING.lg,
                    minHeight: 130,
                    borderWidth: 1,
                    borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: RADIUS.lg,
                      backgroundColor: section.bgColor,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: SPACING.sm,
                    }}
                  >
                    <Ionicons
                      name={section.icon as IconName}
                      size={22}
                      color={section.color}
                    />
                  </View>
                  <Text
                    style={{
                      color: isDark ? colors.neutral[100] : colors.neutral[700],
                      fontSize: 15,
                      fontWeight: "600",
                      fontFamily: "Manrope_600SemiBold",
                      marginBottom: 2,
                    }}
                  >
                    {section.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.neutral[500],
                      fontSize: 12,
                    }}
                  >
                    {section.subtitle}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Support Section - Dicas da Nath */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <Text
            style={{
              color: isDark ? colors.neutral[100] : colors.neutral[700],
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Manrope_700Bold",
              marginBottom: SPACING.md,
            }}
          >
            Dicas da Nath 💕
          </Text>

          <View
            style={{
              backgroundColor: isDark ? colors.neutral[800] : colors.background.card,
              borderRadius: RADIUS.xl,
              borderWidth: 1,
              borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
              overflow: "hidden",
            }}
          >
            {QUICK_SUPPORT.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleQuickSupport(item.id)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  padding: SPACING.md,
                  borderBottomWidth: index < QUICK_SUPPORT.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? colors.neutral[700] : colors.neutral[100],
                  backgroundColor: pressed ? (isDark ? colors.neutral[700] : colors.neutral[50]) : "transparent",
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.lg,
                    backgroundColor: isDark ? colors.neutral[700] : DS_COLORS.primary[50],
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.md,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: isDark ? colors.neutral[100] : colors.neutral[700],
                      fontSize: 15,
                      fontWeight: "600",
                      fontFamily: "Manrope_600SemiBold",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.neutral[500],
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={DS_COLORS.primary[400]} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* NathIA CTA - Rosa como accent */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <Pressable
            onPress={handleTalkPress}
            style={({ pressed }) => ({
              backgroundColor: isDark ? DS_COLORS.accent[600] : DS_COLORS.accent[400],
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: isDark ? DS_COLORS.accent[500] : DS_COLORS.accent[500],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: RADIUS.lg,
                  backgroundColor: OVERLAY.white.strong,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: SPACING.md,
                }}
              >
                <Ionicons name="sparkles" size={24} color={DS_COLORS.neutral[0]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.neutral[900],
                    fontSize: 16,
                    fontWeight: "700",
                    fontFamily: "Manrope_700Bold",
                  }}
                >
                  Quer desabafar?
                </Text>
                <Text
                  style={{
                    color: colors.neutral[800],
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  A NathIA tá aqui pra te ouvir 💕
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[800]} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Community Banner - Calm FemTech */}
        <Animated.View
          entering={FadeInUp.delay(550).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}
        >
          <Pressable
            onPress={() => navigation.navigate("Community")}
            style={({ pressed }) => ({
              backgroundColor: isDark ? colors.neutral[800] : colors.background.card,
              borderRadius: RADIUS.xl,
              padding: SPACING.xl,
              borderWidth: 1,
              borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  overflow: "hidden",
                  marginRight: SPACING.sm,
                }}
              >
                <Image
                  source={{ uri: MAES_VALENTE_LOGO_URL }}
                  style={{
                    width: 44,
                    height: 44,
                  }}
                />
              </View>
              <Text
                style={{
                  color: isDark ? colors.neutral[100] : colors.neutral[700],
                  fontSize: 17,
                  fontWeight: "700",
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Comunidade Mães Valente
              </Text>
            </View>
            <Text
              style={{
                color: colors.neutral[500],
                fontSize: 14,
                lineHeight: 22,
                marginBottom: SPACING.md,
              }}
            >
              Mãe que entende mãe. Vem trocar experiência com outras mães que tão passando pelo mesmo que você.
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {["🩵", "🩷", "💜"].map((emoji, i) => (
                  <View
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: DS_COLORS.primary[50],
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: i > 0 ? -6 : 0,
                      borderWidth: 2,
                      borderColor: isDark ? colors.neutral[800] : colors.background.card,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{emoji}</Text>
                  </View>
                ))}
                <Text style={{ color: colors.neutral[500], fontSize: 12, marginLeft: SPACING.sm }}>
                  +50 mil mães
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: DS_COLORS.primary[50],
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.xs,
                  borderRadius: RADIUS.full,
                }}
              >
                <Text style={{ color: DS_COLORS.primary[600], fontSize: 12, fontWeight: "600" }}>
                  Entrar
                </Text>
                <Ionicons name="chevron-forward" size={14} color={DS_COLORS.primary[500]} style={{ marginLeft: 2 }} />
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Bottom Actions - Calm FemTech */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl }}
        >
          <View style={{ flexDirection: "row", gap: SPACING.sm }}>
            <Pressable
              onPress={() => navigation.navigate("Affirmations")}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: isDark ? colors.neutral[800] : DS_COLORS.primary[50],
                borderRadius: RADIUS.xl,
                padding: SPACING.lg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark ? colors.neutral[700] : DS_COLORS.primary[100],
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Ionicons name="heart" size={18} color={DS_COLORS.accent[500]} />
              <Text
                style={{
                  color: isDark ? colors.neutral[100] : colors.neutral[700],
                  fontSize: 14,
                  fontWeight: "600",
                  fontFamily: "Manrope_600SemiBold",
                  marginLeft: 8,
                }}
              >
                Afirmações
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Habits")}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: isDark ? colors.neutral[800] : DS_COLORS.primary[50],
                borderRadius: RADIUS.xl,
                padding: SPACING.lg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark ? colors.neutral[700] : DS_COLORS.primary[100],
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Ionicons name="sunny" size={18} color={DS_COLORS.primary[500]} />
              <Text
                style={{
                  color: isDark ? colors.neutral[100] : colors.neutral[700],
                  fontSize: 14,
                  fontWeight: "600",
                  fontFamily: "Manrope_600SemiBold",
                  marginLeft: 8,
                }}
              >
                Meu dia
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Footer Message - Tom Nathalia */}
        <Animated.View
          entering={FadeInUp.delay(650).duration(600).springify()}
          style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING["2xl"] }}
        >
          <View style={{ alignItems: "center", paddingVertical: SPACING.lg }}>
            <Text style={{ fontSize: 24, marginBottom: SPACING.sm }}>💕</Text>
            <Text
              style={{
                color: colors.neutral[400],
                fontSize: 14,
                textAlign: "center",
                lineHeight: 20,
                fontFamily: "Manrope_500Medium",
              }}
            >
              Lembra: cuidar de você é cuidar do seu filho.{"\n"}Com amor, Nath 🩷
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
