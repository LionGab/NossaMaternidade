/**
 * Tela 6: OnboardingSeason
 * Ritual de temporada - escolher nome da temporada
 * Preview do card compartilhável
 */

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { ShareableCard } from "../../components/onboarding/ShareableCard";
import { SEASON_PRESETS } from "../../config/nath-journey-onboarding-data";
import { useTheme } from "../../hooks/useTheme";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingSeason">;

export default function OnboardingSeason({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage, date, concerns, emotionalState, dailyCheckIn, checkInTime } = route.params;
  const { data, setSeasonName, canProceed, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingSeason");
  }, [setCurrentScreen]);

  const [customSeason, setCustomSeason] = useState(data.seasonName || "");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelectPreset = async (preset: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPreset(preset);
    setCustomSeason("");
    setSeasonName(preset);
    logger.info(`Season preset selected: ${preset}`, "OnboardingSeason");
  };

  const handleCustomChange = (text: string) => {
    if (text.length <= 40) {
      setCustomSeason(text);
      setSelectedPreset(null);
      setSeasonName(text);
    }
  };

  const handleContinue = async () => {
    if (!canProceed()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingSummary", {
      stage,
      date,
      concerns,
      emotionalState,
      dailyCheckIn,
      checkInTime,
      seasonName: data.seasonName!,
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
        <ProgressBar currentStep={6} totalSteps={7} />
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
            Escolhe o nome da sua temporada comigo:
          </Text>

          {/* Preset Options */}
          <View style={styles.presetsContainer}>
            {SEASON_PRESETS.map((preset, index) => {
              const isSelected = selectedPreset === preset;
              return (
                <Animated.View key={preset} entering={FadeInDown.delay(index * 50).duration(300)}>
                  <Pressable
                    onPress={() => handleSelectPreset(preset)}
                    style={[
                      styles.presetButton,
                      isSelected && styles.presetButtonSelected,
                      {
                        borderColor: isSelected ? Tokens.brand.accent[500] : theme.colors.border.subtle,
                        backgroundColor: theme.surface.card,
                      },
                    ]}
                    accessibilityLabel={`Selecionar: ${preset}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        {
                          color: theme.text.primary,
                        },
                      ]}
                    >
                      {preset}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Custom Input */}
          <View style={styles.customContainer}>
            <Text
              style={[
                styles.customLabel,
                {
                  color: theme.text.secondary,
                },
              ]}
            >
              Ou escreve a sua (até 40 caracteres)
            </Text>
            <TextInput
              value={customSeason}
              onChangeText={handleCustomChange}
              placeholder="Ex: Temporada: Minha jornada real"
              placeholderTextColor={theme.text.tertiary}
              maxLength={40}
              style={[
                styles.customInput,
                {
                  backgroundColor: theme.surface.card,
                  borderColor: theme.colors.border.subtle,
                  color: theme.text.primary,
                },
              ]}
              accessibilityLabel="Campo para escrever nome da temporada"
            />
            <Text
              style={[
                styles.charCount,
                {
                  color: theme.text.tertiary,
                },
              ]}
            >
              {customSeason.length}/40
            </Text>
          </View>

          {/* Preview Card */}
          {(data.seasonName || customSeason) && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.previewContainer}>
              <Text
                style={[
                  styles.previewLabel,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Preview do seu card:
              </Text>
              <ShareableCard seasonName={data.seasonName || customSeason} />
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
    marginBottom: Tokens.spacing["2xl"],
  },
  presetsContainer: {
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing["2xl"],
  },
  presetButton: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius.lg,
    borderWidth: 2,
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  presetButtonSelected: {
    ...Tokens.shadows.md,
  },
  presetText: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    textAlign: "center",
  },
  customContainer: {
    marginBottom: Tokens.spacing["2xl"],
  },
  customLabel: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    marginBottom: Tokens.spacing.sm,
  },
  customInput: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing.lg,
    borderRadius: Tokens.radius.lg,
    borderWidth: 2,
    fontSize: Tokens.typography.bodyLarge.fontSize,
    minHeight: Tokens.accessibility.minTapTarget + 8,
  },
  charCount: {
    fontSize: Tokens.typography.caption.fontSize,
    textAlign: "right",
    marginTop: Tokens.spacing.xs,
  },
  previewContainer: {
    marginTop: Tokens.spacing.lg,
  },
  previewLabel: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    marginBottom: Tokens.spacing.md,
    textAlign: "center",
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
