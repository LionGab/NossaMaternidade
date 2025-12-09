/**
 * BestieCard - Card "Bestie de Bolso"
 * 
 * Card premium com:
 * - Título e subtítulo
 * - CTA grande para enviar áudio
 * - Card de conversa com avatar da NathIA
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic } from 'lucide-react-native';

import { Avatar } from '@/components/Avatar';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { nathAvatar } from '@/assets/images';
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

interface BestieCardProps {
  onAudioPress?: () => void;
  conversationMessage?: string;
  conversationTime?: string;
  conversationTag?: string;
}

export const BestieCard: React.FC<BestieCardProps> = ({
  onAudioPress,
  conversationMessage = 'Você me contou sobre a conversa com seu parceiro ontem, quer atualizar?',
  conversationTime = 'há 2 horas',
  conversationTag = 'Relacionamento',
}) => {
  const { colors } = useTheme();

  const handleAudioPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAudioPress?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }, getPlatformShadow('sm')]}>
      {/* Título e subtítulo */}
      <Box gap="2" mb="5">
        <Text
          variant="body"
          size="xl"
          weight="bold"
          style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
        >
          Bestie de Bolso ✨
        </Text>
        <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_suave }}>
          Sua NathIA está aqui pra você
        </Text>
      </Box>

      {/* CTA de áudio */}
      <TouchableOpacity
        onPress={handleAudioPress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Enviar áudio para a NathIA"
        style={styles.audioButton}
      >
        <LinearGradient
          colors={[PREMIUM_COLORS.rosa_acento, '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.audioButtonGradient}
        >
          <Mic size={20} color="#FFFFFF" />
          <Text variant="body" size="md" weight="semibold" style={styles.audioButtonText}>
            Enviar áudio para a NathIA
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Microcopy */}
      <Text variant="caption" size="xs" style={StyleSheet.flatten([styles.microcopy, { color: PREMIUM_COLORS.texto_suave }])}>
        Ela te responde sempre que você precisar 💕
      </Text>

      {/* Card de conversa */}
      <View style={[styles.conversationCard, { backgroundColor: '#FFF9FD' }]}>
        <Box direction="row" gap="3" align="flex-start">
          <Avatar
            size={36}
            source={nathAvatar}
            name="NathIA"
            fallback="N"
            borderWidth={1}
            borderColor={PREMIUM_COLORS.rosa_acento}
            useGradientFallback
          />
          <Box flex={1} gap="2">
            <Text variant="body" size="sm" style={{ color: PREMIUM_COLORS.texto_principal, lineHeight: 20 }}>
              {conversationMessage}
            </Text>
            <Box direction="row" align="center" gap="2" style={{ flexWrap: 'wrap' }}>
              <Text variant="caption" size="xs" style={{ color: PREMIUM_COLORS.texto_suave }}>
                {conversationTime}
              </Text>
              <View style={[styles.tag, { backgroundColor: `${PREMIUM_COLORS.rosa_acento}20` }]}>
                <Text variant="caption" size="xs" weight="medium" style={{ color: PREMIUM_COLORS.rosa_acento }}>
                  {conversationTag}
                </Text>
              </View>
            </Box>
          </Box>
        </Box>
      </View>
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
  audioButton: {
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: Tokens.spacing['3'],
  },
  audioButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['4'],
    paddingHorizontal: Tokens.spacing['5'],
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  microcopy: {
    textAlign: 'center',
    marginBottom: Tokens.spacing['4'],
    fontSize: 12,
  },
  conversationCard: {
    borderRadius: Tokens.radius['2xl'],
    padding: Tokens.spacing['4'],
    borderWidth: 1,
    borderColor: `${PREMIUM_COLORS.rosa_acento}30`,
  },
  tag: {
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['0.5'],
    borderRadius: Tokens.radius.md,
  },
});

