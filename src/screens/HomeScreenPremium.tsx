/**
 * HomeScreenPremium - Tela Principal (Painel do Dia)
 *
 * Design Flo/Calm inspired com arquitetura de 4 blocos:
 * - BLOCO 0: Header (Saudação + Perfil)
 * - BLOCO 1: NathIA Card (CTA único)
 * - BLOCO 2: Meus Cuidados Hoje (TodayCareCard)
 * - BLOCO 3: Atalhos do dia (DailyShortcutsSection)
 * - BLOCO 4: Inspiração do dia (DailyInspirationCard)
 *
 * @version 3.0.0 - Redesign com hooks e componentes modulares
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  MessageCircle,
  BookOpen,
  Users,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SOSMaeFloatingButton } from '@/components/sos';
import { Text } from '@/components/atoms/Text';
import { TodayCareCard } from '@/components/home/TodayCareCard';
import { DailyShortcutsSection, type ShortcutItem } from '@/components/home/DailyShortcutsSection';
import { DailyInspirationCard } from '@/components/home/DailyInspirationCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTodayHabitsSummary } from '@/hooks/useTodayHabitsSummary';
import { useDailyInspiration } from '@/hooks/useDailyInspiration';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';
import { PlatformNavigation } from '@/theme/platform';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Saudações por período do dia
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomeScreenPremium() {
  const navigation = useNavigation<NavigationProp>();
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  // Hooks de dados
  const { profile, refetch: refetchProfile } = useUserProfile();
  const { totalHabits, completedHabits, refetch: refetchHabits } = useTodayHabitsSummary();
  const { quote, refetch: refetchQuote, isLoading: isLoadingQuote } = useDailyInspiration();

  // Estado de refresh
  const refreshing = useRef(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    refreshing.current = true;
    await Promise.all([refetchProfile(), refetchHabits()]);
    refreshing.current = false;
  }, [refetchProfile, refetchHabits]);

  // ========================================
  // Navegação
  // ========================================
  const navigateToChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Chat', { context: 'welcome' });
  }, [navigation]);

  const navigateToHabits = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Habitos');
  }, [navigation]);

  const navigateToCommunity = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('MaesValentes');
  }, [navigation]);

  const navigateToMundoNath = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('MundoNath');
  }, [navigation]);

  const navigateToDiary = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Diary');
  }, [navigation]);

  const navigateToProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Profile');
  }, [navigation]);

  // ========================================
  // Atalhos do dia
  // ========================================
  const shortcuts: ShortcutItem[] = [
    {
      id: 'diary',
      icon: BookOpen,
      title: 'Meu Diário',
      description: 'Registrar meus sentimentos',
      color: colors.status.warning,
      onPress: navigateToDiary,
    },
    {
      id: 'community',
      icon: Users,
      title: 'Mães Valentes',
      description: 'Ver o que outras mães estão sentindo',
      color: colors.secondary.main,
      onPress: navigateToCommunity,
    },
    {
      id: 'mundo-nath',
      icon: Sparkles,
      title: 'Mundo da Nath',
      description: 'Ver rituais e conteúdos',
      color: colors.primary.main,
      onPress: navigateToMundoNath,
    },
  ];

  // ========================================
  // Formatação
  // ========================================
  const userName = profile?.name?.split(' ')[0] || 'amiga';
  const greeting = getGreeting();
  const tabBarHeight = PlatformNavigation.tabBarHeight;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Background Gradient Sutil */}
      <LinearGradient
        colors={
          isDark
            ? [colors.background.canvas, colors.background.canvas]
            : [
                colors.background.canvas,
                colors.background.canvas,
                `${colors.primary.light}08`,
              ]
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing['5'],
          paddingBottom: insets.bottom + tabBarHeight + Spacing['8'],
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing.current}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ========================================
              BLOCO 0: Header (Saudação + Perfil) - REDESENHADO
          ======================================== */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['8'] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: Spacing['4'] }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text.tertiary,
                    marginBottom: Spacing['1'],
                    letterSpacing: 0.3,
                  }}
                >
                  {greeting}
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: colors.text.primary,
                    letterSpacing: -0.5,
                    lineHeight: 38,
                  }}
                >
                  {userName}
                </Text>
              </View>

              {/* Profile + Theme Toggle - Redesenhado */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] }}>
                <TouchableOpacity
                  onPress={toggleTheme}
                  accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.background.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(isDark
                      ? {
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 3,
                          elevation: 2,
                        }
                      : {
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1,
                        }),
                  }}
                >
                  {isDark ? <Sun size={18} color={colors.text.primary} /> : <Moon size={18} color={colors.text.primary} />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={navigateToProfile}
                  accessibilityLabel="Abrir perfil"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.primary.main,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    shadowColor: colors.primary.main,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  {profile?.avatarUrl ? (
                    <Image
                      source={{ uri: profile.avatarUrl }}
                      style={{ width: 44, height: 44 }}
                      contentFit="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFF' }}>
                      {userName[0]?.toUpperCase()}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ========================================
              BLOCO 1: NathIA Card - REDESENHADO
          ======================================== */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <TouchableOpacity
              onPress={navigateToChat}
              activeOpacity={0.95}
              accessibilityLabel="Falar com a NathIA"
              accessibilityHint="Abre o chat com a NathIA"
              style={{
                backgroundColor: colors.background.card,
                borderRadius: Radius['3xl'],
                padding: Spacing['6'],
                shadowColor: isDark ? '#000' : colors.primary.main,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.3 : 0.12,
                shadowRadius: 16,
                elevation: 4,
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? 'transparent' : `${colors.primary.light}30`,
              }}
            >
              {/* Gradient overlay sutil */}
              <LinearGradient
                colors={[`${colors.primary.main}08`, `${colors.secondary.main}05`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: Radius['3xl'],
                }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing['4'] }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.primary.light + '30',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Spacing['4'],
                    borderWidth: 2,
                    borderColor: colors.primary.main + '20',
                  }}
                >
                  <Image
                    source={{ uri: 'https://i.imgur.com/oB9ewPG.jpg' }}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                    contentFit="cover"
                  />
                  {/* Badge Online */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: colors.status.success,
                      borderWidth: 2,
                      borderColor: colors.background.card,
                    }}
                  />
                </View>

                <View style={{ flex: 1, paddingTop: Spacing['1'] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['1'] }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: colors.text.primary,
                        letterSpacing: -0.3,
                      }}
                    >
                      NathIA
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text.secondary,
                      letterSpacing: 0.2,
                    }}
                  >
                    Sua bestie de bolso • Online agora
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 15,
                  color: colors.text.primary,
                  lineHeight: 22,
                  marginBottom: Spacing['5'],
                  letterSpacing: 0.1,
                }}
              >
                Oi, {userName}! Como você está se sentindo hoje? Tô aqui pra te ouvir 💕
              </Text>

              {/* CTA Único - Redesenhado */}
              <TouchableOpacity
                onPress={navigateToChat}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.main,
                  paddingVertical: Spacing['4'],
                  borderRadius: Radius.full,
                  gap: Spacing['2'],
                  minHeight: 52,
                  shadowColor: colors.primary.main,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <MessageCircle size={20} color="#FFF" strokeWidth={2.5} />
                <Text
                  style={{
                    color: '#FFF',
                    fontWeight: '600',
                    fontSize: 15,
                    letterSpacing: 0.2,
                  }}
                >
                  Falar com a NathIA
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* ========================================
              BLOCO 2: Meus Cuidados Hoje
          ======================================== */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <TodayCareCard
              totalHabits={totalHabits}
              completedHabits={completedHabits}
              onViewHabits={navigateToHabits}
              onCreateHabit={navigateToHabits}
            />
          </View>

          {/* ========================================
              BLOCO 3: Atalhos do dia
          ======================================== */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['6'] }}>
            <DailyShortcutsSection shortcuts={shortcuts} />
          </View>

          {/* ========================================
              BLOCO 4: Inspiração do dia
          ======================================== */}
          <View style={{ paddingHorizontal: Spacing['6'], marginBottom: Spacing['5'] }}>
            <DailyInspirationCard
              quote={quote}
              onRequestNewQuote={refetchQuote}
              isLoading={isLoadingQuote}
            />
          </View>

        </Animated.View>
      </ScrollView>

      {/* SOS Button */}
      <SOSMaeFloatingButton />
    </View>
  );
}
