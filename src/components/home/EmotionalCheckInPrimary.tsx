/**
 * EmotionalCheckInPrimary - Check-in de 1 toque
 *
 * PRIMÁRIO na hierarquia da Home
 * - 4 opções grandes: Bem, Cansada, Indisposta, Amada
 * - 1 toque = check-in completo
 * - Feedback imediato com mensagem acolhedora
 * - Botão para conversar com NathIA sobre o mood
 * - Animação suave (FadeIn)
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state/store";
import { brand, neutral, surface, spacing, radius, accessibility } from "../../theme/tokens";
import type { MainTabParamList } from "../../types/navigation";

// Aliases de compatibilidade para migração gradual
const SPACING = spacing;
const RADIUS = radius;
const ACCESSIBILITY = accessibility;

// Tipos de mood
type MoodType = "bem" | "cansada" | "indisposta" | "amada";

interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  message: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "bem",
    label: "Bem",
    emoji: "😊",
    message: "Que bom te ver assim. Aproveita esse respiro.",
  },
  {
    id: "cansada",
    label: "Cansada",
    emoji: "🥱",
    message: "Você está fazendo o seu melhor. Isso já é suficiente.",
  },
  {
    id: "indisposta",
    label: "Enjoada",
    emoji: "🤢",
    message: "Vamos com calma. Um passo pequeno já conta.",
  },
  {
    id: "amada",
    label: "Amada",
    emoji: "❤️",
    message: "Que lindo. Guarda esse sentimento com você.",
  },
];

// Componente do botão de mood - com estados visuais fortes
const MoodButton: React.FC<{
  option: MoodOption;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
}> = React.memo(({ option, isSelected, onPress, isDark }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Estados visuais fortes:
  // Selected: bg primary[100], border primary[400], text primary
  // Unselected: bg surface.elevated, border subtle, text muted
  const backgroundColor = isSelected
    ? isDark
      ? brand.primary[800]
      : brand.primary[100]
    : isDark
      ? surface.dark.elevated
      : surface.light.elevated;

  const borderColor = isSelected
    ? isDark
      ? brand.primary[400]
      : brand.primary[400]
    : isDark
      ? neutral[700]
      : neutral[200];

  const textColor = isSelected
    ? isDark
      ? brand.primary[200]
      : brand.primary[700]
    : isDark
      ? neutral[400]
      : neutral[500];

  return (
    <Animated.View style={[styles.moodButtonWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`${option.label} - ${isSelected ? "selecionado" : "não selecionado"}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={[
          styles.moodButton,
          {
            backgroundColor,
            borderColor,
            borderWidth: isSelected ? 2.5 : 1,
          },
        ]}
      >
        <Text style={styles.moodEmoji}>{option.emoji}</Text>
        <Text style={[styles.moodLabel, { color: textColor }]}>{option.label}</Text>
      </Pressable>
    </Animated.View>
  );
});

MoodButton.displayName = "MoodButton";

// Componente principal
export const EmotionalCheckInPrimary: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  // Store
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);

  // Estado local para mood selecionado e feedback
  const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  // Verificar check-in existente ao montar
  React.useEffect(() => {
    const todayCheckIn = getTodayCheckIn();
    if (todayCheckIn?.mood) {
      // Mapear valor numérico para mood
      const moodMap: Record<number, MoodType> = {
        5: "bem",
        4: "amada",
        3: "cansada",
        2: "indisposta",
        1: "indisposta",
      };
      const existingMood = moodMap[todayCheckIn.mood];
      if (existingMood) {
        setSelectedMood(existingMood);
        const option = MOOD_OPTIONS.find((o) => o.id === existingMood);
        if (option) {
          setFeedbackMessage(option.message);
        }
      }
    }
  }, [getTodayCheckIn]);

  // Handler de seleção
  const handleMoodSelect = useCallback(
    async (mood: MoodType) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setSelectedMood(mood);

      // Mapear mood para valor numérico
      const moodValueMap: Record<MoodType, number> = {
        bem: 5,
        amada: 4,
        cansada: 3,
        indisposta: 2,
      };

      setTodayMood(moodValueMap[mood]);

      // Mostrar feedback
      const option = MOOD_OPTIONS.find((o) => o.id === mood);
      if (option) {
        setFeedbackMessage(option.message);
      }
    },
    [setTodayMood]
  );

  // Handler para conversar com NathIA sobre o mood
  const handleTalkAboutMood = useCallback(async () => {
    if (!selectedMood) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant", { emotionalContext: selectedMood });
  }, [selectedMood, navigation]);

  // Cores do tema
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textMain }]}>Como você está agora?</Text>
      </View>

      {/* Mood Buttons Grid - Chips grandes >=44pt */}
      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => (
          <MoodButton
            key={option.id}
            option={option}
            isSelected={selectedMood === option.id}
            onPress={() => handleMoodSelect(option.id)}
            isDark={isDark}
          />
        ))}
      </View>

      {/* Feedback Message + CTA para conversar */}
      {feedbackMessage && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: isDark ? colors.neutral[800] : brand.primary[50],
            },
          ]}
        >
          <Text style={[styles.feedbackText, { color: textMuted }]}>{feedbackMessage}</Text>

          {/* Botão para conversar com NathIA */}
          <Pressable
            onPress={handleTalkAboutMood}
            accessibilityLabel="Conversar com NathIA sobre como você está"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.talkButton,
              {
                backgroundColor: isDark ? brand.accent[500] : brand.accent[400],
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color={neutral[900]} />
            <Text style={styles.talkButtonText}>Conversar sobre isso</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  moodButtonWrapper: {
    flex: 1,
  },
  moodButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    gap: SPACING.xs,
    minHeight: ACCESSIBILITY.minTapTarget, // 44pt mínimo
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    textAlign: "center",
  },
  feedbackContainer: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    textAlign: "center",
    lineHeight: 20,
  },
  talkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    alignSelf: "center",
    minHeight: ACCESSIBILITY.minTapTarget,
  },
  talkButtonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    color: neutral[900],
  },
});

export default EmotionalCheckInPrimary;
