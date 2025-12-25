/**
 * Tela 7: OnboardingSummary
 * Resumo personalizado baseado em todas as respostas
 * 5 cards informativos com dados da usuária
 */

import { differenceInWeeks, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { STAGE_CARDS } from "../../config/nath-journey-onboarding-data";
import { useTheme } from "../../hooks/useTheme";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { OnboardingConcern } from "../../types/nath-journey-onboarding.types";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingSummary">;

export default function OnboardingSummary({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage, date, concerns, emotionalState, dailyCheckIn, checkInTime, seasonName } =
    route.params;
  const { needsExtraCare, setCurrentScreen } = useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingSummary");
  }, [setCurrentScreen]);

  // Calcular semana da gravidez (se aplicável)
  const getPregnancyWeek = (): number | null => {
    if (stage.startsWith("GRAVIDA_") && date) {
      try {
        const dueDate = parseISO(date);
        const today = new Date();
        const weeks = differenceInWeeks(dueDate, today);
        return Math.max(0, 40 - weeks);
      } catch {
        return null;
      }
    }
    return null;
  };

  const pregnancyWeek = getPregnancyWeek();
  const stageCard = STAGE_CARDS.find((card) => card.stage === stage);
  const concernLabels: Record<OnboardingConcern, string> = {
    ANSIEDADE_MEDO: "Ansiedade e medo",
    FALTA_INFORMACAO: "Falta de informação",
    SINTOMAS_FISICOS: "Sintomas físicos",
    MUDANCAS_CORPO: "Mudanças no corpo",
    RELACIONAMENTO: "Relacionamento",
    TRABALHO_MATERNIDADE: "Trabalho e maternidade",
    SOLIDAO: "Solidão",
    FINANCAS: "Grana",
  };

  const handleContinue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    logger.info("Navigating to paywall", "OnboardingSummary");
    navigation.navigate("OnboardingPaywall", {
      onboardingData: {
        stage,
        date,
        concerns,
        emotionalState,
        dailyCheckIn,
        checkInTime,
        seasonName,
        needsExtraCare: needsExtraCare(),
      },
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
        <ProgressBar currentStep={7} totalSteps={7} />
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
            Pronto! Vou te acompanhar assim:
          </Text>

          {/* Card 1: Momento */}
          {stageCard && (
            <Animated.View entering={FadeInDown.delay(100).duration(300)}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                  },
                ]}
              >
                <Text style={styles.cardEmoji}>{stageCard.icon}</Text>
                {stageCard.image && (
                  <Image source={stageCard.image} style={styles.cardImage} resizeMode="cover" />
                )}
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  {stageCard.title}
                </Text>
                {pregnancyWeek !== null && (
                  <Text
                    style={[
                      styles.cardSubtitle,
                      {
                        color: theme.text.secondary,
                      },
                    ]}
                  >
                    Você está na semana {pregnancyWeek} - mesma que essa foto minha. Barriga
                    crescendo!
                  </Text>
                )}
              </View>
            </Animated.View>
          )}

          {/* Card 2: Preocupações */}
          {concerns.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                  },
                ]}
              >
                <Text style={styles.cardEmoji}>💬</Text>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  Vou focar em:
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    {
                      color: theme.text.secondary,
                    },
                  ]}
                >
                  {concerns.map((c) => concernLabels[c as OnboardingConcern]).join(", ")}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Card 3: Tom (baseado em emotional state) */}
          {needsExtraCare() && (
            <Animated.View entering={FadeInDown.delay(300).duration(300)}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: Tokens.semantic.light.infoLight,
                    borderColor: Tokens.semantic.light.info,
                  },
                ]}
              >
                <Text style={styles.cardEmoji}>🧠</Text>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  Tom acolhedor sempre - você não tá só
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    {
                      color: theme.text.secondary,
                    },
                  ]}
                >
                  💜 CVV 188 - Liga, não é frescura
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Card 4: Check-in */}
          {dailyCheckIn && (
            <Animated.View entering={FadeInDown.delay(400).duration(300)}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                  },
                ]}
              >
                <Text style={styles.cardEmoji}>🔔</Text>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  Check-in diário às {checkInTime || "20:00"}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Card 5: Temporada */}
          {seasonName && (
            <Animated.View entering={FadeInDown.delay(500).duration(300)}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                  },
                ]}
              >
                <Text style={styles.cardEmoji}>✨</Text>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  Sua temporada: &quot;{seasonName}&quot; começa agora
                </Text>
              </View>
            </Animated.View>
          )}
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
          style={styles.continueButton}
          accessibilityLabel="Vamos juntas nessa"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Vamos juntas nessa? →</Text>
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
    marginBottom: Tokens.spacing["2xl"],
  },
  card: {
    padding: Tokens.spacing.xl,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    marginBottom: Tokens.spacing.md,
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: Tokens.spacing.sm,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: Tokens.radius.lg,
    marginBottom: Tokens.spacing.md,
  },
  cardTitle: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
    textAlign: "center",
    marginBottom: Tokens.spacing.sm,
  },
  cardSubtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    textAlign: "center",
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.5,
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
});
