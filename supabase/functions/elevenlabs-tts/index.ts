/**
 * ElevenLabs TTS Edge Function
 *
 * Proxy seguro para ElevenLabs API - mantém API key no servidor
 * Aceita texto + voiceId, retorna audio base64
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Validar payload
    const { text, voiceId } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Text too long (max 5000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Obter configuração do ElevenLabs
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ElevenLabs not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resolvedVoiceId =
      (typeof voiceId === "string" && voiceId.trim()) ||
      Deno.env.get("ELEVENLABS_VOICE_ID_DEFAULT") ||
      "EXAVITQu4vr4xnSDxMaL"; // Bella - fallback

    // 4. Chamar ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`;

    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.4,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text().catch(() => "Unknown error");
      console.error("ElevenLabs API error:", elevenLabsResponse.status, errorText.slice(0, 500));

      return new Response(
        JSON.stringify({
          error: "elevenlabs_failed",
          status: elevenLabsResponse.status,
          details: errorText.slice(0, 200),
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Converter audio para base64
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Converter para base64
    let binary = "";
    const len = audioBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(audioBytes[i]);
    }
    const audioBase64 = btoa(binary);

    console.log(`TTS generated: ${text.length} chars → ${audioBytes.length} bytes audio`);

    // 6. Retornar resposta
    return new Response(
      JSON.stringify({
        audioBase64,
        mimeType: "audio/mpeg",
        textLength: text.length,
        audioSize: audioBytes.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);

    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
