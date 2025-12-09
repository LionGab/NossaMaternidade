/**
 * Maternal Chat Agent (MãesValente)
 * Agente especializado em conversas de suporte maternal
 */

import { MedicalModerationService, CrisisDetectionService } from '../../ai/moderation';
import type { CrisisDetectionResult } from '../../ai/moderation';
import { MCPResponse } from '../../mcp/types';
import { geminiService } from '../../services/geminiService';
import { sessionManager } from '../../services/sessionManager';
import { sessionPersistence } from '../../services/sessionPersistence';
import { logger } from '../../utils/logger';
import { orchestrator } from '../core/AgentOrchestrator';
import { BaseAgent, AgentConfig, AgentContext as _AgentContext } from '../core/BaseAgent';
import { selectLlmProfile, profileToMcpServer, getFallbackOrder } from '../helpers/llmRouter';

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

  // Wellness expandido (Release B)
  pregnancyWeek?: number;
  babyAgeMonths?: number;
  physicalChallenges?: string[];
  sleepChallenges?: string[];
  emotionalState?: string;
  wellnessGoals?: string[];
  partnerRelationship?: string;
  primaryConcern?: string;
  suggestedTopics?: string[];
  tone?: 'hopeful' | 'supportive' | 'practical' | 'empathetic';

  // Contexto formatado para IA
  formattedContext?: string;

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
      description: 'Agente de chat especializado em suporte maternal empático e informativo',
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
   * Helper para tracking de eventos de analytics de forma não bloqueante
   * Envolve chamadas de analytics em try/catch para nunca bloquear o fluxo principal
   *
   * @param eventName Nome do evento
   * @param properties Propriedades do evento
   */
  private trackEventSafely(eventName: string, properties?: AnalyticsEventProperties): void {
    // Fire-and-forget: não espera a promise, não bloqueia o fluxo
    this.callMCP('analytics', 'event.track', {
      name: eventName,
      properties: properties || {},
    }).catch((error) => {
      // Log do erro mas não propaga - analytics nunca deve quebrar o chat
      logger.warn('[MaternalChatAgent] Analytics tracking failed (non-blocking)', {
        eventName,
        error: error instanceof Error ? error.message : String(error),
      });
    });
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
      logger.info('[MaternalChatAgent] Continuando sessão existente', {
        sessionId: lastSession.id,
      });
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

    // Track session start (não bloqueante)
    this.trackEventSafely('chat_session_started', {
      sessionId: this.currentSession.id,
      userId,
      context: userContext,
    });

    // Persistir sessão inicial
    this.persistSession().catch((error) => {
      logger.error('[MaternalChatAgent] Erro ao persistir sessão inicial', error);
    });

    return this.currentSession;
  }

  /**
   * Retorna a sessão atual (método público para testes)
   */
  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  /**
   * Processa uma mensagem do usuário
   */
  async process(input: ProcessInput, _options?: ProcessOptions): Promise<ChatMessage> {
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
    const history: GoogleAIHistoryMessage[] = this.currentSession.messages.slice(-20).map(
      (msg): GoogleAIHistoryMessage => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })
    );

    try {
      // 1. DETECÇÃO DE CRISE: Analisar mensagem antes de rotear
      let crisisResult: CrisisDetectionResult | null = null;
      try {
        crisisResult = await CrisisDetectionService.detectCrisis(message, true);

        if (crisisResult.level !== 'none') {
          logger.warn('[MaternalChatAgent] Crisis detected in user message', {
            level: crisisResult.level,
            types: crisisResult.types,
            confidence: crisisResult.confidence,
            shouldUseCrisisSafeModel: crisisResult.shouldUseCrisisSafeModel,
          });
        }
      } catch (error) {
        logger.error('[MaternalChatAgent] Crisis detection failed, continuing without it', error);
      }

      // 2. ROTEAMENTO INTELIGENTE: Escolher melhor modelo baseado na mensagem
      let llmProfile = selectLlmProfile(message, {
        emotion: context?.emotion as string | undefined,
        lifeStage: context?.lifeStage as string | undefined,
        messageLength: message.length,
        conversationDepth: this.currentSession.messages.length,
      });

      // Override para CRISIS_SAFE se crise detectada
      if (crisisResult && crisisResult.shouldUseCrisisSafeModel) {
        llmProfile = 'CRISIS_SAFE';
        logger.info('[MaternalChatAgent] Overriding to CRISIS_SAFE model due to crisis detection');
      }

      const primaryServer = profileToMcpServer(llmProfile);
      const fallbackServers = getFallbackOrder(llmProfile);

      logger.info('[MaternalChatAgent] Roteamento selecionado', {
        profile: llmProfile,
        primaryServer,
        fallbackServers,
        crisisOverride: crisisResult?.shouldUseCrisisSafeModel || false,
      });

      // 3. EXECUTAR COM FALLBACK: Tentar primary, depois fallbacks
      let response: MCPResponse | null = null;
      let usedServer = '';
      const failedServers: string[] = [];

      for (const server of fallbackServers) {
        try {
          logger.debug(`[MaternalChatAgent] Tentando servidor: ${server}`);

          response = await this.callMCP(server, 'chat.send', {
            message,
            context,
            history,
          });

          if (response.success && response.data) {
            usedServer = server;
            logger.info(`[MaternalChatAgent] Sucesso com servidor: ${server}`);
            break;
          } else {
            // Server respondeu mas sem sucesso
            const errorCode = response?.error?.code || 'UNKNOWN';
            const errorMsg = response?.error?.message || 'Resposta inválida';
            logger.warn(`[MaternalChatAgent] ${server} retornou erro: ${errorCode} - ${errorMsg}`);
            failedServers.push(`${server}:${errorCode}`);
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          logger.warn(`[MaternalChatAgent] Falha em ${server}: ${errorMsg}`);
          failedServers.push(`${server}:EXCEPTION`);
          continue;
        }
      }

      // 4. FALLBACK DIRETO: Se MCP falhou, tentar geminiService diretamente
      if (!response || !response.success || !response.data) {
        logger.warn('[MaternalChatAgent] MCP servers falharam, tentando geminiService direto', {
          failedServers,
        });

        try {
          // Converter histórico para formato do geminiService
          const geminiHistory = this.currentSession.messages.slice(-20).map((msg) => ({
            role: msg.role as 'user' | 'model' | 'assistant',
            text: msg.content,
          }));

          // Chamar geminiService diretamente (usa Supabase Edge Function)
          const geminiResponse = await geminiService.sendMessage(
            message,
            geminiHistory,
            context
              ? {
                  user_id: this.currentSession.userId,
                  name: context.name,
                  phase: context.lifeStage,
                }
              : undefined,
            false // Desabilitar tools no fallback
          );

          if (geminiResponse.text && !geminiResponse.error) {
            // Sucesso com geminiService!
            usedServer = 'gemini-direct';
            response = {
              id: `fallback_${Date.now()}`,
              success: true,
              data: {
                message: geminiResponse.text,
              },
              timestamp: Date.now(),
            };
            logger.info('[MaternalChatAgent] Fallback para geminiService funcionou');
          } else {
            logger.error('[MaternalChatAgent] geminiService também falhou', {
              error: geminiResponse.error,
            });
            throw new Error(
              `Todos os providers falharam: ${failedServers.join(', ')} + gemini-direct`
            );
          }
        } catch (geminiError) {
          const errorMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
          logger.error('[MaternalChatAgent] Fallback geminiService falhou', { error: errorMsg });
          throw new Error(
            `Todos os providers falharam: ${failedServers.join(', ')}. Fallback error: ${errorMsg}`
          );
        }
      }

      // 5. MODERAÇÃO MÉDICA: Sempre moderar resposta antes de enviar
      // response é garantidamente não-null aqui devido ao fallback acima
      const responseData = response!.data as GoogleAIChatResponse;
      const rawMessage = responseData.message;

      const moderationApplied = MedicalModerationService.applyModeration(rawMessage, message);

      // Usar texto moderado (pode incluir disclaimers ou ser bloqueado)
      const finalText = moderationApplied.moderatedResponse;
      const moderationResult = moderationApplied.result;

      // 6. Criar mensagem de resposta
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: finalText,
        timestamp: Date.now(),
        metadata: {
          model: usedServer,
          responseTime: Date.now() - userMessage.timestamp,
          llmProfile,
          moderation: {
            severity: moderationResult.severity,
            categories: moderationResult.categories,
            shouldBlock: moderationResult.shouldBlock,
            hasDisclaimer: !!moderationResult.disclaimer,
          },
          crisis: crisisResult
            ? {
                level: crisisResult.level,
                types: crisisResult.types,
                confidence: crisisResult.confidence,
                urgentResources: crisisResult.urgentResources,
              }
            : undefined,
        },
      };

      // Adicionar à sessão
      this.addMessageToSession(assistantMessage);

      // Analisar emoção da mensagem do usuário (em background)
      this.analyzeUserEmotion(message).catch((error) => {
        logger.error('[MaternalChatAgent] Failed to analyze emotion', error);
      });

      // Track message exchange com info de moderação e crise (não bloqueante)
      this.trackEventSafely('chat_message_exchanged', {
        sessionId: this.currentSession.id,
        messageLength: message.length,
        responseLength: assistantMessage.content.length,
        llmProfile,
        provider: usedServer,
        moderationSeverity: moderationResult.severity,
        moderationCategories: moderationResult.categories.join(','),
        moderationBlocked: moderationResult.shouldBlock,
        crisisLevel: crisisResult?.level || 'none',
        crisisTypes: crisisResult?.types.join(',') || '',
        crisisConfidence: crisisResult?.confidence || 0,
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

        // Track emotion (não bloqueante)
        this.trackEventSafely('user_emotion_detected', {
          sessionId: this.currentSession?.id,
          emotions: emotionData.emotions,
          intensity: emotionData.intensity,
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
      const savePromise = sessionPersistence.saveChatSession(this.currentSession);
      if (savePromise && typeof savePromise.catch === 'function') {
        savePromise.catch((error) => {
          logger.error('[MaternalChatAgent] Erro ao persistir sessão', error);
        });
      }
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

      // Track session end (não bloqueante)
      this.trackEventSafely('chat_session_ended', {
        sessionId: this.currentSession.id,
        duration: Date.now() - this.currentSession.startedAt,
        messageCount: this.currentSession.messages.length,
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
          logger.warn(
            '[MaternalChatAgent] Usuário não autenticado, não é possível persistir sessão'
          );
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
    // Usar Record<string, JsonValue> para compatibilidade com tipos MCP
    const typedParams = params as Record<string, import('../../mcp/types').JsonValue>;

    if (server === 'googleai') {
      return await orchestrator.callMCP(
        server,
        method as keyof import('../../mcp/types').GoogleAIMCPMethods,
        typedParams
      );
    } else if (server === 'analytics') {
      return await orchestrator.callMCP(
        server,
        method as keyof import('../../mcp/types').AnalyticsMCPMethods,
        typedParams
      );
    }
    return await orchestrator.callMCP(
      server,
      method as keyof import('../../mcp/types').AllMCPMethods,
      typedParams
    );
  }
}
