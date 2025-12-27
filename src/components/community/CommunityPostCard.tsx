/**
 * CommunityPostCard - Card de post da comunidade (Mães Valente)
 *
 * Adaptado para Fase 2:
 * - Usa CommunityPost type
 * - Suporta Signed URLs
 * - Badge de status para Meus Posts
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, radius, shadows, spacing } from "../../theme/tokens";
import { CommunityPost } from "../../types/community";
import { formatTimeAgo } from "../../utils/formatters";

// Aliases
const RADIUS = radius;
const SHADOWS = shadows;
const SPACING = spacing;

interface PostCardProps {
  post: CommunityPost;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (post: CommunityPost) => void;
  onPress: (id: string) => void;
  showStatus?: boolean; // Se true, mostra badge de status (para Meus Posts)
}

export const CommunityPostCard: React.FC<PostCardProps> = React.memo(
  ({ post, index, onLike, onComment, onShare, onPress, showStatus }) => {
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

    // Theme colors
    const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
    const textPrimary = isDark ? Tokens.neutral[100] : Tokens.text.light.primary;
    const textSecondary = isDark ? Tokens.neutral[400] : Tokens.text.light.secondary;
    const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

    const getStatusBadge = () => {
      if (!showStatus) return null;

      switch (post.status) {
        case "submitted":
          return {
            label: "Em Análise",
            color: Tokens.brand.primary[500],
            bg: Tokens.brand.primary[50],
            icon: "time-outline",
          };
        case "approved":
          return {
            label: "Aprovado",
            color: Tokens.semantic.light.success,
            bg: Tokens.semantic.light.successLight,
            icon: "checkmark-circle-outline",
          };
        case "rejected":
          return {
            label: "Não Aprovado",
            color: Tokens.semantic.light.error,
            bg: Tokens.semantic.light.errorLight,
            icon: "alert-circle-outline",
          };
        case "needs_changes":
          return {
            label: "Precisa de Ajustes",
            color: Tokens.semantic.light.warning,
            bg: Tokens.semantic.light.warningLight,
            icon: "create-outline",
          };
        default: // draft
          return {
            label: "Rascunho",
            color: Tokens.neutral[500],
            bg: Tokens.neutral[100],
            icon: "document-text-outline",
          };
      }
    };

    const statusBadge = getStatusBadge();

    // Mocks para dados ainda não implementados no backend (likes/comments)
    // O backend atual retorna JSON puro da tabela, precisamos de counts via join ou RPC futuramente.
    // Para MVP visual, usamos 0 ou random se preferir, mas 0 é mais honesto.
    const likesCount = 0;
    const commentsCount = 0;
    const isLiked = false;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 60).duration(450)}
        style={[styles.container, animatedStyle]}
      >
        <Pressable
          onPress={() => onPress(post.id)}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: bgCard,
              borderColor: borderColor,
              opacity: pressed ? 0.98 : 1,
            },
          ]}
        >
          {/* Status Badge (Meus Posts) */}
          {showStatus && statusBadge && (
            <View style={[styles.pendingBadge, { backgroundColor: statusBadge.bg }]}>
              <Ionicons name={statusBadge.icon as any} size={14} color={statusBadge.color} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: statusBadge.color }}>
                {statusBadge.label}
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: isDark ? Tokens.brand.primary[900] : Tokens.brand.primary[100],
                },
              ]}
            >
              {post.profiles?.avatar_url ? (
                <Image source={{ uri: post.profiles.avatar_url }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={22} color={Tokens.brand.primary[500]} />
              )}
            </View>

            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: textPrimary }]}>
                {post.profiles?.name || "Mãe Anônima"}
              </Text>
              <Text style={[styles.timeAgo, { color: textSecondary }]}>
                {formatTimeAgo(post.created_at)}
              </Text>
            </View>

            {/* Context Menu (Report/Block) - Placeholder */}
            <Pressable
              style={({ pressed }) => [styles.moreButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => onPress(post.id)}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={textSecondary} />
            </Pressable>
          </View>

          {/* Content */}
          {post.text && (
            <View style={styles.contentWrapper}>
              <Text style={[styles.content, { color: textPrimary }]}>{post.text}</Text>
            </View>
          )}

          {/* Media */}
          {post.signed_media_url && (
            <View style={styles.imageWrapper}>
              {post.media_type === "video" ? (
                <View
                  style={[
                    styles.image,
                    { backgroundColor: Tokens.neutral[900], alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <Ionicons name="play-circle-outline" size={48} color="white" />
                </View>
              ) : (
                <Image
                  source={{ uri: post.signed_media_url }}
                  style={[
                    styles.image,
                    { backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[200] },
                  ]}
                  contentFit="cover"
                />
              )}
            </View>
          )}

          {/* Actions */}
          <View style={[styles.actionsWrapper, { borderTopColor: borderColor }]}>
            <View style={styles.actionsRow}>
              {/* Like */}
              <Pressable
                onPress={handleLikePress}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={isLiked ? Tokens.brand.accent[500] : textSecondary}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: isLiked ? Tokens.brand.accent[500] : textSecondary },
                  ]}
                >
                  {likesCount}
                </Text>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={() => onComment(post.id)}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="chatbubble-outline" size={22} color={textSecondary} />
                <Text style={[styles.actionText, { color: textSecondary }]}>{commentsCount}</Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => onShare(post)}
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

CommunityPostCard.displayName = "CommunityPostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["2xl"],
  },
  card: {
    borderRadius: RADIUS["2xl"],
    borderWidth: 1,
    ...SHADOWS.md,
    overflow: "hidden",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
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
  imageWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: RADIUS.xl,
  },
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
    paddingRight: SPACING["2xl"],
    gap: SPACING.sm,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },
  shareButton: {
    marginLeft: "auto",
    padding: SPACING.sm,
  },
});
