import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, Image, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAppStore, useHabitsStore, useCheckInStore, useAffirmationsStore, useCommunityStore } from "../state/store";
import { MainTabScreenProps } from "../types/navigation";
import { getPosts } from "../api/database";
import { useTheme } from "../hooks/useTheme";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Calcular valores responsivos baseados no tamanho da tela
const getResponsiveValue = (baseValue: number, scale: number = 1) => {
  const scaleFactor = SCREEN_WIDTH / 375; // Baseado em iPhone 12/13 (375px)
  return Math.round(baseValue * scaleFactor * scale);
};

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  
  // Valores responsivos
  const horizontalPadding = getResponsiveValue(20, 1);
  const cardPadding = getResponsiveValue(16, 1);
  const cardBorderRadius = getResponsiveValue(20, 1);
  const gap = getResponsiveValue(14, 1);
  
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const babyBirthDate = useAppStore((s) => s.user?.babyBirthDate);
  const userAvatar = useAppStore((s) => s.user?.avatarUrl);

  // Stores
  const habits = useHabitsStore((s) => s.habits);
  const getCompletedToday = useHabitsStore((s) => s.getCompletedToday);
  const todayAffirmation = useAffirmationsStore((s) => s.todayAffirmation);
  const posts = useCommunityStore((s) => s.posts);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const setTodayEnergy = useCheckInStore((s) => s.setTodayEnergy);

  const [refreshing, setRefreshing] = useState(false);
  const [moodSlider, setMoodSlider] = useState(0.65);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  // Calcular estatísticas
  const completedHabitsToday = getCompletedToday();
  const totalHabits = habits.length;
  const habitsProgress = totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0;

  // Calcular streak de hábitos
  const habitsStreak = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const allCompleted = habits.every((habit) => habit.completedDates.includes(dateStr));
      if (allCompleted && habits.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [habits]);

  // Calcular semanas de gravidez
  const getPregnancyInfo = useMemo(() => {
    if (userStage === "pregnant" && dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor((280 - diffDays) / 7);
      
      if (diffDays > 0) {
        return {
          label: `${weeks}ª Semana`,
          sublabel: `${diffDays} dias para o parto`,
        };
      } else {
        return {
          label: "Parto chegando!",
          sublabel: "Qualquer momento agora",
        };
      }
    } else if (userStage === "postpartum" && babyBirthDate) {
      const today = new Date();
      const birth = new Date(babyBirthDate);
      const diffTime = today.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        label: `${diffDays} dias`,
        sublabel: "de vida do seu bebê",
      };
    }
    return null;
  }, [userStage, dueDate, babyBirthDate]);

  // Buscar posts da comunidade
  const loadCommunityPosts = useCallback(async () => {
    try {
      const { data, error } = await getPosts();
      if (data && !error) {
        setPosts(data.slice(0, 3));
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, [setPosts]);

  useEffect(() => {
    loadCommunityPosts();
  }, [loadCommunityPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommunityPosts();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString("pt-BR");
  };

  const handleFeelingPress = async (feeling: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFeeling(feeling);
    
    // Mapear sentimentos para valores do check-in
    const feelingMap: Record<string, { mood: number; energy: number }> = {
      bem: { mood: 5, energy: 4 },
      cansada: { mood: 3, energy: 2 },
      enjoada: { mood: 2, energy: 2 },
      amada: { mood: 5, energy: 4 },
    };

    const mapping = feelingMap[feeling];
    if (mapping) {
      setTodayMood(mapping.mood);
      setTodayEnergy(mapping.energy);
    }
  };

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

  const handleHabitsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Habits");
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate("PostDetail", { postId });
  };

  const latestPost = posts.length > 0 ? posts[0] : null;

  // Cores baseadas no tema (light/dark)
  const bg = colors.background.DEFAULT;
  const textMain = colors.text.dark;
  const textMuted = isDark ? "rgba(226,232,240,0.65)" : "rgba(45,55,72,0.65)";
  const cardBg = isDark ? colors.background.light : "#ffffff";
  const border = isDark ? colors.ui.border : "#F1F5F9";

  const cardShadow = {
    shadowColor: "#000",
    shadowOpacity: isDark ? 0.3 : 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: isDark ? 4 : 2,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, width: "100%" }}>
        {/* HEADER */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: getResponsiveValue(12),
            paddingBottom: getResponsiveValue(12),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: textMain, fontSize: getResponsiveValue(26, 1.1), fontWeight: "800", letterSpacing: -0.5 }}>
              {getGreeting()}, Mãe
            </Text>
            {getPregnancyInfo ? (
              <Text style={{ color: textMuted, fontSize: getResponsiveValue(14, 1), fontWeight: "600", marginTop: 4 }}>
                {userName || "Mamãe"}, {getPregnancyInfo.label}
              </Text>
            ) : (
              <Text style={{ color: textMuted, fontSize: getResponsiveValue(14, 1), fontWeight: "600", marginTop: 4 }}>
                {userName || "Mamãe"}
              </Text>
            )}
          </View>

          <Pressable onPress={handleNotifications} style={{ position: "relative" }}>
            <View
              style={{
                height: getResponsiveValue(44, 1),
                width: getResponsiveValue(44, 1),
                borderRadius: 999,
                borderWidth: 2,
                borderColor: "#fff",
                overflow: "hidden",
                ...cardShadow,
              }}
            >
              {userAvatar ? (
                <Image source={{ uri: userAvatar }} style={{ height: "100%", width: "100%" }} />
              ) : (
                <View style={{ height: "100%", width: "100%", backgroundColor: colors.primary[500], alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="person" size={24} color="#fff" />
                </View>
              )}
            </View>
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                height: 12,
                width: 12,
                borderRadius: 999,
                backgroundColor: colors.status.success,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          </Pressable>
        </Animated.View>

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingBottom: getResponsiveValue(24) + getResponsiveValue(90) + insets.bottom,
            gap: gap,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.DEFAULT} />}
        >
          {/* Sentimento Atual - Slider */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(600).springify()}
            style={{
              backgroundColor: cardBg,
              borderRadius: cardBorderRadius,
              padding: cardPadding,
              borderWidth: 1,
              borderColor: border,
              ...cardShadow,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: getResponsiveValue(12) }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ color: textMain, fontSize: getResponsiveValue(17, 1.05), fontWeight: "800" }}>Sentimento Atual</Text>
                <Text style={{ color: "rgba(100,116,139,0.9)", fontSize: getResponsiveValue(12, 0.95), fontWeight: "600", marginTop: 4 }}>
                  Como você está se sentindo agora?
                </Text>
              </View>

              <View
                style={{
                  height: getResponsiveValue(36, 0.9),
                  width: getResponsiveValue(36, 0.9),
                  borderRadius: 999,
                  backgroundColor: colors.bluePastel[100],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="happy-outline" size={getResponsiveValue(20, 0.9)} color={colors.bluePastel.DEFAULT} />
              </View>
            </View>

            <View style={{ paddingVertical: 6 }}>
              <Slider
                value={moodSlider}
                onValueChange={setMoodSlider}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.bluePastel.DEFAULT}
                maximumTrackTintColor={colors.ui.borderLight}
                thumbTintColor={cardBg}
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: "800", letterSpacing: 1, color: "rgba(100,116,139,0.35)" }}>
                  BAIXO
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "800", letterSpacing: 1, color: "rgba(100,116,139,0.35)" }}>
                  ALTO
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Card Gradiente - Pertencimento */}
          <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={{ borderRadius: cardBorderRadius, overflow: "hidden" }}>
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate("Affirmations");
              }}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: cardPadding }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: getResponsiveValue(14) }}>
                  <View
                    style={{
                      paddingHorizontal: getResponsiveValue(10),
                      paddingVertical: getResponsiveValue(5),
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.18)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: getResponsiveValue(11, 0.95), fontWeight: "800" }}>Bem-estar</Text>
                  </View>
                  <Pressable hitSlop={10}>
                    <Ionicons name="ellipsis-horizontal" size={getResponsiveValue(20, 0.9)} color="rgba(255,255,255,0.8)" />
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <View style={{ flex: 1, paddingRight: getResponsiveValue(10) }}>
                    <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: getResponsiveValue(13, 0.95), fontWeight: "600" }}>
                      Fortaleça seu senso de
                    </Text>
                    <Text style={{ color: "#fff", fontSize: getResponsiveValue(28, 1.1), fontWeight: "900", letterSpacing: -0.5, marginTop: 2 }}>
                      Pertencimento
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: getResponsiveValue(6), marginTop: getResponsiveValue(12) }}>
                      <Ionicons name="heart" size={getResponsiveValue(16, 0.9)} color="rgba(255,255,255,0.85)" />
                      <Text style={{ color: "#fff", fontSize: getResponsiveValue(13, 0.95), fontWeight: "800" }}>Você não está sozinha</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      height: getResponsiveValue(80, 0.85),
                      width: getResponsiveValue(80, 0.85),
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.14)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="people" size={getResponsiveValue(40, 0.85)} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Conselho da NathIA */}
          <Animated.View entering={FadeInUp.delay(300).duration(600).springify()}>
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate("Assistant");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: getResponsiveValue(12),
                borderRadius: getResponsiveValue(16),
                padding: cardPadding,
                backgroundColor: "#eff6ff",
                borderWidth: 1,
                borderColor: "rgba(59,130,246,0.15)",
                ...cardShadow,
              }}
            >
              <View
                style={{
                  height: getResponsiveValue(44, 0.9),
                  width: getResponsiveValue(44, 0.9),
                  borderRadius: 999,
                  backgroundColor: colors.bluePastel[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="sparkles" size={getResponsiveValue(20, 0.9)} color={colors.bluePastel.DEFAULT} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: textMain, fontSize: getResponsiveValue(15, 1), fontWeight: "900" }}>Conselho da NathIA</Text>
                <Text style={{ color: textMuted, fontSize: getResponsiveValue(13, 0.95), fontWeight: "600", marginTop: 2 }}>
                  {todayAffirmation
                    ? todayAffirmation.text.slice(0, 50) + "..."
                    : "Toque aqui para receber dicas personalizadas."}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={getResponsiveValue(20, 0.9)} color="rgba(100,116,139,0.6)" />
            </Pressable>
          </Animated.View>

          {/* Daily Check-in com Botões de Humor */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
            style={{
              backgroundColor: cardBg,
              borderRadius: getResponsiveValue(16),
              padding: cardPadding,
              borderWidth: 1,
              borderColor: colors.ui.borderPink,
              ...cardShadow,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: getResponsiveValue(8) }}>
              <Text style={{ color: textMain, fontSize: getResponsiveValue(17, 1.05), fontWeight: "900" }}>Daily Check-in</Text>
              <View
                style={{
                  paddingHorizontal: getResponsiveValue(8),
                  paddingVertical: getResponsiveValue(5),
                  borderRadius: getResponsiveValue(8),
                  backgroundColor: colors.primary[100],
                }}
              >
                <Text style={{ color: colors.primary.DEFAULT, fontSize: getResponsiveValue(11, 0.95), fontWeight: "900" }}>Hoje</Text>
              </View>
            </View>

            <Text style={{ color: textMuted, fontSize: getResponsiveValue(13, 0.95), fontWeight: "600", marginBottom: getResponsiveValue(10) }}>
              Como você está se sentindo hoje?
            </Text>

            <View style={{ flexDirection: "row", gap: getResponsiveValue(8) }}>
              <MoodButton
                label="Bem"
                icon="sunny"
                iconColor={colors.feeling.sunny.color}
                isSelected={selectedFeeling === "bem"}
                onPress={() => handleFeelingPress("bem")}
              />
              <MoodButton
                label="Cansada"
                icon="cloud"
                iconColor={colors.feeling.cloud.color}
                isSelected={selectedFeeling === "cansada"}
                onPress={() => handleFeelingPress("cansada")}
              />
              <MoodButton
                label="Enjoada"
                icon="rainy"
                iconColor={colors.feeling.rainy.color}
                isSelected={selectedFeeling === "enjoada"}
                onPress={() => handleFeelingPress("enjoada")}
              />
              <MoodButton
                label="Amada"
                icon="heart"
                iconColor={colors.feeling.heart.color}
                isSelected={selectedFeeling === "amada"}
                onPress={() => handleFeelingPress("amada")}
              />
            </View>
          </Animated.View>

          {/* Stats Cards - Hábitos */}
          {habits.length > 0 && (
            <Animated.View entering={FadeInUp.delay(500).duration(600).springify()}>
              <Pressable
                onPress={handleHabitsPress}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: getResponsiveValue(16),
                  padding: cardPadding,
                  borderWidth: 1,
                  borderColor: border,
                  ...cardShadow,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: getResponsiveValue(10) }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: getResponsiveValue(10) }}>
                    <View
                      style={{
                        height: getResponsiveValue(38, 0.95),
                        width: getResponsiveValue(38, 0.95),
                        borderRadius: getResponsiveValue(10),
                        backgroundColor: colors.primary[100],
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={getResponsiveValue(18, 0.9)} color={colors.primary.DEFAULT} />
                    </View>
                    <View>
                      <Text style={{ color: textMain, fontSize: getResponsiveValue(17, 1.05), fontWeight: "900" }}>Hábitos</Text>
                      <Text style={{ color: textMuted, fontSize: getResponsiveValue(11, 0.95), fontWeight: "600", marginTop: 2 }}>
                        {completedHabitsToday}/{totalHabits} completados hoje
                      </Text>
                    </View>
                  </View>
                  {habitsStreak > 0 && (
                    <View
                      style={{
                        paddingHorizontal: getResponsiveValue(8),
                        paddingVertical: getResponsiveValue(5),
                        borderRadius: getResponsiveValue(8),
                        backgroundColor: colors.primary[100],
                      }}
                    >
                      <Text style={{ color: colors.primary.DEFAULT, fontSize: getResponsiveValue(11, 0.95), fontWeight: "900" }}>
                        🔥 {habitsStreak} dias
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ height: getResponsiveValue(5), borderRadius: getResponsiveValue(2), backgroundColor: "rgba(15,23,42,0.08)", overflow: "hidden" }}>
                  <View
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      width: `${habitsProgress}%`,
                      backgroundColor: colors.primary[500],
                    }}
                  />
                </View>
              </Pressable>
            </Animated.View>
          )}

          {/* Para Você - Posts da Comunidade */}
          <Animated.View entering={FadeInUp.delay(600).duration(600).springify()} style={{ marginTop: getResponsiveValue(4) }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: getResponsiveValue(8), paddingHorizontal: 2 }}>
              <Text style={{ color: textMain, fontSize: getResponsiveValue(17, 1.05), fontWeight: "900" }}>Para Você</Text>
              <Pressable onPress={() => navigation.navigate("Community")}>
                <Text style={{ color: colors.primary.DEFAULT, fontSize: getResponsiveValue(13, 0.95), fontWeight: "900" }}>Ver tudo</Text>
              </Pressable>
            </View>

            {latestPost ? (
              <Pressable
                onPress={() => handlePostPress(latestPost.id)}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: getResponsiveValue(14),
                  padding: getResponsiveValue(10),
                  borderWidth: 1,
                  borderColor: border,
                  ...cardShadow,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: getResponsiveValue(8) }}>
                  <View
                    style={{
                      height: getResponsiveValue(38, 0.95),
                      width: getResponsiveValue(38, 0.95),
                      borderRadius: 999,
                      backgroundColor: colors.primary[100],
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: getResponsiveValue(8),
                    }}
                  >
                    {latestPost.authorAvatar ? (
                      <Image source={{ uri: latestPost.authorAvatar }} style={{ height: "100%", width: "100%", borderRadius: 999 }} />
                    ) : (
                      <Ionicons name="person" size={20} color={colors.primary.DEFAULT} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: textMain, fontSize: getResponsiveValue(13, 0.95), fontWeight: "900" }}>{latestPost.authorName}</Text>
                    <Text style={{ color: textMuted, fontSize: getResponsiveValue(10, 0.9), marginTop: 2 }}>{formatTimeAgo(latestPost.createdAt)}</Text>
                  </View>
                </View>
                <Text style={{ color: textMain, fontSize: getResponsiveValue(13, 0.95), fontWeight: "900", lineHeight: getResponsiveValue(16) }} numberOfLines={2}>
                  {latestPost.content}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: getResponsiveValue(8), gap: getResponsiveValue(12) }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: getResponsiveValue(3) }}>
                    <Ionicons
                      name={latestPost.isLiked ? "heart" : "heart-outline"}
                      size={getResponsiveValue(14, 0.9)}
                      color={latestPost.isLiked ? colors.primary.DEFAULT : textMuted}
                    />
                    <Text style={{ color: textMuted, fontSize: getResponsiveValue(11, 0.95), fontWeight: "700" }}>{latestPost.likesCount}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: getResponsiveValue(3) }}>
                    <Ionicons name="chatbubble-outline" size={getResponsiveValue(14, 0.9)} color={textMuted} />
                    <Text style={{ color: textMuted, fontSize: getResponsiveValue(11, 0.95), fontWeight: "700" }}>{latestPost.commentsCount}</Text>
                  </View>
                </View>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: getResponsiveValue(14),
                  padding: getResponsiveValue(20),
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: border,
                  ...cardShadow,
                }}
              >
                <Ionicons name="people-outline" size={getResponsiveValue(42, 0.9)} color="#D1D5DB" />
                <Text style={{ color: textMuted, fontSize: getResponsiveValue(13, 0.95), textAlign: "center", marginTop: getResponsiveValue(10) }}>
                  Ainda não há posts. Seja a primeira a compartilhar!
                </Text>
                <Pressable
                  onPress={() => navigation.navigate("Community")}
                  style={{
                    marginTop: getResponsiveValue(12),
                    paddingHorizontal: getResponsiveValue(18),
                    paddingVertical: getResponsiveValue(8),
                    borderRadius: getResponsiveValue(10),
                    backgroundColor: colors.primary.DEFAULT,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: getResponsiveValue(13, 0.95), fontWeight: "800" }}>Ver comunidade</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function MoodButton({
  label,
  icon,
  iconColor,
  isSelected,
  onPress,
}: {
  label: string;
  icon: string;
  iconColor: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    sunny: "sunny",
    cloud: "cloud",
    rainy: "rainy",
    heart: "heart",
  };

  // Obter cor de fundo pastel baseada no sentimento
  const getBackgroundColor = () => {
    if (isSelected) {
      // Usar cor ativa pastel do sentimento
      const feelingMap: Record<string, string> = {
        sunny: colors.feeling.sunny.activeColor,
        cloud: colors.feeling.cloud.activeColor,
        rainy: colors.feeling.rainy.activeColor,
        heart: colors.feeling.heart.activeColor,
      };
      return feelingMap[icon] || colors.primary[100];
    }
    return colors.ui.borderLight;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        borderRadius: getResponsiveValue(12),
        paddingVertical: getResponsiveValue(10),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getBackgroundColor(),
        transform: [{ scale: pressed ? 0.97 : 1 }],
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? iconColor : "transparent",
      })}
    >
      <Ionicons name={iconMap[icon] || "ellipse"} size={getResponsiveValue(26, 0.9)} color={iconColor} />
      <Text style={{ marginTop: getResponsiveValue(4), fontSize: getResponsiveValue(11, 0.95), fontWeight: "700", color: colors.text.dark }}>
        {label}
      </Text>
    </Pressable>
  );
}
