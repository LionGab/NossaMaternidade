/**
 * Card - Componente Primitivo Robusto
 * 
 * Baseado em Material Design 3 + Flo
 * Usa tokens do design system
 * 
 * @version 1.0
 * @date 2025-11-27
 */

import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDERS, PADDING } from '@/design-system';
import { SafeView } from './SafeView';
import { getShadowFromToken } from '@/utils/shadowHelper';
import { useTheme } from '@/theme/ThemeContext';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'gradient';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  /** Conteúdo do card */
  children: React.ReactNode;
  /** Variante visual */
  variant?: CardVariant;
  /** Padding interno */
  padding?: CardPadding;
  /** Se é clicável */
  pressable?: boolean;
  /** Handler de clique */
  onPress?: () => void;
  /** Estilos customizados */
  style?: ViewStyle;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  pressable = false,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { colors, isDark } = useTheme();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTILOS POR VARIANTE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDERS.cardRadius,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: isDark ? COLORS.dark.bgSecondary : COLORS.bg.primary,
          ...getShadowFromToken('lg'),
        };

      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: isDark ? COLORS.dark.bg : COLORS.bg.primary,
          borderWidth: BORDERS.cardBorder,
          borderColor: isDark ? COLORS.neutral[700] : COLORS.border.base,
        };

      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: isDark ? COLORS.dark.bgSecondary : COLORS.bg.secondary,
        };

      case 'gradient':
        return {
          ...baseStyle,
          // Gradient será aplicado via LinearGradient wrapper
          backgroundColor: 'transparent',
        };

      default: // 'default'
        return {
          ...baseStyle,
          backgroundColor: isDark ? COLORS.dark.bgSecondary : COLORS.bg.primary,
          ...getShadowFromToken('md'),
        };
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PADDING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const getPaddingValue = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return PADDING.sm;
      case 'lg':
        return PADDING.lg;
      default: // 'md'
        return PADDING.md;
    }
  };

  const containerStyle: ViewStyle = {
    ...getVariantStyles(),
    padding: getPaddingValue(),
    ...style,
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const content = (
    <SafeView style={containerStyle}>
      {children}
    </SafeView>
  );

  if (pressable || onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Card;

