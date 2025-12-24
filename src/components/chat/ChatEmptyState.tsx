/**
 * ChatEmptyState - Empty state do chat
 * Componente extraído do AssistantScreen para melhor organização
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { COLORS, COLORS_DARK, spacing } from "../../theme/tokens";
import { Avatar } from "../ui";

interface SuggestedPrompt {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: "nutrition-outline",
    title: "Alimentação",
    subtitle: "O que posso comer na gravidez?",
  },
  {
    icon: "fitness-outline",
    title: "Exercícios",
    subtitle: "Atividades seguras para gestantes",
  },
  {
    icon: "medical-outline",
    title: "Sintomas",
    subtitle: "Quando devo procurar um médico?",
  },
  {
    icon: "heart-outline",
    title: "Bem-estar",
    subtitle: "Dicas para aliviar enjoos",
  },
];

interface ChatEmptyStateProps {
  onSuggestedPrompt: (text: string) => void;
  screenWidth?: number;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSuggestedPrompt,
  screenWidth = 375,
}) => {
  const { isDark } = useTheme();
  const palette = isDark ? COLORS_DARK : COLORS;
  const primaryColor = palette.primary[500];
  const textPrimary = palette.text.primary;
  const textSecondary = palette.text.secondary;
  const bgSecondary = palette.background.secondary;
  const primaryLight = palette.primary[100];
  const border = palette.primary[200];

  // Valores responsivos
  const isTablet = screenWidth >= 768;
  const maxContentWidth = isTablet ? 600 : screenWidth - 48;
  const horizontalPadding = screenWidth < 375 ? 12 : 24;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
          maxWidth: maxContentWidth,
        },
      ]}
    >
      {/* Logo/Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar size={72} isNathIA={true} />
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: textPrimary,
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        NathIA
      </Text>
      <Text style={{ fontSize: 15, color: textSecondary, textAlign: "center", marginBottom: 24 }}>
        Sua assistente inteligente 24h
      </Text>

      {/* Welcome Message */}
      <View
        style={{
          backgroundColor: primaryLight,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: bgSecondary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name="sparkles" size={20} color={primaryColor} />
        </View>
        <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: textSecondary }}>
          Olá! Eu sou a NathIA. ✨ Estou aqui para tirar suas dúvidas, te acalmar e conversar sobre
          essa fase incrível. O que você gostaria de saber hoje?
        </Text>
      </View>

      {/* Suggested Prompts Grid */}
      <View style={styles.promptsContainer}>
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <View key={index} style={styles.promptItem}>
            <Pressable
              onPress={() => onSuggestedPrompt(prompt.subtitle)}
              style={[
                styles.promptButton,
                {
                  backgroundColor: bgSecondary,
                  borderColor: border,
                },
              ]}
            >
              <Ionicons name={prompt.icon} size={18} color={primaryColor} />
              <Text style={[styles.promptText, { color: textPrimary }]}>{prompt.title}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  promptsContainer: {
    width: "100%",
    gap: spacing.sm,
  },
  promptItem: {
    width: "100%",
  },
  promptButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    minHeight: 44,
  },
  promptText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});
