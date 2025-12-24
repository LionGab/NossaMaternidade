/**
 * NathiaAdviceCard - Card da NathIA (Calm FemTech)
 *
 * SECUNDÁRIO na hierarquia da Home
 * - Se não fez check-in: "Como você está hoje? Vamos começar por aí."
 * - Se fez: mensagem baseada no mood + CTA "Conversar com NathIA"
 *
 * Usa tokens do preset calmFemtech - azul base, rosa pontual
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state/store";
import { neutral, radius, shadows, spacing } from "../../theme/tokens";

// Imagem real da Nath
const NATH_PROFILE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

interface NathiaAdviceCardProps {
  onPressChat: () => void;
}

// Dicas baseadas no mood (não prescritivas)
const MOOD_TIPS: Record<number, string> = {
  5: "Dias bons merecem ser lembrados. Que tal registrar uma gratidão?",
  4: "O amor nos sustenta. Lembre-se de quem te faz sentir assim.",
  3: "Descanso também é produtividade. Permita-se pausar.",
  2: "Dias difíceis passam. Você não precisa resolver tudo agora.",
  1: "Uma respiração profunda pode ajudar. Estou aqui se precisar.",
};

export const NathiaAdviceCard: React.FC<NathiaAdviceCardProps> = ({ onPressChat }) => {
  const { colors, isDark, brand, text: themeText } = useTheme();

  // Store
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);
  const todayCheckIn = getTodayCheckIn();
  const hasMoodToday = todayCheckIn?.mood !== null && todayCheckIn?.mood !== undefined;

  // Determinar conteúdo do card
  const message = useMemo(() => {
    if (!hasMoodToday) {
      return "Como você está hoje? Vamos começar por aí.";
    }
    return MOOD_TIPS[todayCheckIn?.mood ?? 3] ?? MOOD_TIPS[3];
  }, [hasMoodToday, todayCheckIn?.mood]);

  // Handler simples
  const handlePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPressChat();
  }, [onPressChat]);

  // Cores do tema - usando tokens calmFemtech (azul base)
  const cardBg = isDark ? brand.primary[900] : brand.primary[50];
  const borderColor = isDark ? brand.primary[700] : brand.primary[200];
  const textMain = themeText?.primary || (isDark ? colors.neutral[100] : colors.neutral[900]);
  const textMuted = themeText?.secondary || (isDark ? colors.neutral[400] : colors.neutral[600]);
  const iconBg = isDark ? brand.primary[800] : brand.primary[100];
  const accentColor = brand.primary[500];

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(500)}>
      <Pressable
        onPress={handlePress}
        accessibilityLabel="Conselho da NathIA"
        accessibilityRole="button"
        accessibilityHint="Toque para conversar com NathIA"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: cardBg,
            borderColor,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {/* Foto da Nath */}
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Image
            source={NATH_PROFILE}
            style={styles.nathPhoto}
            resizeMode="cover"
            accessibilityLabel="Foto da Nathália"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: textMain }]}>NathIA</Text>
          <Text style={[styles.message, { color: textMuted }]} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* CTA Button */}
        <View style={[styles.ctaButton, { backgroundColor: accentColor }]}>
          <Ionicons name="chevron-forward" size={20} color={neutral[0]} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  nathPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    lineHeight: 18,
  },
  ctaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NathiaAdviceCard;
