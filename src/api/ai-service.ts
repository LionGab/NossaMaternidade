/**
 * AI Service - Client Wrapper (Seguro)
 *
 * Chama a Edge Function /ai com JWT do usuário autenticado.
 * Nunca expõe API keys no client.
 */

import { AIMessage, AIResponse } from "../types/ai";
import { logger } from "../utils/logger";
import { supabase } from "./supabase";

const FUNCTIONS_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

export interface AIContext {
  requiresGrounding?: boolean; // Usa Gemini com Google Search
  estimatedTokens?: number; // Estimativa para rate limiting
  imageData?: {
    // Suporte a imagem (Claude vision)
    base64: string;
    mediaType: string;
  };
}

/**
 * Payload enviado para a Edge Function /ai
 */
interface EdgeFunctionPayload {
  messages: AIMessage[];
  provider: "claude" | "gemini" | "openai";
  grounding: boolean;
  imageData?: {
    base64: string;
    mediaType: string;
  };
}

/**
 * Obter resposta da NathIA (Claude ou Gemini)
 * Decide automaticamente o provider com base no contexto
 */
export async function getNathIAResponse(
  messages: AIMessage[],
  context: AIContext = {}
): Promise<AIResponse> {
  try {
    // 1. Verificar autenticação
    if (!supabase) {
      throw new Error("Supabase não está configurado.");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Usuário não autenticado. Faça login para continuar.");
    }

    // 2. Decidir provider
    let provider = "claude"; // Default: melhor persona
    let grounding = false;

    if (context.requiresGrounding) {
      // Pergunta médica → Gemini com Google Search
      provider = "gemini";
      grounding = true;
    } else if (context.estimatedTokens && context.estimatedTokens > 100000) {
      // Long context (>100K tokens) → Gemini (1M window)
      provider = "gemini";
    }
    // Se tem imagem, usa Claude vision (mantém persona)
    // Provider permanece "claude" mas Edge Function detecta imageData

    // 3. Preparar payload
    const payload: EdgeFunctionPayload = {
      messages,
      provider,
      grounding,
      ...(context.imageData && { imageData: context.imageData }),
    };

    // 4. Chamar Edge Function COM JWT
    const response = await fetch(`${FUNCTIONS_URL}/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    // 5. Tratar erros
    if (!response.ok) {
      const error = await response.json();

      if (response.status === 429) {
        throw new Error(
          "Você está enviando muitas mensagens. Aguarde um minuto e tente novamente."
        );
      }

      if (response.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw new Error(error.error || "Erro ao processar sua mensagem.");
    }

    // 6. Parse resposta
    const data = await response.json();

    logger.info(
      `AI response: ${data.provider}, ${data.latency}ms, ${data.usage.totalTokens} tokens`,
      "AIService"
    );

    // Aviso se usou fallback
    if (data.fallback) {
      logger.warn("AI fallback: Claude offline, usou OpenAI", "AIService");
    }

    return {
      content: data.content,
      usage: data.usage,
      provider: data.provider,
      latency: data.latency,
      grounding: data.grounding,
      fallback: data.fallback,
    };
  } catch (error) {
    logger.error("AI service error", "AIService", error as Error);

    // Re-throw com mensagem user-friendly
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Não consegui processar sua mensagem. Tente novamente em instantes."
    );
  }
}

/**
 * Estimar tokens de uma conversa (rough approximation)
 * ~4 chars = 1 token
 */
export function estimateTokens(messages: AIMessage[]): number {
  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(totalChars / 4);
}

/**
 * Detectar se é pergunta médica (requires grounding)
 * Palavras-chave que indicam necessidade de busca atualizada
 */
export function detectMedicalQuestion(message: string): boolean {
  const medicalKeywords = [
    "o que é",
    "como prevenir",
    "sintomas de",
    "tratamento para",
    "pode ser",
    "é normal",
    "pesquisar",
    "informações sobre",
    "dados sobre",
    "estudos sobre",
    // Termos médicos comuns
    "pré-eclâmpsia",
    "eclâmpsia",
    "diabetes gestacional",
    "hipertensão",
    "anemia",
    "infecção urinária",
    "contrações",
    "placenta",
    "líquido amniótico",
  ];

  const lowerMessage = message.toLowerCase();
  return medicalKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Converter imagem URI para base64 (para Claude vision)
 */
export async function imageUriToBase64(
  uri: string
): Promise<{ base64: string; mediaType: string }> {
  try {
    // Se já é base64, extrair
    if (uri.startsWith("data:")) {
      const match = uri.match(/^data:(image\/\w+);base64,(.*)$/);
      if (!match) throw new Error("Invalid base64 data URI");
      return {
        mediaType: match[1],
        base64: match[2],
      };
    }

    // Senão, fetch e converter
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
        if (!match) {
          reject(new Error("Failed to convert image to base64"));
          return;
        }
        resolve({
          mediaType: match[1],
          base64: match[2],
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    logger.error("Image conversion error", "AIService", error as Error);
    throw new Error("Não consegui processar a imagem. Tente outra.");
  }
}
