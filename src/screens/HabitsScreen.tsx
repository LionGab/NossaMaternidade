/**
 * HabitsScreen - Tela de hábitos e autocuidado
 *
 * Tela premium inspirada no melhor design de apps de hábitos
 * Com calendário semanal, criação rápida e progresso visual
 *
 * @version 2.0.0 - Redesign completo
 */

import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Heart,
  Trophy,
  Flame,
  TrendingUp,
  Zap,
  Calendar,
  Droplet,
  Coffee,
  Activity,
  Home,
  Shirt,
} from 'lucide-react-native';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { CreateHabitModal, HabitCard } from '@/components/habits';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { ThemeToggle } from '@/components/ThemeToggle';
import { habitsService, type UserHabit } from '@/services/supabase';
import { useTheme } from '@/theme';
import { triggerPlatformHaptic } from '@/theme/platform';
import {
  ColorTokens,
  Tokens,
  Shadows,
  Spacing,
  Radius,
} from '@/theme/tokens';
import { logger } from '@/utils/logger';

// ======================
// 🎨 QUICK CREATE HABITS
// ======================

const QUICK_CREATE_HABITS = [
  {
    id: 'banho-premium',
    name: 'Banho Premium',
    icon: Droplet,
    color: ColorTokens.info[500],
    emoji: '✨',
    description: 'Aquele banho que limpa até a alma',
  },
  {
    id: 'skincare',
    name: 'Skincare Completo',
    icon: Heart,
    color: ColorTokens.primary[500],
    emoji: '💖',
    description: 'Cuidar da pele do rosto e corpo',
  },
  {
    id: 'agua',
    name: 'Beber água',
    icon: Droplet,
    color: ColorTokens.info[400],
    emoji: '💧',
    description: 'Hidratação é o segredo',
  },
  {
    id: 'afirmacoes',
    name: 'Palavras de Afirmação',
    icon: Heart,
    color: ColorTokens.warning[500],
    emoji: '❤️',
    description: 'Fortaleça sua autoestima',
  },
  {
    id: 'cafe-manha',
    name: 'Café da Manhã Especial',
    icon: Coffee,
    color: ColorTokens.warning[600],
    emoji: '✨',
    description: 'Começar o dia com carinho',
  },
  {
    id: 'cuidar-casa',
    name: 'Cuidar da Casa',
    icon: Home,
    color: ColorTokens.success[500],
    emoji: '🏠',
    description: 'Organizar o espaço',
  },
  {
    id: 'look-dia',
    name: 'Montar Look do Dia',
    icon: Shirt,
    color: ColorTokens.secondary[500],
    emoji: '👗',
    description: 'Se sentir bem consigo mesma',
  },
  {
    id: 'treino',
    name: 'Treino ou Movimento',
    icon: Activity,
    color: ColorTokens.error[500],
    emoji: '👍',
    description: 'Movimentar o corpo',
  },
] as const;

// ======================
// 🧩 COMPONENT
// ======================

export default function HabitsScreen() {
  const { colors, isDark } = useTheme();

  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [completingHabitId, setCompletingHabitId] = useState<string | null>(null);

  // Carregar hábitos
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const userHabits = await habitsService.getUserHabits();
      setHabits(userHabits);
    } catch (error) {
      logger.error('[HabitsScreen] Erro ao carregar hábitos', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carregar hábitos iniciais
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadHabits();
  }, [loadHabits]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const completedToday = habits.filter((h) => h.today_completed).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const longestStreak = Math.max(...habits.map((h) => h.current_streak || 0), 0);

    return {
      completedToday,
      totalHabits,
      completionRate,
      longestStreak,
    };
  }, [habits]);

  // Criar hábito rápido
  const handleQuickCreate = useCallback(
    async (quickHabit: (typeof QUICK_CREATE_HABITS)[number]) => {
      triggerPlatformHaptic('buttonPress');
      logger.info('[HabitsScreen] Quick create habit', { habitId: quickHabit.id });

      try {
        const result = await habitsService.createHabit({
          name: quickHabit.name,
          description: quickHabit.description,
          frequency: 'daily',
        });

        if (result) {
          logger.info('[HabitsScreen] Hábito criado com sucesso', { habitId: result.id });
          await loadHabits();
          triggerPlatformHaptic('success');
        } else {
          logger.error('[HabitsScreen] Erro ao criar hábito');
          triggerPlatformHaptic('error');
        }
      } catch (error) {
        logger.error('[HabitsScreen] Erro ao criar hábito', error);
        triggerPlatformHaptic('error');
      }
    },
    [loadHabits]
  );

  // Criar hábito customizado
  const handleCreateHabit = () => {
    triggerPlatformHaptic('buttonPress');
    logger.info('[HabitsScreen] Criar hábito pressionado');
    setIsCreateModalOpen(true);
  };

  const handleCreateHabitSubmit = useCallback(
    async (habitData: { name: string; description?: string; frequency?: string }) => {
      try {
        const frequency = (habitData.frequency || 'daily') as 'daily' | 'weekly' | 'monthly';
        const result = await habitsService.createHabit({
          name: habitData.name,
          description: habitData.description,
          frequency,
        });

        if (result) {
          logger.info('[HabitsScreen] Hábito criado com sucesso', { habitId: result.id });
          await loadHabits();
          setIsCreateModalOpen(false);
          triggerPlatformHaptic('success');
        } else {
          logger.error('[HabitsScreen] Erro ao criar hábito');
          triggerPlatformHaptic('error');
        }
      } catch (error) {
        logger.error('[HabitsScreen] Erro ao criar hábito', error);
        triggerPlatformHaptic('error');
      }
    },
    [loadHabits]
  );

  // Toggle completar hábito
  const handleToggleComplete = useCallback(
    async (userHabitId: string) => {
      if (completingHabitId) return;

      triggerPlatformHaptic('buttonPress');
      setCompletingHabitId(userHabitId);

      try {
        const success = await habitsService.toggleHabitCompletion(userHabitId);

        if (success !== undefined) {
          await loadHabits();
          logger.info('[HabitsScreen] Hábito completado/descompletado', {
            userHabitId,
            completed: success,
          });
        }
      } catch (error) {
        logger.error('[HabitsScreen] Erro ao completar hábito', error);
      } finally {
        setCompletingHabitId(null);
      }
    },
    [completingHabitId, loadHabits]
  );

  const handleHabitPress = useCallback((habit: UserHabit) => {
    triggerPlatformHaptic('buttonPress');
    logger.info('[HabitsScreen] Hábito pressionado', { habitId: habit.id });
  }, []);

  // Calendário semanal
  const getWeekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const days: Array<{ day: string; date: number; isToday: boolean }> = [];

    const weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      days.push({
        day: weekDays[i],
        date: date.getDate(),
        isToday: i === currentDay,
      });
    }

    return days;
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top']}
      accessible={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing['20'] }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
          />
        }
      >
        {/* Header Section */}
        <Box
          bg="card"
          px="4"
          pt="4"
          pb="6"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border.light,
          }}
        >
          {/* Avatar + Info + Botão Novo */}
          <Box direction="row" align="center" gap="3" mb="4">
            <Avatar
              size={56}
              source={{ uri: 'https://i.imgur.com/LF2PX1w.jpg' }}
              fallback="NV"
              borderWidth={2}
              borderColor={colors.secondary.main}
              useGradientFallback={true}
            />
            <Box flex={1}>
              <Text size="xl" weight="bold" style={{ marginBottom: Spacing['0.5'] }}>
                Meus Cuidados
              </Text>
              <Text size="sm" color="tertiary">
                {stats.totalHabits} hábitos • {stats.completedToday} completos hoje
              </Text>
            </Box>
            <TouchableOpacity
              onPress={handleCreateHabit}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.primary.main,
                paddingVertical: Spacing['2'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Radius.full,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing['1.5'],
                minHeight: Tokens.touchTargets.min,
              }}
              accessibilityRole="button"
              accessibilityLabel="Criar novo hábito"
            >
              <Plus size={18} color={ColorTokens.neutral[0]} />
              <Text size="sm" weight="bold" style={{ color: ColorTokens.neutral[0] }}>
                Novo
              </Text>
            </TouchableOpacity>
            <ThemeToggle variant="outline" />
          </Box>
        </Box>

        <Box px="4" pt="6" gap="6">
          {/* Calendário Semanal */}
          <Box>
            <Box direction="row" align="center" gap="2" mb="3">
              <Calendar size={18} color={colors.primary.main} />
              <Text size="md" weight="semibold">
                Esta Semana
              </Text>
            </Box>
            <Box direction="row" justify="space-between">
              {getWeekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={{
                    width: 48,
                    height: 64,
                    borderRadius: Radius.lg,
                    backgroundColor: day.isToday
                      ? colors.primary.main
                      : colors.background.card,
                    borderWidth: day.isToday ? 0 : 1,
                    borderColor: colors.border.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(day.isToday && Tokens.shadows.md),
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.day} ${day.date}${day.isToday ? ', hoje' : ''}`}
                >
                  <Text
                    size="xs"
                    weight="medium"
                    style={{
                      color: day.isToday ? ColorTokens.neutral[0] : colors.text.tertiary,
                      marginBottom: Spacing['0.5'],
                      textTransform: 'uppercase',
                    }}
                  >
                    {day.day}
                  </Text>
                  <Text
                    size="lg"
                    weight="bold"
                    style={{
                      color: day.isToday ? ColorTokens.neutral[0] : colors.text.primary,
                    }}
                  >
                    {day.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </Box>
          </Box>

          {/* Seção Criar Rápido */}
          <Box>
            <Box direction="row" align="center" justify="space-between" mb="3">
              <Box direction="row" align="center" gap="2">
                <Zap size={18} color={ColorTokens.info[500]} />
                <Text size="md" weight="semibold">
                  Criar Rápido
                </Text>
              </Box>
              <TouchableOpacity
                onPress={handleCreateHabit}
                activeOpacity={0.7}
                style={{
                  paddingVertical: Spacing['1'],
                  paddingHorizontal: Spacing['3'],
                  borderRadius: Radius.full,
                  backgroundColor: `${ColorTokens.info[500]}15`,
                }}
                accessibilityRole="button"
                accessibilityLabel="Criar hábito personalizado"
              >
                <Text size="xs" weight="medium" style={{ color: ColorTokens.info[500] }}>
                  + Personalizado
                </Text>
              </TouchableOpacity>
            </Box>
            <Box direction="row" flexWrap="wrap" gap="2">
              {QUICK_CREATE_HABITS.map((quickHabit) => {
                const Icon = quickHabit.icon;
                const alreadyExists = habits.some((h) => h.habit?.name === quickHabit.name);

                return (
                  <TouchableOpacity
                    key={quickHabit.id}
                    onPress={() => handleQuickCreate(quickHabit)}
                    activeOpacity={0.8}
                    disabled={alreadyExists}
                    style={{
                      width: (Tokens.screen.width - Spacing['4'] * 2 - Spacing['2']) / 2,
                      backgroundColor: colors.background.card,
                      borderRadius: Radius.xl,
                      padding: Spacing['3'],
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      ...Tokens.shadows.sm,
                      opacity: alreadyExists ? 0.5 : 1,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Criar hábito: ${quickHabit.name}`}
                    accessibilityState={{ disabled: alreadyExists }}
                  >
                    <Box direction="row" align="center" gap="2" mb="2">
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: Radius.md,
                          backgroundColor: `${quickHabit.color}20`,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} color={quickHabit.color} />
                      </View>
                      {quickHabit.emoji && (
                        <Text style={{ fontSize: 16 }}>{quickHabit.emoji}</Text>
                      )}
                    </Box>
                    <Text size="sm" weight="semibold" style={{ marginBottom: Spacing['0.5'] }}>
                      {quickHabit.name}
                    </Text>
                    {alreadyExists && (
                      <Text size="xs" color="tertiary">
                        Já criado
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>

          {/* Seção HOJE - Progresso */}
          <Box
            bg="card"
            p="6"
            rounded="3xl"
            style={{
              borderWidth: 1,
              borderColor: colors.border.light,
              ...Shadows.card,
            }}
          >
            <Box direction="row" align="center" justify="space-between" mb="4">
              <Box direction="row" align="center" gap="2">
                <Flame size={20} color={ColorTokens.warning[500]} />
                <Text size="lg" weight="semibold">
                  HOJE
                </Text>
              </Box>
              <Badge
                containerStyle={{
                  backgroundColor: colors.primary.main,
                }}
              >
                <Text size="xs" weight="bold" style={{ color: ColorTokens.neutral[0] }}>
                  {stats.completionRate}% completo
                </Text>
              </Badge>
            </Box>

            {/* Progress Ring Visual */}
            <Box align="center" mb="4">
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 10,
                  borderColor: `${colors.primary.main}30`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${colors.primary.main}08`,
                  position: 'relative',
                }}
              >
                <Text size="3xl" weight="bold" style={{ color: colors.primary.main }}>
                  {stats.completedToday}
                </Text>
                <Text size="sm" color="tertiary">
                  de {stats.totalHabits}
                </Text>
                {/* Pontos decorativos */}
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary.main,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 20,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.primary.main,
                  }}
                />
              </View>
            </Box>

            {/* Stats Grid */}
            <Box direction="row" gap="3">
              <Box
                flex={1}
                p="4"
                rounded="xl"
                align="center"
                style={{
                  backgroundColor: isDark ? ColorTokens.warning[900] : ColorTokens.warning[100],
                }}
              >
                <Box direction="row" align="center" gap="1" mb="1">
                  <TrendingUp size={16} color={ColorTokens.warning[500]} />
                  <Text size="2xl" weight="bold" style={{ color: ColorTokens.warning[600] }}>
                    {stats.longestStreak}
                  </Text>
                </Box>
                <Text size="xs" color="tertiary">
                  Sequência máxima
                </Text>
              </Box>
              <Box
                flex={1}
                p="4"
                rounded="xl"
                align="center"
                style={{
                  backgroundColor: isDark
                    ? `${ColorTokens.accent.purple}20`
                    : `${ColorTokens.accent.purple}15`,
                }}
              >
                <Box direction="row" align="center" gap="1" mb="1">
                  <Trophy size={16} color={ColorTokens.accent.purple} />
                  <Text size="2xl" weight="bold" style={{ color: ColorTokens.accent.purple }}>
                    {stats.completionRate}%
                  </Text>
                </Box>
                <Text size="xs" color="tertiary">
                  Taxa de sucesso
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Empty State - Mensagem Motivacional */}
          {!loading && habits.length === 0 && (
            <Box
              bg="card"
              p="6"
              rounded="3xl"
              align="center"
              style={{
                borderWidth: 1,
                borderColor: colors.border.light,
                ...Shadows.card,
              }}
            >
              <Box
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: `${colors.primary.main}15`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing['4'],
                }}
              >
                <Heart size={48} color={colors.primary.main} />
                <Text style={{ fontSize: 24, marginTop: Spacing['1'] }}>✨</Text>
              </Box>
              <Text size="xl" weight="bold" style={{ marginBottom: Spacing['2'], textAlign: 'center' }}>
                Comece seus cuidados hoje!
              </Text>
              <Text
                size="sm"
                color="secondary"
                style={{ marginBottom: Spacing['4'], textAlign: 'center', lineHeight: 20 }}
              >
                Cada pequeno hábito é um ato de amor com você mesma. Comece criando seu primeiro cuidado e veja como
                isso transforma seu dia.
              </Text>
              <TouchableOpacity
                onPress={handleCreateHabit}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.primary.main,
                  paddingVertical: Spacing['3'],
                  paddingHorizontal: Spacing['6'],
                  borderRadius: Radius.xl,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing['2'],
                  minHeight: Tokens.touchTargets.min,
                }}
                accessibilityRole="button"
                accessibilityLabel="Criar meu primeiro hábito"
              >
                <Plus size={18} color={ColorTokens.neutral[0]} />
                <Text size="sm" weight="bold" style={{ color: ColorTokens.neutral[0] }}>
                  Criar meu primeiro hábito
                </Text>
              </TouchableOpacity>
            </Box>
          )}

          {/* Loading State */}
          {loading && habits.length === 0 && (
            <Box py="12" align="center">
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text size="sm" color="secondary" style={{ marginTop: Spacing['3'] }}>
                Carregando hábitos...
              </Text>
            </Box>
          )}

          {/* Habits List */}
          {!loading && habits.length > 0 && (
            <Box gap="4">
              <Box direction="row" align="center" justify="space-between">
                <Text size="lg" weight="bold">
                  Meus Hábitos
                </Text>
                <Badge
                  containerStyle={{
                    backgroundColor: isDark ? ColorTokens.secondary[800] : ColorTokens.secondary[100],
                  }}
                >
                  <Text size="xs" weight="medium" style={{ color: colors.secondary.main }}>
                    {habits.length} total
                  </Text>
                </Badge>
              </Box>

              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleting={completingHabitId === habit.id}
                  onToggleComplete={handleToggleComplete}
                  onPress={handleHabitPress}
                />
              ))}
            </Box>
          )}

          {/* Banner Motivacional Final */}
          {!loading && (
            <Box
              rounded="3xl"
              style={{
                overflow: 'hidden',
                ...Shadows.card,
              }}
            >
              <LinearGradient
                colors={
                  isDark
                    ? [ColorTokens.secondary[700], ColorTokens.accent.purple + '80']
                    : [ColorTokens.secondary[400], ColorTokens.accent.purple + '60']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: Spacing['6'],
                }}
              >
                <Box align="center">
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: `${ColorTokens.neutral[0]}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: Spacing['3'],
                    }}
                  >
                    <Text style={{ fontSize: 40 }}>💪</Text>
                  </View>
                  <Text
                    size="lg"
                    weight="bold"
                    style={{
                      color: ColorTokens.neutral[0],
                      marginBottom: Spacing['2'],
                      textAlign: 'center',
                    }}
                  >
                    Você está incrível! ✨
                  </Text>
                  <Text
                    size="sm"
                    style={{
                      color: `${ColorTokens.neutral[0]}E6`,
                      textAlign: 'center',
                      lineHeight: 20,
                      marginBottom: Spacing['4'],
                    }}
                  >
                    Cada pequeno cuidado que você tem com você mesma é um ato de amor. Continue cuidando de quem cuida
                    de todos.
                  </Text>
                  <Box direction="row" gap="4">
                    <Text size="xs" style={{ color: `${ColorTokens.neutral[0]}CC` }}>
                      {stats.completedToday} completos hoje
                    </Text>
                    <Text size="xs" style={{ color: `${ColorTokens.neutral[0]}CC` }}>
                      {stats.longestStreak} dias de sequência
                    </Text>
                  </Box>
                </Box>
              </LinearGradient>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Modal Criar Hábito */}
      <CreateHabitModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateHabit={handleCreateHabitSubmit}
      />
    </SafeAreaView>
  );
}
