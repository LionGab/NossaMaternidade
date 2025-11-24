import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FlashList } from '@shopify/flash-list';
import { Heart, MessageCircle, Share2, BookmarkPlus, Play, FileText, Mic, Video } from 'lucide-react-native';
import { MOCK_POSTS } from '../constants/data';

type FilterType = 'all' | 'vídeo' | 'texto' | 'áudio' | 'reels';

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
    { value: 'reels', label: 'Reels' },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      accessible={true}
      accessibilityLabel="Tela do Feed Mundo Nath"
    >
      {/* Header */}
      <View
        style={{ padding: 16, backgroundColor: colors.background.card, borderBottomWidth: 1, borderBottomColor: colors.border.light }}
        accessible={true}
        accessibilityRole="header"
      >
        <Text
          style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}
          accessibilityRole="header"
          accessibilityLabel="Feed de conteúdos Mundo Nath"
        >
          Feed
        </Text>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12, marginLeft: -16, paddingLeft: 16 }}
          accessible={false}
        >
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
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por ${option.label}`}
              accessibilityHint={filter === option.value ? 'Filtro ativo' : 'Toque para ativar este filtro'}
              accessibilityState={{ selected: filter === option.value }}
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
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Nenhum conteúdo encontrado para este filtro"
        >
          <Text style={{ fontSize: 16, color: colors.text.secondary, textAlign: 'center' }}>
            Nenhum conteúdo encontrado para este filtro
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredPosts}
          renderItem={({ item }) => {
            const getIconForType = () => {
              switch (item.type.toLowerCase()) {
                case 'video': return <Video size={16} color="#FFFFFF" />;
                case 'text': return <FileText size={16} color="#FFFFFF" />;
                case 'audio': return <Mic size={16} color="#FFFFFF" />;
                case 'reels': return <Play size={16} color="#FFFFFF" />;
                default: return null;
              }
            };

            return (
              <TouchableOpacity
                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border.light, backgroundColor: colors.background.canvas }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. Tipo: ${item.type}. ${item.isNew ? 'Novo conteúdo' : ''}`}
                accessibilityHint="Toque para ver detalhes deste conteúdo"
              >
                {/* Post Image */}
                <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={{ width: '100%', height: 200, backgroundColor: '#E5E7EB' }}
                    resizeMode="cover"
                    accessible={true}
                    accessibilityLabel={`Imagem de capa: ${item.title}`}
                    accessibilityIgnoresInvertColors
                  />
                  {/* Type badge */}
                  <View
                    style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    accessible={false}
                  >
                    {getIconForType()}
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>{item.type}</Text>
                  </View>
                  {/* New badge */}
                  {item.isNew && (
                    <View
                      style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#FF8FA3', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                      accessible={false}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>NOVO</Text>
                    </View>
                  )}
                </View>

                {/* Post Title */}
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text.primary, lineHeight: 24 }}
                  accessibilityRole="header"
                  accessible={false}
                >
                  {item.title}
                </Text>

                {/* Actions */}
                <View
                  style={{ flexDirection: 'row', gap: 20 }}
                  accessible={true}
                  accessibilityLabel="Ações do post: 12 curtidas, 5 comentários"
                  accessibilityRole="toolbar"
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel="Curtir. 12 curtidas"
                    accessibilityHint="Toque para curtir este post"
                  >
                    <Heart size={20} color={colors.text.tertiary} />
                    <Text style={{ color: colors.text.tertiary, fontSize: 14, fontWeight: '500' }}>12</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel="Comentar. 5 comentários"
                    accessibilityHint="Toque para ver e adicionar comentários"
                  >
                    <MessageCircle size={20} color={colors.text.tertiary} />
                    <Text style={{ color: colors.text.tertiary, fontSize: 14, fontWeight: '500' }}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Compartilhar"
                    accessibilityHint="Toque para compartilhar este conteúdo"
                  >
                    <Share2 size={20} color={colors.text.tertiary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 'auto' }}
                    accessibilityRole="button"
                    accessibilityLabel="Salvar nos favoritos"
                    accessibilityHint="Toque para salvar este conteúdo"
                  >
                    <BookmarkPlus size={20} color={colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          accessible={true}
          accessibilityRole="list"
          accessibilityLabel={`Lista de posts. ${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} ${filter === 'all' ? '' : `filtrado por ${filter}`}`}
        />
      )}
    </SafeAreaView>
  );
}
