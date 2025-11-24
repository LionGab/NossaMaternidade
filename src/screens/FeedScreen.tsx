import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FlashList } from '@shopify/flash-list';
import { Heart, MessageCircle, Share2, BookmarkPlus, Play, FileText, Mic, Video } from 'lucide-react-native';
import { MOCK_POSTS } from '../constants/data';

type FilterType = 'all' | 'vídeo' | 'texto' | 'áudio';

export default function FeedScreen() {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPosts = MOCK_POSTS.filter(p =>
    filter === 'all' || p.type.toLowerCase() === filter.toLowerCase()
  );

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Tudo' },
    { value: 'vídeo', label: 'Vídeo' },
    { value: 'texto', label: 'Texto' },
    { value: 'áudio', label: 'Áudio' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: colors.background.card, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>
          Feed
        </Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginLeft: -16, paddingLeft: 16 }}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilter(option.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filter === option.value ? colors.primary.main : colors.background.elevated,
                marginRight: 8,
              }}
            >
              <Text style={{
                color: filter === option.value ? '#FFFFFF' : colors.text.secondary,
                fontWeight: '600',
                fontSize: 14,
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed List */}
      {filteredPosts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 16, color: colors.text.secondary, textAlign: 'center' }}>
            Nenhum conteúdo encontrado para este filtro
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredPosts}
          estimatedItemSize={400}
          renderItem={({ item }) => {
            const getIconForType = () => {
              switch (item.type.toLowerCase()) {
                case 'vídeo': return <Video size={16} color="#FFFFFF" />;
                case 'texto': return <FileText size={16} color="#FFFFFF" />;
                case 'áudio': return <Mic size={16} color="#FFFFFF" />;
                case 'reels': return <Play size={16} color="#FFFFFF" />;
                default: return null;
              }
            };

            return (
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border.light, backgroundColor: colors.background.canvas }}>
                {/* Post Image */}
                <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={{ width: '100%', height: 200, backgroundColor: '#E5E7EB' }}
                    resizeMode="cover"
                  />
                  {/* Type badge */}
                  <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {getIconForType()}
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>{item.type}</Text>
                  </View>
                  {/* New badge */}
                  {item.isNew && (
                    <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#FF8FA3', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>NOVO</Text>
                    </View>
                  )}
                </View>

                {/* Post Title */}
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text.primary, lineHeight: 24 }}>
                  {item.title}
                </Text>

                {/* Actions */}
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Heart size={20} color={colors.text.tertiary} />
                    <Text style={{ color: colors.text.tertiary, fontSize: 14, fontWeight: '500' }}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={20} color={colors.text.tertiary} />
                    <Text style={{ color: colors.text.tertiary, fontSize: 14, fontWeight: '500' }}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Share2 size={20} color={colors.text.tertiary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 'auto' }}>
                    <BookmarkPlus size={20} color={colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
