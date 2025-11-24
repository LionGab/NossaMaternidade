import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useHaptics } from '../hooks/useHaptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const haptics = useHaptics();
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      // Limpar ao desmontar
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      
      // Configurar modo de áudio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Carregar áudio
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );

      // Configurar callbacks
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDurationMs(status.durationMillis || 0);
          
          // Atualizar animação de progresso
          const progress = status.durationMillis
            ? (status.positionMillis || 0) / status.durationMillis
            : 0;
          progressAnim.setValue(progress);

          // Verificar se terminou
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
            progressAnim.setValue(0);
            onEnd?.();
          }
        }
      });

      setSound(audioSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const playPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    try {
      haptics.light();
      
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        onPause?.();
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
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
          disabled={isLoading}
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
            {isLoading ? (
              <Ionicons name="hourglass" size={24} color="#fff" />
            ) : isPlaying ? (
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
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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

