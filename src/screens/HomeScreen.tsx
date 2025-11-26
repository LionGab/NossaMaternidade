/**
 * HomeScreen - "O Melhor Possível"
 * Promessa: "Aqui é seguro, aqui você pertence."
 *
 * Estrutura:
 * 1. Saudação personalizada
 * 2. Hero CTA - Conversar com NathIA
 * 3. Check-in emocional (5 emojis)
 * 4. Registro de Hoje (diário de sono)
 * 5. Hábitos de hoje (max 3 cards)
 * 6. Mundo Nath pra você (max 3 conteúdos)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MessageCircleHeart, Moon, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { SectionLayout } from '@/components/templates/SectionLayout';
import { MaternalCard } from '@/components/organisms/MaternalCard';
import { EmotionalPrompt, type EmotionValue } from '@/components/molecules/EmotionalPrompt';
import { profileService } from '@/services/profileService';
import { feedService, type ContentItem } from '@/services/feedService';
import { habitsService, type UserHabit } from '@/services/habitsService';
import { checkInService } from '@/services/checkInService';
import { Spacing } from '@/theme/tokens';
import { logger } from '@/utils/logger';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

// ======================
// 🎯 TYPES
// ======================

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// ======================
// 🏠 HOME SCREEN
// ======================

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  // ======================
  // 📊 STATE
  // ======================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('mãe');
  const [todayEmotion, setTodayEmotion] = useState<EmotionValue | undefined>();
  const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);

  // ======================
  // 🔄 DATA FETCHING
  // ======================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profile = await profileService.getCurrentProfile();
      if (profile) {
        // Prioriza display_name (do onboarding) sobre full_name
        setUserName(profile.display_name || profile.full_name || 'mãe');
      }

      // Fetch habits (max 3)
      const habits = await habitsService.getUserHabits();
      if (habits) {
        setUserHabits(habits.slice(0, 3));
      }

      // Fetch recommended content (max 3)
      const content = await feedService.getRecommendedContent(3);
      if (content) {
        setRecommendedContent(content);
      }

      // Load today's emotion from backend
      const todayEmotionValue = await checkInService.getTodayEmotion();
      if (todayEmotionValue) {
        setTodayEmotion(todayEmotionValue);
      }
    } catch (error) {
      logger.error('Failed to load HomeScreen data', error, { screen: 'HomeScreen' });
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

  // ======================
  // 🎯 HANDLERS
  // ======================

  const handleEmotionSelect = useCallback(async (emotion: EmotionValue) => {
    setTodayEmotion(emotion);

    // Send emotion to backend
    const success = await checkInService.logEmotion(emotion);

    if (success) {
      logger.info('Emotion logged successfully', { screen: 'HomeScreen', emotion });
    } else {
      logger.error('Failed to log emotion', null, { screen: 'HomeScreen', emotion });
    }
  }, []);

  const handleHabitToggle = useCallback(async (habitId: string) => {
    // Optimistic update - toggle UI immediately
    setUserHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              today_completed: !habit.today_completed,
              current_streak: !habit.today_completed ? (habit.current_streak || 0) + 1 : Math.max((habit.current_streak || 0) - 1, 0),
            }
          : habit
      )
    );

    // Toggle on backend
    const success = await habitsService.toggleHabitCompletion(habitId);

    if (success) {
      logger.info('Habit toggled successfully', { screen: 'HomeScreen', habitId });
    } else {
      logger.error('Failed to toggle habit', null, { screen: 'HomeScreen', habitId });
      // Revert optimistic update on failure
      await loadData();
    }
  }, [loadData]);

  const handleContentOpen = useCallback(
    (contentId: string) => {
      navigation.navigate('ContentDetail', { contentId });
      logger.info('Navigating to content detail', { screen: 'HomeScreen', contentId });
    },
    [navigation]
  );

  // ======================
  // 🎨 RENDER
  // ======================

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.canvas }}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <ScreenLayout
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary.main} />}
    >
      {/* Seção 1: Saudação personalizada - REDESIGN: mais respiro */}
      <Box px="4" pt="6" pb="4">
        <Heading level="h2" color="primary">
          Oi, {userName} 💙
        </Heading>
        <Text color="secondary" size="md" style={{ marginTop: Spacing['2'] }}>
          Tô aqui com você. Hoje você não está sozinha.
        </Text>
      </Box>

      {/* Seção 2: Hero CTA - Conversar com NathIA - REDESIGN: reduzir tamanho */}
      <Box px="4" py="2">
        <MaternalCard
          variant="hero"
          size="lg"
          emotion="warm"
          title="Conversar com NathIA"
          subtitle="Fale comigo, sem julgamentos."
          icon={<MessageCircleHeart size={40} color="#FFFFFF" />}
          onPress={() => navigation.navigate('Chat')}
          accessibilityLabel="Abrir conversa com NathIA - assistente de apoio emocional"
        />
      </Box>

      {/* Seção 3: Check-in emocional - REDESIGN: mais destaque vertical */}
      <Box px="4" py="4">
        <EmotionalPrompt
          title="Como você tá hoje?"
          selectedEmotion={todayEmotion}
          onSelect={handleEmotionSelect}
        />
      </Box>

      {/* Seção 4: Registro de Hoje - REDESIGN: verde menta suave, ícone menos gritante */}
      <Box px="4" py="2">
        <MaternalCard
          variant="insight"
          size="md"
          emotion="peaceful"
          title="Como você dormiu?"
          subtitle="Registrar agora"
          icon={<Moon size={28} color={colors.text.secondary} />}
          onPress={() => {
            navigation.navigate('Diary');
            logger.info('Navigating to sleep diary', { screen: 'HomeScreen' });
          }}
          accessibilityLabel="Registrar qualidade do sono de hoje"
        />
      </Box>

      {/* Seção 5: Hábitos de hoje - REDESIGN: menos espaço (complemento, não concorrência) */}
      {userHabits.length > 0 && (
        <SectionLayout title="Hábitos de hoje" containerStyle={{ paddingTop: Spacing['3'] }}>
          <FlatList
            horizontal
            data={userHabits}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing['4'], gap: Spacing['3'] }}
            renderItem={({ item }) => (
              <MaternalCard
                variant="progress"
                size="md"
                title={item.custom_name || item.habit?.name || 'Hábito'}
                progress={item.today_completed ? 100 : 0}
                streak={item.current_streak || 0}
                isCompleted={item.today_completed}
                onPress={() => handleHabitToggle(item.id)}
                accessibilityLabel={`Hábito ${item.custom_name || item.habit?.name}, ${
                  item.current_streak || 0
                } dias consecutivos`}
                style={{ width: 200 }}
              />
            )}
          />
        </SectionLayout>
      )}

      {/* Seção 6: Mundo Nath pra você */}
      {recommendedContent.length > 0 && (
        <SectionLayout
          title="Mundo Nath pra você"
          actionLabel="Ver tudo"
          onActionPress={() => navigation.navigate('MundoNath')}
          containerStyle={{ paddingTop: Spacing['4'] }}
        >
          <FlatList
            horizontal
            data={recommendedContent}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing['4'], gap: Spacing['3'] }}
            renderItem={({ item }) => (
              <MaternalCard
                variant="content"
                size="md"
                title={item.title}
                image={item.thumbnail_url}
                badge={item.type === 'video' ? 'Novo' : undefined}
                onPress={() => handleContentOpen(item.id)}
                accessibilityLabel={`Conteúdo: ${item.title}, tipo ${item.type}`}
              />
            )}
          />
        </SectionLayout>
      )}

      {/* Espaçamento final */}
      <Box style={{ height: Spacing['6'] }} />
    </ScreenLayout>
  );
}
