/**
 * Builder de System Instruction para NathIA
 *
 * Combina:
 * - Prompt fixo consolidado (NATHIA_SYSTEM_PROMPT)
 * - Regras obrigatórias
 * - Contexto do usuário (opcional)
 */

import type { AIContext } from '@/types/ai';
import { logger } from '@/utils/logger';

// Import direto (mais seguro e eficiente no React Native/Expo)
// O prompt é carregado apenas quando este módulo é importado, não na inicialização do app
import { NATHIA_SYSTEM_PROMPT, NATHIA_MANDATORY_RULES } from '@/ai/prompts/nathiaSystemPrompt';

/**
 * Constrói system instruction completa para a NathIA
 *
 * @param context - Contexto opcional do usuário (nome, fase, semana de gravidez)
 * @returns System instruction completa pronta para enviar aos modelos de IA
 */
export function buildSystemInstruction(context?: AIContext): string {
  try {
    return buildInstructionWithCache(context, NATHIA_SYSTEM_PROMPT, NATHIA_MANDATORY_RULES);
  } catch (error) {
    logger.error('[buildSystemInstruction] Erro ao construir instruction', error);
    // Fallback mínimo para garantir que o app continue funcionando
    return `Você é NathIA, uma assistente maternal empática e acolhedora baseada em Nathália Valente.`;
  }
}

/**
 * Constrói a instruction usando prompt e regras já carregados
 */
function buildInstructionWithCache(
  context: AIContext | undefined,
  prompt: string,
  rules: string
): string {
  const parts: string[] = [prompt];

  // Adicionar contexto do usuário se disponível
  if (context) {
    const contextParts: string[] = [];

    if (context.name) {
      contextParts.push(`Nome da usuária: ${context.name}`);
    }

    if (context.phase) {
      contextParts.push(`Fase: ${context.phase}`);
    }

    if (context.pregnancy_week) {
      contextParts.push(`Semana de gravidez: ${context.pregnancy_week}`);
    }

    if (contextParts.length > 0) {
      parts.push(`\nCONTEXTO DA USUÁRIA ATUAL: [ ${contextParts.join(', ')} ]`);
      parts.push('Use o nome dela se souber. Adapte a resposta para a fase e desafios dela.');
    }
  }

  // Adicionar regras obrigatórias no final
  parts.push(rules);

  return parts.join('\n\n');
}
