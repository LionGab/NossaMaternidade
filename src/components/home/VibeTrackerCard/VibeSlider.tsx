/**
 * VibeSlider - Slider de vibe 0-100%
 *
 * Componente de slider personalizado para selecionar o nível de vibe/humor.
 * Usado no VibeTrackerCard para ajustar a vibe do dia (0-100%).
 *
 * @requires @react-native-community/slider
 *
 * @example
 * <VibeSlider
 *   value={vibeValue}
 *   onChange={(value) => setVibeValue(value)}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

import { Tokens, ColorTokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

export interface VibeSliderProps {
  /** Valor atual do slider (0-100) */
  value: number;
  /** Callback quando o valor muda */
  onChange: (value: number) => void;
  /** Valor mínimo (padrão: 0) */
  min?: number;
  /** Valor máximo (padrão: 100) */
  max?: number;
  /** Passo/incremento (padrão: 1) */
  step?: number;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Mostrar valor numérico (padrão: true) */
  showValue?: boolean;
}

export const VibeSlider: React.FC<VibeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disableHaptic = false,
  showValue = true,
}) => {
  const colors = useThemeColors();

  const handleValueChange = (newValue: number) => {
    // Haptic feedback leve ao arrastar
    if (!disableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onChange(newValue);
  };

  const handleSlidingComplete = (finalValue: number) => {
    // Haptic feedback médio ao soltar
    if (!disableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onChange(finalValue);
  };

  // Cores do gradiente baseado no valor (0% = azul, 100% = rosa)
  const getTrackColor = () => {
    if (value < 33) {
      return ColorTokens.accent.ocean; // Azul (baixo)
    } else if (value < 66) {
      return ColorTokens.secondary[500]; // Roxo (médio)
    } else {
      return ColorTokens.primary[500]; // Rosa (alto)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={getTrackColor()}
          maximumTrackTintColor={colors.border.light}
          thumbTintColor={getTrackColor()}
          accessible={true}
          accessibilityRole="adjustable"
          accessibilityLabel={`Vibe atual: ${value}%`}
          accessibilityValue={{
            min,
            max,
            now: value,
            text: `${value}%`,
          }}
        />

        {/* Marcadores visuais (0%, 25%, 50%, 75%, 100%) */}
        <View style={styles.markersContainer}>
          {[0, 25, 50, 75, 100].map((marker) => (
            <View
              key={marker}
              style={[
                styles.marker,
                {
                  backgroundColor:
                    value >= marker ? getTrackColor() : colors.border.light,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Valor atual (badge) */}
      {showValue && (
        <View
          style={[
            styles.valueBadge,
            {
              backgroundColor: getTrackColor(),
            },
          ]}
        >
          <Text style={styles.valueText}>{Math.round(value)}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sliderContainer: {
    position: 'relative',
    paddingBottom: Tokens.spacing['8'], // Espaço para marcadores
  },
  slider: {
    width: '100%',
    height: 40,
  },
  markersContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing['6'], // Alinhado com thumb
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 3, // Círculo
  },
  valueBadge: {
    alignSelf: 'center',
    paddingVertical: Tokens.spacing['1.5'],
    paddingHorizontal: Tokens.spacing['3'],
    borderRadius: Tokens.radius.full,
    marginTop: Tokens.spacing['2'],
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, // Android
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: Tokens.typography.sizes.xs,
    fontWeight: '700', // Bold
    textAlign: 'center',
  },
});

export default VibeSlider;
