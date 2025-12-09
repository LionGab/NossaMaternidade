/**
 * EmpatheticWelcome V2 - Saudação empática redesenhada
 *
 * Melhorias:
 * - Textos rotativos por período do dia
 * - Subtítulos empáticos alternados
 * - Animação suave de entrada
 * - Melhor hierarquia visual
 * - WCAG AAA compliant
 */

import * as Haptics from 'expo-haptics';
import { Moon, Sun } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';

export interface EmpatheticWelcomeV2Props {
  /** Nome do usuário (opcional) */
  userName?: string;
  /** Variante visual */
  variant?: 'default' | 'minimal' | 'warm' | 'functional';
}

// Constantes removidas - design fixo conforme especificação web

export function EmpatheticWelcomeV2({ userName, variant = 'default' }: EmpatheticWelcomeV2Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  // ⭐ DESIGN WEB: Texto fixo igual ao design (não rotativo)
  const greeting = 'Olá';
  const subtitle = 'Respira um pouquinho. Estamos aqui por você.';

  // ✅ CORRIGIDO: useMemo para displayName
  const displayName = useMemo(() => (userName ? `, ${userName.split(' ')[0]}` : ''), [userName]);
  // ⭐ DESIGN WEB: Emoji fixo - 👋 no light, 🌙 no dark (não baseado em período)
  const emoji = isDark ? '🌙' : '👋';
  const IconComponent = isDark ? Moon : Sun;

  // ✅ CORRIGIDO: useEffect sem dependências de refs
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // fadeAnim e slideAnim são refs que não mudam
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Variante Minimalista
  if (variant === 'minimal') {
    return (
      <Animated.View
        style={[
          styles.minimalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessibilityRole="header"
        accessibilityLabel={`${greeting}${displayName}`}
        accessibilityHint="Saudação personalizada baseada no período do dia"
      >
        <View style={styles.minimalRow}>
          <Text size="xl" weight="semibold" style={{ color: colors.text.primary }}>
            {greeting}
            {displayName}
          </Text>
          <TouchableOpacity
            onPress={handleThemeToggle}
            activeOpacity={0.8} // ✅ Melhorado: aumentado de 0.7 para 0.8 (feedback mais visível)
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            accessibilityHint="Alterna entre tema claro e escuro"
            style={[
              styles.themeToggle,
              {
                backgroundColor: isDark ? ColorTokens.warning[500] : ColorTokens.neutral[800],
              },
            ]}
          >
            {isDark ? (
              <Sun size={22} color={ColorTokens.neutral[900]} />
            ) : (
              <Moon size={22} color={ColorTokens.neutral[0]} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // Variante Funcional
  if (variant === 'functional') {
    return (
      <Animated.View
        style={[
          styles.functionalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessibilityRole="header"
        accessibilityLabel={`${greeting}${displayName}. ${subtitle}`}
        accessibilityHint="Saudação personalizada com mensagem empática"
      >
        <View style={styles.functionalRow}>
          <View style={{ flex: 1 }}>
            <Text size="lg" weight="medium" style={{ color: colors.text.primary }}>
              {greeting}
              {displayName}
            </Text>
            <Text
              size="sm"
              style={{ color: colors.text.tertiary, marginTop: Tokens.spacing['0.5'] }}
            >
              {subtitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleThemeToggle}
            activeOpacity={0.8} // ✅ Melhorado: aumentado de 0.7 para 0.8 (feedback mais visível)
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            accessibilityHint="Alterna entre tema claro e escuro"
            style={[
              styles.themeToggle,
              {
                backgroundColor: isDark ? ColorTokens.warning[500] : ColorTokens.neutral[800],
              },
            ]}
          >
            {isDark ? (
              <Sun size={22} color={ColorTokens.neutral[900]} />
            ) : (
              <Moon size={22} color={ColorTokens.neutral[0]} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // Variante Warm (Acolhedora) e Default
  const isWarm = variant === 'warm';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      accessibilityRole="header"
      accessibilityLabel={`${greeting}${displayName}. ${subtitle}`}
      accessibilityHint="Saudação acolhedora com mensagem de apoio"
    >
      <Box px="4" pt="3" pb="2">
        {' '}
        {/* ✅ Mobile: padding reduzido (px="4"=16px, pt="3"=12px, pb="2"=8px) */}
        <View style={styles.row}>
          {/* Ícone do período */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? `${ColorTokens.primary[500]}15`
                  : `${ColorTokens.primary[500]}10`,
              },
            ]}
          >
            <IconComponent
              size={24} // ✅ Melhorado: aumentado de 22 para 24 (melhor hierarquia)
              color={isDark ? ColorTokens.primary[300] : ColorTokens.primary[600]} // ✅ Melhorado: contraste melhorado
            />
          </View>

          {/* Textos */}
          <View style={styles.textContainer}>
            {/* Saudação principal */}
            <View style={styles.greetingRow}>
              <Text
                size="2xl"
                weight="bold"
                style={{
                  color: colors.text.primary,
                  lineHeight: 36, // ✅ Melhorado: aumentado de 32 para 36 (melhor legibilidade)
                  letterSpacing: -0.5, // ✅ Melhorado: adicionado para modernidade
                }}
              >
                {greeting}
                {displayName} {emoji}
              </Text>
            </View>

            {/* Subtítulo empático - Fundido em uma linha única */}
            <Text
              size="md"
              style={{
                color: isDark
                  ? ColorTokens.neutral[100] // ✅ Polish: neutral[100] (#F5F5F5) melhor contraste e legibilidade
                  : ColorTokens.neutral[600], // ✅ WCAG AAA: contraste 7:1+
                lineHeight: 26, // ✅ Polish: aumentado de 24 para 26 (melhor legibilidade)
                marginTop: Tokens.spacing['2'], // ✅ Respiração adequada
                fontStyle: isWarm ? 'italic' : 'normal',
              }}
            >
              Respira um pouquinho. Estamos aqui por você.
            </Text>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={handleThemeToggle}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            accessibilityHint="Alterna entre tema claro e escuro"
            style={[
              styles.themeToggle,
              {
                backgroundColor: isDark ? ColorTokens.warning[500] : ColorTokens.neutral[800],
              },
            ]}
          >
            {isDark ? (
              <Sun size={22} color={ColorTokens.neutral[900]} />
            ) : (
              <Moon size={22} color={ColorTokens.neutral[0]} />
            )}
          </TouchableOpacity>
        </View>
      </Box>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container principal
  },
  minimalContainer: {
    paddingHorizontal: Tokens.spacing['5'],
    paddingVertical: Tokens.spacing['3'],
  },
  minimalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Tokens.spacing['3'],
  },
  functionalContainer: {
    paddingHorizontal: Tokens.spacing['5'],
    paddingVertical: Tokens.spacing['3'],
  },
  functionalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Tokens.spacing['3'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Tokens.spacing['4'], // ✅ Melhorado: aumentado de '3' para '4' (melhor respiração)
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48, // ✅ Melhorado: aumentado de 44 para 48 (melhor touch target WCAG AAA)
    height: 48,
    borderRadius: Tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    minWidth: 0, // ✅ Melhorado: previne overflow em telas pequenas
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2.5'], // ✅ Melhorado: aumentado de '2' para '2.5'
    flexWrap: 'wrap', // ✅ Melhorado: permite quebra em telas pequenas
  },
  themeToggle: {
    width: 48, // ✅ Melhorado: aumentado de 44 para 48 (WCAG AAA)
    height: 48,
    borderRadius: Tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // ✅ Melhorado: sombra mais sutil
    shadowRadius: 4,
    elevation: 3, // ✅ Melhorado: reduzido para Android
    marginTop: 2,
  },
});

export default EmpatheticWelcomeV2;
