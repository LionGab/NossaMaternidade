/**
 * useVoice Hook
 *
 * Gerencia playback de voz da NathIA com ElevenLabs TTS.
 * Verifica status premium antes de permitir reproducao.
 * Cacheia audio gerado para replay sem custo adicional.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import {
  generateSpeech,
  playAudio,
  stopAudio,
  isElevenLabsConfigured,
} from "../api/elevenlabs";
import { useHasVoiceAccess, usePremiumStore } from "../state/premium-store";
import { logger } from "../utils/logger";

// ============================================
// TIPOS
// ============================================

interface VoiceState {
  isPlaying: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  currentMessageId: string | null;
  progress: number; // 0-1
}

interface UseVoiceReturn extends VoiceState {
  // Actions
  playMessage: (messageId: string, text: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  togglePlayback: (messageId: string, text: string) => Promise<void>;

  // Status
  canUseVoice: boolean;
  isConfigured: boolean;

  // Helpers
  hasAudioCached: (messageId: string) => boolean;
}

interface CachedAudio {
  fileUri: string;
  text: string;
  generatedAt: number;
}

// ============================================
// CONSTANTES
// ============================================

// Cache de audio gerado (evita regenerar para mesma mensagem)
const audioCache = new Map<string, CachedAudio>();

// Limite de cache (10 mensagens)
const MAX_CACHE_SIZE = 10;

// ============================================
// HOOK
// ============================================

export function useVoice(): UseVoiceReturn {
  // Estado
  const [state, setState] = useState<VoiceState>({
    isPlaying: false,
    isLoading: false,
    isGenerating: false,
    error: null,
    currentMessageId: null,
    progress: 0,
  });

  // Refs
  const soundRef = useRef<Audio.Sound | null>(null);
  const playbackStatusSubscription = useRef<((status: any) => void) | null>(null);

  // Premium access
  const hasVoiceAccess = useHasVoiceAccess();
  const isPremium = usePremiumStore((s) => s.isPremium);

  // Verificar se pode usar voz
  const canUseVoice = hasVoiceAccess || isPremium;
  const isConfigured = isElevenLabsConfigured();

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  /**
   * Limpa recursos de audio
   */
  const cleanup = useCallback(async () => {
    if (soundRef.current) {
      try {
        await stopAudio(soundRef.current);
      } catch {
        // Ignorar erros de cleanup
      }
      soundRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isLoading: false,
      currentMessageId: null,
      progress: 0,
    }));
  }, []);

  /**
   * Verifica se tem audio em cache para uma mensagem
   */
  const hasAudioCached = useCallback((messageId: string): boolean => {
    return audioCache.has(messageId);
  }, []);

  /**
   * Gerencia cache de audio (LRU simples)
   */
  const addToCache = useCallback((messageId: string, fileUri: string, text: string) => {
    // Se cache cheio, remover mais antigo
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = audioCache.keys().next().value;
      if (oldestKey) {
        audioCache.delete(oldestKey);
      }
    }

    audioCache.set(messageId, {
      fileUri,
      text,
      generatedAt: Date.now(),
    });
  }, []);

  /**
   * Callback de status do playback
   */
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;

    // Calcular progresso
    if (status.durationMillis && status.positionMillis) {
      const progress = status.positionMillis / status.durationMillis;
      setState((prev) => ({ ...prev, progress }));
    }

    // Detectar fim do playback
    if (status.didJustFinish) {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        progress: 0,
        currentMessageId: null,
      }));

      // Descarregar som
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    }
  }, []);

  /**
   * Para reproducao atual
   */
  const stopPlayback = useCallback(async (): Promise<void> => {
    await cleanup();
  }, [cleanup]);

  /**
   * Reproduz mensagem com voz
   *
   * @param messageId - ID unico da mensagem
   * @param text - Texto para converter em fala
   */
  const playMessage = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      // Verificar premium
      if (!canUseVoice) {
        setState((prev) => ({
          ...prev,
          error: "Acesso premium necessario para voz da NathIA",
        }));
        return;
      }

      // Verificar configuracao
      if (!isConfigured) {
        setState((prev) => ({
          ...prev,
          error: "Servico de voz nao configurado",
        }));
        return;
      }

      // Limpar erro anterior
      setState((prev) => ({ ...prev, error: null }));

      // Se ja tocando esta mensagem, parar
      if (state.isPlaying && state.currentMessageId === messageId) {
        await stopPlayback();
        return;
      }

      // Se tocando outra mensagem, parar primeiro
      if (state.isPlaying) {
        await stopPlayback();
      }

      try {
        let fileUri: string;

        // Verificar cache
        const cached = audioCache.get(messageId);

        if (cached && cached.text === text) {
          // Usar cache
          fileUri = cached.fileUri;
          logger.info("Using cached audio", "useVoice", { messageId });
        } else {
          // Gerar novo audio
          setState((prev) => ({
            ...prev,
            isGenerating: true,
            isLoading: true,
            currentMessageId: messageId,
          }));

          fileUri = await generateSpeech({ text });

          // Adicionar ao cache
          addToCache(messageId, fileUri, text);

          setState((prev) => ({
            ...prev,
            isGenerating: false,
          }));
        }

        // Reproduzir
        setState((prev) => ({
          ...prev,
          isLoading: true,
          currentMessageId: messageId,
        }));

        const sound = await playAudio(fileUri);
        soundRef.current = sound;

        // Configurar listener de status
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        setState((prev) => ({
          ...prev,
          isPlaying: true,
          isLoading: false,
          progress: 0,
        }));

        logger.info("Voice playback started", "useVoice", { messageId });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao reproduzir voz";

        logger.error(
          "Voice playback failed",
          "useVoice",
          error instanceof Error ? error : new Error(String(error))
        );

        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          isGenerating: false,
          error: errorMessage,
          currentMessageId: null,
        }));
      }
    },
    [
      canUseVoice,
      isConfigured,
      state.isPlaying,
      state.currentMessageId,
      stopPlayback,
      addToCache,
      onPlaybackStatusUpdate,
    ]
  );

  /**
   * Toggle play/pause para uma mensagem
   */
  const togglePlayback = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      if (state.isPlaying && state.currentMessageId === messageId) {
        // Pausar
        if (soundRef.current) {
          try {
            await soundRef.current.pauseAsync();
            setState((prev) => ({ ...prev, isPlaying: false }));
          } catch (error) {
            // Se erro ao pausar, parar completamente
            await stopPlayback();
          }
        }
      } else if (!state.isPlaying && state.currentMessageId === messageId && soundRef.current) {
        // Retomar
        try {
          await soundRef.current.playAsync();
          setState((prev) => ({ ...prev, isPlaying: true }));
        } catch (error) {
          // Se erro ao retomar, regenerar
          await playMessage(messageId, text);
        }
      } else {
        // Nova mensagem
        await playMessage(messageId, text);
      }
    },
    [state.isPlaying, state.currentMessageId, stopPlayback, playMessage]
  );

  return {
    // State
    ...state,

    // Actions
    playMessage,
    stopPlayback,
    togglePlayback,

    // Status
    canUseVoice,
    isConfigured,

    // Helpers
    hasAudioCached,
  };
}

// ============================================
// HOOK DE PREMIUM GATE PARA VOZ
// ============================================

/**
 * Hook auxiliar para verificar se deve mostrar paywall
 * antes de tentar reproduzir voz
 */
export function useVoicePremiumGate() {
  const hasVoiceAccess = useHasVoiceAccess();
  const isPremium = usePremiumStore((s) => s.isPremium);

  const checkAccess = useCallback(
    (onGranted: () => void, onDenied: () => void) => {
      if (hasVoiceAccess || isPremium) {
        onGranted();
      } else {
        onDenied();
      }
    },
    [hasVoiceAccess, isPremium]
  );

  return {
    hasAccess: hasVoiceAccess || isPremium,
    checkAccess,
  };
}

export default useVoice;
