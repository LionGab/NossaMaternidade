/**
 * QuickActionsBar - Barra de Acesso Rápido
 *
 * TERCIÁRIO na hierarquia da Home
 * - 4 ícones horizontais compactos
 * - Touch targets 44pt+
 * - Navegação para tabs existentes
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { useHabitsStore } from "../../state/store";
import { brand, spacing, radius, shadows, accessibility } from "../../theme/tokens";

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: number;
}

interface QuickActionsBarProps {
  onNavigate: (route: string) => void;
}

// Componente de botão individual
const QuickActionButton: React.FC<{
  action: QuickAction;
  onPress: () => void;
  isDark: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
}> = React.memo(({ action, onPress, isDark, colors }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconBg = isDark ? colors.neutral[800] : colors.neutral[100];
  const iconColor = isDark ? colors.neutral[300] : colors.neutral[600];
  const textColor = isDark ? colors.neutral[400] : colors.neutral[600];

  return (
    <Animated.View style={[styles.actionWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={action.label}
        accessibilityRole="button"
        style={styles.actionButton}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name={action.icon} size={22} color={iconColor} />

          {/* Badge */}
          {action.badge !== undefined && action.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {action.badge > 9 ? "9+" : action.badge}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
          {action.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

QuickActionButton.displayName = "QuickActionButton";

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ onNavigate }) => {
  const { colors, isDark } = useTheme();

  // Store para badges
  const habits = useHabitsStore((s) => s.habits);
  const getCompletedToday = useHabitsStore((s) => s.getCompletedToday);

  const completedHabits = getCompletedToday();
  const pendingHabits = habits.length - completedHabits;

  // Ações disponíveis
  const quickActions: QuickAction[] = [
    {
      id: "habits",
      label: "Hábitos",
      icon: "checkmark-circle-outline",
      route: "Habits",
      badge: pendingHabits > 0 ? pendingHabits : undefined,
    },
    {
      id: "cycle",
      label: "Diário",
      icon: "calendar-outline",
      route: "DailyLog",
    },
    {
      id: "community",
      label: "Comunidade",
      icon: "people-outline",
      route: "Community",
    },
    {
      id: "more",
      label: "Mais",
      icon: "grid-outline",
      route: "MyCare",
    },
  ];

  // Handler de navegação
  const handlePress = useCallback(async (route: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNavigate(route);
  }, [onNavigate]);

  // Cores do tema
  const cardBg = isDark ? colors.background.secondary : "#FFFFFF";
  const borderColor = isDark ? colors.neutral[700] : colors.neutral[200];

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(500)}
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor,
        },
        shadows.sm,
      ]}
    >
      {quickActions.map((action) => (
        <QuickActionButton
          key={action.id}
          action={action}
          onPress={() => handlePress(action.route)}
          isDark={isDark}
          colors={colors}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  actionWrapper: {
    flex: 1,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    minWidth: accessibility.minTapTarget,
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: brand.primary[500],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 11,
    fontWeight: "600",
  },
});

export default QuickActionsBar;
