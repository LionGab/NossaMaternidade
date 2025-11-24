import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
  BedDouble,
  MessageCircleHeart,
  ArrowRight,
  Heart,
  Baby,
  TrendingUp,
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../theme/ThemeContext';
import { profileService } from '../services/profileService';
import { feedService, ContentItem } from '../services/feedService';
import { habitsService, UserHabit } from '../services/habitsService';
import { milestonesService } from '../services/milestonesService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('mãe');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
  const [milestoneProgress, setMilestoneProgress] = useState(0);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Buscar perfil
      const profile = await profileService.getCurrentProfile();
      if (profile) {
        setUserName(profile.full_name?.split(' ')[0] || 'mãe');
        setAvatarUrl(profile.avatar_url);
      }

      // Buscar conteúdos recomendados
      const content = await feedService.getRecommendedContent(6);
      setRecommendedContent(content);

      // Buscar hábitos do usuário
      const habits = await habitsService.getUserHabits();
      setUserHabits(habits.slice(0, 2));

      // Buscar progresso de marcos
      const progress = await milestonesService.getMilestoneProgress();
      setMilestoneProgress(progress.progress_percentage);
    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const renderContentCard = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.navigate('Feed');
      }}
      className="w-[200px] bg-white dark:bg-nath-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-50 dark:border-nath-dark-border mr-4"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.type}. Por ${item.author_name || 'autor desconhecido'}`}
      accessibilityHint="Toque para ver detalhes deste conteúdo"
    >
      <View className="h-28 bg-gray-200 dark:bg-nath-dark-bg relative overflow-hidden">
        <Image
          source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/200' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2 bg-white/90 dark:bg-black/70 px-2 py-0.5 rounded-md flex-row items-center gap-1">
          {getIconForType(item.type)}
        </View>
        <View className="absolute bottom-2 right-2 bg-pink-500/90 px-1.5 py-0.5 rounded-md flex-row items-center gap-0.5">
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
        <Text
          className="text-[10px]"
          style={{ color: colors.text.secondary }}
        >
          {item.author_name || 'Toque para ver'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHabitCard = (habit: UserHabit, index: number) => (
    <TouchableOpacity
      key={habit.id}
      onPress={() => {
        // @ts-ignore
        navigation.navigate('Habits');
      }}
      className="flex-1 bg-white dark:bg-nath-dark-card border p-4 rounded-2xl"
      style={{
        borderColor: colors.border.light,
        marginLeft: index > 0 ? 12 : 0,
      }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Hábito: ${habit.custom_name || habit.habit?.name}. ${habit.today_completed ? 'Completado hoje' : `Sequência atual: ${habit.current_streak || 0} dias`}`}
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
      <Text className="font-bold text-sm leading-tight mb-0.5" style={{ color: colors.text.primary }}>
        {habit.custom_name || habit.habit?.name}
      </Text>
      <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
        {habit.today_completed ? '✓ Completado' : `Streak: ${habit.current_streak || 0}`}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? '#020617' : '#F8F9FA' }}
        accessible={true}
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

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#020617' : '#F8F9FA' }}
      accessible={true}
      accessibilityLabel="Tela inicial do Nossa Maternidade"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        accessible={false}
      >
        {/* Header */}
        <View
          className="px-6 py-4 flex-row justify-between items-center border-b"
          style={{
            backgroundColor: isDark ? '#0B1220CC' : '#FFFFFFCC',
            borderBottomColor: colors.border.light,
          }}
        >
          <View accessible={true} accessibilityRole="header">
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
              onPress={toggleTheme}
              className="w-10 h-10 rounded-full items-center justify-center border"
              style={{
                backgroundColor: isDark ? '#020617' : '#F3F4F6',
                borderColor: colors.border.light,
              }}
              accessibilityRole="button"
              accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              accessibilityHint="Alterna entre tema claro e escuro"
            >
              {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color={colors.text.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              className="w-12 h-12 rounded-full overflow-hidden border-2"
              style={{
                backgroundColor: isDark ? colors.border.light : '#E8F0FE',
                borderColor: isDark ? colors.border.light : '#FFFFFF',
              }}
              accessibilityRole="button"
              accessibilityLabel={avatarUrl ? `Foto de perfil de ${userName}` : 'Foto de perfil não definida'}
              accessibilityHint="Toque para ver seu perfil"
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text style={{ color: colors.text.primary }}>👤</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-6 space-y-8">
          {/* SECTION: HOJE EU TÔ COM VOCÊ */}
          <View accessible={true} accessibilityRole="none">
            <View className="flex-row justify-between items-baseline mb-4">
              <Text
                className="font-bold flex-row items-center gap-2"
                style={{ color: colors.text.primary }}
                accessibilityRole="header"
                accessibilityLabel="Seção: Hoje eu tô com você"
              >
                Hoje eu tô com você
              </Text>
              <View
                className="bg-blue-500 px-2 py-0.5 rounded-full flex-row items-center gap-1"
                accessible={true}
                accessibilityLabel="30 segundos para você"
              >
                <Wind size={10} color="#FFFFFF" />
                <Text className="text-white text-[10px] font-bold">30s para você</Text>
              </View>
            </View>

            {/* 1. IMAGE CARD: Como você dormiu? */}
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Diary');
              }}
              className="w-full h-[180px] rounded-[22px] overflow-hidden mb-4 shadow-lg"
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Como você dormiu hoje? Maternidade Real. Toque para registrar"
              accessibilityHint="Abre o diário para registrar como foi seu sono"
            >
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800' }}
                className="w-full h-full"
                resizeMode="cover"
                imageStyle={{ opacity: 0.85 }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                  className="absolute inset-0"
                />
                <View className="absolute inset-0 p-5 flex-col justify-between">
                  <View className="flex-row justify-between items-start">
                    <View className="w-9 h-9 bg-white/10 rounded-full items-center justify-center border border-white/20">
                      <BedDouble size={18} color="#FFFFFF" />
                    </View>
                    <View className="bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                      <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                        Maternidade Real
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
              </ImageBackground>
            </TouchableOpacity>

            {/* 2. BLUE CARD: Respirar 1 minuto */}
            <LinearGradient
              colors={isDark ? ['#3B82F6', '#1D4ED8'] : ['#6DA9E4', '#3C6AD6']}
              className="rounded-[22px] p-6 mb-4 shadow-xl"
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
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Ritual');
                  }}
                  className="mt-4 bg-white px-5 py-3 rounded-xl shadow-sm flex-row items-center justify-center gap-2 w-fit"
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Começar respiração de 1 minuto agora"
                  accessibilityHint="Inicia um exercício de respiração guiada"
                >
                  <Text className="text-blue-500 dark:text-nath-dark-hero font-bold text-xs">
                    Começar agora
                  </Text>
                  <ArrowRight size={14} color={colors.primary.main} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* 3. SECONDARY GRID (Quick Actions) */}
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('Chat');
                }}
                className="flex-1 bg-white dark:bg-nath-dark-card border p-4 rounded-2xl"
                style={{ borderColor: colors.border.light }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Conversar com MãesValente IA"
                accessibilityHint="Abre o chat para conversar com a inteligência artificial"
              >
                <View className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-full items-center justify-center mb-3">
                  <MessageCircleHeart size={16} color="#A855F7" strokeWidth={2.5} />
                </View>
                <Text className="font-bold text-sm leading-tight mb-0.5" style={{ color: colors.text.primary }}>
                  Conversar
                </Text>
                <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
                  MãesValente IA
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('Community');
                }}
                className="flex-1 bg-white dark:bg-nath-dark-card border p-4 rounded-2xl"
                style={{ borderColor: colors.border.light }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Comunidade Mães Valentes"
                accessibilityHint="Abre a comunidade para conectar com outras mães"
              >
                <View className="w-8 h-8 bg-pink-50 dark:bg-pink-900/20 rounded-full items-center justify-center mb-3">
                  <Heart size={16} color="#EC4899" strokeWidth={2.5} />
                </View>
                <Text className="font-bold text-sm leading-tight mb-0.5" style={{ color: colors.text.primary }}>
                  Comunidade
                </Text>
                <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
                  Mães Valentes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hábitos do Dia */}
            {userHabits.length > 0 && (
              <View className="flex-row gap-3">
                {userHabits.map((habit, index) => renderHabitCard(habit, index))}
              </View>
            )}

            {/* Marcos do Bebê */}
            {milestoneProgress > 0 && (
              <TouchableOpacity
                onPress={() => {
                  // Navegar para tela de marcos (criar depois)
                }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border p-4 rounded-2xl mt-3"
                style={{ borderColor: colors.border.light }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Marcos do Bebê. ${milestoneProgress} por cento concluído`}
                accessibilityHint="Toque para ver todos os marcos de desenvolvimento"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Baby size={18} color="#10B981" />
                      <Text className="font-bold text-sm" style={{ color: colors.text.primary }}>
                        Marcos do Bebê
                      </Text>
                    </View>
                    <Text className="text-[10px]" style={{ color: colors.text.secondary }}>
                      {milestoneProgress}% concluído
                    </Text>
                  </View>
                  <View className="bg-green-500 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                    <TrendingUp size={12} color="#FFFFFF" />
                    <Text className="text-white text-[10px] font-bold">{milestoneProgress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* SECTION: MUNDO NATH */}
          {recommendedContent.length > 0 && (
            <View>
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text
                  className="font-bold"
                  style={{ color: colors.text.primary }}
                  accessibilityRole="header"
                  accessibilityLabel="Seção: Mundo Nath"
                >
                  Mundo Nath
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Feed');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Ver todos os conteúdos do Mundo Nath"
                  accessibilityHint="Abre a lista completa de vídeos, áudios e artigos"
                >
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs font-bold" style={{ color: colors.primary.main }}>
                      Ver tudo
                    </Text>
                    <ChevronRight size={14} color={colors.primary.main} />
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
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
