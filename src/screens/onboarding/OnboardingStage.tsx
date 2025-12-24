/**
 * Tela 1: OnboardingStage
 * Timeline vertical com 6 cards de estágio
 * Seleção única com foto + título + frase da Nath
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { StageCard } from "../../components/onboarding/StageCard";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { STAGE_CARDS } from "../../config/nath-journey-onboarding-data";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { RootStackScreenProps } from "../../types/navigation";
import { OnboardingStage as StageType } from "../../types/nath-journey-onboarding.types";

type Props = RootStackScreenProps<"OnboardingStage">;

export default function OnboardingStage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data, setStage, canProceed, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingStage");
  }, [setCurrentScreen]);

  const handleSelectStage = async (stage: StageType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStage(stage);
    logger.info(`Stage selected: ${stage}`, "OnboardingStage");
  };

  const handleContinue = async () => {
    if (!canProceed()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logger.info("Continuing to date screen", "OnboardingStage");
    navigation.navigate("OnboardingDate", { stage: data.stage! });
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
          <Text style={[styles.backText, { color: theme.text.secondary }]}>
            ← Voltar
          </Text>
        </Pressable>
        <ProgressBar currentStep={1} totalSteps={7} />
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
            Me conta: onde você está agora?
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Escolhe a fase que melhor descreve seu momento
          </Text>

          {/* Stage Cards */}
          <View style={styles.cardsContainer}>
            {STAGE_CARDS.map((cardData, index) => {
              const isSelected = data.stage === cardData.stage;
              return (
                <Animated.View
                  key={cardData.stage}
                  entering={FadeInDown.delay(index * 100).duration(300)}
                  style={styles.cardWrapper}
                >
                  <StageCard
                    data={cardData}
                    isSelected={isSelected}
                    onPress={() => handleSelectStage(cardData.stage)}
                  />
                </Animated.View>
              );
            })}
          </View>
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
          style={[
            styles.continueButton,
            !canProceed() && styles.continueButtonDisabled,
          ]}
          accessibilityLabel="Continuar"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canProceed() }}
        >
          <LinearGradient
            colors={
              canProceed()
                ? Tokens.gradients.accent
                : [Tokens.neutral[300], Tokens.neutral[300]]
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
    marginBottom: Tokens.spacing.sm,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    lineHeight: Tokens.typography.bodyMedium.lineHeight,
    marginBottom: Tokens.spacing["2xl"],
  },
  cardsContainer: {
    gap: Tokens.spacing.lg,
  },
  cardWrapper: {
    marginBottom: Tokens.spacing.md,
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
  },
  continueButton: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.md,
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
