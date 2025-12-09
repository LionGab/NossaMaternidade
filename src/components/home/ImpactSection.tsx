/**
 * ImpactSection - Seção "Impacto & Comunidade"
 * 
 * Seção premium com:
 * - Título e subtítulo
 * - Texto principal sobre impacto
 * - Mini-cards com estatísticas
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { getPlatformShadow } from '@/theme/platform';

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

interface StatCard {
  value: string;
  label: string;
  color: string;
}

interface ImpactSectionProps {
  challenges?: number;
  points?: number;
  mothers?: number;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  challenges = 1247,
  points = 8920,
  mothers = 342,
}) => {
  const { colors } = useTheme();

  const stats: StatCard[] = [
    { value: challenges.toLocaleString('pt-BR'), label: 'Desafios', color: PREMIUM_COLORS.rosa_acento },
    { value: points.toLocaleString('pt-BR'), label: 'Pontos', color: '#FFA500' },
    { value: mothers.toLocaleString('pt-BR'), label: 'Mães', color: PREMIUM_COLORS.roxo_suave },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }, getPlatformShadow('sm')]}>
      {/* Header */}
      <Box gap="2" mb="4">
        <Text
          variant="body"
          size="xl"
          weight="bold"
          style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
        >
          Impacto & Comunidade
        </Text>
        <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave }}>
          Squad Valente em ação
        </Text>
      </Box>

      {/* Texto principal */}
      <Text variant="body" size="sm" style={StyleSheet.flatten([styles.description, { color: PREMIUM_COLORS.texto_principal }])}>
        Esta semana, a Squad Valente completou {challenges.toLocaleString('pt-BR')} desafios e gerou{' '}
        {points.toLocaleString('pt-BR')} pontos para projetos na África. Você faz parte disso 💜
      </Text>

      {/* Mini-cards de estatísticas */}
      <Box direction="row" gap="3" style={{ marginTop: Tokens.spacing['5'] }}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCardContainer}>
            <LinearGradient
              colors={[`${stat.color}20`, `${stat.color}10`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text variant="body" size="lg" weight="bold" style={StyleSheet.flatten([styles.statValue, { color: stat.color }])}>
                {stat.value}
              </Text>
              <Text variant="caption" size="xs" style={{ color: PREMIUM_COLORS.texto_suave }}>
                {stat.label}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </Box>
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
  description: {
    lineHeight: 22,
  },
  statCardContainer: {
    flex: 1,
    borderRadius: Tokens.radius['2xl'],
    overflow: 'hidden',
  },
  statCard: {
    padding: Tokens.spacing['3'],
    alignItems: 'center',
    gap: Tokens.spacing['1'],
    borderRadius: Tokens.radius['2xl'],
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
  },
});

