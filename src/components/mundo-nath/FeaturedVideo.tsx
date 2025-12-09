/**
 * FeaturedVideo - Vídeo especial em destaque para Mundo da Nath
 *
 * Exibe o vídeo especial que marcou o coração de muitas mães, com player YouTube
 * e estatísticas de engajamento.
 * Referência: app-redesign-studio-ab40635e/src/pages/Content.tsx (seção "Vídeo Especial Fixo")
 * Adaptado para React Native usando WebView para YouTube embed.
 *
 * TODO: Instalar react-native-webview se ainda não estiver instalado:
 *   npx expo install react-native-webview
 * Alternativa: Usar expo-web-browser ou Linking para abrir YouTube em navegador externo
 */

import { Heart, Clock, Users } from 'lucide-react-native';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Badge } from '@/components/Badge';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { ReelsPlayer } from './ReelsPlayer';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens, Spacing } from '@/theme/tokens';

interface FeaturedVideoProps {
  /** ID do vídeo do YouTube (ex: "riVUidsF2qo") */
  videoId?: string;
  /** URL completa do vídeo (alternativa ao videoId) */
  videoUrl?: string;
  /** Título do vídeo */
  title?: string;
  /** Descrição do vídeo */
  description?: string;
  /** Número de mães que assistiram */
  viewsCount?: number;
  /** Avaliação média */
  rating?: number;
  /** Duração em minutos */
  duration?: number;
  /** Callback quando o vídeo é reproduzido */
  onPlay?: () => void;
}

// Vídeo especial marcado no coração das mães
// const DEFAULT_VIDEO_ID = 'riVUidsF2qo';

export function FeaturedVideo({
  title = 'O DIA MAIS FELIZ DA MINHA VIDA! 💙',
  description = 'Um momento especial que marcou profundamente. Uma experiência emocional única e transformadora.',
  viewsCount = 10000,
  duration = 15,
  videoUrl,
  onPlay,
}: FeaturedVideoProps) {
  const { colors, isDark } = useTheme();

  // youtubeEmbedUrl removido - WebView não disponível no momento

  return (
    <Box
      style={{
        borderRadius: Tokens.radius['3xl'],
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: isDark ? ColorTokens.secondary[700] : ColorTokens.secondary[200],
        ...Tokens.shadows.xl,
      }}
    >
      <LinearGradient
        colors={
          isDark
            ? [ColorTokens.secondary[900], ColorTokens.secondary[800]]
            : [ColorTokens.neutral[0], ColorTokens.secondary[50], ColorTokens.secondary[100]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Decoração de fundo */}
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: isDark
            ? `${ColorTokens.secondary[600]}20`
            : `${ColorTokens.secondary[400]}40`,
          opacity: 0.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -32,
          left: -32,
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: isDark
            ? `${ColorTokens.secondary[500]}20`
            : `${ColorTokens.secondary[400]}40`,
          opacity: 0.5,
        }}
      />

      <Box p="6" gap="5" style={{ position: 'relative' }}>
        {/* Header */}
        <Box gap="3">
          <Box direction="row" align="center" gap="2" flexWrap="wrap">
            <Box
              p="2"
              style={{
                borderRadius: Tokens.radius.xl,
                backgroundColor: isDark ? `${ColorTokens.secondary[600]}40` : `${ColorTokens.secondary[500]}20`,
              }}
            >
              <Heart
                size={20}
                color={isDark ? ColorTokens.secondary[300] : ColorTokens.secondary[600]}
                fill={isDark ? ColorTokens.secondary[300] : ColorTokens.secondary[600]}
              />
            </Box>
            <Badge
              variant="secondary"
              containerStyle={{
                backgroundColor: isDark ? ColorTokens.secondary[600] : ColorTokens.secondary[500],
              }}
            >
              💖 Vídeo Especial
            </Badge>
            <Badge
              variant="default"
            outlined
              containerStyle={{
                backgroundColor: isDark ? `${ColorTokens.neutral[0]}15` : `${ColorTokens.neutral[0]}90`,
                borderColor: isDark ? ColorTokens.secondary[600] : ColorTokens.secondary[200],
              }}
            >
              ⭐ EM DESTAQUE
            </Badge>
          </Box>
          <Text size="2xl" weight="bold" style={{ color: colors.text.primary }}>
            {title}
          </Text>
          <Text size="sm" color="secondary" style={{ color: colors.text.secondary }}>
            {description}
          </Text>
        </Box>

        {/* Player de Vídeo - ReelsPlayer funcional */}
        {videoUrl ? (
          <ReelsPlayer
            videoUrl={videoUrl}
            title={title}
            duration={duration ? duration * 60 : undefined}
            views={viewsCount}
            height={400}
            autoPlay={false}
            onPlay={() => {
              onPlay?.();
            }}
          />
        ) : (
          <Box
            style={{
              width: '100%',
              aspectRatio: 16 / 9,
              borderRadius: Tokens.radius['2xl'],
              overflow: 'hidden',
              borderWidth: 4,
              borderColor: isDark ? ColorTokens.secondary[600] : ColorTokens.secondary[300],
              backgroundColor: ColorTokens.neutral[900],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="sm" color="secondary" style={{ padding: Spacing['4'] }}>
              URL do vídeo não fornecida
            </Text>
          </Box>
        )}

        {/* Estatísticas abaixo do vídeo */}
        <Box
          direction="row"
          align="center"
          justify="space-between"
          gap="3"
          pt="4"
          style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? ColorTokens.secondary[700] : ColorTokens.secondary[200],
          }}
        >
          <Box direction="row" align="center" gap="2" flex={1}>
            <Box
              p="2"
              style={{
                borderRadius: Tokens.radius.lg,
                backgroundColor: isDark ? `${ColorTokens.secondary[600]}40` : `${ColorTokens.secondary[500]}20`,
              }}
            >
              <Users size={16} color={isDark ? ColorTokens.secondary[300] : ColorTokens.secondary[600]} />
            </Box>
            <Box>
              <Text size="sm" weight="bold" style={{ color: colors.text.primary }}>
                +{viewsCount.toLocaleString()}
              </Text>
              <Text size="xs" color="secondary">
                mães
              </Text>
            </Box>
          </Box>
          <View
            style={{
              width: 1,
              height: 32,
              backgroundColor: isDark ? ColorTokens.secondary[700] : ColorTokens.secondary[200],
            }}
          />
          <Box direction="row" align="center" gap="2" flex={1}>
            <Box
              p="2"
              style={{
                borderRadius: Tokens.radius.lg,
                backgroundColor: isDark ? `${ColorTokens.secondary[600]}40` : `${ColorTokens.secondary[500]}20`,
              }}
            >
              <Clock size={16} color={isDark ? ColorTokens.secondary[300] : ColorTokens.secondary[600]} />
            </Box>
            <Box>
              <Text size="sm" weight="bold" style={{ color: colors.text.primary }}>
                {duration} min
              </Text>
              <Text size="xs" color="secondary">
                duração
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

