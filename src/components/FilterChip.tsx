/**
 * FilterChip Component - Filter chip for content filtering
 * Componente de chip de filtro para filtragem de conteúdo
 */

import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme/tokens';
import * as Haptics from 'expo-haptics';

export type FilterChipSize = 'sm' | 'md';
export type FilterChipVariant = 'primary' | 'secondary';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  size?: FilterChipSize;
  variant?: FilterChipVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onPress,
  size = 'md',
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: Tokens.spacing['3'],
      paddingVertical: Tokens.spacing['1.5'],
      fontSize: Tokens.typography.sizes.xs,
    },
    md: {
      paddingHorizontal: Tokens.spacing['4'],
      paddingVertical: Tokens.spacing['2'],
      fontSize: Tokens.typography.sizes.sm,
    },
  };

  const variantColor = variant === 'primary' ? colors.primary.main : colors.secondary.main;

  const containerStyle: ViewStyle = {
    paddingHorizontal: sizeStyles[size].paddingHorizontal,
    paddingVertical: sizeStyles[size].paddingVertical,
    borderRadius: Tokens.radius['2xl'],
    borderWidth: 1,
    backgroundColor: selected ? variantColor : colors.background.card,
    borderColor: selected ? variantColor : colors.border.light,
    opacity: disabled ? 0.5 : 1,
    marginRight: Tokens.spacing['2'],
  };

  const textStyle: TextStyle = {
    color: selected ? colors.text.inverse : colors.text.secondary,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: selected ? Tokens.typography.weights.bold : Tokens.typography.weights.semibold,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={containerStyle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `Filtro: ${label}`}
      accessibilityHint={accessibilityHint || (selected ? 'Filtro ativo' : 'Toque para ativar este filtro')}
      accessibilityState={{ selected, disabled }}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default FilterChip;
