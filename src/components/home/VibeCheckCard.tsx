/**
 * VibeCheckCard - Card "Vibe Check de Hoje"
 * 
 * Card premium com:
 * - Sugestão do dia no topo
 * - Carrossel horizontal de opções de vibe
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { getPlatformShadow } from '@/theme/platform';
import * as Haptics from 'expo-haptics';

// Paleta Premium
const PREMIUM_COLORS = {
  azul_acento: '#6DA9E4',
  rosa_acento: '#FF8BA3',
  roxo_suave: '#C5A8FF',
  fundo_rosado: '#FDF9FB',
  fundo_azulado: '#F3F7FF',
  texto_principal: '#3A2E2E',
  texto_suave: '#6A5450',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIBE_CARD_WIDTH = (SCREEN_WIDTH - Tokens.spacing['5'] * 2 - Tokens.spacing['4'] * 2) / 2.2;

interface VibeOption {
  emoji: string;
  title: string;
  gradient: readonly [string, string];
}

const VIBE_OPTIONS: VibeOption[] = [
  { emoji: '☀️', title: 'Look de verão', gradient: ['#FFE4B5', '#FFD700'] as const },
  { emoji: '👗', title: 'Look mãe', gradient: ['#FFB6C1', '#FF69B4'] as const },
  { emoji: '🌍', title: 'Look África', gradient: ['#DDA0DD', '#BA55D3'] as const },
  { emoji: '🎄', title: 'Look Natal/Ano Novo', gradient: ['#FFB6C1', '#FF1493'] as const },
];

interface VibeCheckCardProps {
  onVibeSelect?: (vibe: VibeOption) => void;
}

export const VibeCheckCard: React.FC<VibeCheckCardProps> = ({ onVibeSelect }) => {
  const { colors } = useTheme();

  const handleVibePress = (vibe: VibeOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onVibeSelect?.(vibe);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }, getPlatformShadow('sm')]}>
      {/* Header */}
      <Box gap="2" mb="5">
        <Text
          variant="body"
          size="xl"
          weight="bold"
          style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
        >
          Vibe Check de Hoje
        </Text>
        <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave }}>
          Qual a vibe de hoje?
        </Text>
      </Box>

      {/* Sugestão do dia */}
      <View style={[styles.suggestionCard, { backgroundColor: '#FFF9FD' }]}>
        <LinearGradient
          colors={[`${PREMIUM_COLORS.azul_acento}20`, `${PREMIUM_COLORS.rosa_acento}20`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.suggestionGradient}
        >
          <Text variant="body" size="3xl" style={styles.suggestionEmoji}>
            ☀️
          </Text>
          <Text variant="body" size="md" weight="semibold" style={{ color: PREMIUM_COLORS.texto_principal }}>
            Sugestão do dia
          </Text>
          <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave, textAlign: 'center' }}>
            Look de verão pra você se sentir incrível hoje
          </Text>
        </LinearGradient>
      </View>

      {/* Carrossel de opções */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        style={styles.carousel}
      >
        {VIBE_OPTIONS.map((vibe, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleVibePress(vibe)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`Vibe ${vibe.title}`}
            style={styles.vibeCardContainer}
          >
            <LinearGradient
              colors={vibe.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.vibeCard}
            >
              <Text variant="body" size="3xl" style={styles.vibeEmoji}>
                {vibe.emoji}
              </Text>
              <Text variant="body" size="sm" weight="semibold" style={styles.vibeTitle}>
                {vibe.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Tokens.radius['3xl'],
    padding: Tokens.spacing['5'],
    marginHorizontal: Tokens.spacing['5'],
    marginBottom: Tokens.spacing['4'],
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  suggestionCard: {
    borderRadius: Tokens.radius['2xl'],
    padding: Tokens.spacing['4'],
    marginBottom: Tokens.spacing['4'],
    overflow: 'hidden',
  },
  suggestionGradient: {
    alignItems: 'center',
    gap: Tokens.spacing['2'],
    padding: Tokens.spacing['3'],
  },
  suggestionEmoji: {
    fontSize: 48,
  },
  carousel: {
    marginHorizontal: -Tokens.spacing['5'],
  },
  carouselContainer: {
    paddingHorizontal: Tokens.spacing['5'],
    gap: Tokens.spacing['4'],
  },
  vibeCardContainer: {
    width: VIBE_CARD_WIDTH,
    borderRadius: Tokens.radius['2xl'],
    overflow: 'hidden',
  },
  vibeCard: {
    width: VIBE_CARD_WIDTH,
    height: 120,
    borderRadius: Tokens.radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Tokens.spacing['2'],
    padding: Tokens.spacing['4'],
  },
  vibeEmoji: {
    fontSize: 40,
  },
  vibeTitle: {
    color: PREMIUM_COLORS.texto_principal,
    textAlign: 'center',
  },
});

