/**
 * HomeScreen - Calm FemTech Design
 *
 * Hierarquia:
 * 1. HEADER - Saudação + avatar
 * 2. HERO - Foto da Nathalia (maternal, acolhedora)
 * 3. PRIMÁRIO: Check-in Emocional (1 toque)
 * 4. SECUNDÁRIO: Card NathIA
 * 5. SECUNDÁRIO: Mundo da Nath (estilo suave)
 * 6. SECUNDÁRIO: Pertencimento
 *
 * Navegação principal via Tab Bar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { useAppStore } from "../state/store";
import { OVERLAY } from "../theme/design-system";
import { MainTabScreenProps } from "../types/navigation";

// Componentes da Home
import { EmotionalCheckInPrimary, HealthInsightCard } from "../components/home";
import { RowCard } from "../components/ui";

// Configuração de conteúdo da Nathalia

// 🥇 MELHOR FOTO ABSOLUTA (HOME / PRIMEIRA DOBRA)
// "2 meses do nosso mini homenzinho" - Instagram: https://www.instagram.com/p/DQzcsyvDmTV/
// TODO: Substituir pela URL direta da imagem quando disponível
const NATHALIA_HERO_URL = "https://i.imgur.com/7GX41Ft.jpg"; // Placeholder - atualizar com URL real da foto

// Responsividade
const getResponsiveValue = (screenWidth: number, baseValue: number, scale: number = 1): number => {
  const scaleFactor = screenWidth / 375;
  return Math.round(baseValue * scaleFactor * scale);
};

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { colors, isDark, spacing, shadows, brand, radius } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Valores responsivos
  const horizontalPadding = useMemo(() => getResponsiveValue(screenWidth, 20, 1), [screenWidth]);
  const gap = useMemo(() => getResponsiveValue(screenWidth, 16, 1), [screenWidth]);

  // User data
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const babyBirthDate = useAppStore((s) => s.user?.babyBirthDate);
  const userAvatar = useAppStore((s) => s.user?.avatarUrl);

  // Refresh state
  const [refreshing, setRefreshing] = React.useState(false);

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // Pregnancy info
  const pregnancyInfo = useMemo((): string | null => {
    if (userStage === "pregnant" && dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor((280 - diffDays) / 7);

      if (diffDays > 0) {
        return `${weeks}ª Semana`;
      }
      return "Parto chegando!";
    } else if (userStage === "postpartum" && babyBirthDate) {
      const today = new Date();
      const birth = new Date(babyBirthDate);
      const diffTime = today.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias de vida`;
    }
    return null;
  }, [userStage, dueDate, babyBirthDate]);

  // Refresh handler
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    // Simular refresh
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
    setRefreshing(false);
  }, []);

  // Navigation handlers
  const handleAvatarPress = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("EditProfile");
  }, [navigation]);

  const handleNathiaChat = useCallback((): void => {
    navigation.navigate("Assistant");
  }, [navigation]);

  const handleCommunity = useCallback((): void => {
    navigation.navigate("Community");
  }, [navigation]);

  const handleMundoDaNath = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("MundoDaNath");
  }, [navigation]);

  // Cores do tema
  const bg = colors.background.primary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, width: "100%" }}>
        {/* HEADER (reduzido) */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text
              style={{
                color: textMain,
                fontSize: 20,
                fontWeight: "700",
                fontFamily: "Manrope_700Bold",
              }}
            >
              {greeting}, {userName || "Mamãe"}
            </Text>
            {pregnancyInfo && (
              <Text
                style={{
                  color: textMuted,
                  fontSize: getResponsiveValue(screenWidth, 14, 1),
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {pregnancyInfo}
              </Text>
            )}
          </View>

          {/* Avatar */}
          <Pressable
            onPress={handleAvatarPress}
            accessibilityLabel="Ir para perfil"
            accessibilityRole="button"
            accessibilityHint="Abre a tela de perfil do usuário"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View
              style={{
                height: getResponsiveValue(screenWidth, 44, 1),
                width: getResponsiveValue(screenWidth, 44, 1),
                borderRadius: 999,
                borderWidth: 2,
                borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
                overflow: "hidden",
                ...shadows.sm,
              }}
            >
              {userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
                  style={{ height: "100%", width: "100%" }}
                  contentFit="cover"
                  transition={200}
                  placeholder={{ blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" }}
                />
              ) : (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: colors.primary[500],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={22}
                    color={colors.text.inverse || colors.neutral[0]}
                  />
                </View>
              )}
            </View>
          </Pressable>
        </Animated.View>

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingBottom:
              getResponsiveValue(screenWidth, 24) +
              getResponsiveValue(screenWidth, 100) +
              insets.bottom,
            gap: gap,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[500]}
              colors={Platform.OS === "android" ? [colors.primary[500]] : undefined}
            />
          }
          accessibilityLabel="Conteúdo principal da tela inicial"
        >
          {/* HERO - Foto da Nathalia (maternal, acolhedora) */}
          <Animated.View entering={FadeInUp.delay(50).duration(600).springify()}>
            <Pressable
              onPress={handleMundoDaNath}
              accessibilityLabel="Ver conteúdos da Nathalia"
              style={({ pressed }) => ({
                borderRadius: radius.xl,
                overflow: "hidden",
                opacity: pressed ? 0.95 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              <View style={{ position: "relative" }}>
                {/* Container com overflow hidden para zoom */}
                <View
                  style={{
                    width: "100%",
                    height: getResponsiveValue(screenWidth, 180, 1),
                    borderRadius: radius.xl,
                    overflow: "hidden",
                  }}
                >
                  {/* Imagem ajustada - mostra Nath + bebê sem cortar cabelo */}
                  <Image
                    source={{ uri: NATHALIA_HERO_URL }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentFit="cover"
                    contentPosition={{ top: 0.55 }}
                    transition={300}
                    placeholder={{ blurhash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH" }}
                  />
                </View>

                {/* Gradiente overlay */}
                <LinearGradient
                  colors={["transparent", OVERLAY.scrim]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    borderBottomLeftRadius: radius.xl,
                    borderBottomRightRadius: radius.xl,
                  }}
                />

                {/* Texto sobre a imagem */}
                <View
                  style={{
                    position: "absolute",
                    bottom: spacing.md,
                    left: spacing.lg,
                    right: spacing.lg,
                  }}
                >
                  <Text
                    style={{
                      color: colors.neutral[0],
                      fontSize: 15,
                      fontWeight: "700",
                      fontFamily: "Manrope_700Bold",
                      marginBottom: 2,
                    }}
                  >
                    Olá, mamãe 💕
                  </Text>
                  <Text
                    style={{
                      color: OVERLAY.light,
                      fontSize: 13,
                      fontWeight: "500",
                      fontFamily: "Manrope_500Medium",
                    }}
                  >
                    Você está fazendo um trabalho incrível
                  </Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* 1. PRIMÁRIO: Check-in Emocional (1 toque) */}
          <Animated.View entering={FadeInUp.delay(100).duration(500).springify()}>
            <EmotionalCheckInPrimary />
          </Animated.View>

          {/* HEALTH INSIGHTS - Smart alerts baseados em dados */}
          <HealthInsightCard />

          {/* CTA Rosa - Premium (accent[400], texto navy, sombra mínima) */}
          <Animated.View entering={FadeInUp.delay(150).duration(500).springify()}>
            <Pressable
              onPress={handleNathiaChat}
              accessibilityRole="button"
              accessibilityLabel="Conversar com a NathIA"
              style={({ pressed }) => ({
                borderRadius: radius.xl,
                backgroundColor: isDark ? brand.accent[500] : brand.accent[400],
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                borderWidth: 1,
                borderColor: isDark ? brand.accent[600] : brand.accent[500],
              })}
            >
              <Ionicons name="sparkles" size={18} color={colors.neutral[900]} />
              <Text
                style={{
                  fontFamily: "Manrope_700Bold",
                  fontSize: 14,
                  color: colors.neutral[900],
                }}
              >
                Conversar com a NathIA
              </Text>
            </Pressable>
          </Animated.View>

          {/* 2. SECUNDÁRIO: Card NathIA */}
          <RowCard
            icon="sparkles"
            title="NathIA"
            subtitle="Como você está hoje? Vamos começar por aí."
            onPress={handleNathiaChat}
            animationDelay={200}
            accessibilityLabel="Conversar com NathIA"
            accessibilityHint="Abre o chat com a assistente virtual NathIA"
          />

          {/* 3. SECUNDÁRIO: Mundo da Nath - Rosa como accent (badge + ícone) */}
          <RowCard
            icon="heart"
            iconColor={isDark ? brand.accent[300] : brand.accent[500]}
            title="Mundo da Nath"
            subtitle="Conteúdos exclusivos da Nath para você"
            badge="NOVO"
            badgeColor={isDark ? brand.accent[500] : brand.accent[200]}
            onPress={handleMundoDaNath}
            animationDelay={150}
            accessibilityLabel="Mundo da Nath"
            accessibilityHint="Abre conteúdos exclusivos da Nathalia"
          />

          {/* 4. SECUNDÁRIO: Pertencimento */}
          <RowCard
            icon="people"
            title="Você não está sozinha"
            subtitle="Conecte-se com outras mães"
            onPress={handleCommunity}
            animationDelay={200}
            accessibilityLabel="Ver comunidade"
            accessibilityHint="Abre a comunidade de mães"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
