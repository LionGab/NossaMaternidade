/**
 * CottonCandyButton - Button component with Cotton Candy Tech styling
 *
 * Features:
 * - Rounded-full for pills (9999px)
 * - Cotton Candy pink/blue gradients
 * - Soft colored shadows
 * - Touch feedback with haptics
 *
 * @version 1.0.0 - Cotton Candy Tech Blue Version
 */

import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';

export interface CottonCandyButtonProps {
  /** Button label text */
  label: string;
  /** Callback quando o botão é pressionado */
  onPress: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  loading?: boolean;
  /** Disable button */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Icon to display (React element) */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
}

export const CottonCandyButton: React.FC<CottonCandyButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  icon,
  iconPosition = 'left',
}) => {
  const { colors } = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: Tokens.spacing['2'],
      paddingHorizontal: Tokens.spacing['4'],
      fontSize: Tokens.typography.sizes.sm,
      iconSize: 16,
    },
    md: {
      paddingVertical: Tokens.spacing['3'],
      paddingHorizontal: Tokens.spacing['6'],
      fontSize: Tokens.typography.sizes.base,
      iconSize: 20,
    },
    lg: {
      paddingVertical: Tokens.spacing['4'],
      paddingHorizontal: Tokens.spacing['8'],
      fontSize: Tokens.typography.sizes.lg,
      iconSize: 24,
    },
  };

  const currentSize = sizeConfig[size];

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Base button style
  const baseButtonStyle: ViewStyle = {
    borderRadius: Tokens.radius.full, // ⭐ Cotton Candy: rounded-full (pill shape)
    paddingVertical: currentSize.paddingVertical,
    paddingHorizontal: currentSize.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Tokens.spacing['2'],
    opacity: disabled ? 0.5 : 1,
    ...(fullWidth && { width: '100%' }),
  };

  const textStyle: TextStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: Tokens.typography.weights.semibold,
    color: '#FFFFFF',
  };

  // Primary variant (Cotton Candy Pink gradient)
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.button, baseButtonStyle, style]}
      >
        <LinearGradient
          colors={[ColorTokens.cottonCandy.pinkLight, ColorTokens.cottonCandy.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientContent,
            {
              borderRadius: Tokens.radius.full,
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
              flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
              gap: icon ? Tokens.spacing['2'] : 0,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              {icon}
              <Text style={textStyle}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary variant (Cotton Candy Blue gradient)
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.button, baseButtonStyle, style]}
      >
        <LinearGradient
          colors={[ColorTokens.cottonCandy.blue, ColorTokens.cottonCandy.blueLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientContent,
            {
              borderRadius: Tokens.radius.full,
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
              flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
              gap: icon ? Tokens.spacing['2'] : 0,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              {icon}
              <Text style={textStyle}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Outline variant
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[
          styles.button,
          baseButtonStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: ColorTokens.cottonCandy.pink,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={ColorTokens.cottonCandy.pink} />
        ) : (
          <>
            {iconPosition === 'left' && icon}
            <Text style={{ ...textStyle, color: ColorTokens.cottonCandy.pink }}>{label}</Text>
            {iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost variant (no background)
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      style={[styles.button, baseButtonStyle, { backgroundColor: 'transparent' }, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text.secondary} />
      ) : (
        <>
          {iconPosition === 'left' && icon}
          <Text style={{ ...textStyle, color: colors.text.primary }}>{label}</Text>
          {iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },
  gradientContent: {
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for gradient buttons
    ...Platform.select({
      ios: {
        shadowColor: ColorTokens.cottonCandy.pink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default CottonCandyButton;
