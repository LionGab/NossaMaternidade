/**
 * Nossa Maternidade - Mãe Valente Progress Screen
 * Track progress, streaks, achievements, and community stats
 */

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAppStore, useCheckInStore } from "../state/store";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../theme/tokens";

// Overlay compatibility mapping
const OVERLAY = {
  white: {
    text: "rgba(255, 255, 255, 0.7)",
    textStrong: "rgba(255, 255, 255, 0.8)",
    strong: "rgba(255, 255, 255, 0.2)",
    prominent: "rgba(255, 255, 255, 0.6)",
  },
} as const;

// Gradients compatibility (from design-system.ts)
const GRADIENTS = {
  streakIcon: "#F59E0B",
} as const;

type ViewMode = "week" | "month" | "year";

interface CheckInData {
  date: string;
  mood?: number | null;
}

export default function MaeValenteProgressScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const user = useAppStore((s) => s.user);
  const checkIns = useCheckInStore((s) => s.checkIns);

  // Calculate stats
  const totalCheckIns = checkIns.length;
  const currentStreak = calculateStreak(checkIns);
  const bestStreak = 12; // Mock for now
  const averageMood = calculateAverageMood(checkIns);

  const handleViewModeChange = (mode: ViewMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background.primary }}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary[500], COLORS.primary[600], COLORS.primary[700]]}
        style={{
          paddingTop: insets.top + SPACING.lg,
          paddingBottom: SPACING["2xl"],
          paddingHorizontal: SPACING["2xl"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING["2xl"],
          }}
        >
          <View>
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.bodySmall.fontSize,
                fontWeight: "500",
              }}
            >
              Olá, {user?.name || "Mãe Valente"}
            </Text>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.headlineSmall.fontSize,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              Seu Progresso
            </Text>
          </View>
          <View
            style={{
              backgroundColor: OVERLAY.white.strong,
              borderRadius: RADIUS.full,
              padding: SPACING.md,
            }}
          >
            <Ionicons name="trophy" size={28} color={COLORS.text.inverse} />
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ flexDirection: "row", gap: SPACING.md }}>
          <View
            style={{
              flex: 1,
              backgroundColor: OVERLAY.white.strong,
              borderRadius: RADIUS["2xl"],
              padding: SPACING.lg,
            }}
          >
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                fontWeight: "500",
                marginBottom: 4,
              }}
            >
              Sequência Atual
            </Text>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.displaySmall.fontSize,
                fontWeight: "700",
              }}
            >
              {currentStreak}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                marginTop: 2,
              }}
            >
              dias
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: OVERLAY.white.strong,
              borderRadius: RADIUS["2xl"],
              padding: SPACING.lg,
            }}
          >
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                fontWeight: "500",
                marginBottom: 4,
              }}
            >
              Melhor Sequência
            </Text>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.displaySmall.fontSize,
                fontWeight: "700",
              }}
            >
              {bestStreak}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                marginTop: 2,
              }}
            >
              dias
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: OVERLAY.white.strong,
              borderRadius: RADIUS["2xl"],
              padding: SPACING.lg,
            }}
          >
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                fontWeight: "500",
                marginBottom: 4,
              }}
            >
              Check-ins
            </Text>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.displaySmall.fontSize,
                fontWeight: "700",
              }}
            >
              {totalCheckIns}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                marginTop: 2,
              }}
            >
              total
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING["3xl"] }}
      >
        {/* View Mode Selector */}
        <View style={{ paddingHorizontal: SPACING["2xl"], paddingVertical: SPACING.lg }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.neutral[100],
              borderRadius: RADIUS.full,
              padding: SPACING.xs,
            }}
          >
            {(["week", "month", "year"] as ViewMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => handleViewModeChange(mode)}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    paddingVertical: SPACING.sm,
                    paddingHorizontal: SPACING.lg,
                    borderRadius: RADIUS.full,
                    backgroundColor:
                      viewMode === mode ? COLORS.neutral[0] : "transparent",
                    ...SHADOWS.sm,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: TYPOGRAPHY.bodySmall.fontSize,
                      fontWeight: "600",
                      color:
                        viewMode === mode
                          ? COLORS.primary[600]
                          : COLORS.neutral[600],
                    }}
                  >
                    {mode === "week"
                      ? "Semana"
                      : mode === "month"
                      ? "Mês"
                      : "Ano"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Weekly Calendar Grid */}
        {viewMode === "week" && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{ paddingHorizontal: SPACING["2xl"], marginBottom: SPACING["2xl"] }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.titleMedium.fontSize,
                fontWeight: "700",
                color: COLORS.neutral[800],
                marginBottom: SPACING.lg,
              }}
            >
              Esta Semana
            </Text>
            <WeeklyCalendar />
          </Animated.View>
        )}

        {/* Mood Distribution */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={{ paddingHorizontal: SPACING["2xl"], marginBottom: SPACING["2xl"] }}
        >
          <View
            style={{
              backgroundColor: COLORS.neutral[0],
              borderRadius: RADIUS["3xl"],
              padding: SPACING["2xl"],
              ...SHADOWS.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.lg,
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.titleMedium.fontSize,
                  fontWeight: "700",
                  color: COLORS.neutral[800],
                }}
              >
                Como você tem se sentido
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.primary[50],
                  borderRadius: RADIUS.full,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.xs,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary[600],
                    fontSize: TYPOGRAPHY.labelSmall.fontSize,
                    fontWeight: "600",
                  }}
                >
                  {averageMood}/5
                </Text>
              </View>
            </View>

            <MoodDistribution />
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={{ paddingHorizontal: SPACING["2xl"], marginBottom: SPACING["2xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.lg,
            }}
          >
            Conquistas
          </Text>
          <View style={{ gap: SPACING.md }}>
            <AchievementCard
              icon="flame"
              title="Sequência de fogo"
              description="7 dias seguidos de check-in"
              progress={currentStreak}
              total={7}
              color={GRADIENTS.streakIcon}
              unlocked={currentStreak >= 7}
            />
            <AchievementCard
              icon="star"
              title="Primeira semana"
              description="Complete sua primeira semana"
              progress={totalCheckIns}
              total={7}
              color={COLORS.secondary[500]}
              unlocked={totalCheckIns >= 7}
            />
            <AchievementCard
              icon="heart"
              title="Autocuidado"
              description="30 check-ins completados"
              progress={totalCheckIns}
              total={30}
              color={COLORS.primary[500]}
              unlocked={totalCheckIns >= 30}
            />
          </View>
        </Animated.View>

        {/* Community Stats */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{ paddingHorizontal: SPACING["2xl"], marginBottom: SPACING["2xl"] }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "700",
              color: COLORS.neutral[800],
              marginBottom: SPACING.lg,
            }}
          >
            Comunidade Mãe Valente
          </Text>
          <LinearGradient
            colors={[COLORS.secondary[50], COLORS.primary[50]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: RADIUS["3xl"],
              padding: SPACING["2xl"],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.lg,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.neutral[0],
                  borderRadius: RADIUS.full,
                  padding: SPACING.md,
                  marginRight: SPACING.md,
                }}
              >
                <Ionicons name="people" size={24} color={COLORS.primary[500]} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.headlineSmall.fontSize,
                    fontWeight: "700",
                    color: COLORS.neutral[800],
                  }}
                >
                  1.248
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    color: COLORS.neutral[600],
                  }}
                >
                  mães conectadas hoje
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: SPACING.md }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: OVERLAY.white.prominent,
                  borderRadius: RADIUS["2xl"],
                  padding: SPACING.md,
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.labelSmall.fontSize,
                    color: COLORS.neutral[600],
                    marginBottom: 4,
                  }}
                >
                  Posts hoje
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.titleLarge.fontSize,
                    fontWeight: "700",
                    color: COLORS.neutral[800],
                  }}
                >
                  127
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: OVERLAY.white.prominent,
                  borderRadius: RADIUS["2xl"],
                  padding: SPACING.md,
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.labelSmall.fontSize,
                    color: COLORS.neutral[600],
                    marginBottom: 4,
                  }}
                >
                  Apoio recebido
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.titleLarge.fontSize,
                    fontWeight: "700",
                    color: COLORS.neutral[800],
                  }}
                >
                  892
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Weekly Calendar Component
function WeeklyCalendar() {
  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return date.getDate();
  });

  // Mock completion data
  const completed = [true, true, false, true, true, true, false];

  return (
    <View
      style={{
        backgroundColor: COLORS.neutral[0],
        borderRadius: RADIUS["3xl"],
        padding: SPACING["2xl"],
        ...SHADOWS.sm,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {days.map((day, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                color: COLORS.neutral[500],
                fontWeight: "500",
                marginBottom: SPACING.sm,
              }}
            >
              {day}
            </Text>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: completed[index]
                  ? COLORS.primary[500]
                  : index === new Date().getDay()
                  ? COLORS.primary[50]
                  : COLORS.neutral[100],
                borderWidth: index === new Date().getDay() && !completed[index] ? 2 : 0,
                borderColor: COLORS.primary[500],
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: completed[index]
                    ? COLORS.neutral[0]
                    : index === new Date().getDay()
                    ? COLORS.primary[600]
                    : COLORS.neutral[400],
                }}
              >
                {dates[index]}
              </Text>
            </View>
            {completed[index] && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.primary[500]}
                style={{ marginTop: 4 }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// Mood Distribution Component
function MoodDistribution() {
  const moods = [
    { emoji: "😢", label: "Difícil", count: 2, color: COLORS.mood.calm },
    { emoji: "😕", label: "Cansada", count: 5, color: COLORS.mood.tired },
    { emoji: "😐", label: "Ok", count: 8, color: COLORS.secondary[400] },
    { emoji: "🙂", label: "Bem", count: 12, color: COLORS.primary[500] },
    { emoji: "😊", label: "Ótimo", count: 7, color: COLORS.primary[300] },
  ];

  const maxCount = Math.max(...moods.map((m) => m.count));

  return (
    <View style={{ gap: SPACING.md }}>
      {moods.map((mood, index) => {
        const percentage = (mood.count / maxCount) * 100;
        return (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.sm,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
                <Text style={{ fontSize: 24 }}>{mood.emoji}</Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    fontWeight: "500",
                    color: COLORS.neutral[700],
                  }}
                >
                  {mood.label}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[600],
                }}
              >
                {mood.count}x
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: COLORS.neutral[100],
                borderRadius: RADIUS.full,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: mood.color,
                  borderRadius: RADIUS.full,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

// Achievement Card Component
interface AchievementCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  progress: number;
  total: number;
  color: string;
  unlocked: boolean;
}

function AchievementCard({
  icon,
  title,
  description,
  progress,
  total,
  color,
  unlocked,
}: AchievementCardProps) {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <View
      style={{
        backgroundColor: COLORS.neutral[0],
        borderRadius: RADIUS["2xl"],
        padding: SPACING.lg,
        opacity: unlocked ? 1 : 0.6,
        ...SHADOWS.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: unlocked ? color : COLORS.neutral[300],
            alignItems: "center",
            justifyContent: "center",
            marginRight: SPACING.md,
          }}
        >
          <Ionicons
            name={icon}
            size={24}
            color={unlocked ? COLORS.text.inverse : COLORS.neutral[400]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                fontWeight: "700",
                color: COLORS.neutral[800],
              }}
            >
              {title}
            </Text>
            {unlocked && (
              <Ionicons name="checkmark-circle" size={20} color={color} />
            )}
          </View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.labelSmall.fontSize,
              color: COLORS.neutral[600],
              marginBottom: SPACING.sm,
            }}
          >
            {description}
          </Text>
          <View
            style={{
              height: 6,
              backgroundColor: COLORS.neutral[100],
              borderRadius: RADIUS.full,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: unlocked ? color : COLORS.neutral[300],
                borderRadius: RADIUS.full,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.labelSmall.fontSize,
              color: COLORS.neutral[500],
              marginTop: 4,
            }}
          >
            {progress}/{total}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Helper functions
function calculateStreak(checkIns: CheckInData[]): number {
  if (checkIns.length === 0) return 0;

  const sortedDates = checkIns
    .map((c) => new Date(c.date))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(sortedDates[i]);
    checkDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateAverageMood(checkIns: CheckInData[]): string {
  if (checkIns.length === 0) return "0.0";

  const moods = checkIns
    .map((c) => c.mood)
    .filter((m) => m !== null && m !== undefined);

  if (moods.length === 0) return "0.0";

  const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
  return avg.toFixed(1);
}
