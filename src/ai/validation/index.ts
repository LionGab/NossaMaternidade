/**
 * AI Validation Module
 *
 * Exporta validadores para respostas da NathIA
 */

export {
  validateNathiaResponse,
  quickValidateNathiaResponse,
  suggestImprovements,
  type ValidationCheck,
  type NathiaValidationReport,
} from './nathiaValidator';

export { default as NathiaValidator } from './nathiaValidator';
