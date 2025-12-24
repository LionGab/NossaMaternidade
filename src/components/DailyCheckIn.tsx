import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useCheckInStore } from "../state/store";
import { useTheme } from "../hooks/useTheme";
import { Tokens, COLORS, surface } from "../theme/tokens";

const MOOD_OPTIONS = [
  { value: 1, emoji: "😢", label: "Difícil" },
  { value: 2, emoji: "😔", label: "Baixo" },
  { value: 3, emoji: "😐", label: "Ok" },
  { value: 4, emoji: "🙂", label: "Bem" },
  { value: 5, emoji: "😊", label: "Ótimo" },
];

const ENERGY_OPTIONS = [
  { value: 1, emoji: "🔋", label: "Esgotada", color: Tokens.semantic.light.error },
  { value: 2, emoji: "🪫", label: "Cansada", color: Tokens.semantic.light.warning },
  { value: 3, emoji: "⚡", label: "Normal", color: COLORS.legacyAccent.peach },
  { value: 4, emoji: "✨", label: "Boa", color: Tokens.semantic.light.success },
  { value: 5, emoji: "🌟", label: "Plena", color: Tokens.brand.accent[500] },
];

const SLEEP_OPTIONS = [
  { value: 1, emoji: "😫", label: "Péssimo" },
  { value: 2, emoji: "😴", label: "Ruim" },
  { value: 3, emoji: "😌", label: "Regular" },
  { value: 4, emoji: "😇", label: "Bom" },
  { value: 5, emoji: "💤", label: "Ótimo" },
];

type CheckInStep = "mood" | "energy" | "sleep" | "complete";

interface DailyCheckInProps {
  onComplete?: () => void;
}

/**
 * Cores semânticas para check-in com suporte a dark mode
 * Todas as cores mapeadas para o design-system
 */
const getCheckInColors = (isDark: boolean) => ({
  // Estado completo - verde suave
  completeBg: isDark ? "rgba(20, 184, 166, 0.15)" : Tokens.semantic.light.successLight,
  completeBorder: isDark ? "rgba(20, 184, 166, 0.3)" : Tokens.semantic.light.successLight,
  completeIcon: Tokens.semantic.light.success,
  completeText: isDark ? Tokens.brand.accent[300] : Tokens.brand.accent[900],
  completeSubtext: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[700],
  // Estado pendente - amarelo suave
  pendingBg: isDark ? "rgba(245, 158, 11, 0.15)" : Tokens.semantic.light.warningLight,
  pendingBorder: isDark ? "rgba(245, 158, 11, 0.3)" : Tokens.semantic.light.warningLight,
  pendingIcon: Tokens.semantic.light.warning,
  pendingText: isDark ? COLORS.legacyAccent.peach : Tokens.neutral[800],
  pendingSubtext: isDark ? Tokens.neutral[400] : Tokens.neutral[600],
  pendingChevron: isDark ? Tokens.neutral[400] : Tokens.semantic.light.warning,
  // Modal
  modalBg: isDark ? surface.dark.card : Tokens.text.light.inverse,
  modalOverlay: "rgba(0, 0, 0, 0.7)",
  closeBg: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
  closeIcon: Tokens.neutral[500],
  // Progress bar
  progressActive: Tokens.brand.primary[500],
  progressComplete: Tokens.semantic.light.success,
  progressPending: isDark ? Tokens.neutral[600] : Tokens.neutral[200],
  // Text
  title: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
  subtitle: Tokens.neutral[500],
  // Options
  optionBg: isDark ? Tokens.neutral[700] : COLORS.background.warm,
});

export default function DailyCheckIn({ onComplete }: DailyCheckInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckInStep>("mood");
  const { isDark } = useTheme();
  const checkInColors = useMemo(() => getCheckInColors(isDark), [isDark]);

  const checkIns = useCheckInStore((s) => s.checkIns);
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const setTodayEnergy = useCheckInStore((s) => s.setTodayEnergy);
  const setTodaySleep = useCheckInStore((s) => s.setTodaySleep);

  const today = new Date().toISOString().split("T")[0];
  const todayCheckIn = useMemo(() => {
    return checkIns.find((c) => c.date === today);
  }, [checkIns, today]);

  const isComplete = todayCheckIn?.mood && todayCheckIn?.energy && todayCheckIn?.sleep;

  const handleOpen = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep("mood");
    setIsOpen(true);
  };

  const handleSelect = async (type: CheckInStep, value: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (type === "mood") {
      setTodayMood(value);
      setCurrentStep("energy");
    } else if (type === "energy") {
      setTodayEnergy(value);
      setCurrentStep("sleep");
    } else if (type === "sleep") {
      setTodaySleep(value);
      setCurrentStep("complete");
      setTimeout(() => {
        setIsOpen(false);
        onComplete?.();
      }, 1500);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "mood":
        return "Como você está se sentindo?";
      case "energy":
        return "Como está sua energia?";
      case "sleep":
        return "Como foi seu sono?";
      case "complete":
        return "Check-in completo!";
    }
  };

  const getOptions = () => {
    switch (currentStep) {
      case "mood":
        return MOOD_OPTIONS;
      case "energy":
        return ENERGY_OPTIONS;
      case "sleep":
        return SLEEP_OPTIONS;
      default:
        return [];
    }
  };

  const renderCompactView = () => {
    if (isComplete) {
      return (
        <Pressable
          onPress={handleOpen}
          style={{
            backgroundColor: checkInColors.completeBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: checkInColors.completeBorder,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: checkInColors.completeIcon,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="checkmark" size={22} color={Tokens.text.light.inverse} />
              </View>
              <View>
                <Text style={{ color: checkInColors.completeText, fontSize: 15, fontWeight: "600" }}>
                  Check-in feito!
                </Text>
                <Text style={{ color: checkInColors.completeSubtext, fontSize: 13, marginTop: 2 }}>
                  Humor: {MOOD_OPTIONS.find((m) => m.value === todayCheckIn?.mood)?.emoji} ·
                  Energia: {ENERGY_OPTIONS.find((e) => e.value === todayCheckIn?.energy)?.emoji} ·
                  Sono: {SLEEP_OPTIONS.find((s) => s.value === todayCheckIn?.sleep)?.emoji}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={handleOpen}
        style={{
          backgroundColor: checkInColors.pendingBg,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: checkInColors.pendingBorder,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: checkInColors.pendingIcon,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>✨</Text>
            </View>
            <View className="flex-1">
              <Text style={{ color: checkInColors.pendingText, fontSize: 15, fontWeight: "600" }}>
                Check-in de hoje
              </Text>
              <Text style={{ color: checkInColors.pendingSubtext, fontSize: 13, marginTop: 2 }}>
                10 segundos · Humor, energia e sono
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={checkInColors.pendingChevron} />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {renderCompactView()}

      <Modal visible={isOpen} animationType="fade" transparent statusBarTranslucent>
        <View
          style={{
            flex: 1,
            backgroundColor: checkInColors.modalOverlay,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            style={{
              backgroundColor: checkInColors.modalBg,
              borderRadius: 24,
              padding: 24,
              width: "100%",
              maxWidth: 340,
            }}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: checkInColors.closeBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={18} color={checkInColors.closeIcon} />
            </Pressable>

            {/* Progress */}
            <View className="flex-row mb-6">
              {["mood", "energy", "sleep"].map((step, index) => (
                <View
                  key={step}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor:
                      currentStep === step
                        ? checkInColors.progressActive
                        : index < ["mood", "energy", "sleep"].indexOf(currentStep)
                        ? checkInColors.progressComplete
                        : checkInColors.progressPending,
                    marginRight: index < 2 ? 8 : 0,
                  }}
                />
              ))}
            </View>

            {/* Title */}
            <Animated.Text
              entering={FadeIn.duration(300)}
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: checkInColors.title,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {getStepTitle()}
            </Animated.Text>

            {/* Options or Complete State */}
            {currentStep === "complete" ? (
              <Animated.View
                entering={ZoomIn.duration(400).springify()}
                style={{ alignItems: "center", paddingVertical: 20 }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: checkInColors.completeIcon,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="checkmark" size={40} color={Tokens.text.light.inverse} />
                </View>
                <Text style={{ fontSize: 16, color: checkInColors.subtitle, textAlign: "center" }}>
                  Obrigada por cuidar de você!
                </Text>
              </Animated.View>
            ) : (
              <View className="flex-row justify-between">
                {getOptions().map((option, index) => (
                  <Animated.View
                    key={option.value}
                    entering={FadeInUp.delay(index * 50).duration(300).springify()}
                  >
                    <Pressable
                      onPress={() => handleSelect(currentStep, option.value)}
                      style={{
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: checkInColors.optionBg,
                        minWidth: 56,
                      }}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 4 }}>{option.emoji}</Text>
                      <Text style={{ fontSize: 11, color: checkInColors.subtitle, fontWeight: "500" }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
