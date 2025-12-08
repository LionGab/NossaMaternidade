/**
 * AI Persona Module
 *
 * Exporta configurações e utilitários da persona NathIA
 */

export {
  NATHIA_PERSONA,
  NATHIA_EMOJIS,
  NATHIA_CATCHPHRASES,
  getNathiaSystemPrompt,
  validateNathiaResponse,
  type NathiaPersona,
  type VoiceProfile,
  type ResponseTemplate,
  type TopicTrigger,
  type NathiaValidationResult,
} from './nathia.persona';

export { default as NathiaPersona } from './nathia.persona';
