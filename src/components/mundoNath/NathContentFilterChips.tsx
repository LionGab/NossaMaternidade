/**
 * NathContentFilterChips - Chips de Filtro de Conteúdo
 */

import * as Haptics from 'expo-haptics';
import { ScrollView, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Spacing, Radius } from '@/theme/tokens';
import type { NathContentType } from '@/types/nathContent';

interface NathContentFilterChipsProps {
  value: NathContentType | 'all';
  onChange: (type: NathContentType | 'all') => void;
}

const CATEGORIES = [
  { id: 'all' as const, label: 'Todos', emoji: '✨' },
  { id: 'video' as const, label: 'Vídeos', emoji: '🎬' },
  { id: 'audio' as const, label: 'Áudios', emoji: '🎧' },
  { id: 'article' as const, label: 'Artigos', emoji: '📖' },
];

export function NathContentFilterChips({ value, onChange }: NathContentFilterChipsProps) {
  const ACCENT = '#E91E63'; // Rosa magenta
  const CARD_BG = '#FFFFFF';
  const BORDER = 'rgba(0,0,0,0.06)';
  const TEXT_MUTED = '#6A5450';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: Spacing['2'] }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = value === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(cat.id);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: Spacing['2'],
              paddingHorizontal: Spacing['3'],
              borderRadius: Radius.full,
              backgroundColor: isActive ? ACCENT : CARD_BG,
              borderWidth: 1,
              borderColor: isActive ? ACCENT : BORDER,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: isActive ? '#FFF' : TEXT_MUTED,
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
