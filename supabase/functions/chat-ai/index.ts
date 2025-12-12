/**
 * Supabase Edge Function: chat-ai
 * Processa mensagens de chat usando Gemini 2.0 Flash
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.24.1';
import { NATHIA_SYSTEM_PROMPT } from '../_shared/nathiaSystemPrompt.ts';
import { edgeLogger } from '../_shared/logger.ts';

// CORS Configuration
// Em produção, restringir às origens permitidas
const ALLOWED_ORIGINS = [
  'https://nossamaternidade.com.br',
  'https://www.nossamaternidade.com.br',
  'capacitor://localhost', // Capacitor/iOS
  'http://localhost', // Android WebView
  'http://localhost:8081', // Metro bundler development
  'http://localhost:19006', // Expo web development
];

// Verificar se está em produção
const IS_PRODUCTION = Deno.env.get('ENVIRONMENT') === 'production';

function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  // Em desenvolvimento, permitir todas as origens
  if (!IS_PRODUCTION) {
    return {
      'Access-Control-Allow-Origin': requestOrigin || '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }

  // Em produção, verificar origem
  // React Native mobile não envia Origin header, então aceitamos null/undefined
  if (!requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin)) {
    return {
      'Access-Control-Allow-Origin': requestOrigin || 'https://nossamaternidade.com.br',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }

  // Origem não permitida
  return {
    'Access-Control-Allow-Origin': 'https://nossamaternidade.com.br',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';

interface ChatRequest {
  message: string;
  history?: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

serve(async (req) => {
  // Obter origem da requisição para CORS dinâmico
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const {
      message,
      history = [],
      systemInstruction,
      model: requestedModel,
      temperature,
      maxTokens,
      topP,
      topK,
    }: ChatRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const finalModelName = requestedModel || GEMINI_MODEL;

    // Inicializar Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({
      model: finalModelName,
      systemInstruction: systemInstruction || NATHIA_SYSTEM_PROMPT,
    });

    // Iniciar chat com histórico
    // Configuração otimizada para NathIA (temperature 0.85 conforme estudo técnico)
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: typeof temperature === 'number' ? temperature : 0.85, // Expressividade sem perder coerência
        topP: typeof topP === 'number' ? topP : 0.95,
        topK: typeof topK === 'number' ? topK : 40,
        maxOutputTokens: typeof maxTokens === 'number' ? maxTokens : 500, // Respostas concisas para chat mobile
        stopSequences: [],
      },
    });

    // Enviar mensagem
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    edgeLogger.info('[chat-ai] Success', {
      messageLength: message.length,
      responseLength: text.length,
      historySize: history.length,
      model: finalModelName,
    });

    return new Response(
      JSON.stringify({
        text,
        model: finalModelName,
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        tokens_used: response.usageMetadata?.totalTokenCount || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    edgeLogger.error('[chat-ai] Error', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
