/**
 * ContentDetailScreen - Detalhes de conteúdo (vídeos, áudios, artigos)
 * Week 1 - Refatorada com Design System maternal
 */

import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Play, Clock, Eye, Heart, Share2 } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
  Share,
  Platform,
} from 'react-native';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import type { RootStackParamList } from '@/navigation/types';
import { feedService, type ContentItem } from '@/services/supabase';
import { useTheme } from '@/theme';
import { Spacing, Radius, ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

type ContentDetailRouteProp = RouteProp<RootStackParamList, 'ContentDetail'>;
type ContentDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContentDetail'>;

export default function ContentDetailScreen() {
  const route = useRoute<ContentDetailRouteProp>();
  const navigation = useNavigation<ContentDetailNavigationProp>();
  const { colors } = useTheme();

  const { contentId } = route.params;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);

      // Buscar conteúdo diretamente pelo ID
      const foundContent = await feedService.getContentById(contentId);

      if (foundContent) {
        setContent(foundContent);
        // Verificar se usuário já curtiu
        if (foundContent.user_interaction?.is_liked) {
          setIsLiked(true);
        }
        // Incrementar visualizações
        await feedService.incrementViews(contentId);
        logger.info('Content loaded successfully', { screen: 'ContentDetail', contentId });
      } else {
        logger.warn('Content not found', { screen: 'ContentDetail', contentId });
      }
    } catch (error) {
      logger.error('Failed to load content', error, { screen: 'ContentDetail', contentId });
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleLike = async () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    logger.info('Content liked toggled', {
      screen: 'ContentDetail',
      contentId,
      liked: newLikeState,
    });

    // Integrar com backend para salvar like
    const success = await feedService.toggleLike(contentId);
    if (!success) {
      // Reverter estado se falhou
      setIsLiked(!newLikeState);
      logger.warn('Failed to toggle like, reverted state', { screen: 'ContentDetail', contentId });
    }
  };

  const handleShare = async () => {
    if (!content) return;

    try {
      const shareMessage = `${content.title}\n\n${content.description || ''}\n\nVia Nossa Maternidade`;
      const shareUrl = `https://nossamaternidade.app/content/${contentId}`;

      const result = await Share.share(
        Platform.OS === 'ios'
          ? { message: shareMessage, url: shareUrl }
          : { message: `${shareMessage}\n\n${shareUrl}` },
        { dialogTitle: 'Compartilhar conteúdo' }
      );

      if (result.action === Share.sharedAction) {
        logger.info('Content shared successfully', { screen: 'ContentDetail', contentId });
      } else if (result.action === Share.dismissedAction) {
        logger.info('Share dismissed', { screen: 'ContentDetail', contentId });
      }
    } catch (error) {
      logger.error('Failed to share content', error, { screen: 'ContentDetail', contentId });
    }
  };

  const handlePlay = () => {
    logger.info('Play content pressed', {
      screen: 'ContentDetail',
      contentId,
      type: content?.type,
    });
    // TODO: Implementar player de vídeo/áudio
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background.canvas,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!content) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background.canvas,
          padding: Spacing['6'],
        }}
      >
        <Text color="secondary" size="lg" align="center" style={{ marginBottom: Spacing['4'] }}>
          Conteúdo não encontrado
        </Text>
        <HapticButton
          variant="ghost"
          size="md"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar para tela anterior"
        >
          <Text color="link" weight="medium">
            Voltar
          </Text>
        </HapticButton>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      {/* Header com imagem */}
      {content.thumbnail_url ? (
        <ImageBackground
          source={{ uri: content.thumbnail_url }}
          style={{ width: SCREEN_WIDTH, height: HEADER_HEIGHT }}
          imageStyle={{
            borderBottomLeftRadius: Radius['2xl'],
            borderBottomRightRadius: Radius['2xl'],
          }}
        >
          <Box
            style={{
              flex: 1,
              backgroundColor: ColorTokens.overlay.medium,
              justifyContent: 'space-between',
              paddingTop: Spacing['6'],
            }}
          >
            {/* Top bar: Back + Actions */}
            <Box
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: Spacing['4'],
              }}
            >
              {/* Botão Voltar */}
              <HapticButton
                variant="ghost"
                size="sm"
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: ColorTokens.overlay.dark,
                  borderRadius: Radius.full,
                  padding: Spacing['2'],
                }}
                accessibilityLabel="Voltar para tela anterior"
              >
                <ArrowLeft size={24} color={colors.text.inverse} />
              </HapticButton>

              {/* Ações */}
              <Box style={{ flexDirection: 'row', gap: Spacing['2'] }}>
                <HapticButton
                  variant="ghost"
                  size="sm"
                  onPress={handleLike}
                  style={{
                    backgroundColor: ColorTokens.overlay.dark,
                    borderRadius: Radius.full,
                    padding: Spacing['2'],
                  }}
                  accessibilityLabel={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart
                    size={24}
                    color={isLiked ? colors.status.error : colors.text.inverse}
                    fill={isLiked ? colors.status.error : 'none'}
                  />
                </HapticButton>

                <HapticButton
                  variant="ghost"
                  size="sm"
                  onPress={handleShare}
                  style={{
                    backgroundColor: ColorTokens.overlay.dark,
                    borderRadius: Radius.full,
                    padding: Spacing['2'],
                  }}
                  accessibilityLabel="Compartilhar conteúdo"
                >
                  <Share2 size={24} color={colors.text.inverse} />
                </HapticButton>
              </Box>
            </Box>

            {/* Botão Play (se for vídeo) */}
            {(content.type === 'video' || content.type === 'audio') && (
              <Box style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <HapticButton
                  variant="primary"
                  size="lg"
                  onPress={handlePlay}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: Radius.full,
                    backgroundColor: colors.primary.main,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityLabel={
                    content.type === 'video' ? 'Reproduzir vídeo' : 'Reproduzir áudio'
                  }
                >
                  <Play size={40} color={colors.text.inverse} />
                </HapticButton>
              </Box>
            )}

            {/* Badge de tipo */}
            <Box
              style={{
                alignSelf: 'flex-start',
                marginLeft: Spacing['4'],
                marginBottom: Spacing['4'],
                backgroundColor: ColorTokens.overlay.heavy,
                paddingHorizontal: Spacing['3'],
                paddingVertical: Spacing['2'],
                borderRadius: Radius.lg,
              }}
            >
              <Text size="sm" color="inverse" weight="semibold">
                {content.type === 'video'
                  ? '🎥 Vídeo'
                  : content.type === 'audio'
                    ? '🎧 Áudio'
                    : '📄 Artigo'}
              </Text>
            </Box>
          </Box>
        </ImageBackground>
      ) : (
        <Box
          style={{
            width: SCREEN_WIDTH,
            height: HEADER_HEIGHT,
            backgroundColor: colors.background.elevated,
            justifyContent: 'space-between',
            paddingTop: Spacing['6'],
            paddingHorizontal: Spacing['4'],
            borderBottomLeftRadius: Radius['2xl'],
            borderBottomRightRadius: Radius['2xl'],
          }}
        >
          <HapticButton
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
            style={{ alignSelf: 'flex-start' }}
            accessibilityLabel="Voltar para tela anterior"
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </HapticButton>
        </Box>
      )}

      {/* Conteúdo scrollável */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing['4'], paddingBottom: Spacing['8'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Heading level="h2" color="primary" style={{ marginBottom: Spacing['3'] }}>
          {content.title}
        </Heading>

        {/* Metadados */}
        <Box
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing['3'],
            marginBottom: Spacing['4'],
            flexWrap: 'wrap',
          }}
        >
          {content.duration && (
            <Box style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['1'] }}>
              <Clock size={16} color={colors.text.secondary} />
              <Text size="sm" color="secondary">
                {Math.floor(content.duration / 60)} min
              </Text>
            </Box>
          )}

          {content.views_count !== undefined && (
            <Box style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['1'] }}>
              <Eye size={16} color={colors.text.secondary} />
              <Text size="sm" color="secondary">
                {content.views_count} visualizações
              </Text>
            </Box>
          )}

          {content.likes_count !== undefined && (
            <Box style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['1'] }}>
              <Heart size={16} color={colors.text.secondary} />
              <Text size="sm" color="secondary">
                {content.likes_count} curtidas
              </Text>
            </Box>
          )}

          {content.category && (
            <Box
              style={{
                backgroundColor: colors.primary.main,
                paddingHorizontal: Spacing['2'],
                paddingVertical: Spacing['1'],
                borderRadius: Radius.md,
              }}
            >
              <Text size="xs" color="inverse" weight="semibold">
                {content.category}
              </Text>
            </Box>
          )}
        </Box>

        {/* Descrição */}
        {content.description && (
          <Box style={{ marginBottom: Spacing['4'] }}>
            <Text color="primary" size="md" style={{ lineHeight: 24 }}>
              {content.description}
            </Text>
          </Box>
        )}

        {/* Autor */}
        {content.author_name && (
          <Box
            style={{
              marginTop: Spacing['4'],
              paddingTop: Spacing['4'],
              borderTopWidth: 1,
              borderTopColor: colors.border.light,
            }}
          >
            <Text size="sm" color="secondary" weight="medium">
              Por {content.author_name}
            </Text>
          </Box>
        )}
      </ScrollView>
    </View>
  );
}
