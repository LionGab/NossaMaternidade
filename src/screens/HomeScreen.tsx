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
import { FlatList, RefreshControl, ActivityIndicator, View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircleHeart, Moon, TrendingUp, Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HOME_HEIGHT = 200;
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
      {/* Seção 1: Hero Banner Principal - Welcome */}
      <View
        style={homeHeroStyles.heroContainer}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Bem-vinda, ${userName}. Aqui é seguro, aqui você pertence.`}
      >
        <ImageBackground
          source={{ uri: 'https://i.imgur.com/lfX5QdI.jpg' }}
          style={homeHeroStyles.heroImage}
          imageStyle={homeHeroStyles.heroImageStyle}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={homeHeroStyles.heroGradient}
          >
            {/* Badge Nossa Maternidade */}
            <View style={homeHeroStyles.heroBadge}>
              <Sparkles size={12} color="#FFD700" />
              <Text style={homeHeroStyles.heroBadgeText}>NOSSA MATERNIDADE</Text>
            </View>

            <Text style={homeHeroStyles.heroTitle}>Oi, {userName} 💙</Text>
            <Text style={homeHeroStyles.heroSubtitle}>
              Aqui é seguro, aqui você pertence.
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Seção 2: Hero CTA - Conversar com NathIA - REDESIGN: imagem hero imersiva */}
      <Box px="4" py="2">
        <MaternalCard
          variant="hero"
          size="xl"
          emotion="warm"
          heroImage="https://i.imgur.com/t3EFCQT.png"
          title="Conversar com NathIA"
          subtitle="Fale comigo, sem julgamentos."
          icon={<MessageCircleHeart size={32} color="#FFFFFF" />}
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

// ======================
// 🎨 HOME HERO STYLES
// ======================

const homeHeroStyles = StyleSheet.create({
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HOME_HEIGHT,
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 143, 163, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
