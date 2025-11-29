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
import { FlatList, RefreshControl, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Moon, Star, Sparkles, Search, ArrowRight, Zap } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { SectionLayout } from '@/components/templates/SectionLayout';
import { MaternalCard } from '@/components/organisms/MaternalCard';
import { EmotionalPrompt, type EmotionValue } from '@/components/molecules/EmotionalPrompt';
import { SkeletonCard, SkeletonGroup } from '@/components/primitives/Skeleton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { profileService } from '@/services/profileService';
import { feedService, type ContentItem } from '@/services/feedService';
import { habitsService, type UserHabit } from '@/services/habitsService';
import { checkInService } from '@/services/checkInService';
import { Spacing, Typography, Tokens, Shadows } from '@/theme/tokens';
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
  const { colors, isDark } = useTheme();

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
  const [dailyTip, setDailyTip] = useState<{ text: string; emoji: string }>({ text: 'Lembre-se: você está fazendo o seu melhor.', emoji: '💛' });

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
        { text: 'Lembre-se: você está fazendo o seu melhor.', emoji: '💛' },
        { text: 'Cuide-se para cuidar melhor. Você merece!', emoji: '💙' },
        { text: 'Cada mãe tem seu ritmo. Respeite o seu.', emoji: '🌸' },
        { text: 'Não existe mãe perfeita. Existe a mãe que ama.', emoji: '💕' },
        { text: 'Peça ajuda quando precisar. É sinal de força!', emoji: '💪' },
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
      <View style={{ flex: 1, backgroundColor: colors.background.canvas, padding: Spacing['4'] }}>
        {/* Skeleton Hero Banner */}
        <SkeletonCard height={200} animated showImage />
        
        {/* Skeleton CTA */}
        <View style={{ marginTop: Spacing['4'] }}>
          <SkeletonCard height={100} animated showImage={false} />
        </View>
        
        {/* Skeleton Emotional Check-in */}
        <View style={{ marginTop: Spacing['4'] }}>
          <SkeletonGroup lines={1} lineHeight={24} />
          <View style={{ flexDirection: 'row', gap: Spacing['3'], marginTop: Spacing['3'] }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.border.light }} />
            ))}
          </View>
        </View>
        
        {/* Skeleton Content Cards */}
        <View style={{ marginTop: Spacing['4'] }}>
          <SkeletonGroup lines={1} lineHeight={20} />
          <View style={{ flexDirection: 'row', gap: Spacing['3'], marginTop: Spacing['3'] }}>
            <SkeletonCard height={140} animated />
            <SkeletonCard height={140} animated />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScreenLayout
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary.main} />}
    >
      {/* Theme Toggle - Topo direito */}
      <Box px="4" pt="2" style={{ alignItems: 'flex-end' }}>
        <ThemeToggle size="md" />
      </Box>

      {/* Seção 1: Hero Banner Expansivo - Altura 320px, bordas 40px (inspirado no projeto Web) */}
      <Box px="5" pt="3" pb="0" style={{ marginBottom: -Spacing['9'] }}>
        <Box
          style={{
            height: 320, // ⭐ Aumentado de 200px para 320px (expansivo como Web)
            borderRadius: 40, // ⭐ Bordas mais arredondadas (40px ao invés de 24px)
            overflow: 'hidden',
            backgroundColor: isDark 
              ? colors.raw?.accent?.orange + '30' || '#FFE5D9' // Warm background com opacity
              : colors.background.card, // Light mode usa card
            position: 'relative',
            ...Shadows.lg, // Shadow premium
          }}
        >
          <ImageBackground
            source={{ uri: "https://i.imgur.com/GDYdiuy.jpg" }}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              padding: Spacing['6'], // ⭐ Padding mais generoso
            }}
            resizeMode="cover"
          >
            {/* ⭐ TEXTO ESCURO com tipografia mais impactante */}
            <Heading 
              level="h1"
              weight="bold" 
              style={{
                fontSize: 40, // ⭐ Tamanho maior (text-5xl equivalente)
                lineHeight: 44,
                color: isDark ? colors.text.inverse : colors.text.primary, // Texto escuro no peach, claro no light
                letterSpacing: -0.5, // Tracking tight
              }}
            >
              {getTimeBasedGreeting()}, {userName}{' '}
              <Text style={{ fontSize: 36 }}>💙</Text>
            </Heading>
            <Text 
              style={{
                fontSize: Typography.sizes.xl, // ⭐ Tamanho maior
                lineHeight: Typography.lineHeights.xl * Typography.sizes.xl,
                marginTop: Spacing['2'],
                color: isDark ? colors.text.secondary : colors.text.secondary, // Slate secundário
                fontWeight: Typography.weights.semibold,
              }}
            >
              Tô aqui com você. Hoje você não está sozinha.
            </Text>
          </ImageBackground>
        </Box>
      </Box>

      {/* Seção 2: Card NathIA Expandido - Múltiplas camadas, input simulado (inspirado no projeto Web) */}
      <Box px="5" pt="3" style={{ marginTop: Spacing['9'] }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          activeOpacity={0.95}
          accessibilityRole="button"
          accessibilityLabel="Abrir conversa com NathIA - assistente de apoio emocional"
        >
          <Box
            rounded="3xl"
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 36, // ⭐ Bordas muito arredondadas (36px)
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border.light,
              ...Shadows.lg,
            }}
          >
            {/* Decorative blob background */}
            <Box
              style={{
                position: 'absolute',
                top: -32,
                right: -32,
                width: 128,
                height: 128,
                borderRadius: 64,
                backgroundColor: isDark 
                  ? `${colors.primary.main}15` // 8% opacity
                  : `${colors.primary.main}10`,
              }}
            />
            
            {/* Conteúdo do card */}
            <LinearGradient
              colors={isDark 
                ? [colors.secondary.light + '15', colors.background.card] 
                : [colors.background.card, colors.background.card]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: Spacing['6'] }}
            >
              {/* Header com ícone e título */}
              <Box direction="row" align="center" justify="space-between" mb="4">
                <Box direction="row" align="center" style={{ gap: Spacing['4'] }}>
                  {/* ⭐ Ícone com gradiente próprio */}
                  <Box
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 20,
                      backgroundColor: isDark ? colors.primary.main : colors.primary.light,
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...Shadows.md,
                    }}
                  >
                    <Sparkles size={28} color={colors.text.inverse} strokeWidth={2.5} />
                  </Box>
                  <Box>
                    <Heading 
                      level="h3" 
                      weight="bold"
                      style={{ 
                        fontSize: 20, // ⭐ Tamanho maior
                        lineHeight: 24,
                        color: colors.text.primary,
                      }}
                    >
                      NathIA
                    </Heading>
                    <Text 
                      size="sm" 
                      color="secondary"
                      weight="medium"
                      style={{ marginTop: Spacing['1'] }}
                    >
                      Tire suas dúvidas agora
                    </Text>
                  </Box>
                </Box>
                {/* Arrow icon */}
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.background.elevated,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ArrowRight size={20} color={colors.text.secondary} />
                </Box>
              </Box>

              {/* ⭐ Input simulado dentro do card (inspirado no Web) */}
              <Box
                style={{
                  backgroundColor: colors.background.canvas,
                  borderRadius: 16,
                  padding: Spacing['4'],
                  borderWidth: 1,
                  borderColor: isDark ? colors.border.light : colors.border.medium,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box direction="row" align="center" style={{ gap: Spacing['3'], flex: 1 }}>
                  <Search size={20} color={colors.text.tertiary} />
                  <Text 
                    size="sm" 
                    color="tertiary"
                    weight="medium"
                    style={{ flex: 1 }}
                  >
                    Sobre sono, cólica ou amamentação...
                  </Text>
                </Box>
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.secondary.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Zap size={16} color={colors.text.secondary} fill={colors.text.secondary} />
                </Box>
              </Box>
            </LinearGradient>
          </Box>
        </TouchableOpacity>
      </Box>

      {/* Seção 3: Check-in emocional - Espaçamento generoso (inspirado no Web) */}
      <Box px="5" py="3" style={{ marginTop: Spacing['10'] }}>
        <Box style={{ marginBottom: Spacing['6'] }}>
          <Heading 
            level="h3"
            weight="black"
            style={{ 
              fontSize: 24, // ⭐ Tamanho maior (text-2xl)
              lineHeight: 28,
              color: colors.text.primary,
              marginBottom: Spacing['1'],
            }}
          >
            Como você tá hoje?
          </Heading>
          <Text 
            size="sm" 
            color="secondary"
            weight="medium"
          >
            Seu bem-estar importa muito.
          </Text>
        </Box>
        <EmotionalPrompt
          selectedEmotion={todayEmotion}
          onSelect={handleEmotionSelect}
        />
      </Box>

      {/* Seção 4: Destaques - Carousel de conteúdo exclusivo */}
      {highlights.length > 0 && (
        <SectionLayout
          title={
            <>
              <Text style={{ fontSize: Typography.sizes.xl * 0.7 }}>⭐</Text>
              {' '}Destaques
            </>
          }
          containerStyle={{ paddingTop: Spacing['1'], paddingBottom: Spacing['2'] }}
        >
          <FlatList
            horizontal
            data={highlights}
            keyExtractor={(item) => `highlight-${item.id}`}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
            contentContainerStyle={{ paddingHorizontal: Spacing['4'], gap: Spacing['3'] }}
            renderItem={({ item }) => (
              <MaternalCard
                variant="content"
                size="lg"
                title={item.title}
                image={item.thumbnail_url}
                badge="EXCLUSIVO"
                badgeType="exclusive"
                warmBackground={true}
                onPress={() => handleContentOpen(item.id)}
                accessibilityLabel={`Conteúdo em destaque: ${item.title}`}
                style={{ width: 280, borderRadius: Tokens.radius['2xl'] }}
              />
            )}
          />
        </SectionLayout>
      )}

      {/* Seção 5: Dica do Dia - Card azul sólido, estrela top-left (inspirado no projeto Web) */}
      <Box px="5" py="3">
        <Box
          style={{ 
            borderRadius: 32, // ⭐ Bordas mais arredondadas (32px)
            overflow: 'hidden',
            minHeight: 140, // ⭐ Altura maior
            ...Shadows.lg,
          }}
        >
          {/* ⭐ Azul sólido vibrante (não gradiente forte) */}
          <Box
            style={{
              backgroundColor: colors.raw?.info?.[500] || colors.status.info, // Azul do design system
              padding: Spacing['6'], // ⭐ Padding generoso
            }}
          >
            <Box direction="row" align="center" mb="4">
              {/* ⭐ ESTRELA AMARELA no top-left (inspirado no Web) */}
              <Star 
                size={24} // ⭐ Tamanho maior
                color={colors.status.warning} 
                fill={colors.status.warning} 
                style={{ marginRight: Spacing['2'] }}
              />
              <Heading 
                level="h4"
                weight="bold"
                style={{ 
                  fontSize: 18,
                  fontWeight: Typography.weights.black,
                  color: colors.text.inverse,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                DICA DO DIA
              </Heading>
            </Box>
            {/* ⭐ TEXTO BRANCO maior e mais legível */}
            <Text 
              style={{ 
                fontSize: Typography.sizes.xl,
                lineHeight: Typography.lineHeights.xl * Typography.sizes.xl,
                color: colors.text.inverse,
                fontWeight: Typography.weights.semibold,
              }}
            >
              {dailyTip.text}{' '}
              <Text style={{ fontSize: Typography.sizes.xl * 0.9 }}>{dailyTip.emoji}</Text>
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Seção 6: Registro de Hoje - Card suave */}
      <Box px="4" py="2">
        <MaternalCard
          variant="insight"
          size="sm"
          emotion="peaceful"
          title="Como você dormiu?"
          subtitle="Registrar agora"
          icon={<Moon size={24} color={colors.text.secondary} />}
          onPress={() => {
            navigation.navigate('Diary');
            logger.info('Navigating to sleep diary', { screen: 'HomeScreen' });
          }}
          accessibilityLabel="Registrar qualidade do sono de hoje"
        />
      </Box>

      {/* Seção 7: Hábitos de hoje - Layout compacto */}
      {userHabits.length > 0 && (
        <SectionLayout 
          title="Hábitos de hoje" 
          containerStyle={{ paddingTop: Spacing['2'], paddingBottom: Spacing['1'] }}
        >
          <FlatList
            horizontal
            data={userHabits}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
            contentContainerStyle={{ paddingHorizontal: Spacing['4'], gap: Spacing['3'] }}
            renderItem={({ item }) => (
              <MaternalCard
                variant="progress"
                size="sm"
                title={item.custom_name || item.habit?.name || 'Hábito'}
                progress={item.today_completed ? 100 : 0}
                streak={item.current_streak || 0}
                isCompleted={item.today_completed}
                onPress={() => handleHabitToggle(item.id)}
                accessibilityLabel={`Hábito ${item.custom_name || item.habit?.name}, ${
                  item.current_streak || 0
                } dias consecutivos`}
                style={{ width: 180 }}
              />
            )}
          />
        </SectionLayout>
      )}

      {/* Seção 8: Mundo Nath pra você - Feed personalizado */}
      {recommendedContent.length > 0 && (
        <SectionLayout
          title="Mundo Nath pra você"
          actionLabel="Ver tudo"
          onActionPress={() => navigation.navigate('MundoNath')}
          containerStyle={{ paddingTop: Spacing['3'], paddingBottom: Spacing['2'] }}
        >
          <FlatList
            horizontal
            data={recommendedContent}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
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
                style={{ width: 240 }}
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
