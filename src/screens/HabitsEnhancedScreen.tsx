/**
 * Nossa Maternidade - HabitsEnhancedScreen
 * Premium habits tracking with statistics and streaks
 */

import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useHabitsStore, Habit } from "../state/store";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../theme/tokens";

// Overlay compatibility mapping
const OVERLAY = {
  white: {
    text: "rgba(255, 255, 255, 0.7)",
    textStrong: "rgba(255, 255, 255, 0.8)",
    strong: "rgba(255, 255, 255, 0.2)",
  },
} as const;

// Gradients compatibility (from design-system.ts)
const GRADIENTS = {
  successGradient: ["#10B981", "#5A9D68", "#4A8C58"] as const,
  streakBg: "#FEF3C7",
  streakIcon: "#F59E0B",
  streakText: "#B45309",
  completionLight: "#D4EDD9",
  completionMedium: "#A7D4B4",
} as const;

type ViewMode = "today" | "week" | "month";

export default function HabitsEnhancedScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<ViewMode>("today");

  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  const today = new Date().toISOString().split("T")[0];
  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalStreak = useMemo(() => {
    return habits.reduce((max, h) => Math.max(max, h.streak), 0);
  }, [habits]);

  const bestStreak = useMemo(() => {
    return habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  }, [habits]);

  const handleToggleHabit = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHabit(id, today);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background.primary }}>
      {/* Header */}
      <LinearGradient
        colors={GRADIENTS.successGradient}
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
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginRight: SPACING.lg }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.inverse} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.bodySmall.fontSize,
                fontWeight: "500",
              }}
            >
              Meus Rituais
            </Text>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.headlineSmall.fontSize,
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              Habitos
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="add-circle" size={32} color={COLORS.text.inverse} />
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.lg }}>
          <View
            style={{
              flex: 1,
              backgroundColor: OVERLAY.white.strong,
              borderRadius: RADIUS["2xl"],
              padding: SPACING.lg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.sm,
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.text.inverse} />
              <Text
                style={{
                  color: OVERLAY.white.textStrong,
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                }}
              >
                hoje
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: 28,
                fontWeight: "700",
              }}
            >
              {completedCount}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
              }}
            >
              de {totalCount}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.sm,
              }}
            >
              <Ionicons name="flame" size={20} color={COLORS.text.inverse} />
              <Text
                style={{
                  color: OVERLAY.white.textStrong,
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                }}
              >
                atual
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: 28,
                fontWeight: "700",
              }}
            >
              {totalStreak}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.sm,
              }}
            >
              <Ionicons name="trophy" size={20} color={COLORS.text.inverse} />
              <Text
                style={{
                  color: OVERLAY.white.textStrong,
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                }}
              >
                recorde
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: 28,
                fontWeight: "700",
              }}
            >
              {bestStreak}
            </Text>
            <Text
              style={{
                color: OVERLAY.white.text,
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
              }}
            >
              dias
            </Text>
          </View>
        </View>

        {/* Progress Circle */}
        <View style={{ alignItems: "center", paddingVertical: SPACING["2xl"] }}>
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 12,
              borderColor: OVERLAY.white.strong,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 12,
                borderColor: COLORS.neutral[0],
                borderTopColor: "transparent",
                borderRightColor: completionPercentage >= 25 ? COLORS.neutral[0] : "transparent",
                borderBottomColor: completionPercentage >= 50 ? COLORS.neutral[0] : "transparent",
                borderLeftColor: completionPercentage >= 75 ? COLORS.neutral[0] : "transparent",
                transform: [{ rotate: "-45deg" }],
              }}
            />
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: 36,
                fontWeight: "700",
              }}
            >
              {completionPercentage}%
            </Text>
            <Text
              style={{
                color: OVERLAY.white.textStrong,
                fontSize: TYPOGRAPHY.bodySmall.fontSize,
                marginTop: 2,
              }}
            >
              completo
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING["2xl"] }}
      >
        {/* View Mode Tabs */}
        <View style={{ paddingHorizontal: SPACING["2xl"], paddingVertical: SPACING.lg }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.neutral[0],
              borderRadius: RADIUS.full,
              padding: SPACING.xs,
              ...SHADOWS.sm,
            }}
          >
            {(["today", "week", "month"] as ViewMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => handleViewModeChange(mode)}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    paddingVertical: SPACING.sm + 2,
                    borderRadius: RADIUS.full,
                    backgroundColor:
                      viewMode === mode ? COLORS.semantic.success : "transparent",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: TYPOGRAPHY.bodySmall.fontSize,
                      fontWeight: "600",
                      color:
                        viewMode === mode ? COLORS.neutral[0] : COLORS.neutral[600],
                    }}
                  >
                    {mode === "today"
                      ? "Hoje"
                      : mode === "week"
                      ? "Semana"
                      : "Mes"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Weekly Heatmap */}
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
            <WeeklyHeatmap habits={habits} />
          </Animated.View>
        )}

        {/* Habits List */}
        {viewMode === "today" && (
          <View style={{ paddingHorizontal: SPACING["2xl"] }}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.titleMedium.fontSize,
                fontWeight: "700",
                color: COLORS.neutral[800],
                marginBottom: SPACING.lg,
              }}
            >
              Seus habitos de hoje
            </Text>
            {habits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                index={index}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}

        {/* Monthly Stats */}
        {viewMode === "month" && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{ paddingHorizontal: SPACING["2xl"] }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.titleMedium.fontSize,
                fontWeight: "700",
                color: COLORS.neutral[800],
                marginBottom: SPACING.lg,
              }}
            >
              Este Mes
            </Text>
            <MonthlyStats habits={habits} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

// Habit Card Component
interface HabitCardProps {
  habit: Habit;
  index: number;
  onToggle: (id: string) => void;
}

function HabitCard({ habit, index, onToggle }: HabitCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 50).duration(500).springify()}
      style={{ marginBottom: SPACING.md }}
    >
      <Pressable onPress={() => onToggle(habit.id)}>
        <View
          style={{
            backgroundColor: COLORS.neutral[0],
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            borderWidth: 2,
            borderColor: habit.completed ? habit.color : COLORS.neutral[100],
            ...SHADOWS.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: RADIUS["2xl"],
                alignItems: "center",
                justifyContent: "center",
                marginRight: SPACING.lg,
                backgroundColor: habit.completed
                  ? habit.color
                  : `${habit.color}15`,
              }}
            >
              <Ionicons
                name={habit.icon as keyof typeof Ionicons.glyphMap}
                size={26}
                color={habit.completed ? "#FFF" : habit.color}
              />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  fontWeight: "700",
                  color: COLORS.neutral[800],
                  marginBottom: 2,
                }}
              >
                {habit.title}
              </Text>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  color: COLORS.neutral[600],
                  marginBottom: SPACING.sm,
                }}
              >
                {habit.description}
              </Text>
              {habit.streak > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: GRADIENTS.streakBg,
                      borderRadius: RADIUS.full,
                      paddingHorizontal: SPACING.sm + 2,
                      paddingVertical: SPACING.xs,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="flame" size={14} color={GRADIENTS.streakIcon} />
                    <Text
                      style={{
                        color: GRADIENTS.streakText,
                        fontSize: TYPOGRAPHY.labelSmall.fontSize,
                        fontWeight: "600",
                        marginLeft: 4,
                      }}
                    >
                      {habit.streak} dias
                    </Text>
                  </View>
                  {habit.streak === habit.bestStreak && habit.streak > 3 && (
                    <View
                      style={{
                        backgroundColor: COLORS.secondary[50],
                        borderRadius: RADIUS.full,
                        paddingHorizontal: SPACING.sm + 2,
                        paddingVertical: SPACING.xs,
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: SPACING.sm,
                      }}
                    >
                      <Ionicons name="trophy" size={12} color={COLORS.secondary[500]} />
                      <Text
                        style={{
                          color: COLORS.secondary[700],
                          fontSize: TYPOGRAPHY.labelSmall.fontSize,
                          fontWeight: "600",
                          marginLeft: 4,
                        }}
                      >
                        Recorde!
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Checkbox */}
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: habit.completed ? habit.color : "transparent",
                borderWidth: 2.5,
                borderColor: habit.completed ? habit.color : COLORS.neutral[300],
              }}
            >
              {habit.completed && (
                <Ionicons name="checkmark" size={18} color={COLORS.text.inverse} />
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Weekly Heatmap Component
function WeeklyHeatmap({ habits }: { habits: Habit[] }) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return {
      day: days[i],
      date: date.getDate(),
      completed: Math.floor(Math.random() * (habits.length + 1)),
      total: habits.length,
    };
  });

  return (
    <View
      style={{
        backgroundColor: COLORS.neutral[0],
        borderRadius: RADIUS["2xl"],
        padding: SPACING["2xl"],
        ...SHADOWS.sm,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {weekData.map((day, index) => {
          const completion = day.total > 0 ? (day.completed / day.total) * 100 : 0;
          const isToday = index === new Date().getDay();

          return (
            <View key={index} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                  color: COLORS.neutral[500],
                  fontWeight: "500",
                  marginBottom: SPACING.sm,
                }}
              >
                {day.day}
              </Text>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: RADIUS.xl,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: isToday ? 2 : 0,
                  borderColor: COLORS.semantic.success,
                  backgroundColor:
                    completion >= 100
                      ? COLORS.semantic.success
                      : completion >= 50
                      ? GRADIENTS.completionMedium
                      : completion > 0
                      ? GRADIENTS.completionLight
                      : COLORS.neutral[100],
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    fontWeight: "700",
                    color:
                      completion >= 50 ? COLORS.neutral[0] : COLORS.neutral[600],
                  }}
                >
                  {day.date}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                  color: COLORS.neutral[500],
                  marginTop: SPACING.sm,
                }}
              >
                {day.completed}/{day.total}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Monthly Stats Component
function MonthlyStats({ habits }: { habits: Habit[] }) {
  const categoryStats = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = {
        completed: 0,
        total: 0,
        color: habit.color,
      };
    }
    acc[habit.category].total++;
    if (habit.completed) acc[habit.category].completed++;
    return acc;
  }, {} as Record<string, { completed: number; total: number; color: string }>);

  const categoryLabels: Record<string, string> = {
    "self-care": "Autocuidado",
    health: "Saude",
    mindfulness: "Paz Interior",
    connection: "Conexao",
    growth: "Crescimento",
  };

  return (
    <View style={{ gap: SPACING.lg }}>
      {Object.entries(categoryStats).map(([category, stats], index) => {
        const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        return (
          <Animated.View
            key={category}
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={{
              backgroundColor: COLORS.neutral[0],
              borderRadius: RADIUS["2xl"],
              padding: SPACING.xl,
              ...SHADOWS.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: SPACING.md,
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  fontWeight: "700",
                  color: COLORS.neutral[800],
                }}
              >
                {categoryLabels[category] || category}
              </Text>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[600],
                }}
              >
                {stats.completed}/{stats.total}
              </Text>
            </View>
            <View
              style={{
                height: 12,
                backgroundColor: COLORS.neutral[100],
                borderRadius: RADIUS.full,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${percentage}%`,
                  backgroundColor: stats.color,
                  height: "100%",
                  borderRadius: RADIUS.full,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: TYPOGRAPHY.labelSmall.fontSize,
                color: COLORS.neutral[500],
                marginTop: SPACING.sm,
              }}
            >
              {Math.round(percentage)}% completo este mes
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}
