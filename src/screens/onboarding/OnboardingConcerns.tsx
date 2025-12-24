/**
 * Tela 3: OnboardingConcerns
 * Grid 2 colunas com 8 cards de preocupações
 * Multi-select até 3 preocupações
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { ConcernCard } from "../../components/onboarding/ConcernCard";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { CONCERN_CARDS } from "../../config/nath-journey-onboarding-data";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { RootStackScreenProps } from "../../types/navigation";
import { OnboardingConcern } from "../../types/nath-journey-onboarding.types";

type Props = RootStackScreenProps<"OnboardingConcerns">;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Tokens.spacing["2xl"] * 2 - Tokens.spacing.md) / 2;

export default function OnboardingConcerns({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage, date } = route.params;
  const { data, toggleConcern, canProceed, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingConcerns");
  }, [setCurrentScreen]);

  const handleSelectConcern = async (concern: OnboardingConcern) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleConcern(concern);
    logger.info(`Concern toggled: ${concern}`, "OnboardingConcerns");
  };

  const handleContinue = async () => {
    if (!canProceed()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingEmotionalState", {
      stage,
      date,
      concerns: data.concerns,
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
          <Text style={[styles.backText, { color: theme.text.secondary }]}>
            ← Voltar
          </Text>
        </Pressable>
        <ProgressBar currentStep={3} totalSteps={7} />
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
            Escolhe até 3 que te pegam agora
          </Text>

          {/* Counter */}
          <Text
            style={[
              styles.counter,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            {data.concerns.length}/3 selecionados
          </Text>

          {/* Concerns Grid */}
          <View style={styles.grid}>
            {CONCERN_CARDS.map((cardData, index) => {
              const isSelected = data.concerns.includes(cardData.concern);
              return (
                <Animated.View
                  key={cardData.concern}
                  entering={FadeInDown.delay(index * 50).duration(300)}
                  style={[
                    styles.cardWrapper,
                    { width: CARD_WIDTH },
                  ]}
                >
                  <ConcernCard
                    data={cardData}
                    isSelected={isSelected}
                    onPress={() => handleSelectConcern(cardData.concern)}
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
  counter: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    marginBottom: Tokens.spacing["2xl"],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Tokens.spacing.md,
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
