/**
 * ThemeToggle - Componente para alternar tema Light/Dark
 * 
 * Componente moderno com ícones Sun/Moon e animação suave
 * Suporta tema claro e escuro com transições elegantes
 * 
 * @version 2.1.0
 */

import * as Haptics from 'expo-haptics';
import { Sun, Moon } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, ViewStyle, Animated } from 'react-native';

import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

export interface ThemeToggleProps {
  /** Estilo customizado */
  style?: ViewStyle;
  /** Tamanho do ícone */
  iconSize?: number;
  /** Variante do botão */
  variant?: 'outline' | 'ghost' | 'filled';
  /** Cor customizada do ícone (para uso sobre gradientes) */
  iconColor?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  iconSize = 22,
  variant = 'outline',
  iconColor,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animação de rotação e fade ao mudar tema
  useEffect(() => {
    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: isDark ? 180 : 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, [isDark, rotateAnim]);

  const handlePress = () => {
    logger.info('Theme toggle pressed', { 
      currentTheme: isDark ? 'dark' : 'light',
      newTheme: isDark ? 'light' : 'dark',
    });
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animação de press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    
    toggleTheme();
  };

  // Determinar ícone e cor baseado no tema
  // Quando está dark, mostra Sol (para mudar para claro)
  // Quando está light, mostra Lua (para mudar para escuro)
  const Icon = isDark ? Sun : Moon;
  
  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    if (variant === 'ghost') {
      // Sol dourado no dark mode, Lua rosa no light mode
      return isDark ? ColorTokens.warning[500] : colors.primary.main;
    }
    
    if (variant === 'filled') {
      // Sol dourado no dark mode, Lua branca no light mode
      return isDark ? ColorTokens.warning[500] : ColorTokens.neutral[0];
    }
    
    // outline (default)
    // Sol dourado no dark mode, Lua rosa no light mode
    return isDark ? ColorTokens.warning[500] : colors.primary.main;
  };

  // Determinar cor de fundo baseado no tema
  const getBackgroundColor = () => {
    if (variant === 'ghost') return 'transparent';
    if (variant === 'filled') {
      return isDark 
        ? `${ColorTokens.warning[500]}20` 
        : `${colors.primary.main}15`;
    }
    // outline (default)
    return `${colors.background.card}E6`; // ~90% opacity
  };

  const containerStyle: ViewStyle = {
    width: Tokens.touchTargets.min,
    height: Tokens.touchTargets.min,
    borderRadius: Tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getBackgroundColor(),
    ...(variant === 'outline' && {
      borderWidth: 1.5,
      borderColor: isDark 
        ? `${ColorTokens.warning[500]}40` 
        : `${colors.primary.main}30`,
    }),
    ...Tokens.shadows.sm,
    ...style,
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={containerStyle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          isDark 
            ? 'Alternar para tema claro' 
            : 'Alternar para tema escuro'
        }
        accessibilityHint={
          isDark 
            ? 'Muda o tema para modo claro' 
            : 'Muda o tema para modo escuro'
        }
        accessibilityState={{ checked: isDark }}
      >
        <Icon 
          size={iconSize} 
          color={getIconColor()}
          strokeWidth={2.5}
          fill={isDark ? `${ColorTokens.warning[500]}20` : 'transparent'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ThemeToggle;
