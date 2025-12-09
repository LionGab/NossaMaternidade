/**
 * MundoNathScreen - Tela de conteúdo exclusivo da Nathália
 * 
 * Redesenhado conforme Style Guide Blue Version
 * - Primary Blue: #0070F3 (Trust & Action)
 * - Primary Pink: #FF0080 (Brand Accent)
 * - Gradientes: Cotton Background, Blue Action Gradient
 * - Cards: rounded-3xl, shadow-sm, border-gray-100
 * 
 * @version 2.0.0 - Blue Version Style Guide
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Play, Sparkles, Video as VideoIcon } from 'lucide-react-native';
import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/primitives/Button';
import { Text } from '@/components/atoms/Text';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  FeaturedVideo,
  ContentCategorySection,
  ForYouSection,
  ReelsPlayer,
} from '@/components/mundo-nath';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens, Spacing, Radius, Shadows } from '@/theme/tokens';
import { logger } from '@/utils/logger';
import type { ContentItem } from '@/types/content';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Style Guide Colors - Blue Version
const STYLE_GUIDE = {
  primaryPink: '#FF0080',
  primaryBlue: '#0070F3',
  backgroundSoft: '#FDF4F9',
  cottonGradient: ['#FFF0F5', '#F0F7FF'] as const,
  blueActionGradient: ['#0070F3', '#00C6FF'] as const,
  pinkBlueGradient: ['#FF0080', '#0070F3'] as const,
  success: '#22c55e',
  warning: '#ca8a04',
};

// Mock data para conteúdo com reels
const MOCK_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'content-1',
    title: 'Como lidar com os primeiros dias',
    description:
      'Dicas práticas para atravessar os momentos mais desafiadores da maternidade inicial.',
    type: 'article',
    category: 'pos_parto',
    duration: '5 min',
    views: 1234,
  },
  {
    id: 'content-2',
    title: 'Meditação para noites difíceis',
    description:
      'Um momento de paz para quando tudo parecer demais. Respire fundo e se permitir sentir.',
    type: 'audio',
    category: 'saude_mental',
    duration: '8 min',
    views: 987,
  },
  {
    id: 'reels-1',
    title: 'Dica rápida: Autocuidado em 60s',
    description: 'Um minuto para você se reconectar',
    type: 'reels',
    category: 'autocuidado',
    duration: '60s',
    views: 5432,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://i.imgur.com/tNIrNIs.jpg',
  },
];

// Hook para animações escalonadas
function useStaggeredAnimations(itemCount: number, baseDelay = 100) {
  const animations = useRef(
    Array.from({ length: itemCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 500,
          delay: index * baseDelay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 600,
          delay: index * baseDelay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(baseDelay, staggeredAnimations).start();
  }, [animations, baseDelay]);

  return animations;
}

export default function MundoNathScreen() {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // Animações: header (0), featured card (1), reels (2), featured video (3), section header (4)
  const animations = useStaggeredAnimations(5, 120);

  // Animação do avatar (scale + fade)
  const avatarScale = useRef(new Animated.Value(0)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarScale, {
        toValue: 1,
        delay: 200,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(avatarOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [avatarScale, avatarOpacity]);

  const handleContentPress = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info('Content pressed', { itemId, screen: 'MundoNathScreen' });
  };

  const handleRitualPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Ritual');
  };

  const handleVideoPlay = () => {
    logger.info('Featured video played', { screen: 'MundoNathScreen' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: STYLE_GUIDE.backgroundSoft }} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Tokens.spacing['10'] }}
      >
        {/* Header com gradiente Cotton Background */}
        <View style={{ position: 'relative', overflow: 'hidden' }}>
          <LinearGradient
            colors={STYLE_GUIDE.cottonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              paddingTop: insets.top + Spacing['4'],
              paddingBottom: Spacing['8'],
              paddingHorizontal: Spacing['6'],
            }}
          >
            {/* Theme Toggle */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + Spacing['4'],
                right: Spacing['6'],
                zIndex: 10,
              }}
            >
              <ThemeToggle variant="outline" iconColor={ColorTokens.neutral[900]} />
            </View>

            {/* Avatar da Nathália - Animado */}
            <Animated.View
              style={{
                alignItems: 'center',
                marginTop: Spacing['4'],
                opacity: avatarOpacity,
                transform: [{ scale: avatarScale }],
              }}
            >
              <Avatar
                size={80}
                source={{ uri: 'https://i.imgur.com/tNIrNIs.jpg' }}
                fallback="NV"
                borderWidth={3}
                borderColor={STYLE_GUIDE.primaryPink}
                style={{
                  backgroundColor: `${STYLE_GUIDE.primaryPink}20`,
                }}
              />
            </Animated.View>

            {/* Título e subtítulo - Animado */}
            <Animated.View
              style={{
                alignItems: 'center',
                marginTop: Spacing['4'],
                opacity: animations[0].opacity,
                transform: [{ translateY: animations[0].translateY }],
              }}
            >
              <Text
                size="2xl"
                weight="bold"
                style={{
                  color: ColorTokens.neutral[900],
                  marginBottom: Spacing['2'],
                  fontSize: Tokens.typography.sizes['2xl'],
                }}
              >
                Mundo da Nath
              </Text>
              <Text
                size="sm"
                style={{
                  color: ColorTokens.neutral[700],
                }}
              >
                Conteúdo exclusivo pra você ✨
              </Text>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Content */}
        <Box px="6" style={{ gap: Spacing['6'], marginTop: -Spacing['6'] }}>
          {/* Featured Card - Ritual de 3 Minutos - Style Guide */}
          <Animated.View
            style={{
              borderRadius: Radius['3xl'],
              overflow: 'hidden',
              backgroundColor: ColorTokens.neutral[0],
              borderWidth: 1,
              borderColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[100],
              ...Shadows.sm,
              opacity: animations[1].opacity,
              transform: [{ translateY: animations[1].translateY }],
            }}
          >
            <LinearGradient
              colors={STYLE_GUIDE.pinkBlueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: Spacing['6'],
                gap: Spacing['4'],
              }}
            >
              <Badge
                variant="warning"
                containerStyle={{
                  alignSelf: 'flex-start',
                }}
              >
                ⭐ NOVO
              </Badge>

              <Text
                size="xl"
                weight="bold"
                style={{
                  color: ColorTokens.neutral[0],
                  lineHeight: 28,
                }}
              >
                Ritual de 3 Minutos
              </Text>

              <Text
                size="sm"
                style={{
                  color: `${ColorTokens.neutral[0]}E6`,
                }}
              >
                Reconecte-se com você antes de começar o caos do dia.
              </Text>

              <Button
                variant="primary"
                onPress={handleRitualPress}
                leftIcon={<Play size={16} color={ColorTokens.neutral[0]} />}
                style={{
                  backgroundColor: ColorTokens.neutral[0],
                  borderRadius: Radius.full,
                }}
              >
                <Text size="sm" weight="bold" style={{ color: STYLE_GUIDE.primaryPink }}>
                  Começar Agora
                </Text>
              </Button>
            </LinearGradient>
          </Animated.View>

          {/* Reels Section - Funcional */}
          <Animated.View
            style={{
              opacity: animations[2].opacity,
              transform: [{ translateY: animations[2].translateY }],
            }}
          >
            <Box
              style={{
                backgroundColor: ColorTokens.neutral[0],
                borderRadius: Radius['3xl'],
                borderWidth: 1,
                borderColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[100],
                ...Shadows.sm,
                overflow: 'hidden',
              }}
            >
              <Box
                px="4"
                py="3"
                direction="row"
                align="center"
                justify="space-between"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[100],
                }}
              >
                <Box direction="row" align="center" gap="2">
                  <VideoIcon size={20} color={STYLE_GUIDE.primaryBlue} />
                  <Text size="lg" weight="bold" style={{ color: ColorTokens.neutral[900] }}>
                    Reels
                  </Text>
                </Box>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    logger.info('See all reels pressed');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Ver todos os reels"
                >
                  <Text size="sm" weight="semibold" style={{ color: STYLE_GUIDE.primaryBlue }}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </Box>

              <Box p="4">
                <ReelsPlayer
                  videoUrl={MOCK_CONTENT_ITEMS.find((item) => item.type === 'reels')?.videoUrl || ''}
                  thumbnailUrl={
                    MOCK_CONTENT_ITEMS.find((item) => item.type === 'reels')?.thumbnailUrl
                  }
                  title={MOCK_CONTENT_ITEMS.find((item) => item.type === 'reels')?.title}
                  duration={
                    (() => {
                      const reelItem = MOCK_CONTENT_ITEMS.find((item) => item.type === 'reels');
                      if (reelItem?.duration && typeof reelItem.duration === 'string') {
                        const seconds = parseInt(reelItem.duration.replace('s', ''), 10);
                        return isNaN(seconds) ? undefined : seconds;
                      }
                      return undefined;
                    })()
                  }
                  views={MOCK_CONTENT_ITEMS.find((item) => item.type === 'reels')?.views}
                  height={400}
                  autoPlay={false}
                  onPlay={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    logger.info('Reels played');
                  }}
                />
              </Box>
            </Box>
          </Animated.View>

          {/* Vídeo Especial em Destaque */}
          <Animated.View
            style={{
              opacity: animations[3].opacity,
              transform: [{ translateY: animations[3].translateY }],
            }}
          >
            <FeaturedVideo
              videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              title="O DIA MAIS FELIZ DA MINHA VIDA! 💙"
              description="Um momento especial que marcou profundamente. Uma experiência emocional única e transformadora."
              viewsCount={50000}
              duration={15}
              onPlay={handleVideoPlay}
            />
          </Animated.View>

          {/* Seção: Para Você */}
          <Animated.View
            style={{
              opacity: animations[4].opacity,
              transform: [{ translateY: animations[4].translateY }],
            }}
          >
            <ContentCategorySection
              title="Para Você"
              subtitle="Conteúdo selecionado especialmente"
              icon={<Sparkles size={20} color={STYLE_GUIDE.primaryBlue} />}
              items={MOCK_CONTENT_ITEMS.filter((item) => item.type !== 'reels')}
              onItemPress={(item) => handleContentPress(item.id)}
              onSeeAllPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                logger.info('See all pressed', { screen: 'MundoNathScreen' });
              }}
            />
          </Animated.View>

          {/* Seção: ForYouSection (personalizada com IA) */}
          <ForYouSection
            onItemPress={(item) => handleContentPress(item.id)}
            onSeeAllPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              logger.info('See all personalized pressed', { screen: 'MundoNathScreen' });
            }}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
