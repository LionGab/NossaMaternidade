/**
 * ElevenLabs Text-to-Speech Service
 *
 * Servico para converter texto em fala usando Supabase Edge Function.
 * API key mantida segura no servidor - NUNCA exposta no client.
 * Audio playback gerenciado pelo expo-av.
 */

import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";
import { logger } from "../utils/logger";
import {
  AppError,
  ErrorCode,
  wrapError,
} from "../utils/error-handler";
import { supabase } from "./supabase";

// ============================================
// CONFIGURACAO
// ============================================

// Voice ID da NathIA (clone da Nathalia Valente)
// Fallback para voz feminina padrao se nao configurado
const NATHIA_VOICE_ID =
  process.env.EXPO_PUBLIC_NATHIA_VOICE_ID ||
  "EXAVITQu4vr4xnSDxMaL"; // Bella - voz feminina padrao

// URL da Edge Function (Supabase Functions)
const FUNCTIONS_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

// Configuracoes de voz otimizadas para NathIA
// Tom: Caloroso, maternal, brasileiro
const NATHIA_VOICE_SETTINGS = {
  stability: 0.5,           // Equilibrio entre consistencia e expressividade
  similarity_boost: 0.75,   // Proximidade com voz original
  style: 0.4,               // Expressividade moderada
  use_speaker_boost: true,  // Clareza aprimorada
};

// Modelos disponiveis
const MODELS = {
  MULTILINGUAL_V2: "eleven_multilingual_v2",  // Melhor para PT-BR
  FLASH_V2: "eleven_flash_v2_5",              // Mais rapido, menor qualidade
  TURBO_V2: "eleven_turbo_v2_5",              // Baixa latencia
} as const;

// ============================================
// TIPOS
// ============================================

interface GenerateSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: typeof NATHIA_VOICE_SETTINGS;
}

// VoiceInfo e ApiStatus foram removidos (não mais necessários com Edge Function)

// ============================================
// FUNCOES PRINCIPAIS
// ============================================

/**
 * Verifica se a API esta configurada
 */
export function isElevenLabsConfigured(): boolean {
  // Agora depende apenas da Edge Function estar configurada
  return !!FUNCTIONS_URL && !!supabase;
}

/**
 * Gera fala a partir de texto usando a API do ElevenLabs
 * Retorna URI local do arquivo de audio para playback
 * Inclui retry + timeout para melhor reliability
 *
 * @param options - Opcoes de geracao
 * @returns URI do arquivo de audio local
 * @throws AppError se configuração inválida ou geração falhar
 */
export async function generateSpeech(
  options: GenerateSpeechOptions
): Promise<string> {
  const {
    text,
    voiceId = NATHIA_VOICE_ID,
  } = options;

  // Validacoes
  if (!isElevenLabsConfigured()) {
    throw new AppError(
      "ElevenLabs API key not configured",
      ErrorCode.API_ERROR,
      "Áudio não está configurado. Contate o suporte.",
      undefined,
      { component: "ElevenLabs" }
    );
  }

  if (!text || text.trim().length === 0) {
    throw new AppError(
      "Text is required for speech generation",
      ErrorCode.INVALID_INPUT,
      "Texto vazio não pode ser convertido em áudio.",
      undefined,
      { component: "ElevenLabs" }
    );
  }

  // Validar limite de caracteres (ElevenLabs tem limites)
  const MAX_CHARS = 5000; // Limite conservador
  if (text.length > MAX_CHARS) {
    throw new AppError(
      `Text exceeds maximum length: ${text.length} > ${MAX_CHARS}`,
      ErrorCode.INVALID_INPUT,
      `Texto muito longo. Máximo ${MAX_CHARS} caracteres.`,
      undefined,
      { component: "ElevenLabs", textLength: text.length, maxChars: MAX_CHARS }
    );
  }

  const trimmedText = text.trim();

  logger.debug("Generating speech via Edge Function", "ElevenLabs", {
    textLength: trimmedText.length,
    voiceId,
  });

  try {
    // Verificar se Supabase está configurado
    if (!supabase) {
      throw new AppError(
        "Supabase not configured",
        ErrorCode.API_ERROR,
        "Erro de configuração. Contate o suporte.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    // Obter session token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new AppError(
        "Not authenticated",
        ErrorCode.UNAUTHORIZED,
        "Você precisa estar logado para usar a voz da NathIA.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    // Chamar Edge Function COM RETRY + TIMEOUT
    const response = await fetch(`${FUNCTIONS_URL}/elevenlabs-tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        text: trimmedText,
        voiceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        `Edge Function error: ${response.status}`,
        ErrorCode.API_ERROR,
        "Erro ao gerar áudio. Tente novamente.",
        undefined,
        { component: "ElevenLabs", status: response.status, error: errorData }
      );
    }

    const data = await response.json();

    if (!data.audioBase64) {
      throw new AppError(
        "Empty audio response from Edge Function",
        ErrorCode.API_ERROR,
        "Resposta inválida do servidor de áudio.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    const base64Audio = data.audioBase64;

    // Salvar em arquivo local para playback
    if (!FileSystem.cacheDirectory) {
      throw new AppError(
        "Cache directory not available",
        ErrorCode.API_ERROR,
        "Erro ao salvar arquivo de áudio.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    const filename = `nathia_voice_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    logger.info("Speech generated successfully via Edge Function", "ElevenLabs", {
      textLength: trimmedText.length,
      audioSize: data.audioSize,
      fileUri,
    });

    return fileUri;
  } catch (error) {
    // Converter erro genérico
    throw wrapError(
      error,
      ErrorCode.AUDIO_PROCESSING_ERROR,
      "Erro ao gerar áudio. Tente novamente.",
      {
        component: "ElevenLabs",
        textLength: trimmedText.length,
      }
    );
  }
}

/**
 * Reproduz arquivo de audio usando expo-av
 *
 * @param fileUri - URI do arquivo de audio
 * @returns Instancia do Audio.Sound para controle de playback
 */
export async function playAudio(fileUri: string): Promise<Audio.Sound> {
  try {
    // Configurar sessao de audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,       // Tocar mesmo no silencioso
      staysActiveInBackground: false,   // Nao continuar em background
      shouldDuckAndroid: true,          // Reduzir volume de outros apps
    });

    // Criar e reproduzir som
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true, volume: 1.0 }
    );

    logger.info("Audio playback started", "ElevenLabs", { fileUri });

    return sound;
  } catch (error) {
    logger.error(
      "Audio playback failed",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

/**
 * Para e descarrega um som
 */
export async function stopAudio(sound: Audio.Sound | null): Promise<void> {
  if (!sound) return;

  try {
    await sound.stopAsync();
    await sound.unloadAsync();
    logger.info("Audio stopped and unloaded", "ElevenLabs");
  } catch {
    // Silenciar erro - pode ja estar descarregado
  }
}

// checkApiStatus e getAvailableVoices foram removidos
// (não são mais necessários com Edge Function)

/**
 * Limpa arquivos de audio em cache
 * Deve ser chamado periodicamente para liberar espaco
 */
export async function cleanupAudioCache(): Promise<number> {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return 0;

    const files = await FileSystem.readDirectoryAsync(cacheDir);
    const audioFiles = files.filter((f) => f.startsWith("nathia_voice_"));

    let deletedCount = 0;
    for (const file of audioFiles) {
      try {
        await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
        deletedCount++;
      } catch {
        // Ignorar erros de arquivos individuais
      }
    }

    logger.info("Audio cache cleaned", "ElevenLabs", {
      filesRemoved: deletedCount,
    });

    return deletedCount;
  } catch (error) {
    logger.error(
      "Failed to clean audio cache",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    return 0;
  }
}

// blobToBase64 foi removido (não mais necessário com Edge Function)

// ============================================
// EXPORTS
// ============================================

export {
  NATHIA_VOICE_ID,
  NATHIA_VOICE_SETTINGS,
  MODELS,
};
