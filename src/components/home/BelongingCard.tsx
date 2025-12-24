/**
 * BelongingCard - Card de Pertencimento (discreto)
 *
 * SECUNDÁRIO na hierarquia da Home
 * - Texto curto: "Você não está sozinha"
 * - Link para Comunidade
 * - Sem gradiente chamativo (discreto)
 */

import React from "react";
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
import { brand, spacing, radius, neutral } from "../../theme/tokens";

interface BelongingCardProps {
  onPress: () => void;
}

export const BelongingCard: React.FC<BelongingCardProps> = ({ onPress }) => {
  const { isDark } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Cores discretas (sem gradiente chamativo)
  const cardBg = isDark ? "rgba(0, 0, 0, 0.3)" : brand.primary[50];
  const borderColor = isDark ? "rgba(0, 0, 0, 0.5)" : brand.primary[100];
  const textMain = isDark ? brand.primary[300] : brand.primary[700];
  const textMuted = isDark ? neutral[400] : brand.primary[600];
  const iconColor = isDark ? brand.primary[400] : brand.primary[500];

  return (
    <Animated.View entering={FadeInUp.delay(150).duration(500)} style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel="Você não está sozinha - Ver comunidade"
        accessibilityRole="button"
        accessibilityHint="Toque para ver a comunidade de mães"
        style={[
          styles.container,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={20} color={iconColor} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: textMain }]}>
            Você não está sozinha
          </Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>
            Conecte-se com outras mães
          </Text>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={18} color={textMuted} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    paddingRight: spacing.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
});

export default BelongingCard;
