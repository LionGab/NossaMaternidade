/**
 * ChatEmptyState - Empty State Empático do Chat
 *
 * Estado inicial do chat com avatar animado, greeting dinâmico e chips contextuais.
 * Design acolhedor e maternal com breathing effect no avatar.
 *
 * Features:
 * - Avatar com breathing effect (animação sutil)
 * - Greeting dinâmico baseado em hora do dia
 * - Badge de verificação
 * - Chips de sugestão contextualizados
 * - Animações de entrada suaves
 *
 * @example
 * <ChatEmptyState
 *   avatarUrl="https://..."
 *   userName="Maria"
 *   chips={dynamicChips}
 *   onSuggestionPress={(text) => sendMessage(text)}
 * />
 */

import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import { ChatSuggestionChips } from '@/components/molecules/ChatSuggestionChips';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens } from '@/theme/tokens';
import type { DynamicChip } from '@/utils/buildUserContext';

export interface ChatEmptyStateProps {
  /** URL do avatar da NathIA */
  avatarUrl: string;
  /** Greeting customizado (opcional) */
  greeting?: string;
  /** Nome da usuária */
  userName?: string;
  /** Chips de sugestão */
  chips: DynamicChip[];
  /** Callback ao pressionar sugestão */
  onSuggestionPress: (text: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  avatarUrl,
  greeting,
  userName = 'mãe',
  chips,
  onSuggestionPress,
}) => {
  const { colors } = useTheme();

  // Animações
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const breathe = useSharedValue(1);

  useEffect(() => {
    // Fade in inicial
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 500 });

    // Breathing effect no avatar (sutil e contínuo)
    breathe.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1,
      true
    );
  }, [scale, opacity, breathe]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  // Greeting dinâmico baseado em hora do dia
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return `Bom dia, ${userName}! Como você dormiu?`;
    if (hour < 18) return `Oi, ${userName}! Como está sendo seu dia?`;
    return `Boa noite, ${userName}! Vamos conversar?`;
  };

  const finalGreeting = greeting || getDynamicGreeting();

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Avatar com breathing effect - Estilo ChatGPT */}
      <Animated.View style={[styles.avatarContainer, breatheStyle]}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      {/* Nome - Minimalista */}
      <Text
        weight="semibold"
        style={{
          marginTop: Tokens.spacing['5'],
          fontSize: 20,
          letterSpacing: -0.3,
          color: colors.text.primary,
        }}
      >
        NathIA
      </Text>

      {/* Greeting - Estilo ChatGPT */}
      <Text
        color="secondary"
        size="md"
        align="center"
        style={{
          maxWidth: 320,
          marginTop: Tokens.spacing['4'],
          lineHeight: 24,
          fontSize: 15,
          letterSpacing: 0.1,
        }}
      >
        {finalGreeting}
      </Text>

      {/* Chips de Sugestão - Estilo ChatGPT */}
      <View style={{ marginTop: Tokens.spacing['6'], width: '100%', alignItems: 'center' }}>
        <ChatSuggestionChips chips={chips} onPress={onSuggestionPress} maxChips={4} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Tokens.spacing['6'],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

export default ChatEmptyState;
