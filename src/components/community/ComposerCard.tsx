/**
 * ComposerCard - Card para criar novo post + tópicos
 * Design: Calm FemTech 2025 - Hierarquia visual clara, espaçamentos generosos
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COMMUNITY_TOPICS } from "../../config/community";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { RADIUS, SHADOWS, SPACING } from "../../theme/design-system";

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
      ? isDark ? brand.accent[300] : brand.accent[600]
      : isDark ? Tokens.brand.primary[300] : Tokens.brand.primary[600];

    const bg = isAccent
      ? isDark ? `${brand.accent[500]}18` : Tokens.brand.accent[50]
      : isDark ? `${Tokens.brand.primary[500]}18` : Tokens.brand.primary[50];

    const border = isAccent
      ? isDark ? brand.accent[700] : brand.accent[200]
      : isDark ? Tokens.brand.primary[700] : Tokens.brand.primary[200];

    return { color, bg, border };
  };

  return (
    <View style={styles.container}>
      {/* Card principal - SIMPLIFICADO */}
      <Pressable
        onPress={onPress}
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
                backgroundColor: isDark
                  ? Tokens.brand.primary[900]
                  : Tokens.brand.primary[50],
              },
            ]}
          >
            <Ionicons name="person" size={22} color={Tokens.brand.primary[500]} />
          </View>
          <Text style={[styles.placeholder, { color: textSecondary }]}>
            No que você está pensando?
          </Text>
        </View>
      </Pressable>

      {/* Tópicos - DESIGN MELHORADO */}
      <View style={styles.topicsSection}>
        <Text style={[styles.topicsSectionTitle, { color: textMain }]}>
          Sobre o que você quer falar?
        </Text>
        <View style={styles.topicsGrid}>
          {COMMUNITY_TOPICS.map((topic) => {
            const { color, bg, border } = getTopicColors(topic.accent);

            return (
              <Pressable
                key={topic.label}
                onPress={handleTopicPress}
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
                <Ionicons name={topic.icon} size={16} color={color} />
                <Text style={[styles.topicChipText, { color }]}>
                  {topic.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
});

ComposerCard.displayName = "ComposerCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["2xl"], // Mais espaço antes do divider
  },

  // === CARD PRINCIPAL ===
  card: {
    borderRadius: RADIUS["2xl"], // 32pt - ultra smooth
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
    marginBottom: SPACING.xl, // Espaço entre card e topics
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  placeholder: {
    flex: 1,
    fontSize: 16, // Aumentado de 15
    fontFamily: "Manrope_500Medium",
    lineHeight: 24,
  },

  // === TÓPICOS ===
  topicsSection: {
    // Sem card envolvendo - mais limpo
  },
  topicsSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    marginBottom: SPACING.md,
    letterSpacing: -0.3,
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md, // Aumentado de sm para md (12pt)
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7, // Espaço entre ícone e texto
    paddingHorizontal: 14, // Aumentado de 12
    paddingVertical: 10, // Aumentado de 8
    borderRadius: RADIUS.full,
    borderWidth: 1.5, // Borda mais visível
  },
  topicChipText: {
    fontSize: 14, // Aumentado de 13
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },
});
