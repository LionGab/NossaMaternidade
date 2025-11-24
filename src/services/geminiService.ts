import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import cloudRunClient from './cloudRunClient';

const SYSTEM_INSTRUCTION_BASE = `
  Você é a MãesValente, a assistente virtual de IA da influenciadora Nathália Valente, dentro do app "Nossa Maternidade".
  
  Seu tom de voz é:
  - Acolhedor, calmo, direto, sem infantilizar.
  - Você usa a 2ª pessoa ("você").
  - Você fala português do Brasil.
  - Você é próxima, carinhosa, vulnerável, mas firme.
  - Você NÃO é uma guru perfeita; você entende que a maternidade é difícil.
`;

class GeminiService {
  
  private async getUserContext(): Promise<string> {
    try {
      const savedUser = await AsyncStorage.getItem('nath_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        let ctx = "";
        if (user.name) ctx += ` Nome da usuária: ${user.name}.`;
        if (user.stage) ctx += ` Fase: ${user.stage}.`;
        if (user.timelineInfo) ctx += ` Tempo: ${user.timelineInfo}.`;
        if (user.biggestChallenge) ctx += ` Maior desafio atual: ${user.biggestChallenge}.`;
        if (user.supportLevel) ctx += ` Rede de apoio: ${user.supportLevel}.`;
        return ctx;
      }
    } catch (e) {
      console.warn('Error reading user context:', e);
    }
    return "";
  }

  async sendMessage(message: string, history: { role: 'user' | 'model' | 'assistant', text: string }[] = []): Promise<{ text: string; error?: string }> {
    try {
      const userCtx = await this.getUserContext();

      const systemInstruction = `
        ${SYSTEM_INSTRUCTION_BASE}
        CONTEXTO DA USUÁRIA ATUAL: [ ${userCtx} ]
        Use o nome dela se souber. Adapte a resposta para a fase dela.

        Regras OBRIGATÓRIAS para o CHAT:
        1. Sempre comece acolhendo a emoção da usuária.
        2. Faça perguntas abertas para entender melhor.
        3. NUNCA dê diagnósticos médicos.
        4. Mantenha as respostas concisas (máximo 3 parágrafos curtos).
      `;

      // Map history to API format
      const chatHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      }));

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message,
          history: chatHistory,
          systemInstruction,
        },
      });

      if (error) {
        console.error('[geminiService] Supabase function error:', error);
        return {
          text: '',
          error: 'Sinto muito, minha conexão falhou um pouquinho. Pode repetir, querida?',
        };
      }

      if (!data || !data.text) {
        return {
          text: '',
          error: 'Resposta inválida do servidor.',
        };
      }

      return { text: data.text };

    } catch (error) {
      console.error('Error sending message to backend:', error);
      return {
        text: '',
        error: 'Sinto muito, minha conexão falhou um pouquinho. Pode repetir, querida?',
      };
    }
  }

  async sendAudio(audioUri: string): Promise<{ text: string; error?: string }> {
    try {
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: "base64",
      });

      const fileExtension = audioUri.split('.').pop()?.toLowerCase() || 'm4a';
      const mimeType = fileExtension === 'mp3' ? 'audio/mp3' : 'audio/m4a';

      const userCtx = await this.getUserContext();
      const systemInstruction = `
        ${SYSTEM_INSTRUCTION_BASE}
        CONTEXTO DA USUÁRIA: [ ${userCtx} ]
        Tarefa: Transcrever e responder a um áudio da usuária.
      `;

      // Use cloudRunClient instead of direct fetch
      const response = await cloudRunClient.sendAudio({
        audioBase64: base64Audio,
        mimeType,
        systemInstruction,
        prompt: "Por favor, ouça meu áudio e me responda."
      });

      if (!response.success || !response.data) {
        return {
          text: '',
          error: response.error || 'Erro ao processar áudio.'
        };
      }

      return { text: response.data.text };

    } catch (error) {
      console.error('Error sending audio to backend:', error);
      return { text: '', error: 'Erro ao processar áudio.' };
    }
  }

  async analyzeDiaryEntry(entry: string): Promise<{ text: string; error?: string }> {
    try {
      const userCtx = await this.getUserContext();
      const systemInstruction = `
        ${SYSTEM_INSTRUCTION_BASE}
        CONTEXTO DA USUÁRIA: [ ${userCtx} ]

        Tarefa: Analisar uma entrada de diário maternal.
        - Identifique emoções principais
        - Reconheça conquistas, por menores que sejam
        - Ofereça validação emocional
        - Seja breve e acolhedora (máximo 2 parágrafos curtos)
        - NÃO dê conselhos não solicitados
      `;

      // Use cloudRunClient instead of direct fetch
      const response = await cloudRunClient.analyzeDiary({
        entry,
        systemInstruction
      });

      if (!response.success || !response.data) {
        return {
          text: '',
          error: response.error || 'Erro ao analisar entrada do diário.'
        };
      }

      return { text: response.data.text };

    } catch (error) {
      console.error('Error analyzing diary entry:', error);
      return { text: '', error: 'Erro ao analisar entrada do diário.' };
    }
  }

  isConfigured(): boolean {
    return true; // Backend is always "configured" from client perspective, connection check could be added
  }
}

export const geminiService = new GeminiService();
export default geminiService;

