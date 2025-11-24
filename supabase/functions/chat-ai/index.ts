/**
 * Supabase Edge Function: chat-ai
 * Processa mensagens de chat usando Gemini 2.0 Flash
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.24.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  history?: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { message, history = [], systemInstruction }: ChatRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Inicializar Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction || 'Você é uma assistente maternal empática.',
    });

    // Iniciar chat com histórico
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    // Enviar mensagem
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log('[chat-ai] Success:', {
      messageLength: message.length,
      responseLength: text.length,
      historySize: history.length,
    });

    return new Response(
      JSON.stringify({
        text,
        model: 'gemini-2.0-flash-exp',
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[chat-ai] Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
