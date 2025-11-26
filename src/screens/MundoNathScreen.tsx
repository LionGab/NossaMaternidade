import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { ScrollView as HorizontalScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Sparkles,
  PlayCircle,
  FileText,
  Mic,
  Video,
  ChevronRight,
  Sun,
  Moon,
  Wind,
  MessageCircleHeart,
  ArrowRight,
  Flame,
} from 'lucide-react-native';
import { MOCK_POSTS } from '../constants/data';
import { useTheme, type ThemeColors } from '../theme/ThemeContext';
import { Tokens } from '../theme/tokens';
import { useHaptics } from '../hooks/useHaptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { HeroBanner } from '@/components/molecules/HeroBanner';
import { logger } from '../utils/logger';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MundoNath'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const AVATAR_URL = 'https://i.imgur.com/tNIrNIs.jpg';

interface QuickActionCardProps {
  id: string;
  type: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  bgColor: string;
  badge?: { text: string; bg: string; textColor: string };
  actionColor: string;
  onPress: () => void;
  colors: ThemeColors;
  isDark: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  action,
  icon: Icon,
  iconColor,
  bgColor,
  badge,
  actionColor,
  onPress,
  colors,
  isDark,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.quickActionCard,
        {
          backgroundColor: colors.background.card,
          borderColor: isDark ? colors.border.light : 'transparent',
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint={`Toque para ${action.toLowerCase()}`}
    >
      <View style={styles.quickActionHeader}>
        <View style={[styles.quickActionIconContainer, { backgroundColor: bgColor }]}>
          <Icon size={24} color={iconColor} />
        </View>
        {badge && (
          <View style={[styles.quickActionBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.quickActionBadgeText, { color: badge.textColor }]}>{badge.text}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>{title}</Text>
      <Text style={[styles.quickActionDescription, { color: colors.text.secondary }]}>{description}</Text>
      <View style={styles.quickActionFooter}>
        <Text style={[styles.quickActionButton, { color: actionColor }]}>{action}</Text>
        <ArrowRight size={16} color={actionColor} />
      </View>
    </TouchableOpacity>
  );
};

interface ContentCardProps {
  item: typeof MOCK_POSTS[0];
  colors: ThemeColors;
  onPress?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, colors, onPress }) => {
  const getIconForType = () => {
    switch (item.type.toLowerCase()) {
      case 'video':
        return <Video size={12} color="white" />;
      case 'article':
      case 'text':
        return <FileText size={12} color="white" />;
      case 'audio':
        return <Mic size={12} color="white" />;
      case 'reels':
        return <PlayCircle size={12} color="white" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.contentCard, { backgroundColor: colors.background.card }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. Tipo: ${item.type}. ${item.isNew ? 'Novo conteúdo' : ''}`}
      accessibilityHint="Toque para ver este conteúdo"
    >
      <View style={[styles.contentImageContainer, { backgroundColor: colors.border.medium }]}>
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.contentImage}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
        />
        <View style={[styles.contentTypeBadge, { backgroundColor: `${colors.text.primary}80` }]}>
          {getIconForType()}
          <Text style={[styles.contentTypeText, { color: colors.text.inverse }]}>{item.type}</Text>
        </View>
        {item.isNew && (
          <View style={[styles.contentNewBadge, { backgroundColor: colors.raw.accent.pink, shadowColor: colors.text.primary }]}>
            <Text style={[styles.contentNewText, { color: colors.text.inverse }]}>NOVO</Text>
          </View>
        )}
      </View>
      <View style={styles.contentInfo}>
        <Text style={[styles.contentTitle, { color: colors.text.primary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.contentFooter}>
          <Text style={[styles.contentAction, { color: colors.primary.main }]}>Ver agora</Text>
          <ChevronRight size={12} color={colors.primary.main} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MundoNathScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark, toggleTheme } = useTheme();
  const haptics = useHaptics();
  const [userName, setUserName] = useState('Mãe');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('nath_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserName(parsedUser.name || 'Mãe');
        } catch {
          setUserName('Mãe');
        }
      }
    } catch {
      setUserName('Mãe');
    }
  };

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const quickActions = useMemo(
    () => [
      {
        id: 'chat',
        type: 'chat',
        title: 'Como você tá se sentindo?',
        description: 'Desabafa comigo. Eu tô aqui pra te ouvir sem julgamentos.',
        action: 'Conversar agora',
        icon: MessageCircleHeart,
        iconColor: colors.primary.main,
        bgColor: isDark ? colors.background.canvas : colors.primary.light,
        badge: { text: 'Online agora', bg: colors.primary.light, textColor: colors.status.success },
        actionColor: colors.primary.main,
        onPress: () => {
          haptics.light();
          navigation.navigate('Chat' as never);
        },
      },
      {
        id: 'ritual',
        type: 'ritual',
        title: 'Crise de ansiedade?',
        description: 'Vamos respirar juntas. Um ritual rápido pra acalmar o coração.',
        action: 'Começar ritual',
        icon: Wind,
        iconColor: colors.raw.accent.purple,
        bgColor: isDark ? colors.background.canvas : colors.primary.light,
        badge: { text: '3 min', bg: colors.primary.light, textColor: colors.raw.accent.purple },
        actionColor: colors.raw.accent.purple,
        onPress: () => {
          haptics.light();
          navigation.navigate('Ritual' as never);
        },
      },
    ],
    [isDark, colors, navigation, haptics]
  );

  const handleWaitlistPress = useCallback(() => {
    haptics.light();
    Linking.openURL('https://forms.gle/waitlist').catch((err) => logger.error('Erro ao abrir link', err));
  }, [haptics]);

  const renderQuickAction = useCallback(
    (item: typeof quickActions[0]) => (
      <QuickActionCard key={item.id} {...item} colors={colors} isDark={isDark} />
    ),
    [colors, isDark]
  );

  const renderContent = useCallback(
    (item: typeof MOCK_POSTS[0]) => <ContentCard key={item.id} item={item} colors={colors} />,
    [colors]
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background.canvas }]}
      edges={['top']}
      accessible={true}
      accessibilityLabel="Tela Mundo Nath - Conteúdo exclusivo"
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView className="flex-1" contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Tokens.spacing['3'] }}>
            <Image
              source={{ uri: AVATAR_URL }}
              style={[styles.headerAvatar, { borderColor: `${colors.raw.accent.pink}66` }]}
              contentFit="cover"
              transition={200}
              accessibilityLabel="Avatar Mundo Nath"
            />
            <View>
              <View style={styles.greetingRow}>
                <Text style={[styles.greeting, { color: colors.text.secondary }]}>{getGreeting()},</Text>
                <Sparkles size={14} color={colors.raw.accent.pink} />
              </View>
              <Text style={[styles.userName, { color: colors.text.primary }]}>{userName}</Text>
            </View>
          </View>

          {/* Premium Glass Theme Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              {
                backgroundColor: isDark ? `${colors.text.inverse}1A` : `${colors.text.primary}0D`,
                borderWidth: 1,
                borderColor: isDark ? `${colors.text.inverse}33` : colors.border.light,
                shadowColor: isDark ? colors.primary.main : colors.status.warning,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? (
              <Sun size={22} color={colors.status.warning} strokeWidth={2.5} />
            ) : (
              <Moon size={22} color={colors.primary.main} strokeWidth={2.5} fill={colors.primary.main} />
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Banner - Mundo Nath */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <HeroBanner
            imageUrl="https://i.imgur.com/5TMe7xW.png"
            height={200}
            overlay={{ type: 'gradient', direction: 'bottom', opacity: 0.4 }}
            borderRadius="3xl"
            accessibilityLabel="Banner do Mundo Nath com conteúdo exclusivo"
          />
        </View>

        {/* Hoje eu tô com você Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Hoje eu tô com você</Text>
            <TouchableOpacity accessibilityRole="button"
              onPress={() => {
                haptics.light();
                navigation.navigate('Chat' as never);
              }}
            >
              <Text style={[styles.sectionLink, { color: colors.primary.main }]}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <HorizontalScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {quickActions.map(renderQuickAction)}
          </HorizontalScrollView>
        </View>

        {/* Mundo Nath Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Mundo Nath</Text>
              <View style={[styles.exclusiveBadge, { backgroundColor: `${colors.raw.accent.pink}33` }]}>
                <Text style={[styles.exclusiveText, { color: colors.raw.accent.pink }]}>Exclusivo</Text>
              </View>
            </View>
          </View>

          <HorizontalScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {MOCK_POSTS.map(renderContent)}
          </HorizontalScrollView>
        </View>

        {/* Waitlist Banner */}
        <View style={styles.section}>
          <View
            style={[
              styles.waitlistBanner,
              {
                backgroundColor: isDark ? colors.background.card : colors.text.primary,
              },
            ]}
          >
            <View style={[styles.waitlistDecoration1, { backgroundColor: `${colors.raw.accent.pink}33` }]} />
            <View style={[styles.waitlistDecoration2, { backgroundColor: `${colors.primary.main}33` }]} />

            <View style={styles.waitlistHeader}>
              <Flame size={20} color={colors.raw.accent.pink} />
              <Text style={[styles.waitlistLabel, { color: colors.raw.accent.pink }]}>Em breve</Text>
            </View>

            <Text style={[styles.waitlistTitle, { color: colors.text.inverse }]}>Comunidade MãesValente</Text>
            <Text style={[styles.waitlistDescription, { color: colors.text.secondary }]}>
              Um espaço seguro para trocar experiências com outras mães que te entendem de verdade.
            </Text>

            <TouchableOpacity
              style={[styles.waitlistButton, { backgroundColor: colors.background.card }]}
              onPress={handleWaitlistPress}
              accessibilityRole="button"
              accessibilityLabel="Entrar na lista de espera"
            >
              <Text style={[styles.waitlistButtonText, { color: colors.text.primary }]}>Entrar na lista de espera</Text>
              <ArrowRight size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Espaço para tab bar (não há token para 120)
  },
  header: {
    paddingHorizontal: Tokens.spacing['6'],
    paddingTop: Tokens.spacing['6'],
    paddingBottom: Tokens.spacing['4'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
    marginBottom: Tokens.spacing['1'],
  },
  greeting: {
    fontSize: Tokens.typography.sizes.sm,
    fontWeight: Tokens.typography.weights.medium,
  },
  userName: {
    fontSize: Tokens.typography.sizes['2xl'],
    fontWeight: Tokens.typography.weights.bold,
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
  },
  themeButton: {
    padding: Tokens.spacing['2'],
    borderRadius: Tokens.radius.xl,
    shadowOffset: { width: 0, height: Tokens.spacing['px'] },
    shadowOpacity: 0.05,
    shadowRadius: Tokens.spacing['0.5'],
    elevation: 1,
  },
  section: {
    paddingHorizontal: Tokens.spacing['6'],
    marginBottom: Tokens.spacing['8'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Tokens.spacing['4'],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
  },
  sectionTitle: {
    fontSize: Tokens.typography.sizes.lg,
    fontWeight: Tokens.typography.weights.bold,
  },
  sectionLink: {
    fontSize: Tokens.typography.sizes.sm,
    fontWeight: Tokens.typography.weights.medium,
  },
  exclusiveBadge: {
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['0.5'],
    borderRadius: Tokens.radius.sm,
  },
  exclusiveText: {
    fontSize: Tokens.typography.sizes['2xs'],
    fontWeight: Tokens.typography.weights.bold,
    textTransform: 'uppercase',
  },
  horizontalScroll: {
    paddingLeft: Tokens.spacing['6'],
    paddingRight: Tokens.spacing['2'],
    marginLeft: -Tokens.spacing['6'],
  },
  quickActionCard: {
    marginRight: Tokens.spacing['4'],
    width: 288,
    padding: Tokens.spacing['5'],
    borderRadius: Tokens.radius['3xl'],
    shadowOffset: { width: 0, height: Tokens.spacing['px'] },
    shadowOpacity: 0.05,
    shadowRadius: Tokens.spacing['0.5'],
    elevation: 1,
    borderWidth: 1,
  },
  quickActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Tokens.spacing['4'],
  },
  quickActionIconContainer: {
    padding: Tokens.spacing['3'],
    borderRadius: Tokens.radius.xl,
  },
  quickActionBadge: {
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['1'],
    borderRadius: Tokens.radius.xl,
  },
  quickActionBadgeText: {
    fontSize: Tokens.typography.sizes['2xs'],
    fontWeight: Tokens.typography.weights.bold,
    textTransform: 'uppercase',
  },
  quickActionTitle: {
    fontSize: Tokens.typography.sizes.lg,
    fontWeight: Tokens.typography.weights.bold,
    marginBottom: Tokens.spacing['1'],
  },
  quickActionDescription: {
    fontSize: Tokens.typography.sizes.sm,
    marginBottom: Tokens.spacing['4'],
  },
  quickActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
  },
  quickActionButton: {
    fontWeight: Tokens.typography.weights.bold,
    fontSize: Tokens.typography.sizes.sm,
  },
  contentCard: {
    marginRight: Tokens.spacing['4'],
    width: 240,
    borderRadius: Tokens.radius['3xl'],
    overflow: 'hidden',
    shadowOffset: { width: 0, height: Tokens.spacing['px'] },
    shadowOpacity: 0.05,
    shadowRadius: Tokens.spacing['0.5'],
    elevation: 1,
  },
  contentImageContainer: {
    height: 128,
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  contentTypeBadge: {
    position: 'absolute',
    top: Tokens.spacing['3'],
    left: Tokens.spacing['3'],
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['1'],
    borderRadius: Tokens.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['1'],
  },
  contentTypeText: {
    fontSize: Tokens.typography.sizes['2xs'],
    fontWeight: Tokens.typography.weights.medium,
  },
  contentNewBadge: {
    position: 'absolute',
    top: Tokens.spacing['3'],
    right: Tokens.spacing['3'],
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['1'],
    borderRadius: Tokens.radius.md,
    shadowOffset: { width: 0, height: Tokens.spacing['px'] },
    shadowOpacity: 0.1,
    shadowRadius: Tokens.spacing['0.5'],
    elevation: 1,
  },
  contentNewText: {
    fontSize: Tokens.typography.sizes['2xs'],
    fontWeight: Tokens.typography.weights.bold,
  },
  contentInfo: {
    padding: Tokens.spacing['4'],
  },
  contentTitle: {
    fontWeight: Tokens.typography.weights.bold,
    fontSize: Tokens.typography.sizes.base,
    lineHeight: Tokens.typography.lineHeights.sm,
    marginBottom: Tokens.spacing['2'],
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
  },
  contentAction: {
    fontSize: Tokens.typography.sizes.xs,
    fontWeight: Tokens.typography.weights.bold,
  },
  waitlistBanner: {
    borderRadius: Tokens.radius['3xl'],
    padding: Tokens.spacing['6'],
    position: 'relative',
    overflow: 'hidden',
  },
  waitlistDecoration1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    borderRadius: 64,
    marginRight: -Tokens.spacing['10'],
    marginTop: -Tokens.spacing['10'],
  },
  waitlistDecoration2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    borderRadius: 48,
    marginLeft: -Tokens.spacing['10'],
    marginBottom: -Tokens.spacing['10'],
  },
  waitlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
    marginBottom: Tokens.spacing['2'],
  },
  waitlistLabel: {
    fontWeight: Tokens.typography.weights.bold,
    fontSize: Tokens.typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: Tokens.typography.letterSpacing.widest,
  },
  waitlistTitle: {
    fontSize: Tokens.typography.sizes.xl,
    fontWeight: Tokens.typography.weights.bold,
    marginBottom: Tokens.spacing['2'],
  },
  waitlistDescription: {
    fontSize: Tokens.typography.sizes.sm,
    marginBottom: Tokens.spacing['6'],
    lineHeight: Tokens.typography.lineHeights.sm,
  },
  waitlistButton: {
    width: '100%',
    paddingVertical: Tokens.spacing['3'],
    borderRadius: Tokens.radius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Tokens.spacing['2'],
  },
  waitlistButtonText: {
    fontWeight: Tokens.typography.weights.bold,
  },
});
