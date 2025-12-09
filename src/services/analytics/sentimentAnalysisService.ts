/**
 * Sentiment Analysis & Behavioral Tracking Service
 *
 * Implements Ecological Momentary Assessment (EMA) principles
 * Based on research from:
 * - Flo (70 questions across 5 health areas)
 * - Ovia (daily habits and symptom tracking)
 * - Clinical mental health assessment standards
 *
 * Purpose:
 * - Track emotional and behavioral patterns over time
 * - Provide personalized insights and recommendations
 * - Detect potential mental health concerns early
 * - Support goal-setting and progress tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase, isSupabaseReady } from '@/services/supabase';
import { logger } from '@/utils/logger';

// ======================
// 🎯 TYPES
// ======================

export interface SentimentScore {
  timestamp: string;
  emotional_state: string;
  intensity: number; // 1-5 scale
  stress_level?: number; // 1-10 scale
  energy_level?: string;
  sleep_quality?: string;
  context?: {
    trigger?: string;
    location?: string;
    activity?: string;
  };
}

export interface BehaviorMetrics {
  timestamp: string;
  date: string; // YYYY-MM-DD
  habits: {
    prenatal_vitamins: boolean;
    exercise: boolean;
    meditation: boolean;
    journaling: boolean;
    water_intake: number; // glasses
    healthy_meals: number; // count
    sleep_hours: number;
  };
  mood_score: number; // 1-10 average for the day
  stress_score: number; // 1-10
  notes?: string;
}

export interface MentalHealthIndicators {
  user_id: string;
  assessment_date: string;
  // Clinical screening (PHQ-2 inspired - 2 question depression screening)
  depression_indicators: {
    little_interest: number; // 0-3 scale (not at all, several days, more than half, nearly every day)
    feeling_down: number; // 0-3 scale
  };
  // GAD-2 inspired (2 question anxiety screening)
  anxiety_indicators: {
    feeling_nervous: number; // 0-3 scale
    cant_stop_worrying: number; // 0-3 scale
  };
  // Additional maternal-specific indicators
  maternal_specific: {
    overwhelming_fatigue: number; // 0-3 scale
    bonding_concerns: number; // 0-3 scale
    support_satisfaction: number; // 1-5 scale
  };
  overall_wellness_score: number; // 0-100 calculated score
  needs_professional_support: boolean; // Auto-flagged if scores indicate concern
}

export interface PersonalizedInsight {
  id: string;
  user_id: string;
  created_at: string;
  type: 'pattern' | 'recommendation' | 'alert' | 'celebration';
  category: 'emotional' | 'behavioral' | 'physical' | 'social';
  title: string;
  message: string;
  actionable_steps?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data_source: {
    sentiment_scores?: SentimentScore[];
    behavior_metrics?: BehaviorMetrics[];
    mental_health_indicators?: MentalHealthIndicators;
  };
}

// ======================
// 🧠 SENTIMENT ANALYSIS SERVICE
// ======================

class SentimentAnalysisService {
  private readonly STORAGE_KEYS = {
    SENTIMENT_HISTORY: 'nath_sentiment_history',
    BEHAVIOR_METRICS: 'nath_behavior_metrics',
    MENTAL_HEALTH_ASSESSMENTS: 'nath_mental_health_assessments',
    LAST_ASSESSMENT_DATE: 'nath_last_assessment_date',
  };

  /**
   * Records a sentiment snapshot (EMA principle - capture emotions in the moment)
   */
  async recordSentiment(sentiment: Omit<SentimentScore, 'timestamp'>): Promise<boolean> {
    try {
      const sentimentScore: SentimentScore = {
        ...sentiment,
        timestamp: new Date().toISOString(),
      };

      // Save locally
      await this.appendToLocalHistory('SENTIMENT_HISTORY', sentimentScore);

      // Save to Supabase if authenticated
      if (isSupabaseReady()) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error } = await supabase.from('sentiment_scores').insert({
            user_id: user.id,
            emotional_state: sentimentScore.emotional_state,
            intensity: sentimentScore.intensity,
            stress_level: sentimentScore.stress_level,
            energy_level: sentimentScore.energy_level,
            sleep_quality: sentimentScore.sleep_quality,
            context: sentimentScore.context,
            recorded_at: sentimentScore.timestamp,
          });

          if (error) {
            logger.warn('Failed to save sentiment to Supabase', error);
          }
        }
      }

      logger.info('Sentiment recorded', {
        emotional_state: sentimentScore.emotional_state,
        intensity: sentimentScore.intensity,
      });

      return true;
    } catch (error) {
      logger.error('Error recording sentiment', error);
      return false;
    }
  }

  /**
   * Records daily behavior metrics (Ovia-inspired habit tracking)
   */
  async recordBehaviorMetrics(metrics: Omit<BehaviorMetrics, 'timestamp'>): Promise<boolean> {
    try {
      const behaviorMetrics: BehaviorMetrics = {
        ...metrics,
        timestamp: new Date().toISOString(),
      };

      // Save locally
      await this.appendToLocalHistory('BEHAVIOR_METRICS', behaviorMetrics);

      // Save to Supabase if authenticated
      if (isSupabaseReady()) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error } = await supabase.from('behavior_metrics').insert({
            user_id: user.id,
            date: behaviorMetrics.date,
            habits: behaviorMetrics.habits,
            mood_score: behaviorMetrics.mood_score,
            stress_score: behaviorMetrics.stress_score,
            notes: behaviorMetrics.notes,
            recorded_at: behaviorMetrics.timestamp,
          });

          if (error) {
            logger.warn('Failed to save behavior metrics to Supabase', error);
          }
        }
      }

      logger.info('Behavior metrics recorded', { date: behaviorMetrics.date });

      return true;
    } catch (error) {
      logger.error('Error recording behavior metrics', error);
      return false;
    }
  }

  /**
   * Performs mental health screening (PHQ-2 + GAD-2 inspired)
   * Should be done weekly or when user requests
   */
  async performMentalHealthAssessment(
    indicators: Omit<MentalHealthIndicators, 'user_id' | 'assessment_date' | 'overall_wellness_score' | 'needs_professional_support'>
  ): Promise<MentalHealthIndicators | null> {
    try {
      // Calculate overall wellness score (0-100)
      const depressionScore =
        (indicators.depression_indicators.little_interest +
          indicators.depression_indicators.feeling_down) /
        6; // 0-1 range
      const anxietyScore =
        (indicators.anxiety_indicators.feeling_nervous +
          indicators.anxiety_indicators.cant_stop_worrying) /
        6; // 0-1 range
      const maternalScore =
        (indicators.maternal_specific.overwhelming_fatigue +
          indicators.maternal_specific.bonding_concerns +
          (5 - indicators.maternal_specific.support_satisfaction)) /
        13; // 0-1 range (inverted support satisfaction)

      // Overall wellness: 100 = excellent, 0 = concerning
      const overall_wellness_score = Math.round(
        100 - (depressionScore + anxietyScore + maternalScore) * 33.33
      );

      // Flag for professional support if:
      // - Depression indicators both >= 2 (more than half the days)
      // - Anxiety indicators both >= 2
      // - Overall wellness score < 50
      const needs_professional_support =
        indicators.depression_indicators.little_interest >= 2 &&
        indicators.depression_indicators.feeling_down >= 2 ||
        indicators.anxiety_indicators.feeling_nervous >= 2 &&
        indicators.anxiety_indicators.cant_stop_worrying >= 2 ||
        overall_wellness_score < 50;

      const assessment: MentalHealthIndicators = {
        user_id: '', // Will be filled below
        assessment_date: new Date().toISOString(),
        depression_indicators: indicators.depression_indicators,
        anxiety_indicators: indicators.anxiety_indicators,
        maternal_specific: indicators.maternal_specific,
        overall_wellness_score,
        needs_professional_support,
      };

      // Save locally
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.MENTAL_HEALTH_ASSESSMENTS,
        JSON.stringify(assessment)
      );
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.LAST_ASSESSMENT_DATE,
        new Date().toISOString()
      );

      // Save to Supabase if authenticated
      if (isSupabaseReady()) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          assessment.user_id = user.id;

          const { error } = await supabase.from('mental_health_assessments').insert({
            user_id: user.id,
            assessment_date: assessment.assessment_date,
            depression_indicators: assessment.depression_indicators,
            anxiety_indicators: assessment.anxiety_indicators,
            maternal_specific: assessment.maternal_specific,
            overall_wellness_score: assessment.overall_wellness_score,
            needs_professional_support: assessment.needs_professional_support,
          });

          if (error) {
            logger.warn('Failed to save mental health assessment to Supabase', error);
          }

          // If needs professional support, create an alert insight
          if (needs_professional_support) {
            await this.createInsight({
              user_id: user.id,
              type: 'alert',
              category: 'emotional',
              title: 'Você merece apoio profissional',
              message:
                'Suas respostas indicam que pode ser útil conversar com um profissional de saúde mental. Não há problema em pedir ajuda – é um sinal de força, não de fraqueza.',
              actionable_steps: [
                'Converse com seu médico sobre como você está se sentindo',
                'Considere procurar um terapeuta especializado em saúde materna',
                'Entre em contato com nossa linha de apoio 24/7',
                'Compartilhe seus sentimentos com alguém de confiança',
              ],
              priority: 'urgent',
              data_source: {
                mental_health_indicators: assessment,
              },
            });
          }
        }
      }

      logger.info('Mental health assessment completed', {
        overall_wellness_score,
        needs_professional_support,
      });

      return assessment;
    } catch (error) {
      logger.error('Error performing mental health assessment', error);
      return null;
    }
  }

  /**
   * Generates personalized insights based on sentiment and behavior patterns
   */
  async generateInsights(userId: string, dayRange: number = 7): Promise<PersonalizedInsight[]> {
    try {
      const insights: PersonalizedInsight[] = [];

      // Get sentiment history
      const sentimentHistory = await this.getSentimentHistory(dayRange);

      // Get behavior metrics
      const behaviorMetrics = await this.getBehaviorMetrics(dayRange);

      // Pattern detection: Consistent low mood
      const lowMoodDays = sentimentHistory.filter(
        (s) => s.intensity <= 2 && ['triste', 'ansiosa', 'cansada'].includes(s.emotional_state)
      ).length;

      if (lowMoodDays >= dayRange * 0.5) {
        insights.push(
          await this.createInsight({
            user_id: userId,
            type: 'pattern',
            category: 'emotional',
            title: 'Padrão de humor baixo detectado',
            message: `Notei que você tem se sentido mais para baixo nos últimos ${dayRange} dias. Isso é comum, mas vamos cuidar de você juntas.`,
            actionable_steps: [
              'Tente uma caminhada de 10 minutos ao ar livre',
              'Converse com alguém que você confia',
              'Faça algo que você gostava antes (hobby, música, etc.)',
              'Considere falar com um profissional se isso continuar',
            ],
            priority: 'high',
            data_source: { sentiment_scores: sentimentHistory },
          })
        );
      }

      // Pattern detection: Sleep issues
      const poorSleepDays = behaviorMetrics.filter((b) => b.habits.sleep_hours < 6).length;

      if (poorSleepDays >= 3) {
        insights.push(
          await this.createInsight({
            user_id: userId,
            type: 'recommendation',
            category: 'physical',
            title: 'Seu sono precisa de atenção',
            message: `Você dormiu menos de 6 horas em ${poorSleepDays} dos últimos ${dayRange} dias. Sono é essencial para sua saúde física e emocional.`,
            actionable_steps: [
              'Tente manter um horário regular para dormir',
              'Evite telas 1 hora antes de dormir',
              'Crie uma rotina relaxante antes de deitar',
              'Converse com seu médico se a insônia persistir',
            ],
            priority: 'medium',
            data_source: { behavior_metrics: behaviorMetrics },
          })
        );
      }

      // Celebration: Consistent healthy habits
      const exerciseDays = behaviorMetrics.filter((b) => b.habits.exercise).length;

      if (exerciseDays >= dayRange * 0.7) {
        insights.push(
          await this.createInsight({
            user_id: userId,
            type: 'celebration',
            category: 'behavioral',
            title: 'Você está arrasando! 🎉',
            message: `Você se exercitou ${exerciseDays} dos últimos ${dayRange} dias! Isso é incrível e faz toda a diferença para seu bem-estar.`,
            priority: 'low',
            data_source: { behavior_metrics: behaviorMetrics },
          })
        );
      }

      return insights;
    } catch (error) {
      logger.error('Error generating insights', error);
      return [];
    }
  }

  /**
   * Creates a personalized insight
   */
  private async createInsight(
    insight: Omit<PersonalizedInsight, 'id' | 'created_at'>
  ): Promise<PersonalizedInsight> {
    const fullInsight: PersonalizedInsight = {
      ...insight,
      id: `insight_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase if authenticated
    if (isSupabaseReady()) {
      try {
        await supabase.from('personalized_insights').insert({
          id: fullInsight.id,
          user_id: fullInsight.user_id,
          type: fullInsight.type,
          category: fullInsight.category,
          title: fullInsight.title,
          message: fullInsight.message,
          actionable_steps: fullInsight.actionable_steps,
          priority: fullInsight.priority,
          data_source: fullInsight.data_source,
          created_at: fullInsight.created_at,
        });
      } catch (error) {
        logger.warn('Failed to save insight to Supabase', error);
      }
    }

    return fullInsight;
  }

  /**
   * Gets sentiment history from local storage
   */
  private async getSentimentHistory(dayRange: number): Promise<SentimentScore[]> {
    try {
      const historyStr = await AsyncStorage.getItem(this.STORAGE_KEYS.SENTIMENT_HISTORY);
      if (!historyStr) return [];

      const history: SentimentScore[] = JSON.parse(historyStr);

      // Filter to date range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dayRange);

      return history.filter((s) => new Date(s.timestamp) >= cutoffDate);
    } catch (error) {
      logger.error('Error getting sentiment history', error);
      return [];
    }
  }

  /**
   * Gets behavior metrics from local storage
   */
  private async getBehaviorMetrics(dayRange: number): Promise<BehaviorMetrics[]> {
    try {
      const metricsStr = await AsyncStorage.getItem(this.STORAGE_KEYS.BEHAVIOR_METRICS);
      if (!metricsStr) return [];

      const metrics: BehaviorMetrics[] = JSON.parse(metricsStr);

      // Filter to date range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dayRange);

      return metrics.filter((m) => new Date(m.timestamp) >= cutoffDate);
    } catch (error) {
      logger.error('Error getting behavior metrics', error);
      return [];
    }
  }

  /**
   * Helper: Appends data to local history array
   */
  private async appendToLocalHistory(key: keyof typeof this.STORAGE_KEYS, data: any) {
    try {
      const existingStr = await AsyncStorage.getItem(this.STORAGE_KEYS[key]);
      const existing = existingStr ? JSON.parse(existingStr) : [];

      existing.push(data);

      // Keep only last 100 entries to avoid storage bloat
      const trimmed = existing.slice(-100);

      await AsyncStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(trimmed));
    } catch (error) {
      logger.error(`Error appending to ${key}`, error);
      throw error;
    }
  }

  /**
   * Checks if user should be prompted for weekly mental health check-in
   */
  async shouldPromptWeeklyCheckIn(): Promise<boolean> {
    try {
      const lastAssessmentStr = await AsyncStorage.getItem(
        this.STORAGE_KEYS.LAST_ASSESSMENT_DATE
      );

      if (!lastAssessmentStr) {
        return true; // Never assessed before
      }

      const lastAssessment = new Date(lastAssessmentStr);
      const daysSinceAssessment =
        (Date.now() - lastAssessment.getTime()) / (1000 * 60 * 60 * 24);

      return daysSinceAssessment >= 7;
    } catch (error) {
      logger.error('Error checking weekly check-in status', error);
      return false;
    }
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();
