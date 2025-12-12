/**
 * ChatSuggestionChips - Chips de Sugestão Contextualizados
 *
 * Chips inteligentes baseados no perfil e contexto da usuária.
 * Design empático com tokens centralizados e acessibilidade WCAG AAA.
 *
 * Features:
 * - Touch targets 44pt mínimos
 * - Haptic feedback ao tocar
 * - Emojis + texto descritivo
 * - Limite configurável de chips
 * - Acessibilidade completa
 *
 * @example
 * <ChatSuggestionChips
 *   chips={dynamicChips}
 *   onPress={(text) => sendMessage(text)}
 *   maxChips={4}
 * />
 */

import * as Haptics from 'expo-haptics';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import type { DynamicChip } from '@/utils/buildUserContext';
import { logger } from '@/utils/logger';

export interface ChatSuggestionChipsProps {
  /** Lista de chips dinâmicos */
  chips: DynamicChip[];
  /** Callback ao pressionar chip */
  onPress: (text: string) => void;
  /** Número máximo de chips visíveis */
  maxChips?: number;
}

export const ChatSuggestionChips: React.FC<ChatSuggestionChipsProps> = ({
  chips,
  onPress,
  maxChips = 4,
}) => {
  const { isDark } = useTheme();

  const handlePress = (chip: DynamicChip) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Formatar texto com emoji
    const formattedText = `${chip.emoji} ${chip.text}`;

    logger.info('Suggestion chip pressed', {
      text: chip.text,
      category: chip.category,
      priority: chip.priority,
    });

    onPress(formattedText);
  };

  // Ordenar por prioridade e limitar
  const visibleChips = [...chips].sort((a, b) => a.priority - b.priority).slice(0, maxChips);

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Tokens.spacing['2'],
        paddingHorizontal: Tokens.spacing['4'],
      }}
    >
      {visibleChips.map((chip, idx) => (
        <TouchableOpacity
          key={`${chip.category}-${chip.text}-${idx}`}
          onPress={() => handlePress(chip)}
          activeOpacity={0.7}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: Tokens.spacing['4'],
              paddingVertical: Tokens.spacing['3'],
              borderRadius: 999,
              borderWidth: 1,
              minHeight: 44, // iOS touch target mínimo (WCAG/Apple HIG)
              backgroundColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[50],
              borderColor: isDark ? ColorTokens.neutral[700] : ColorTokens.neutral[200],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Sugestão: ${chip.text}`}
          accessibilityHint="Toque duas vezes para enviar esta mensagem para a NathIA"
        >
          <Text style={{ marginRight: 6, fontSize: 16 }}>{chip.emoji}</Text>
          <Text
            size="sm"
            style={{
              color: isDark ? ColorTokens.neutral[200] : ColorTokens.neutral[700],
              fontSize: 14,
              letterSpacing: 0.1,
            }}
          >
            {chip.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ChatSuggestionChips;
