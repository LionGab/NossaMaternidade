import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { CommentItem } from './CommentItem';
import { Comment } from '../types/comments';
import { Ionicons } from '@expo/vector-icons';
import { useHaptics } from '../hooks/useHaptics';

interface CommentsSectionProps {
  comments: Comment[];
  totalComments: number;
  onClose: () => void;
  onAddComment?: (content: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  totalComments,
  onClose,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const haptics = useHaptics();

  const handleLike = (commentId: string) => {
    // Implementar lógica de like
    console.log('Like comment:', commentId);
  };

  const handleReply = (commentId: string) => {
    haptics.light();
    // Implementar lógica de reply
    console.log('Reply to comment:', commentId);
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      haptics.medium();
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Comentários ({totalComments})
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <ScrollView
        style={styles.commentsList}
        contentContainerStyle={styles.commentsContent}
        showsVerticalScrollIndicator={false}
      >
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
          />
        ))}

        {/* Load More */}
        {totalComments > comments.length && (
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>
              Ver mais {totalComments - comments.length} comentários
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Compartilhe seu momento, mãe..."
            placeholderTextColor={Colors.text.tertiary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newComment.trim() ? Colors.primary.main : Colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadMoreButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.background.dark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: Colors.background.card,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text.primary,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentsSection;

