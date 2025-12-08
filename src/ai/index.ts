/**
 * AI Module - Índice Principal
 *
 * Exporta todos os módulos de IA do projeto NossaMaternidade
 *
 * ESTRUTURA:
 * - persona/     → Configuração da persona NathIA
 * - prompts/     → System prompts e templates
 * - validation/  → Validadores de resposta
 * - moderation/  → Moderação (crise, médico)
 * - observability/ → Tracking de custos
 */

// ============================================
// PERSONA
// ============================================
export {
  NATHIA_PERSONA,
  NATHIA_EMOJIS,
  NATHIA_CATCHPHRASES,
  getNathiaSystemPrompt,
  validateNathiaResponse as validatePersonaResponse,
  type NathiaPersona,
  type VoiceProfile,
  type ResponseTemplate,
  type TopicTrigger,
} from './persona';

// ============================================
// PROMPTS
// ============================================
export {
  NATHIA_SYSTEM_PROMPT,
  buildNathiaPromptWithContext,
  MEDICAL_REDIRECT_PROMPT,
  CRISIS_RESPONSE_PROMPT,
} from './prompts';

// ============================================
// VALIDATION
// ============================================
export {
  validateNathiaResponse,
  quickValidateNathiaResponse,
  suggestImprovements,
  type ValidationCheck,
  type NathiaValidationReport,
} from './validation';

// ============================================
// MODERATION
// ============================================
export { CrisisDetectionService, type CrisisLevel, type CrisisType, type CrisisDetectionResult } from './moderation';

// ============================================
// LLM CONFIG
// ============================================
export * from './llmConfig';
