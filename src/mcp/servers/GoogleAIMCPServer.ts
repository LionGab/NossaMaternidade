/**
 * Google AI MCP Server
 * Fornece acesso ao Google Gemini AI para chat, análise e geração de conteúdo
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
} from '../types';

export class GoogleAIMCPServer implements MCPServer {
  name = 'google-ai-mcp';
  version = '1.0.0';

  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private initialized = false;

  // Configuração do modelo para maternidade
  private readonly maternalSystemInstruction = `
Você é a MãesValente, uma assistente virtual especializada em apoio maternal.

CONTEXTO:
- Você oferece suporte emocional e informacional para mães em diferentes fases
- Suas respostas são empáticas, acolhedoras e baseadas em evidências
- Você NUNCA oferece diagnósticos médicos ou substitui consultas profissionais

PERSONALIDADE:
- Tom acolhedor e caloroso, como uma amiga experiente
- Usa linguagem simples e acessível
- Valida os sentimentos da mãe antes de oferecer orientações
- Oferece perspectivas práticas e realistas

DIRETRIZES:
1. Sempre valide os sentimentos da mãe primeiro
2. Ofereça informações baseadas em evidências científicas
3. Seja prática: sugira ações concretas quando apropriado
4. Encoraje a busca por profissionais quando necessário
5. Normalize as dificuldades da maternidade
6. Evite julgamentos ou comparações
7. Respeite diferentes escolhas maternas

LIMITAÇÕES:
- NÃO diagnostique condições médicas
- NÃO prescreva medicações ou tratamentos
- NÃO substitua profissionais de saúde
- Encaminhe para profissionais quando necessário
`;

  async initialize(): Promise<void> {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('Google AI API key not configured');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: this.maternalSystemInstruction,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      this.initialized = true;
      console.log('[GoogleAIMCP] Initialized successfully');
    } catch (error) {
      console.error('[GoogleAIMCP] Initialization failed:', error);
      throw error;
    }
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized || !this.model) {
      return createMCPResponse(request.id, undefined, {
        code: 'NOT_INITIALIZED',
        message: 'MCP Server not initialized',
      });
    }

    try {
      const [category, action] = request.method.split('.');

      switch (category) {
        case 'chat':
          return await this.handleChat(request.id, action, request.params);
        case 'analyze':
          return await this.handleAnalyze(request.id, action, request.params);
        case 'generate':
          return await this.handleGenerate(request.id, action, request.params);
        case 'summarize':
          return await this.handleSummarize(request.id, action, request.params);
        default:
          return createMCPResponse(request.id, undefined, {
            code: 'UNKNOWN_METHOD',
            message: `Unknown method category: ${category}`,
          });
      }
    } catch (error: any) {
      return createMCPResponse(request.id, undefined, {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        details: error,
      });
    }
  }

  private async handleChat(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.model) throw new Error('Model not initialized');

    switch (action) {
      case 'send': {
        const { message, context, history } = params;

        // Criar contexto enriquecido
        let enrichedPrompt = message;

        if (context) {
          const {
            name,
            lifeStage,
            timeline,
            emotion,
            challenges,
            supportNetwork,
          } = context;

          enrichedPrompt = `
CONTEXTO DA USUÁRIA:
- Nome: ${name || 'mãe'}
- Fase: ${lifeStage || 'não especificada'}
- Timeline: ${timeline || 'não especificada'}
- Emoção atual: ${emotion || 'não especificada'}
- Desafios: ${challenges?.join(', ') || 'não especificados'}
- Rede de apoio: ${supportNetwork || 'não especificada'}

MENSAGEM: ${message}
`;
        }

        // Criar chat com histórico
        const chat = this.model.startChat({
          history: history || [],
        });

        const result = await chat.sendMessage(enrichedPrompt);
        const response = result.response.text();

        return createMCPResponse(id, {
          message: response,
          context,
          timestamp: Date.now(),
        });
      }

      case 'stream': {
        // Para streaming, retornaremos um placeholder e a implementação real
        // será feita no componente que consumir este MCP
        return createMCPResponse(id, {
          message: 'Streaming not yet implemented in MCP layer',
          useDirectAPI: true,
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown chat action: ${action}`,
        });
    }
  }

  private async handleAnalyze(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.model) throw new Error('Model not initialized');

    switch (action) {
      case 'emotion': {
        const { text } = params;

        const prompt = `
Analise o estado emocional do seguinte texto de uma mãe.
Identifique as emoções principais e retorne um JSON com:
- emotions: array de emoções detectadas (ansiedade, cansaço, culpa, felicidade, confusão)
- intensity: nível de intensidade (low, medium, high)
- needs: necessidades identificadas (apoio emocional, informação, descanso, etc.)

Texto: "${text}"

Retorne APENAS o JSON, sem explicações adicionais.
`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        try {
          // Tentar extrair JSON da resposta
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

          return createMCPResponse(id, analysis);
        } catch {
          return createMCPResponse(id, { raw: response });
        }
      }

      case 'sentiment': {
        const { text } = params;

        const prompt = `
Analise o sentimento do seguinte texto e retorne um JSON com:
- sentiment: 'positive', 'negative', 'neutral', ou 'mixed'
- score: número entre -1 (muito negativo) e 1 (muito positivo)
- keywords: palavras-chave que indicam o sentimento

Texto: "${text}"

Retorne APENAS o JSON.
`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

          return createMCPResponse(id, analysis);
        } catch {
          return createMCPResponse(id, { raw: response });
        }
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown analyze action: ${action}`,
        });
    }
  }

  private async handleGenerate(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.model) throw new Error('Model not initialized');

    switch (action) {
      case 'content': {
        const { prompt, context } = params;

        let enrichedPrompt = prompt;
        if (context) {
          enrichedPrompt = `${JSON.stringify(context, null, 2)}\n\n${prompt}`;
        }

        const result = await this.model.generateContent(enrichedPrompt);
        const response = result.response.text();

        return createMCPResponse(id, {
          content: response,
          timestamp: Date.now(),
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown generate action: ${action}`,
        });
    }
  }

  private async handleSummarize(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.model) throw new Error('Model not initialized');

    switch (action) {
      case 'text': {
        const { text, maxLength = 200 } = params;

        const prompt = `
Resuma o seguinte texto em no máximo ${maxLength} caracteres, mantendo as informações mais importantes:

"${text}"

Retorne apenas o resumo, sem introduções ou explicações.
`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        return createMCPResponse(id, {
          summary: response,
          originalLength: text.length,
          summaryLength: response.length,
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown summarize action: ${action}`,
        });
    }
  }

  async shutdown(): Promise<void> {
    this.model = null;
    this.genAI = null;
    this.initialized = false;
    console.log('[GoogleAIMCP] Shutdown complete');
  }
}

// Singleton instance
export const googleAIMCP = new GoogleAIMCPServer();
