/**
 * Tela 0: OnboardingWelcome
 * Vídeo de boas-vindas da Nath com overlay escuro
 * Botão "Começar" aparece após 3 segundos ou ao fim do vídeo
 */

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoPlayer } from "../../components/onboarding/VideoPlayer";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingWelcome">;

// Vídeo da Nath para welcome screen (Nath se emociona)
const WELCOME_VIDEO = require("../../../assets/onboarding/videos/mundo-nath-africa.mp4");

export default function OnboardingWelcome({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [showButton, setShowButton] = useState(false);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Mostrar botão após 3 segundos (reduzido de 8s pois não há mais vídeo)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  const handleSkip = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Haptics não disponível no simulador
    }
    logger.info("Onboarding welcome skipped", "OnboardingWelcome");
    navigation.navigate("OnboardingStage");
  };

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
      {/* Background Video */}
      <VideoPlayer
        videoSource={WELCOME_VIDEO}
        autoPlay
        loop
        muted={false}
        showControls={false}
        onVideoEnd={() => setShowButton(true)}
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay escuro (40%) */}
      <View style={styles.overlay}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Skip button */}
        <Pressable
          style={[styles.skipButton, { top: insets.top + Tokens.spacing.md }]}
          onPress={handleSkip}
          accessibilityLabel="Pular introdução"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>

        {/* Texto overlay */}
        <View style={styles.textContainer}>
          <Text style={styles.overlayText}>Vem comigo? Me conta onde você está</Text>
        </View>

        {/* Botão "Começar" - aparece após 8s */}
        {showButton && (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.buttonContainer}>
            <Pressable
              onPress={handleStart}
              style={styles.button}
              accessibilityLabel="Começar onboarding"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={Tokens.gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Começar →</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[900],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  skipButton: {
    position: "absolute",
    right: Tokens.spacing.lg,
    padding: Tokens.spacing.md,
    zIndex: 10,
  },
  skipText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    opacity: 0.8,
  },
  textContainer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing["4xl"],
  },
  overlayText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.headlineMedium.fontSize,
    fontWeight: Tokens.typography.headlineMedium.fontWeight,
    textAlign: "center",
    lineHeight: Tokens.typography.headlineMedium.lineHeight,
  },
  buttonContainer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing["5xl"],
  },
  button: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.lg,
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
