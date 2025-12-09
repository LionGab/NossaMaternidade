/**
 * NathWorldSection - Seção "Mundo da Nath"
 * 
 * Seção premium com:
 * - Header com título, subtítulo e CTA
 * - Cards de conteúdo com thumbnails
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, ArrowRight } from 'lucide-react-native';

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

interface NathWorldCard {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  duration: string;
  tag: string;
  gradient: readonly [string, string];
}

const CARDS: NathWorldCard[] = [
  {
    badge: 'Novo',
    badgeColor: PREMIUM_COLORS.rosa_acento,
    title: 'Bastidores do parto do Thales 🍼',
    subtitle: 'Momento real, sem filtro',
    duration: '15 min',
    tag: 'Vlog',
    gradient: [`${PREMIUM_COLORS.rosa_acento}40`, `${PREMIUM_COLORS.azul_acento}40`] as const,
  },
  {
    badge: 'Em destaque',
    badgeColor: PREMIUM_COLORS.azul_acento,
    title: 'Minha infância e o projeto na África 🌍',
    subtitle: 'A história por trás do impacto',
    duration: '8 min',
    tag: 'África',
    gradient: [`${PREMIUM_COLORS.azul_acento}40`, `${PREMIUM_COLORS.roxo_suave}40`] as const,
  },
];

interface NathWorldSectionProps {
  onViewAll?: () => void;
  onCardPress?: (card: NathWorldCard) => void;
}

export const NathWorldSection: React.FC<NathWorldSectionProps> = ({ onViewAll, onCardPress }) => {
  const { colors } = useTheme();

  const handleCardPress = (card: NathWorldCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCardPress?.(card);
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewAll?.();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box direction="row" align="center" justify="space-between" mb="4" style={styles.header}>
        <Box flex={1}>
          <Text
            variant="body"
            size="xl"
            weight="bold"
            style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
          >
            Mundo da Nath
          </Text>
          <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave, marginTop: Tokens.spacing['1'] }}>
            Momento real com ela
          </Text>
        </Box>
        <TouchableOpacity
          onPress={handleViewAll}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ver tudo do Mundo da Nath"
          style={styles.viewAllButton}
        >
          <Text variant="body" size="sm" weight="semibold" style={{ color: PREMIUM_COLORS.rosa_acento }}>
            Ver tudo
          </Text>
          <ArrowRight size={16} color={PREMIUM_COLORS.rosa_acento} />
        </TouchableOpacity>
      </Box>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.cardsScroll}
      >
        {CARDS.map((card, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCardPress(card)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`${card.title}, ${card.subtitle}`}
            style={styles.cardContainer}
          >
            <LinearGradient
              colors={card.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { backgroundColor: colors.background.card }, getPlatformShadow('sm')]}
            >
              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: card.badgeColor }]}>
                <Text variant="caption" size="xs" weight="bold" style={styles.badgeText}>
                  {card.badge}
                </Text>
              </View>

              {/* Content */}
              <Box flex={1} justify="space-between" style={styles.cardContent}>
                <Box gap="2">
                  <Text variant="body" size="md" weight="bold" style={{ color: PREMIUM_COLORS.texto_principal }}>
                    {card.title}
                  </Text>
                  <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave }}>
                    {card.subtitle}
                  </Text>
                </Box>

                {/* Footer */}
                <Box direction="row" align="center" justify="space-between">
                  <Box direction="row" align="center" gap="2">
                    <Play size={16} color={PREMIUM_COLORS.texto_suave} fill={PREMIUM_COLORS.texto_suave} />
                    <Text variant="caption" size="xs" style={{ color: PREMIUM_COLORS.texto_suave }}>
                      {card.duration}
                    </Text>
                  </Box>
                  <View style={[styles.tag, { backgroundColor: `${card.badgeColor}20` }]}>
                    <Text variant="caption" size="xs" weight="medium" style={{ color: card.badgeColor }}>
                      {card.tag}
                    </Text>
                  </View>
                </Box>
              </Box>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const CARD_WIDTH = 280;
const CARD_HEIGHT = 140;

const styles = StyleSheet.create({
  container: {
    marginBottom: Tokens.spacing['4'],
  },
  header: {
    paddingHorizontal: Tokens.spacing['5'],
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['1'],
  },
  cardsScroll: {
    marginHorizontal: -Tokens.spacing['5'],
  },
  cardsContainer: {
    paddingHorizontal: Tokens.spacing['5'],
    gap: Tokens.spacing['4'],
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Tokens.radius['3xl'],
    overflow: 'hidden',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Tokens.radius['3xl'],
    padding: Tokens.spacing['4'],
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: Tokens.spacing['3'],
    right: Tokens.spacing['3'],
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['0.5'],
    borderRadius: Tokens.radius.md,
  },
  badgeText: {
    color: '#FFFFFF',
  },
  cardContent: {
    height: '100%',
  },
  tag: {
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['0.5'],
    borderRadius: Tokens.radius.md,
  },
});

