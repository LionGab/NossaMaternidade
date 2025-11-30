/**
 * MessageBubble Component - Chat message bubble
 * Componente de bolha de mensagem para o chat com suporte a temas
 */

import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme/tokens';

export interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isUser,
  timestamp,
  accessible = true,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Tokens.spacing['4'],
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  };

  const bubbleStyle: ViewStyle = {
    maxWidth: '85%',
    padding: Tokens.spacing['3'],
    borderRadius: Tokens.radius.xl,
    ...Tokens.shadows.sm,
    backgroundColor: isUser ? colors.primary.main : colors.background.card,
    borderBottomRightRadius: isUser ? Tokens.radius.sm : Tokens.radius.xl,
    borderBottomLeftRadius: isUser ? Tokens.radius.xl : Tokens.radius.sm,
    borderWidth: isUser ? 0 : 1,
    borderColor: colors.border.light,
  };

  const textStyle = {
    fontSize: Tokens.typography.sizes.sm,
    lineHeight: Tokens.typography.lineHeights.sm,
    color: isUser ? colors.text.inverse : colors.text.primary,
    fontFamily: Tokens.typography.fonts.body,
  };

  return (
    <View
      style={containerStyle}
      accessible={accessible}
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabel ||
        (isUser ? `Você disse: ${content}` : `NathIA respondeu: ${content}`)
      }
      accessibilityHint={isUser ? 'Mensagem enviada por você' : 'Resposta da assistente NathIA'}
    >
      <View style={bubbleStyle}>
        <Text style={textStyle}>{content}</Text>
        {timestamp && (
          <Text
            style={{
              fontSize: Tokens.typography.sizes.xs,
              color: isUser ? colors.text.inverse : colors.text.tertiary,
              marginTop: Tokens.spacing['1'],
              opacity: 0.7,
            }}
          >
            {timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

export default MessageBubble;
