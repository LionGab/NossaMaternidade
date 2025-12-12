/**
 * CommunityScreen - Tela da Comunidade Mães Valentes
 *
 * Design premium com:
 * - Feed de posts da comunidade
 * - Grupos de apoio
 * - Fórum de dúvidas
 * - Conexão real com backend
 *
 * @version 3.0.0 - Production Ready
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  MessageCircle,
  Heart,
  TrendingUp,
  Clock,
  HelpCircle,
  Send,
  MessageSquare,
  User,
  Shield,
} from 'lucide-react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { FeaturedPostCard } from '@/components/community/FeaturedPostCard';
import { communityService } from '@/services/supabase/communityService';
import type { CommunityPost, FeaturedPost } from '@/types/community';
import { STATUS_LABELS } from '@/types/community';
import { Spacing, Radius } from '@/theme/tokens';
import { useTheme } from '@/hooks/useTheme';
import { logger } from '@/utils/logger';

// Categorias do fórum (+ filtro "Meus posts")
const FORUM_CATEGORIES = [
  { id: 'popular', label: 'Popular', icon: TrendingUp },
  { id: 'recent', label: 'Recentes', icon: Clock },
  { id: 'unanswered', label: 'Sem resposta', icon: HelpCircle },
  { id: 'my-posts', label: 'Meus posts', icon: User }, // NOVO: Filtro de posts do usuário
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Paleta local (derivada do ThemeContext)
  const UI = {
    background: colors.background.canvas,
    card: colors.background.card,
    cardAlt: colors.background.beige ?? colors.background.card,
    accent: colors.primary.main,
    accentLight: `${colors.primary.light}33`,
    text: colors.text.primary,
    textMuted: colors.text.secondary,
    border: colors.border.light,
    gradientHeader: colors.background.gradient.header ?? colors.background.gradient.soft,
  } as const;

  // Grupos fixos (mock - depois conectar ao backend)
  const COMMUNITY_GROUPS = [
    { id: '1', name: 'Mães de Primeira Viagem', members: 1234, emoji: '👶', color: colors.primary.light },
    { id: '2', name: 'Amamentação & Apoio', members: 856, emoji: '🤱', color: colors.secondary.light },
    { id: '3', name: 'Sono do Bebê', members: 2103, emoji: '😴', color: colors.secondary.main },
    { id: '4', name: 'Saúde Mental Materna', members: 1567, emoji: '💜', color: colors.status.success },
  ] as const;

  // State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [onlineCount, setOnlineCount] = useState(0);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // TODO: Buscar featured post do backend (por enquanto mock)
  const [featuredPost] = useState<FeaturedPost | null>({
    id: 'featured-1',
    user_id: 'mock-user',
    content:
      'Hoje acordei exausta, mas quando vi meu bebê sorrindo no berço, tudo mudou. A maternidade é desafiadora, mas esses momentos fazem valer a pena. Vocês também sentem isso? 💕',
    is_anonymous: false,
    status: 'published',
    theme: 'puerperio',
    author: {
      id: 'mock-user',
      full_name: 'Maria Silva',
      avatar_url: null,
    },
    likes_count: 234,
    comments_count: 45,
    helpful_votes: 0,
    created_at: new Date().toISOString(),
    curator_note: 'Este post reflete um sentimento comum e genuíno que muitas mães compartilham 💖',
    featured_at: new Date().toISOString(),
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      const fetchedPosts = await communityService.getPosts(0, 20);
      setPosts(fetchedPosts);

      // Simular contagem de online (depois conectar a realtime)
      setOnlineCount(Math.floor(Math.random() * 500) + 1500);
    } catch (error) {
      logger.error('[CommunityScreen] Error loading data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Like post
  const handleLikePost = useCallback((postId: string, isLiked: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Update local state (backend sync would go here)
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              is_liked_by_user: !isLiked,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
            }
          : post
      )
    );
  }, []);

  // Create post
  const handleCreatePost = useCallback(async () => {
    if (!newPostText.trim() || isPosting) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPosting(true);

    try {
      const newPost = await communityService.createPost({
        content: newPostText.trim(),
      });

      if (newPost) {
        setPosts(prev => [newPost, ...prev]);
        setNewPostText('');
      }
    } catch (error) {
      logger.error('[CommunityScreen] Error creating post', error);
      Alert.alert('Erro', 'Não foi possível publicar. Tente novamente.');
    } finally {
      setIsPosting(false);
    }
  }, [newPostText, isPosting]);

  // Navigate to group
  const handleGroupPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to group detail
    Alert.alert('Em breve', 'Grupos estarão disponíveis em breve!');
  }, []);

  // Render post item
  const renderPostItem = useCallback(
    ({ item }: { item: CommunityPost }) => {
      // Exibir badge de status apenas no filtro "Meus posts"
      const showStatusBadge = activeCategory === 'my-posts';
      const statusColor =
        item.status === 'pending'
          ? '#F59E0B' // Amarelo (em revisão)
          : item.status === 'rejected'
            ? '#EF4444' // Vermelho (não publicado)
            : '#10B981'; // Verde (publicado)

      return (
        <TouchableOpacity
          activeOpacity={0.95}
          style={{
            backgroundColor: UI.card,
            borderRadius: Radius['3xl'],
            padding: Spacing['5'],
            marginBottom: Spacing['4'],
            borderWidth: 1,
            borderColor: UI.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* Author - Redesenhado */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['4'] }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: UI.accentLight,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: `${UI.accent}30`,
              }}
            >
              {item.author?.avatar_url ? (
                <Image
                  source={{ uri: item.author.avatar_url }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                  contentFit="cover"
                />
              ) : (
                <Text style={{ fontSize: 18, fontWeight: '700', color: UI.accent }}>
                  {item.author?.full_name?.[0] || 'M'}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: Spacing['3'] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['2'], marginBottom: Spacing['0.5'] }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: UI.text,
                    letterSpacing: -0.1,
                  }}
                >
                  {item.author?.full_name || 'Mãe Anônima'}
                </Text>
                {/* Badge de Status (só aparece em "Meus posts") */}
                {showStatusBadge && (
                  <View
                    style={{
                      paddingHorizontal: Spacing['2'],
                      paddingVertical: 2,
                      backgroundColor: `${statusColor}20`,
                      borderRadius: Radius.sm,
                      borderWidth: 1,
                      borderColor: `${statusColor}40`,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor }}>
                      {STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 13, color: UI.textMuted }}>
                {new Date(item.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            </View>
          </View>

          {/* Content - Redesenhado */}
          <Text
            style={{
              fontSize: 15,
              color: UI.text,
              lineHeight: 24,
              marginBottom: Spacing['4'],
              letterSpacing: 0.1,
            }}
          >
            {item.content}
          </Text>

          {/* Mensagem especial para posts rejeitados (em "Meus posts") */}
          {showStatusBadge && item.status === 'rejected' && (
            <View
              style={{
                backgroundColor: '#FEF2F2',
                padding: Spacing['3'],
                borderRadius: Radius.lg,
                marginBottom: Spacing['3'],
                borderLeftWidth: 3,
                borderLeftColor: '#EF4444',
              }}
            >
              <Text style={{ fontSize: 12, color: '#991B1B', fontStyle: 'italic' }}>
                Ficou entre você e a NathIA 💕
              </Text>
              <Text style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>
                Seu post não foi publicado para garantir a segurança da comunidade.
              </Text>
            </View>
          )}

          {/* Image */}
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: Radius.lg,
                marginBottom: Spacing['3'],
              }}
              contentFit="cover"
            />
          )}

          {/* Actions - Redesenhado */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['5'], paddingTop: Spacing['3'] }}>
            <TouchableOpacity
              onPress={() => handleLikePost(item.id, item.is_liked_by_user || false)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing['2'],
                paddingVertical: Spacing['2'],
                paddingHorizontal: Spacing['3'],
                borderRadius: Radius.full,
                backgroundColor: item.is_liked_by_user ? `${UI.accent}15` : 'transparent',
              }}
            >
              <Heart
                size={22}
                color={item.is_liked_by_user ? UI.accent : UI.textMuted}
                fill={item.is_liked_by_user ? UI.accent : 'none'}
                strokeWidth={2.5}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: item.is_liked_by_user ? UI.accent : UI.textMuted,
                }}
              >
                {item.likes_count}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing['2'],
                paddingVertical: Spacing['2'],
                paddingHorizontal: Spacing['3'],
                borderRadius: Radius.full,
              }}
            >
              <MessageCircle size={22} color={UI.textMuted} strokeWidth={2.5} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: UI.textMuted }}>
                {item.comments_count}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [handleLikePost, activeCategory]
  );

  return (
    <View style={{ flex: 1, backgroundColor: UI.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Background Gradient */}
      <LinearGradient
        colors={UI.gradientHeader as [string, string, ...string[]]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing['4'],
          paddingBottom: insets.bottom + 180,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={UI.accent} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header - Redesenhado */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: UI.text,
                letterSpacing: -0.5,
                lineHeight: 38,
                marginBottom: Spacing['1'],
              }}
            >
              Mães Valentes
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: UI.textMuted,
                lineHeight: 22,
                marginBottom: Spacing['4'],
              }}
            >
              Sua comunidade de apoio e acolhimento
            </Text>

            {/* Online counter - Redesenhado */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: UI.card,
                paddingVertical: Spacing['2.5'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Radius.full,
                alignSelf: 'flex-start',
                borderWidth: 1,
                borderColor: UI.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#22C55E',
                  marginRight: Spacing['2'],
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}
              />
              <Text style={{ fontSize: 14, fontWeight: '600', color: UI.text }}>
                {onlineCount.toLocaleString()} mães online
              </Text>
            </View>
          </View>

          {/* Post do Dia (Featured Post) */}
          {featuredPost && (
            <View style={{ paddingHorizontal: Spacing['6'] }}>
              <FeaturedPostCard
                post={featuredPost}
                onPress={(post) => {
                  // TODO: Navegar para tela de detalhes do post
                  logger.info('[CommunityScreen] Featured post clicked', { postId: post.id });
                  Alert.alert('Post em Destaque', 'Navegação para detalhes em breve!');
                }}
              />
            </View>
          )}

          {/* Grupos - Redesenhado */}
          <View style={{ marginBottom: Spacing['6'] }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: Spacing['6'],
                marginBottom: Spacing['4'],
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: UI.text,
                  letterSpacing: -0.2,
                }}
              >
                Grupos de Apoio
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: UI.accent }}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing['6'], gap: Spacing['3'] }}
            >
              {COMMUNITY_GROUPS.map(group => (
                <TouchableOpacity
                  key={group.id}
                  onPress={handleGroupPress}
                  activeOpacity={0.9}
                  style={{
                    width: 160,
                    backgroundColor: UI.card,
                    borderRadius: Radius['2xl'],
                    padding: Spacing['5'],
                    borderWidth: 1,
                    borderColor: UI.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: `${group.color}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing['3'],
                      borderWidth: 2,
                      borderColor: `${group.color}30`,
                    }}
                  >
                    <Text style={{ fontSize: 26 }}>{group.emoji}</Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: UI.text,
                      marginBottom: Spacing['1'],
                      letterSpacing: -0.1,
                    }}
                    numberOfLines={2}
                  >
                    {group.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: UI.textMuted }}>
                    {group.members.toLocaleString()} membros
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Criar Post - Redesenhado */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <View
              style={{
                backgroundColor: UI.card,
                borderRadius: Radius['3xl'],
                padding: Spacing['5'],
                borderWidth: 1,
                borderColor: UI.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: UI.text,
                  marginBottom: Spacing['4'],
                  letterSpacing: -0.1,
                }}
              >
                Compartilhe algo com a comunidade
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Spacing['3'] }}>
                <TextInput
                  value={newPostText}
                  onChangeText={setNewPostText}
                  placeholder="O que você está pensando?"
                  placeholderTextColor={UI.textMuted}
                  multiline
                  style={{
                    flex: 1,
                    backgroundColor: '#F8F5F7',
                    borderRadius: Radius.xl,
                    padding: Spacing['4'],
                    fontSize: 15,
                    color: UI.text,
                    maxHeight: 120,
                    minHeight: 52,
                    lineHeight: 22,
                    borderWidth: 1,
                    borderColor: UI.border,
                  }}
                />
                <TouchableOpacity
                  onPress={handleCreatePost}
                  disabled={!newPostText.trim() || isPosting}
                  activeOpacity={0.85}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: newPostText.trim() ? UI.accent : '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: newPostText.trim() ? UI.accent : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: newPostText.trim() ? 3 : 0,
                  }}
                >
                  {isPosting ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Send size={22} color="#FFF" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Forum Categories - Redesenhado */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['5'] }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: UI.text,
                marginBottom: Spacing['4'],
                letterSpacing: -0.2,
              }}
            >
              Fórum de Dúvidas
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: Spacing['3'] }}
            >
              {FORUM_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                const IconComponent = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveCategory(cat.id);
                    }}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: Spacing['3'],
                      paddingHorizontal: Spacing['4'],
                      borderRadius: Radius.full,
                      backgroundColor: isActive ? UI.accent : UI.card,
                      borderWidth: 1.5,
                      borderColor: isActive ? UI.accent : UI.border,
                      gap: Spacing['2'],
                      minHeight: 44,
                      shadowColor: isActive ? UI.accent : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: isActive ? 2 : 0,
                    }}
                  >
                    <IconComponent size={18} color={isActive ? colors.text.inverse : UI.textMuted} strokeWidth={2.5} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: isActive ? colors.text.inverse : UI.textMuted,
                        letterSpacing: 0.1,
                      }}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Posts Feed */}
          <View style={{ paddingHorizontal: Spacing['6'] }}>
            {loading ? (
              <View style={{ paddingVertical: Spacing['8'], alignItems: 'center' }}>
                <ActivityIndicator size="large" color={UI.accent} />
                <Text style={{ marginTop: Spacing['3'], color: UI.textMuted }}>
                  Carregando posts...
                </Text>
              </View>
            ) : posts.length === 0 ? (
              <View
                style={{
                  backgroundColor: UI.card,
                  borderRadius: Radius.xl,
                  padding: Spacing['6'],
                  alignItems: 'center',
                }}
              >
                <MessageSquare size={48} color={UI.textMuted} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: UI.text,
                    marginTop: Spacing['3'],
                    textAlign: 'center',
                  }}
                >
                  Nenhum post ainda
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: UI.textMuted,
                    marginTop: Spacing['2'],
                    textAlign: 'center',
                  }}
                >
                  Seja a primeira a compartilhar algo!
                </Text>
              </View>
            ) : (
              posts.map(post => renderPostItem({ item: post }))
            )}
          </View>

          {/* Rodapé de Segurança */}
          <View style={{ paddingVertical: Spacing['6'], paddingHorizontal: Spacing['6'], alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: `${colors.status.success}20`,
                padding: Spacing['3'],
                borderRadius: Radius.lg,
                borderLeftWidth: 3,
                borderLeftColor: colors.status.success,
              }}
            >
              <Shield size={16} color={colors.status.success} style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontSize: 12,
                  color: UI.textMuted,
                  textAlign: 'center',
                  flex: 1,
                  lineHeight: 18,
                }}
              >
                Esta comunidade oferece apoio emocional e troca entre mães. Em situações de urgência, procure atendimento profissional.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
