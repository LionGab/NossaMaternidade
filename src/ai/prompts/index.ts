/**
 * AI Prompts Module
 *
 * Exporta system prompts e templates
 */

import { NATHIA_PERSONA, NATHIA_CATCHPHRASES } from '../persona/nathia.persona';
import { NATHIA_SYSTEM_PROMPT as NATHIA_SYSTEM_PROMPT_CANONICAL } from './nathiaSystemPrompt';

// Exportar prompt consolidado canônico (versão 2.0.0)
export {
  NATHIA_SYSTEM_PROMPT_VERSION,
  NATHIA_MANDATORY_RULES,
  NATHIA_SYSTEM_PROMPT as NATHIA_SYSTEM_PROMPT_V2,
} from './nathiaSystemPrompt';

/**
 * System prompt canônico da NathIA.
 * Mantém compatibilidade com imports antigos: `import { NATHIA_SYSTEM_PROMPT } from '@/ai/prompts'`
 */
export const NATHIA_SYSTEM_PROMPT = NATHIA_SYSTEM_PROMPT_CANONICAL;

/**
 * Template de prompt para contexto adicional
 */
export function buildNathiaPromptWithContext(
  userMessage: string,
  context?: {
    userEmotion?: string;
    lifeStage?: string;
    recentTopics?: string[];
    userName?: string;
  }
): string {
  let contextBlock = '';

  if (context) {
    contextBlock = `

## CONTEXTO DA USUÁRIA
${context.userName ? `- Nome: ${context.userName}` : ''}
${context.userEmotion ? `- Estado emocional: ${context.userEmotion}` : ''}
${context.lifeStage ? `- Fase de vida: ${context.lifeStage}` : ''}
${context.recentTopics?.length ? `- Temas recentes: ${context.recentTopics.join(', ')}` : ''}
`;
  }

  return `${NATHIA_SYSTEM_PROMPT_CANONICAL}${contextBlock}

## MENSAGEM DA USUÁRIA
"${userMessage}"

## SUA RESPOSTA (como NathIA):`;
}

/**
 * Prompt para redirecionamento médico
 */
export const MEDICAL_REDIRECT_PROMPT = `Amor, para. Isso aí é com médico, tá? Não brinca com saúde. Corre lá ver isso e depois me conta. Vou ficar preocupada até você ir. Promete? 💙`;

/**
 * Prompt para crise emocional
 */
export const CRISIS_RESPONSE_PROMPT = `Eu tô aqui com você, mas isso é muito sério. 💙

🆘 Por favor, procure ajuda profissional AGORA:
• CVV: 188 (24h, gratuito)
• SAMU: 192
• CAPS mais próximo

Você não está sozinha. Há pessoas prontas para te ajudar.`;

/**
 * Bordões organizados por tipo
 */
export { NATHIA_CATCHPHRASES };

/**
 * Persona completa
 */
export { NATHIA_PERSONA };
