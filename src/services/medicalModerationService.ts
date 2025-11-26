/**
 * Medical Moderation Service (LEGACY - DEPRECATED)
 *
 * ⚠️ DEPRECADO: Este serviço foi substituído pela nova arquitetura em src/ai/moderation/
 *
 * Use em vez disso:
 * - MedicalModerationService (src/ai/moderation/MedicalModerationService.ts)
 * - CrisisDetectionService (src/ai/moderation/CrisisDetectionService.ts)
 *
 * A nova implementação oferece:
 * - 8 categorias de moderação (vs 4 flags)
 * - Detecção de crise com IA (hybrid pattern + emotion analysis)
 * - Integração com multi-provider LLM
 * - Disclaimers padronizados e recursos de emergência
 *
 * Este arquivo será removido em versão futura.
 * @deprecated Migrar para src/ai/moderation/
 */

import { logger } from '../utils/logger';

/**
 * Resultado da moderação médica
 */
export interface ModerationResult {
  approved: boolean;
  originalText: string;
  moderatedText: string;
  flags: {
    medical: boolean;
    diagnosis: boolean;
    prescription: boolean;
    crisis: boolean;
    requiresProfessional: boolean;
  };
  disclaimer?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason?: string;
}

/**
 * Palavras-chave de risco médico
 */
const MEDICAL_KEYWORDS = {
  diagnosis: [
    'diagnostico',
    'diagnosticar',
    'você tem',
    'você está com',
    'isso é',
    'doença',
    'transtorno',
    'síndrome',
    'condição médica',
  ],
  prescription: [
    'tome',
    'tomar',
    'medicamento',
    'remédio',
    'dose',
    'prescrevo',
    'receitar',
    'comprimido',
    'mg',
    'ml',
    'gotas',
  ],
  crisis: [
    'suicídio',
    'suicida',
    'me matar',
    'acabar com tudo',
    'não aguento mais',
    'quero morrer',
    'machucar o bebê',
    'fazer mal ao bebê',
    'ideação suicida',
  ],
  professional: [
    'psiquiatra',
    'terapeuta',
    'psicólogo',
    'médico',
    'emergência',
    'pronto-socorro',
    'internação',
    'cvv',
    'samu',
  ],
};

/**
 * Disclaimers padrão
 */
const DISCLAIMERS = {
  medical: '\n\n⚕️ **Importante:** Esta é uma orientação geral. Não substitui consulta médica profissional.',
  crisis: '\n\n🆘 **Se você está em crise:** CVV (188 - gratuito, 24h) | SAMU (192) | Procure o pronto-socorro mais próximo.',
  professional: '\n\n💙 **Recomendação:** Considere buscar apoio de profissional de saúde mental (psicólogo ou psiquiatra).',
};

/**
 * Serviço de Moderação Médica
 */
class MedicalModerationService {
  /**
   * Modera uma resposta de IA antes de enviá-la para a usuária
   * @param text - Texto da resposta da IA
   * @param context - Contexto adicional (opcional)
   * @returns Resultado da moderação
   */
  moderateResponse(
    text: string,
    context?: {
      userMessage?: string;
      riskFlags?: {
        crisis?: boolean;
        selfHarm?: boolean;
        violence?: boolean;
      };
    }
  ): ModerationResult {
    const lowerText = text.toLowerCase();
    const userMessageLower = context?.userMessage?.toLowerCase() || '';

    // Flags de detecção
    const flags = {
      medical: false,
      diagnosis: false,
      prescription: false,
      crisis: false,
      requiresProfessional: false,
    };

    // Detectar diagnóstico
    flags.diagnosis = MEDICAL_KEYWORDS.diagnosis.some(kw => lowerText.includes(kw));

    // Detectar prescrição
    flags.prescription = MEDICAL_KEYWORDS.prescription.some(kw => lowerText.includes(kw));

    // Detectar crise (na resposta OU na mensagem do usuário)
    flags.crisis =
      MEDICAL_KEYWORDS.crisis.some(kw => lowerText.includes(kw) || userMessageLower.includes(kw)) ||
      context?.riskFlags?.crisis ||
      context?.riskFlags?.selfHarm ||
      false;

    // Detectar menção a profissional
    flags.requiresProfessional = MEDICAL_KEYWORDS.professional.some(kw => lowerText.includes(kw));

    // Flag geral de conteúdo médico
    flags.medical = flags.diagnosis || flags.prescription || flags.requiresProfessional;

    // Determinar severidade
    let severity: ModerationResult['severity'] = 'low';
    if (flags.crisis) {
      severity = 'critical';
    } else if (flags.diagnosis || flags.prescription) {
      severity = 'high';
    } else if (flags.medical) {
      severity = 'medium';
    }

    // Decidir se bloqueia ou modera
    const shouldBlock = flags.diagnosis || flags.prescription;

    if (shouldBlock) {
      // BLOQUEAR resposta perigosa e substituir
      logger.warn('[MedicalModeration] Resposta bloqueada por conteúdo médico perigoso', {
        flags,
        severity,
      });

      const blockedMessage = this.generateSafeResponse(flags, context?.userMessage);

      return {
        approved: false,
        originalText: text,
        moderatedText: blockedMessage,
        flags,
        disclaimer: this.buildDisclaimer(flags),
        severity,
        reason: 'Conteúdo médico impróprio detectado (diagnóstico ou prescrição)',
      };
    }

    // ADICIONAR disclaimers quando apropriado
    const disclaimer = this.buildDisclaimer(flags);
    const moderatedText = disclaimer ? `${text}${disclaimer}` : text;

    logger.info('[MedicalModeration] Resposta moderada', { flags, severity });

    return {
      approved: true,
      originalText: text,
      moderatedText,
      flags,
      disclaimer,
      severity,
    };
  }

  /**
   * Gera resposta segura quando conteúdo perigoso é detectado
   */
  private generateSafeResponse(
    flags: ModerationResult['flags']
  ): string {
    if (flags.crisis) {
      return `
Estou muito preocupada com o que você compartilhou. O que você está sentindo é muito sério e importante.

**Por favor, busque ajuda profissional imediata:**
- **CVV (Centro de Valorização da Vida):** 188 (gratuito, 24h, sigilo total)
- **SAMU:** 192 (emergências médicas)
- **Pronto-socorro:** Procure o mais próximo se sentir risco imediato

Você não precisa passar por isso sozinha. Profissionais de saúde mental estão preparados para te apoiar nesse momento difícil.

💙 **Você merece ajuda e apoio especializados.**
      `.trim();
    }

    if (flags.diagnosis) {
      return `
Percebo que você está buscando entender melhor o que está acontecendo com você. É muito importante validar o que você está sentindo.

**No entanto, eu não posso oferecer diagnósticos médicos.** Apenas profissionais de saúde qualificados (médicos, psicólogos, psiquiatras) podem fazer uma avaliação adequada.

💙 **Recomendo fortemente que você procure:**
- Médico de família ou ginecologista/obstetra
- Psicólogo ou psiquiatra especializado em saúde maternal
- Serviços de saúde mental do SUS

Você merece um olhar profissional para o que está vivendo.
      `.trim();
    }

    if (flags.prescription) {
      return `
Entendo que você está buscando soluções práticas. No entanto, **eu não posso recomendar medicamentos ou tratamentos.**

Apenas profissionais de saúde habilitados podem prescrever medicações de forma segura, considerando:
- Seu histórico médico completo
- Possíveis interações medicamentosas
- Situação específica da gestação/amamentação

💙 **Por favor, consulte:**
- Seu médico obstetra ou ginecologista
- Psiquiatra especializado em saúde maternal
- Farmacêutico para orientações gerais

Sua segurança e a do seu bebê são prioridades.
      `.trim();
    }

    // Fallback genérico
    return `
Percebo que sua situação envolve questões de saúde importantes. Embora eu possa oferecer suporte emocional e informação geral, **recomendo fortemente que você busque orientação de um profissional de saúde.**

💙 Você merece um acompanhamento adequado para o que está vivendo.
    `.trim();
  }

  /**
   * Constrói disclaimer apropriado baseado nas flags
   */
  private buildDisclaimer(flags: ModerationResult['flags']): string | undefined {
    const disclaimers: string[] = [];

    if (flags.crisis) {
      disclaimers.push(DISCLAIMERS.crisis);
    }

    if (flags.medical && !flags.crisis) {
      disclaimers.push(DISCLAIMERS.medical);
    }

    if (flags.requiresProfessional && !flags.crisis) {
      disclaimers.push(DISCLAIMERS.professional);
    }

    return disclaimers.length > 0 ? disclaimers.join('\n') : undefined;
  }

  /**
   * Verifica se uma mensagem de usuária indica risco de crise
   * @param message - Mensagem da usuária
   * @returns Flags de risco detectadas
   */
  detectRiskFlags(message: string): {
    crisis?: boolean;
    selfHarm?: boolean;
    violence?: boolean;
  } {
    const lowerMessage = message.toLowerCase();
    const flags: {
      crisis?: boolean;
      selfHarm?: boolean;
      violence?: boolean;
    } = {};

    // Detectar crise/suicídio
    const crisisKeywords = MEDICAL_KEYWORDS.crisis;
    if (crisisKeywords.some(kw => lowerMessage.includes(kw))) {
      flags.crisis = true;
      flags.selfHarm = true;
    }

    // Detectar violência contra bebê
    const violenceKeywords = ['machucar o bebê', 'fazer mal ao bebê', 'vontade de machucar'];
    if (violenceKeywords.some(kw => lowerMessage.includes(kw))) {
      flags.violence = true;
      flags.crisis = true;
    }

    return flags;
  }
}

// Exportar singleton
export const medicalModerationService = new MedicalModerationService();
export default medicalModerationService;
