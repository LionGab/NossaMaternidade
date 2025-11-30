/**
 * MoodSelector
 * 
 * Seletor de humor com emojis interativos.
 * Inspirado no design do Lofee - Health Woman UI Kit.
 * 
 * @see https://www.figma.com/design/fqH3Ro3Ll8sL2s3EJuW22H/Lofee---Woman-Health-UI-Mobile-Design-Kit
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { HapticButton } from '@/components/primitives/HapticButton';
import { useHaptics } from '@/hooks/useHaptics';

// ======================
// 🎯 TYPES
// ======================

export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'tired' | 'energetic' | 'loved';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
}

export interface MoodSelectorProps {
  /** Humor selecionado atualmente */
  selectedMood?: MoodType;
  /** Callback quando um humor é selecionado */
  onSelectMood: (mood: MoodType) => void;
  /** Callback para adicionar novo registro de humor */
  onAddMood?: () => void;
  /** Título da seção */
  title?: string;
  /** Mostrar botão de adicionar */
  showAddButton?: boolean;
}

// ======================
// 🎨 MOOD OPTIONS
// ======================

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'happy', emoji: '😊', label: 'Feliz', color: ColorTokens.mood.happy },
  { id: 'calm', emoji: '😌', label: 'Calma', color: ColorTokens.mood.calm },
  { id: 'sad', emoji: '😢', label: 'Triste', color: ColorTokens.mood.sad },
  { id: 'anxious', emoji: '😰', label: 'Ansiosa', color: ColorTokens.mood.anxious },
  { id: 'angry', emoji: '😤', label: 'Irritada', color: ColorTokens.mood.angry },
  { id: 'tired', emoji: '😴', label: 'Cansada', color: ColorTokens.mood.tired },
  { id: 'energetic', emoji: '🤩', label: 'Energética', color: ColorTokens.mood.energetic },
  { id: 'loved', emoji: '🥰', label: 'Amada', color: ColorTokens.mood.loved },
];

// ======================
// 🧩 COMPONENT
// ======================

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  onAddMood,
  title = 'Seu Humor',
  showAddButton = true,
}) => {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  const handleSelectMood = useCallback((mood: MoodType) => {
    haptics.light();
    onSelectMood(mood);
  }, [onSelectMood, haptics]);

  const handleAddMood = useCallback(() => {
    haptics.medium();
    onAddMood?.();
  }, [onAddMood, haptics]);

  return (
    <Box>
      {/* Header */}
      <Box direction="row" justify="space-between" align="center" mb="3">
        <Heading level="h4" weight="semibold">
          {title}
        </Heading>
      </Box>

      {/* Mood Options */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Mood Button */}
        {showAddButton && (
          <HapticButton
            variant="ghost"
            onPress={handleAddMood}
            style={{
              ...styles.moodButton,
              backgroundColor: isDark ? colors.background.elevated : colors.background.card,
              borderColor: colors.border.light,
              borderWidth: 2,
              borderStyle: 'dashed' as const,
            }}
            accessibilityLabel="Adicionar humor"
            accessibilityHint="Registra como você está se sentindo"
          >
            <View style={[styles.addIconContainer, { backgroundColor: colors.primary.light }]}>
              <Plus size={20} color={colors.primary.main} />
            </View>
            <Text size="xs" color="secondary" style={styles.moodLabel}>
              Adicionar
            </Text>
          </HapticButton>
        )}

        {/* Mood Options */}
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          
          return (
            <HapticButton
              key={mood.id}
              variant="ghost"
              onPress={() => handleSelectMood(mood.id)}
              style={{
                ...styles.moodButton,
                backgroundColor: isSelected 
                  ? `${mood.color}20` 
                  : isDark ? colors.background.elevated : colors.background.card,
                borderColor: isSelected ? mood.color : colors.border.light,
                borderWidth: isSelected ? 2 : 1,
              }}
              accessibilityLabel={`${mood.label} ${isSelected ? 'selecionado' : ''}`}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{mood.emoji}</Text>
              </View>
              <Text 
                size="xs" 
                weight={isSelected ? 'semibold' : 'regular'}
                color={isSelected ? 'primary' : 'secondary'} 
                style={styles.moodLabel}
              >
                {mood.label}
              </Text>
            </HapticButton>
          );
        })}
      </ScrollView>
    </Box>
  );
};

// ======================
// 💄 STYLES
// ======================

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: Tokens.spacing['4'],
    gap: Tokens.spacing['3'],
  },
  moodButton: {
    width: 72,
    height: 90,
    borderRadius: Tokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Tokens.spacing['3'],
  },
  addIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Tokens.spacing['2'],
  },
  emojiContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Tokens.spacing['2'],
  },
  emoji: {
    fontSize: 32,
  },
  moodLabel: {
    textAlign: 'center',
  },
});

export default MoodSelector;

