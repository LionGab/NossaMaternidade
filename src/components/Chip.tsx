/**
 * Chip Component - Interactive tag/chip with delete action
 * Componente de chip/tag interativo com ação de deletar
 */

import React from 'react';
import { Text, View, Pressable, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { Spacing, Radius, Typography } from '@/theme/tokens';

export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  outlined?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  outlined = false,
  icon,
  onPress,
  onDelete,
  disabled = false,
  containerStyle,
}) => {
  const colors = useThemeColors();

  const sizeConfig = {
    sm: {
      paddingHorizontal: Spacing['2'],
      paddingVertical: Spacing['1'],
      fontSize: Typography.sizes.xs,
      iconSize: 14,
      deleteSize: 14,
    },
    md: {
      paddingHorizontal: Spacing['3'],
      paddingVertical: Spacing['1.5'],
      fontSize: Typography.sizes.sm,
      iconSize: 16,
      deleteSize: 16,
    },
    lg: {
      paddingHorizontal: Spacing['4'],
      paddingVertical: Spacing['2'],
      fontSize: Typography.sizes.base,
      iconSize: 18,
      deleteSize: 18,
    },
  };

  const variantColors = {
    default: {
      bg: colors.background.elevated,
      text: colors.text.primary,
      border: colors.border.medium,
    },
    primary: {
      bg: colors.primary.main,
      text: '#FFFFFF',
      border: colors.primary.main,
    },
    secondary: {
      bg: colors.secondary.main,
      text: '#FFFFFF',
      border: colors.secondary.main,
    },
    success: {
      bg: colors.status.success,
      text: '#FFFFFF',
      border: colors.status.success,
    },
    warning: {
      bg: colors.status.warning,
      text: '#FFFFFF',
      border: colors.status.warning,
    },
    error: {
      bg: colors.status.error,
      text: '#FFFFFF',
      border: colors.status.error,
    },
  };

  const { paddingHorizontal, paddingVertical, fontSize, iconSize, deleteSize } = sizeConfig[size];
  const colorConfig = variantColors[variant];

  const handlePress = () => {
    if (disabled || !onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleDelete = () => {
    if (disabled || !onDelete) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal,
    paddingVertical,
    borderRadius: Radius.full,
    backgroundColor: outlined ? 'transparent' : colorConfig.bg,
    borderWidth: outlined ? 1 : 0,
    borderColor: colorConfig.border,
    opacity: disabled ? 0.5 : 1,
    ...containerStyle,
  };

  const textColor = outlined ? colorConfig.border : colorConfig.text;

  const content = (
    <>
      {icon && (
        <View style={{ marginRight: Spacing['1.5'] }}>
          {icon}
        </View>
      )}
      <Text
        style={{
          fontSize,
          fontWeight: Typography.weights.medium,
          color: textColor,
        }}
      >
        {label}
      </Text>
      {onDelete && (
        <Pressable
          onPress={handleDelete}
          disabled={disabled}
          hitSlop={8}
          style={{ marginLeft: Spacing['1.5'] }}
        >
          <X size={deleteSize} color={textColor} strokeWidth={2.5} />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [containerStyles, pressed && { opacity: 0.7 }]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyles}>{content}</View>;
};

export default Chip;
