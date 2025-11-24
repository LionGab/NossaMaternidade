import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// System Instruction from Web Version
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
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKey: string = '';

  constructor() {
    this.apiKey =
      Constants.expoConfig?.extra?.geminiApiKey ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';

    if (this.apiKey) {
      this.initialize();
    }
  }

  private initialize() {
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      // Using flash model as in local version, but with updated system instruction logic in sendMessage
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.initialize();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to get user context from AsyncStorage
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
    if (!this.apiKey || !this.model) {
      return {
        text: '',
        error: 'Serviço de IA não inicializado. Verifique sua API Key.',
      };
    }

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

      // Convert history to Gemini format
      // Note: 'assistant' role in local app maps to 'model' in Gemini
      const chatHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      }));

      const chat = this.model.startChat({
        history: chatHistory,
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] }, // Gemini 1.5+ supports systemInstruction in startChat or getGenerativeModel
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return { text };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        text: '',
        error: 'Sinto muito, minha conexão falhou um pouquinho. Pode repetir, querida?',
      };
    }
  }

  async sendAudio(audioUri: string): Promise<{ text: string; error?: string }> {
    if (!this.apiKey || !this.model) {
      return { text: '', error: 'Serviço de IA não inicializado.' };
    }

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

      // For audio, we use generateContent directly as it's a multimodal request
      // We can pass system instruction here too if the model supports it, or prepend it
      const result = await this.model.generateContent({
        contents: [
          { role: 'user', parts: [
            { inlineData: { data: base64Audio, mimeType: mimeType } },
            { text: "Por favor, ouça meu áudio e me responda." }
          ]}
        ],
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      });

      const response = await result.response;
      return { text: response.text() };
    } catch (error) {
      console.error('Error sending audio:', error);
      return { text: '', error: 'Erro ao processar áudio.' };
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.model;
  }
}

export const geminiService = new GeminiService();
export default geminiService;
