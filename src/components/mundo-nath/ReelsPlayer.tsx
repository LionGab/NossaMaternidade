/**
 * ReelsPlayer - Player de Reels funcional
 * 
 * Componente para reproduzir reels (vídeos curtos verticais)
 * Usa expo-av para reprodução de vídeo
 * 
 * @version 1.0.0
 */

import { Video, ResizeMode } from 'expo-av';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens, Spacing, Radius } from '@/theme/tokens';
import { logger } from '@/utils/logger';

export interface ReelsPlayerProps {
  /** URL do vídeo do reel */
  videoUrl: string;
  /** Thumbnail do vídeo */
  thumbnailUrl?: string;
  /** Título do reel */
  title?: string;
  /** Duração em segundos */
  duration?: number;
  /** Views do reel */
  views?: number;
  /** Auto-play quando visível */
  autoPlay?: boolean;
  /** Callback quando o vídeo termina */
  onEnd?: () => void;
  /** Callback quando o vídeo é pausado */
  onPause?: () => void;
  /** Callback quando o vídeo é reproduzido */
  onPlay?: () => void;
  /** Altura do player */
  height?: number;
  /** Largura do player */
  width?: number;
}

export function ReelsPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  duration,
  views,
  autoPlay = false,
  onEnd,
  onPause,
  onPlay,
  height = 400,
  width,
}: ReelsPlayerProps) {
  const { colors, isDark } = useTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(!autoPlay);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.playAsync().catch((error) => {
        logger.error('[ReelsPlayer] Error auto-playing', error);
      });
    }
  }, [autoPlay]);

  const handlePlayPause = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (isPlaying) {
        await videoRef.current?.pauseAsync();
        setIsPlaying(false);
        onPause?.();
      } else {
        await videoRef.current?.playAsync();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      logger.error('[ReelsPlayer] Error toggling play/pause', error);
    }
  };

  const handleMuteToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onEnd?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: width || '100%',
          height,
          backgroundColor: isDark ? ColorTokens.neutral[900] : ColorTokens.neutral[0],
          borderRadius: Radius['2xl'],
          overflow: 'hidden',
        },
      ]}
    >
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping={true}
        shouldPlay={isPlaying}
        isMuted={isMuted}
        onLoad={handleVideoLoad}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ColorTokens.primary[500]} />
        </View>
      )}

      {/* Overlay gradient (bottom) */}
      <LinearGradient
        colors={['transparent', ColorTokens.overlay.dark]}
        style={styles.bottomGradient}
        pointerEvents="none"
      >
        {title && (
          <View style={styles.titleContainer}>
            <Text
              size="sm"
              weight="bold"
              style={{
                color: ColorTokens.neutral[0],
                marginBottom: Spacing['1'],
              }}
            >
              {title}
            </Text>
            {(views || duration) && (
              <View style={styles.metaContainer}>
                {views !== undefined && (
                  <Text size="xs" style={{ color: `${ColorTokens.neutral[0]}CC` }}>
                    {views.toLocaleString()} visualizações
                  </Text>
                )}
                {duration && (
                  <Text size="xs" style={{ color: `${ColorTokens.neutral[0]}CC`, marginLeft: Spacing['2'] }}>
                    {duration}s
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </LinearGradient>

      {/* Controls overlay */}
      {showControls && (
        <View style={styles.controlsOverlay} pointerEvents="box-none">
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playButton}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            {isPlaying ? (
              <Pause size={32} color={ColorTokens.neutral[0]} fill={ColorTokens.neutral[0]} />
            ) : (
              <Play size={32} color={ColorTokens.neutral[0]} fill={ColorTokens.neutral[0]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMuteToggle}
            style={styles.muteButton}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? (
              <VolumeX size={20} color={ColorTokens.neutral[0]} />
            ) : (
              <Volume2 size={20} color={ColorTokens.neutral[0]} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Tap to show/hide controls */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => {
          setShowControls(!showControls);
          if (!showControls) {
            setTimeout(() => setShowControls(false), 3000);
          }
        }}
        activeOpacity={1}
        accessibilityLabel="Toque para mostrar/ocultar controles"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    ...Tokens.shadows.lg,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorTokens.overlay.medium,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing['4'],
    paddingTop: Spacing['8'],
  },
  titleContainer: {
    marginTop: 'auto',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${ColorTokens.overlay.dark}CC`,
    alignItems: 'center',
    justifyContent: 'center',
    ...Tokens.shadows.lg,
  },
  muteButton: {
    position: 'absolute',
    top: Spacing['4'],
    right: Spacing['4'],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${ColorTokens.overlay.dark}CC`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReelsPlayer;

