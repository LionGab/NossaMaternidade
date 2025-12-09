/**
 * 🌸 Wellness Theme Hook - Exemplo de Uso
 *
 * Demonstra como usar o Wellness Design System nos componentes
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWellnessTheme } from '../theme/ThemeContext';

export const WellnessExampleCard = () => {
  const wellness = useWellnessTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: wellness.theme.background.primary,
          borderRadius: wellness.radius.lg,
          padding: wellness.spacing[4],
          gap: wellness.spacing[3],
          ...wellness.shadows.md,
        },
      ]}
    >
      {/* Title com Wellness Typography */}
      <Text
        style={[
          wellness.typography.heading.h2,
          { color: wellness.theme.text.primary },
        ]}
      >
        Wellness Design
      </Text>

      {/* Body text */}
      <Text
        style={[
          wellness.typography.body.large,
          { color: wellness.theme.text.secondary },
        ]}
      >
        Design inspirado em Flo, Calm e Clue. Cores suaves, tipografia clara e
        experiência premium.
      </Text>

      {/* Primary Button com Wellness */}
      <TouchableOpacity
        style={[
          {
            backgroundColor: wellness.colors.primary[500],
            paddingVertical: wellness.spacing[3],
            paddingHorizontal: wellness.spacing[5],
            borderRadius: wellness.radius.md,
            alignItems: 'center',
            ...wellness.shadows.primary,
          },
        ]}
      >
        <Text
          style={[
            wellness.typography.label.large,
            { color: wellness.theme.text.inverse },
          ]}
        >
          Começar Agora
        </Text>
      </TouchableOpacity>

      {/* Secondary Button */}
      <TouchableOpacity
        style={[
          {
            backgroundColor: wellness.colors.secondary[400],
            paddingVertical: wellness.spacing[3],
            paddingHorizontal: wellness.spacing[5],
            borderRadius: wellness.radius.md,
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={[
            wellness.typography.label.large,
            { color: wellness.theme.text.inverse },
          ]}
        >
          Explorar
        </Text>
      </TouchableOpacity>

      {/* Mood colors example */}
      <View style={{ flexDirection: 'row', gap: wellness.spacing[2], flexWrap: 'wrap' }}>
        {Object.entries(wellness.colors.moods).map(([mood, color]) => (
          <View
            key={mood}
            style={{
              backgroundColor: color,
              paddingVertical: wellness.spacing[2],
              paddingHorizontal: wellness.spacing[3],
              borderRadius: wellness.radius.full,
            }}
          >
            <Text style={[wellness.typography.caption.medium, { color: '#fff' }]}>
              {mood}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default WellnessExampleCard;
