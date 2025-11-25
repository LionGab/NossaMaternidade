import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  PlayCircle,
  FileText,
  Mic,
  Video,
  ChevronRight,
  Sun,
  Moon,
  Wind,
  BedDouble,
  MessageCircleHeart,
  ArrowRight,
  Heart,
  Baby,
  TrendingUp,
  Settings,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme, type ThemeColors } from '../theme/ThemeContext';
import { Tokens } from '../theme/tokens';
import { profileService } from '../services/profileService';
import { feedService, ContentItem } from '../services/feedService';
import { habitsService, UserHabit } from '../services/habitsService';
import { milestonesService } from '../services/milestonesService';
import { useHaptics } from '../hooks/useHaptics';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/* -------------------------------------------------------------------------- */
/*                                   HEADER                                   */
/* -------------------------------------------------------------------------- */

interface HomeHeaderProps {
  userName: string;
  avatarUrl?: string;
  isDark: boolean;
  colors: ThemeColors;
  onToggleTheme: () => void;
  navigation: NavigationProp;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  avatarUrl,
  isDark,
  colors,
  onToggleTheme,
  navigation,
}) => {
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.headerContainer}>
      <View accessible accessibilityRole="header" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 44, height: 44, borderRadius: 10 }}
          contentFit="cover"
          transition={200}
          accessibilityLabel="Logo Nossa Maternidade"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} accessibilityLabel={`Olá, ${userName}`}>
            Oi, {userName}.
          </Text>
          <View style={styles.headerSubtitleRow}>
            <Text style={styles.headerSubtitle} accessibilityLabel="Tô aqui com você">
              Tô aqui com você 💙
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings' as never)}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
        >
          <Settings size={18} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onToggleTheme}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {isDark ? (
            <Sun size={18} color={colors.status.warning} />
          ) : (
            <Moon size={18} color={colors.text.primary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.avatarButton, { borderColor: colors.primary.main }]}
          accessibilityRole="button"
          accessibilityLabel="Foto de perfil"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary.light }]}>
              <Text style={{ color: colors.text.primary, fontSize: 18 }}>👤</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  CARDS                                     */
/* -------------------------------------------------------------------------- */

interface SleepCardProps {
  colors: ThemeColors;
  onPress: () => void;
}

const SleepCard: React.FC<SleepCardProps> = ({ colors, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={sleepCardStyles.container}
    activeOpacity={0.9}
    accessibilityRole="button"
    accessibilityLabel="Como você dormiu hoje?"
  >
    <Image
      source={{ uri: 'https://i.imgur.com/JQagI8x.jpg' }}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      contentPosition="center"
      transition={200}
    />
    <LinearGradient
      colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
      style={StyleSheet.absoluteFill}
    />
    <View style={sleepCardStyles.content}>
      <View style={sleepCardStyles.topRow}>
        <View style={sleepCardStyles.iconContainer}>
          <BedDouble size={18} color="#FFFFFF" />
        </View>
        <View style={sleepCardStyles.badge}>
          <Text style={sleepCardStyles.badgeText}>MATERNIDADE REAL</Text>
        </View>
      </View>
      <View>
        <Text style={sleepCardStyles.title}>Como você dormiu hoje?</Text>
        <View style={sleepCardStyles.ctaRow}>
          <Text style={sleepCardStyles.ctaText}>Toque para registrar</Text>
          <ChevronRight size={14} color="#E0F2FE" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const sleepCardStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    color: '#E0F2FE',
    fontSize: 12,
    fontWeight: '500',
  },
});

interface BreathingCardProps {
  colors: ThemeColors;
  onPress: () => void;
}

const BreathingCard: React.FC<BreathingCardProps> = ({ colors, onPress }) => (
  <LinearGradient
    colors={[...colors.primary.gradient] as [string, string, ...string[]]}
    style={breathingCardStyles.container}
  >
    <View style={breathingCardStyles.iconContainer}>
      <Wind size={20} color="#FFFFFF" />
    </View>
    <Text style={breathingCardStyles.title}>Percebi que você tá mais ansiosa.</Text>
    <Text style={breathingCardStyles.subtitle}>
      Quer respirar 1 minuto comigo pra desacelerar?
    </Text>
    <TouchableOpacity
      onPress={onPress}
      style={breathingCardStyles.button}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Começar respiração agora"
    >
      <Text style={[breathingCardStyles.buttonText, { color: colors.primary.main }]}>
        Começar agora
      </Text>
      <ArrowRight size={14} color={colors.primary.main} />
    </TouchableOpacity>
  </LinearGradient>
);

const breathingCardStyles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 13,
  },
});

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colors: ThemeColors;
  onPress: () => void;
  iconBgColor: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  subtitle,
  colors,
  onPress,
  iconBgColor,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      quickActionStyles.container,
      {
        borderColor: colors.border.light,
        backgroundColor: colors.background.card,
      },
    ]}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${subtitle}`}
  >
    <View style={[quickActionStyles.iconContainer, { backgroundColor: iconBgColor }]}>
      {icon}
    </View>
    <Text style={[quickActionStyles.title, { color: colors.text.primary }]}>{title}</Text>
    <Text style={[quickActionStyles.subtitle, { color: colors.text.secondary }]}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

const quickActionStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
  },
});

interface HabitCardProps {
  habit: UserHabit;
  index: number;
  colors: ThemeColors;
  onPress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, index, colors, onPress }) => {
  const habitName = habit.custom_name || habit.habit?.name || 'Hábito';
  const streak = habit.current_streak || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        habitCardStyles.container,
        {
          borderColor: colors.border.light,
          backgroundColor: colors.background.card,
          marginLeft: index > 0 ? 12 : 0,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Hábito: ${habitName}`}
    >
      <View
        style={[
          habitCardStyles.iconContainer,
          { backgroundColor: habit.habit?.color || '#6DA9E4' },
        ]}
      >
        {habit.today_completed ? (
          <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Heart size={16} color="#FFFFFF" />
        )}
      </View>
      <Text style={[habitCardStyles.title, { color: colors.text.primary }]}>{habitName}</Text>
      <Text style={[habitCardStyles.subtitle, { color: colors.text.secondary }]}>
        {habit.today_completed ? '✓ Completado' : `Streak: ${streak}`}
      </Text>
    </TouchableOpacity>
  );
};

const habitCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
  },
});

interface MilestoneCardProps {
  progress: number;
  colors: ThemeColors;
  onPress: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ progress, colors, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      milestoneCardStyles.container,
      {
        borderColor: colors.border.light,
        backgroundColor: colors.background.card,
      },
    ]}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`Marcos do bebê. ${progress}% concluído`}
  >
    <View style={milestoneCardStyles.content}>
      <View style={milestoneCardStyles.leftContent}>
        <View style={milestoneCardStyles.titleRow}>
          <Baby size={18} color="#10B981" />
          <Text style={[milestoneCardStyles.title, { color: colors.text.primary }]}>
            Marcos do bebê
          </Text>
        </View>
        <Text style={[milestoneCardStyles.subtitle, { color: colors.text.secondary }]}>
          {progress}% concluído
        </Text>
      </View>
      <View style={milestoneCardStyles.badge}>
        <TrendingUp size={12} color="#FFFFFF" />
        <Text style={milestoneCardStyles.badgeText}>{progress}%</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const milestoneCardStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 10,
  },
  badge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

interface ContentCardProps {
  item: ContentItem;
  colors: ThemeColors;
  onPress: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, colors, onPress }) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'reels':
        return <Video size={12} color="#FFFFFF" />;
      case 'audio':
        return <Mic size={12} color="#FFFFFF" />;
      case 'video':
        return <PlayCircle size={12} color="#FFFFFF" />;
      default:
        return <FileText size={12} color="#FFFFFF" />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        contentCardStyles.container,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.light,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}`}
    >
      <View style={[contentCardStyles.imageContainer, { backgroundColor: colors.border.light }]}>
        <Image
          source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/200x112' }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <View style={contentCardStyles.typeBadge}>{getIconForType(item.type)}</View>
        <View style={contentCardStyles.nathBadge}>
          <Text style={contentCardStyles.nathText}>Nath </Text>
          <Heart size={8} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      </View>
      <View style={contentCardStyles.textContainer}>
        <Text
          style={[contentCardStyles.title, { color: colors.text.primary }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[contentCardStyles.author, { color: colors.text.secondary }]}>
          {item.author_name || 'Toque para ver'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const contentCardStyles = StyleSheet.create({
  container: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 16,
  },
  imageContainer: {
    height: 112,
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 6,
  },
  nathBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nathText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 18,
  },
  author: {
    fontSize: 10,
  },
});

/* -------------------------------------------------------------------------- */
/*                                HOME SCREEN                                 */
/* -------------------------------------------------------------------------- */

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const haptics = useHaptics();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('mãe');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
  const [milestoneProgress, setMilestoneProgress] = useState(0);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const handleNavigate = useCallback(
    (screen: keyof RootStackParamList | keyof MainTabParamList) => {
      try {
        haptics.light();
        navigation.navigate(screen as never);
      } catch (error) {
        console.error(`Erro ao navegar para ${screen}:`, error);
      }
    },
    [navigation, haptics]
  );

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);
      const [profile, content, habits, progress] = await Promise.all([
        profileService.getCurrentProfile(),
        feedService.getRecommendedContent(6),
        habitsService.getUserHabits(),
        milestonesService.getMilestoneProgress(),
      ]);

      if (profile) {
        setUserName(profile.full_name?.split(' ')[0] || 'mãe');
        setAvatarUrl(profile.avatar_url);
      }
      setRecommendedContent(content || []);
      setUserHabits((habits || []).slice(0, 2));
      setMilestoneProgress(progress?.progress_percentage || 0);
    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    haptics.light();
    loadHomeData();
  }, [loadHomeData, haptics]);

  const renderContentCard = useCallback(
    ({ item }: { item: ContentItem }) => (
      <ContentCard
        item={item}
        colors={colors}
        onPress={() => handleNavigate('MundoNath')}
      />
    ),
    [colors, handleNavigate]
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background.canvas }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </SafeAreaView>
    );
  }

  const hasHabits = userHabits.length > 0;
  const hasRecommendedContent = recommendedContent.length > 0;
  const hasMilestones = milestoneProgress > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.canvas }]}>
      <HomeHeader
        userName={userName}
        avatarUrl={avatarUrl}
        isDark={isDark}
        colors={colors}
        onToggleTheme={toggleTheme}
        navigation={navigation}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        <View style={styles.mainContainer}>
          {/* SECTION: HOJE EU TÔ COM VOCÊ */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Hoje eu tô com você
            </Text>
            <View style={styles.sectionBadge}>
              <Wind size={10} color="#FFFFFF" />
              <Text style={styles.sectionBadgeText}>30s para você</Text>
            </View>
          </View>

          <SleepCard colors={colors} onPress={() => handleNavigate('Diary')} />

          <BreathingCard colors={colors} onPress={() => handleNavigate('Ritual')} />

          <View style={styles.quickActionsRow}>
            <QuickActionCard
              icon={<MessageCircleHeart size={16} color="#A855F7" strokeWidth={2.5} />}
              title="Conversar"
              subtitle="NathIA"
              colors={colors}
              onPress={() => handleNavigate('Chat')}
              iconBgColor={isDark ? 'rgba(168, 85, 247, 0.2)' : '#F3E8FF'}
            />
            <View style={{ width: 12 }} />
            <QuickActionCard
              icon={<Heart size={16} color="#EC4899" strokeWidth={2.5} />}
              title="Comunidade"
              subtitle="Mães Valentes"
              colors={colors}
              onPress={() => handleNavigate('MaesValentes')}
              iconBgColor={isDark ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3'}
            />
          </View>

          {hasHabits && (
            <View style={styles.habitsRow}>
              {userHabits.map((habit, index) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  index={index}
                  colors={colors}
                  onPress={() => handleNavigate('Habitos')}
                />
              ))}
            </View>
          )}

          {hasMilestones && (
            <MilestoneCard
              progress={milestoneProgress}
              colors={colors}
              onPress={() => {}}
            />
          )}

          {/* SECTION: MUNDO NATH */}
          {hasRecommendedContent && (
            <View style={styles.mundoNathSection}>
              <View style={styles.mundoNathHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Mundo Nath
                </Text>
                <TouchableOpacity
                  onPress={() => handleNavigate('MundoNath')}
                  style={styles.verTudoButton}
                >
                  <Text style={[styles.verTudoText, { color: colors.primary.main }]}>
                    Ver tudo
                  </Text>
                  <ChevronRight size={14} color={colors.primary.main} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.contentListContainer}
              >
                {recommendedContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    colors={colors}
                    onPress={() => handleNavigate('MundoNath')}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    mainContainer: {
      paddingHorizontal: Tokens.spacing['4'],
      paddingTop: Tokens.spacing['4'],
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Tokens.spacing['4'],
      paddingVertical: Tokens.spacing['3'],
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text.primary,
    },
    headerSubtitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary.main,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.canvas,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    avatarButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 2,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    sectionBadge: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    sectionBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    quickActionsRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    habitsRow: {
      flexDirection: 'row',
    },
    mundoNathSection: {
      marginTop: 24,
    },
    mundoNathHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    verTudoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    verTudoText: {
      fontSize: 12,
      fontWeight: '700',
    },
    contentListContainer: {
      height: 200,
    },
  });
