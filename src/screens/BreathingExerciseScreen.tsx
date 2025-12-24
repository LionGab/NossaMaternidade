/**
 * Nossa Maternidade - BreathingExerciseScreen
 * 3 breathing techniques: Box, 4-7-8, Calm
 */

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
} from "../theme/tokens";

// Breathing gradients compatibility (from design-system.ts)
const GRADIENTS = {
  breathing: {
    box: {
      color: "#60A5FA",
      bgColors: ["#DBEAFE", "#BFDBFE", "#93C5FD"] as const,
    },
    technique478: {
      bgColors: ["#EDE9FE", "#DDD6FE", "#C4B5FD"] as const,
    },
    calm: {
      bgColors: ["#DCFCE7", "#BBF7D0", "#86EFAC"] as const,
    },
  },
} as const;

type BreathingTechnique = "box" | "478" | "calm";

interface Phase {
  name: string;
  duration: number;
  instruction: string;
}

interface Technique {
  name: string;
  description: string;
  duration: number;
  phases: Phase[];
  color: string;
  bgColors: [string, string, string];
}

const TECHNIQUES: Record<BreathingTechnique, Technique> = {
  box: {
    name: "Respiracao Box",
    description: "4 segundos inspirar, 4 segurar, 4 expirar, 4 segurar",
    duration: 16000,
    phases: [
      { name: "Inspire", duration: 4000, instruction: "Inspire profundamente pelo nariz" },
      { name: "Segure", duration: 4000, instruction: "Segure o ar nos pulmoes" },
      { name: "Expire", duration: 4000, instruction: "Expire lentamente pela boca" },
      { name: "Segure", duration: 4000, instruction: "Segure com os pulmoes vazios" },
    ],
    color: GRADIENTS.breathing.box.color,
    bgColors: GRADIENTS.breathing.box.bgColors as unknown as [string, string, string],
  },
  "478": {
    name: "Tecnica 4-7-8",
    description: "4 segundos inspirar, 7 segurar, 8 expirar",
    duration: 19000,
    phases: [
      { name: "Inspire", duration: 4000, instruction: "Inspire pelo nariz" },
      { name: "Segure", duration: 7000, instruction: "Segure a respiracao" },
      { name: "Expire", duration: 8000, instruction: "Expire lentamente pela boca" },
    ],
    color: COLORS.secondary[500],
    bgColors: GRADIENTS.breathing.technique478.bgColors as unknown as [string, string, string],
  },
  calm: {
    name: "Respiracao Calma",
    description: "5 segundos inspirar, 5 segundos expirar",
    duration: 10000,
    phases: [
      { name: "Inspire", duration: 5000, instruction: "Inspire suavemente" },
      { name: "Expire", duration: 5000, instruction: "Expire relaxando" },
    ],
    color: COLORS.semantic.success,
    bgColors: GRADIENTS.breathing.calm.bgColors as unknown as [string, string, string],
  },
};

export default function BreathingExerciseScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>("calm");
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cycles, setCycles] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  const technique = TECHNIQUES[selectedTechnique];

  const startBreathingCycle = useCallback(() => {
    const phases = technique.phases;
    let phaseIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runPhase = () => {
      const phase = phases[phaseIndex];
      const isInhale = phase.name === "Inspire";
      const isHold = phase.name === "Segure";

      setCurrentPhase(phaseIndex);

      // Haptic feedback at phase start
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isInhale) {
        scale.value = withTiming(1.8, {
          duration: phase.duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        opacity.value = withTiming(0.8, { duration: phase.duration });
      } else if (isHold) {
        // Keep current scale
      } else {
        // Exhale
        scale.value = withTiming(1, {
          duration: phase.duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        opacity.value = withTiming(0.3, { duration: phase.duration });
      }

      timeoutId = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) {
          setCycles((c) => c + 1);
        }
        runPhase();
      }, phase.duration);
    };

    runPhase();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [technique.phases, scale, opacity]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isActive) {
      cleanup = startBreathingCycle();
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0.3, { duration: 500 });
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [isActive, selectedTechnique, startBreathingCycle, scale, opacity]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isActive) {
      setCycles(0);
      setCurrentPhase(0);
    }
    setIsActive(!isActive);
  };

  const handleTechniqueSelect = (tech: BreathingTechnique) => {
    if (isActive) return; // Can't change while active
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTechnique(tech);
    setCurrentPhase(0);
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const currentPhaseData = technique.phases[currentPhase];

  return (
    <LinearGradient
      colors={technique.bgColors}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: SPACING["2xl"],
            paddingVertical: SPACING.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            style={{ padding: SPACING.sm }}
          >
            <Ionicons name="close" size={28} color={COLORS.neutral[800]} />
          </Pressable>
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
            }}
          >
            {technique.name}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Main Content */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: SPACING["2xl"],
          }}
        >
          {/* Breathing Circle */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: SPACING["3xl"],
            }}
          >
            <Animated.View
              style={[
                {
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: technique.color,
                },
                animatedCircleStyle,
              ]}
            />

            {/* Center Text */}
            <View
              style={{
                position: "absolute",
                alignItems: "center",
              }}
            >
              {isActive ? (
                <>
                  <Text
                    style={{
                      color: COLORS.neutral[0],
                      fontSize: 30,
                      fontWeight: "700",
                      marginBottom: SPACING.sm,
                    }}
                  >
                    {currentPhaseData?.name}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: TYPOGRAPHY.bodySmall.fontSize,
                      textAlign: "center",
                    }}
                  >
                    Ciclo {cycles + 1}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="leaf" size={48} color={COLORS.text.inverse} />
                  <Text
                    style={{
                      color: COLORS.neutral[0],
                      fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                      fontWeight: "600",
                      marginTop: SPACING.md,
                    }}
                  >
                    Toque para comecar
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Instruction Text */}
          {isActive && (
            <View style={{ marginBottom: SPACING["2xl"] }}>
              <Text
                style={{
                  color: COLORS.neutral[800],
                  fontSize: TYPOGRAPHY.titleMedium.fontSize,
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {currentPhaseData?.instruction}
              </Text>
            </View>
          )}

          {/* Control Button */}
          <Pressable onPress={handleToggle} style={{ marginBottom: SPACING["2xl"] }}>
            <View
              style={{
                backgroundColor: technique.color,
                paddingHorizontal: SPACING["4xl"],
                paddingVertical: SPACING.lg,
                borderRadius: RADIUS.full,
                shadowColor: technique.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  color: COLORS.neutral[0],
                  fontSize: TYPOGRAPHY.labelLarge.fontSize,
                  fontWeight: "700",
                }}
              >
                {isActive ? "Pausar" : "Comecar"}
              </Text>
            </View>
          </Pressable>

          {/* Technique Info */}
          {!isActive && (
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                borderRadius: RADIUS["2xl"],
                padding: SPACING.lg,
                marginBottom: SPACING["2xl"],
              }}
            >
              <Text
                style={{
                  color: COLORS.neutral[700],
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  textAlign: "center",
                }}
              >
                {technique.description}
              </Text>
            </View>
          )}
        </View>

        {/* Technique Selector */}
        {!isActive && (
          <View
            style={{
              paddingHorizontal: SPACING["2xl"],
              paddingBottom: insets.bottom + SPACING["2xl"],
            }}
          >
            <Text
              style={{
                color: COLORS.neutral[700],
                fontWeight: "600",
                marginBottom: SPACING.md,
                textAlign: "center",
              }}
            >
              Escolha uma tecnica
            </Text>
            <View style={{ flexDirection: "row", gap: SPACING.md }}>
              {(Object.keys(TECHNIQUES) as BreathingTechnique[]).map((tech) => {
                const t = TECHNIQUES[tech];
                const isSelected = selectedTechnique === tech;
                return (
                  <Pressable
                    key={tech}
                    onPress={() => handleTechniqueSelect(tech)}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        backgroundColor: isSelected
                          ? t.color
                          : "rgba(255,255,255,0.5)",
                        padding: SPACING.lg,
                        borderRadius: RADIUS.xl,
                        borderWidth: 2,
                        borderColor: isSelected ? t.color : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: TYPOGRAPHY.bodySmall.fontSize,
                          fontWeight: "700",
                          textAlign: "center",
                          color: isSelected ? COLORS.neutral[0] : COLORS.neutral[700],
                        }}
                      >
                        {t.name.replace("Respiracao ", "").replace("Tecnica ", "")}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
