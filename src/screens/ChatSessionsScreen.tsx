/**
 * ChatSessionsScreen - Histórico de Sessões de Chat
 *
 * Features:
 * - Lista de conversas anteriores
 * - Criar nova conversa
 * - Abrir conversa existente
 * - Deletar conversa (swipe)
 * - Acessibilidade WCAG AAA
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  X,
  Plus,
  MessageCircle,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { IconButton } from '@/components/atoms/IconButton';
import { Text } from '@/components/atoms/Text';
import type { RootStackParamList } from '@/navigation/types';
import { chatService, ChatConversation } from '@/services/supabase';
import { useTheme } from '@/theme';
import { ColorTokens, Spacing, Radius } from '@/theme/tokens';
import { logger } from '@/utils/logger';

const AVATAR_URL = 'https://i.imgur.com/oB9ewPG.jpg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// TODO: Tags de sentimento mock - substituir por análise real posteriormente
type MoodTag = 'sono' | 'culpa' | 'amamentacao' | 'cansaco' | 'duvida';

const MOOD_TAG_CONFIG: Record<MoodTag, { label: string; emoji: string; color: string }> = {
  sono: { label: 'Sono', emoji: '😴', color: ColorTokens.primary[500] },
  culpa: { label: 'Culpa', emoji: '💭', color: ColorTokens.warning[600] },
  amamentacao: { label: 'Amamentação', emoji: '🍼', color: ColorTokens.info[500] },
  cansaco: { label: 'Cansaço', emoji: '😔', color: ColorTokens.secondary[500] },
  duvida: { label: 'Dúvida', emoji: '❓', color: ColorTokens.success[600] },
};

// Função mock para gerar tag aleatória (TODO: substituir por análise real)
const getMockMoodTag = (conversationId: string): MoodTag => {
  const tags: MoodTag[] = ['sono', 'culpa', 'amamentacao', 'cansaco', 'duvida'];
  // Usa o ID da conversa como seed para consistência
  const index = conversationId.charCodeAt(0) % tags.length;
  return tags[index];
};

// Formatar data relativa
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
};

// Componente de item da lista
interface SessionItemProps {
  conversation: ChatConversation;
  onPress: () => void;
  onDelete: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

const SessionItem = React.memo(
  ({ conversation, onPress, onDelete, colors }: SessionItemProps) => {
    const preview = conversation.last_message?.content || 'Nova conversa';
    const truncatedPreview =
      preview.length > 60 ? `${preview.slice(0, 60)}...` : preview;

    // Gerar tag de sentimento mock
    const moodTag = getMockMoodTag(conversation.id);
    const tagConfig = MOOD_TAG_CONFIG[moodTag];

    return (
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        layout={Layout.springify()}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
              'Deletar conversa?',
              'Esta ação não pode ser desfeita.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Deletar',
                  style: 'destructive',
                  onPress: onDelete,
                },
              ]
            );
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Conversa: ${conversation.title || 'Nova conversa'}. Tema: ${tagConfig.label}`}
          accessibilityHint="Toque para abrir esta conversa"
          style={[
            styles.sessionItem,
            {
              backgroundColor: colors.background.card,
              borderColor: colors.border.light,
            },
          ]}
        >
          {/* Avatar */}
          <View style={styles.sessionAvatar}>
            <Avatar
              size={48}
              source={{ uri: AVATAR_URL }}
              name="NathIA"
              fallback="N"
              borderWidth={2}
              borderColor={colors.primary.main}
            />
            <View
              style={[
                styles.onlineBadge,
                { backgroundColor: ColorTokens.success[500] },
              ]}
            />
          </View>

          {/* Conteúdo */}
          <View style={styles.sessionContent}>
            <View style={styles.sessionHeader}>
              <Text
                variant="body"
                size="md"
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {conversation.title || 'Conversa com NathIA'}
              </Text>
              <View style={styles.sessionTime}>
                <Clock size={12} color={colors.text.tertiary} />
                <Text
                  variant="caption"
                  size="xs"
                  color="tertiary"
                  style={{ marginLeft: 4 }}
                >
                  {formatRelativeDate(conversation.updated_at)}
                </Text>
              </View>
            </View>

            <Text
              variant="body"
              size="sm"
              color="secondary"
              numberOfLines={2}
              style={{ marginTop: Spacing['1'] }}
            >
              {truncatedPreview}
            </Text>

            {/* Tag de sentimento (mock) */}
            <View
              style={[
                styles.moodTag,
                { backgroundColor: `${tagConfig.color}20` },
              ]}
            >
              <Text style={{ fontSize: 12, marginRight: 4 }}>{tagConfig.emoji}</Text>
              <Text
                variant="caption"
                size="xs"
                weight="medium"
                style={{ color: tagConfig.color }}
              >
                {tagConfig.label}
              </Text>
            </View>
          </View>

          {/* Seta */}
          <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

SessionItem.displayName = 'SessionItem';

// Componente de estado vazio
interface EmptyStateProps {
  colors: ReturnType<typeof useTheme>['colors'];
  onStartFirstConversation: () => void;
}

const EmptyState = React.memo(({ colors, onStartFirstConversation }: EmptyStateProps) => (
  <Animated.View
    entering={FadeIn.duration(500)}
    style={styles.emptyState}
  >
    <View
      style={[
        styles.emptyIcon,
        { backgroundColor: `${colors.primary.main}20` },
      ]}
    >
      <MessageCircle size={48} color={colors.primary.main} />
    </View>
    <Text
      variant="body"
      size="lg"
      weight="semibold"
      align="center"
      style={{ marginTop: Spacing['4'] }}
    >
      Você ainda não começou nenhuma conversa com a NathIA
    </Text>
    <Text
      variant="body"
      size="md"
      color="secondary"
      align="center"
      style={{ marginTop: Spacing['2'], maxWidth: 280, lineHeight: 22 }}
    >
      Quando quiser falar, tô aqui 💕
    </Text>

    {/* Botão "Começar primeira conversa" */}
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onStartFirstConversation();
      }}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Começar primeira conversa com a NathIA"
      style={[
        styles.emptyStateButton,
        { backgroundColor: colors.primary.main },
      ]}
    >
      <MessageCircle size={20} color={ColorTokens.neutral[0]} strokeWidth={2} />
      <Text
        variant="body"
        size="md"
        weight="semibold"
        style={{ color: ColorTokens.neutral[0], marginLeft: Spacing['2'] }}
      >
        Começar primeira conversa
      </Text>
    </TouchableOpacity>
  </Animated.View>
));

EmptyState.displayName = 'EmptyState';

// Componente principal
export default function ChatSessionsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregar conversas
  const loadConversations = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const data = await chatService.getConversations(50);
      setConversations(data);

      logger.info('[ChatSessionsScreen] Conversas carregadas', {
        count: data.length,
      });
    } catch (error) {
      logger.error('[ChatSessionsScreen] Erro ao carregar conversas', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Criar nova conversa
  const handleNewConversation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logger.info('[ChatSessionsScreen] Criando nova conversa');

    // TODO: Pode criar conversa aqui ou deixar ChatScreen criar ao abrir sem threadId
    // Por enquanto, navegar para Chat sem threadId (ChatScreen cria automaticamente)
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate('Main', {
        screen: 'Chat',
        params: {}, // Sem threadId = nova conversa
      });
    }, 100);
  };

  // Abrir conversa existente
  const handleOpenConversation = useCallback((conversationId: string) => {
    logger.info('[ChatSessionsScreen] Abrindo conversa', { conversationId });
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate('Main', {
        screen: 'Chat',
        params: { sessionId: conversationId },
      });
    }, 100);
  }, [navigation]);

  // Deletar conversa
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logger.info('[ChatSessionsScreen] Deletando conversa', { conversationId });

    try {
      const success = await chatService.deleteConversation(conversationId);
      if (success) {
        setConversations((prev) =>
          prev.filter((c) => c.id !== conversationId)
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      logger.error('[ChatSessionsScreen] Erro ao deletar conversa', error);
      Alert.alert('Erro', 'Não foi possível deletar a conversa.');
    }
  }, []);

  // Fechar modal
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  // Render item
  const renderItem = useCallback(
    ({ item }: { item: ChatConversation }) => (
      <SessionItem
        conversation={item}
        onPress={() => handleOpenConversation(item.id)}
        onDelete={() => handleDeleteConversation(item.id)}
        colors={colors}
      />
    ),
    [colors, handleOpenConversation, handleDeleteConversation]
  );

  const keyExtractor = useCallback((item: ChatConversation) => item.id, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.canvas }]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={
          isDark
            ? [ColorTokens.primary[900], ColorTokens.primary[800]]
            : [ColorTokens.primary[500], ColorTokens.secondary[500]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <IconButton
            icon={<X size={24} color={ColorTokens.neutral[0]} />}
            onPress={handleClose}
            accessibilityLabel="Fechar"
            variant="ghost"
            size="md"
          />

          <View style={styles.headerTitle}>
            <Text
              variant="body"
              size="xl"
              weight="bold"
              style={{ color: ColorTokens.neutral[0] }}
            >
              Conversas
            </Text>
            <Text
              variant="caption"
              size="sm"
              style={{ color: `${ColorTokens.neutral[0]}CC`, marginTop: 2 }}
            >
              {conversations.length}{' '}
              {conversations.length === 1 ? 'conversa' : 'conversas'}
            </Text>
          </View>

          {/* Placeholder para manter alinhamento */}
          <View style={{ width: 44 }} />
        </View>
      </LinearGradient>

      {/* Lista de conversas */}
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          conversations.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadConversations(true)}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState colors={colors} onStartFirstConversation={handleNewConversation} />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
      />

      {/* Botão Nova Conversa */}
      <Animated.View
        entering={FadeIn.delay(300)}
        style={[
          styles.fabContainer,
          { bottom: insets.bottom + Spacing['4'] },
        ]}
      >
        <TouchableOpacity
          onPress={handleNewConversation}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Nova conversa"
          accessibilityHint="Criar uma nova conversa com a NathIA"
          style={styles.fab}
        >
          <LinearGradient
            colors={[ColorTokens.primary[500], ColorTokens.secondary[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Plus size={24} color={ColorTokens.neutral[0]} strokeWidth={2.5} />
            <Text
              variant="body"
              size="md"
              weight="semibold"
              style={{ color: ColorTokens.neutral[0], marginLeft: Spacing['2'] }}
            >
              Nova conversa
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Spacing['4'],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['2'],
  },
  headerTitle: {
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing['4'],
    paddingBottom: 120, // Espaço para o FAB
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing['4'],
    borderRadius: Radius['2xl'],
    borderWidth: 1,
  },
  sessionAvatar: {
    position: 'relative',
    marginRight: Spacing['3'],
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  sessionContent: {
    flex: 1,
    marginRight: Spacing['2'],
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing['2'],
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing['2'],
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['6'],
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing['6'],
    paddingVertical: Spacing['3.5'],
    paddingHorizontal: Spacing['6'],
    borderRadius: Radius.xl,
    minHeight: 52, // WCAG AAA touch target
    elevation: 4,
    shadowColor: ColorTokens.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabContainer: {
    position: 'absolute',
    left: Spacing['4'],
    right: Spacing['4'],
    alignItems: 'center',
  },
  fab: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    elevation: 8,
    shadowColor: ColorTokens.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['6'],
    minHeight: 56,
  },
});

