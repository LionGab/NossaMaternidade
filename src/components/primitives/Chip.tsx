/**
 * Chip Component - Interactive Pill/Tag
 * Baseado em Material Design 3 chips
 * 
 * @version 3.0.0
 */

import React from 'react';
import { Pressable, ViewStyle, TextStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  leftIcon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip = React.memo<ChipProps>(({
  label,
  selected = false,
  onPress,
  onDelete,
  leftIcon,
  variant = 'filled',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;

  const sizeConfig = {
    sm: {
      height: 24,
      paddingHorizontal: ModernTokens.spacing['2'],
      fontSize: ModernTokens.typography.fontSize.xs,
      iconSize: 14,
    },
    md: {
      height: 32,
      paddingHorizontal: ModernTokens.spacing['3'],
      fontSize: ModernTokens.typography.fontSize.sm,
      iconSize: 16,
    },
  };

  const { height, paddingHorizontal, fontSize, iconSize } = sizeConfig[size];

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height,
      paddingHorizontal,
      borderRadius: height / 2,
      flexDirection: 'row',
      alignItems: 'center',
      gap: ModernTokens.spacing['1.5'],
    };

    if (variant === 'outlined') {
      return {
        ...baseStyle,
        backgroundColor: selected ? colors.primary : 'transparent',
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
      };
    }

    if (variant === 'filled') {
      return {
        ...baseStyle,
        backgroundColor: selected ? colors.primary : colors.secondary,
        borderWidth: 0,
      };
    }

    // default
    return {
      ...baseStyle,
      backgroundColor: selected ? colors.primary : colors.muted,
      borderWidth: 0,
    };
  };

  const getTextStyle = (): TextStyle => {
    const color = selected 
      ? variant === 'outlined' || variant === 'filled'
        ? colors.primaryForeground
        : colors.foreground
      : colors.foreground;

    return {
      fontSize,
      fontWeight: ModernTokens.typography.fontWeight.medium,
      color,
    };
  };

  const containerStyle = getContainerStyle();
  const textStyleCombined = getTextStyle();

  if (!onPress && !onDelete) {
    return (
      <Box style={[containerStyle, disabled && { opacity: 0.5 }, style]}>
        {leftIcon && <Box>{leftIcon}</Box>}
        <Text style={[textStyleCombined, textStyle]}>{label}</Text>
      </Box>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        containerStyle,
        disabled && { opacity: 0.5 },
        pressed && { opacity: 0.7 },
        style,
      ]}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
    >
      {leftIcon && <Box>{leftIcon}</Box>}
      
      <Text style={[textStyleCombined, textStyle]}>{label}</Text>
      
      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={4}
          style={({ pressed }) => [
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selected 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.1)',
            },
            pressed && { opacity: 0.5 },
          ]}
        >
          <Text 
            style={{ 
              fontSize: iconSize * 0.7,
              color: textStyleCombined.color,
              fontWeight: ModernTokens.typography.fontWeight.bold,
            }}
          >
            ✕
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
});

Chip.displayName = 'Chip';

// Chip Group for managing multiple chips
export interface ChipGroupProps {
  chips: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  variant?: ChipProps['variant'];
  size?: ChipProps['size'];
  style?: ViewStyle;
}

export const ChipGroup = React.memo<ChipGroupProps>(({
  chips,
  selectedIds = [],
  onSelectionChange,
  multiSelect = false,
  variant = 'filled',
  size = 'md',
  style,
}) => {
  const handleChipPress = (chipId: string) => {
    if (!onSelectionChange) return;

    if (multiSelect) {
      const newSelection = selectedIds.includes(chipId)
        ? selectedIds.filter(id => id !== chipId)
        : [...selectedIds, chipId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selectedIds.includes(chipId) ? [] : [chipId]);
    }
  };

  return (
    <Box
      direction="row"
      flexWrap="wrap"
      gap="2"
      style={style}
    >
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          leftIcon={chip.icon}
          selected={selectedIds.includes(chip.id)}
          onPress={() => handleChipPress(chip.id)}
          variant={variant}
          size={size}
        />
      ))}
    </Box>
  );
});

ChipGroup.displayName = 'ChipGroup';

export default Chip;
