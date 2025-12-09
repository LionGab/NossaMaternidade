/**
 * Supabase Edge Function: chat-ai-claude
 * Processa mensagens de chat usando Claude (Anthropic)
 * Fallback final quando Gemini e OpenAI falham
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

const CLAUDE_MODEL = Deno.env.get('CLAUDE_MODEL') || 'claude-3-5-sonnet-20241022';

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
      temperature = 0.5,
      maxTokens = 500,
    }: ChatRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Converter histórico para formato Anthropic
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      const content = msg.parts.map((p) => p.text).join('\n');
      messages.push({ role, content });
    }

    // Mensagem atual
    messages.push({ role: 'user', content: message });

    // System instruction
    const systemPrompt =
      systemInstruction ||
      `Você é NathIA, uma assistente maternal empática e acolhedora.

IMPORTANTE: Se detectar sinais de crise emocional, ideação suicida ou auto-lesão:
1. Responda com empatia e acolhimento
2. Sempre inclua recursos de ajuda: CVV (188), SAMU (192)
3. Não minimize os sentimentos da usuária
4. Encoraje buscar ajuda profissional`;

    // Chamar Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const tokensUsed = inputTokens + outputTokens;

    console.log('[chat-ai-claude] Success:', {
      messageLength: message.length,
      responseLength: text.length,
      tokensUsed,
    });

    return new Response(
      JSON.stringify({
        text,
        model: CLAUDE_MODEL,
        tokensUsed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[chat-ai-claude] Error:', error);
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
