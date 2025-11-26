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
import { MessageCircleHeart, Moon, TrendingUp, Heart, Sparkles, Star } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { SectionLayout } from '@/components/templates/SectionLayout';
import { MaternalCard } from '@/components/organisms/MaternalCard';
import { EmotionalPrompt, type EmotionValue } from '@/components/molecules/EmotionalPrompt';
import { HeroBanner } from '@/components/molecules/HeroBanner';
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
  const [highlights, setHighlights] = useState<ContentItem[]>([]);
  const [dailyTip, setDailyTip] = useState<string>('Lembre-se: você está fazendo o seu melhor. 💛');

  // ======================
  // 🕐 TIME-BASED GREETING (Web Reference)
  // ======================

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

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

      // Fetch highlights/featured content (max 3)
      const highlightsData = await feedService.getRecommendedContent(3);
      if (highlightsData) {
        setHighlights(highlightsData);
      }

      // TODO: Fetch daily tip from backend
      // For now using static tip
      const tips = [
        'Lembre-se: você está fazendo o seu melhor. 💛',
        'Cuide-se para cuidar melhor. Você merece! 💙',
        'Cada mãe tem seu ritmo. Respeite o seu. 🌸',
        'Não existe mãe perfeita. Existe a mãe que ama. 💕',
        'Peça ajuda quando precisar. É sinal de força! 💪',
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setDailyTip(randomTip);

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
      {/* Seção 1: Hero Banner com Saudação - REDESIGN: imersivo e acolhedor */}
      <Box px="4" pt="6" pb="4">
        <HeroBanner
          imageUrl="https://i.imgur.com/GDYdiuy.jpg"
          height={200}
          overlay={{ type: 'gradient', direction: 'bottom', opacity: 0.6 }}
          borderRadius="3xl"
          accessibilityLabel="Imagem de boas-vindas do Nossa Maternidade"
        >
          <Heading level="h2" color="inverse">
            {getTimeBasedGreeting()}, {userName} 💙
          </Heading>
          <Text color="inverse" size="md" style={{ marginTop: Spacing['2'] }}>
            Tô aqui com você. Hoje você não está sozinha.
          </Text>
        </HeroBanner>
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

      {/* Seção 3: Destaques - Carousel de conteúdo exclusivo (Web Reference) */}
      {highlights.length > 0 && (
        <SectionLayout
          title="⭐ Destaques"
          containerStyle={{ paddingTop: Spacing['2'] }}
        >
          <FlatList
            horizontal
            data={highlights}
            keyExtractor={(item) => `highlight-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing['4'], gap: Spacing['3'] }}
            renderItem={({ item }) => (
              <MaternalCard
                variant="content"
                size="lg"
                title={item.title}
                image={item.thumbnail_url}
                badge="Exclusivo"
                onPress={() => handleContentOpen(item.id)}
                accessibilityLabel={`Conteúdo em destaque: ${item.title}`}
                style={{ width: 280 }}
              />
            )}
          />
        </SectionLayout>
      )}

      {/* Seção 4: Check-in emocional - REDESIGN: mais destaque vertical */}
      <Box px="4" py="4">
        <EmotionalPrompt
          title="Como você tá hoje?"
          selectedEmotion={todayEmotion}
          onSelect={handleEmotionSelect}
        />
      </Box>

      {/* Seção 5: Dica do Dia - Com heart animation (Web Reference) */}
      <Box px="4" py="2">
        <Box
          style={{
            backgroundColor: colors.background.card,
            borderRadius: Spacing['4'],
            padding: Spacing['4'],
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Box style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['2'] }}>
            <Heart size={20} color="#FF6B9D" fill="#FF6B9D" />
            <Heading level="h4" style={{ marginLeft: Spacing['2'] }}>
              Dica do Dia
            </Heading>
          </Box>
          <Text size="md" color="secondary" style={{ lineHeight: 22 }}>
            {dailyTip}
          </Text>
        </Box>
      </Box>

      {/* Seção 6: Registro de Hoje - REDESIGN: verde menta suave, ícone menos gritante */}
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

      {/* Seção 7: Hábitos de hoje - REDESIGN: menos espaço (complemento, não concorrência) */}
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

      {/* Seção 8: Mundo Nath pra você */}
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
