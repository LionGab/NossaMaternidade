/**
 * Tela 2: OnboardingDate
 * Branching baseado no stage selecionado
 * Date picker nativo com validação
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { addDays, subDays, isAfter, isBefore } from "date-fns";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { RootStackScreenProps } from "../../types/navigation";

type Props = RootStackScreenProps<"OnboardingDate">;

export default function OnboardingDate({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage } = route.params;
  const { data, setLastMenstruation, setDueDate, setBirthDate, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingDate");
  }, [setCurrentScreen]);

  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [dontKnow, setDontKnow] = useState(false);

  // Determinar tipo de data baseado no stage
  const isTentante = stage === "TENTANTE";
  const isGravida = stage.startsWith("GRAVIDA_");
  const isMae = stage === "PUERPERIO_0_40D" || stage === "MAE_RECENTE_ATE_1ANO";

  // Validação de data
  const validateDate = (selectedDate: Date): boolean => {
    const today = new Date();

    if (isTentante) {
      const minDate = subDays(today, 180);
      return isAfter(selectedDate, minDate) && isBefore(selectedDate, today);
    }

    if (isGravida) {
      const minDate = subDays(today, 7);
      const maxDate = addDays(today, 280);
      return isAfter(selectedDate, minDate) && isBefore(selectedDate, maxDate);
    }

    if (isMae) {
      const minDate = stage === "PUERPERIO_0_40D" 
        ? subDays(today, 40) 
        : subDays(today, 365);
      const maxDate = stage === "PUERPERIO_0_40D" 
        ? today 
        : subDays(today, 41);
      return isAfter(selectedDate, minDate) && isBefore(selectedDate, maxDate);
    }

    return false;
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate && validateDate(selectedDate)) {
      setDate(selectedDate);
      const isoDate = selectedDate.toISOString().split("T")[0];

      if (isTentante) {
        setLastMenstruation(isoDate);
      } else if (isGravida) {
        setDueDate(isoDate);
      } else if (isMae) {
        setBirthDate(isoDate);
      }

      logger.info(`Date selected: ${isoDate}`, "OnboardingDate");
    }
  };

  const handleDontKnow = () => {
    setDontKnow(true);
    // Permitir continuar sem data (só para tentante)
    if (isTentante) {
      setLastMenstruation(null);
    }
  };

  const handleContinue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }

    const dateValue = isTentante
      ? data.lastMenstruation
      : isGravida
      ? data.dueDate
      : data.birthDate;

    if (!dateValue && !dontKnow) {
      logger.warn("Date not selected", "OnboardingDate");
      return;
    }

    navigation.navigate("OnboardingConcerns", {
      stage,
      date: dateValue || "",
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Textos baseados no stage
  const getTexts = () => {
    if (isTentante) {
      return {
        question: "Quando foi sua última menstruação?",
        quote: "(Sei como é ficar contando os dias do ciclo, esperançosa)",
        placeholder: "Selecione a data",
      };
    }
    if (isGravida) {
      return {
        question: "Quando seu bebê vai nascer?",
        quote: "(O Thales nasceu no dia 8 de setembro. Eu contava os dias!)",
        placeholder: "Selecione a DPP",
      };
    }
    return {
      question: "Quando seu bebê nasceu?",
      quote: "(O Thales nasceu dia 8/09. 11 dias depois eu já estava de biquíni - e me JULGUEI por isso.)",
      placeholder: "Selecione a data de nascimento",
    };
  };

  const texts = getTexts();
  const selectedDate = isTentante 
    ? data.lastMenstruation 
    : isGravida 
    ? data.dueDate 
    : data.birthDate;

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
        <ProgressBar currentStep={2} totalSteps={7} />
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
            {texts.question}
          </Text>

          <Text
            style={[
              styles.quote,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            {texts.quote}
          </Text>

          {/* Date Display */}
          {selectedDate && (
            <View style={styles.dateDisplay}>
              <Text
                style={[
                  styles.dateText,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                {new Date(selectedDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}

          {/* Date Picker Button */}
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[
              styles.pickerButton,
              {
                backgroundColor: theme.surface.card,
                borderColor: theme.colors.border.subtle,
              },
            ]}
            accessibilityLabel={texts.placeholder}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.pickerButtonText,
                {
                  color: selectedDate ? theme.text.primary : theme.text.tertiary,
                },
              ]}
            >
              {selectedDate ? "Alterar data" : texts.placeholder}
            </Text>
          </Pressable>

          {/* "Não sei exatamente" option (só para tentante) */}
          {isTentante && (
            <Pressable
              onPress={handleDontKnow}
              style={styles.dontKnowButton}
              accessibilityLabel="Não sei exatamente"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.dontKnowText,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Não sei exatamente
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={isTentante || isMae ? new Date() : addDays(new Date(), 280)}
          minimumDate={
            isTentante
              ? subDays(new Date(), 180)
              : isGravida
              ? subDays(new Date(), 7)
              : subDays(new Date(), stage === "PUERPERIO_0_40D" ? 40 : 365)
          }
        />
      )}

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
          disabled={!selectedDate && !dontKnow}
          style={[
            styles.continueButton,
            (!selectedDate && !dontKnow) && styles.continueButtonDisabled,
          ]}
          accessibilityLabel="Continuar"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={
              selectedDate || dontKnow
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
                (!selectedDate && !dontKnow) && styles.continueButtonTextDisabled,
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
    marginBottom: Tokens.spacing.md,
  },
  quote: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontStyle: "italic",
    lineHeight: Tokens.typography.bodyMedium.lineHeight,
    marginBottom: Tokens.spacing["2xl"],
  },
  dateDisplay: {
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.lg,
    backgroundColor: Tokens.brand.accent[50],
    marginBottom: Tokens.spacing.lg,
    alignItems: "center",
  },
  dateText: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
  },
  pickerButton: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  pickerButtonText: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
  dontKnowButton: {
    marginTop: Tokens.spacing.md,
    padding: Tokens.spacing.md,
    alignItems: "center",
  },
  dontKnowText: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    textDecorationLine: "underline",
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
