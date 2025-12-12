/**
 * NathContentCard - Card de Conteúdo do Feed Explore
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Video, Headphones, BookOpen, Heart, Clock, Eye } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Spacing, Radius } from '@/theme/tokens';
import type { NathContentItem } from '@/types/nathContent';

interface NathContentCardProps {
  item: NathContentItem;
  onPress: (item: NathContentItem) => void;
}

export function NathContentCard({ item, onPress }: NathContentCardProps) {
  const CARD_BG = '#FFFFFF';
  const CARD_BORDER = 'rgba(0,0,0,0.06)';
  const ACCENT = '#E91E63';
  const ACCENT_LIGHT = '#FFE4EC';
  const TEXT_DARK = '#3A2E2E';
  const TEXT_MUTED = '#6A5450';

  // Icon component baseado no tipo
  const IconComponent =
    item.type === 'video' ? Video : item.type === 'audio' ? Headphones : BookOpen;

  // Gradient colors baseado no tipo
  const gradientColors =
    item.type === 'video'
      ? (['#4ECDC4', '#9C27B0'] as const) // Teal → Purple
      : item.type === 'audio'
      ? (['#A8E6CF', '#4ECDC4'] as const) // Mint → Teal
      : (['#FFB88C', '#E91E63'] as const); // Peach → Pink

  // Type label
  const typeLabel = item.type === 'video' ? 'Vídeo' : item.type === 'audio' ? 'Áudio' : 'Artigo';

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.9}
      style={{
        backgroundColor: CARD_BG,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: CARD_BORDER,
        marginBottom: Spacing['3'],
      }}
    >
      {/* Gradient header (simulando thumbnail) */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: '100%',
          height: 120,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent size={40} color="rgba(255,255,255,0.8)" />
      </LinearGradient>

      {/* Content Info */}
      <View style={{ padding: Spacing['4'] }}>
        {/* Type badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing['2'],
          }}
        >
          <IconComponent size={14} color={ACCENT} />
          <Text
            style={{
              marginLeft: 6,
              fontSize: 11,
              fontWeight: '600',
              color: ACCENT,
              textTransform: 'uppercase',
            }}
          >
            {typeLabel}
          </Text>
          {item.isExclusive && (
            <View
              style={{
                marginLeft: 8,
                backgroundColor: ACCENT_LIGHT,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '600', color: ACCENT }}>EXCLUSIVO</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: TEXT_DARK,
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontSize: 13,
            color: TEXT_MUTED,
            marginBottom: Spacing['3'],
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* Stats */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['4'] }}>
          {item.durationMinutes && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock size={14} color={TEXT_MUTED} />
              <Text style={{ fontSize: 12, color: TEXT_MUTED }}>{item.durationMinutes} min</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Eye size={14} color={TEXT_MUTED} />
            <Text style={{ fontSize: 12, color: TEXT_MUTED }}>
              {item.viewsCount?.toLocaleString() || 0}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Heart size={14} color={TEXT_MUTED} />
            <Text style={{ fontSize: 12, color: TEXT_MUTED }}>
              {item.likesCount?.toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
