/**
 * HomeFooter - Footer da Home com branding
 *
 * Componente de footer com texto de branding e ícones decorativos.
 * Exibe mensagem inspiracional e ícones animados.
 *
 * @requires lucide-react-native
 *
 * @example
 * <HomeFooter />
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Heart, Sparkles, Moon, Star } from 'lucide-react-native';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, ColorTokens } from '@/theme/tokens';

export interface HomeFooterProps {
  /** Mensagem de branding */
  message?: string;
  /** Mostrar ícones animados */
  showIcons?: boolean;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({
  message = 'Feito com amor para mães que fazem a diferença',
  showIcons = true,
}) => {
  const colors = useThemeColors();

  // Animações
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;
  const icon3Anim = useRef(new Animated.Value(0)).current;
  const icon4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showIcons) return;

    // Animação de "float" para cada ícone
    const createFloatAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Iniciar animações com delays diferentes
    Animated.parallel([
      createFloatAnimation(icon1Anim, 0),
      createFloatAnimation(icon2Anim, 500),
      createFloatAnimation(icon3Anim, 1000),
      createFloatAnimation(icon4Anim, 1500),
    ]).start();
  }, [icon1Anim, icon2Anim, icon3Anim, icon4Anim, showIcons]);

  // Interpolações para translateY
  const icon1TranslateY = icon1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const icon2TranslateY = icon2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const icon3TranslateY = icon3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const icon4TranslateY = icon4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Box style={styles.container}>
      {/* Ícones Animados */}
      {showIcons && (
        <View style={styles.iconsContainer}>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateY: icon1TranslateY }],
              },
            ]}
          >
            <Heart size={20} color={ColorTokens.primary[400]} fill={ColorTokens.primary[200]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateY: icon2TranslateY }],
              },
            ]}
          >
            <Sparkles size={18} color={ColorTokens.accent.sunshine} fill={ColorTokens.accent.sunshine} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateY: icon3TranslateY }],
              },
            ]}
          >
            <Moon size={16} color={ColorTokens.secondary[400]} fill={ColorTokens.secondary[200]} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateY: icon4TranslateY }],
              },
            ]}
          >
            <Star size={14} color={ColorTokens.accent.coral} fill={ColorTokens.accent.coral} />
          </Animated.View>
        </View>
      )}

      {/* Mensagem */}
      <Text
        size="xs"
        color="tertiary"
        align="center"
        style={{
          fontStyle: 'italic',
          lineHeight: 20,
        }}
      >
        {message}
      </Text>

      {/* Logo/Branding (opcional) */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoDot,
            {
              backgroundColor: ColorTokens.primary[500],
            },
          ]}
        />
        <Text
          size="xs"
          weight="bold"
          style={{
            color: colors.text.secondary,
            letterSpacing: 1,
          }}
        >
          NOSSA MATERNIDADE
        </Text>
        <View
          style={[
            styles.logoDot,
            {
              backgroundColor: ColorTokens.secondary[500],
            },
          ]}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['8'],
    marginTop: Spacing['6'],
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  iconWrapper: {
    opacity: 0.6,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginTop: Spacing['4'],
  },
  logoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default HomeFooter;
