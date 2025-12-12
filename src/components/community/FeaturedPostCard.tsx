/**
 * FeaturedPostCard - Card "Post do Dia" curado pela NathIA
 *
 * Destaca um post selecionado pela IA com:
 * - Badge "Curado pela NathIA"
 * - Preview do conteúdo
 * - Métricas (likes, comentários)
 * - Gradiente suave de fundo
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Sparkles, ChevronRight } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';
import type { FeaturedPost } from '@/types/community';
import { THEME_LABELS } from '@/types/community';

export interface FeaturedPostCardProps {
  /** Post em destaque */
  post: FeaturedPost;
  /** Callback ao tocar no card */
  onPress: (post: FeaturedPost) => void;
}

export function FeaturedPostCard({ post, onPress }: FeaturedPostCardProps) {
  const colors = useThemeColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(post);
  };

  // Preview do texto (máximo 120 caracteres)
  const contentPreview =
    post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      accessibilityLabel="Post do dia curado pela NathIA"
      accessibilityHint="Toque para ver o post completo"
      style={{
        marginBottom: Spacing['5'],
      }}
    >
      <LinearGradient
        colors={[colors.primary.light + '40', colors.secondary.light + '40']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: Radius['2xl'],
          padding: Spacing['5'],
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.primary.light,
        }}
      >
        {/* Badge NathIA */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing['3'],
            backgroundColor: colors.primary.main,
            paddingVertical: 6,
            paddingHorizontal: Spacing['3'],
            borderRadius: Radius.full,
            alignSelf: 'flex-start',
          }}
        >
          <Sparkles size={14} color="#FFF" />
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFF', marginLeft: 6 }}>
            Curado pela NathIA 💖
          </Text>
        </View>

        {/* Autor e Tema */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['3'] }}>
          {/* Avatar */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary.light,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Spacing['3'],
            }}
          >
            {post.author?.avatar_url ? (
              <Image
                source={{ uri: post.author.avatar_url }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary.main }}>
                {post.is_anonymous ? 'A' : post.author?.full_name?.[0] || post.author_name?.[0] || 'M'}
              </Text>
            )}
          </View>

          {/* Nome e Tema */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary }}>
              {post.is_anonymous ? 'Mãe Anônima' : post.author?.full_name || post.author_name || 'Mãe Valente'}
            </Text>
            {post.theme && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: Spacing['2'],
                    paddingVertical: 2,
                    backgroundColor: colors.secondary.light,
                    borderRadius: Radius.sm,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: colors.secondary.main }}>
                    {THEME_LABELS[post.theme]}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <ChevronRight size={20} color={colors.text.secondary} />
        </View>

        {/* Preview do Conteúdo */}
        <Text
          style={{
            fontSize: 14,
            color: colors.text.primary,
            lineHeight: 20,
            marginBottom: Spacing['3'],
          }}
          numberOfLines={3}
        >
          {contentPreview}
        </Text>

        {/* Nota da Curadoria (se existir) */}
        {post.curator_note && (
          <View
            style={{
              backgroundColor: colors.background.card + 'CC',
              borderRadius: Radius.lg,
              padding: Spacing['3'],
              marginBottom: Spacing['3'],
              borderLeftWidth: 3,
              borderLeftColor: colors.primary.main,
            }}
          >
            <Text style={{ fontSize: 12, fontStyle: 'italic', color: colors.text.secondary }}>
              &ldquo;{post.curator_note}&rdquo;
            </Text>
          </View>
        )}

        {/* Métricas */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['4'] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Heart
              size={18}
              color={colors.primary.main}
              fill={post.is_liked_by_user ? colors.primary.main : 'none'}
            />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text.secondary }}>
              {post.likes_count}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={18} color={colors.secondary.main} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text.secondary }}>
              {post.comments_count}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default FeaturedPostCard;
