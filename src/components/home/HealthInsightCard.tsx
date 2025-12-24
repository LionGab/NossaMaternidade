/**
 * HealthInsightCard - Card de Insights de Saúde Inteligentes
 *
 * Mostra insights baseados em padrões de dados do usuário:
 * - Humor baixo persistente → sugere conversa/especialista
 * - Sono ruim → dicas de descanso
 * - Energia baixa → investigar causas
 * - Progresso positivo → celebrar!
 *
 * Este é o gateway para telemedicina (coming soon)
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { useHealthInsights, type InsightPriority } from "../../hooks/useHealthInsights";
import { spacing, radius, shadows, semantic } from "../../theme/tokens";
import type { RootStackParamList } from "../../types/navigation";

// =======================
// PRIORITY STYLES
// =======================

const PRIORITY_GRADIENTS: Record<InsightPriority, readonly [string, string]> = {
  high: [semantic.light.errorLight, semantic.light.error] as const,
  medium: [semantic.light.warningLight, semantic.light.warning] as const,
  low: ["#F3E8FF", "#D8B4FE"] as const,
};

const PRIORITY_ICONS: Record<InsightPriority, keyof typeof Ionicons.glyphMap> = {
  high: "alert-circle",
  medium: "information-circle",
  low: "sparkles",
};

// =======================
// COMPONENT
// =======================

export const HealthInsightCard: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, isDark, text: themeText } = useTheme();
  const { topInsight } = useHealthInsights();

  // Handlers devem ser definidos antes de qualquer return condicional
  const handlePrimaryAction = useCallback(async () => {
    if (!topInsight) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const screen = topInsight.actions.primary.screen;
    if (screen) {
      if (screen === "Assistant") {
        navigation.navigate("MainTabs", { screen: "Assistant" });
      } else if (screen === "Habits") {
        navigation.navigate("Habits");
      } else if (screen === "Affirmations") {
        navigation.navigate("Affirmations");
      } else if (screen === "Community") {
        navigation.navigate("MainTabs", { screen: "Community" });
      }
    }
  }, [navigation, topInsight]);

  // Se não há insights, não renderiza
  if (!topInsight) {
    return null;
  }

  // Cores baseadas na prioridade
  const gradient = PRIORITY_GRADIENTS[topInsight.priority];
  const iconName = PRIORITY_ICONS[topInsight.priority];

  // Cores do tema
  const cardBg = isDark ? colors.neutral[800] : colors.neutral[50];
  const borderColor = isDark ? colors.neutral[700] : colors.neutral[200];
  const textMain = themeText?.primary || (isDark ? colors.neutral[100] : colors.neutral[900]);
  const textMuted = themeText?.secondary || (isDark ? colors.neutral[400] : colors.neutral[600]);

  // Estilo especial para alta prioridade
  const isHighPriority = topInsight.priority === "high";
  const containerStyle = isHighPriority
    ? { borderColor: semantic.light.error, borderWidth: 2 }
    : { borderColor, borderWidth: 1 };

  return (
    <Animated.View entering={FadeInUp.delay(150).duration(500)}>
      <Pressable
        onPress={handlePrimaryAction}
        accessibilityLabel={`Insight de saúde: ${topInsight.title}`}
        accessibilityRole="button"
        accessibilityHint="Toque para ver mais detalhes"
        style={({ pressed }) => [
          styles.container,
          containerStyle,
          {
            backgroundColor: cardBg,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {/* Gradient accent bar */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.accentBar}
        />

        <View style={styles.contentWrapper}>
          {/* Header with icon and emoji */}
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <Ionicons name={iconName} size={20} color={gradient[1]} />
              <Text style={styles.emoji}>{topInsight.emoji}</Text>
            </View>
            {isHighPriority && (
              <View style={[styles.priorityBadge, { backgroundColor: semantic.light.errorLight }]}>
                <Text style={[styles.priorityText, { color: semantic.light.error }]}>
                  Importante
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: textMain }]}>{topInsight.title}</Text>

          {/* Message */}
          <Text style={[styles.message, { color: textMuted }]} numberOfLines={3}>
            {topInsight.message}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Primary CTA */}
            <Animated.View entering={FadeInRight.delay(200).duration(300)}>
              <Pressable
                onPress={handlePrimaryAction}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: gradient[1], opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {topInsight.actions.primary.label}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </Animated.View>
          </View>

          {/* Stats footer (optional) */}
          {topInsight.data?.daysAnalyzed && (
            <View style={styles.footer}>
              <Ionicons name="analytics-outline" size={12} color={textMuted} />
              <Text style={[styles.footerText, { color: textMuted }]}>
                Baseado em {topInsight.data.daysAnalyzed} dias de dados
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

// =======================
// STYLES
// =======================

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.md,
  },
  accentBar: {
    width: 6,
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    lineHeight: 24,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    minHeight: 44, // iOS HIG
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    minHeight: 44, // iOS HIG
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
  },
});

export default HealthInsightCard;
