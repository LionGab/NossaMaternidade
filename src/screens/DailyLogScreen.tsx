import React, { useState, useMemo, useRef } from "react";
import { View, Text, Pressable, PanResponder, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useCycleStore } from "../state/store";
import { RootStackScreenProps, DailyLog } from "../types/navigation";
import * as Haptics from "expo-haptics";
import { wp } from "../utils/dimensions";
import { useTheme } from "../hooks/useTheme";
import { Tokens } from "../theme/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MOODS = [
  { id: "happy", emoji: "😊", label: "Feliz", color: Tokens.mood.happy },
  { id: "calm", emoji: "😌", label: "Calma", color: Tokens.mood.calm },
  { id: "energetic", emoji: "⚡", label: "Energica", color: Tokens.mood.energetic },
  { id: "anxious", emoji: "😰", label: "Ansiosa", color: Tokens.mood.anxious },
  { id: "sad", emoji: "😢", label: "Triste", color: Tokens.mood.sad },
  { id: "irritated", emoji: "😤", label: "Irritada", color: Tokens.mood.irritated },
  { id: "sensitive", emoji: "🥺", label: "Sensivel", color: Tokens.mood.sensitive },
  { id: "tired", emoji: "😴", label: "Cansada", color: Tokens.mood.tired },
];

export default function DailyLogScreen({ navigation, route }: RootStackScreenProps<"DailyLog">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const addDailyLog = useCycleStore((s) => s.addDailyLog);

  // Cores dinâmicas do tema
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];
  const textSecondary = isDark ? colors.neutral[300] : colors.neutral[600];

  const today = useMemo(() => {
    if (route.params?.date) {
      return new Date(route.params.date);
    }
    return new Date();
  }, [route.params?.date]);

  const dateStr = today.toISOString().split("T")[0];

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);

  // Slider config - responsive
  const SLIDER_WIDTH = wp(85); // 85% of screen width
  const EMOJI_SIZE = 60;
  const sliderProgress = useSharedValue(0.5);

  const handleMoodSelect = async (moodId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(moodId);
    sliderProgress.value = 0.5;
    setIntensity(50);
  };

  const handleSliderUpdate = (value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    sliderProgress.value = withSpring(clampedValue, { damping: 15 });
    setIntensity(Math.round(clampedValue * 100));

    const percentage = Math.round(clampedValue * 100);
    if (percentage % 25 === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const containerX = (SCREEN_WIDTH - SLIDER_WIDTH) / 2;
        const relativeX = gestureState.moveX - containerX;
        const newValue = relativeX / SLIDER_WIDTH;
        handleSliderUpdate(newValue);
      },
      onPanResponderRelease: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    })
  ).current;

  const emojiAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      sliderProgress.value,
      [0, 1],
      [0, SLIDER_WIDTH - EMOJI_SIZE],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
    };
  });

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(
      sliderProgress.value,
      [0, 1],
      [0, SLIDER_WIDTH],
      Extrapolate.CLAMP
    );
    return { width };
  });

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const log: DailyLog = {
      id: Date.now().toString(),
      date: dateStr,
      symptoms: [],
      mood: selectedMood ? [selectedMood] : [],
      discharge: "none",
      sexActivity: "none",
    };

    addDailyLog(log);
    navigation.goBack();
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const months = [
      "janeiro",
      "fevereiro",
      "marco",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return `${day} de ${months[date.getMonth()]}`;
  };

  const selectedMoodData = MOODS.find((m) => m.id === selectedMood);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.secondary }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? [colors.background.primary, colors.background.secondary, colors.background.tertiary]
              : [colors.primary[50], colors.secondary[50], colors.background.secondary]
          }
          locations={[0, 0.5, 1]}
          style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background.card,
              }}
            >
              <Ionicons name="arrow-back" size={22} color={textMuted} />
            </Pressable>
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={{ color: textMain, fontSize: 20, fontWeight: "600" }}>
                {formatDate(today)}
              </Text>
            </Animated.View>
            <Pressable
              onPress={handleSave}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: colors.primary[500],
              }}
            >
              <Text style={{ color: colors.neutral[0], fontWeight: "600" }}>Salvar</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
        {!selectedMood ? (
          <Animated.View entering={FadeInUp.duration(600)} style={{ alignItems: "center", width: "100%" }}>
            <Text style={{ color: textMain, fontSize: 24, fontWeight: "600", textAlign: "center", marginBottom: 12 }}>
              Como você está hoje?
            </Text>
            <Text style={{ color: textMuted, fontSize: 16, textAlign: "center", marginBottom: 48 }}>
              Toque em um emoji para registrar
            </Text>

            <View className="flex-row flex-wrap justify-center w-full">
              {MOODS.map((mood, index) => (
                <Animated.View
                  key={mood.id}
                  entering={FadeInUp.delay(100 + index * 60).duration(500)}
                  className="w-[23%] items-center mb-6"
                >
                  <Pressable onPress={() => handleMoodSelect(mood.id)} className="items-center">
                    <View
                      className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                      style={{
                        backgroundColor: colors.background.card,
                        shadowColor: colors.neutral[900],
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 32 }}>{mood.emoji}</Text>
                    </View>
                    <Text style={{ color: textSecondary, fontSize: 12, textAlign: "center" }}>{mood.label}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.duration(600)} className="items-center w-full">
            {/* Selected Mood Display */}
            <View
              className="w-32 h-32 rounded-3xl items-center justify-center mb-6"
              style={{
                backgroundColor: colors.background.card,
                shadowColor: selectedMoodData?.color,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
              }}
            >
              <Text style={{ fontSize: 72 }}>{selectedMoodData?.emoji}</Text>
            </View>

            <Text style={{ color: textMain, fontSize: 24, fontWeight: "600", marginBottom: 8 }}>
              {selectedMoodData?.label}
            </Text>

            <Pressable onPress={() => setSelectedMood(null)}>
              <Text style={{ color: textMuted, fontSize: 14, marginBottom: 48 }}>Toque para mudar</Text>
            </Pressable>

            {/* Intensity Slider */}
            <View className="w-full items-center">
              <Text className="text-warmGray-600 text-base mb-8">
                Intensidade: <Text className="font-semibold">{intensity}%</Text>
              </Text>

              {/* Slider Container */}
              <View
                className="rounded-full items-center justify-center"
                style={{
                  width: SLIDER_WIDTH,
                  height: 60,
                  backgroundColor: colors.neutral[100],
                  shadowColor: colors.neutral[900],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                }}
                {...panResponder.panHandlers}
              >
                {/* Progress Bar */}
                <Animated.View
                  style={[
                    progressBarStyle,
                    {
                      position: "absolute",
                      left: 0,
                      height: 60,
                      backgroundColor: `${selectedMoodData?.color}20`,
                      borderRadius: 30,
                    },
                  ]}
                />

                {/* Emoji Slider */}
                <Animated.View
                  style={[
                    emojiAnimatedStyle,
                    {
                      position: "absolute",
                      left: 0,
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: selectedMoodData?.color || Tokens.brand.primary[500],
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: selectedMoodData?.color || Tokens.brand.primary[500],
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 28 }}>{selectedMoodData?.emoji}</Text>
                </Animated.View>
              </View>

              <View className="flex-row justify-between w-full mt-3 px-2">
                <Text className="text-warmGray-400 text-sm">Baixa</Text>
                <Text className="text-warmGray-400 text-sm">Alta</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
