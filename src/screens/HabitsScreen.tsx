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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.secondary,
    marginBottom: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.elevated,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.secondary,
  },
  habitsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 16,
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
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  habitStats: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text.secondary,
  },
  checkboxContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
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
            {habit.bestStreak > habit.streak && (
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={14} color={colors.text.tertiary} />
                <Text style={styles.statText}>Melhor: {habit.bestStreak}</Text>
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
              <Ionicons name="checkmark" size={20} color="#fff" />
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
  const activeHabits = habits.filter((h) => h.isActive);
  const filteredHabits =
    selectedCategory === 'all'
      ? activeHabits
      : activeHabits.filter((h) => h.category === selectedCategory);

  const completedCount = filteredHabits.filter(
    (h) => completedToday[h.id]
  ).length;
  const completionRate =
    filteredHabits.length > 0 ? (completedCount / filteredHabits.length) * 100 : 0;
  const currentStreak = Math.max(...activeHabits.map((h) => h.streak), 0);

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
            const newStreak = h.streak + 1;
            return {
              ...h,
              streak: newStreak,
              bestStreak: Math.max(h.bestStreak, newStreak),
              totalCompletions: h.totalCompletions + 1,
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
              streak: Math.max(0, h.streak - 1),
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
