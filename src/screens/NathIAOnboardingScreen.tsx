/**
 * Nossa Maternidade - NathIA Onboarding Flow
 * 5 screens: Phase, Context, Interests, Mood, Preferences
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useNathIAOnboardingStore } from "../state/nathia-onboarding-store";
import { useAppStore } from "../state/store";
import {
  LIFE_STAGE_OPTIONS,
  TRYING_FOCUS_OPTIONS,
  TRIMESTER_OPTIONS,
  BABY_AGE_OPTIONS,
  ROUTINE_OPTIONS,
  AGE_RANGE_OPTIONS,
  INTEREST_OPTIONS,
  MOOD_OPTIONS,
  SENSITIVE_TOPIC_OPTIONS,
  TONE_OPTIONS,
  NOTIFICATION_OPTIONS,
} from "../types/nathia-onboarding";
import { brand, neutral, spacing, radius, typography, surface, gradients } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";

// Compatibility aliases for existing code
const GRADIENTS = gradients;
const COLORS = {
  primary: brand.primary,
  accent: brand.accent,
  neutral: neutral,
  background: {
    primary: surface.light.base,
    card: surface.light.card,
  }
};
const SPACING = spacing;
const RADIUS = radius;
const TYPOGRAPHY = typography;

type Props = RootStackScreenProps<"NathIAOnboarding">;

// Reusable Option Button Component - REDESIGN PREMIUM
const OptionButton = ({
  selected,
  onPress,
  emoji,
  label,
  description,
  style,
}: {
  selected: boolean;
  onPress: () => void;
  emoji?: string;
  label: string;
  description?: string;
  style?: "large" | "medium" | "small";
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onPress();
  };

  const isLarge = style === "large";
  const isSmall = style === "small";

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: selected ? COLORS.primary[50] : COLORS.neutral[0],
          borderRadius: isLarge ? RADIUS.lg : RADIUS.lg,
          padding: isSmall ? SPACING.sm : isLarge ? SPACING.md : SPACING.lg,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? COLORS.primary[500] : COLORS.neutral[200],
          marginBottom: SPACING.sm,
          flexDirection: "row",
          alignItems: "center",
          minHeight: 52,
          shadowColor: selected ? COLORS.primary[500] : "#000",
          shadowOffset: { width: 0, height: selected ? 2 : 1 },
          shadowOpacity: selected ? 0.12 : 0.04,
          shadowRadius: selected ? 6 : 3,
          elevation: selected ? 3 : 1,
        }}
        accessibilityLabel={`${label}${description ? `, ${description}` : ""}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {emoji && (
          <View
            style={{
              width: isLarge ? 36 : 32,
              height: isLarge ? 36 : 32,
              borderRadius: RADIUS.lg,
              backgroundColor: selected ? COLORS.primary[100] : COLORS.neutral[100],
              alignItems: "center",
              justifyContent: "center",
              marginRight: SPACING.sm,
            }}
          >
            <Text
              style={{
                fontSize: isLarge ? 18 : 16,
              }}
            >
              {emoji}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: isLarge
                ? TYPOGRAPHY.bodyMedium.fontSize
                : TYPOGRAPHY.bodySmall.fontSize + 1,
              fontWeight: "600",
              color: selected ? COLORS.primary[700] : COLORS.neutral[800],
              marginBottom: description ? 1 : 0,
            }}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={{
                fontSize: 11,
                color: selected ? COLORS.primary[600] : COLORS.neutral[500],
                lineHeight: 14,
              }}
            >
              {description}
            </Text>
          )}
        </View>
        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={COLORS.primary[500]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

// Multi-select chip component - REDESIGN PREMIUM
const ChipButton = ({
  selected,
  onPress,
  emoji,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  emoji?: string;
  label: string;
}) => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: selected ? COLORS.primary[500] : COLORS.neutral[0],
        borderRadius: RADIUS.full,
        paddingVertical: SPACING.md + 4, // 16px para garantir 44pt+ touch target
        paddingHorizontal: SPACING.xl,
        minHeight: 44, // Apple HIG minimum touch target
        borderWidth: selected ? 0 : 1.5,
        borderColor: COLORS.neutral[200],
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: selected ? COLORS.primary[500] : "#000",
        shadowOffset: { width: 0, height: selected ? 3 : 1 },
        shadowOpacity: selected ? 0.2 : 0.05,
        shadowRadius: selected ? 6 : 2,
        elevation: selected ? 3 : 1,
      }}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {emoji && (
        <Text style={{ fontSize: 18, marginRight: SPACING.xs }}>{emoji}</Text>
      )}
      <Text
        style={{
          fontSize: TYPOGRAPHY.bodyMedium.fontSize,
          fontWeight: "600",
          color: selected ? COLORS.neutral[0] : COLORS.neutral[700],
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

// Progress bar component - REDESIGN PREMIUM
const ProgressBar = ({
  progress,
  onBack,
}: {
  progress: number;
  onBack: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING["2xl"],
        paddingVertical: SPACING.xl,
      }}
    >
      <Pressable
        onPress={onBack}
        style={{
          width: 48,
          height: 48,
          borderRadius: RADIUS.xl,
          backgroundColor: COLORS.neutral[0],
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        }}
        accessibilityLabel="Voltar"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.neutral[700]} />
      </Pressable>
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: COLORS.neutral[200],
          borderRadius: RADIUS.full,
          marginLeft: SPACING.lg,
          overflow: "hidden",
        }}
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: RADIUS.full,
          }}
        >
          <LinearGradient
            colors={[COLORS.primary[400], COLORS.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

// Continue button - REDESIGN PREMIUM
const ContinueButton = ({
  onPress,
  disabled,
  label = "Continuar",
  variant = "primary",
}: {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  variant?: "primary" | "secondary";
}) => {
  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <LinearGradient
        colors={
          isPrimary
            ? [COLORS.primary[400], COLORS.primary[600]]
            : [COLORS.neutral[100], COLORS.neutral[200]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: RADIUS.lg,
          paddingVertical: SPACING.md + 2,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 48,
          shadowColor: isPrimary ? COLORS.primary[500] : "#000",
          shadowOffset: { width: 0, height: isPrimary ? 4 : 2 },
          shadowOpacity: isPrimary ? 0.25 : 0.06,
          shadowRadius: isPrimary ? 8 : 4,
          elevation: isPrimary ? 4 : 2,
        }}
      >
        <Text
          style={{
            color: isPrimary ? COLORS.neutral[0] : COLORS.neutral[700],
            fontSize: TYPOGRAPHY.labelMedium.fontSize,
            fontWeight: "700",
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

// Screen 1: Phase Selection - PREMIUM DESIGN
const PhaseScreen = ({ onNext }: { onNext: () => void }) => {
  const { profile, setNickname, setLifeStage, canProceed } =
    useNathIAOnboardingStore();
  const [localNickname, setLocalNickname] = useState(profile.nickname || "");
  const [nicknameIsFocused, setNicknameIsFocused] = useState(false);

  const handleContinue = () => {
    if (localNickname.trim()) {
      setNickname(localNickname.trim());
    }
    onNext();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.md,
        }}
      >
        {/* Hero Section - Glassmorphism Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            marginBottom: SPACING.xl,
            borderWidth: 1,
            borderColor: "rgba(244, 37, 140, 0.1)",
            shadowColor: COLORS.primary[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {/* Decorative dots */}
          <View
            style={{
              position: "absolute",
              top: SPACING.md,
              right: SPACING.md,
              flexDirection: "row",
              gap: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: COLORS.primary[300],
                  opacity: 0.4,
                }}
              />
            ))}
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "DMSerifDisplay-Regular",
              fontWeight: "400",
              color: COLORS.neutral[900],
              marginBottom: SPACING.sm,
              lineHeight: 30,
              letterSpacing: -0.5,
            }}
          >
            Qual é a sua fase atual, amor? ✨
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyMedium.fontSize,
              color: COLORS.neutral[600],
              lineHeight: 22,
              fontWeight: "400",
            }}
          >
            Vou personalizar toda a sua experiência para este momento tão especial da sua vida
          </Text>
        </Animated.View>

        {/* Nickname Input - Premium Design */}
        <Animated.View
          entering={FadeInUp.delay(250).duration(600)}
          style={{ marginBottom: SPACING.xl }}
        >
          <View
            style={{
              backgroundColor: COLORS.neutral[0],
              borderRadius: RADIUS.xl,
              padding: SPACING.md,
              borderWidth: nicknameIsFocused ? 2 : 1.5,
              borderColor: nicknameIsFocused
                ? COLORS.primary[400]
                : COLORS.neutral[200],
              shadowColor: nicknameIsFocused
                ? COLORS.primary[500]
                : "#000",
              shadowOffset: { width: 0, height: nicknameIsFocused ? 4 : 2 },
              shadowOpacity: nicknameIsFocused ? 0.12 : 0.05,
              shadowRadius: nicknameIsFocused ? 8 : 6,
              elevation: nicknameIsFocused ? 4 : 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.xs,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: RADIUS.full,
                  backgroundColor: COLORS.primary[50],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: SPACING.sm,
                }}
              >
                <Text style={{ fontSize: 16 }}>💖</Text>
              </View>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[800],
                  letterSpacing: -0.2,
                }}
              >
                Como você quer que eu te chame?
              </Text>
            </View>
            <TextInput
              value={localNickname}
              onChangeText={setLocalNickname}
              onFocus={() => setNicknameIsFocused(true)}
              onBlur={() => setNicknameIsFocused(false)}
              placeholder="Ex: Manu, Carol, Lu..."
              placeholderTextColor={COLORS.neutral[400]}
              style={{
                backgroundColor: COLORS.neutral[50],
                borderRadius: RADIUS.lg,
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.sm + 2,
                fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                color: COLORS.neutral[900],
                fontWeight: "500",
                minHeight: 44,
                borderWidth: 0,
              }}
              returnKeyType="done"
            />
            <Text
              style={{
                fontSize: 11,
                color: COLORS.neutral[500],
                marginTop: SPACING.xs,
                fontStyle: "italic",
              }}
            >
              Opcional - pode deixar em branco se preferir
            </Text>
          </View>
        </Animated.View>

        {/* Life Stage Options - Premium Grid */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={{ marginBottom: SPACING.xs }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.md,
              letterSpacing: -0.3,
            }}
          >
            Escolha sua fase atual
          </Text>
          {LIFE_STAGE_OPTIONS.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInUp.delay(450 + index * 80).duration(500)}
            >
              <OptionButton
                selected={profile.life_stage === option.id}
                onPress={() => setLifeStage(option.id)}
                emoji={option.emoji}
                label={option.label}
                description={option.description}
                style="large"
              />
            </Animated.View>
          ))}
        </Animated.View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Continue Button with Blur Background */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.xl,
        }}
      >
        <LinearGradient
          colors={[
            "rgba(247, 251, 253, 0)",
            "rgba(247, 251, 253, 0.95)",
            COLORS.background.primary,
          ]}
          locations={[0, 0.3, 1]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
          }}
        />
        <Animated.View entering={FadeInUp.delay(600).duration(500)}>
          <ContinueButton
            onPress={handleContinue}
            disabled={!canProceed()}
            label="Continuar"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Screen 2: Context (conditional based on life stage)
const ContextScreen = ({ onNext }: { onNext: () => void }) => {
  const { profile, setStageDetail, canProceed } = useNathIAOnboardingStore();
  const [weekApprox, setWeekApprox] = useState<string>(
    profile.stage_detail.week_approx?.toString() || ""
  );

  const renderTryingContent = () => (
    <>
      <Text
        style={{
          fontSize: TYPOGRAPHY.titleSmall.fontSize,
          fontWeight: "600",
          color: COLORS.neutral[700],
          marginBottom: SPACING.lg,
        }}
      >
        Seu foco agora é mais...
      </Text>
      {TRYING_FOCUS_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={profile.stage_detail.trying_focus === option.id}
          onPress={() => setStageDetail({ trying_focus: option.id })}
          label={option.label}
          description={option.description}
        />
      ))}
    </>
  );

  const renderPregnantContent = () => (
    <>
      <Text
        style={{
          fontSize: TYPOGRAPHY.titleSmall.fontSize,
          fontWeight: "600",
          color: COLORS.neutral[700],
          marginBottom: SPACING.lg,
        }}
      >
        Você está em qual fase? 🤰
      </Text>
      {TRIMESTER_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={profile.stage_detail.trimester === option.id}
          onPress={() => setStageDetail({ trimester: option.id })}
          label={option.label}
        />
      ))}

      {profile.stage_detail.trimester &&
        profile.stage_detail.trimester !== "unknown" && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={{ marginTop: SPACING.lg }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.labelMedium.fontSize,
                fontWeight: "600",
                color: COLORS.neutral[600],
                marginBottom: SPACING.sm,
              }}
            >
              Semana aproximada (opcional)
            </Text>
            <TextInput
              value={weekApprox}
              onChangeText={(text) => {
                setWeekApprox(text);
                const num = parseInt(text, 10);
                if (num >= 4 && num <= 42) {
                  setStageDetail({ week_approx: num });
                } else if (text === "") {
                  setStageDetail({ week_approx: null });
                }
              }}
              placeholder="Ex: 20"
              placeholderTextColor={COLORS.neutral[400]}
              keyboardType="number-pad"
              maxLength={2}
              style={{
                backgroundColor: COLORS.neutral[0],
                borderRadius: RADIUS.xl,
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.md,
                fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                color: COLORS.neutral[800],
                borderWidth: 1,
                borderColor: COLORS.neutral[200],
                minHeight: 52,
              }}
            />
          </Animated.View>
        )}
    </>
  );

  const renderPostpartumContent = () => (
    <>
      <Text
        style={{
          fontSize: TYPOGRAPHY.titleSmall.fontSize,
          fontWeight: "600",
          color: COLORS.neutral[700],
          marginBottom: SPACING.lg,
        }}
      >
        Seu bebê tem mais ou menos... 👶
      </Text>
      {BABY_AGE_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={profile.stage_detail.baby_age_bucket === option.id}
          onPress={() => setStageDetail({ baby_age_bucket: option.id })}
          label={option.label}
        />
      ))}

      {profile.stage_detail.baby_age_bucket && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{ marginTop: SPACING["2xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleSmall.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[700],
              marginBottom: SPACING.lg,
            }}
          >
            Como está sua rotina hoje?
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {ROUTINE_OPTIONS.map((option) => (
              <ChipButton
                key={option.id}
                selected={profile.stage_detail.routine === option.id}
                onPress={() => setStageDetail({ routine: option.id })}
                emoji={option.emoji}
                label={option.label}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </>
  );

  const renderLifestyleContent = () => (
    <>
      <Text
        style={{
          fontSize: TYPOGRAPHY.titleSmall.fontSize,
          fontWeight: "600",
          color: COLORS.neutral[700],
          marginBottom: SPACING.lg,
        }}
      >
        Faixa de idade (opcional) 💖
      </Text>
      {AGE_RANGE_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={profile.stage_detail.age_range === option.id}
          onPress={() => setStageDetail({ age_range: option.id })}
          label={option.label}
        />
      ))}
    </>
  );

  const renderContent = () => {
    switch (profile.life_stage) {
      case "trying":
        return renderTryingContent();
      case "pregnant":
        return renderPregnantContent();
      case "postpartum":
        return renderPostpartumContent();
      case "lifestyle":
        return renderLifestyleContent();
      default:
        return null;
    }
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={{ flex: 1, paddingHorizontal: SPACING["2xl"] }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.headlineMedium.fontSize,
                fontWeight: "700",
                color: COLORS.neutral[800],
                marginBottom: SPACING.sm,
                letterSpacing: -0.5,
              }}
            >
              Conta mais pra mim 💬
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                color: COLORS.neutral[500],
                marginBottom: SPACING["2xl"],
              }}
            >
              Assim posso te ajudar melhor
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            {renderContent()}
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: SPACING["2xl"],
            paddingBottom: SPACING["2xl"],
            backgroundColor: COLORS.background.primary,
          }}
        >
          <ContinueButton
            onPress={onNext}
            disabled={!canProceed()}
            label="Continuar"
          />
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

// Screen 3: Interests
const InterestsScreen = ({ onNext }: { onNext: () => void }) => {
  const { profile, toggleInterest } = useNathIAOnboardingStore();

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={{ flex: 1, paddingHorizontal: SPACING["2xl"] }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.headlineMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.sm,
              letterSpacing: -0.5,
            }}
          >
            O que mais te interessa agora? ❤️
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              color: COLORS.neutral[500],
              marginBottom: SPACING["2xl"],
            }}
          >
            Pode marcar várias opções
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          {INTEREST_OPTIONS.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInUp.delay(250 + index * 40).duration(400)}
            >
              <OptionButton
                selected={profile.interests.includes(option.id)}
                onPress={() => toggleInterest(option.id)}
                emoji={option.emoji}
                label={option.label}
              />
            </Animated.View>
          ))}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING["2xl"],
          paddingBottom: SPACING["2xl"],
          backgroundColor: COLORS.background.primary,
        }}
      >
        <ContinueButton onPress={onNext} label="Continuar" />
        <Pressable
          onPress={onNext}
          style={{
            marginTop: SPACING.md,
            alignItems: "center",
            paddingVertical: SPACING.md,
          }}
        >
          <Text
            style={{
              color: COLORS.neutral[500],
              fontSize: TYPOGRAPHY.bodyMedium.fontSize,
            }}
          >
            Pular por agora
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

// Screen 4: Mood + Limits
const MoodScreen = ({ onNext }: { onNext: () => void }) => {
  const {
    profile,
    setMoodToday,
    setMoodNote,
    toggleSensitiveTopic,
    setTonePreference,
  } = useNathIAOnboardingStore();
  const [showMoodNote, setShowMoodNote] = useState(false);

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={{ flex: 1, paddingHorizontal: SPACING["2xl"] }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.headlineMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.sm,
              letterSpacing: -0.5,
            }}
          >
            Como você se sente hoje? 😊
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              color: COLORS.neutral[500],
              marginBottom: SPACING["2xl"],
            }}
          >
            Isso me ajuda a ajustar meu tom
          </Text>
        </Animated.View>

        {/* Mood selection */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {MOOD_OPTIONS.map((option) => (
              <ChipButton
                key={option.id}
                selected={profile.mood_today === option.id}
                onPress={() => {
                  setMoodToday(option.id);
                  if (option.id === "other") {
                    setShowMoodNote(true);
                  }
                }}
                emoji={option.emoji}
                label={option.label}
              />
            ))}
          </View>

          {(showMoodNote || profile.mood_today === "other") && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={{ marginTop: SPACING.lg }}
            >
              <TextInput
                value={profile.mood_note || ""}
                onChangeText={setMoodNote}
                placeholder="Conta mais como você está..."
                placeholderTextColor={COLORS.neutral[400]}
                multiline
                style={{
                  backgroundColor: COLORS.neutral[0],
                  borderRadius: RADIUS.xl,
                  paddingHorizontal: SPACING.lg,
                  paddingVertical: SPACING.md,
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  color: COLORS.neutral[800],
                  borderWidth: 1,
                  borderColor: COLORS.neutral[200],
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Sensitive topics */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={{ marginTop: SPACING["3xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleSmall.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[700],
              marginBottom: SPACING.sm,
            }}
          >
            Tem algum tema sensível pra você?
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodySmall.fontSize,
              color: COLORS.neutral[500],
              marginBottom: SPACING.lg,
            }}
          >
            Vou evitar esses assuntos (opcional)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {SENSITIVE_TOPIC_OPTIONS.map((option) => (
              <ChipButton
                key={option.id}
                selected={profile.sensitive_topics.includes(option.id)}
                onPress={() => toggleSensitiveTopic(option.id)}
                label={option.label}
              />
            ))}
          </View>
        </Animated.View>

        {/* Tone preference */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={{ marginTop: SPACING["3xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleSmall.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[700],
              marginBottom: SPACING.lg,
            }}
          >
            Você prefere que eu seja mais...
          </Text>
          {TONE_OPTIONS.map((option) => (
            <OptionButton
              key={option.id}
              selected={profile.tone_pref === option.id}
              onPress={() => setTonePreference(option.id)}
              label={option.label}
              description={option.description}
              style="small"
            />
          ))}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING["2xl"],
          paddingBottom: SPACING["2xl"],
          backgroundColor: COLORS.background.primary,
        }}
      >
        <ContinueButton onPress={onNext} label="Continuar" />
      </View>
    </Animated.View>
  );
};

// Screen 5: Preferences & Consent
const PreferencesScreen = ({ onComplete }: { onComplete: () => void }) => {
  const {
    profile,
    setNotificationsPref,
    setAllowBrandRecos,
    setHealthConnectInterest,
    completeOnboarding,
  } = useNathIAOnboardingStore();

  const handleComplete = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    onComplete();
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={{ flex: 1, paddingHorizontal: SPACING["2xl"] }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.headlineMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.sm,
              letterSpacing: -0.5,
            }}
          >
            Últimos ajustes ✨
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyLarge.fontSize,
              color: COLORS.neutral[500],
              marginBottom: SPACING["2xl"],
            }}
          >
            Você pode mudar isso depois
          </Text>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleSmall.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[700],
              marginBottom: SPACING.lg,
            }}
          >
            Quer receber notificações? 🔔
          </Text>
          {NOTIFICATION_OPTIONS.map((option) => (
            <OptionButton
              key={option.id}
              selected={profile.notifications_pref === option.id}
              onPress={() => setNotificationsPref(option.id)}
              label={option.label}
              description={option.description}
              style="small"
            />
          ))}
        </Animated.View>

        {/* Brand recommendations */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={{ marginTop: SPACING["2xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleSmall.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[700],
              marginBottom: SPACING.sm,
            }}
          >
            Recomendações de produtos 🛍️
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodySmall.fontSize,
              color: COLORS.neutral[500],
              marginBottom: SPACING.lg,
            }}
          >
            Aceita sugestões de produtos quando fizer sentido?
          </Text>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <Pressable
              onPress={() => setAllowBrandRecos(true)}
              style={{
                flex: 1,
                backgroundColor: profile.allow_brand_recos
                  ? COLORS.primary[50]
                  : COLORS.neutral[0],
                borderRadius: RADIUS.xl,
                padding: SPACING.lg,
                borderWidth: 2,
                borderColor: profile.allow_brand_recos
                  ? COLORS.primary[500]
                  : COLORS.neutral[200],
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  fontWeight: "600",
                  color: profile.allow_brand_recos
                    ? COLORS.primary[700]
                    : COLORS.neutral[700],
                }}
              >
                Sim
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAllowBrandRecos(false)}
              style={{
                flex: 1,
                backgroundColor: !profile.allow_brand_recos
                  ? COLORS.primary[50]
                  : COLORS.neutral[0],
                borderRadius: RADIUS.xl,
                padding: SPACING.lg,
                borderWidth: 2,
                borderColor: !profile.allow_brand_recos
                  ? COLORS.primary[500]
                  : COLORS.neutral[200],
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  fontWeight: "600",
                  color: !profile.allow_brand_recos
                    ? COLORS.primary[700]
                    : COLORS.neutral[700],
                }}
              >
                Não
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Health Connect (future feature) */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={{ marginTop: SPACING["2xl"] }}
        >
          <View
            style={{
              backgroundColor: COLORS.neutral[50],
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: COLORS.neutral[200],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.sm,
              }}
            >
              <Ionicons
                name="fitness-outline"
                size={20}
                color={COLORS.neutral[500]}
              />
              <Text
                style={{
                  fontSize: TYPOGRAPHY.titleSmall.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[600],
                  marginLeft: SPACING.sm,
                }}
              >
                Apple Health / Health Connect
              </Text>
            </View>
            <Text
              style={{
                fontSize: TYPOGRAPHY.bodySmall.fontSize,
                color: COLORS.neutral[500],
                marginBottom: SPACING.md,
              }}
            >
              Pode ajudar no controle de passos, sono e energia.
            </Text>
            <View style={{ flexDirection: "row", gap: SPACING.md }}>
              <ChipButton
                selected={profile.health_connect_interest}
                onPress={() => setHealthConnectInterest(true)}
                label="Tenho interesse"
              />
              <ChipButton
                selected={!profile.health_connect_interest}
                onPress={() => setHealthConnectInterest(false)}
                label="Agora não"
              />
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: SPACING["2xl"],
          paddingBottom: SPACING["2xl"],
          backgroundColor: COLORS.background.primary,
        }}
      >
        <ContinueButton onPress={handleComplete} label="Vamos começar! 🎉" />
      </View>
    </Animated.View>
  );
};

// Main Onboarding Screen
export default function NathIAOnboardingScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();
  const { currentStep, nextStep, prevStep, getProgress } =
    useNathIAOnboardingStore();

  // Get legacy onboarding store to mark as complete
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const setUser = useAppStore((s) => s.setUser);

  const handleComplete = () => {
    // Get NathIA profile data
    const nathiaProfile = useNathIAOnboardingStore.getState().profile;

    // Create user profile from NathIA onboarding data
    setUser({
      id: Date.now().toString(),
      name: nathiaProfile.nickname || "Mãe",
      stage: nathiaProfile.life_stage === "pregnant" ? "pregnant"
           : nathiaProfile.life_stage === "postpartum" ? "postpartum"
           : "trying",
      interests: [],
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    });

    // Mark legacy onboarding as complete to skip duplicate screens
    setOnboardingComplete(true);
  };

  const handleBack = () => {
    if (currentStep === "phase") {
      // Can"t go back from first screen
      return;
    }
    prevStep();
  };

  const handleNext = () => {
    nextStep();
  };

  const renderScreen = () => {
    switch (currentStep) {
      case "phase":
        return <PhaseScreen onNext={handleNext} />;
      case "context":
        return <ContextScreen onNext={handleNext} />;
      case "interests":
        return <InterestsScreen onNext={handleNext} />;
      case "mood":
        return <MoodScreen onNext={handleNext} />;
      case "preferences":
        return <PreferencesScreen onComplete={handleComplete} />;
      default:
        return <PhaseScreen onNext={handleNext} />;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background.primary,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <LinearGradient
        colors={[GRADIENTS.nathiaOnboarding[0], GRADIENTS.nathiaOnboarding[1], COLORS.background.primary]}
        locations={[0, 0.3, 1]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 300,
        }}
      />

      {/* Progress bar (not shown on first screen) */}
      {currentStep !== "phase" && (
        <ProgressBar progress={getProgress()} onBack={handleBack} />
      )}

      {/* Screen content */}
      <View
        style={{ flex: 1, paddingTop: currentStep === "phase" ? SPACING["3xl"] : 0 }}
      >
        {renderScreen()}
      </View>
    </View>
  );
}
