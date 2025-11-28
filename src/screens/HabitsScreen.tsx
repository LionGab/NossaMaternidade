import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useThemedStyles, useTheme, ThemeColors } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitCategory } from '../types/habits';
import { useHaptics } from '../hooks/useHaptics';
import { DEFAULT_HABITS, HABIT_CATEGORIES } from '../data/habits';
import { useAsyncStorage } from '../hooks/useStorage';
import { Tokens } from '../theme/tokens';
import { HabitsBarChart } from '../components/charts/HabitsBarChart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HABIT_STORAGE_KEY = '@nossa_maternidade:habits';

// Styled function - defined first so components can use it
const createStyles = (colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Tokens.spacing['5'], // 20
    paddingVertical: Tokens.spacing['4'], // 16
  },
  headerTitle: {
    ...Tokens.textStyles.displayMedium, // 28/700/36
    color: colors.text.primary,
    marginBottom: Tokens.spacing['1'], // 4
  },
  headerSubtitle: {
    ...Tokens.textStyles.bodyMedium, // 14/400/20
    color: colors.text.secondary,
  },
  addButton: {
    width: Tokens.touchTargets.min, // 44
    height: Tokens.touchTargets.min, // 44
    borderRadius: Tokens.radius.full, // 9999 (circle)
    backgroundColor: colors.background.card,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: Tokens.spacing['5'], // 20
    marginBottom: Tokens.spacing['5'], // 20
    borderRadius: Tokens.radius.card, // 20
    padding: Tokens.spacing['5'], // 20
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsTitle: {
    ...Tokens.textStyles.titleSmall, // 16/500/24
    color: colors.text.secondary,
    marginBottom: Tokens.spacing['4'], // 16
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: Tokens.spacing['5'], // 20
  },
  statBox: {
    alignItems: 'center' as const,
  },
  statValue: {
    ...Tokens.textStyles.displayLarge, // 32/700/40
    color: colors.text.primary,
    marginBottom: Tokens.spacing['1'], // 4
  },
  statLabel: {
    ...Tokens.textStyles.labelMedium, // 12/600/18
    color: colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    height: Tokens.spacing['2'], // 8
    backgroundColor: colors.background.elevated,
    borderRadius: Tokens.radius.sm, // 4
    overflow: 'hidden' as const,
  },
  progressBar: {
    height: Tokens.spacing['2'], // 8
    borderRadius: Tokens.radius.sm, // 4
    backgroundColor: colors.primary.main,
  },
  categoriesContainer: {
    marginBottom: Tokens.spacing['5'], // 20
  },
  categoriesContent: {
    paddingHorizontal: Tokens.spacing['5'], // 20
    gap: Tokens.spacing['2'], // 8
  },
  categoryChip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Tokens.spacing['4'], // 16
    paddingVertical: Tokens.spacing['2.5'], // 10
    borderRadius: Tokens.radius.card, // 20
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: Tokens.spacing['1.5'], // 6
  },
  categoryText: {
    ...Tokens.textStyles.labelLarge, // 14/600/20
    color: colors.text.secondary,
  },
  habitsList: {
    paddingHorizontal: Tokens.spacing['5'], // 20
    paddingBottom: Tokens.spacing['5'], // 20
    gap: Tokens.spacing['3'], // 12
  },
  habitCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background.card,
    borderRadius: Tokens.radius.xl, // 16
    padding: Tokens.spacing['4'], // 16
    borderWidth: 2,
    gap: Tokens.spacing['4'], // 16
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  habitCardCompleted: {
    borderWidth: 2,
  },
  habitCardOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  habitIconContainer: {
    width: Tokens.touchTargets.large, // 56
    height: Tokens.touchTargets.large, // 56
    borderRadius: Tokens.radius.xl, // 16
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    ...Tokens.textStyles.titleSmall, // 16/500/24
    fontWeight: Tokens.typography.weights.bold, // 700
    color: colors.text.primary,
    marginBottom: Tokens.spacing['1'], // 4
  },
  habitDescription: {
    fontSize: Tokens.typography.sizes.sm, // 14 (closest to 13)
    color: colors.text.secondary,
    marginBottom: Tokens.spacing['2'], // 8
  },
  habitStats: {
    flexDirection: 'row' as const,
    gap: Tokens.spacing['4'], // 16
  },
  statItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Tokens.spacing['1'], // 4
  },
  statText: {
    ...Tokens.textStyles.labelMedium, // 12/600/18
    color: colors.text.secondary,
  },
  checkboxContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkbox: {
    width: Tokens.iconSizes.xl, // 32
    height: Tokens.iconSizes.xl, // 32
    borderRadius: Tokens.radius.full, // 9999 (circle)
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: Tokens.spacing['10'], // 40
  },
  emptyTitle: {
    ...Tokens.textStyles.titleLarge, // 20/600/28
    color: colors.text.primary,
    marginTop: Tokens.spacing['4'], // 16
    marginBottom: Tokens.spacing['2'], // 8
  },
  emptyText: {
    fontSize: Tokens.typography.sizes.base, // 16 (closest to 15)
    color: colors.text.secondary,
    textAlign: 'center' as const,
  },
});

// Componente de card de hábito
interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  isCompletedToday: boolean;
  colors: ThemeColors;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, isCompletedToday, colors }) => {
  const styles = useThemedStyles(createStyles);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(isCompletedToday ? 1 : 0)).current;
  const haptics = useHaptics();

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isCompletedToday ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  }, [isCompletedToday, checkAnim]);

  const handlePress = () => {
    haptics.medium();
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    if (!isCompletedToday) {
      haptics.success();
    }
    onToggle(habit.id);
  };

  const checkmarkScale = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const checkmarkRotation = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.habitCard,
          isCompletedToday && styles.habitCardCompleted,
          { borderColor: habit.color },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${habit.title}, ${habit.description}`}
        accessibilityState={{ selected: isCompletedToday }}
        accessibilityHint={`Toque para ${isCompletedToday ? 'desmarcar' : 'marcar'} como completo. Sequência atual: ${habit.streak} dias`}
      >
        {/* Background color overlay quando completo */}
        {isCompletedToday && (
          <View
            style={[
              styles.habitCardOverlay,
              { backgroundColor: `${habit.color}20` },
            ]}
          />
        )}

        {/* Icon */}
        <View
          style={[
            styles.habitIconContainer,
            { backgroundColor: `${habit.color}20` },
          ]}
        >
          <Ionicons name={habit.icon as keyof typeof Ionicons.glyphMap} size={28} color={habit.color} />
        </View>

        {/* Content */}
        <View style={styles.habitContent}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <Text style={styles.habitDescription} numberOfLines={1}>
            {habit.description}
          </Text>

          {/* Stats */}
          <View style={styles.habitStats}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={14} color={habit.color} />
              <Text style={[styles.statText, { color: habit.color }]}>
                {habit.streak} dias
              </Text>
            </View>
            {(habit.bestStreak ?? 0) > (habit.streak ?? 0) && (
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={14} color={colors.text.tertiary} />
                <Text style={styles.statText}>Melhor: {habit.bestStreak ?? 0}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <Animated.View
            style={[
              styles.checkbox,
              {
                backgroundColor: isCompletedToday ? habit.color : 'transparent',
                borderColor: habit.color,
                transform: [
                  { scale: checkmarkScale },
                  { rotate: checkmarkRotation },
                ],
              },
            ]}
          >
            {isCompletedToday && (
              <Ionicons name="checkmark" size={20} color={colors.text.inverse} />
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Componente de estatísticas
interface StatsCardProps {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  completionRate: number;
  colors: ThemeColors;
}

const StatsCard: React.FC<StatsCardProps> = ({
  totalHabits,
  completedToday,
  currentStreak,
  completionRate,
  colors,
}) => {
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={styles.statsCard}
      accessible={true}
      accessibilityLabel={`Estatísticas de hoje: ${completedToday} de ${totalHabits} hábitos completos, sequência atual ${currentStreak} dias, taxa de conclusão ${Math.round(completionRate)}%`}
    >
      <Text style={styles.statsTitle}>Hoje</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{completedToday}</Text>
          <Text style={styles.statLabel}>de {totalHabits}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>sequência</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
          <Text style={styles.statLabel}>taxa</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${completionRate}%`,
              backgroundColor: colors.primary.main,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default function HabitsScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [habits, setHabits] = useAsyncStorage<Habit[]>(HABIT_STORAGE_KEY, DEFAULT_HABITS);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [completedToday, setCompletedToday] = useAsyncStorage<Record<string, boolean>>(
    '@nossa_maternidade:habits_completed_today',
    {}
  );
  const haptics = useHaptics();

  // Calcular estatísticas
  const today = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter((h) => h.is_active);
  const filteredHabits =
    selectedCategory === 'all'
      ? activeHabits
      : activeHabits.filter((h) => h.category === selectedCategory);

  const completedCount = filteredHabits.filter(
    (h) => completedToday[h.id]
  ).length;
  const completionRate =
    filteredHabits.length > 0 ? (completedCount / filteredHabits.length) * 100 : 0;
  const currentStreak = Math.max(...activeHabits.map((h) => h.streak ?? 0), 0);

  // Dados para o gráfico semanal (últimos 7 dias)
  // TODO: Substituir por dados reais quando integrar com HabitsAnalysisAgent
  const weeklyData = [3, 4, 2, 5, 4, 3, completedCount]; // Mock data + hoje
  const weeklyLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const isCompleted = completedToday[habitId];
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      // Atualizar completions
      setCompletedToday({
        ...completedToday,
        [habitId]: !isCompleted,
      });

      // Atualizar streak
      if (!isCompleted) {
        // Marcar como completo
        const updatedHabits = habits.map((h) => {
          if (h.id === habitId) {
            const newStreak = (h.streak ?? 0) + 1;
            return {
              ...h,
              streak: newStreak,
              bestStreak: Math.max(h.bestStreak ?? 0, newStreak),
              totalCompletions: (h.totalCompletions ?? 0) + 1,
            };
          }
          return h;
        });
        setHabits(updatedHabits);
      } else {
        // Desmarcar (resetar streak se necessário)
        const updatedHabits = habits.map((h) => {
          if (h.id === habitId) {
            return {
              ...h,
              streak: Math.max(0, (h.streak ?? 0) - 1),
            };
          }
          return h;
        });
        setHabits(updatedHabits);
      }
    },
    [habits, completedToday, setCompletedToday, setHabits]
  );

  const renderHabit = useCallback(
    ({ item }: { item: Habit }) => (
      <HabitCard
        habit={item}
        onToggle={handleToggleHabit}
        isCompletedToday={!!completedToday[item.id]}
        colors={colors}
      />
    ),
    [completedToday, handleToggleHabit, colors]
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
      accessible={true}
      accessibilityLabel="Tela de Hábitos"
    >
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
      >
        <View>
          <Text
            style={styles.headerTitle}
            accessibilityRole="header"
            accessibilityLabel="Meus Hábitos"
          >
            Meus Hábitos
          </Text>
          <Text
            style={styles.headerSubtitle}
            accessibilityLabel={`${filteredHabits.length} hábito${filteredHabits.length !== 1 ? 's' : ''} ativo${filteredHabits.length !== 1 ? 's' : ''}`}
          >
            {filteredHabits.length} hábito{filteredHabits.length !== 1 ? 's' : ''} ativo
            {filteredHabits.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo hábito"
          accessibilityHint="Toque para criar um novo hábito"
        >
          <Ionicons name="add" size={24} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <StatsCard
        totalHabits={filteredHabits.length}
        completedToday={completedCount}
        currentStreak={currentStreak}
        completionRate={completionRate}
        colors={colors}
      />

      {/* Weekly Habits Chart */}
      <View
        style={{
          marginHorizontal: Tokens.spacing['5'],
          marginBottom: Tokens.spacing['5'],
        }}
        accessible={true}
        accessibilityLabel="Gráfico de hábitos completados nos últimos 7 dias"
      >
        <HabitsBarChart data={weeklyData} labels={weeklyLabels} />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {HABIT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && {
                  backgroundColor: `${category.color}20`,
                  borderColor: category.color,
                },
              ]}
              onPress={() => {
                haptics.light();
                setSelectedCategory(category.id as HabitCategory | 'all');
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Categoria ${category.name}`}
              accessibilityState={{ selected: isSelected }}
              accessibilityHint={`Toque para ${isSelected ? 'deselecionar' : 'filtrar'} hábitos da categoria ${category.name}`}
            >
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={isSelected ? category.color : colors.text.secondary}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && { color: category.color },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Habits List */}
      {filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.habitsList}
          showsVerticalScrollIndicator={false}
          accessible={false}
        />
      ) : (
        <View
          style={styles.emptyState}
          accessible={true}
          accessibilityLabel={`Nenhum hábito encontrado. ${selectedCategory === 'all' ? 'Adicione seu primeiro hábito!' : 'Nenhum hábito nesta categoria'}`}
        >
          <Ionicons
            name="leaf-outline"
            size={64}
            color={colors.text.tertiary}
            accessible={false}
          />
          <Text style={styles.emptyTitle}>Nenhum hábito encontrado</Text>
          <Text style={styles.emptyText}>
            {selectedCategory === 'all'
              ? 'Adicione seu primeiro hábito!'
              : 'Nenhum hábito nesta categoria'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
