import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Platform,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme';
import { Button, CommentsSection, AudioPlayer } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem, ContentType } from '../types/content';
import { useHaptics } from '../hooks/useHaptics';
import { getAllComments, TOTAL_COMMENTS } from '../data/comments';
import { Comment } from '../types/comments';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ContentDetailScreenProps {
  content: ContentItem;
  isFavorite: boolean;
  onBack: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
}

const getTypeIcon = (type: ContentType): string => {
  switch (type) {
    case 'video':
      return 'play-circle';
    case 'audio':
      return 'headset';
    case 'text':
      return 'document-text';
    // case 'Bastidor':
    //   return 'camera';
    case 'reels':
      return 'film';
    default:
      return 'ellipse';
  }
};

const getTypeColor = (type: ContentType): string => {
  switch (type) {
    case 'video':
      return Colors.primary.main;
    case 'audio':
      return Colors.accent.orange;
    case 'text':
      return Colors.accent.green;
    // case 'Bastidor':
    //   return Colors.accent.pink;
    case 'reels':
      return '#E91E63';
    default:
      return Colors.text.secondary;
  }
};

const getActionButtonText = (type: ContentType): string => {
  switch (type) {
    case 'video':
      return 'Assistir agora';
    case 'audio':
      return 'Ouvir agora';
    case 'text':
      return 'Ler completo';
    // case 'Bastidor':
    //   return 'Ver bastidores';
    case 'reels':
      return 'Assistir Reel';
    default:
      return 'Abrir';
  }
};

export default function ContentDetailScreen({
  content,
  isFavorite,
  onBack,
  onShare,
  onToggleFavorite,
}: ContentDetailScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const haptics = useHaptics();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(content.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const comments = getAllComments();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePlay = () => {
    haptics.medium();
    // Implementar player
    console.log('Play:', content.title);
  };

  const handleLike = () => {
    haptics.light();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  const handleShowComments = () => {
    haptics.light();
    setShowComments(true);
  };

  const handleAddComment = (commentText: string) => {
    // Implementar adicionar comentário
    console.log('Add comment:', commentText);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: content.imageUrl }} style={styles.heroImage} contentFit="cover" transition={200} />
        <View style={styles.heroOverlay} />

        {/* Back Button */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.actionButton}
            onPress={onToggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#EF4444' : Colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button"
            style={styles.actionButton}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Type Badge */}
        <View style={styles.heroTypeBadge}>
          <View
            style={[
              styles.typeIconContainer,
              { backgroundColor: `${getTypeColor(content.type)}40` },
            ]}
          >
            <Ionicons
              name={getTypeIcon(content.type) as keyof typeof Ionicons.glyphMap}
              size={20}
              color={getTypeColor(content.type)}
            />
          </View>
          <Text style={styles.heroTypeText}>{content.type}</Text>
        </View>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: `${getTypeColor(content.type)}20` },
              ]}
            >
              <Text
                style={[styles.typeBadgeText, { color: getTypeColor(content.type) }]}
              >
                {content.type}
              </Text>
            </View>
            {content.isExclusive && (
              <View style={styles.exclusiveBadge}>
                <Ionicons name="lock-closed" size={12} color={Colors.accent.pink} />
                <Text style={styles.exclusiveBadgeText}>EXCLUSIVO</Text>
              </View>
            )}
            <Text style={styles.date}>{content.date}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{content.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{content.description}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {content.views && (
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={16} color={Colors.text.secondary} />
                <Text style={styles.statText}>
                  {content.views.toLocaleString()} visualizações
                </Text>
              </View>
            )}
            <TouchableOpacity accessibilityRole="button"
              style={styles.statItem}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={isLiked ? '#EF4444' : Colors.text.secondary}
              />
              <Text
                style={[
                  styles.statText,
                  isLiked && styles.statTextLiked,
                ]}
              >
                {likesCount.toLocaleString()} curtidas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button"
              style={styles.statItem}
              onPress={handleShowComments}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.statText}>
                {TOTAL_COMMENTS} comentários
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category */}
          {content.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Categoria:</Text>
              <Text style={styles.categoryText}>{content.category}</Text>
            </View>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tagsContainer}>
                {content.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Audio Player ou Action Button */}
          {content.type === 'audio' && content.audioUrl ? (
            <View style={styles.audioPlayerContainer}>
              <AudioPlayer
                audioUrl={content.audioUrl}
                title={content.title}
                duration={content.duration}
                onPlay={() => haptics.medium()}
                onPause={() => haptics.light()}
              />
            </View>
          ) : (
            <View style={styles.actionButtonContainer}>
              <View style={{ marginBottom: 16, width: '100%' }}>
                <Button
                  title={getActionButtonText(content.type)}
                  onPress={handlePlay}
                  fullWidth
                />
              </View>
            </View>
          )}

          {/* Comments Preview */}
          <View style={styles.commentsPreview}>
            <View style={styles.commentsPreviewHeader}>
              <Text style={styles.commentsPreviewTitle}>
                Comentários ({TOTAL_COMMENTS})
              </Text>
              <TouchableOpacity accessibilityRole="button" onPress={handleShowComments}>
                <Text style={styles.seeAllComments}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {/* Mostrar apenas 2-3 comentários */}
            {comments.slice(0, 3).map((comment) => (
              <View key={comment.id} style={styles.commentPreview}>
                <View style={styles.commentPreviewHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  {comment.isFromNath && (
                    <Ionicons name="checkmark-circle" size={14} color={Colors.primary.main} />
                  )}
                  {comment.isPinned && (
                    <View style={styles.pinnedBadge}>
                      <Ionicons name="pin" size={10} color={Colors.accent.orange} />
                      <Text style={styles.pinnedBadgeText}>FIXADO</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.commentPreviewText} numberOfLines={3}>
                  {comment.content}
                </Text>
                <View style={styles.commentPreviewFooter}>
                  <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  <TouchableOpacity accessibilityRole="button" style={styles.commentLikeButton}>
                    <Ionicons name="heart-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.commentLikes}>{comment.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowComments(false)}
      >
        <CommentsSection
          comments={comments}
          totalComments={TOTAL_COMMENTS}
          onClose={() => setShowComments(false)}
          onAddComment={handleAddComment}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroTypeBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  typeIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  exclusiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent.pink}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  exclusiveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent.pink,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tagsSection: {
    marginBottom: 32,
  },
  tagsLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  actionButtonContainer: {
    marginTop: 'auto',
  },
  audioPlayerContainer: {
    marginTop: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
  },
  statTextLiked: {
    color: '#EF4444',
  },
  commentsPreview: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  commentsPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsPreviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllComments: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  commentPreview: {
    padding: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent.orange}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  pinnedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accent.orange,
    letterSpacing: 0.5,
  },
  commentPreviewText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentTimestamp: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikes: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

