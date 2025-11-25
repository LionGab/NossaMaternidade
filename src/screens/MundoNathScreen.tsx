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
import { useHaptics } from '../hooks/useHaptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'MundoNath'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const AVATAR_URL = 'https://i.imgur.com/RRIaE7t.jpg';

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
      <View style={styles.contentImageContainer}>
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.contentImage}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.contentTypeBadge}>
          {getIconForType()}
          <Text style={styles.contentTypeText}>{item.type}</Text>
        </View>
        {item.isNew && (
          <View style={styles.contentNewBadge}>
            <Text style={styles.contentNewText}>NOVO</Text>
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
        iconColor: '#4285F4',
        bgColor: isDark ? colors.background.canvas : '#E8F0FE',
        badge: { text: 'Online agora', bg: '#D1FAE5', textColor: '#047857' },
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
        iconColor: '#9333EA',
        bgColor: isDark ? colors.background.canvas : '#F3E8FF',
        badge: { text: '3 min', bg: '#F3E8FF', textColor: '#7E22CE' },
        actionColor: '#9333EA',
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
    Linking.openURL('https://forms.gle/waitlist').catch((err) => console.error('Erro ao abrir link:', err));
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
          <View>
            <View style={styles.greetingRow}>
              <Text style={[styles.greeting, { color: colors.text.secondary }]}>{getGreeting()},</Text>
              <Sparkles size={14} color="#FF8FA3" />
            </View>
            <Text style={[styles.userName, { color: colors.text.primary }]}>{userName}</Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: colors.background.card }]}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} color="#6B7280" />}
          </TouchableOpacity>
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
              <View style={styles.exclusiveBadge}>
                <Text style={styles.exclusiveText}>Exclusivo</Text>
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
                backgroundColor: isDark ? colors.background.card : '#5D4E4B',
              },
            ]}
          >
            <View style={styles.waitlistDecoration1} />
            <View style={styles.waitlistDecoration2} />

            <View style={styles.waitlistHeader}>
              <Flame size={20} color="#FF8FA3" />
              <Text style={styles.waitlistLabel}>Em breve</Text>
            </View>

            <Text style={styles.waitlistTitle}>Comunidade MãesValente</Text>
            <Text style={styles.waitlistDescription}>
              Um espaço seguro para trocar experiências com outras mães que te entendem de verdade.
            </Text>

            <TouchableOpacity
              style={styles.waitlistButton}
              onPress={handleWaitlistPress}
              accessibilityRole="button"
              accessibilityLabel="Entrar na lista de espera"
            >
              <Text style={styles.waitlistButtonText}>Entrar na lista de espera</Text>
              <ArrowRight size={16} color="#5D4E4B" />
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
    paddingBottom: 120, // Espaço para tab bar
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  exclusiveBadge: {
    backgroundColor: 'rgba(255, 143, 163, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  exclusiveText: {
    color: '#FF8FA3',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    marginLeft: -24,
  },
  quickActionCard: {
    marginRight: 16,
    width: 288,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
  quickActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  quickActionIconContainer: {
    padding: 12,
    borderRadius: 16,
  },
  quickActionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  quickActionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  quickActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionButton: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentCard: {
    marginRight: 16,
    width: 240,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentImageContainer: {
    height: 128,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  contentTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contentTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  contentNewBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF8FA3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contentNewText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentInfo: {
    padding: 16,
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 8,
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentAction: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  waitlistBanner: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  waitlistDecoration1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 143, 163, 0.2)',
    borderRadius: 64,
    marginRight: -40,
    marginTop: -40,
  },
  waitlistDecoration2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    borderRadius: 48,
    marginLeft: -40,
    marginBottom: -40,
  },
  waitlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  waitlistLabel: {
    color: '#FF8FA3',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waitlistTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  waitlistDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  waitlistButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  waitlistButtonText: {
    color: '#5D4E4B',
    fontWeight: 'bold',
  },
});
