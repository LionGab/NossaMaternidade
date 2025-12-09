/**
 * FeaturedVideoCard - Cotton Candy Theme
 * Card de vídeo em destaque (Destaque da Semana)
 *
 * iOS/Android Store Ready
 */

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FeaturedVideoCardProps {
  title: string;
  thumbnailUrl: string;
  tag?: string;
  likes?: string;
  comments?: string;
  onPress?: () => void;
  onWatchPress?: () => void;
}

export function FeaturedVideoCard({
  title,
  thumbnailUrl,
  tag = 'Viral',
  likes = '2.4M',
  comments = '15k',
  onPress,
  onWatchPress,
}: FeaturedVideoCardProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Destaque da Semana</Text>

      {/* Video Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <ImageBackground
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          imageStyle={styles.thumbnailImage}
        >
          {/* Play Button Overlay */}
          <View style={styles.playButtonContainer}>
            <View style={styles.playButtonOuter}>
              <View style={styles.playButtonInner}>
                <Ionicons name="play" size={20} color="#EC4899" style={styles.playIcon} />
              </View>
            </View>
          </View>

          {/* Bottom Gradient & Content */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            {/* Tag */}
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={14} color="#EC4899" />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={14} color="#737373" />
            <Text style={styles.statText}>{comments}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onWatchPress}>
          <Text style={styles.watchButton}>Assistir Completo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  thumbnail: {
    width: '100%',
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    borderRadius: 24,
  },
  playButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  playButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playIcon: {
    marginLeft: 2,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 60,
  },
  tagContainer: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#737373',
  },
  watchButton: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F97316', // Orange-500
  },
});

export default FeaturedVideoCard;
