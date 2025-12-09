/**
 * HomeScreenPremium - Versão PREMIUM da Home
 * 
 * Tela inicial no estilo Flo/Calm/Clue com:
 * - HomeHeader com saudação personalizada
 * - BestieCard com CTA de áudio
 * - VibeCheckCard com sugestões do dia
 * - SeasonalMissions com chips
 * - NathWorldSection com conteúdo
 * - ImpactSection com estatísticas
 * 
 * @version 1.0.0 - Premium Design
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeAreaContainer } from '@/components/layout/SafeAreaContainer';
import { SOSMaeFloatingButton } from '@/components/sos';
import {
  HomeHeader,
  BestieCard,
  VibeCheckCard,
  SeasonalMissions,
  NathWorldSection,
  ImpactSection,
} from '@/components/home';
import { guiltService } from '@/services/supabase';
import { profileService } from '@/services/supabase';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Tokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';
import type { UserProfile } from '@/types/user';

// Paleta Premium
const PREMIUM_COLORS = {
  fundo_rosado: '#FDF9FB',
  fundo_azulado: '#F3F7FF',
};

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreenPremium() {
  const navigation = useNavigation<NavigationProp>();
  const { colors: _colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streakDays, setStreakDays] = useState<number>(12);
  const [_loading, setLoading] = useState(true);

  // Carregar perfil e stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Carregar perfil
        const currentProfile = await profileService.getCurrentProfile();
        if (currentProfile) {
          setProfile(currentProfile);
        }

        // Carregar stats de streak
        const guiltStats = await guiltService.getStats();
        if (guiltStats?.streakDays) {
          setStreakDays(guiltStats.streakDays);
        }
      } catch (error) {
        logger.error('[HomeScreenPremium] Error loading data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handlers
  const handleAudioPress = useCallback(() => {
    logger.info('[HomeScreenPremium] Audio button pressed');
    navigation.navigate('Chat', {
      sessionId: undefined,
      startRecording: true,
      context: 'welcome',
    });
  }, [navigation]);

  const handleVibeSelect = useCallback(
    (vibe: { emoji: string; title: string }) => {
      logger.info('[HomeScreenPremium] Vibe selected', { vibe });
      // Navegar para chat com contexto de vibe
      navigation.navigate('Chat', {
        sessionId: undefined,
        context: 'welcome',
      });
    },
    [navigation]
  );

  const handleMissionPress = useCallback((mission: string) => {
    logger.info('[HomeScreenPremium] Mission selected', { mission });
    // Implementar navegação para missões
  }, []);

  const handleNathWorldViewAll = useCallback(() => {
    logger.info('[HomeScreenPremium] View all Mundo da Nath');
    navigation.navigate('MundoNath');
  }, [navigation]);

  const handleNathWorldCardPress = useCallback(
    (card: { title: string }) => {
      logger.info('[HomeScreenPremium] NathWorld card pressed', { card });
      navigation.navigate('MundoNath');
    },
    [navigation]
  );

  // Formatar dados do perfil
  const userName = profile?.name?.split(' ')[0] || profile?.display_name || 'amiga';
  const lifeStage = profile?.life_stage_generic
    ? profile.life_stage_generic === 'pregnant'
      ? 'gestante'
      : profile.life_stage_generic === 'has_children'
      ? 'mãe experiente'
      : profile.life_stage_generic === 'trying'
      ? 'tentante'
      : 'virada de ano'
    : 'virada de ano';
  const babyName = profile?.baby_name || undefined;
  const project = 'Projeto África';

  return (
    <SafeAreaContainer edges={['top']} backgroundColor={PREMIUM_COLORS.fundo_rosado}>
      {/* Background gradient */}
      <LinearGradient
        colors={[PREMIUM_COLORS.fundo_rosado, PREMIUM_COLORS.fundo_azulado]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: Tokens.spacing['4'],
          paddingBottom: insets.bottom + Tokens.spacing['6'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader
          userName={userName}
          streakDays={streakDays}
          lifeStage={lifeStage}
          babyName={babyName}
          project={project}
        />

        {/* Bestie de Bolso */}
        <BestieCard onAudioPress={handleAudioPress} />

        {/* Vibe Check de Hoje */}
        <VibeCheckCard onVibeSelect={handleVibeSelect} />

        {/* Missões Sazonais */}
        <SeasonalMissions onMissionPress={handleMissionPress} />

        {/* Mundo da Nath */}
        <NathWorldSection onViewAll={handleNathWorldViewAll} onCardPress={handleNathWorldCardPress} />

        {/* Impacto & Comunidade */}
        <ImpactSection />
      </ScrollView>

      {/* SOS Mãe Floating Button */}
      <SOSMaeFloatingButton />
    </SafeAreaContainer>
  );
}

