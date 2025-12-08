/**
 * NathIA JSON Schema - Output Estruturado
 *
 * Schema para garantir que a resposta da IA siga um formato estruturado
 * quando o app precisar processar dados (ex: extrair sentimento, detectar flags de segurança)
 *
 * INTEGRAÇÃO:
 * - Persona completa: src/ai/persona/nathia.persona.ts
 * - System Prompt: src/ai/prompts/nathia.system.md
 * - Validador: src/ai/validation/nathiaValidator.ts
 */

// Re-exportar tipos da persona para conveniência
export type { NathiaPersona, VoiceProfile, TopicTrigger } from '../../../ai/persona/nathia.persona';

/**
 * Moods possíveis detectados na usuária
 */
export type UserMood = 'feliz' | 'triste' | 'ansiosa' | 'raiva' | 'neutro' | 'exausta' | 'empolgada';

/**
 * Tópicos que a NathIA pode identificar
 */
export type NathiaTopic =
  | 'maternidade'
  | 'relacionamento'
  | 'corpo'
  | 'estética'
  | 'falsidade'
  | 'sucesso'
  | 'saúde'
  | 'geral';

/**
 * Resposta estruturada da NathIA
 */
export interface NathIAResponse {
  /** Breve raciocínio da IA sobre como responder */
  thought_process?: string;

  /** True se a usuária mencionou algo médico/perigoso que ativou o protocolo de segurança */
  safety_flag: boolean;

  /** True se detectou crise emocional (ideação suicida, etc.) */
  crisis_flag?: boolean;

  /** Sentimento detectado na fala da usuária */
  user_mood?: UserMood;

  /** Tópico principal da conversa */
  detected_topic?: NathiaTopic;

  /** A resposta final em texto para ser exibida no chat, seguindo a persona NathIA */
  chat_response: string;

  /** Score de validação da resposta (0-100) */
  validation_score?: number;

  /** Emojis sugeridos para a resposta */
  suggested_emojis?: string[];
}

/**
 * JSON Schema para validação de resposta estruturada
 * Compatível com Gemini Function Calling / Structured Output
 */
export const NATHIA_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    thought_process: {
      type: 'string',
      description:
        'Breve raciocínio da IA sobre como responder (ex: "Usuária triste, preciso validar e levantar o astral").',
    },
    safety_flag: {
      type: 'boolean',
      description:
        'True se a usuária mencionou algo médico/perigoso que ativou o protocolo de segurança.',
    },
    crisis_flag: {
      type: 'boolean',
      description: 'True se detectou crise emocional (ideação suicida, automutilação, etc.).',
    },
    user_mood: {
      type: 'string',
      enum: ['feliz', 'triste', 'ansiosa', 'raiva', 'neutro', 'exausta', 'empolgada'],
      description: 'Sentimento detectado na fala da usuária.',
    },
    detected_topic: {
      type: 'string',
      enum: ['maternidade', 'relacionamento', 'corpo', 'estética', 'falsidade', 'sucesso', 'saúde', 'geral'],
      description: 'Tópico principal detectado na conversa.',
    },
    chat_response: {
      type: 'string',
      description:
        'A resposta final em texto para ser exibida no chat, seguindo a persona NathIA.',
    },
    validation_score: {
      type: 'number',
      description: 'Score de validação da resposta (0-100).',
    },
    suggested_emojis: {
      type: 'array',
      items: { type: 'string' },
      description: 'Emojis sugeridos para a resposta.',
    },
  },
  required: ['chat_response', 'safety_flag'],
} as const;

/**
 * Configuração de geração otimizada para NathIA
 * Baseada no estudo técnico completo
 */
export const NATHIA_GENERATION_CONFIG = {
  temperature: 0.85, // Permite expressividade com gírias sem perder coerência
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 500, // Respostas concisas para chat mobile
  stopSequences: [],
} as const;

