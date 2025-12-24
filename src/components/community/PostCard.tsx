/**
 * PostCard - Card de post da comunidade
 *
 * Design: Calm FemTech 2025 - Inspirado no Instagram
 * - Cards com espaçamento generoso
 * - Hierarquia visual clara
 * - Ações bem espaçadas
 * - Tokens unificados
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View, Image as RNImage } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, radius, shadows, spacing } from "../../theme/tokens";
import type { Post } from "../../types/navigation";
import { formatTimeAgo } from "../../utils/formatters";

// Aliases de compatibilidade
const RADIUS = radius;
const SHADOWS = shadows;
const SPACING = spacing;

// Imagem real da Nath para posts dela
const NATH_AVATAR = require("../../../assets/onboarding/images/nath-profile-small.jpg");

interface PostCardProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (post: Post) => void;
  onPress: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = React.memo(
  ({ post, index, onLike, onComment, onShare, onPress }) => {
    const { isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handleLikePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(0.98, { damping: 15 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 10 });
      }, 100);
      onLike(post.id);
    };

    // Theme colors usando Tokens
    const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
    const textPrimary = isDark ? Tokens.neutral[100] : Tokens.text.light.primary;
    const textSecondary = isDark ? Tokens.neutral[400] : Tokens.text.light.secondary;
    const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];
    const isPending = post.status === "pending";

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 60)
          .duration(450)
          .springify()}
        style={[styles.container, animatedStyle]}
      >
        <Pressable
          onPress={() => onPress(post.id)}
          accessibilityRole="button"
          accessibilityLabel={`Post de ${post.authorName}. ${post.content.substring(0, 100)}${post.content.length > 100 ? "..." : ""}`}
          accessibilityHint="Toque para ver detalhes do post"
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: bgCard,
              borderColor: isPending ? Tokens.brand.primary[300] : borderColor,
              opacity: pressed ? 0.98 : 1,
              transform: [{ scale: pressed ? 0.995 : 1 }],
            },
          ]}
        >
          {/* Status de revisão */}
          {isPending && (
            <View
              accessibilityRole="text"
              accessibilityLabel="Este post está em revisão pelos moderadores"
              style={[
                styles.pendingBadge,
                {
                  backgroundColor: isDark ? Tokens.brand.primary[900] : Tokens.brand.primary[50],
                },
              ]}
            >
              <Ionicons name="time-outline" size={13} color={Tokens.brand.primary[500]} />
              <Text style={[styles.pendingText, { color: Tokens.brand.primary[600] }]}>
                Em revisão
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            {/* Avatar - usa foto da Nath para posts dela */}
            {post.authorName.toLowerCase().includes("nath") ? (
              <RNImage
                source={NATH_AVATAR}
                style={styles.avatarImage}
                accessibilityLabel="Foto da Nathália"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: isDark ? Tokens.brand.primary[900] : Tokens.brand.primary[100],
                  },
                ]}
              >
                <Ionicons name="person" size={22} color={Tokens.brand.primary[500]} />
              </View>
            )}
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: textPrimary }]}>{post.authorName}</Text>
              <Text style={[styles.timeAgo, { color: textSecondary }]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mais opções do post"
              accessibilityHint="Toque para ver opções adicionais"
              style={({ pressed }) => [styles.moreButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => onPress(post.id)}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={textSecondary} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.contentWrapper}>
            <Text style={[styles.content, { color: textPrimary }]}>{post.content}</Text>
          </View>

          {/* Image */}
          {post.imageUrl && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: post.imageUrl }}
                style={[
                  styles.image,
                  { backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[200] },
                ]}
                contentFit="cover"
                accessibilityLabel={`Imagem do post de ${post.authorName}`}
                accessibilityRole="image"
              />
            </View>
          )}

          {/* Actions */}
          <View style={[styles.actionsWrapper, { borderTopColor: borderColor }]}>
            <View style={styles.actionsRow}>
              {/* Like */}
              <Pressable
                onPress={handleLikePress}
                accessibilityRole="button"
                accessibilityLabel={
                  post.isLiked
                    ? `Descurtir. ${post.likesCount} curtidas`
                    : `Curtir. ${post.likesCount} curtidas`
                }
                accessibilityState={{ selected: post.isLiked }}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={post.isLiked ? Tokens.brand.accent[500] : textSecondary}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: post.isLiked ? Tokens.brand.accent[500] : textSecondary },
                  ]}
                >
                  {post.likesCount}
                </Text>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={() => onComment(post.id)}
                accessibilityRole="button"
                accessibilityLabel={`Comentar. ${post.commentsCount} comentários`}
                accessibilityHint="Toque para ver ou adicionar comentários"
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="chatbubble-outline" size={22} color={textSecondary} />
                <Text style={[styles.actionText, { color: textSecondary }]}>
                  {post.commentsCount}
                </Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => onShare(post)}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar post"
                accessibilityHint="Toque para compartilhar este post"
                style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="share-outline" size={22} color={textSecondary} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

PostCard.displayName = "PostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["2xl"], // 24pt entre cards (aumentado de 20pt)
  },
  card: {
    borderRadius: RADIUS["2xl"], // 32pt border radius (aumentado de 24pt)
    borderWidth: 1,
    ...SHADOWS.md,
    overflow: "hidden",
  },

  // === PENDING BADGE ===
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  pendingText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },

  // === HEADER ===
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.3,
  },
  timeAgo: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    marginTop: 2,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // === CONTENT ===
  contentWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Manrope_500Medium",
    letterSpacing: -0.2,
  },

  // === IMAGE ===
  imageWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  image: {
    width: "100%",
    height: 240, // Aumentado de 200pt
    borderRadius: RADIUS.xl,
  },

  // === ACTIONS ===
  actionsWrapper: {
    borderTopWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingRight: SPACING["2xl"], // 24pt entre botões
    gap: SPACING.sm,
  },
  actionText: {
    fontSize: 15, // Aumentado de 14
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },
  shareButton: {
    marginLeft: "auto",
    padding: SPACING.sm,
  },
});
