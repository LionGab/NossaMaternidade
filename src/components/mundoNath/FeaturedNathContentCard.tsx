/**
 * FeaturedNathContentCard - Card de Destaque do Mundo da Nath
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Play, Star } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Spacing, Radius } from '@/theme/tokens';
import type { NathContentItem } from '@/types/nathContent';

interface FeaturedNathContentCardProps {
  content: NathContentItem;
  onPress: (content: NathContentItem) => void;
}

export function FeaturedNathContentCard({ content, onPress }: FeaturedNathContentCardProps) {
  return (
    <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['5'] }}>
      <TouchableOpacity onPress={() => onPress(content)} activeOpacity={0.9}>
        <LinearGradient
          colors={['#E91E63', '#9C27B0']} // Rosa → Roxo (screenshots)
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: Radius['2xl'],
            padding: Spacing['5'],
            overflow: 'hidden',
          }}
        >
          {/* Badge DESTAQUE */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.25)',
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: Radius.full,
              alignSelf: 'flex-start',
              marginBottom: Spacing['3'],
            }}
          >
            <Star size={14} color="#FFF" fill="#FFF" />
            <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '600', color: '#FFF' }}>
              DESTAQUE
            </Text>
          </View>

          {/* Título */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 6 }}>
            {content.title}
          </Text>

          {/* Descrição */}
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: Spacing['4'],
            }}
          >
            {content.description}
          </Text>

          {/* CTA Button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFF',
              paddingVertical: Spacing['3'],
              paddingHorizontal: Spacing['4'],
              borderRadius: Radius.full,
              alignSelf: 'flex-start',
            }}
          >
            <Play size={18} color="#E91E63" fill="#E91E63" />
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#E91E63' }}>
              Começar Agora
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
