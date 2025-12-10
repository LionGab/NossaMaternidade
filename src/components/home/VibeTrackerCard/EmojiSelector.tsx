/**
 * EmojiSelector - Seletor de emojis em grid
 *
 * Componente de grid de emojis selecionáveis com animação de seleção.
 * Usado no VibeTrackerCard para escolher o emoji que representa a vibe do dia.
 *
 * @example
 * <EmojiSelector
 *   emojis={[
 *     { emoji: '😍', label: 'Muito feliz' },
 *     { emoji: '😂', label: 'Divertida' },
 *     // ...
 *   ]}
 *   selectedEmoji="😍"
 *   onSelect={(emoji) => setSelectedEmoji(emoji)}
 * />
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

export interface Emoji {
  /** Emoji unicode (ex: '😍') */
  emoji: string;
  /** Label descritivo (ex: 'Muito feliz') */
  label: string;
}

export interface EmojiSelectorProps {
  /** Array de emojis disponíveis */
  emojis: Emoji[];
  /** Emoji atualmente selecionado (string emoji) */
  selectedEmoji: string | null;
  /** Callback quando emoji é selecionado */
  onSelect: (emoji: string) => void;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Número de colunas no grid (padrão: 4) */
  columns?: number;
}

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  emojis,
  selectedEmoji,
  onSelect,
  disableHaptic = false,
  columns = 4,
}) => {
  const colors = useThemeColors();

  const handleEmojiPress = (emoji: string) => {
    // Haptic feedback
    if (!disableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onSelect(emoji);
  };

  return (
    <View style={styles.container}>
      {emojis.map((item, index) => {
        const isSelected = item.emoji === selectedEmoji;

        return (
          <View
            key={`emoji-${index}`}
            style={[
              styles.emojiContainer,
              {
                width: `${100 / columns}%`, // Dividir por colunas
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleEmojiPress(item.emoji)}
              activeOpacity={0.7}
              style={[
                styles.emojiButton,
                isSelected && {
                  backgroundColor: colors.primary.light,
                  transform: [{ scale: 1.15 }],
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar emoção ${item.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={styles.emojiText}>{item.emoji}</Text>

              {/* Indicador de seleção (círculo colorido) */}
              {isSelected && (
                <View
                  style={[
                    styles.selectionIndicator,
                    {
                      borderColor: colors.primary.main,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>

            {/* Label abaixo do emoji */}
            <Text
              style={[
                styles.label,
                {
                  color: isSelected
                    ? colors.primary.main
                    : colors.text.secondary,
                },
                isSelected && styles.labelSelected,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Tokens.spacing['2'], // 8px de espaçamento
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: Tokens.spacing['3'], // 12px entre linhas
  },
  emojiButton: {
    width: 64, // Tamanho fixo para consistência
    height: 64,
    minHeight: 44, // Touch target mínimo (iOS HIG)
    minWidth: 44,
    borderRadius: Tokens.radius.full, // Circular
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    // Transição suave (web only)
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    }),
  },
  emojiText: {
    fontSize: 30, // Emoji grande
    textAlign: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Tokens.radius.full,
    borderWidth: 2.5,
  },
  label: {
    fontSize: Tokens.typography.sizes.xs,
    fontWeight: '500', // Medium
    textAlign: 'center',
    marginTop: Tokens.spacing['1.5'],
  },
  labelSelected: {
    fontWeight: '600', // Semibold quando selecionado
  },
});

export default EmojiSelector;
