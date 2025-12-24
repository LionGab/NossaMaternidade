/**
 * ComposerCard - Card para criar novo post + tópicos
 * Design: Premium 2025 - ULTRA LIMPO, espaçamentos generosos
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { COMMUNITY_TOPICS } from "../../config/community";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, radius, shadows, spacing } from "../../theme/tokens";

// Aliases de compatibilidade
const RADIUS = radius;
const SHADOWS = shadows;
const SPACING = spacing;

interface ComposerCardProps {
  onPress: () => void;
}

export const ComposerCard: React.FC<ComposerCardProps> = React.memo(({ onPress }) => {
  const { isDark, brand } = useTheme();

  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.text.light.secondary;
  const textMain = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[100];

  const handleTopicPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getTopicColors = (isAccent: boolean) => {
    const color = isAccent
      ? isDark
        ? brand.accent[300]
        : brand.accent[600]
      : isDark
        ? Tokens.brand.primary[300]
        : Tokens.brand.primary[600];

    const bg = isAccent
      ? isDark
        ? `${brand.accent[500]}20`
        : Tokens.brand.accent[50]
      : isDark
        ? `${Tokens.brand.primary[500]}20`
        : Tokens.brand.primary[50];

    const border = isAccent
      ? isDark
        ? brand.accent[700]
        : brand.accent[200]
      : isDark
        ? Tokens.brand.primary[700]
        : Tokens.brand.primary[200];

    return { color, bg, border };
  };

  return (
    <View style={styles.container}>
      {/* Card principal - ULTRA SIMPLIFICADO */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Criar nova publicação"
        accessibilityHint="Toque para escrever um novo post"
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: bgCard,
            borderColor,
            opacity: pressed ? 0.96 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <View style={styles.inputRow}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark ? Tokens.brand.primary[900] : Tokens.brand.primary[50],
              },
            ]}
          >
            <Ionicons name="person" size={24} color={Tokens.brand.primary[500]} />
          </View>
          <Text style={[styles.placeholder, { color: textSecondary }]}>
            No que você está pensando?
          </Text>
        </View>
      </Pressable>

      {/* Título dos tópicos */}
      <Text style={[styles.topicsTitle, { color: textMain }]} accessibilityRole="text">
        Sobre o que você quer falar?
      </Text>

      {/* Tópicos - SCROLLABLE HORIZONTAL (mais clean) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicsScrollContent}
      >
        {COMMUNITY_TOPICS.map((topic) => {
          const { color, bg, border } = getTopicColors(topic.accent);

          return (
            <Pressable
              key={topic.label}
              onPress={handleTopicPress}
              accessibilityRole="button"
              accessibilityLabel={`Tópico: ${topic.label}`}
              accessibilityHint="Toque para criar post sobre este tópico"
              style={({ pressed }) => [
                styles.topicChip,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <Ionicons name={topic.icon} size={18} color={color} />
              <Text style={[styles.topicChipText, { color }]}>{topic.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

ComposerCard.displayName = "ComposerCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["3xl"], // 32pt - MUITO mais espaço
  },

  // === CARD PRINCIPAL ===
  card: {
    borderRadius: RADIUS["3xl"], // 40pt - ULTRA smooth
    paddingHorizontal: SPACING["2xl"], // 24pt - Aumentado de xl (20pt)
    paddingVertical: SPACING.xl, // 20pt - Aumentado de lg (16pt)
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52, // Aumentado de 48
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg, // Aumentado de md
  },
  placeholder: {
    flex: 1,
    fontSize: 17, // Aumentado de 16
    fontFamily: "Manrope_500Medium",
    lineHeight: 26,
    letterSpacing: -0.3,
  },

  // === TÓPICOS ===
  topicsTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },
  topicsScrollContent: {
    paddingRight: SPACING.xl,
    gap: SPACING.lg, // 16pt - Aumentado de md (12pt)
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18, // Aumentado de 14
    paddingVertical: 12, // Aumentado de 10
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  topicChipText: {
    fontSize: 15, // Aumentado de 14
    fontWeight: "700", // Aumentado de 600
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
  },
});
