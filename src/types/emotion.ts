/**
 * Tipos relacionados ao sistema de check-in emocional
 * Fase 1 - MVP Básico
 */

export type EmotionType = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';

export interface EmotionLog {
  id: string;
  user_id: string;
  emotion: EmotionType;
  intensity?: number; // 1-5 opcional
  notes?: string;
  timestamp: string;
  created_at: string;
}

export interface EmotionStats {
  mostFrequent: EmotionType;
  streak: number; // dias consecutivos de check-in
  lastWeek: EmotionType[];
  needsSupport: boolean; // true se detectar padrão negativo
}

export const EMOTION_EMOJI_MAP: Record<EmotionType, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  angry: '😡',
};

export const EMOTION_LABEL_MAP: Record<EmotionType, string> = {
  happy: 'Feliz',
  neutral: 'Tranquila',
  sad: 'Triste',
  anxious: 'Ansiosa',
  angry: 'Irritada',
};

