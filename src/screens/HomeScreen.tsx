/**
 * HomeScreen - Redesign com UX Emocional + Hierarquia Clara
 *
 * Hierarquia:
 * 1. HEADER (reduzido) - Saudação + avatar
 * 2. PRIMÁRIO: Check-in Emocional (1 toque)
 * 3. SECUNDÁRIO: Card NathIA (personalizado)
 * 4. SECUNDÁRIO: Pertencimento (discreto)
 * 5. TERCIÁRIO: Barra de Acesso Rápido
 */

import React, { useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, useWindowDimensions, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "../state/store";
import { MainTabScreenProps } from "../types/navigation";
import { useTheme } from "../hooks/useTheme";
import { SPACING, SHADOWS, COLORS, RADIUS, GRADIENTS } from "../theme/design-system";
import { LinearGradient } from "expo-linear-gradient";

// Componentes da Home
import {
  EmotionalCheckInPrimary,
  NathiaAdviceCard,
  QuickActionsBar,
  BelongingCard,
} from "../components/home";

// Responsividade
const getResponsiveValue = (screenWidth: number, baseValue: number, scale: number = 1): number => {
  const scaleFactor = screenWidth / 375;
  return Math.round(baseValue * scaleFactor * scale);
};

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
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
    navigation.navigate("Profile");
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

  const handleQuickNavigation = useCallback((route: string): void => {
    // Mapear rotas para navegação
    const routeMap: Record<string, () => void> = {
      Habits: () => navigation.navigate("Habits"),
      DailyLog: () => navigation.navigate("DailyLog", {}),
      Community: () => navigation.navigate("Community"),
      MyCare: () => navigation.navigate("MyCare"),
    };

    const navigateAction = routeMap[route];
    if (navigateAction) {
      navigateAction();
    }
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
            paddingTop: SPACING.md,
            paddingBottom: SPACING.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: SPACING.md }}>
            <Text
              style={{
                color: textMain,
                fontSize: getResponsiveValue(screenWidth, 24, 1),
                fontWeight: "800",
                letterSpacing: -0.3,
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
                ...SHADOWS.sm,
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
            paddingBottom: getResponsiveValue(screenWidth, 24) + getResponsiveValue(screenWidth, 100) + insets.bottom,
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
          {/* 1. PRIMÁRIO: Check-in Emocional (1 toque) */}
          <Animated.View entering={FadeInUp.delay(50).duration(500).springify()}>
            <EmotionalCheckInPrimary />
          </Animated.View>

          {/* 2. SECUNDÁRIO: Card NathIA */}
          <NathiaAdviceCard onPressChat={handleNathiaChat} />

          {/* 2.5. Mundo da Nath - Conteúdo Exclusivo */}
          <Animated.View entering={FadeInUp.delay(150).duration(500).springify()}>
            <Pressable
              onPress={handleMundoDaNath}
              style={{
                borderRadius: RADIUS["2xl"],
                overflow: "hidden",
                shadowColor: COLORS.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={GRADIENTS.primary as unknown as readonly [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: SPACING.xl,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Avatar Nath */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.lg,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.primary[500] }}>N</Text>
                </View>

                {/* Content */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#FFFFFF",
                        marginRight: SPACING.sm,
                      }}
                    >
                      Mundo da Nath
                    </Text>
                    <View
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        paddingHorizontal: SPACING.sm,
                        paddingVertical: 2,
                        borderRadius: RADIUS.full,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "600", color: "#FFFFFF" }}>NOVO</Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 18,
                    }}
                  >
                    Conteúdos exclusivos da Nath para você 💕
                  </Text>
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* 3. SECUNDÁRIO: Pertencimento (discreto) */}
          <BelongingCard onPress={handleCommunity} />

          {/* 4. TERCIÁRIO: Barra de Acesso Rápido */}
          <QuickActionsBar onNavigate={handleQuickNavigation} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
