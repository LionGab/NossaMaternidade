import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from './Avatar';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '../types/comments';
import { nathAvatar } from '../assets/images';
import { useHaptics } from '../hooks/useHaptics';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onReply,
}) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const haptics = useHaptics();

  const handleLike = () => {
    haptics.light();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    onLike?.(comment.id);
  };

  return (
    <View
      style={[
        styles.commentContainer,
        comment.isPinned && styles.pinnedComment,
        comment.isFromNath && styles.nathComment,
      ]}
    >
      {/* Header */}
      <View style={styles.commentHeader}>
        <View style={styles.authorInfo}>
          <Avatar
            size={32}
            source={comment.isFromNath ? nathAvatar : undefined}
            name={comment.author.charAt(0)}
          />
          <View style={styles.authorText}>
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{comment.author}</Text>
              {comment.isFromNath && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary.main} />
                </View>
              )}
              {comment.isPinned && (
                <View style={styles.pinnedBadge}>
                  <Ionicons name="pin" size={12} color={Colors.accent.orange} />
                  <Text style={styles.pinnedBadgeText}>FIXADO</Text>
                </View>
              )}
              {comment.isAngelOfTheDay && (
                <View style={styles.angelBadge}>
                  <Ionicons name="star" size={12} color="#FCD34D" />
                  <Text style={styles.angelBadgeText}>ANJO DO DIA</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{comment.timestamp}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.commentContent} selectable>
        {comment.content}
      </Text>

      {/* Actions */}
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#EF4444' : Colors.text.secondary}
          />
          <Text
            style={[
              styles.actionText,
              isLiked && styles.actionTextLiked,
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        {onReply && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReply(comment.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={18} color={Colors.text.secondary} />
            <Text style={styles.actionText}>Responder</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pinnedComment: {
    borderColor: Colors.accent.orange,
    borderWidth: 2,
    backgroundColor: `${Colors.accent.orange}10`,
  },
  nathComment: {
    borderColor: Colors.primary.main,
    borderWidth: 2,
    backgroundColor: `${Colors.primary.main}10`,
  },
  commentHeader: {
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorText: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  verifiedBadge: {
    marginLeft: 2,
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
  angelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCD34D20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  angelBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  commentContent: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  actionTextLiked: {
    color: '#EF4444',
  },
});

export default CommentItem;

