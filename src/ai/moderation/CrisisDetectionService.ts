/**
 * Crisis Detection Service
 * Detecta crises emocionais usando análise de IA
 *
 * Combina:
 * 1. Pattern matching (keywords de crise)
 * 2. Análise de emoção via IA (GPT-4o mini ou Gemini)
 * 3. Scoring de severidade
 */

import { orchestrator } from '../../agents/core/AgentOrchestrator';
import { logger } from '../../utils/logger';
import { MedicalModerationService } from './MedicalModerationService';

/**
 * Níveis de crise detectados
 */
export type CrisisLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'critical';

/**
 * Tipos de crise
 */
export type CrisisType =
  | 'anxiety'           // Ansiedade intensa
  | 'depression'        // Depressão / tristeza profunda
  | 'suicidal_ideation' // Ideação suicida
  | 'self_harm'         // Auto-dano
  | 'panic'             // Ataque de pânico
  | 'overwhelm'         // Sobrecarga emocional extrema
  | 'violence'          // Violência / agressividade
  | 'postpartum';       // Depressão pós-parto específica

/**
 * Resultado da detecção de crise
 */
export interface CrisisDetectionResult {
  level: CrisisLevel;
  types: CrisisType[];
  confidence: number; // 0-1
  shouldUseCrisisSafeModel: boolean;
  urgentResources: string[];
  reasoning: string;
}

/**
 * Análise de emoção retornada pela IA
 */
interface EmotionAnalysis {
  emotions?: string[];
  intensity?: 'low' | 'medium' | 'high';
  needs?: string[];
  crisis_indicators?: string[];
  [key: string]: unknown;
}

/**
 * Serviço de detecção de crise
 */
export class CrisisDetectionService {
  /**
   * Detecta crise em uma mensagem da usuária
   * @param userMessage - Mensagem a analisar
   * @param useAI - Se true, usa análise de IA (mais preciso mas mais lento)
   * @returns Resultado da detecção
   */
  static async detectCrisis(
    userMessage: string,
    useAI: boolean = true
  ): Promise<CrisisDetectionResult> {
    // 1. Pattern matching rápido (sempre executado)
    const patternResult = MedicalModerationService.detectCrisisInUserMessage(
      userMessage
    );

    // Se pattern matching já detectou crise crítica, retornar imediatamente
    if (patternResult.isCrisis && patternResult.categories.length > 0) {
      const criticalTypes = this.mapCategoriesToCrisisTypes(
        patternResult.categories
      );

      return {
        level: 'critical',
        types: criticalTypes,
        confidence: 0.9, // Alta confiança em pattern matching
        shouldUseCrisisSafeModel: true,
        urgentResources: ['CVV: 188', 'SAMU: 192'],
        reasoning:
          'Detectada crise por pattern matching de keywords críticas',
      };
    }

    // 2. Se useAI = true, fazer análise de emoção mais sofisticada
    if (useAI) {
      try {
        const emotionAnalysis = await this.analyzeEmotionWithAI(userMessage);
        return this.interpretEmotionAnalysis(emotionAnalysis, userMessage);
      } catch (error) {
        logger.error('[CrisisDetection] AI analysis failed', error);
        // Fallback para resultado do pattern matching
        return this.createFallbackResult(patternResult.isCrisis);
      }
    }

    // 3. Sem IA, usar apenas pattern matching
    return this.createFallbackResult(patternResult.isCrisis);
  }

  /**
   * Analisa emoção usando IA (GPT-4o-mini ou Gemini)
   */
  private static async analyzeEmotionWithAI(
    userMessage: string
  ): Promise<EmotionAnalysis> {
    // Tentar primeiro com Gemini (mais barato e disponível)
    try {
      const response = await orchestrator.callMCP('googleai', 'analyze.emotion', {
        text: userMessage,
      });

      if (response.success && response.data) {
        return response.data as EmotionAnalysis;
      }
    } catch (error: unknown) {
      const errorContext = error instanceof Error ? { message: error.message } : { error: String(error) };
      logger.debug('[CrisisDetection] Gemini emotion analysis failed, trying OpenAI', errorContext);
    }

    // Fallback para OpenAI se Gemini falhar
    try {
      const response = await orchestrator.callMCP('openai', 'analyze.emotion', {
        text: userMessage,
      });

      if (response.success && response.data) {
        return response.data as EmotionAnalysis;
      }
    } catch (error: unknown) {
      const errorContext = error instanceof Error ? { message: error.message } : { error: String(error) };
      logger.error('[CrisisDetection] OpenAI emotion analysis failed', errorContext);
    }

    // Retornar análise vazia se tudo falhar
    return {};
  }

  /**
   * Interpreta análise de emoção e determina nível de crise
   */
  private static interpretEmotionAnalysis(
    analysis: EmotionAnalysis,
    userMessage: string
  ): CrisisDetectionResult {
    const detectedTypes: CrisisType[] = [];
    let crisisLevel: CrisisLevel = 'none';
    const urgentResources: string[] = [];

    // Mapear emoções para tipos de crise
    const emotions = analysis.emotions || [];
    const intensity = analysis.intensity || 'low';
    const crisisIndicators = analysis.crisis_indicators || [];

    // Detectar ansiedade
    if (
      emotions.some(e =>
        ['ansiedade', 'anxiety', 'pânico', 'panic'].includes(e.toLowerCase())
      )
    ) {
      detectedTypes.push('anxiety');
      if (intensity === 'high') {
        detectedTypes.push('panic');
      }
    }

    // Detectar depressão
    if (
      emotions.some(e =>
        ['tristeza', 'sadness', 'depressão', 'depression', 'desesperança', 'hopelessness'].includes(
          e.toLowerCase()
        )
      )
    ) {
      detectedTypes.push('depression');
    }

    // Detectar sobrecarga
    if (
      emotions.some(e =>
        ['exaustão', 'exhaustion', 'cansaço', 'overwhelm'].includes(e.toLowerCase())
      ) ||
      userMessage.toLowerCase().includes('não aguento')
    ) {
      detectedTypes.push('overwhelm');
    }

    // Detectar indicadores críticos
    if (crisisIndicators.length > 0) {
      const criticalKeywords = ['suicid', 'auto-lesão', 'machucar'];
      const hasCritical = crisisIndicators.some(indicator =>
        criticalKeywords.some(keyword =>
          indicator.toLowerCase().includes(keyword)
        )
      );

      if (hasCritical) {
        detectedTypes.push('suicidal_ideation');
        urgentResources.push('CVV: 188', 'SAMU: 192');
      }
    }

    // Determinar nível de crise baseado em intensidade e tipos
    if (detectedTypes.includes('suicidal_ideation') || detectedTypes.includes('self_harm')) {
      crisisLevel = 'critical';
    } else if (intensity === 'high' && detectedTypes.length >= 2) {
      crisisLevel = 'severe';
    } else if (intensity === 'high' || detectedTypes.length >= 2) {
      crisisLevel = 'moderate';
    } else if (detectedTypes.length > 0) {
      crisisLevel = 'mild';
    }

    // Determinar se deve usar modelo CRISIS_SAFE
    const shouldUseCrisisSafeModel =
      crisisLevel === 'severe' || crisisLevel === 'critical';

    // Gerar reasoning
    const reasoning = `Análise de IA: ${emotions.join(', ')} (intensidade: ${intensity}). Tipos detectados: ${detectedTypes.join(', ')}.`;

    return {
      level: crisisLevel,
      types: detectedTypes,
      confidence: this.calculateConfidence(analysis, detectedTypes),
      shouldUseCrisisSafeModel,
      urgentResources,
      reasoning,
    };
  }

  /**
   * Calcula confiança da detecção
   */
  private static calculateConfidence(
    analysis: EmotionAnalysis,
    detectedTypes: CrisisType[]
  ): number {
    let confidence = 0.5; // Base

    // Aumentar confiança se houver emoções detectadas
    if (analysis.emotions && analysis.emotions.length > 0) {
      confidence += 0.2;
    }

    // Aumentar confiança se intensidade for alta
    if (analysis.intensity === 'high') {
      confidence += 0.2;
    }

    // Aumentar confiança se múltiplos tipos foram detectados
    if (detectedTypes.length >= 2) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Cria resultado fallback quando IA não está disponível
   */
  private static createFallbackResult(
    isCrisis: boolean
  ): CrisisDetectionResult {
    if (isCrisis) {
      return {
        level: 'moderate',
        types: ['anxiety', 'overwhelm'],
        confidence: 0.6,
        shouldUseCrisisSafeModel: true,
        urgentResources: ['CVV: 188'],
        reasoning: 'Detecção por pattern matching (IA indisponível)',
      };
    }

    return {
      level: 'none',
      types: [],
      confidence: 0.8,
      shouldUseCrisisSafeModel: false,
      urgentResources: [],
      reasoning: 'Nenhuma crise detectada',
    };
  }

  /**
   * Mapeia categorias de moderação para tipos de crise
   */
  private static mapCategoriesToCrisisTypes(
    categories: string[]
  ): CrisisType[] {
    const mapping: Record<string, CrisisType> = {
      crisis_mental_health: 'depression',
      self_harm: 'self_harm',
      violence: 'violence',
      emergency: 'panic',
    };

    return categories
      .map(cat => mapping[cat])
      .filter(Boolean) as CrisisType[];
  }

  /**
   * Detecta crise de forma síncrona (apenas pattern matching)
   * Útil quando velocidade é mais importante que precisão
   */
  static detectCrisisSync(userMessage: string): {
    isCrisis: boolean;
    shouldUseCrisisSafeModel: boolean;
  } {
    const result = MedicalModerationService.detectCrisisInUserMessage(
      userMessage
    );

    return {
      isCrisis: result.isCrisis,
      shouldUseCrisisSafeModel: result.isCrisis,
    };
  }
}
