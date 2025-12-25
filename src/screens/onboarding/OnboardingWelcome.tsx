/**
 * Tela 0: OnboardingWelcome
 * Tela de boas-vindas simples com imagem de fundo
 * Botão "Começar" disponível imediatamente
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingWelcome">;

// Imagem de boas-vindas da Nath
const WELCOME_IMAGE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

export default function OnboardingWelcome({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  const handleStart = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    logger.info("Onboarding welcome completed", "OnboardingWelcome");
    navigation.navigate("OnboardingStage");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={[Tokens.brand.primary[50], Tokens.brand.accent[50]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Imagem da Nath */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.imageContainer}>
          <Image source={WELCOME_IMAGE} style={styles.image} contentFit="cover" />
        </Animated.View>

        {/* Texto de boas-vindas */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.greeting}>Oi, eu sou a Nath! 💜</Text>
          <Text style={styles.title}>Vem comigo?{"\n"}Me conta onde você está</Text>
          <Text style={styles.subtitle}>
            Em poucos minutos vou conhecer você melhor para te ajudar nessa jornada
          </Text>
        </Animated.View>
      </View>

      {/* Footer com botão */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Tokens.spacing.lg,
          },
        ]}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Pressable
            onPress={handleStart}
            style={styles.button}
            accessibilityLabel="Começar onboarding"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Começar →</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[50],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing["2xl"],
    gap: Tokens.spacing.xl,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    ...Tokens.shadows.sm,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
    color: Tokens.brand.accent[400], // Rosa mais suave
    textAlign: "center",
    marginBottom: Tokens.spacing.sm,
  },
  title: {
    fontSize: Tokens.typography.headlineLarge.fontSize,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    color: Tokens.neutral[900],
    textAlign: "center",
    lineHeight: Tokens.typography.headlineLarge.lineHeight,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    color: Tokens.neutral[600],
    textAlign: "center",
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.4,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
  },
  button: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.sm,
  },
  buttonGradient: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  buttonText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
});
