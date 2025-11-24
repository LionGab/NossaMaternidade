import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION_BASE = `
  Você é a MãesValente, a assistente virtual de IA da influenciadora Nathália Valente, dentro do app "Nossa Maternidade".
  
  Seu tom de voz é:
  - Acolhedor, calmo, direto, sem infantilizar.
  - Você usa a 2ª pessoa ("você").
  - Você fala português do Brasil.
  - Você é próxima, carinhosa, vulnerável, mas firme.
  - Você NÃO é uma guru perfeita; você entende que a maternidade é difícil.
`;

// Helper to get user context from LocalStorage inside the service
const getUserContext = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('nath_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        let ctx = "";
        if (user.name) ctx += ` Nome da usuária: ${user.name}.`;
        if (user.stage) ctx += ` Fase: ${user.stage}.`;
        if (user.timelineInfo) ctx += ` Tempo: ${user.timelineInfo}.`;
        if (user.biggestChallenge) ctx += ` Maior desafio atual: ${user.biggestChallenge}.`;
        if (user.supportLevel) ctx += ` Rede de apoio: ${user.supportLevel}.`;
        return ctx;
      } catch (e) { return ""; }
    }
  }
  return "";
};

export const sendMessageToNathIA = async (
  message: string, 
  history: { role: 'user' | 'model', text: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const userCtx = getUserContext();
    
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

    const conversationContext = history.map(h => `${h.role === 'user' ? 'Usuária' : 'MãesValente'}: ${h.text}`).join('\n');
    const prompt = `${conversationContext}\nUsuária: ${message}\nMãesValente:`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 1024 },
      }
    });

    return response.text || "Desculpe, estou tendo dificuldade para pensar agora. Podemos tentar de novo?";
  } catch (error) {
    console.error("Erro na MãesValente:", error);
    return "Sinto muito, minha conexão falhou um pouquinho. Pode repetir, querida?";
  }
};

export const analyzeDiaryEntry = async (entryText: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const userCtx = getUserContext();
    
    const systemInstruction = `
      ${SYSTEM_INSTRUCTION_BASE}
      CONTEXTO DA USUÁRIA: [ ${userCtx} ]

      Tarefa: Responder a um Diário Emocional.
      
      Entrada da usuária: Um desabafo livre.
      
      Seu Output DEVE seguir EXATAMENTE esta estrutura:
      1. Acolhimento (1 frase): "Obrigada por confiar em mim com isso..." (Use o nome dela se possível).
      2. Nomear o sentimento (1 frase): "Isso é muito cara de [EMOÇÃO] e [EMOÇÃO] ao mesmo tempo."
      3. Validação (1 frase): "É normal se sentir assim."
      
      NÃO ofereça soluções complexas ainda. Apenas acolha.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: `Diário: "${entryText}"`,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 1024 }, 
      }
    });

    return response.text || "Recebi seu desabafo. Estou aqui com você.";
  } catch (error) {
    console.error("Erro no Diário:", error);
    return "Guardei seu desabafo com carinho, mesmo com minha conexão instável.";
  }
};

/**
 * Converte um texto em áudio usando a API Gemini Text-to-Speech.
 * @param text O texto a ser sintetizado.
 * @returns Uma string base64 dos dados de áudio PCM.
 */
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO], // Deve ser um array com um único elemento Modality.AUDIO.
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voz feminina e acolhedora
            },
        },
      },
    });
    // O áudio vem em base64 dentro de inlineData.data
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Erro ao gerar áudio com Gemini TTS:", error);
    return undefined;
  }
};