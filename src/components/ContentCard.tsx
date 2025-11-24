/**
 * ContentCard Component
 * Card reutilizável para exibir conteúdo do Mundo Nath
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem, ContentType } from '../types/content';
import { Colors } from '../constants/Colors';
import { useHaptics } from '../hooks/useHaptics';

interface ContentCardProps {
  item: ContentItem;
  onPress: () => void;
  onLike?: (item: ContentItem) => void;
  onComment?: (item: ContentItem) => void;
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

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPress,
  onLike,
  onComment,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const haptics = useHaptics();
  const [isLiked, setIsLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(item.likes || 0);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
    haptics.light();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    haptics.medium();
    onLike?.(item);
  };

  const handleCommentPress = (e: any) => {
    e.stopPropagation();
    haptics.light();
    onComment?.(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.contentCard}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <View style={styles.cardImageOverlay} />

          {/* Exclusive Badge */}
          {item.isExclusive && (
            <View style={styles.exclusiveBadge}>
              <Ionicons name="lock-closed" size={10} color="#fff" />
              <Text style={styles.exclusiveBadgeText}>EXCLUSIVO</Text>
            </View>
          )}

          {/* Type Icon */}
          <View
            style={[
              styles.typeIconContainer,
              { backgroundColor: `${getTypeColor(item.type)}40` },
            ]}
          >
            <Ionicons
              name={getTypeIcon(item.type) as any}
              size={20}
              color={getTypeColor(item.type)}
            />
          </View>

          {/* Duration */}
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={12} color="#fff" />
              <Text style={styles.statText}>{item.views?.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={12} color="#fff" />
              <Text style={styles.statText}>{item.likes?.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: `${getTypeColor(item.type)}20` },
              ]}
            >
              <Text
                style={[styles.typeBadgeText, { color: getTypeColor(item.type) }]}
              >
                {item.type}
              </Text>
            </View>
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#EF4444' : Colors.text.secondary}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isLiked && styles.actionButtonTextActive,
                ]}
              >
                {likesCount.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCommentPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.actionButtonText}>Comentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  cardImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  exclusiveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.pink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  exclusiveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  typeIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.background.dark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.dark,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.background.dark,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  actionButtonTextActive: {
    color: '#EF4444',
  },
});

export default ContentCard;

