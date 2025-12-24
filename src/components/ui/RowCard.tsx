/**
 * RowCard - Card padronizado para Home (Calm FemTech)
 *
 * Layout consistente: left icon, title+subtitle, right chevron
 * Usa tokens do preset calmFemtech
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { radius, spacing } from "../../theme/tokens";

interface RowCardProps {
  /** Ícone à esquerda (Ionicons name) */
  icon: keyof typeof Ionicons.glyphMap;
  /** Cor do ícone */
  iconColor?: string;
  /** Cor de fundo do container do ícone */
  iconBg?: string;
  /** Título principal */
  title: string;
  /** Subtítulo (opcional) */
  subtitle?: string;
  /** Badge opcional (ex: "NOVO") */
  badge?: string;
  /** Cor do badge */
  badgeColor?: string;
  /** Handler de press */
  onPress: () => void;
  /** Delay de animação */
  animationDelay?: number;
  /** Estilo customizado */
  style?: ViewStyle;
  /** Acessibilidade */
  accessibilityLabel?: string;
  /** Acessibilidade hint */
  accessibilityHint?: string;
}

/**
 * RowCard - Card padronizado para Home
 *
 * Layout: [Icon] [Title + Subtitle] [Chevron]
 * Usa tokens calmFemtech (azul base, rosa accent)
 */
export function RowCard({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  badge,
  badgeColor,
  onPress,
  animationDelay = 0,
  style,
  accessibilityLabel,
  accessibilityHint,
}: RowCardProps) {
  const { colors, isDark, brand, text: themeText } = useTheme();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Cores padrão do tema
  const defaultIconBg = iconBg || (isDark ? brand.primary[800] : brand.primary[100]);
  const defaultIconColor = iconColor || (isDark ? brand.primary[300] : brand.primary[500]);
  const textMain = themeText?.primary || (isDark ? colors.neutral[100] : colors.neutral[900]);
  const textMuted = themeText?.secondary || (isDark ? colors.neutral[400] : colors.neutral[600]);
  const cardBg = isDark ? brand.primary[900] : brand.primary[50];
  const borderColor = isDark ? brand.primary[700] : brand.primary[200];
  const badgeBg = badgeColor || (isDark ? brand.accent[500] : brand.accent[200]);
  const badgeTextColor = isDark ? colors.neutral[900] : brand.accent[800];

  return (
    <Animated.View entering={FadeInUp.delay(animationDelay).duration(500).springify()}>
      <Pressable
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            borderRadius: radius.xl,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor,
            backgroundColor: cardBg,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            // Outlined sem sombra (calm FemTech)
          },
          style,
        ]}
      >
        {/* Left Icon */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: defaultIconBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={22} color={defaultIconColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: subtitle ? 2 : 0 }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                fontFamily: "Manrope_700Bold",
                color: textMain,
                marginRight: badge ? spacing.sm : 0,
              }}
            >
              {title}
            </Text>
            {badge && (
              <View
                style={{
                  backgroundColor: badgeBg,
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                  borderRadius: radius.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: "600",
                    fontFamily: "Manrope_600SemiBold",
                    color: badgeTextColor,
                  }}
                >
                  {badge}
                </Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Manrope_500Medium",
                color: textMuted,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Chevron */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? colors.neutral[500] : colors.neutral[400]}
        />
      </Pressable>
    </Animated.View>
  );
}

export default RowCard;
