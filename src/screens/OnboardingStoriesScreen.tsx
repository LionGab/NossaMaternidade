/**
 * OnboardingStoriesScreen - "Jornada da Nath" Stories Format
 *
 * DESIGN CONCEPT:
 * - Instagram/WhatsApp Stories-style navigation
 * - Cinematic, editorial aesthetic
 * - Intimate conversation with Nathalia
 * - 5 core questions + Episode 0 reward
 *
 * AESTHETIC:
 * - Full-screen immersive experience
 * - Gradient transitions: Rose → Lavender → Blue
 * - Bold typography with character
 * - Smooth page transitions
 * - Warm, nurturing, welcoming
 *
 * EXPO GO COMPATIBLE - No native modules requiring builds
 *
 * @version 1.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback, useMemo } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAppStore } from "../state/store";
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";
import { logger } from "../utils/logger";
import { brand } from "../theme/tokens";
import { PregnancyStage, Interest } from "../types/navigation";

// ============================================
// DESIGN SYSTEM - Jornada da Nath
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Story gradients - each slide has its own vibe
const STORY_GRADIENTS = {
  welcome: ["#1A1A2E", "#16213E", "#0F3460"] as const,
  moment: ["#2D1B4E", "#462B7C", "#5B3A9B"] as const,
  date: ["#3D2B54", "#5C3D7A", "#7B4F9F"] as const,
  objectives: ["#1E3A5F", "#2E5A8F", "#3E7ABF"] as const,
  emotional: ["#4A2040", "#6B3060", "#8C4080"] as const,
  checkIn: ["#1F4E5F", "#2F6E8F", "#3F8EAF"] as const,
  reward: ["#0D0D0D", "#1A1A1A", "#2D2D2D"] as const,
};

// Typography - Editorial, bold, memorable
const FONTS = {
  display: "Manrope_800ExtraBold",
  headline: "Manrope_700Bold",
  body: "Manrope_500Medium",
  accent: "Manrope_600SemiBold",
  light: "Manrope_400Regular",
};

// Story slide type
type StorySlide =
  | "welcome"
  | "moment"
  | "date"
  | "objectives"
  | "emotional"
  | "checkIn"
  | "reward";

const SLIDES_ORDER: StorySlide[] = [
  "welcome",
  "moment",
  "date",
  "objectives",
  "emotional",
  "checkIn",
  "reward",
];

// Moment options (replaces stage)
const MOMENT_OPTIONS: {
  id: PregnancyStage;
  emoji: string;
  label: string;
  subtitle: string;
}[] = [
  { id: "trying", emoji: "🌱", label: "Tentando engravidar", subtitle: "Cada ciclo é uma nova esperança" },
  { id: "pregnant", emoji: "🤰", label: "Gestante", subtitle: "A vida crescendo dentro de você" },
  { id: "postpartum", emoji: "💜", label: "Puerpério", subtitle: "Os primeiros dias são intensos" },
];

// Objectives options
const OBJECTIVE_OPTIONS: { id: Interest; emoji: string; label: string }[] = [
  { id: "nutrition", emoji: "🥗", label: "Alimentação" },
  { id: "exercise", emoji: "🧘", label: "Movimento" },
  { id: "mental_health", emoji: "🧠", label: "Mente" },
  { id: "baby_care", emoji: "👶", label: "Bebê" },
  { id: "breastfeeding", emoji: "🤱", label: "Amamentação" },
  { id: "sleep", emoji: "🌙", label: "Sono" },
  { id: "relationships", emoji: "💑", label: "Relacionamentos" },
  { id: "career", emoji: "✨", label: "Propósito" },
];

// Emotional state options
const EMOTIONAL_OPTIONS: { id: string; emoji: string; label: string; color: string }[] = [
  { id: "peaceful", emoji: "😌", label: "Em paz", color: "#86EFAC" },
  { id: "anxious", emoji: "😰", label: "Ansiosa", color: "#FDE68A" },
  { id: "excited", emoji: "🤩", label: "Animada", color: "#F9A8D4" },
  { id: "tired", emoji: "😴", label: "Cansada", color: "#BAE6FD" },
  { id: "overwhelmed", emoji: "🥺", label: "Sobrecarregada", color: "#DDD6FE" },
  { id: "hopeful", emoji: "🌟", label: "Esperançosa", color: "#FED7AA" },
];

// Check-in time options
const CHECKIN_OPTIONS: { id: string; emoji: string; label: string; time: string }[] = [
  { id: "morning", emoji: "🌅", label: "Manhã", time: "Acordar com calma" },
  { id: "afternoon", emoji: "☀️", label: "Tarde", time: "Pausa do dia" },
  { id: "evening", emoji: "🌙", label: "Noite", time: "Antes de dormir" },
];

// 7-day plan items for Episode 0
const SEVEN_DAY_PLAN = [
  { day: 1, title: "Conhecendo você", icon: "heart" as const },
  { day: 2, title: "Primeiro check-in", icon: "sunny" as const },
  { day: 3, title: "Afirmação diária", icon: "sparkles" as const },
  { day: 4, title: "Hábito de ouro", icon: "star" as const },
  { day: 5, title: "Comunidade", icon: "people" as const },
  { day: 6, title: "NathIA", icon: "chatbubble-ellipses" as const },
  { day: 7, title: "Celebração", icon: "trophy" as const },
];

// ============================================
// COMPONENTS
// ============================================

// Progress bar at top (Stories style)
const StoryProgressBar: React.FC<{
  currentSlide: number;
  totalSlides: number;
  progress: number;
}> = React.memo(({ currentSlide, totalSlides, progress }) => {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View key={index} style={styles.progressSegment}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  index < currentSlide
                    ? "100%"
                    : index === currentSlide
                      ? `${progress * 100}%`
                      : "0%",
                backgroundColor:
                  index <= currentSlide
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.25)",
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
});

StoryProgressBar.displayName = "StoryProgressBar";

// Selection card with glow effect
const SelectionCard: React.FC<{
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
  subtitle?: string;
  variant?: "large" | "compact";
}> = React.memo(({ selected, onPress, emoji, label, subtitle, variant = "large" }) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    glow.value = withSpring(selected ? 1 : 0, { damping: 15 });
  }, [selected, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, 0.6]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.8, 1.1]) }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onPress();
  };

  const isCompact = variant === "compact";

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.cardGlow,
            glowStyle,
            isCompact && styles.cardGlowCompact,
          ]}
        />
        <View
          style={[
            styles.selectionCard,
            isCompact && styles.selectionCardCompact,
            selected && styles.selectionCardSelected,
          ]}
        >
          <Text style={[styles.cardEmoji, isCompact && styles.cardEmojiCompact]}>
            {emoji}
          </Text>
          <View style={isCompact ? styles.cardContentCompact : styles.cardContent}>
            <Text
              style={[
                styles.cardLabel,
                isCompact && styles.cardLabelCompact,
                selected && styles.cardLabelSelected,
              ]}
            >
              {label}
            </Text>
            {subtitle && !isCompact && (
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            )}
          </View>
          {selected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
});

SelectionCard.displayName = "SelectionCard";

// Chip for multi-select
const ObjectiveChip: React.FC<{
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
}> = React.memo(({ selected, onPress, emoji, label }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.9, { duration: 60 }),
      withSpring(1, { damping: 15 })
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <View style={[styles.chip, selected && styles.chipSelected]}>
          <Text style={styles.chipEmoji}>{emoji}</Text>
          <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});

ObjectiveChip.displayName = "ObjectiveChip";

// CTA Button with glow
const StoryButton: React.FC<{
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}> = React.memo(({ label, onPress, disabled, variant = "primary" }) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    if (!disabled && variant === "primary") {
      const pulse = () => {
        glow.value = withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        );
      };
      pulse();
      const interval = setInterval(pulse, 2400);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [disabled, variant, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.7]),
    shadowRadius: interpolate(glow.value, [0, 1], [8, 20]),
  }));

  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onPress();
  };

  const isPrimary = variant === "primary";

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={[animatedStyle, isPrimary && glowStyle]}>
        {isPrimary ? (
          <LinearGradient
            colors={
              disabled
                ? ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]
                : [brand.accent[400], brand.accent[500], brand.accent[600]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ctaButton, disabled && styles.ctaButtonDisabled]}
          >
            <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>
              {label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
});

StoryButton.displayName = "StoryButton";

// Nath Avatar with speech bubble
const NathSpeaks: React.FC<{ message: string; delay?: number }> = React.memo(
  ({ message, delay = 0 }) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(delay).duration(500).springify()}
        style={styles.nathContainer}
      >
        <View style={styles.nathAvatarWrap}>
          <Image
            source={require("../../assets/nathalia-avatar.jpg")}
            style={styles.nathAvatar}
            contentFit="cover"
          />
          <View style={styles.nathOnline} />
        </View>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{message}</Text>
          <View style={styles.speechTail} />
        </View>
      </Animated.View>
    );
  }
);

NathSpeaks.displayName = "NathSpeaks";

// Episode 0 reveal card
const EpisodeCard: React.FC<{ day: number; title: string; icon: string; delay: number }> =
  React.memo(({ day, title, icon, delay }) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).duration(400).springify()}
        style={styles.episodeCard}
      >
        <View style={styles.episodeDay}>
          <Text style={styles.episodeDayText}>{day}</Text>
        </View>
        <View style={styles.episodeContent}>
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={18}
            color={brand.accent[400]}
          />
          <Text style={styles.episodeTitle}>{title}</Text>
        </View>
        <View style={styles.episodeLock}>
          <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.4)" />
        </View>
      </Animated.View>
    );
  });

EpisodeCard.displayName = "EpisodeCard";

// ============================================
// MAIN SCREEN
// ============================================

export default function OnboardingStoriesScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Store - App store for user data
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const updateUser = useAppStore((s) => s.updateUser);

  // Store - Nath Journey store for onboarding state
  const completeNathJourneyOnboarding = useNathJourneyOnboardingStore(
    (s) => s.completeOnboarding
  );

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [moment, setMoment] = useState<PregnancyStage | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [objectives, setObjectives] = useState<Interest[]>([]);
  const [emotional, setEmotional] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current slide data
  const currentSlideKey = SLIDES_ORDER[currentSlide];
  const totalSlides = SLIDES_ORDER.length;

  // Navigation
  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      // Skip date if trying
      if (SLIDES_ORDER[currentSlide + 1] === "date" && moment === "trying") {
        setCurrentSlide((prev) => prev + 2);
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
      setSlideProgress(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentSlide, totalSlides, moment]);

  const goBack = useCallback(() => {
    if (currentSlide > 0) {
      // Skip date if trying
      if (SLIDES_ORDER[currentSlide - 1] === "date" && moment === "trying") {
        setCurrentSlide((prev) => prev - 2);
      } else {
        setCurrentSlide((prev) => prev - 1);
      }
      setSlideProgress(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentSlide, moment]);

  // Toggle objective
  const toggleObjective = (id: Interest) => {
    setObjectives((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Complete onboarding
  const handleCompleteOnboarding = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Update user profile in app store
      updateUser({
        name: name || "Mamãe",
        stage: moment || "pregnant",
        dueDate: moment === "pregnant" ? date?.toISOString() : undefined,
        babyBirthDate: moment === "postpartum" ? date?.toISOString() : undefined,
        interests: objectives,
        hasCompletedOnboarding: true,
      });

      // Mark Nath Journey onboarding as complete (triggers navigation)
      completeNathJourneyOnboarding();

      // Mark legacy onboarding as complete
      setOnboardingComplete(true);

      logger.info("Stories onboarding completed", "OnboardingStories", {
        name,
        moment,
        objectives: objectives.length,
        emotional,
        checkInTime,
      });
    } catch (error) {
      logger.error("Onboarding error", "OnboardingStories", error as Error);
      // Still mark as complete to avoid blocking user
      completeNathJourneyOnboarding();
      setOnboardingComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Can proceed?
  const canProceed = useMemo(() => {
    switch (currentSlideKey) {
      case "welcome":
        return true;
      case "moment":
        return moment !== null;
      case "date":
        return date !== null;
      case "objectives":
        return objectives.length >= 1;
      case "emotional":
        return emotional !== null;
      case "checkIn":
        return checkInTime !== null;
      case "reward":
        return true;
      default:
        return false;
    }
  }, [currentSlideKey, moment, date, objectives, emotional, checkInTime]);

  // Gesture handlers for Stories navigation
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const x = event.x;
      // Tap left third = go back, right two-thirds = go next
      if (x < SCREEN_WIDTH * 0.3) {
        runOnJS(goBack)();
      } else if (canProceed && currentSlideKey !== "reward") {
        runOnJS(goNext)();
      }
    });

  // Date picker handler
  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Get gradient for current slide
  const currentGradient = STORY_GRADIENTS[currentSlideKey] || STORY_GRADIENTS.welcome;

  // Render slide content
  const renderSlideContent = () => {
    switch (currentSlideKey) {
      case "welcome":
        return (
          <View style={styles.slideContent}>
            <Animated.View
              entering={FadeIn.delay(100).duration(600)}
              style={styles.welcomeHeader}
            >
              <Image
                source={require("../../assets/nathalia-avatar.jpg")}
                style={styles.welcomeAvatar}
                contentFit="cover"
              />
              <View style={styles.welcomeOnline} />
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(200).duration(500)}
              style={styles.welcomeTitle}
            >
              Oi, eu sou a{"\n"}Nathalia Valente
            </Animated.Text>

            <Animated.Text
              entering={FadeInUp.delay(350).duration(500)}
              style={styles.welcomeSubtitle}
            >
              Vou te guiar nessa jornada incrível da maternidade.
              Vamos começar com algumas perguntas?
            </Animated.Text>

            <Animated.View
              entering={FadeInUp.delay(500).duration(500)}
              style={styles.welcomeFeatures}
            >
              {[
                { icon: "sparkles", text: "5 perguntas rápidas" },
                { icon: "time", text: "Menos de 2 minutos" },
                { icon: "heart", text: "Experiência personalizada" },
              ].map((item, index) => (
                <View key={index} style={styles.welcomeFeature}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={brand.accent[400]}
                  />
                  <Text style={styles.welcomeFeatureText}>{item.text}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Name input */}
            <Animated.View
              entering={FadeInUp.delay(650).duration(500)}
              style={styles.nameInputContainer}
            >
              <Text style={styles.nameLabel}>Como posso te chamar?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome ou apelido"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.nameInput}
                autoCapitalize="words"
              />
            </Animated.View>
          </View>
        );

      case "moment":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks
              message={`${name || "Querida"}, em que momento da sua jornada você está?`}
            />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.optionsContainer}
            >
              {MOMENT_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(400 + index * 100).duration(400)}
                >
                  <SelectionCard
                    selected={moment === option.id}
                    onPress={() => setMoment(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                    subtitle={option.subtitle}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "date":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks
              message={
                moment === "pregnant"
                  ? "Qual a data prevista para conhecer seu bebê?"
                  : "Quando seu bebê chegou ao mundo?"
              }
            />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.dateContainer}
            >
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Ionicons
                  name="calendar"
                  size={24}
                  color={date ? brand.accent[400] : "rgba(255,255,255,0.5)"}
                />
                <Text
                  style={[
                    styles.dateText,
                    date && styles.dateTextSelected,
                  ]}
                >
                  {date
                    ? date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Toque para selecionar"}
                </Text>
              </Pressable>

              {date && (
                <Animated.View
                  entering={FadeIn.duration(300)}
                  style={styles.dateInfo}
                >
                  <Ionicons name="information-circle" size={18} color={brand.accent[300]} />
                  <Text style={styles.dateInfoText}>
                    {moment === "pregnant"
                      ? `Faltam ${Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias!`
                      : `${Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))} dias de vida!`}
                  </Text>
                </Animated.View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={
                    moment === "pregnant" ? new Date() : new Date(2020, 0, 1)
                  }
                  maximumDate={
                    moment === "pregnant"
                      ? new Date(Date.now() + 300 * 24 * 60 * 60 * 1000)
                      : new Date()
                  }
                  textColor="#FFFFFF"
                />
              )}
            </Animated.View>
          </View>
        );

      case "objectives":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="O que você quer cuidar nessa fase?" delay={0} />

            <Animated.Text
              entering={FadeInUp.delay(200).duration(400)}
              style={styles.objectivesHint}
            >
              Escolha quantos quiser
            </Animated.Text>

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.chipsContainer}
            >
              {OBJECTIVE_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(350 + index * 50).duration(300)}
                >
                  <ObjectiveChip
                    selected={objectives.includes(option.id)}
                    onPress={() => toggleObjective(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "emotional":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="Como você está se sentindo agora?" />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.emotionalGrid}
            >
              {EMOTIONAL_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(350 + index * 60).duration(300)}
                  style={styles.emotionalItem}
                >
                  <Pressable
                    onPress={() => {
                      setEmotional(option.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    style={[
                      styles.emotionalCard,
                      emotional === option.id && {
                        borderColor: option.color,
                        backgroundColor: `${option.color}20`,
                      },
                    ]}
                  >
                    <Text style={styles.emotionalEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.emotionalLabel,
                        emotional === option.id && { color: option.color },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "checkIn":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="Qual o melhor momento para eu te lembrar de cuidar de você?" />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.checkInContainer}
            >
              {CHECKIN_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(350 + index * 100).duration(400)}
                >
                  <SelectionCard
                    selected={checkInTime === option.id}
                    onPress={() => setCheckInTime(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                    subtitle={option.time}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "reward":
        return (
          <View style={styles.rewardContent}>
            <Animated.View
              entering={FadeIn.delay(100).duration(800)}
              style={styles.rewardHeader}
            >
              <Text style={styles.episodeLabel}>EPISÓDIO 0</Text>
              <Text style={styles.rewardTitle}>Sua Jornada{"\n"}Começa Agora</Text>
              <Text style={styles.rewardSubtitle}>
                Prepare-se para 7 dias de descobertas
              </Text>
            </Animated.View>

            <ScrollView
              style={styles.episodeList}
              contentContainerStyle={styles.episodeListContent}
              showsVerticalScrollIndicator={false}
            >
              {SEVEN_DAY_PLAN.map((item, index) => (
                <EpisodeCard
                  key={item.day}
                  day={item.day}
                  title={item.title}
                  icon={item.icon}
                  delay={300 + index * 80}
                />
              ))}
            </ScrollView>

            <Animated.View
              entering={FadeInUp.delay(900).duration(500)}
              style={styles.rewardFooter}
            >
              <View style={styles.rewardBadge}>
                <Ionicons name="gift" size={20} color={brand.accent[400]} />
                <Text style={styles.rewardBadgeText}>
                  Desbloqueie missões para personalizar ainda mais!
                </Text>
              </View>
            </Animated.View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient colors={currentGradient} style={styles.gradient}>
        <GestureDetector gesture={tapGesture}>
          <View style={styles.storyContainer}>
            {/* Progress bar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
              <StoryProgressBar
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                progress={slideProgress}
              />
            </View>

            {/* Close button (back on first slide) */}
            {currentSlide > 0 && currentSlideKey !== "reward" && (
              <Pressable
                onPress={goBack}
                style={[styles.backButton, { top: insets.top + 40 }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.9)" />
              </Pressable>
            )}

            {/* Content */}
            <Animated.View
              key={currentSlideKey}
              entering={SlideInRight.duration(300).springify()}
              exiting={SlideOutLeft.duration(200)}
              style={styles.contentContainer}
            >
              {renderSlideContent()}
            </Animated.View>

            {/* CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
              <StoryButton
                label={
                  currentSlideKey === "reward"
                    ? isSubmitting
                      ? "Preparando..."
                      : "Começar minha jornada"
                    : "Continuar"
                }
                onPress={currentSlideKey === "reward" ? handleCompleteOnboarding : goNext}
                disabled={!canProceed || isSubmitting}
              />

              {currentSlideKey !== "welcome" && currentSlideKey !== "reward" && (
                <Text style={styles.tapHint}>
                  Toque na esquerda para voltar
                </Text>
              )}
            </View>
          </View>
        </GestureDetector>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  storyContainer: {
    flex: 1,
  },

  // Header & Progress
  header: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
  },

  // Back button
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  slideContent: {
    flex: 1,
    paddingTop: 24,
  },

  // Welcome
  welcomeHeader: {
    alignSelf: "center",
    marginBottom: 24,
  },
  welcomeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: brand.accent[400],
  },
  welcomeOnline: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#1A1A2E",
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: FONTS.display,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  welcomeFeatures: {
    marginTop: 32,
    gap: 12,
  },
  welcomeFeature: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  welcomeFeatureText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: "rgba(255,255,255,0.9)",
  },
  nameInputContainer: {
    marginTop: 32,
  },
  nameLabel: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
    textAlign: "center",
  },
  nameInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: FONTS.body,
    color: "#FFF",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // Nath speaks
  nathContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  nathAvatarWrap: {
    marginRight: 12,
  },
  nathAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: brand.accent[400],
  },
  nathOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#2D1B4E",
  },
  speechBubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 16,
    position: "relative",
  },
  speechText: {
    fontSize: 17,
    fontFamily: FONTS.body,
    color: "#FFF",
    lineHeight: 24,
  },
  speechTail: {
    position: "absolute",
    top: 14,
    left: -8,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: "transparent",
    borderBottomWidth: 8,
    borderBottomColor: "transparent",
    borderRightWidth: 8,
    borderRightColor: "rgba(255,255,255,0.12)",
  },

  // Options
  optionsContainer: {
    gap: 12,
  },

  // Selection card
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectionCardCompact: {
    padding: 14,
    borderRadius: 16,
  },
  selectionCardSelected: {
    borderColor: brand.accent[400],
    backgroundColor: "rgba(244,37,140,0.15)",
  },
  cardGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    backgroundColor: brand.accent[500],
  },
  cardGlowCompact: {
    borderRadius: 20,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  cardEmojiCompact: {
    fontSize: 24,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardContentCompact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 17,
    fontFamily: FONTS.headline,
    color: "#FFF",
  },
  cardLabelCompact: {
    fontSize: 15,
  },
  cardLabelSelected: {
    color: brand.accent[300],
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
  },

  // Date
  dateContainer: {
    alignItems: "center",
    gap: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: "rgba(255,255,255,0.5)",
  },
  dateTextSelected: {
    color: "#FFF",
    fontFamily: FONTS.accent,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(244,37,140,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateInfoText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: brand.accent[300],
  },

  // Objectives
  objectivesHint: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginBottom: 20,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "rgba(244,37,140,0.2)",
    borderColor: brand.accent[400],
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: "rgba(255,255,255,0.9)",
  },
  chipLabelSelected: {
    color: brand.accent[300],
  },

  // Emotional
  emotionalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  emotionalItem: {
    width: "30%",
  },
  emotionalCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emotionalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emotionalLabel: {
    fontSize: 12,
    fontFamily: FONTS.accent,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },

  // Check-in
  checkInContainer: {
    gap: 12,
  },

  // Reward
  rewardContent: {
    flex: 1,
    paddingTop: 16,
  },
  rewardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  episodeLabel: {
    fontSize: 12,
    fontFamily: FONTS.headline,
    color: brand.accent[400],
    letterSpacing: 2,
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 36,
    fontFamily: FONTS.display,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -1,
  },
  rewardSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
  },
  episodeList: {
    flex: 1,
  },
  episodeListContent: {
    gap: 10,
    paddingHorizontal: 4,
  },
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  episodeDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  episodeDayText: {
    fontSize: 14,
    fontFamily: FONTS.headline,
    color: "rgba(255,255,255,0.9)",
  },
  episodeContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  episodeTitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: "rgba(255,255,255,0.9)",
  },
  episodeLock: {
    padding: 8,
  },
  rewardFooter: {
    paddingTop: 16,
  },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,37,140,0.15)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  rewardBadgeText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body,
    color: brand.accent[300],
    lineHeight: 18,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  ctaButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: brand.accent[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonDisabled: {
    shadowOpacity: 0,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: FONTS.headline,
    color: "#FFF",
  },
  ctaTextDisabled: {
    color: "rgba(255,255,255,0.5)",
  },
  secondaryButton: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  secondaryText: {
    fontSize: 15,
    fontFamily: FONTS.accent,
    color: "rgba(255,255,255,0.9)",
  },
  tapHint: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginTop: 12,
  },
});
