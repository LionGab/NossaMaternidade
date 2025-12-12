/**
 * VoiceRecordBottomSheet - Bottom Sheet para Gravação de Áudio
 *
 * Substitui VoiceMode fullscreen com bottom sheet mais discreto
 * Estados: idle → gravando → preview → enviando
 *
 * @version 1.0.0
 */

import * as Haptics from 'expo-haptics';
import { Mic, Square, Play, Pause, Send, Trash2 } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { Spacing, Radius, ColorTokens } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeContext';
import { logger } from '@/utils/logger';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% da tela

interface VoiceRecordBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSendAudio: (uri: string, transcript: string) => void;
}

type RecordState = 'idle' | 'recording' | 'preview' | 'sending';

export function VoiceRecordBottomSheet({
  visible,
  onClose,
  onSendAudio,
}: VoiceRecordBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // State
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  // Hooks
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    hasPermission,
    isPlayingPreview,
    playPreview,
    stopPreview,
  } = useVoiceRecording();

  // Animations
  const translateY = useSharedValue(SHEET_HEIGHT);
  const waveScale = useSharedValue(1);

  // Open/close animation
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      setRecordState('idle');
    } else {
      translateY.value = withSpring(SHEET_HEIGHT);
      setRecordState('idle');
      setRecordingUri(null);
      setDuration(0);
    }
  }, [visible, translateY]);

  // Waveform animation during recording
  useEffect(() => {
    if (isRecording) {
      waveScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(0.8, { duration: 300 })
        ),
        -1,
        true
      );
    } else {
      waveScale.value = withTiming(1);
    }
  }, [isRecording, waveScale]);

  // Update duration when recording
  useEffect(() => {
    setDuration(recordingDuration);
  }, [recordingDuration]);

  // Animated styles
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
  }));

  // Handlers
  const handleStartRecording = useCallback(async () => {
    try {
      if (!hasPermission) {
        logger.warn('[VoiceBottomSheet] Permission not granted');
        // TODO: Mostrar alerta pedindo permissão
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await startRecording();
      setRecordState('recording');
      logger.info('[VoiceBottomSheet] Recording started', { uri });
    } catch (error) {
      logger.error('[VoiceBottomSheet] Failed to start recording', error);
    }
  }, [hasPermission, startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uri = await stopRecording();
      if (uri) {
        setRecordingUri(uri);
        setRecordState('preview');
        logger.info('[VoiceBottomSheet] Recording stopped', { uri, duration });
      }
    } catch (error) {
      logger.error('[VoiceBottomSheet] Failed to stop recording', error);
    }
  }, [stopRecording, duration]);

  const handlePlayPreview = useCallback(async () => {
    if (!recordingUri) return;

    try {
      if (isPlayingPreview) {
        await stopPreview();
      } else {
        await playPreview();
      }
    } catch (error) {
      logger.error('[VoiceBottomSheet] Failed to play preview', error);
    }
  }, [recordingUri, isPlayingPreview, playPreview, stopPreview]);

  const handleDelete = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await stopPreview();
    setRecordingUri(null);
    setDuration(0);
    setRecordState('idle');
  }, [stopPreview]);

  const handleSend = useCallback(async () => {
    if (!recordingUri) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRecordState('sending');
      await stopPreview();

      // TODO: Implementar transcrição real via STT (Speech-to-Text)
      // const transcript = await transcribeAudio(recordingUri);
      const mockTranscript = 'Mensagem de voz enviada (transcrição futura)';

      onSendAudio(recordingUri, mockTranscript);
      onClose();

      logger.info('[VoiceBottomSheet] Audio sent', {
        uri: recordingUri,
        duration,
      });
    } catch (error) {
      logger.error('[VoiceBottomSheet] Failed to send audio', error);
      setRecordState('preview');
    }
  }, [recordingUri, duration, stopPreview, onSendAudio, onClose]);

  const handleClose = useCallback(() => {
    if (recordState === 'recording') {
      cancelRecording();
    }
    stopPreview();
    onClose();
  }, [recordState, cancelRecording, stopPreview, onClose]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const COLORS = {
    backdrop: 'rgba(0, 0, 0, 0.5)',
    sheet: isDark ? colors.background.card : '#FFFFFF',
    border: ColorTokens.neutral[200],
    accent: ColorTokens.primary[500],
    error: ColorTokens.error[500],
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: COLORS.backdrop }} />
      </Pressable>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          sheetStyle,
          {
            height: SHEET_HEIGHT,
            backgroundColor: COLORS.sheet,
            borderTopColor: COLORS.border,
            paddingBottom: insets.bottom + Spacing['4'],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: ColorTokens.neutral[300] }]} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Idle State - Pronto para gravar */}
          {recordState === 'idle' && (
            <View style={styles.stateContainer}>
              <Text
                style={{ fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: Spacing['2'] }}
              >
                Gravar mensagem de voz
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.text.secondary, textAlign: 'center', marginBottom: Spacing['6'] }}>
                Toque no microfone para começar
              </Text>

              <TouchableOpacity
                onPress={handleStartRecording}
                style={[styles.recordButton, { backgroundColor: COLORS.accent }]}
                accessibilityLabel="Gravar mensagem de voz"
                accessibilityRole="button"
              >
                <Mic size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Recording State - Gravando */}
          {recordState === 'recording' && (
            <View style={styles.stateContainer}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.accent, marginBottom: Spacing['2'] }}>
                Gravando...
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: Spacing['4'] }}>
                {formatDuration(duration)}
              </Text>

              {/* Waveform animation */}
              <View style={styles.waveformContainer}>
                {[...Array(5)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.waveBar,
                      waveStyle,
                      {
                        backgroundColor: COLORS.accent,
                        height: 20 + i * 8,
                        marginHorizontal: 3,
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleStopRecording}
                style={[styles.stopButton, { backgroundColor: COLORS.error }]}
                accessibilityLabel="Parar gravação"
                accessibilityRole="button"
              >
                <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Preview State - Preview do áudio */}
          {recordState === 'preview' && (
            <View style={styles.stateContainer}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text.primary, marginBottom: Spacing['2'] }}>
                Mensagem gravada
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: Spacing['6'] }}>
                {formatDuration(duration)}
              </Text>

              <View style={styles.previewActions}>
                {/* Play/Pause */}
                <TouchableOpacity
                  onPress={handlePlayPreview}
                  style={[styles.iconButton, { backgroundColor: `${COLORS.accent}20` }]}
                  accessibilityLabel={isPlayingPreview ? 'Pausar' : 'Reproduzir'}
                  accessibilityRole="button"
                >
                  {isPlayingPreview ? (
                    <Pause size={24} color={COLORS.accent} />
                  ) : (
                    <Play size={24} color={COLORS.accent} fill={COLORS.accent} />
                  )}
                </TouchableOpacity>

                {/* Delete */}
                <TouchableOpacity
                  onPress={handleDelete}
                  style={[styles.iconButton, { backgroundColor: `${COLORS.error}20` }]}
                  accessibilityLabel="Excluir gravação"
                  accessibilityRole="button"
                >
                  <Trash2 size={24} color={COLORS.error} />
                </TouchableOpacity>

                {/* Send */}
                <TouchableOpacity
                  onPress={handleSend}
                  style={[styles.sendButton, { backgroundColor: COLORS.accent }]}
                  accessibilityLabel="Enviar áudio"
                  accessibilityRole="button"
                >
                  <Send size={24} color="#FFFFFF" />
                  <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                    Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Sending State - Enviando */}
          {recordState === 'sending' && (
            <View style={styles.stateContainer}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text.primary, marginBottom: Spacing['4'] }}>
                Enviando mensagem...
              </Text>
              {/* TODO: Adicionar indicador de progresso */}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius['3xl'],
    borderTopRightRadius: Radius['3xl'],
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3'],
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing['6'],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: Spacing['4'],
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['5'],
    borderRadius: Radius.full,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
