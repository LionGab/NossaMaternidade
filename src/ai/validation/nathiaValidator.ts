/**
 * NathIA Response Validator
 *
 * Valida se as respostas da IA estão no tom correto da NathIA
 * Baseado no checklist do estudo de persona
 */

import { logger } from '../../utils/logger';
import { NATHIA_PERSONA, NATHIA_CATCHPHRASES, NATHIA_EMOJIS } from '../persona/nathia.persona';

// ============================================
// TIPOS
// ============================================

export interface ValidationCheck {
  name: string;
  passed: boolean;
  weight: number;
  message?: string;
}

export interface NathiaValidationReport {
  isValid: boolean;
  overallScore: number;
  checks: ValidationCheck[];
  criticalIssues: string[];
  suggestions: string[];
  timestamp: string;
}

// ============================================
// PATTERNS DE DETECÇÃO
// ============================================

/**
 * Padrões que indicam conselho médico (CRÍTICO)
 */
const MEDICAL_ADVICE_PATTERNS = [
  /você (deve|precisa|tem que) tomar/i,
  /tome (esse|este|o) (medicamento|remédio)/i,
  /o diagnóstico é/i,
  /você (tem|está com) (depressão|ansiedade|mastite|infecção)/i,
  /prescrevo/i,
  /a dose (é|deve ser|recomendada)/i,
  /suspenda a (medicação|medicamento)/i,
  /isso é sintoma de/i,
  /você precisa de (antibiótico|medicamento)/i,
];

/**
 * Padrões que indicam tom formal demais
 */
const FORMAL_PATTERNS = [
  /prezad[ao]/i,
  /conforme (mencionado|dito)/i,
  /ademais/i,
  /destarte/i,
  /outrossim/i,
  /em virtude de/i,
  /tendo em vista/i,
  /no que tange/i,
  /cumpre ressaltar/i,
  /é mister/i,
];

/**
 * Padrões de tom de "guru perfeita" (evitar)
 */
const GURU_PATTERNS = [
  /você só precisa/i,
  /é só fazer/i,
  /basta você/i,
  /simplesmente/i,
  /facilmente você/i,
  /sempre funciona/i,
  /garanto que/i,
  /100% certeza/i,
];

/**
 * Padrões de validação emocional (positivo)
 */
const EMOTIONAL_VALIDATION_PATTERNS = [
  /entendo/i,
  /compreendo/i,
  /te escuto/i,
  /é normal/i,
  /você não está sozinha/i,
  /eu também/i,
  /já passei por isso/i,
  /sei como é/i,
  /te acolho/i,
  /tô aqui/i,
];

/**
 * Gírias características da NathIA
 */
const SLANG_PATTERNS = [
  /mano/i,
  /tipo assim/i,
  /surreal/i,
  /tá gritando/i,
  /velho/i,
  /amiga/i,
  /sério/i,
  /gente/i,
];

// ============================================
// VALIDADOR PRINCIPAL
// ============================================

/**
 * Valida uma resposta da NathIA
 * @param response - Texto da resposta
 * @param context - Contexto opcional (tema, emoção do usuário)
 */
export function validateNathiaResponse(
  response: string,
  context?: {
    userMessage?: string;
    topic?: string;
    userEmotion?: string;
  }
): NathiaValidationReport {
  const checks: ValidationCheck[] = [];
  const criticalIssues: string[] = [];
  const suggestions: string[] = [];

  // ============================================
  // CHECK 1: Conselho Médico (CRÍTICO)
  // ============================================
  const hasMedicalAdvice = MEDICAL_ADVICE_PATTERNS.some((pattern) =>
    pattern.test(response)
  );
  checks.push({
    name: 'Sem conselho médico',
    passed: !hasMedicalAdvice,
    weight: 30, // Peso alto
    message: hasMedicalAdvice
      ? 'CRÍTICO: Detectado possível conselho médico'
      : undefined,
  });
  if (hasMedicalAdvice) {
    criticalIssues.push(
      'Resposta contém conselho médico. DEVE redirecionar para profissional.'
    );
  }

  // ============================================
  // CHECK 2: Presença de Gírias/Bordões
  // ============================================
  const hasSlang = SLANG_PATTERNS.some((pattern) => pattern.test(response));
  const hasCatchphrase = NATHIA_PERSONA.voiceProfile.catchphrases.some(
    (phrase) => response.toLowerCase().includes(phrase.toLowerCase().replace('...', ''))
  );
  checks.push({
    name: 'Vocabulário característico',
    passed: hasSlang || hasCatchphrase || response.length < 50,
    weight: 10,
    message:
      !hasSlang && !hasCatchphrase && response.length >= 50
        ? 'Falta gírias/bordões característicos'
        : undefined,
  });
  if (!hasSlang && !hasCatchphrase && response.length >= 50) {
    suggestions.push(
      'Adicione expressões como "tipo assim", "mano", "surreal", "amiga"'
    );
  }

  // ============================================
  // CHECK 3: Emojis
  // ============================================
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(response);
  checks.push({
    name: 'Presença de emojis',
    passed: hasEmoji || response.length < 30,
    weight: 5,
    message: !hasEmoji && response.length >= 30 ? 'Sem emojis' : undefined,
  });
  if (!hasEmoji && response.length >= 30) {
    suggestions.push('Adicione emojis para dar tom (💖, 🔥, ✨, 🤡)');
  }

  // ============================================
  // CHECK 4: Tamanho (não pode ser textão)
  // ============================================
  const isToLong = response.length > 800;
  checks.push({
    name: 'Tamanho adequado',
    passed: !isToLong,
    weight: 15,
    message: isToLong ? 'Resposta muito longa (textão)' : undefined,
  });
  if (isToLong) {
    suggestions.push('Reduza para 2-4 parágrafos curtos');
  }

  // ============================================
  // CHECK 5: Tom Formal
  // ============================================
  const hasFormalTone = FORMAL_PATTERNS.some((pattern) =>
    pattern.test(response)
  );
  checks.push({
    name: 'Tom informal adequado',
    passed: !hasFormalTone,
    weight: 15,
    message: hasFormalTone ? 'Tom muito formal detectado' : undefined,
  });
  if (hasFormalTone) {
    criticalIssues.push('Tom muito formal - não parece a NathIA');
    suggestions.push('Use linguagem mais casual e direta');
  }

  // ============================================
  // CHECK 6: Tom de Guru (evitar)
  // ============================================
  const hasGuruTone = GURU_PATTERNS.some((pattern) => pattern.test(response));
  checks.push({
    name: 'Sem tom de guru',
    passed: !hasGuruTone,
    weight: 10,
    message: hasGuruTone ? 'Tom de "guru perfeita" detectado' : undefined,
  });
  if (hasGuruTone) {
    suggestions.push(
      'Evite frases como "é só fazer", "basta você". Seja mais real.'
    );
  }

  // ============================================
  // CHECK 7: Validação Emocional
  // ============================================
  const hasEmotionalValidation = EMOTIONAL_VALIDATION_PATTERNS.some((pattern) =>
    pattern.test(response)
  );
  // Só exige validação em respostas médias/longas
  const needsValidation = response.length > 100;
  checks.push({
    name: 'Validação emocional presente',
    passed: hasEmotionalValidation || !needsValidation,
    weight: 10,
    message:
      !hasEmotionalValidation && needsValidation
        ? 'Falta validação emocional'
        : undefined,
  });
  if (!hasEmotionalValidation && needsValidation) {
    suggestions.push(
      'Adicione validação emocional no início (ex: "Eu entendo", "Te escuto")'
    );
  }

  // ============================================
  // CHECK 8: Autenticidade (cita experiência)
  // ============================================
  const citesExperience =
    /eu também/i.test(response) ||
    /quando (eu|o thales|meu filho)/i.test(response) ||
    /na minha (gravidez|experiência)/i.test(response) ||
    /já passei/i.test(response);
  checks.push({
    name: 'Autenticidade (experiência pessoal)',
    passed: citesExperience || response.length < 150,
    weight: 5,
    message:
      !citesExperience && response.length >= 150
        ? 'Não cita experiência pessoal'
        : undefined,
  });

  // ============================================
  // CHECK 9: Fechamento adequado
  // ============================================
  const hasClosing =
    NATHIA_CATCHPHRASES.finalizacoes.some((f) =>
      response.toLowerCase().includes(f.toLowerCase().replace('.', ''))
    ) ||
    /\?$/m.test(response) || // Termina com pergunta
    /tá\?/i.test(response) ||
    /né\?/i.test(response);
  checks.push({
    name: 'Fechamento adequado',
    passed: hasClosing || response.length < 100,
    weight: 5,
    message:
      !hasClosing && response.length >= 100 ? 'Falta fechamento adequado' : undefined,
  });
  if (!hasClosing && response.length >= 100) {
    suggestions.push(
      'Finalize com pergunta ou frase de carinho (ex: "Tamo juntas, tá?")'
    );
  }

  // ============================================
  // CALCULAR SCORE FINAL
  // ============================================
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const passedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);
  const overallScore = Math.round((passedWeight / totalWeight) * 100);

  // Resposta é válida se score >= 70 e sem issues críticos
  const isValid = overallScore >= 70 && criticalIssues.length === 0;

  // Log para monitoramento
  if (!isValid) {
    logger.warn('[NathiaValidator] Resposta inválida', {
      score: overallScore,
      criticalIssues,
      failedChecks: checks.filter((c) => !c.passed).map((c) => c.name),
    });
  }

  return {
    isValid,
    overallScore,
    checks,
    criticalIssues,
    suggestions,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// VALIDAÇÃO RÁPIDA (SYNC)
// ============================================

/**
 * Validação rápida apenas para checks críticos
 */
export function quickValidateNathiaResponse(response: string): {
  isValid: boolean;
  hasMedicalAdvice: boolean;
  hasFormalTone: boolean;
} {
  const hasMedicalAdvice = MEDICAL_ADVICE_PATTERNS.some((pattern) =>
    pattern.test(response)
  );
  const hasFormalTone = FORMAL_PATTERNS.some((pattern) =>
    pattern.test(response)
  );

  return {
    isValid: !hasMedicalAdvice && !hasFormalTone,
    hasMedicalAdvice,
    hasFormalTone,
  };
}

// ============================================
// SUGESTÃO DE MELHORIA
// ============================================

/**
 * Sugere melhorias específicas para uma resposta
 */
export function suggestImprovements(
  response: string,
  topic?: string
): string[] {
  const suggestions: string[] = [];
  const validation = validateNathiaResponse(response, { topic });

  // Adicionar sugestões do relatório
  suggestions.push(...validation.suggestions);

  // Sugestões baseadas no tópico
  if (topic) {
    const trigger = NATHIA_PERSONA.topicTriggers.find(
      (t) => t.topic === topic
    );
    if (trigger) {
      const usedPhrase = trigger.phrases.some((p) =>
        response.toLowerCase().includes(p.toLowerCase())
      );
      if (!usedPhrase && trigger.phrases.length > 0) {
        suggestions.push(
          `Para tema "${topic}", considere usar: "${trigger.phrases[0]}"`
        );
      }

      const usedAvoid = trigger.avoid.some((a) =>
        response.toLowerCase().includes(a.toLowerCase())
      );
      if (usedAvoid) {
        suggestions.push(
          `Evite frases como "${trigger.avoid.find((a) => response.toLowerCase().includes(a.toLowerCase()))}"`
        );
      }
    }
  }

  return suggestions;
}

// ============================================
// EXPORT
// ============================================

export default {
  validateNathiaResponse,
  quickValidateNathiaResponse,
  suggestImprovements,
};
