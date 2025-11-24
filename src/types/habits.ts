/**
 * Tipos para sistema de hábitos
 */

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string; // Nome do ícone Ionicons
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  streak: number; // Sequência atual
  bestStreak: number; // Melhor sequência
  totalCompletions: number;
  createdAt: number;
  isActive: boolean;
  reminderTime?: string; // HH:mm format
}

export type HabitCategory =
  | 'autocuidado'
  | 'saude'
  | 'alimentacao'
  | 'exercicio'
  | 'sono'
  | 'social'
  | 'produtividade'
  | 'bemestar';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // 0-100
}

