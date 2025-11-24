/**
 * AudioPlayer Component - UI component for audio playback
 * Componente de UI para reprodução de áudio (sem player real por enquanto)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useHaptics } from '../hooks/useHaptics';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  duration?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  duration,
  onPlay,
  onPause,
  onEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const haptics = useHaptics();
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Converter duration string para milliseconds se fornecido
  useEffect(() => {
    if (duration) {
      const parts = duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        setDurationMs((minutes * 60 + seconds) * 1000);
      } else if (!isNaN(parseInt(duration, 10))) {
        // Se for apenas um número (segundos)
        setDurationMs(parseInt(duration, 10) * 1000);
      }
    }
  }, [duration]);

  useEffect(() => {
    if (isPlaying) {
      // Animação de pulso quando está tocando
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simular progresso (apenas visual)
      const interval = setInterval(() => {
        setPosition((prev) => {
          const newPos = prev + 100;
          if (newPos >= durationMs) {
            setIsPlaying(false);
            setPosition(0);
            progressAnim.setValue(0);
            onEnd?.();
            return 0;
          }
          const progress = newPos / durationMs;
          progressAnim.setValue(progress);
          return newPos;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, durationMs]);

  const playPause = () => {
    haptics.light();
    
    if (isPlaying) {
      setIsPlaying(false);
      onPause?.();
    } else {
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Player Controls */}
      <View style={styles.playerContainer}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={playPause}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.playButtonInner,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {isPlaying ? (
              <Ionicons name="pause" size={24} color="#fff" />
            ) : (
              <Ionicons name="play" size={24} color="#fff" />
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoContainer}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {formatTime(position)} / {duration || formatTime(durationMs)}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0px 4px 8px 0px rgba(13, 95, 255, 0.3)`,
    } : {
      shadowColor: Colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    }),
  },
  playButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.background.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: 2,
  },
});
