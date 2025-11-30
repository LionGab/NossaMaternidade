/**
 * CommunityScreen - Tela de Comunidade MãesValentes
 * Design inspirado nas imagens fornecidas: header com avatar, botões de ação, filtros e posts
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTheme } from '@/theme';
import { Tokens, Shadows, Spacing, Typography } from '@/theme/tokens';
import { Plus, Grid3x3, Users, MoreVertical, Heart, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type FilterType = 'Todos' | 'Dicas' | 'Desabafos' | 'Dúvidas' | 'Humor';

interface Post {
  id: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
}

export default function CommunityScreen() {
  const { colors, isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'Dicas', 'Desabafos', 'Dúvidas', 'Humor'];

  const mockPosts: Post[] = [
    {
      id: '1',
      author: 'Sofia L.',
      authorInitials: 'SL',
      timeAgo: '45min atrás',
      title: 'EU QUASE DESISTI. MAS AÍ, UMA NOTIFICAÇÃO MUDOU O DIA.',
      content: `A madrugada foi um inferno.
Meu bebê chorando, meu marido dormindo, meu peito cheio, minha cabeça girando.
Eu quis sumir.
Quis sair pela porta e não voltar por algumas horas.
Quando o sol começou a nascer, eu já estava vazia.
Sem energia, sem paciência, sem esperança.
Peguei o celular pra desligar todas as notificações do mundo.
E aí...
veio uma notificação do NossaMaternidade:
"Respira. Hoje você não precisa ser forte o tempo inteiro."
A frase parecia boba.
Mas naquele estado...
foi um abraço.
Eu abri o app, entrei na comunidade, li três relatos parecidos com o meu e senti um alívio...`,
      likes: 127,
      replies: 23,
    },
    {
      id: '2',
      author: 'Ana Silva',
      authorInitials: 'AS',
      timeAgo: '2h atrás',
      title: 'DICA: Como organizar a rotina de amamentação',
      content: 'Compartilhando o que funcionou pra mim: criar um app de lembretes e sempre ter uma garrafa d\'água por perto!',
      likes: 45,
      replies: 8,
    },
    {
      id: '3',
      author: 'Juliana Costa',
      authorInitials: 'JC',
      timeAgo: '5h atrás',
      title: 'Alguém mais aqui amamentando e trabalhando?',
      content: 'Preciso de dicas de como organizar as bombadas durante o expediente. Como vocês fazem?',
      likes: 32,
      replies: 15,
    },
  ];

  const handleFilterPress = (filter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  };

  const handleCreatePost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // navigation.navigate('CreatePost');
  };

  const handleViewFeed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // navigation.navigate('Feed');
  };

  const handleGroups = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // navigation.navigate('Groups');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top']}
      accessible={true}
      accessibilityLabel="Tela da Comunidade MãesValentes"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing['20'] }}
      >
        {/* Header Section - Avatar Grande + Título */}
        <View
          style={{
            backgroundColor: isDark ? colors.raw.neutral[800] : colors.raw.neutral[100],
            paddingTop: Spacing['6'],
            paddingBottom: Spacing['8'],
            alignItems: 'center',
          }}
        >
          {/* Avatar Circular Grande */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: isDark ? colors.raw.neutral[700] : colors.raw.neutral[200],
              marginBottom: Spacing['4'],
              overflow: 'hidden',
              ...Shadows.md,
            }}
          >
            <Image
              source={{ uri: 'https://i.imgur.com/U5ttbqK.png' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
              accessible={true}
              accessibilityLabel="Avatar da comunidade MãesValentes"
            />
          </View>

          {/* Título */}
          <Text
            style={{
              fontSize: Typography.sizes['3xl'],
              fontWeight: Typography.weights.bold,
              color: colors.text.primary,
              marginBottom: Spacing['1'],
              textAlign: 'center',
            }}
            accessibilityRole="header"
            accessibilityLabel="Comunidade"
          >
            Comunidade
          </Text>

          {/* Subtítulo */}
          <Text
            style={{
              fontSize: Typography.sizes.base,
              color: colors.text.secondary,
              marginBottom: Spacing['6'],
              textAlign: 'center',
            }}
          >
            Mãe ajuda mãe ❤️
          </Text>

          {/* Botões de Ação */}
          <View
            style={{
              flexDirection: 'row',
              gap: Spacing['3'],
              paddingHorizontal: Spacing['5'],
              width: '100%',
            }}
          >
            {/* Botão Criar Post */}
            <TouchableOpacity
              onPress={handleCreatePost}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: colors.primary.main,
                paddingVertical: Spacing['3'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Tokens.radius.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: Spacing['2'],
                ...Shadows.sm,
              }}
              accessibilityRole="button"
              accessibilityLabel="Criar Post"
              accessibilityHint="Toque para criar um novo post na comunidade"
            >
              <Plus size={18} color={colors.text.inverse} />
              <Text
                style={{
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.weights.semibold,
                  color: colors.text.inverse,
                }}
              >
                Criar Post
              </Text>
            </TouchableOpacity>

            {/* Botão Ver Feed */}
            <TouchableOpacity
              onPress={handleViewFeed}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: colors.raw.secondary[500],
                paddingVertical: Spacing['3'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Tokens.radius.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: Spacing['2'],
                ...Shadows.sm,
              }}
              accessibilityRole="button"
              accessibilityLabel="Ver Feed"
              accessibilityHint="Toque para ver o feed completo da comunidade"
            >
              <Grid3x3 size={18} color={colors.text.inverse} />
              <Text
                style={{
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.weights.semibold,
                  color: colors.text.inverse,
                }}
              >
                Ver Feed
              </Text>
            </TouchableOpacity>

            {/* Botão Grupos */}
            <TouchableOpacity
              onPress={handleGroups}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: colors.raw.accent.orange,
                paddingVertical: Spacing['3'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Tokens.radius.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: Spacing['2'],
                ...Shadows.sm,
              }}
              accessibilityRole="button"
              accessibilityLabel="Grupos"
              accessibilityHint="Toque para ver os grupos da comunidade"
            >
              <Users size={18} color={colors.text.inverse} />
              <Text
                style={{
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.weights.semibold,
                  color: colors.text.inverse,
                }}
              >
                Grupos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de Filtros */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: Spacing['4'],
            paddingVertical: Spacing['3'],
            gap: Spacing['2'],
            backgroundColor: colors.background.canvas,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.light,
          }}
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: Spacing['4'],
                  paddingVertical: Spacing['2'],
                  borderRadius: Tokens.radius.full,
                  backgroundColor: isSelected
                    ? (isDark ? colors.raw.neutral[700] : colors.raw.neutral[200])
                    : 'transparent',
                }}
                accessibilityRole="button"
                accessibilityLabel={`Filtro: ${filter}`}
                accessibilityState={{ selected: isSelected }}
                accessibilityHint={`Toque para filtrar posts por ${filter.toLowerCase()}`}
              >
                <Text
                  style={{
                    fontSize: Typography.sizes.sm,
                    fontWeight: isSelected ? Typography.weights.semibold : Typography.weights.medium,
                    color: isSelected ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista de Posts */}
        <View style={{ paddingTop: Spacing['4'] }}>
          {mockPosts.map((post) => (
            <View
              key={post.id}
              style={{
                marginHorizontal: Spacing['4'],
                marginBottom: Spacing['4'],
                backgroundColor: colors.background.card,
                borderRadius: Tokens.radius.xl,
                padding: Spacing['5'],
                borderWidth: 1,
                borderColor: colors.border.light,
                ...Shadows.sm,
              }}
              accessible={true}
              accessibilityLabel={`Post de ${post.author}, ${post.timeAgo}. ${post.title}`}
            >
              {/* Header do Post */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Spacing['4'],
                }}
              >
                {/* Avatar do Autor */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Spacing['3'],
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.sizes.sm,
                      fontWeight: Typography.weights.bold,
                      color: colors.primary.main,
                    }}
                  >
                    {post.authorInitials}
                  </Text>
                </View>

                {/* Nome e Tempo */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: Typography.sizes.base,
                      fontWeight: Typography.weights.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    {post.author}
                  </Text>
                  <Text
                    style={{
                      fontSize: Typography.sizes.xs,
                      color: colors.text.tertiary,
                      marginTop: 2,
                    }}
                  >
                    {post.timeAgo}
                  </Text>
                </View>

                {/* Menu */}
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Opções do post"
                >
                  <MoreVertical size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>

              {/* Título do Post */}
              <Text
                style={{
                  fontSize: Typography.sizes.lg,
                  fontWeight: Typography.weights.bold,
                  color: colors.text.primary,
                  marginBottom: Spacing['3'],
                  textTransform: 'uppercase',
                  lineHeight: Typography.lineHeights.lg * Typography.sizes.lg,
                }}
              >
                {post.title}
              </Text>

              {/* Conteúdo do Post */}
              <Text
                style={{
                  fontSize: Typography.sizes.base,
                  color: colors.text.primary,
                  lineHeight: Typography.lineHeights.base * Typography.sizes.base,
                  marginBottom: Spacing['4'],
                }}
              >
                {post.content}
              </Text>

              {/* Ações do Post */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: Spacing['6'],
                  paddingTop: Spacing['3'],
                  borderTopWidth: 1,
                  borderTopColor: colors.border.light,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing['2'],
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${post.likes} curtidas`}
                >
                  <Heart size={18} color={colors.text.tertiary} />
                  <Text
                    style={{
                      fontSize: Typography.sizes.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    {post.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing['2'],
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${post.replies} respostas`}
                >
                  <MessageCircle size={18} color={colors.text.tertiary} />
                  <Text
                    style={{
                      fontSize: Typography.sizes.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    {post.replies}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
