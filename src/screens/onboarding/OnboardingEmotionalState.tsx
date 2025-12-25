/**
 * Tela 4: OnboardingEmotionalState
 * Vídeo da Nath + 5 opções de estado emocional
 * CRÍTICA: Define needsExtraCare flag
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { EMOTIONAL_STATE_OPTIONS } from "../../config/nath-journey-onboarding-data";
import { useTheme } from "../../hooks/useTheme";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { EmotionalState } from "../../types/nath-journey-onboarding.types";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingEmotionalState">;

export default function OnboardingEmotionalState({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage, date, concerns } = route.params;
  const { data, setEmotionalState, canProceed, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingEmotionalState");
  }, [setCurrentScreen]);

  const handleSelectState = (state: EmotionalState) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    setEmotionalState(state);
    logger.info(`Emotional state selected: ${state}`, "OnboardingEmotionalState");
  };

  const handleContinue = () => {
    if (!canProceed()) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    navigation.navigate("OnboardingCheckIn", {
      stage,
      date,
      concerns,
      emotionalState: data.emotionalState!,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface.base,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Text style={[styles.backText, { color: theme.text.secondary }]}>← Voltar</Text>
        </Pressable>
        <ProgressBar currentStep={4} totalSteps={7} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text.primary,
              },
            ]}
          >
            Como você está se sentindo nos últimos dias?
          </Text>

          {/* Emotional State Options - Grid 2x2 */}
          <View style={styles.optionsGrid}>
            {EMOTIONAL_STATE_OPTIONS.map((option, index) => {
              const isSelected = data.emotionalState === option.state;
              return (
                <Animated.View
                  key={option.state}
                  entering={FadeInDown.delay(index * 80).duration(300)}
                  style={styles.optionWrapper}
                >
                  <Pressable
                    onPress={() => handleSelectState(option.state)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      {
                        borderColor: isSelected ? Tokens.brand.accent[300] : theme.colors.border.subtle,
                        backgroundColor: theme.surface.card,
                      },
                    ]}
                    accessibilityLabel={`${option.title}. ${option.response}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    {option.image && (
                      <View style={styles.optionImageContainer}>
                        <Image
                          source={option.image}
                          style={styles.optionImage}
                          contentFit="cover"
                          contentPosition="top"
                        />
                        <LinearGradient
                          colors={["transparent", "rgba(0,0,0,0.4)"]}
                          style={styles.optionImageOverlay}
                        />
                      </View>
                    )}
                    <View style={styles.optionContent}>
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      <Text
                        style={[
                          styles.optionTitle,
                          {
                            color: theme.text.primary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={[
                          styles.optionResponse,
                          {
                            color: theme.text.secondary,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {option.response}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <LinearGradient
                          colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
                          style={styles.checkmarkGradient}
                        >
                          <Text style={styles.checkmarkText}>✓</Text>
                        </LinearGradient>
                      </View>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Microcopy */}
          <Text
            style={[
              styles.microcopy,
              {
                color: theme.text.tertiary,
              },
            ]}
          >
            Isso é só pra eu saber como te ajudar melhor.{"\n"}
            Confidencial. Sem julgamento.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Tokens.spacing.lg,
          },
        ]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!canProceed()}
          style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
          accessibilityLabel="Continuar"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={
              canProceed() ? Tokens.gradients.accent : [Tokens.neutral[300], Tokens.neutral[300]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text
              style={[
                styles.continueButtonText,
                !canProceed() && styles.continueButtonTextDisabled,
              ]}
            >
              Continuar
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.md,
    gap: Tokens.spacing.md,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing["4xl"],
  },
  title: {
    fontSize: Tokens.typography.headlineLarge.fontSize,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    lineHeight: Tokens.typography.headlineLarge.lineHeight,
    marginBottom: Tokens.spacing.xl,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
  },
  optionWrapper: {
    width: "48%",
  },
  optionCard: {
    borderRadius: Tokens.radius.lg, // Bordas mais suaves
    borderWidth: 1.5,
    overflow: "hidden",
    position: "relative",
    ...Tokens.shadows.sm,
  },
  optionCardSelected: {
    borderWidth: 2,
  },
  optionImageContainer: {
    width: "100%",
    height: 100,
    position: "relative",
    backgroundColor: Tokens.neutral[100],
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
  optionImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  optionContent: {
    padding: Tokens.spacing.sm,
    alignItems: "center",
    gap: 2,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: Tokens.typography.labelMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    textAlign: "center",
  },
  optionResponse: {
    fontSize: Tokens.typography.caption.fontSize,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: Tokens.typography.caption.lineHeight,
  },
  checkmark: {
    position: "absolute",
    top: Tokens.spacing.xs,
    right: Tokens.spacing.xs,
  },
  checkmarkGradient: {
    width: 24,
    height: 24,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: Tokens.neutral[0],
    fontSize: 14,
    fontWeight: "bold",
  },
  microcopy: {
    fontSize: Tokens.typography.caption.fontSize,
    textAlign: "center",
    lineHeight: Tokens.typography.caption.lineHeight * 1.5,
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
  },
  continueButton: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  continueButtonText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
  continueButtonTextDisabled: {
    color: Tokens.neutral[500],
  },
});
