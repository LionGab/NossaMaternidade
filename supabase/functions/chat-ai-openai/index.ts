/**
 * Supabase Edge Function: chat-ai-openai
 * Processa mensagens de chat usando GPT-4o
 * Usado principalmente para detecção de crise (modelo mais seguro)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { NATHIA_SYSTEM_PROMPT } from '../_shared/nathiaSystemPrompt.ts';
import { edgeLogger } from '../_shared/logger.ts';

// CORS Configuration
const ALLOWED_ORIGINS = [
  'https://nossamaternidade.com.br',
  'https://www.nossamaternidade.com.br',
  'capacitor://localhost',
  'http://localhost',
  'http://localhost:8081',
  'http://localhost:19006',
];

const IS_PRODUCTION = Deno.env.get('ENVIRONMENT') === 'production';

function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  if (!IS_PRODUCTION) {
    return {
      'Access-Control-Allow-Origin': requestOrigin || '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }

  if (!requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin)) {
    return {
      'Access-Control-Allow-Origin': requestOrigin || 'https://nossamaternidade.com.br',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }

  return {
    'Access-Control-Allow-Origin': 'https://nossamaternidade.com.br',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-4o';

interface ChatRequest {
  message: string;
  history?: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      message,
      history = [],
      systemInstruction,
      temperature = 0.3, // Mais determinístico para segurança
      maxTokens = 500,
    }: ChatRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Converter histórico para formato OpenAI
    const messages: Array<{ role: string; content: string }> = [];

    // System instruction (usar prompt canônico se não vier do client)
    const finalSystemInstruction = systemInstruction || NATHIA_SYSTEM_PROMPT;
    messages.push({ role: 'system', content: finalSystemInstruction });

    // Histórico
    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      const content = msg.parts.map((p) => p.text).join('\n');
      messages.push({ role, content });
    }

    // Mensagem atual
    messages.push({ role: 'user', content: message });

    // Chamar OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    edgeLogger.info('[chat-ai-openai] Success', {
      messageLength: message.length,
      responseLength: text.length,
      tokensUsed,
    });

    return new Response(
      JSON.stringify({
        text,
        model: OPENAI_MODEL,
        tokensUsed,
        tokens_used: tokensUsed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    edgeLogger.error('[chat-ai-openai] Error', error);
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
