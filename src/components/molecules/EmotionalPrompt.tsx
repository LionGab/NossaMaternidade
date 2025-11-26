/**
 * EmotionalPrompt - Check-in emocional com 5 emojis
 * "Como você tá hoje?" → Bem, Triste, Ansiosa, Cansada, Calma
 */

import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Spacing, TouchTargets } from '@/theme/tokens';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColors } from '@/theme';

export type EmotionValue = 'bem' | 'triste' | 'ansiosa' | 'cansada' | 'calma';

export interface EmotionalPromptProps {
  title?: string;
  selectedEmotion?: EmotionValue;
  onSelect: (emotion: EmotionValue) => void;
}

interface EmotionOption {
  emoji: string;
  label: string;
  value: EmotionValue;
}

const DEFAULT_EMOTIONS: EmotionOption[] = [
  { emoji: '😊', label: 'Bem', value: 'bem' },
  { emoji: '😢', label: 'Triste', value: 'triste' },
  { emoji: '😰', label: 'Ansiosa', value: 'ansiosa' },
  { emoji: '😴', label: 'Cansada', value: 'cansada' },
  { emoji: '😌', label: 'Calma', value: 'calma' },
];

export function EmotionalPrompt({
  title = 'Como você tá hoje?',
  selectedEmotion,
  onSelect,
}: EmotionalPromptProps) {
  const colors = useThemeColors();
  const haptics = useHaptics();

  const handleSelect = (emotion: EmotionValue) => {
    haptics.light();
    onSelect(emotion);
  };

  return (
    <Box>
      {/* Título */}
      {title && (
        <Text
          size="md"
          color="secondary"
          weight="medium"
          style={{ marginBottom: Spacing['3'] }}
        >
          {title}
        </Text>
      )}

      {/* Grid de emojis */}
      <Box
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: Spacing['2'],
        }}
      >
        {DEFAULT_EMOTIONS.map((emotion) => {
          const isSelected = selectedEmotion === emotion.value;

          return (
            <TouchableOpacity
              key={emotion.value}
              onPress={() => handleSelect(emotion.value)}
              accessibilityRole="button"
              accessibilityLabel={`Estou me sentindo ${emotion.label} hoje`}
              accessibilityState={{ selected: isSelected }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: TouchTargets.min,
                minHeight: TouchTargets.min,
                paddingVertical: Spacing['2'],
                paddingHorizontal: Spacing['1'],
              }}
            >
              {/* Emoji */}
              <Text
                style={{
                  fontSize: 32,
                  lineHeight: 40,
                  opacity: isSelected ? 1 : 0.6,
                  transform: [{ scale: isSelected ? 1.1 : 1 }],
                }}
              >
                {emotion.emoji}
              </Text>

              {/* Label */}
              <Text
                size="xs"
                color={isSelected ? 'primary' : 'tertiary'}
                weight={isSelected ? 'semibold' : 'regular'}
                style={{ marginTop: Spacing['1'], textAlign: 'center' }}
              >
                {emotion.label}
              </Text>

              {/* Indicador de seleção (barra embaixo) */}
              {isSelected && (
                <Box
                  style={{
                    width: 24,
                    height: 3,
                    backgroundColor: colors.primary.main,
                    borderRadius: 2,
                    marginTop: Spacing['1'],
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
}
