/**
 * MoodSelector - Seletor de Humor Horizontal
 *
 * Adaptado do GeminiApp para React Native
 * Scroll horizontal com 5 opcoes de humor
 *
 * @version 1.0.0
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Text as RNText,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, Radius, Shadows, ColorTokens, Typography, DarkTheme, LightTheme } from '../theme/tokens';

const ITEM_WIDTH = 72;
const ITEM_GAP = 12;

export type MoodType = 'dificil' | 'cansada' | 'bem' | 'otima' | 'super';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'dificil',
    label: 'Dificil',
    emoji: '😔',
    color: ColorTokens.accent.coral,
    bgColor: ColorTokens.accent.coralLight,
  },
  {
    id: 'cansada',
    label: 'Cansada',
    emoji: '😮‍💨',
    color: ColorTokens.accent.sunshine,
    bgColor: ColorTokens.accent.sunshineLight,
  },
  {
    id: 'bem',
    label: 'Bem',
    emoji: '🙂',
    color: ColorTokens.accent.ocean,
    bgColor: ColorTokens.accent.oceanLight,
  },
  {
    id: 'otima',
    label: 'Otima',
    emoji: '😊',
    color: ColorTokens.accent.mint,
    bgColor: ColorTokens.accent.mintLight,
  },
  {
    id: 'super',
    label: 'Super!',
    emoji: '🤩',
    color: ColorTokens.secondary[500],
    bgColor: ColorTokens.secondary[100],
  },
];

interface MoodItemProps {
  option: MoodOption;
  isSelected: boolean;
  onSelect: (id: MoodType) => void;
  isDark: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MoodItem: React.FC<MoodItemProps> = React.memo(({
  option,
  isSelected,
  onSelect,
  isDark,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(isSelected ? 1.05 : 1, { damping: 15, stiffness: 400 });
  };

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(option.id);
  }, [option.id, onSelect]);

  const containerStyle = useMemo(() => ({
    backgroundColor: isDark
      ? (isSelected ? option.color + '30' : ColorTokens.overlay.glass)
      : (isSelected ? option.bgColor : ColorTokens.overlay.card),
    borderColor: isSelected ? option.color : 'transparent',
    borderWidth: isSelected ? 2 : 0,
    transform: [{ scale: isSelected ? 1.05 : 1 }],
  }), [isDark, isSelected, option]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.moodItem,
        containerStyle,
        animatedStyle,
        isSelected && Shadows.card,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Humor: ${option.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <RNText style={styles.emoji}>{option.emoji}</RNText>
      <RNText
        style={{
          ...styles.label,
          color: isSelected ? option.color : (isDark ? DarkTheme.text.disabled : LightTheme.text.tertiary),
        }}
      >
        {option.label}
      </RNText>
    </AnimatedPressable>
  );
});

MoodItem.displayName = 'MoodItem';

export interface MoodSelectorProps {
  /** Humor selecionado */
  selectedMood?: MoodType | null;
  /** Callback ao selecionar humor */
  onMoodSelect: (mood: MoodType) => void;
  /** Titulo da secao (opcional) */
  title?: string;
  /** Estilo customizado do container */
  containerStyle?: object;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  title = 'Como voce ta hoje?',
  containerStyle,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <RNText
          style={{
            ...styles.title,
            color: colors.text.primary,
          }}
        >
          {title}
        </RNText>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={ITEM_WIDTH + ITEM_GAP}
        decelerationRate="fast"
      >
        {MOOD_OPTIONS.map((option) => (
          <MoodItem
            key={option.id}
            option={option}
            isSelected={selectedMood === option.id}
            onSelect={onMoodSelect}
            isDark={isDark}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing['3'],
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing['3'],
    paddingHorizontal: Spacing['5'],
  },
  scrollContent: {
    paddingHorizontal: Spacing['5'],
    gap: ITEM_GAP,
  },
  moodItem: {
    width: ITEM_WIDTH,
    height: 88,
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['1'],
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'capitalize',
  },
});

export default MoodSelector;
