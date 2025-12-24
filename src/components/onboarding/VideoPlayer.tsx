/**
 * VideoPlayer - Player de vídeo para onboarding
 * Usa Expo AV com controles simples (play/pause, mute)
 */

import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";

interface VideoPlayerProps {
  videoSource: number | { uri: string }; // require() asset ou URI
  onVideoEnd?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  style?: object;
}

export function VideoPlayer({
  videoSource,
  onVideoEnd,
  autoPlay = true,
  loop = false,
  muted = false,
  showControls = true,
  style,
}: VideoPlayerProps) {
  const theme = useTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.playAsync().catch((error) => {
        logger.error("Erro ao iniciar vídeo", "VideoPlayer", error instanceof Error ? error : new Error(String(error)));
        setHasError(true);
      });
    }
  }, [autoPlay]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (status.didJustFinish && !loop) {
      setIsPlaying(false);
      onVideoEnd?.();
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await videoRef.current?.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current?.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      logger.error("Erro ao controlar vídeo", "VideoPlayer", error instanceof Error ? error : new Error(String(error)));
    }
  };

  const toggleMute = async () => {
    try {
      await videoRef.current?.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      logger.error("Erro ao mutar vídeo", "VideoPlayer", error instanceof Error ? error : new Error(String(error)));
    }
  };

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="videocam-off" size={48} color={theme.text.tertiary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={videoSource}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping={loop}
        isMuted={isMuted}
        shouldPlay={isPlaying}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error: string) => {
          logger.error("Erro no vídeo", "VideoPlayer", new Error(error));
          setHasError(true);
        }}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
        </View>
      )}

      {showControls && !isLoading && (
        <View style={styles.controls}>
          <Pressable
            onPress={togglePlayPause}
            style={styles.controlButton}
            accessibilityLabel={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            accessibilityRole="button"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color={Tokens.neutral[0]}
            />
          </Pressable>

          <Pressable
            onPress={toggleMute}
            style={styles.controlButton}
            accessibilityLabel={isMuted ? "Ativar som" : "Desativar som"}
            accessibilityRole="button"
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={24}
              color={Tokens.neutral[0]}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  controls: {
    position: "absolute",
    bottom: Tokens.spacing.lg,
    left: Tokens.spacing.lg,
    flexDirection: "row",
    gap: Tokens.spacing.md,
  },
  controlButton: {
    width: Tokens.accessibility.minTapTarget,
    height: Tokens.accessibility.minTapTarget,
    borderRadius: Tokens.radius.full,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Tokens.neutral[100],
    minHeight: 200,
  },
});

