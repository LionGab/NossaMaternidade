/**
 * HabitsScreen - Tela de hábitos e autocuidado
 *
 * Design baseado no Style Guide SoftPastel - App Store Ready
 * Mobile-first para iOS e Android
 *
 * Layout focado em HOJE com 4 blocos:
 * - BLOCO 0: Header compacto
 * - BLOCO 1: Resumo de hoje (progresso)
 * - BLOCO 2: Quick Create (max 6 itens, grid 2 colunas)
 * - BLOCO 3: Lista de hábitos de hoje
 * - BLOCO 4: Empty state / mensagem motivacional
 *
 * @version 4.0.0 - Refatorado (Clean UX)
 */

import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Heart,
  Flame,
  TrendingUp,
  Droplet,
  Coffee,
  Activity,
  Home,
  Shirt,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { CreateHabitModal, HabitCard } from '@/components/habits';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { habitsService, type UserHabit } from '@/services/supabase';
import { triggerPlatformHaptic } from '@/theme/platform';
import {
  ColorTokens,
  Tokens,
  Spacing,
  Radius,
} from '@/theme/tokens';
import { SoftPastelTheme, SoftPastelGradients, SoftPastelBackgrounds } from '@/theme/softPastelTheme';
import { logger } from '@/utils/logger';

// Soft Pastel Colors (App Store Ready)
const SOFT_PASTEL = {
  pink: SoftPastelTheme.colors.pink,       // '#FFB8D9'
  purple: SoftPastelTheme.colors.purple,   // '#D9B8FF'
  blue: SoftPastelTheme.colors.blue,       // '#B8D4FF'
  mint: SoftPastelTheme.colors.mint,       // '#A8E6CF'
  peach: SoftPastelTheme.colors.peach,     // '#FFD6A5'
  accent: '#FF6B9D',                        // Rosa vibrante
  accentBlue: '#3B82F6',                    // Azul vibrante
  textDark: '#3A2E2E',                      // Texto escuro
  textMuted: '#6A5450',                     // Texto suave
  cardBg: '#FDF9FB',                        // Fundo rosado suave
  canvas: SoftPastelBackgrounds.canvas,    // '#FFFCFD'
  gradientPrimary: SoftPastelGradients.primary,  // ['#FFB8D9', '#D9B8FF']
  gradientBlue: ['#3B82F6', '#0EA5E9', '#2563EB'] as const,  // Gradiente azul para hoje
} as const;

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: SOFT_PASTEL.canvas }}
      edges={['top']}
      accessible={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={SOFT_PASTEL.accent}
          />
        }
      >
        {/* Header Section - SoftPastel */}
        <LinearGradient
          colors={[SoftPastelBackgrounds.soft, '#F0F7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            paddingHorizontal: Spacing['5'],
            paddingTop: Spacing['4'],
            paddingBottom: Spacing['6'],
          }}
        >
          {/* Avatar + Info + Botão Novo */}
          <Box direction="row" align="center" gap="3">
            <Avatar
              size={56}
              source={{ uri: 'https://i.imgur.com/LF2PX1w.jpg' }}
              fallback="MC"
              borderWidth={3}
              borderColor={SOFT_PASTEL.accent}
              useGradientFallback={true}
            />
            <Box flex={1}>
              <Text size="xl" weight="bold" style={{ color: SOFT_PASTEL.textDark, marginBottom: Spacing['0.5'] }}>
                Meus Cuidados
              </Text>
              <Text size="sm" style={{ color: SOFT_PASTEL.textMuted }}>
                {stats.totalHabits === 0
                  ? 'Seu espaço de autocuidado diário'
                  : `Hoje: ${stats.completedToday} de ${stats.totalHabits} concluídos`}
              </Text>
            </Box>
            <TouchableOpacity
              onPress={handleCreateHabit}
              activeOpacity={0.8}
              style={{
                backgroundColor: SOFT_PASTEL.accent,
                paddingVertical: Spacing['2.5'],
                paddingHorizontal: Spacing['4'],
                borderRadius: Radius.full,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing['1.5'],
                minHeight: Tokens.touchTargets.min,
                shadowColor: SOFT_PASTEL.accent,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              }}
              accessibilityRole="button"
              accessibilityLabel="Criar novo hábito"
            >
              <Plus size={18} color="#FFF" strokeWidth={2.5} />
              <Text size="sm" weight="bold" style={{ color: '#FFF' }}>
                +Novo
              </Text>
            </TouchableOpacity>
          </Box>
        </LinearGradient>

        <Box px="5" style={{ marginTop: -Spacing['2'], gap: Spacing['5'] }}>
          {/* BLOCO 1: Resumo de Hoje - SoftPastel */}
          {stats.totalHabits > 0 && (
            <Box
              style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: Spacing['5'],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Box direction="row" align="center" justify="space-between" mb="4">
                <Box direction="row" align="center" gap="2">
                  <Flame size={20} color={SOFT_PASTEL.accent} />
                  <Text size="lg" weight="bold" style={{ color: SOFT_PASTEL.textDark }}>
                    Hoje
                  </Text>
                </Box>
                <View
                  style={{
                    backgroundColor: `${SOFT_PASTEL.accent}15`,
                    paddingVertical: Spacing['1.5'],
                    paddingHorizontal: Spacing['3'],
                    borderRadius: Radius.full,
                  }}
                >
                  <Text size="xs" weight="bold" style={{ color: SOFT_PASTEL.accent }}>
                    {stats.completionRate}%
                  </Text>
                </View>
              </Box>

              <Box direction="row" align="center" gap="4">
                {/* Mini Progress Ring */}
                <View style={{ width: 64, height: 64, position: 'relative' }}>
                  <Svg width={64} height={64} style={{ position: 'absolute' }}>
                    <Circle
                      cx={32}
                      cy={32}
                      r={28}
                      stroke={`${SOFT_PASTEL.accent}20`}
                      strokeWidth={6}
                      fill="transparent"
                    />
                    <Circle
                      cx={32}
                      cy={32}
                      r={28}
                      stroke={SOFT_PASTEL.accent}
                      strokeWidth={6}
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - stats.completionRate / 100)}`}
                      transform="rotate(-90 32 32)"
                    />
                  </Svg>
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: SOFT_PASTEL.accent }}>
                      {stats.completedToday}
                    </Text>
                  </View>
                </View>

                {/* Texto e Sequência */}
                <Box flex={1}>
                  <Text size="md" weight="semibold" style={{ color: SOFT_PASTEL.textDark, marginBottom: Spacing['1'] }}>
                    {stats.completedToday} de {stats.totalHabits} concluídos
                  </Text>
                  {stats.longestStreak > 0 && (
                    <Box direction="row" align="center" gap="1">
                      <TrendingUp size={14} color={SOFT_PASTEL.textMuted} />
                      <Text size="sm" style={{ color: SOFT_PASTEL.textMuted }}>
                        {stats.longestStreak} {stats.longestStreak === 1 ? 'dia' : 'dias'} de sequência
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* BLOCO 2: Criar Rápido - SoftPastel */}
          <Box>
            <Box direction="row" align="center" justify="space-between" mb="3">
              <Box>
                <Text size="md" weight="bold" style={{ color: SOFT_PASTEL.textDark }}>
                  Criar rápido
                </Text>
                <Text size="xs" style={{ color: SOFT_PASTEL.textMuted, marginTop: Spacing['0.5'] }}>
                  Escolha um cuidado para hoje
                </Text>
              </Box>
            </Box>
            <Box direction="row" flexWrap="wrap" gap="3">
              {QUICK_CREATE_HABITS.slice(0, 6).map((quickHabit) => {
                const Icon = quickHabit.icon;
                const alreadyExists = habits.some((h) => h.habit?.name === quickHabit.name);

                return (
                  <TouchableOpacity
                    key={quickHabit.id}
                    onPress={() => handleQuickCreate(quickHabit)}
                    activeOpacity={0.8}
                    disabled={alreadyExists}
                    style={{
                      width: (Tokens.screen.width - Spacing['5'] * 2 - Spacing['3']) / 2,
                      backgroundColor: '#FFF',
                      borderRadius: 18,
                      padding: Spacing['3'],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                      opacity: alreadyExists ? 0.5 : 1,
                      minHeight: 72,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Criar hábito: ${quickHabit.name}`}
                    accessibilityState={{ disabled: alreadyExists }}
                  >
                    <Box direction="row" align="center" gap="2">
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          backgroundColor: `${quickHabit.color}15`,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} color={quickHabit.color} />
                      </View>
                      <Text size="sm" weight="semibold" style={{ color: SOFT_PASTEL.textDark, flex: 1 }}>
                        {quickHabit.name}
                      </Text>
                    </Box>
                    {alreadyExists && (
                      <Text size="xs" style={{ color: SOFT_PASTEL.textMuted, marginTop: Spacing['1'] }}>
                        ✓ Já criado
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Box>
          </Box>

          {/* BLOCO 4: Empty State quando não há hábitos */}
          {!loading && habits.length === 0 && (
            <Box
              style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: Spacing['6'],
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: `${SOFT_PASTEL.accent}15`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing['4'],
                }}
              >
                <Heart size={36} color={SOFT_PASTEL.accent} fill={`${SOFT_PASTEL.accent}30`} />
              </View>
              <Text size="lg" weight="bold" style={{ color: SOFT_PASTEL.textDark, marginBottom: Spacing['2'], textAlign: 'center' }}>
                Comece seus cuidados hoje
              </Text>
              <Text
                size="sm"
                style={{ color: SOFT_PASTEL.textMuted, marginBottom: Spacing['5'], textAlign: 'center', lineHeight: 20 }}
              >
                Cada pequeno hábito é um ato de amor com você mesma.
              </Text>
              <TouchableOpacity
                onPress={handleCreateHabit}
                activeOpacity={0.8}
                style={{
                  backgroundColor: SOFT_PASTEL.accent,
                  paddingVertical: Spacing['3'],
                  paddingHorizontal: Spacing['5'],
                  borderRadius: Radius.full,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing['2'],
                  minHeight: Tokens.touchTargets.min,
                  shadowColor: SOFT_PASTEL.accent,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                accessibilityRole="button"
                accessibilityLabel="Criar meu primeiro cuidado"
              >
                <Plus size={16} color="#FFF" strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: '#FFF' }}>
                  Criar meu primeiro cuidado
                </Text>
              </TouchableOpacity>
            </Box>
          )}

          {/* Loading State */}
          {loading && habits.length === 0 && (
            <Box py="12" align="center">
              <ActivityIndicator size="large" color={SOFT_PASTEL.accent} />
              <Text size="sm" style={{ color: SOFT_PASTEL.textMuted, marginTop: Spacing['3'] }}>
                Carregando hábitos...
              </Text>
            </Box>
          )}

          {/* BLOCO 3: Lista de Hábitos de Hoje */}
          {!loading && habits.length > 0 && (
            <Box gap="4">
              <Box direction="row" align="center" justify="space-between">
                <Text size="lg" weight="bold" style={{ color: SOFT_PASTEL.textDark }}>
                  Meus cuidados de hoje
                </Text>
                <View
                  style={{
                    backgroundColor: `${SOFT_PASTEL.blue}40`,
                    paddingVertical: Spacing['1'],
                    paddingHorizontal: Spacing['3'],
                    borderRadius: Radius.full,
                  }}
                >
                  <Text size="xs" weight="semibold" style={{ color: SOFT_PASTEL.accentBlue }}>
                    {habits.length} {habits.length === 1 ? 'cuidado' : 'cuidados'}
                  </Text>
                </View>
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

          {/* Card Motivacional Pequeno - Apenas quando há hábitos */}
          {!loading && habits.length > 0 && (
            <Box
              style={{
                backgroundColor: `${SOFT_PASTEL.purple}15`,
                borderRadius: 20,
                padding: Spacing['4'],
              }}
            >
              <Text
                size="sm"
                style={{
                  color: SOFT_PASTEL.textDark,
                  textAlign: 'center',
                  lineHeight: 20,
                  fontStyle: 'italic',
                }}
              >
                Cada pequeno cuidado conta. Você está fazendo o seu melhor, mesmo nos dias difíceis 💕
              </Text>
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
