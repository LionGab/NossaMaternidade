import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, Dimensions, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useAffirmationsStore } from "../state/store";
import { RootStackScreenProps, Affirmation } from "../types/navigation";
import { useTheme } from "../hooks/useTheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AFFIRMATIONS: Affirmation[] = [
  { id: "1", text: "Eu transformo meus sonhos em objetivos, meus objetivos em passos e meus passos em acao.", category: "motivacao" },
  { id: "2", text: "Meu corpo e minha casa, e eu cuido dele com amor e gratidao.", category: "autocuidado" },
  { id: "3", text: "Cada dia e uma nova oportunidade para crescer e me tornar a melhor versao de mim mesma.", category: "crescimento" },
  { id: "4", text: "Eu mereço amor, paz e felicidade em abundancia.", category: "amor-proprio" },
  { id: "5", text: "Minha forca interior e maior do que qualquer desafio que eu enfrente.", category: "forca" },
  { id: "6", text: "Eu escolho pensamentos que nutrem minha alma e elevam meu espirito.", category: "positividade" },
  { id: "7", text: "Sou capaz de criar a vida que desejo com determinacao e fe.", category: "determinacao" },
  { id: "8", text: "Meu valor nao depende da opiniao dos outros. Eu sou suficiente.", category: "autoestima" },
  { id: "9", text: "Eu libero o que nao me serve mais e abro espaco para o novo.", category: "renovacao" },
  { id: "10", text: "A maternidade me transforma e revela forcas que eu nao sabia que tinha.", category: "maternidade" },
  { id: "11", text: "Cada respiro me conecta com a calma interior que sempre esta disponivel para mim.", category: "serenidade" },
  { id: "12", text: "Eu confio no processo da vida e sei que tudo acontece no tempo certo.", category: "confianca" },
  { id: "13", text: "Minha intuicao e minha guia. Eu confio em mim mesma.", category: "intuicao" },
  { id: "14", text: "Eu sou grata por este momento e por todas as benções em minha vida.", category: "gratidao" },
  { id: "15", text: "Minha jornada e unica e linda. Eu celebro cada passo.", category: "celebracao" },
];

const GRADIENT_THEMES = [
  { colors: ["#1E3A5F", "#2D5A87", "#3B7AB0"], name: "Oceano" },
  { colors: ["#4A1942", "#6B2D5C", "#8B4177"], name: "Ametista" },
  { colors: ["#1A3C34", "#2D5C4A", "#3F7D61"], name: "Floresta" },
  { colors: ["#3D2914", "#5C3D1E", "#7A5128"], name: "Terra" },
  { colors: ["#2E1065", "#4C1D95", "#6D28D9"], name: "Cosmos" },
];

export default function AffirmationsScreen({ navigation }: RootStackScreenProps<"Affirmations">) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);

  const todayAffirmation = useAffirmationsStore((s) => s.todayAffirmation);
  const favoriteAffirmations = useAffirmationsStore((s) => s.favoriteAffirmations);
  const setTodayAffirmation = useAffirmationsStore((s) => s.setTodayAffirmation);
  const addToFavorites = useAffirmationsStore((s) => s.addToFavorites);
  const removeFromFavorites = useAffirmationsStore((s) => s.removeFromFavorites);
  const lastShownDate = useAffirmationsStore((s) => s.lastShownDate);
  const setLastShownDate = useAffirmationsStore((s) => s.setLastShownDate);

  const affirmation = AFFIRMATIONS[currentIndex];
  const theme = GRADIENT_THEMES[themeIndex];

  const isFavorite = useMemo(() => {
    return favoriteAffirmations.some((a) => a.id === affirmation.id);
  }, [favoriteAffirmations, affirmation.id]);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (lastShownDate !== today) {
      const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      setCurrentIndex(randomIndex);
      setTodayAffirmation(AFFIRMATIONS[randomIndex]);
      setLastShownDate(today);
      setThemeIndex(Math.floor(Math.random() * GRADIENT_THEMES.length));
    } else if (todayAffirmation) {
      const index = AFFIRMATIONS.findIndex((a) => a.id === todayAffirmation.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, []);

  const handleNext = () => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      opacity.value = withTiming(1, { duration: 300 });
    });

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 200);
  };

  const handlePrevious = () => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      opacity.value = withTiming(1, { duration: 300 });
    });

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);
    }, 200);
  };

  const handleToggleFavorite = () => {
    scale.value = withSpring(1.2, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });

    if (isFavorite) {
      removeFromFavorites(affirmation.id);
    } else {
      addToFavorites(affirmation);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${affirmation.text}"\n\n- Nossa Maternidade`,
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleChangeTheme = () => {
    setThemeIndex((prev) => (prev + 1) % GRADIENT_THEMES.length);
  };

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: interpolate(opacity.value, [0, 1], [0.95, 1]) }],
  }));

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1">
      <LinearGradient
        colors={theme.colors as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Decorative elements */}
        <View
          style={{
            position: "absolute",
            top: SCREEN_HEIGHT * 0.1,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: SCREEN_HEIGHT * 0.2,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: SCREEN_HEIGHT * 0.4,
            right: 30,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
          }}
        />

        {/* Header */}
        <View
          style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}
          className="flex-row items-center justify-between"
        >
          <Animated.View entering={FadeIn.delay(100).duration(500)}>
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.neutral[0]} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(200).duration(500)}>
            <Pressable
              onPress={handleChangeTheme}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Ionicons name="color-palette-outline" size={22} color={colors.neutral[0]} />
            </Pressable>
          </Animated.View>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center px-8">
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <Text className="text-white/50 text-sm text-center uppercase tracking-widest mb-8">
              Afirmacao do Dia
            </Text>
          </Animated.View>

          <Animated.View style={animatedTextStyle}>
            <View
              className="rounded-3xl p-8"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <Text className="text-white/30 text-6xl font-serif mb-4">&ldquo;</Text>
              <Text
                className="text-white text-2xl text-center leading-10"
                style={{ fontFamily: "System", fontWeight: "300" }}
              >
                {affirmation.text}
              </Text>
              <Text className="text-white/30 text-6xl font-serif text-right mt-4">&rdquo;</Text>
            </View>
          </Animated.View>

          {/* Category Badge */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            className="items-center mt-6"
          >
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Text className="text-white/70 text-xs uppercase tracking-wider">
                {affirmation.category}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Actions */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(500)}
          className="px-8 pb-8"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          {/* Navigation */}
          <View className="flex-row items-center justify-center mb-8">
            <Pressable
              onPress={handlePrevious}
              className="w-12 h-12 rounded-full items-center justify-center mx-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.neutral[0]} />
            </Pressable>

            <View className="flex-row items-center">
              {AFFIRMATIONS.slice(
                Math.max(0, currentIndex - 2),
                Math.min(AFFIRMATIONS.length, currentIndex + 3)
              ).map((_, idx) => {
                const actualIndex = Math.max(0, currentIndex - 2) + idx;
                return (
                  <View
                    key={actualIndex}
                    className="w-2 h-2 rounded-full mx-1"
                    style={{
                      backgroundColor:
                        actualIndex === currentIndex
                          ? colors.neutral[0]
                          : "rgba(255, 255, 255, 0.3)",
                      transform: [{ scale: actualIndex === currentIndex ? 1.3 : 1 }],
                    }}
                  />
                );
              })}
            </View>

            <Pressable
              onPress={handleNext}
              className="w-12 h-12 rounded-full items-center justify-center mx-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Ionicons name="chevron-forward" size={24} color={colors.neutral[0]} />
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-center">
            <Pressable
              onPress={handleToggleFavorite}
              className="w-14 h-14 rounded-full items-center justify-center mx-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Animated.View style={animatedHeartStyle}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={26}
                  color={isFavorite ? colors.primary[400] : colors.neutral[0]}
                />
              </Animated.View>
            </Pressable>

            <Pressable
              onPress={handleShare}
              className="w-14 h-14 rounded-full items-center justify-center mx-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Ionicons name="share-outline" size={26} color={colors.neutral[0]} />
            </Pressable>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
