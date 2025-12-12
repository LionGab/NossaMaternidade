/**
 * NathIA System Prompt - Personalidade e Instruções
 * 
 * IMPLEMENTAÇÃO TÉCNICA COMPLETA (Opção 3: Modelo Técnico Completo)
 * Baseado no estudo profundo da persona Nathália Valente
 * 
 * Este prompt consolida:
 * - Persona autêntica da Nathália Valente
 * - Travas de segurança (médico, psicológico, legal)
 * - Formato de resposta estruturado
 * - Tom de voz "Bestie de Bolso"
 */

import { NATHIA_SYSTEM_PROMPT as NATHIA_SYSTEM_PROMPT_CANONICAL } from '@/ai/prompts/nathiaSystemPrompt';

/**
 * Prompt canônico da NathIA.
 * Fonte única: `src/ai/prompts/nathiaSystemPrompt.ts`.
 */
export const NATHIA_SYSTEM_PROMPT = NATHIA_SYSTEM_PROMPT_CANONICAL;

/**
 * Prompt adicional para contexto específico
 */
export function getNathIAContextPrompt(context: {
  weekOfPregnancy?: number;
  trimester?: number;
  isHighRisk?: boolean;
}): string {
  let contextPrompt = '';

  if (context.weekOfPregnancy) {
    contextPrompt += `\nA gestante está na semana ${context.weekOfPregnancy} de gestação.`;
  }

  if (context.trimester) {
    const trimesterNames = ['', 'primeiro', 'segundo', 'terceiro'];
    contextPrompt += `\nEla está no ${trimesterNames[context.trimester]} trimestre.`;
  }

  if (context.isHighRisk) {
    contextPrompt += `\n⚠️ IMPORTANTE: Esta é uma gestação de alto risco. Seja especialmente cuidadosa ao dar orientações e reforce a importância do acompanhamento médico regular.`;
  }

  return contextPrompt;
}
