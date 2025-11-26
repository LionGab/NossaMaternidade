/**
 * Medical Moderation Service
 * Guard-rails de segurança para respostas de IA em contexto de saúde maternal
 *
 * CRÍTICO: Este serviço protege usuárias identificando:
 * - Conteúdo médico que requer profissional
 * - Sinais de crise emocional (depressão pós-parto, ideação suicida)
 * - Informações incorretas ou perigosas
 * - Necessidade de disclaimers
 */

import { logger } from '../../utils/logger';

/**
 * Níveis de severidade de moderação
 */
export type ModerationSeverity = 'safe' | 'warning' | 'critical' | 'blocked';

/**
 * Categorias de moderação
 */
export type ModerationCategory =
  | 'medical_advice'        // Conselho médico que deveria vir de profissional
  | 'crisis_mental_health'  // Crise de saúde mental
  | 'self_harm'             // Auto-dano ou ideação suicida
  | 'violence'              // Violência doméstica
  | 'medication'            // Prescrição ou recomendação de medicamentos
  | 'diagnosis'             // Tentativa de diagnóstico
  | 'emergency'             // Situação de emergência médica
  | 'misinformation';       // Informação incorreta ou perigosa

/**
 * Resultado da moderação
 */
export interface ModerationResult {
  severity: ModerationSeverity;
  categories: ModerationCategory[];
  shouldBlock: boolean;
  disclaimer?: string;
  emergencyResources?: string[];
  reasoning: string;
}

/**
 * Padrões de detecção de conteúdo sensível
 */
const MODERATION_PATTERNS = {
  // Crise de saúde mental
  crisis: {
    keywords: [
      'suicídio', 'suicida', 'me matar', 'acabar com tudo',
      'não aguento mais', 'não quero viver', 'quero morrer',
      'fim da linha', 'desistir de viver',
    ],
    severity: 'critical' as ModerationSeverity,
    category: 'crisis_mental_health' as ModerationCategory,
  },

  // Auto-dano
  selfHarm: {
    keywords: [
      'me cortar', 'me machucar', 'cortes nos braços',
      'auto-lesão', 'automutilação', 'me ferir',
    ],
    severity: 'critical' as ModerationSeverity,
    category: 'self_harm' as ModerationCategory,
  },

  // Violência
  violence: {
    keywords: [
      'machucar o bebê', 'fazer mal ao bebê', 'violência doméstica',
      'agressão', 'bater', 'abuso',
    ],
    severity: 'critical' as ModerationSeverity,
    category: 'violence' as ModerationCategory,
  },

  // Medicação
  medication: {
    keywords: [
      'tomar remédio', 'prescrever', 'dose de', 'medicamento',
      'antidepressivo', 'ansiolítico', 'fluoxetina', 'sertralina',
      'paracetamol', 'dipirona', 'antibiótico',
    ],
    severity: 'warning' as ModerationSeverity,
    category: 'medication' as ModerationCategory,
  },

  // Diagnóstico
  diagnosis: {
    keywords: [
      'você tem', 'diagnóstico de', 'sofre de',
      'depressão pós-parto', 'transtorno', 'síndrome',
    ],
    severity: 'warning' as ModerationSeverity,
    category: 'diagnosis' as ModerationCategory,
  },

  // Emergência médica
  emergency: {
    keywords: [
      'sangramento intenso', 'hemorragia', 'febre alta',
      'dor intensa', 'convulsão', 'desmaio', 'falta de ar',
      'bebê não mexe', 'não respira',
    ],
    severity: 'critical' as ModerationSeverity,
    category: 'emergency' as ModerationCategory,
  },
};

/**
 * Disclaimers padrão por categoria
 */
const DISCLAIMERS = {
  medical_advice: `
⚠️ **Importante:** Sou uma assistente virtual e NÃO substituo consultas médicas. Para questões de saúde, sempre consulte seu médico, obstetra ou pediatra.
`,

  crisis_mental_health: `
🆘 **ATENÇÃO - APOIO PROFISSIONAL DISPONÍVEL:**

Se você está passando por um momento muito difícil, saiba que você não está sozinha e há ajuda disponível:

📞 **CVV (Centro de Valorização da Vida):** 188
   Atendimento gratuito 24h, todos os dias

📞 **SAMU:** 192
   Emergências médicas

💙 Por favor, considere também conversar com um profissional de saúde mental. Você merece apoio especializado.
`,

  self_harm: `
🆘 **ATENÇÃO - VOCÊ MERECE AJUDA:**

Se você está pensando em se machucar, por favor, procure ajuda imediata:

📞 **CVV:** 188 (gratuito, 24h)
📞 **SAMU:** 192
🏥 Pronto-socorro mais próximo

Você não precisa passar por isso sozinha. Há profissionais prontos para te ajudar.
`,

  violence: `
🆘 **ATENÇÃO - VIOLÊNCIA DOMÉSTICA:**

Se você ou seu bebê estão em situação de violência, há ajuda disponível:

📞 **Ligue 180:** Central de Atendimento à Mulher (gratuito, 24h)
📞 **Polícia Militar:** 190
🏛️ Delegacia da Mulher mais próxima

Você tem direito à proteção e segurança.
`,

  medication: `
⚠️ **Sobre Medicamentos:** Não posso prescrever ou recomendar medicamentos. Apenas médicos podem fazer isso com segurança. Consulte seu médico antes de tomar qualquer medicação.
`,

  diagnosis: `
⚠️ **Importante:** Não posso diagnosticar condições de saúde. Se você está preocupada com seus sintomas, consulte um profissional de saúde para avaliação adequada.
`,

  emergency: `
🚨 **EMERGÊNCIA MÉDICA:**

Se você ou seu bebê estão em emergência médica:

📞 **SAMU:** 192
🏥 Vá ao pronto-socorro IMEDIATAMENTE

Não espere - situações de emergência requerem atendimento médico urgente.
`,

  misinformation: `
⚠️ **Importante:** As informações que forneço são baseadas em conhecimento geral. Para orientações específicas sobre sua saúde ou do seu bebê, consulte sempre um profissional de saúde.
`,
};

/**
 * Serviço de moderação médica
 */
export class MedicalModerationService {
  /**
   * Modera uma resposta de IA antes de enviá-la à usuária
   * @param aiResponse - Resposta gerada pela IA
   * @param userMessage - Mensagem original da usuária (para contexto)
   * @returns Resultado da moderação
   */
  static moderateResponse(
    aiResponse: string,
    userMessage: string
  ): ModerationResult {
    const detectedCategories: ModerationCategory[] = [];
    let highestSeverity: ModerationSeverity = 'safe';
    const emergencyResources: string[] = [];

    // Normalizar textos para análise
    const normalizedResponse = aiResponse.toLowerCase();
    const normalizedUserMessage = userMessage.toLowerCase();

    // Verificar cada padrão de moderação
    for (const [patternName, pattern] of Object.entries(MODERATION_PATTERNS)) {
      const foundInResponse = pattern.keywords.some(keyword =>
        normalizedResponse.includes(keyword)
      );
      const foundInUserMessage = pattern.keywords.some(keyword =>
        normalizedUserMessage.includes(keyword)
      );

      if (foundInResponse || foundInUserMessage) {
        detectedCategories.push(pattern.category);

        // Atualizar severidade se for mais grave
        if (this.compareSeverity(pattern.severity, highestSeverity) > 0) {
          highestSeverity = pattern.severity;
        }

        // Adicionar recursos de emergência se necessário
        if (pattern.severity === 'critical') {
          emergencyResources.push(pattern.category);
        }
      }
    }

    // Determinar se deve bloquear a resposta
    const shouldBlock = highestSeverity === 'blocked';

    // Gerar disclaimer apropriado
    const disclaimer = this.generateDisclaimer(detectedCategories);

    // Gerar reasoning
    const reasoning = this.generateReasoning(
      detectedCategories,
      highestSeverity
    );

    return {
      severity: highestSeverity,
      categories: [...new Set(detectedCategories)], // Remove duplicatas
      shouldBlock,
      disclaimer,
      emergencyResources:
        emergencyResources.length > 0 ? emergencyResources : undefined,
      reasoning,
    };
  }

  /**
   * Compara duas severidades
   * @returns Positivo se s1 > s2, negativo se s1 < s2, 0 se igual
   */
  private static compareSeverity(
    s1: ModerationSeverity,
    s2: ModerationSeverity
  ): number {
    const levels = {
      safe: 0,
      warning: 1,
      critical: 2,
      blocked: 3,
    };
    return levels[s1] - levels[s2];
  }

  /**
   * Gera disclaimer combinado para as categorias detectadas
   */
  private static generateDisclaimer(
    categories: ModerationCategory[]
  ): string | undefined {
    if (categories.length === 0) return undefined;

    // Priorizar disclaimers críticos
    const criticalCategories = categories.filter(cat =>
      ['crisis_mental_health', 'self_harm', 'violence', 'emergency'].includes(cat)
    );

    if (criticalCategories.length > 0) {
      // Usar o disclaimer do primeiro crítico encontrado
      return DISCLAIMERS[criticalCategories[0]];
    }

    // Combinar disclaimers não-críticos
    const disclaimers = categories
      .map(cat => DISCLAIMERS[cat])
      .filter(Boolean)
      .join('\n\n');

    return disclaimers || undefined;
  }

  /**
   * Gera explicação do resultado da moderação (para logs)
   */
  private static generateReasoning(
    categories: ModerationCategory[],
    severity: ModerationSeverity
  ): string {
    if (categories.length === 0) {
      return 'Conteúdo aprovado sem restrições';
    }

    const categoryNames = categories.join(', ');
    return `Detectadas categorias sensíveis: ${categoryNames}. Severidade: ${severity}.`;
  }

  /**
   * Aplica moderação a uma resposta, modificando-a se necessário
   * @param aiResponse - Resposta original da IA
   * @param userMessage - Mensagem da usuária
   * @returns Resposta moderada (com disclaimer se necessário)
   */
  static applyModeration(
    aiResponse: string,
    userMessage: string
  ): {
    moderatedResponse: string;
    result: ModerationResult;
  } {
    const result = this.moderateResponse(aiResponse, userMessage);

    // Log da moderação
    if (result.severity !== 'safe') {
      logger.warn('[MedicalModeration] Moderação aplicada', {
        severity: result.severity,
        categories: result.categories,
        shouldBlock: result.shouldBlock,
      });
    }

    // Se deve bloquear, substituir resposta
    if (result.shouldBlock) {
      return {
        moderatedResponse: this.getBlockedResponseMessage(result.categories),
        result,
      };
    }

    // Adicionar disclaimer se necessário
    let moderatedResponse = aiResponse;
    if (result.disclaimer) {
      moderatedResponse = `${result.disclaimer}\n\n${aiResponse}`;
    }

    return {
      moderatedResponse,
      result,
    };
  }

  /**
   * Mensagem para resposta bloqueada
   */
  private static getBlockedResponseMessage(
    categories: ModerationCategory[]
  ): string {
    return `
Percebi que sua mensagem toca em temas muito sérios e importantes.

${this.generateDisclaimer(categories)}

Estou aqui para te apoiar, mas para questões como esta, é fundamental ter acompanhamento profissional especializado. Você não precisa passar por isso sozinha.
`;
  }

  /**
   * Verifica se uma mensagem da usuária indica crise
   * (útil para selecionar modelo apropriado ANTES de chamar IA)
   */
  static detectCrisisInUserMessage(userMessage: string): {
    isCrisis: boolean;
    categories: ModerationCategory[];
  } {
    const normalizedMessage = userMessage.toLowerCase();
    const detectedCategories: ModerationCategory[] = [];

    // Verificar padrões críticos
    const criticalPatterns = [
      MODERATION_PATTERNS.crisis,
      MODERATION_PATTERNS.selfHarm,
      MODERATION_PATTERNS.violence,
      MODERATION_PATTERNS.emergency,
    ];

    for (const pattern of criticalPatterns) {
      const found = pattern.keywords.some(keyword =>
        normalizedMessage.includes(keyword)
      );
      if (found) {
        detectedCategories.push(pattern.category);
      }
    }

    return {
      isCrisis: detectedCategories.length > 0,
      categories: detectedCategories,
    };
  }
}
