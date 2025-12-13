/**
 * VoiceMessagePlayer
 *
 * Player inline para reproducao de voz da NathIA nas mensagens.
 * Mostra botao de play/pause com estados de loading.
 * Exibe icone de cadeado para usuarios nao-premium.
 */

import React, { memo, useCallback } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { useVoice, useVoicePremiumGate } from "../hooks/useVoice";
import { PRIMARY_COLOR } from "../utils/colors";
import { cn } from "../utils/cn";

// ============================================
// TIPOS
// ============================================

interface VoiceMessagePlayerProps {
  /** ID unico da mensagem */
  messageId: string;
  /** Texto da mensagem para converter em voz */
  text: string;
  /** Callback quando usuario sem premium tenta usar */
  onPremiumRequired?: () => void;
  /** Tamanho do botao */
  size?: "small" | "medium" | "large";
  /** Estilo compacto (apenas icone) */
  compact?: boolean;
  /** Cor do icone */
  iconColor?: string;
  /** Classe adicional */
  className?: string;
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/**
 * Indicador de audio animado (barras)
 */
const AudioWaveIndicator = memo(({ color }: { color: string }) => {
  const bar1 = useSharedValue(0.3);
  const bar2 = useSharedValue(0.6);
  const bar3 = useSharedValue(0.4);

  React.useEffect(() => {
    bar1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 })
      ),
      -1,
      true
    );

    bar2.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 250 }),
        withTiming(1, { duration: 250 })
      ),
      -1,
      true
    );

    bar3.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 350 }),
        withTiming(0.2, { duration: 350 })
      ),
      -1,
      true
    );
  }, []);

  const bar1Style = useAnimatedStyle(() => ({
    height: `${bar1.value * 100}%`,
  }));

  const bar2Style = useAnimatedStyle(() => ({
    height: `${bar2.value * 100}%`,
  }));

  const bar3Style = useAnimatedStyle(() => ({
    height: `${bar3.value * 100}%`,
  }));

  return (
    <View className="flex-row items-end justify-center h-4 gap-0.5">
      <Animated.View
        style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar1Style]}
      />
      <Animated.View
        style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar2Style]}
      />
      <Animated.View
        style={[{ backgroundColor: color, width: 3, borderRadius: 1.5 }, bar3Style]}
      />
    </View>
  );
});

AudioWaveIndicator.displayName = "AudioWaveIndicator";

/**
 * Progress bar de reproducao
 */
const ProgressBar = memo(({ progress, color }: { progress: number; color: string }) => {
  return (
    <View className="h-1 bg-gray-200 rounded-full overflow-hidden flex-1 mx-2">
      <View
        style={{
          width: `${progress * 100}%`,
          backgroundColor: color,
          height: "100%",
          borderRadius: 999,
        }}
      />
    </View>
  );
});

ProgressBar.displayName = "ProgressBar";

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = memo(
  ({
    messageId,
    text,
    onPremiumRequired,
    size = "medium",
    compact = true,
    iconColor = PRIMARY_COLOR,
    className,
  }) => {
    // Hooks
    const voice = useVoice();
    const { hasAccess } = useVoicePremiumGate();

    // Estados derivados
    const isCurrentMessage = voice.currentMessageId === messageId;
    const isPlaying = voice.isPlaying && isCurrentMessage;
    const isLoading = (voice.isLoading || voice.isGenerating) && isCurrentMessage;
    const isCached = voice.hasAudioCached(messageId);

    // Tamanhos
    const sizeConfig = {
      small: { button: 32, icon: 16 },
      medium: { button: 40, icon: 20 },
      large: { button: 48, icon: 24 },
    };

    const { button: buttonSize, icon: iconSize } = sizeConfig[size];

    /**
     * Handler de toque no botao
     */
    const handlePress = useCallback(async () => {
      // Se nao tem acesso premium, mostrar paywall
      if (!hasAccess) {
        onPremiumRequired?.();
        return;
      }

      // Toggle playback
      await voice.togglePlayback(messageId, text);
    }, [hasAccess, onPremiumRequired, voice, messageId, text]);

    /**
     * Renderiza icone do botao
     */
    const renderIcon = () => {
      // Loading
      if (isLoading) {
        return (
          <ActivityIndicator
            size="small"
            color={iconColor}
          />
        );
      }

      // Playing - mostrar animacao de audio
      if (isPlaying) {
        return <AudioWaveIndicator color={iconColor} />;
      }

      // Nao premium - mostrar cadeado
      if (!hasAccess) {
        return (
          <View className="relative">
            <Ionicons name="mic-outline" size={iconSize} color={iconColor} />
            <View
              className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full"
              style={{ padding: 1 }}
            >
              <Ionicons name="lock-closed" size={iconSize * 0.5} color="#9CA3AF" />
            </View>
          </View>
        );
      }

      // Idle - mostrar play ou mic
      return (
        <Ionicons
          name={isCached ? "play" : "mic-outline"}
          size={iconSize}
          color={iconColor}
        />
      );
    };

    // Versao compacta (apenas botao)
    if (compact) {
      return (
        <Pressable
          onPress={handlePress}
          disabled={isLoading}
          className={cn(
            "items-center justify-center rounded-full",
            isLoading && "opacity-70",
            className
          )}
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: isPlaying ? `${iconColor}15` : "transparent",
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {renderIcon()}
        </Pressable>
      );
    }

    // Versao expandida (com progress bar)
    return (
      <View
        className={cn(
          "flex-row items-center rounded-full px-2 py-1",
          className
        )}
        style={{
          backgroundColor: `${iconColor}10`,
        }}
      >
        <Pressable
          onPress={handlePress}
          disabled={isLoading}
          className="items-center justify-center rounded-full"
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: isPlaying ? iconColor : "transparent",
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isPlaying ? "#fff" : iconColor} />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={iconSize}
              color={isPlaying ? "#fff" : iconColor}
            />
          )}
        </Pressable>

        {/* Progress bar quando tocando */}
        {isPlaying && <ProgressBar progress={voice.progress} color={iconColor} />}

        {/* Indicador de voz quando nao tocando */}
        {!isPlaying && (
          <View className="flex-row items-center ml-2">
            <Ionicons name="mic-outline" size={14} color={iconColor} />
            {!hasAccess && (
              <Ionicons name="lock-closed" size={10} color="#9CA3AF" className="ml-0.5" />
            )}
          </View>
        )}
      </View>
    );
  }
);

VoiceMessagePlayer.displayName = "VoiceMessagePlayer";

// ============================================
// COMPONENTE DE BOTAO FLUTUANTE
// ============================================

interface FloatingVoiceButtonProps {
  messageId: string;
  text: string;
  onPremiumRequired?: () => void;
}

/**
 * Botao flutuante para ativar voz
 * Usado em cima das mensagens da IA
 */
export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = memo(
  ({ messageId, text, onPremiumRequired }) => {
    return (
      <View className="absolute -right-1 -top-1">
        <VoiceMessagePlayer
          messageId={messageId}
          text={text}
          onPremiumRequired={onPremiumRequired}
          size="small"
          compact
          iconColor={PRIMARY_COLOR}
          className="bg-white shadow-sm"
        />
      </View>
    );
  }
);

FloatingVoiceButton.displayName = "FloatingVoiceButton";

export default VoiceMessagePlayer;
