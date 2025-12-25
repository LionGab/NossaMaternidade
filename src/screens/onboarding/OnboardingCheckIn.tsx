/**
 * Tela 5: OnboardingCheckIn
 * Toggle para check-in diário + time picker
 */

import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Imagem da Nath com Thales
const CHECKIN_IMAGE = require("../../../assets/onboarding/images/checkin-nath-thales.jpg");
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { useTheme } from "../../hooks/useTheme";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingCheckIn">;

export default function OnboardingCheckIn({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stage, date, concerns, emotionalState } = route.params;
  const { data, setDailyCheckIn, setCheckInTime, setCurrentScreen } =
    useNathJourneyOnboardingStore();

  useEffect(() => {
    setCurrentScreen("OnboardingCheckIn");
  }, [setCurrentScreen]);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState<Date>(() => {
    if (data.checkInTime) {
      const [hours, minutes] = data.checkInTime.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return date;
    }
    // Default: 20:00
    const date = new Date();
    date.setHours(20, 0);
    return date;
  });

  const handleToggleCheckIn = (enabled: boolean) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    setDailyCheckIn(enabled);
    if (enabled && !data.checkInTime) {
      setCheckInTime("20:00");
    }
    logger.info(`Daily check-in ${enabled ? "enabled" : "disabled"}`, "OnboardingCheckIn");
  };

  const handleTimeChange = (_event: unknown, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      setTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      setCheckInTime(timeString);
      logger.info(`Check-in time set: ${timeString}`, "OnboardingCheckIn");
    }
  };

  const handleContinue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    navigation.navigate("OnboardingSeason", {
      stage,
      date,
      concerns,
      emotionalState,
      dailyCheckIn: data.dailyCheckIn,
      checkInTime: data.checkInTime || undefined,
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
        <ProgressBar currentStep={5} totalSteps={7} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          {/* Foto da Nath com Thales */}
          <View style={styles.imageContainer}>
            <Image
              source={CHECKIN_IMAGE}
              style={styles.image}
              contentFit="cover"
              contentPosition="top"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)"]}
              style={styles.imageOverlay}
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: theme.text.primary,
              },
            ]}
          >
            Eu configurei pra NathIA me mandar um {'"'}oi, tudo bem?{'"'} todo dia às 21h.
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Me ajudava a parar, respirar, checar comigo mesma.
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.text.secondary,
                marginBottom: Tokens.spacing["2xl"],
              },
            ]}
          >
            Quer que eu faça isso com você?
          </Text>

          {/* Toggle */}
          <View
            style={[
              styles.toggleContainer,
              {
                backgroundColor: theme.surface.card,
                borderColor: theme.colors.border.subtle,
              },
            ]}
          >
            <View style={styles.toggleContent}>
              <Text
                style={[
                  styles.toggleLabel,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                Check-in diário
              </Text>
              <Text
                style={[
                  styles.toggleDescription,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Receber lembretes diários da NathIA
              </Text>
            </View>
            <Switch
              value={data.dailyCheckIn}
              onValueChange={handleToggleCheckIn}
              trackColor={{
                false: Tokens.neutral[200],
                true: Tokens.brand.accent[200],
              }}
              thumbColor={data.dailyCheckIn ? Tokens.brand.accent[400] : Tokens.neutral[400]}
            />
          </View>

          {/* Time Picker (se check-in ativado) */}
          {data.dailyCheckIn && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.timeContainer}>
              <Text
                style={[
                  styles.timeLabel,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Horário do check-in
              </Text>
              <Pressable
                onPress={() => setShowTimePicker(true)}
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                  },
                ]}
                accessibilityLabel="Selecionar horário"
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    {
                      color: theme.text.primary,
                    },
                  ]}
                >
                  {data.checkInTime || "20:00"}
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Microcopy */}
          <Text
            style={[
              styles.microcopy,
              {
                color: theme.text.tertiary,
              },
            ]}
          >
            Pode mudar depois no perfil, tranquilo
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
          is24Hour={true}
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
          style={styles.continueButton}
          accessibilityLabel="Continuar"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
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
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    marginBottom: Tokens.spacing["2xl"],
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: Tokens.typography.headlineLarge.fontSize,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    lineHeight: Tokens.typography.headlineLarge.lineHeight,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    lineHeight: Tokens.typography.bodyLarge.lineHeight,
    marginBottom: Tokens.spacing.sm,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    marginBottom: Tokens.spacing.lg,
    ...Tokens.shadows.sm,
  },
  toggleContent: {
    flex: 1,
    marginRight: Tokens.spacing.md,
  },
  toggleLabel: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    marginBottom: Tokens.spacing.xs,
  },
  toggleDescription: {
    fontSize: Tokens.typography.bodySmall.fontSize,
  },
  timeContainer: {
    marginBottom: Tokens.spacing.lg,
  },
  timeLabel: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    marginBottom: Tokens.spacing.sm,
  },
  timeButton: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
  microcopy: {
    fontSize: Tokens.typography.caption.fontSize,
    textAlign: "center",
    marginTop: Tokens.spacing.md,
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
