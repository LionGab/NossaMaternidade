/**
 * ProjetoAfricaCard - Card do Projeto África com vídeo
 *
 * Componente de card com imagem/vídeo, overlay e botão de play.
 * Exibe conteúdo sobre o Projeto África com CTA para assistir vídeo.
 *
 * @requires expo-image
 * @requires expo-linear-gradient
 * @requires lucide-react-native
 * @requires expo-av (para video player)
 *
 * @example
 * <ProjetoAfricaCard
 *   title="Projeto África"
 *   description="Conheça o impacto da nossa comunidade"
 *   imageUrl="https://..."
 *   onPlayPress={() => playVideo()}
 * />
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, X } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';
import { HapticButton } from '@/components/atoms/HapticButton';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';
import { getShadowFromToken } from '@/utils/shadowHelper';

export interface ProjetoAfricaCardProps {
  /** Título do card */
  title?: string;
  /** Descrição */
  description?: string;
  /** URL da imagem de capa */
  imageUrl?: string;
  /** URL do vídeo */
  videoUrl?: string;
  /** Callback ao pressionar play (se não tiver videoUrl) */
  onPlayPress?: () => void;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Altura do card */
  height?: number;
}

export const ProjetoAfricaCard: React.FC<ProjetoAfricaCardProps> = ({
  title = 'Projeto África',
  description = 'Conheça o impacto da nossa comunidade no continente africano',
  imageUrl = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
  videoUrl,
  onPlayPress,
  disableHaptic = false,
  height = 280,
}) => {
  const colors = useThemeColors();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoRef, setVideoRef] = useState<Video | null>(null);

  const handlePlayPress = () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (videoUrl) {
      setShowVideoPlayer(true);
    } else {
      onPlayPress?.();
    }
  };

  const handleCloseVideo = async () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (videoRef) {
      await videoRef.pauseAsync();
    }
    setShowVideoPlayer(false);
  };

  return (
    <>
      <Box style={{ marginBottom: Spacing['6'], paddingHorizontal: Spacing['6'] }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePlayPress}
          style={[
            styles.card,
            {
              height,
              ...getShadowFromToken('xl', colors.text.primary),
            },
          ]}
          accessibilityLabel={`${title}: ${description}`}
          accessibilityHint="Toque para assistir o vídeo"
          accessibilityRole="button"
        >
          {/* Background Image */}
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />

          {/* Overlay Gradient */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Content */}
          <View style={styles.content}>
            {/* Play Button (centro) */}
            <View style={styles.playButtonContainer}>
              <View style={styles.playButtonOuter}>
                <View style={styles.playButtonInner}>
                  <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Text Content (bottom) */}
            <View style={styles.textContent}>
              <Heading level="h3" weight="bold" style={{ color: '#FFFFFF', marginBottom: Spacing['2'] }}>
                {title}
              </Heading>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Box>

      {/* Video Player Modal */}
      {videoUrl && (
        <Modal
          visible={showVideoPlayer}
          animationType="fade"
          transparent={false}
          onRequestClose={handleCloseVideo}
          statusBarTranslucent
        >
          <View style={styles.videoModal}>
            {/* Close Button */}
            <HapticButton
              variant="ghost"
              onPress={handleCloseVideo}
              style={styles.closeButton}
              accessibilityLabel="Fechar vídeo"
            >
              <View style={styles.closeButtonCircle}>
                <X size={24} color="#FFFFFF" />
              </View>
            </HapticButton>

            {/* Video Player */}
            <Video
              ref={(ref) => setVideoRef(ref)}
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping={false}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing['6'],
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    // Efeito de "pulse" (pode adicionar animação depois)
  },
  playButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    // Ajuste do ícone para parecer centrado visualmente
    paddingLeft: 4,
  },
  textContent: {
    // Bottom-aligned text
  },
  // Video Modal
  videoModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default ProjetoAfricaCard;
