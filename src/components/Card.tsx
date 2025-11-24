/**
 * Card Component - Theme-aware card with variants
 * Componente de card profissional com suporte a temas e variantes
 */

import React from 'react';
import { View, ViewProps, Pressable, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/theme';
import { Spacing, Radius, Shadows } from '@/theme/tokens';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost';

export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  variant?: CardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  pressable?: boolean;
  onPress?: () => void;
  padding?: keyof typeof Spacing;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  header,
  footer,
  pressable = false,
  onPress,
  padding = '4',
  style,
  ...props
}) => {
  const colors = useThemeColors();

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.background.card,
      ...Shadows.sm,
    },
    outlined: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.medium,
    },
    elevated: {
      backgroundColor: colors.background.elevated,
      ...Shadows.md,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  const containerStyle: ViewStyle = {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...variantStyles[variant],
    ...style,
  };

  const cardContent = (
    <>
      {header && (
        <View style={{
          paddingHorizontal: Spacing[padding],
          paddingTop: Spacing[padding],
          paddingBottom: Spacing['2'],
        }}>
          {header}
        </View>
      )}

      <View style={{
        paddingHorizontal: Spacing[padding],
        paddingVertical: !header && !footer ? Spacing[padding] : header && footer ? Spacing['2'] : Spacing[padding],
      }}>
        {children}
      </View>

      {footer && (
        <View style={{
          paddingHorizontal: Spacing[padding],
          paddingTop: Spacing['2'],
          paddingBottom: Spacing[padding],
        }}>
          {footer}
        </View>
      )}
    </>
  );

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.8 },
        ]}
        {...props}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {cardContent}
    </View>
  );
};

export default Card;

