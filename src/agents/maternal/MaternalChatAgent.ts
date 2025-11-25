/**
 * Maternal Chat Agent (MãesValente)
 * Agente especializado em conversas de suporte maternal
 */

import { BaseAgent, AgentConfig, AgentContext } from '../core/BaseAgent';
import { orchestrator } from '../core/AgentOrchestrator';
import { MCPResponse } from '../../mcp/types';
import { sessionPersistence } from '../../services/sessionPersistence';
import { sessionManager } from '../../services/sessionManager';
import { logger } from '../../utils/logger';

export interface ChatMessageMetadata {
  model?: string;
  responseTime?: number;
  error?: boolean;
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: ChatMessageMetadata;
}

export interface EmotionAnalysis {
  emotions?: string[];
  intensity?: number;
  [key: string]: unknown;
}

export interface UserContext {
  name?: string;
  lifeStage?: 'pregnant' | 'new-mother' | 'experienced-mother' | 'trying' | string;
  emotion?: 'anxious' | 'tired' | 'happy' | string;
  lastEmotionAnalysis?: EmotionAnalysis;
  analyzedAt?: number;
  [key: string]: unknown;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: number;
  lastActivityAt: number;
  context?: UserContext;
}

export interface ProcessInput {
  message: string;
  attachContext?: boolean;
}

export interface ProcessOptions {
  [key: string]: unknown;
}

export interface GoogleAIHistoryMessage {
  role: 'model' | 'user';
  parts: Array<{ text: string }>;
}

export interface GoogleAIChatResponse {
  message: string;
  [key: string]: unknown;
}

export interface AnalyticsEventProperties {
  [key: string]: unknown;
}

export class MaternalChatAgent extends BaseAgent {
  private currentSession: ChatSession | null = null;

  constructor() {
    const config: AgentConfig = {
      name: 'maternal-chat-agent',
      version: '1.0.0',
      description:
        'Agente de chat especializado em suporte maternal empático e informativo',
      capabilities: [
        'emotional-support',
        'maternal-guidance',
        'contextualized-responses',
        'session-management',
        'emotion-analysis',
      ],
    };
    super(config);
  }

  /**
   * Inicia uma nova sessão de chat
   */
  async startSession(userId: string, userContext?: UserContext): Promise<ChatSession> {
    // Tentar carregar última sessão primeiro
    const lastSession = await this.loadSession();
    if (lastSession && lastSession.userId === userId) {
      // Continuar sessão existente
      this.currentSession = lastSession;
      logger.info('[MaternalChatAgent] Continuando sessão existente', { sessionId: lastSession.id });
    } else {
      // Criar nova sessão
      const session: ChatSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        messages: [],
        startedAt: Date.now(),
        lastActivityAt: Date.now(),
        context: userContext,
      };

      this.currentSession = session;

      // Mensagem de boas-vindas personalizada
      const welcomeMessage = this.createWelcomeMessage(userContext);
      if (welcomeMessage) {
        this.addMessageToSession({
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: welcomeMessage,
          timestamp: Date.now(),
        });
      }
    }

    // Track session start
    await this.callMCP('analytics', 'event.track', {
      name: 'chat_session_started',
      properties: {
        sessionId: this.currentSession.id,
        userId,
        context: userContext,
      } as AnalyticsEventProperties,
    });

    // Persistir sessão inicial
    this.persistSession().catch((error) => {
      logger.error('[MaternalChatAgent] Erro ao persistir sessão inicial', error);
    });

    return this.currentSession;
  }

  /**
   * Processa uma mensagem do usuário
   */
  async process(
    input: ProcessInput,
    options?: ProcessOptions
  ): Promise<ChatMessage> {
    if (!this.currentSession) {
      throw new Error('No active chat session. Call startSession() first.');
    }

    const { message, attachContext = true } = input;

    // Adicionar mensagem do usuário à sessão
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    this.addMessageToSession(userMessage);

    // Preparar contexto para o AI
    const context = attachContext ? this.currentSession.context : undefined;

    // Preparar histórico (últimas 20 mensagens para não estourar tokens do AI)
    // Todas as mensagens estão salvas no banco, mas limitamos o contexto para a IA
    const history: GoogleAIHistoryMessage[] = this.currentSession.messages
      .slice(-20)
      .map((msg): GoogleAIHistoryMessage => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    try {
      // Chamar Google AI MCP para processar a mensagem
      const response = await this.callMCP('googleai', 'chat.send', {
        message,
        context,
        history,
      });

      if (!response.success || !response.data) {
        throw new Error('Failed to get AI response');
      }

      // Criar mensagem de resposta
      const responseData = response.data as GoogleAIChatResponse;
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responseData.message,
        timestamp: Date.now(),
        metadata: {
          model: 'gemini-2.0-flash-exp',
          responseTime: Date.now() - userMessage.timestamp,
        },
      };

      // Adicionar à sessão
      this.addMessageToSession(assistantMessage);

      // Sessão já é persistida automaticamente no addMessageToSession

      // Analisar emoção da mensagem do usuário (em background)
      this.analyzeUserEmotion(message).catch((error) => {
        logger.error('[MaternalChatAgent] Failed to analyze emotion', error);
      });

      // Track message exchange
      await this.callMCP('analytics', 'event.track', {
        name: 'chat_message_exchanged',
        properties: {
          sessionId: this.currentSession.id,
          messageLength: message.length,
          responseLength: assistantMessage.content.length,
        } as AnalyticsEventProperties,
      });

      return assistantMessage;
    } catch (error: unknown) {
      logger.error('[MaternalChatAgent] Error processing message', error);

      // Mensagem de fallback
      const fallbackMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content:
          'Desculpe, estou tendo dificuldades técnicas no momento. Você pode tentar novamente em alguns instantes?',
        timestamp: Date.now(),
        metadata: { error: true },
      };

      this.addMessageToSession(fallbackMessage);
      return fallbackMessage;
    }
  }

  /**
   * Analisa a emoção da mensagem do usuário
   */
  private async analyzeUserEmotion(message: string): Promise<void> {
    try {
      const response = await this.callMCP('googleai', 'analyze.emotion', {
        text: message,
      });

      if (response.success && response.data) {
        logger.debug('[MaternalChatAgent] Emotion analysis', { data: response.data });

        const emotionData = response.data as EmotionAnalysis;

        // Atualizar contexto se necessário
        if (this.currentSession) {
          this.currentSession.context = {
            ...this.currentSession.context,
            lastEmotionAnalysis: emotionData,
            analyzedAt: Date.now(),
          };
        }

        // Track emotion
        await this.callMCP('analytics', 'event.track', {
          name: 'user_emotion_detected',
          properties: {
            sessionId: this.currentSession?.id,
            emotions: emotionData.emotions,
            intensity: emotionData.intensity,
          } as AnalyticsEventProperties,
        });
      }
    } catch (error) {
      logger.error('[MaternalChatAgent] Emotion analysis failed', error);
    }
  }

  /**
   * Cria mensagem de boas-vindas personalizada
   */
  private createWelcomeMessage(context?: UserContext): string | null {
    if (!context) return null;

    const { name, lifeStage, emotion } = context;

    let greeting = `Olá`;
    if (name) greeting += `, ${name}`;
    greeting += `! 💙`;

    let message = `${greeting}\n\n`;

    // Personalizar baseado na fase da vida
    if (lifeStage === 'pregnant') {
      message += `Como está a gestação? Estou aqui para te apoiar nessa jornada especial.`;
    } else if (lifeStage === 'new-mother') {
      message += `Como estão os primeiros dias com o bebê? Sei que pode ser intenso, mas você está fazendo um ótimo trabalho.`;
    } else if (lifeStage === 'experienced-mother') {
      message += `Como vai a maternidade? Estou aqui para conversar sobre o que você precisar.`;
    } else if (lifeStage === 'trying') {
      message += `Como você está se sentindo? Estou aqui para te acompanhar nessa fase.`;
    } else {
      message += `Estou aqui para te apoiar. Como posso ajudar hoje?`;
    }

    // Adicionar validação emocional se houver
    if (emotion) {
      if (emotion === 'anxious') {
        message += `\n\nPercebo que você pode estar ansiosa. Respira fundo, vamos conversar sem pressa.`;
      } else if (emotion === 'tired') {
        message += `\n\nSei que o cansaço pode ser imenso. Conte comigo para o que precisar.`;
      } else if (emotion === 'happy') {
        message += `\n\nQue alegria sentir sua energia positiva! ✨`;
      }
    }

    return message;
  }

  /**
   * Adiciona mensagem à sessão atual
   */
  private addMessageToSession(message: ChatMessage): void {
    if (this.currentSession) {
      this.currentSession.messages.push(message);
      this.currentSession.lastActivityAt = Date.now();

      // Atualizar no session manager
      sessionManager.setChatSessionId(this.currentSession.id);

      // Persistir no Supabase (em background, não bloquear)
      sessionPersistence.saveChatSession(this.currentSession).catch((error) => {
        logger.error('[MaternalChatAgent] Erro ao persistir sessão', error);
      });
    }
  }

  /**
   * Obtém a sessão atual
   */
  getSession(): ChatSession | null {
    return this.currentSession;
  }

  /**
   * Obtém histórico de mensagens
   */
  getHistory(): ChatMessage[] {
    return this.currentSession?.messages || [];
  }

  /**
   * Limpa a sessão atual
   */
  async endSession(): Promise<void> {
    if (this.currentSession) {
      // Persistir sessão final antes de limpar
      await this.persistSession();

      // Track session end
      await this.callMCP('analytics', 'event.track', {
        name: 'chat_session_ended',
        properties: {
          sessionId: this.currentSession.id,
          duration: Date.now() - this.currentSession.startedAt,
          messageCount: this.currentSession.messages.length,
        } as AnalyticsEventProperties,
      });

      // Limpar do session manager
      sessionManager.setChatSessionId(null);

      this.currentSession = null;
    }
  }

  /**
   * Persiste a sessão atual no Supabase
   */
  private async persistSession(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      // Garantir que userId está definido
      if (!this.currentSession.userId) {
        const currentUser = sessionManager.getCurrentUser();
        if (!currentUser) {
          logger.warn('[MaternalChatAgent] Usuário não autenticado, não é possível persistir sessão');
          return;
        }
        this.currentSession.userId = currentUser.id;
      }

      // Usar sessionPersistence service
      const saved = await sessionPersistence.saveChatSession(this.currentSession);
      if (saved) {
        logger.debug('[MaternalChatAgent] Sessão persistida com sucesso', {
          sessionId: this.currentSession.id,
          messageCount: this.currentSession.messages.length,
        });
        // Atualizar session manager
        sessionManager.setChatSessionId(this.currentSession.id);
      }
    } catch (error) {
      logger.error('[MaternalChatAgent] Erro ao persistir sessão', error);
    }
  }

  /**
   * Carrega uma sessão persistida
   */
  async loadSession(conversationId?: string): Promise<ChatSession | null> {
    try {
      if (!conversationId) {
        logger.debug('[MaternalChatAgent] ConversationId não fornecido');
        return null;
      }

      const session = await sessionPersistence.loadChatSession(
        conversationId.replace('session_', '')
      );

      if (!session) {
        logger.debug('[MaternalChatAgent] Sessão não encontrada', { conversationId });
        return null;
      }

      this.currentSession = session;
      sessionManager.setChatSessionId(session.id);
      logger.info('[MaternalChatAgent] Sessão carregada', {
        sessionId: session.id,
        messageCount: session.messages.length,
      });

      return session;
    } catch (error) {
      logger.error('[MaternalChatAgent] Erro ao carregar sessão', error);
      return null;
    }
  }

  /**
   * Implementação do callMCP
   */
  protected async callMCP(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    // Cast method to proper type based on the server
    if (server === 'googleai') {
      return await orchestrator.callMCP(
        server,
        method as keyof import('../../mcp/types').GoogleAIMCPMethods,
        params as any
      );
    } else if (server === 'analytics') {
      return await orchestrator.callMCP(
        server,
        method as keyof import('../../mcp/types').AnalyticsMCPMethods,
        params as any
      );
    }
    return await orchestrator.callMCP(
      server,
      method as keyof import('../../mcp/types').AllMCPMethods,
      params as any
    );
  }
}
