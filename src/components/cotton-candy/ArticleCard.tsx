/**
 * ArticleCard - Cotton Candy Theme
 * Card de artigo para "Últimos Artigos"
 *
 * iOS/Android Store Ready
 */

import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface ArticleCardProps {
  title: string;
  category: string;
  categoryColor?: string;
  imageUrl: string;
  onPress?: () => void;
}

export function ArticleCard({
  title,
  category,
  categoryColor = '#9333EA',
  imageUrl,
  onPress,
}: ArticleCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.category, { color: categoryColor }]}>{category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    lineHeight: 20,
  },
});

export default ArticleCard;
