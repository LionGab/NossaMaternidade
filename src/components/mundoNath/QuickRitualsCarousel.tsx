/**
 * QuickRitualsCarousel - Carrossel de Rituais Rápidos
 */

import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Spacing, Radius } from '@/theme/tokens';
import type { NathContentItem } from '@/types/nathContent';

interface QuickRitualsCarouselProps {
  items: NathContentItem[];
  onSelect: (item: NathContentItem) => void;
}

// Mapeamento de emoji por ID (simplificado)
const RITUAL_EMOJIS: Record<string, string> = {
  'ritual-1': '🌬️',
  'ritual-2': '🌅',
  'ritual-3': '🧘',
  'ritual-4': '💝',
};

const RITUAL_COLORS: Record<string, string> = {
  'ritual-1': '#4ECDC4', // Teal
  'ritual-2': '#FFB88C', // Peach
  'ritual-3': '#9C27B0', // Purple
  'ritual-4': '#E91E63', // Pink
};

export function QuickRitualsCarousel({ items, onSelect }: QuickRitualsCarouselProps) {
  const CARD_BG = '#FFFFFF';
  const CARD_BORDER = 'rgba(0,0,0,0.06)';
  const TEXT_DARK = '#3A2E2E';
  const TEXT_MUTED = '#6A5450';

  return (
    <View style={{ marginBottom: Spacing['5'] }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: Spacing['6'],
          marginBottom: Spacing['3'],
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEXT_DARK }}>
          Rituais Rápidos
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#E91E63' }}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {/* Carrossel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing['6'], gap: Spacing['3'] }}
      >
        {items.map((ritual) => {
          const emoji = RITUAL_EMOJIS[ritual.id] || '✨';
          const color = RITUAL_COLORS[ritual.id] || '#E91E63';

          return (
            <TouchableOpacity
              key={ritual.id}
              onPress={() => onSelect(ritual)}
              activeOpacity={0.8}
              style={{
                width: 130,
                backgroundColor: CARD_BG,
                borderRadius: Radius.xl,
                padding: Spacing['4'],
                borderWidth: 1,
                borderColor: CARD_BORDER,
              }}
            >
              {/* Icon circle */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${color}30`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing['2'],
                }}
              >
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </View>

              {/* Title */}
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: TEXT_DARK }}
                numberOfLines={1}
              >
                {ritual.title}
              </Text>

              {/* Duration */}
              <Text style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                {ritual.durationMinutes} min
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
