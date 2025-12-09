/**
 * HomeHeader - Header Premium da Home
 * 
 * Componente de header com:
 * - Título "Oi, amiga," e subtítulo "como você tá hoje?"
 * - Avatar da Nath com badge online
 * - Chips de streak e informações do perfil
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Avatar } from '@/components/Avatar';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { nathAvatar } from '@/assets/images';
import { Tokens } from '@/theme/tokens';

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

interface HomeHeaderProps {
  userName?: string;
  streakDays?: number;
  lifeStage?: string;
  babyName?: string;
  project?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'amiga',
  streakDays = 12,
  lifeStage = 'virada de ano',
  babyName,
  project = 'Projeto África',
}) => {

  return (
    <View style={styles.container}>
      {/* Header principal */}
      <Box direction="row" align="center" justify="space-between" mb="4">
        <Box flex={1} gap="2">
          <Text
            variant="body"
            size="2xl"
            weight="semibold"
            style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
          >
            Oi, {userName},
          </Text>
          <Text
            variant="body"
            size="md"
            style={StyleSheet.flatten([styles.subtitle, { color: PREMIUM_COLORS.texto_suave }])}
          >
            como você tá hoje?
          </Text>
        </Box>

        {/* Avatar da Nath com badge online */}
        <View style={styles.avatarContainer}>
          <Avatar
            size={48}
            source={nathAvatar}
            name="Nath"
            fallback="NV"
            borderWidth={2}
            borderColor={PREMIUM_COLORS.rosa_acento}
            useGradientFallback
          />
          <View style={[styles.onlineBadge, { backgroundColor: '#22C55E' }]} />
        </View>
      </Box>

      {/* Chips de informação */}
      <Box direction="row" gap="2" style={{ flexWrap: 'wrap' }}>
        {/* Streak */}
        {streakDays > 0 && (
          <View style={styles.chipContainer}>
            <LinearGradient
              colors={[PREMIUM_COLORS.rosa_acento, PREMIUM_COLORS.roxo_suave]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chipGradient}
            >
              <Text variant="caption" size="xs" weight="semibold" style={styles.chipText}>
                🔥 {streakDays} dias seguidos
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Life Stage */}
        {lifeStage && (
          <View style={[styles.chip, { backgroundColor: `${PREMIUM_COLORS.azul_acento}20` }]}>
            <Text variant="caption" size="xs" weight="medium" style={{ color: PREMIUM_COLORS.azul_acento }}>
              🎀 Fase: {lifeStage}
            </Text>
          </View>
        )}

        {/* Baby Name */}
        {babyName && (
          <View style={[styles.chip, { backgroundColor: `${PREMIUM_COLORS.rosa_acento}20` }]}>
            <Text variant="caption" size="xs" weight="medium" style={{ color: PREMIUM_COLORS.rosa_acento }}>
              👶 Mãe do {babyName}
            </Text>
          </View>
        )}

        {/* Project */}
        {project && (
          <View style={[styles.chip, { backgroundColor: `${PREMIUM_COLORS.roxo_suave}20` }]}>
            <Text variant="caption" size="xs" weight="medium" style={{ color: PREMIUM_COLORS.roxo_suave }}>
              🌍 {project}
            </Text>
          </View>
        )}
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Tokens.spacing['5'],
    paddingTop: Tokens.spacing['4'],
    paddingBottom: Tokens.spacing['4'],
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chipContainer: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  chipGradient: {
    paddingHorizontal: Tokens.spacing['3'],
    paddingVertical: Tokens.spacing['1.5'],
    borderRadius: 999,
  },
  chip: {
    paddingHorizontal: Tokens.spacing['3'],
    paddingVertical: Tokens.spacing['1.5'],
    borderRadius: 999,
  },
  chipText: {
    color: '#FFFFFF',
  },
});

