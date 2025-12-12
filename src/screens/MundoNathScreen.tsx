/**
 * MundoNathScreen - Conteúdo Exclusivo da Nathália
 *
 * Design premium com:
 * - Rituals rápidos de bem-estar
 * - Reels e vídeos educativos
 * - Artigos e conteúdo personalizado
 * - Conexão real com backend
 *
 * @version 3.0.0 - Production Ready
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Play,
  BookOpen,
  Headphones,
  Video,
  Heart,
  Clock,
  Eye,
  Sparkles,
  Star,
  Flower2,
} from 'lucide-react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { feedService, type ContentItem } from '@/services/supabase/feedService';
import type { RootStackParamList } from '@/navigation/types';
import { Spacing, Radius } from '@/theme/tokens';
import { SoftPastelTheme, SoftPastelBackgrounds } from '@/theme/softPastelTheme';
import { logger } from '@/utils/logger';

// Cores SoftPastel
const COLORS = {
  background: SoftPastelBackgrounds.soft,
  backgroundEnd: '#F0F7FF',
  card: '#FFFFFF',
  pink: SoftPastelTheme.colors.pink,
  purple: SoftPastelTheme.colors.purple,
  blue: SoftPastelTheme.colors.blue,
  mint: SoftPastelTheme.colors.mint,
  peach: SoftPastelTheme.colors.peach,
  accent: '#FF6B9D',
  accentLight: '#FFE4EC',
  textDark: '#3A2E2E',
  textMuted: '#6A5450',
  border: 'rgba(0,0,0,0.06)',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Categorias de conteúdo
const CONTENT_CATEGORIES = [
  { id: 'all', label: 'Todos', emoji: '✨' },
  { id: 'video', label: 'Vídeos', emoji: '🎬' },
  { id: 'audio', label: 'Áudios', emoji: '🎧' },
  { id: 'article', label: 'Artigos', emoji: '📖' },
];

// Rituais rápidos (mock - depois conectar ao backend)
const QUICK_RITUALS = [
  {
    id: 'r1',
    title: 'Respiração 4-7-8',
    duration: '2 min',
    emoji: '🌬️',
    color: COLORS.blue,
    description: 'Acalme sua mente',
  },
  {
    id: 'r2',
    title: 'Gratidão Matinal',
    duration: '3 min',
    emoji: '🌅',
    color: COLORS.peach,
    description: 'Comece bem o dia',
  },
  {
    id: 'r3',
    title: 'Body Scan',
    duration: '5 min',
    emoji: '🧘',
    color: COLORS.purple,
    description: 'Relaxe o corpo',
  },
  {
    id: 'r4',
    title: 'Afirmações',
    duration: '2 min',
    emoji: '💝',
    color: COLORS.pink,
    description: 'Fortaleça sua mente',
  },
];

// Mock content (fallback quando backend não tem dados)
const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'mock-1',
    title: 'Como lidar com a privação de sono',
    description: 'Dicas práticas para sobreviver às noites mal dormidas',
    type: 'article',
    category: 'bem-estar',
    duration: 5,
    views_count: 1234,
    likes_count: 89,
    is_premium: false,
    is_exclusive: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Meditação para Mães Cansadas',
    description: 'Um momento de paz no meio do caos',
    type: 'audio',
    category: 'mindfulness',
    duration: 10,
    views_count: 856,
    likes_count: 156,
    is_premium: false,
    is_exclusive: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Amamentação: Mitos e Verdades',
    description: 'O que você precisa saber sobre amamentação',
    type: 'video',
    category: 'educativo',
    duration: 8,
    views_count: 2103,
    likes_count: 234,
    is_premium: false,
    is_exclusive: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function MundoNathScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // State
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      const filters = activeCategory !== 'all'
        ? { type: activeCategory as 'video' | 'audio' | 'article' | 'reels' }
        : {};
      const fetchedContent = await feedService.getContent(filters, 0, 20);

      // Use mock data if no content from backend
      setContent(fetchedContent.length > 0 ? fetchedContent : MOCK_CONTENT);
    } catch (error) {
      logger.error('[MundoNathScreen] Error loading data', error);
      setContent(MOCK_CONTENT);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Navegação
  const handleRitualPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Ritual');
  }, [navigation]);

  const handleContentPress = useCallback(
    (item: ContentItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate('ContentDetail', { contentId: item.id });
    },
    [navigation]
  );

  // Get icon for content type
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      case 'article':
        return BookOpen;
      default:
        return Sparkles;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar style="dark" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundEnd]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing['4'],
          paddingBottom: insets.bottom + 180,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.accent} />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Header com Avatar */}
          <View style={{ alignItems: 'center', paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.accentLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing['3'],
                borderWidth: 3,
                borderColor: COLORS.accent,
              }}
            >
              <Image
                source={{ uri: 'https://i.imgur.com/tNIrNIs.jpg' }}
                style={{ width: 72, height: 72, borderRadius: 36 }}
                contentFit="cover"
              />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.textDark }}>
              Mundo da Nath 🌸
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' }}>
              Conteúdo exclusivo pra você se cuidar
            </Text>
          </View>

          {/* Featured Ritual Card */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['5'] }}>
            <TouchableOpacity onPress={handleRitualPress} activeOpacity={0.9}>
              <LinearGradient
                colors={[COLORS.pink, COLORS.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: Radius['2xl'],
                  padding: Spacing['5'],
                  overflow: 'hidden',
                }}
              >
                {/* Badge */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: Radius.full,
                    alignSelf: 'flex-start',
                    marginBottom: Spacing['3'],
                  }}
                >
                  <Star size={14} color="#FFF" fill="#FFF" />
                  <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '600', color: '#FFF' }}>
                    DESTAQUE
                  </Text>
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 6 }}>
                  Ritual de 3 Minutos
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: Spacing['4'] }}>
                  Reconecte-se com você antes de começar o caos do dia
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFF',
                    paddingVertical: Spacing['3'],
                    paddingHorizontal: Spacing['4'],
                    borderRadius: Radius.full,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Play size={18} color={COLORS.accent} fill={COLORS.accent} />
                  <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: COLORS.accent }}>
                    Começar Agora
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Rituals */}
          <View style={{ marginBottom: Spacing['5'] }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: Spacing['6'],
                marginBottom: Spacing['3'],
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textDark }}>
                Rituais Rápidos
              </Text>
              <TouchableOpacity>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.accent }}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing['6'], gap: Spacing['3'] }}
            >
              {QUICK_RITUALS.map(ritual => (
                <TouchableOpacity
                  key={ritual.id}
                  onPress={handleRitualPress}
                  activeOpacity={0.8}
                  style={{
                    width: 130,
                    backgroundColor: COLORS.card,
                    borderRadius: Radius.xl,
                    padding: Spacing['4'],
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: `${ritual.color}30`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing['2'],
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{ritual.emoji}</Text>
                  </View>
                  <Text
                    style={{ fontSize: 13, fontWeight: '600', color: COLORS.textDark }}
                    numberOfLines={1}
                  >
                    {ritual.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                    {ritual.duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Content Categories */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['4'] }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: Spacing['3'] }}>
              Explore
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: Spacing['2'] }}
            >
              {CONTENT_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveCategory(cat.id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: Spacing['2'],
                      paddingHorizontal: Spacing['3'],
                      borderRadius: Radius.full,
                      backgroundColor: isActive ? COLORS.accent : COLORS.card,
                      borderWidth: 1,
                      borderColor: isActive ? COLORS.accent : COLORS.border,
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isActive ? '#FFF' : COLORS.textMuted,
                      }}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Content Grid */}
          <View style={{ paddingHorizontal: Spacing['6'] }}>
            {loading ? (
              <View style={{ paddingVertical: Spacing['8'], alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={{ marginTop: Spacing['3'], color: COLORS.textMuted }}>
                  Carregando conteúdos...
                </Text>
              </View>
            ) : content.length === 0 ? (
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: Radius.xl,
                  padding: Spacing['6'],
                  alignItems: 'center',
                }}
              >
                <Flower2 size={48} color={COLORS.textMuted} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: COLORS.textDark,
                    marginTop: Spacing['3'],
                    textAlign: 'center',
                  }}
                >
                  Novos conteúdos em breve!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textMuted,
                    marginTop: Spacing['2'],
                    textAlign: 'center',
                  }}
                >
                  Estamos preparando algo especial pra você
                </Text>
              </View>
            ) : (
              <View style={{ gap: Spacing['3'] }}>
                {content.map(item => {
                  const IconComponent = getContentIcon(item.type);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleContentPress(item)}
                      activeOpacity={0.9}
                      style={{
                        backgroundColor: COLORS.card,
                        borderRadius: Radius.xl,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    >
                      {/* Thumbnail ou gradient */}
                      {item.thumbnail_url ? (
                        <Image
                          source={{ uri: item.thumbnail_url }}
                          style={{ width: '100%', height: 160 }}
                          contentFit="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={
                            item.type === 'video'
                              ? [COLORS.blue, COLORS.purple]
                              : item.type === 'audio'
                              ? [COLORS.mint, COLORS.blue]
                              : [COLORS.peach, COLORS.pink]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            width: '100%',
                            height: 120,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent size={40} color="rgba(255,255,255,0.8)" />
                        </LinearGradient>
                      )}

                      {/* Content Info */}
                      <View style={{ padding: Spacing['4'] }}>
                        {/* Type badge */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: Spacing['2'],
                          }}
                        >
                          <IconComponent size={14} color={COLORS.accent} />
                          <Text
                            style={{
                              marginLeft: 6,
                              fontSize: 11,
                              fontWeight: '600',
                              color: COLORS.accent,
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.type === 'video' ? 'Vídeo' : item.type === 'audio' ? 'Áudio' : 'Artigo'}
                          </Text>
                          {item.is_exclusive && (
                            <View
                              style={{
                                marginLeft: 8,
                                backgroundColor: COLORS.accentLight,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 4,
                              }}
                            >
                              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.accent }}>
                                EXCLUSIVO
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Title */}
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: COLORS.textDark,
                            marginBottom: 4,
                          }}
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>

                        {/* Description */}
                        {item.description && (
                          <Text
                            style={{
                              fontSize: 13,
                              color: COLORS.textMuted,
                              marginBottom: Spacing['3'],
                            }}
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        )}

                        {/* Stats */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['4'] }}>
                          {item.duration && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Clock size={14} color={COLORS.textMuted} />
                              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                                {item.duration} min
                              </Text>
                            </View>
                          )}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Eye size={14} color={COLORS.textMuted} />
                            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                              {item.views_count?.toLocaleString() || 0}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Heart size={14} color={COLORS.textMuted} />
                            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                              {item.likes_count?.toLocaleString() || 0}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ paddingVertical: Spacing['6'], alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Heart size={16} fill={COLORS.accent} color={COLORS.accent} />
              <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                Conteúdo feito com amor
              </Text>
              <Sparkles size={16} color={COLORS.purple} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
