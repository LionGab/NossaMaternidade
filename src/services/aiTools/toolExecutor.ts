/**
 * Executor de Tools da NathIA
 * Executa as ferramentas chamadas pela IA e retorna resultados estruturados
 */

// supabase não utilizado - removido
import type { AIToolCall, AIToolResult } from '@/types/ai';
import { logger } from '@/utils/logger';

import { checkInService, feedService, habitsService, profileService } from '@/services';

class AIToolExecutor {
  /**
   * Executa a ferramenta chamada pela IA
   */
  async executeTool(toolCall: AIToolCall, userId: string): Promise<AIToolResult> {
    try {
      logger.info('[AIToolExecutor] Executando tool', {
        tool: toolCall.name,
        userId,
        parameters: toolCall.parameters,
      });

      switch (toolCall.name) {
        case 'check_pregnancy_week':
          return await this.checkPregnancyWeek(userId);

        case 'get_emotion_history':
          return await this.getEmotionHistory(userId, (toolCall.parameters.days as number) || 7);

        case 'search_content':
          return await this.searchContent(
            toolCall.parameters.query as string,
            toolCall.parameters.category as string | undefined
          );

        case 'get_habits_status':
          return await this.getHabitsStatus(
            userId,
            (toolCall.parameters.date as string) || this.getTodayDate()
          );

        case 'detect_crisis':
          return await this.detectCrisis(toolCall.parameters.message as string);

        case 'recommend_professional':
          return this.recommendProfessional(toolCall.parameters.reason as string);

        default:
          logger.error('[AIToolExecutor] Tool não encontrada', null, {
            tool: toolCall.name,
            userId,
          });
          return {
            success: false,
            error: `Ferramenta ${toolCall.name} não encontrada`,
          };
      }
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao executar tool', error, {
        tool: toolCall.name,
        userId,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Tool 1: Verifica semana de gestação
   */
  private async checkPregnancyWeek(userId: string): Promise<AIToolResult> {
    try {
      const profile = await profileService.getCurrentProfile();

      if (!profile || profile.id !== userId) {
        return {
          success: false,
          message: 'Perfil não encontrado',
        };
      }

      if (!profile.pregnancy_week) {
        return {
          success: true,
          data: {
            found: false,
            message: 'Usuária não está em fase de gestação',
          },
        };
      }

      const trimester = this.calculateTrimester(profile.pregnancy_week);
      const daysRemaining = profile.baby_birth_date
        ? this.calculateDaysRemaining(profile.baby_birth_date)
        : null;

      return {
        success: true,
        data: {
          found: true,
          week: profile.pregnancy_week,
          trimester,
          due_date: profile.baby_birth_date,
          days_remaining: daysRemaining,
          baby_name: profile.baby_name,
        },
      };
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao verificar gestação', error, { userId });
      return {
        success: false,
        error: 'Erro ao buscar informações de gestação',
      };
    }
  }

  /**
   * Tool 2: Histórico emocional
   */
  private async getEmotionHistory(userId: string, days: number): Promise<AIToolResult> {
    try {
      const history = await checkInService.getCheckInHistory(days);

      if (!history || history.length === 0) {
        return {
          success: true,
          data: {
            found: false,
            emotions: [],
            message: 'Nenhum registro emocional encontrado',
          },
        };
      }

      // Mapear EmotionValue (legacy) para EmotionType
      const emotionMap: Record<string, string> = {
        bem: 'happy',
        triste: 'sad',
        ansiosa: 'anxious',
        cansada: 'neutral',
        calma: 'neutral',
      };

      // Análise de padrão
      const emotions = history.map((log) => emotionMap[log.emotion] || 'neutral');
      const negativeCount = emotions.filter((e) => ['sad', 'anxious', 'angry'].includes(e)).length;
      const needsSupport = negativeCount > emotions.length * 0.6;

      return {
        success: true,
        data: {
          found: true,
          emotions,
          total_days: history.length,
          negative_count: negativeCount,
          pattern: needsSupport ? 'preocupante' : 'normal',
          suggestion: needsSupport
            ? 'Percebi que você tem se sentido mais pra baixo nos últimos dias. Quer conversar sobre isso?'
            : null,
        },
      };
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao buscar histórico emocional', error, {
        userId,
        days,
      });
      return {
        success: false,
        error: 'Erro ao buscar histórico emocional',
      };
    }
  }

  /**
   * Tool 3: Busca conteúdo
   */
  private async searchContent(query: string, category?: string): Promise<AIToolResult> {
    try {
      const content = await feedService.getRecommendedContent(5);

      if (!content || content.length === 0) {
        return {
          success: true,
          data: {
            found: false,
            message: `Não encontrei conteúdo sobre "${query}"`,
          },
        };
      }

      // Filtrar por query (busca simples por título/descrição)
      const filtered = content.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          (category && item.category === category)
      );

      if (filtered.length === 0) {
        return {
          success: true,
          data: {
            found: false,
            message: `Não encontrei conteúdo sobre "${query}"`,
          },
        };
      }

      return {
        success: true,
        data: {
          found: true,
          count: filtered.length,
          results: filtered.slice(0, 3).map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            type: c.type,
            category: c.category,
          })),
        },
      };
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao buscar conteúdo', error, {
        query,
        category,
      });
      return {
        success: false,
        error: 'Erro ao buscar conteúdo',
      };
    }
  }

  /**
   * Tool 4: Status dos hábitos
   */
  private async getHabitsStatus(userId: string, date: string): Promise<AIToolResult> {
    try {
      const habits = await habitsService.getUserHabits();

      if (!habits || habits.length === 0) {
        return {
          success: true,
          data: {
            found: false,
            message: 'Nenhum hábito cadastrado',
          },
        };
      }

      const completed = habits.filter((h) => h.today_completed).length;
      const total = habits.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        success: true,
        data: {
          found: true,
          completed,
          total,
          percentage,
          habits: habits.map((h) => ({
            id: h.id,
            title: h.custom_name || h.habit?.name || 'Hábito',
            completed: h.today_completed,
            streak: h.current_streak || 0,
          })),
        },
      };
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao buscar status dos hábitos', error, {
        userId,
        date,
      });
      return {
        success: false,
        error: 'Erro ao buscar hábitos',
      };
    }
  }

  /**
   * Tool 5: Detecção de crise
   */
  private async detectCrisis(message: string): Promise<AIToolResult> {
    try {
      const crisisKeywords = [
        'suicídio',
        'suicidio',
        'acabar com tudo',
        'não aguento mais',
        'quero morrer',
        'machucar',
        'desistir de tudo',
        'não vale a pena',
        'sem esperança',
        'sem saída',
      ];

      const lowerMessage = message.toLowerCase();
      const hasCrisisKeyword = crisisKeywords.some((keyword) => lowerMessage.includes(keyword));

      return {
        success: true,
        data: {
          is_crisis: hasCrisisKeyword,
          severity: hasCrisisKeyword ? 'alta' : 'baixa',
          action_required: hasCrisisKeyword ? 'immediate_support' : 'none',
        },
      };
    } catch (error) {
      logger.error('[AIToolExecutor] Erro ao detectar crise', error);
      return {
        success: false,
        error: 'Erro ao analisar mensagem',
      };
    }
  }

  /**
   * Tool 6: Recomenda profissional
   */
  private recommendProfessional(reason: string): AIToolResult {
    return {
      success: true,
      data: {
        type: 'professional_referral',
        message:
          '💜 Entendo o que você está sentindo. Gostaria de sugerir conversar com um profissional de saúde mental especializado em maternidade. Posso te ajudar a encontrar recursos?',
        resources: [
          {
            name: 'CVV',
            phone: '188',
            description: 'Centro de Valorização da Vida - 24h',
            available: true,
          },
          {
            name: 'Terapia Online',
            url: 'https://www.psicologiaviva.com.br',
            description: 'Psicólogos especializados em maternidade',
            available: true,
          },
        ],
        reason,
      },
    };
  }

  /**
   * Helpers
   */
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private calculateTrimester(week: number): number {
    if (week < 13) return 1;
    if (week < 27) return 2;
    return 3;
  }

  private calculateDaysRemaining(dueDate: string): number | null {
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diff = due.getTime() - today.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  }
}

export const aiToolExecutor = new AIToolExecutor();
export { AIToolExecutor };
