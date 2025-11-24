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
import { useTheme } from '../theme/ThemeContext';
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

interface ThemeColors {
  primary: {
    main: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  background: {
    card: string;
  };
  border: {
    light: string;
  };
  // fallback para qualquer outra chave não mapeada
  [key: string]: any;
}

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
}) => (
  <View
    className="px-6 py-4 flex-row justify-between items-center border-b"
    style={[
      styles.headerContainer,
      {
        backgroundColor: isDark ? 'rgba(11, 18, 32, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        borderBottomColor: colors.border.light,
      },
    ]}
  >
    <View accessible accessibilityRole="header">
      <Text
        className="text-xl font-bold leading-tight"
        style={{ color: colors.text.primary }}
        accessibilityLabel={`Olá, ${userName}`}
      >
        Oi, {userName}.
      </Text>
      <View className="flex-row items-center gap-1.5 mt-1">
        <Text
          className="text-sm font-medium"
          style={{ color: colors.primary.main }}
          accessibilityLabel="Tô aqui com você"
        >
          Tô aqui com você 💙
        </Text>
      </View>
    </View>
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Settings' as any);
        }}
        className="w-10 h-10 rounded-full items-center justify-center border"
        style={{
          backgroundColor: isDark ? '#020617' : '#F3F4F6',
          borderColor: colors.border.light,
        }}
        accessibilityRole="button"
        accessibilityLabel="Configurações"
        accessibilityHint="Abre a tela de configurações"
      >
        <Settings size={18} color={colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggleTheme}
        className="w-10 h-10 rounded-full items-center justify-center border"
        style={{
          backgroundColor: isDark ? '#020617' : '#F3F4F6',
          borderColor: colors.border.light,
        }}
        accessibilityRole="button"
        accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        accessibilityHint="Alterna entre tema claro e escuro"
      >
        {isDark ? (
          <Sun size={18} color="#FBBF24" />
        ) : (
          <Moon size={18} color={colors.text.primary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="w-12 h-12 rounded-full overflow-hidden border-2"
        style={{
          backgroundColor: isDark ? colors.border.light : '#E8F0FE',
          borderColor: isDark ? colors.border.light : '#FFFFFF',
        }}
        accessibilityRole="button"
        accessibilityLabel={
          avatarUrl ? `Foto de perfil de ${userName}` : 'Foto de perfil não definida'
        }
        accessibilityHint="Toque para ver seu perfil"
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full"
            contentFit="cover"
            transition={200}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text style={{ color: colors.text.primary }}>👤</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

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
    className="w-full rounded-[22px] overflow-hidden mb-4 shadow-lg"
    style={{ height: 180 }}
    activeOpacity={0.9}
    accessibilityRole="button"
    accessibilityLabel="Como você dormiu hoje? Maternidade real. Toque para registrar"
    accessibilityHint="Abre o diário para registrar como foi seu sono"
  >
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800' }}
      className="w-full h-full"
      contentFit="cover"
      transition={200}
      accessibilityIgnoresInvertColors
    />
    <LinearGradient
      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
      style={StyleSheet.absoluteFill}
    />
    <View className="absolute inset-0 p-5 flex-col justify-between">
      <View className="flex-row justify-between items-start">
        <View className="w-9 h-9 bg-white/10 rounded-full items-center justify-center border border-white/20">
          <BedDouble size={18} color="#FFFFFF" />
        </View>
        <View className="bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
          <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
            Maternidade real
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-xl font-bold text-white mb-0.5 leading-tight">
          Como você dormiu hoje?
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-blue-100 text-xs font-medium opacity-90">
            Toque para registrar
          </Text>
          <ChevronRight size={14} color="#E0F2FE" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

interface BreathingCardProps {
  isDark: boolean;
  colors: ThemeColors;
  onPress: () => void;
}

const BreathingCard: React.FC<BreathingCardProps> = ({ isDark, colors, onPress }) => (
  <LinearGradient
    colors={isDark ? ['#3B82F6', '#1D4ED8'] : ['#6DA9E4', '#3C6AD6']}
    className="rounded-[22px] p-6 mb-4 shadow-xl"
    accessible
    accessibilityLabel="Card de exercício de respiração"
  >
    <View className="relative z-10">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mb-3">
            <Wind size={20} color="#FFFFFF" />
          </View>
          <Text className="text-lg font-bold mb-1 leading-tight text-white">
            Percebi que você tá mais ansiosa.
          </Text>
          <Text className="text-blue-50 text-sm opacity-90 leading-relaxed max-w-[260px]">
            Quer respirar 1 minuto comigo pra desacelerar?
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="mt-4 bg-white px-5 py-3 rounded-xl shadow-sm flex-row items-center justify-center gap-2"
        style={{ alignSelf: 'flex-start' }}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Começar respiração de 1 minuto agora"
        accessibilityHint="Inicia um exercício de respiração guiada"
      >
        <Text className="text-blue-500 font-bold text-xs">Começar agora</Text>
        <ArrowRight size={14} color={colors.primary.main} />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

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
    className="flex-1 border p-4 rounded-2xl"
    style={{ borderColor: colors.border.light, backgroundColor: colors.background.card }}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${subtitle}`}
    accessibilityHint="Toque para abrir"
  >
    <View
      className="w-8 h-8 rounded-full items-center justify-center mb-3"
      style={{ backgroundColor: iconBgColor }}
    >
      {icon}
    </View>
    <Text
      className="font-bold text-sm leading-tight mb-0.5"
      style={{ color: colors.text.primary }}
    >
      {title}
    </Text>
    <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

interface HabitCardProps {
  habit: UserHabit;
  index: number;
  colors: ThemeColors;
  onPress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  index,
  colors,
  onPress,
}) => {
  const habitName = habit.custom_name || habit.habit?.name || 'Hábito';
  const streak = habit.current_streak || 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 border p-4 rounded-2xl"
      style={{
        borderColor: colors.border.light,
        marginLeft: index > 0 ? 12 : 0,
        backgroundColor: colors.background.card,
      }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Hábito: ${habitName}. ${
        habit.today_completed ? 'Completado hoje' : `Sequência atual: ${streak} dias`
      }`}
      accessibilityHint="Toque para gerenciar este hábito"
      accessibilityState={{ selected: habit.today_completed }}
    >
      <View
        className="w-8 h-8 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: habit.habit?.color || '#6DA9E4' }}
      >
        {habit.today_completed ? (
          <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Heart size={16} color="#FFFFFF" />
        )}
      </View>
      <Text
        className="font-bold text-sm leading-tight mb-0.5"
        style={{ color: colors.text.primary }}
      >
        {habitName}
      </Text>
      <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
        {habit.today_completed ? '✓ Completado' : `Streak: ${streak}`}
      </Text>
    </TouchableOpacity>
  );
};

interface MilestoneCardProps {
  progress: number;
  colors: ThemeColors;
  onPress: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  progress,
  colors,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="border p-4 rounded-2xl mt-3"
    style={{
      borderColor: colors.border.light,
      backgroundColor: colors.background.card,
    }}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`Marcos do bebê. ${progress} por cento concluído`}
    accessibilityHint="Toque para ver todos os marcos de desenvolvimento"
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-2">
          <Baby size={18} color="#10B981" />
          <Text
            className="font-bold text-sm"
            style={{ color: colors.text.primary }}
          >
            Marcos do bebê
          </Text>
        </View>
        <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
          {progress}% concluído
        </Text>
      </View>
      <View className="bg-green-500 px-3 py-1.5 rounded-full flex-row items-center gap-1">
        <TrendingUp size={12} color="#FFFFFF" />
        <Text className="text-white text-[10px] font-bold">{progress}%</Text>
      </View>
    </View>
  </TouchableOpacity>
);

interface ContentCardProps {
  item: ContentItem;
  colors: ThemeColors;
  onPress: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  colors,
  onPress,
}) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'reels':
        return <Video size={14} color="#FFFFFF" />;
      case 'audio':
        return <Mic size={14} color="#FFFFFF" />;
      case 'video':
        return <PlayCircle size={14} color="#FFFFFF" />;
      default:
        return <FileText size={14} color="#FFFFFF" />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[200px] rounded-xl overflow-hidden shadow-sm border mr-4"
      style={{
        backgroundColor: colors.background.card,
        borderColor: colors.border.light,
      }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.type}. Por ${
        item.author_name || 'autor desconhecido'
      }`}
      accessibilityHint="Toque para ver detalhes deste conteúdo"
    >
      <View
        className="h-28 relative overflow-hidden"
        style={{ backgroundColor: colors.border.light }}
      >
        <Image
          source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/200' }}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
          accessibilityLabel={`Miniatura do conteúdo: ${item.title}`}
          accessibilityIgnoresInvertColors
        />
        <View
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md flex-row items-center gap-1"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          {getIconForType(item.type)}
        </View>
        <View
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md flex-row items-center gap-0.5"
          style={{ backgroundColor: 'rgba(236, 72, 153, 0.9)' }}
        >
          <Text className="text-white text-[9px] font-bold">Nath </Text>
          <Heart size={8} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      </View>
      <View className="p-3 flex-1">
        <Text
          className="text-sm font-bold leading-snug mb-2"
          numberOfLines={2}
          style={{ color: colors.text.primary }}
        >
          {item.title}
        </Text>
        <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
          {item.author_name || 'Toque para ver'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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

  const isSmallScreen = width < 480;
  const isXL = width >= 1280;

  const containerStyle = useMemo(
    () => ({
      flex: 1,
      maxWidth: isXL ? 1280 : 1100,
      alignSelf: 'center' as const,
      paddingHorizontal: isSmallScreen ? 16 : 24,
    }),
    [isXL, isSmallScreen]
  );

  const handleNavigate = useCallback(
    (screen: keyof RootStackParamList | keyof MainTabParamList) => {
      try {
        haptics.light();
        (navigation as any).navigate(screen);
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
        onPress={() => handleNavigate('Feed')}
      />
    ),
    [colors, handleNavigate]
  );

  const renderHabitCard = useCallback(
    (habit: UserHabit, index: number) => (
      <HabitCard
        habit={habit}
        index={index}
        colors={colors}
        onPress={() => handleNavigate('Habits')}
      />
    ),
    [colors, handleNavigate]
  );

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? '#020617' : '#F8F9FA' }}
        accessible
        accessibilityLabel="Carregando tela inicial"
      >
        <ActivityIndicator
          size="large"
          color={colors.primary.main}
          accessibilityLabel="Carregando conteúdo"
        />
      </SafeAreaView>
    );
  }

  const hasHabits = userHabits.length > 0;
  const hasRecommendedContent = recommendedContent.length > 0;
  const hasMilestones = milestoneProgress > 0;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#020617' : '#F8F9FA' }}
      accessible
      accessibilityLabel="Tela inicial do Nossa Maternidade"
    >
      <HomeHeader
        userName={userName}
        avatarUrl={avatarUrl}
        isDark={isDark}
        colors={colors}
        onToggleTheme={toggleTheme}
        navigation={navigation}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        <View style={containerStyle} className="p-6 space-y-8">
          {/* SECTION: HOJE EU TÔ COM VOCÊ */}

          <View accessible>
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="font-bold text-base"
                style={{ color: colors.text.primary }}
                accessibilityRole="header"
                accessibilityLabel="Seção: Hoje eu tô com você"
              >
                Hoje eu tô com você
              </Text>
              <View
                className="bg-blue-500 px-2 py-0.5 rounded-full flex-row items-center gap-1"
                accessible
                accessibilityLabel="30 segundos para você"
              >
                <Wind size={10} color="#FFFFFF" />
                <Text className="text-white text-[10px] font-bold">
                  30s para você
                </Text>
              </View>
            </View>

            <SleepCard
              colors={colors}
              onPress={() => handleNavigate('Diary')}
            />

            <BreathingCard
              isDark={isDark}
              colors={colors}
              onPress={() => handleNavigate('Ritual')}
            />

            <View className="flex-row gap-3 mb-4">
              <QuickActionCard
                icon={
                  <MessageCircleHeart
                    size={16}
                    color="#A855F7"
                    strokeWidth={2.5}
                  />
                }
                title="Conversar"
                subtitle="MãesValente IA"
                colors={colors}
                onPress={() => handleNavigate('Chat')}
                iconBgColor={
                  isDark ? 'rgba(168, 85, 247, 0.2)' : '#F3E8FF'
                }
              />
              <QuickActionCard
                icon={
                  <Heart size={16} color="#EC4899" strokeWidth={2.5} />
                }
                title="Comunidade"
                subtitle="Mães Valentes"
                colors={colors}
                onPress={() => handleNavigate('Feed')}
                iconBgColor={
                  isDark ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3'
                }
              />
            </View>

            {hasHabits && (
              <View className="flex-row gap-3">
                {userHabits.map((habit, index) =>
                  renderHabitCard(habit, index)
                )}
              </View>
            )}

            {hasMilestones && (
              <MilestoneCard
                progress={milestoneProgress}
                colors={colors}
                onPress={() => {
                  // TODO: Navegar para tela de marcos quando existir
                }}
              />
            )}
          </View>

          {/* SECTION: MUNDO NATH */}

          {hasRecommendedContent && (
            <View>
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text
                  className="font-bold text-base"
                  style={{ color: colors.text.primary }}
                  accessibilityRole="header"
                  accessibilityLabel="Seção: Mundo Nath"
                >
                  Mundo Nath
                </Text>
                <TouchableOpacity
                  onPress={() => handleNavigate('Feed')}
                  accessibilityRole="button"
                  accessibilityLabel="Ver todos os conteúdos do Mundo Nath"
                  accessibilityHint="Abre a lista completa de vídeos, áudios e artigos"
                >
                  <View className="flex-row items-center gap-1">
                    <Text
                      className="text-xs font-bold"
                      style={{ color: colors.primary.main }}
                    >
                      Ver tudo
                    </Text>
                    <ChevronRight
                      size={14}
                      color={colors.primary.main}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <FlashList
                data={recommendedContent}
                renderItem={renderContentCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                accessibilityRole="list"
                accessibilityLabel={`Lista de conteúdos recomendados. ${recommendedContent.length} itens`}
              />
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

const styles = StyleSheet.create({
  headerContainer: {
    // Espaço para ajustes específicos do header se precisar
    // (mantido para não quebrar nada que espere esse style)
  },
});
