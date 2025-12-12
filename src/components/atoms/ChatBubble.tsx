/**
 * ChatBubble - Primitivo para mensagens de chat
 *
 * Design System compliant com tokens centralizados e acessibilidade WCAG AAA.
 *
 * Features:
 * - Suporte a reações (útil/não útil)
 * - Tokens centralizados de cores e spacing
 * - Animações suaves com Reanimated
 * - Acessibilidade completa
 * - Avatar com status online
 *
 * @example
 * <ChatBubble
 *   role="user"
 *   content="Oi NathIA!"
 *   timestamp="2025-12-02T10:30:00Z"
 *   avatar="https://..."
 *   onReaction={(type) => console.log(type)}
 * />
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { Layout, SlideInDown, SlideInUp } from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

import { Text } from './Text';

export interface ChatBubbleProps {
  /** Papel do remetente */
  role: 'user' | 'assistant';
  /** Conteúdo da mensagem */
  content: string;
  /** Timestamp ISO 8601 */
  timestamp: string;
  /** URL do avatar (apenas para assistant) */
  avatar?: string;
  /** Se é a mensagem mais recente */
  isLatest?: boolean;
  /** Callback ao reagir à mensagem */
  onReaction?: (type: 'helpful' | 'not-helpful') => void;
  /** Índice da mensagem (para animação) */
  index?: number;
  /** Estilo customizado */
  style?: ViewStyle;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({ role, content, timestamp: _timestamp, avatar, isLatest = false, onReaction, index = 0, style }) => {
    const { colors, isDark } = useTheme();
    const isUser = role === 'user';

    // Animação de entrada baseada no role
    const entering = isUser
      ? SlideInDown.duration(300).springify()
      : SlideInUp.duration(300).springify();

    // Handler de reação
    const handleReaction = (type: 'helpful' | 'not-helpful') => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      logger.info('Chat bubble reaction', { type, messageIndex: index });
      onReaction?.(type);
    };

    return (
      <Animated.View
        entering={entering}
        layout={Layout.springify()}
        style={[styles.container, { justifyContent: isUser ? 'flex-end' : 'flex-start' }, style]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={isUser ? `Você disse: ${content}` : `NathIA respondeu: ${content}`}
        accessibilityHint={isUser ? 'Sua mensagem' : 'Resposta da NathIA'}
      >
        {/* Avatar (apenas IA) - Estilo ChatGPT */}
        {!isUser && avatar && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        {/* Bubble - Estilo ChatGPT/Claude */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser
                ? (isDark ? ColorTokens.primary[600] : colors.primary.main)
                : isDark
                  ? ColorTokens.neutral[800]
                  : ColorTokens.neutral[100],
              borderBottomRightRadius: isUser ? 4 : 18,
              borderBottomLeftRadius: isUser ? 18 : 4,
            },
          ]}
        >
          {/* Conteúdo */}
          <Text
            style={{
              color: isUser ? ColorTokens.neutral[0] : colors.text.primary,
              fontSize: 15,
              lineHeight: 22,
              letterSpacing: 0.1,
            }}
          >
            {content}
          </Text>

          {/* Reações (apenas IA + latest) - Estilo ChatGPT */}
          {!isUser && isLatest && onReaction && (
            <View style={{ flexDirection: 'row', marginTop: Tokens.spacing['3'], gap: Tokens.spacing['2'] }}>
              <TouchableOpacity
                onPress={() => handleReaction('helpful')}
                style={[
                  styles.reactionButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: isDark ? ColorTokens.neutral[700] : ColorTokens.neutral[300],
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Marcar como útil"
              >
                <ThumbsUp size={16} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReaction('not-helpful')}
                style={[
                  styles.reactionButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: isDark ? ColorTokens.neutral[700] : ColorTokens.neutral[300],
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Marcar como não útil"
              >
                <ThumbsDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Tokens.spacing['4'],
    paddingHorizontal: Tokens.spacing['4'],
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Tokens.spacing['3'],
    marginBottom: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: Tokens.spacing['4'],
    paddingVertical: Tokens.spacing['3'],
    borderRadius: 18,
  },
  reactionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatBubble;
