import type { AIContext } from '@/types/ai';
import type { ChatMessage } from '@/types/chat';
import { logger } from '@/utils/logger';

import { aiClient, aiRouter, geminiService } from '../ai';
import { supabase } from './supabase';

export interface ChatConversation {
  id: string;
  user_id: string;
  title?: string;
  model: string;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
}

export interface CreateConversationData {
  title?: string;
  model?: string;
}

export interface SendMessageData {
  conversation_id: string;
  content: string;
  role?: 'user' | 'assistant' | 'system';
}

class ChatService {
  private async getCurrentUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  }

  /**
   * Listar conversas da usuária
   */
  async getConversations(limit = 50): Promise<ChatConversation[]> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Erro ao buscar conversas', error, {
          service: 'ChatService',
          action: 'getConversations',
          userId,
          limit,
        });
        return [];
      }

      // Buscar última mensagem de cada conversa
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv) => {
          const lastMessage = await this.getLastMessage(conv.id);
          return { ...conv, last_message: lastMessage };
        })
      );

      return conversationsWithMessages as ChatConversation[];
    } catch (error) {
      logger.error('Erro inesperado ao buscar conversas', error, {
        service: 'ChatService',
        action: 'getConversations',
      });
      return [];
    }
  }

  /**
   * Criar nova conversa
   */
  async createConversation(data: CreateConversationData = {}): Promise<ChatConversation | null> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) return null;

      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: data.title || 'Nova conversa',
          model: data.model || 'gemini-pro',
        })
        .select()
        .single();

      if (error) {
        logger.error('Erro ao criar conversa', error, {
          service: 'ChatService',
          action: 'createConversation',
          userId,
        });
        return null;
      }

      return conversation as ChatConversation;
    } catch (error) {
      logger.error('Erro inesperado ao criar conversa', error, {
        service: 'ChatService',
        action: 'createConversation',
      });
      return null;
    }
  }

  /**
   * Obter mensagens de uma conversa
   */
  async getMessages(conversationId: string, limit = 100): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        logger.error('Erro ao buscar mensagens', error, {
          service: 'ChatService',
          action: 'getMessages',
          conversationId,
          limit,
        });
        return [];
      }

      return (data || []) as ChatMessage[];
    } catch (error) {
      logger.error('Erro inesperado ao buscar mensagens', error, {
        service: 'ChatService',
        action: 'getMessages',
        conversationId,
      });
      return [];
    }
  }

  /**
   * Obter última mensagem de uma conversa
   */
  async getLastMessage(conversationId: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) return null;
      return data as ChatMessage;
    } catch (error) {
      return null;
    }
  }

  /**
   * Enviar mensagem
   */
  async sendMessage(messageData: SendMessageData): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: messageData.conversation_id,
          role: messageData.role || 'user',
          content: messageData.content,
          metadata: {},
        })
        .select()
        .single();

      if (error) {
        logger.error('Erro ao enviar mensagem', error, {
          service: 'ChatService',
          action: 'sendMessage',
          conversationId: messageData.conversation_id,
        });
        return null;
      }

      // Atualizar updated_at da conversa
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', messageData.conversation_id);

      return data as ChatMessage;
    } catch (error) {
      logger.error('Erro inesperado ao enviar mensagem', error, {
        service: 'ChatService',
        action: 'sendMessage',
      });
      return null;
    }
  }

  /**
   * Enviar mensagem e obter resposta da IA
   */
  async sendMessageWithAI(
    conversationId: string,
    userMessage: string,
    onStream?: (chunk: string) => void
  ): Promise<{ userMsg: ChatMessage | null; aiMsg: ChatMessage | null }> {
    try {
      // Salvar mensagem do usuário
      const userMsg = await this.sendMessage({
        conversation_id: conversationId,
        content: userMessage,
        role: 'user',
      });

      if (!userMsg) {
        return { userMsg: null, aiMsg: null };
      }

      // Buscar histórico da conversa
      const messages = await this.getMessages(conversationId);

      // Chamar IA (integração com Gemini será feita depois)
      // Por enquanto, resposta placeholder
      const aiResponse = await this.getAIResponse(messages, userMessage);

      if (onStream) {
        // Simular streaming
        for (let i = 0; i < aiResponse.length; i += 10) {
          onStream(aiResponse.slice(0, i + 10));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      // Salvar resposta da IA
      const aiMsg = await this.sendMessage({
        conversation_id: conversationId,
        content: aiResponse,
        role: 'assistant',
      });

      return { userMsg, aiMsg };
    } catch (error) {
      logger.error('Erro ao enviar mensagem com IA:', error, {
        service: 'ChatService',
      });
      return { userMsg: null, aiMsg: null };
    }
  }

  /**
   * Obter resposta da IA usando aiRouter com fallback automático
   * Integra múltiplos providers (Gemini, GPT-4o, Claude) com roteamento inteligente
   */
  private async getAIResponse(history: ChatMessage[], userMessage: string): Promise<string> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        return 'Desculpe, não consegui identificar você. Pode fazer login novamente?';
      }

      // Converter histórico para formato esperado
      const aiHistory = history
        .filter((msg) => msg.role !== 'system')
        .slice(-20) // Últimas 20 mensagens para contexto
        .map((msg) => ({
          role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
          text: msg.content,
        }));

      logger.info('[ChatService] Enviando mensagem para IA via router', {
        messageLength: userMessage.length,
        historyLength: aiHistory.length,
      });

      // Criar contexto para o router
      const context: AIContext = {
        user_id: userId,
        name: undefined, // Pode ser preenchido do perfil se necessário
        phase: undefined, // Pode ser preenchido do perfil se necessário
        pregnancy_week: undefined, // Pode ser preenchido do perfil se necessário
      };

      // Usar aiRouter para rotear com fallback automático
      // Wrapper de segurança para garantir que erros não quebrem o fluxo
      const routerResponse = await aiRouter.route(
        userMessage,
        context,
        async (model, msg, ctx) => {
          try {
            // Função que o router usa para chamar IA
            return await aiClient.call(model, msg, ctx, aiHistory);
          } catch (error) {
            logger.error('[ChatService] Erro ao chamar aiClient', error, {
              model,
              messageLength: msg.length,
            });
            // Retornar resposta de erro estruturada
            throw error;
          }
        }
      );

      // Verificar tool call
      if (routerResponse.tool_call) {
        logger.info('[ChatService] Tool call recebido via router', {
          tool: routerResponse.tool_call.name,
          model: routerResponse.model_used,
        });

        // Importar executor de tools
        try {
          const { aiToolExecutor } = await import('../aiTools');
          const toolResult = await aiToolExecutor.executeTool(routerResponse.tool_call, userId);

          // Obter resposta final com resultado da tool
          const { text: finalText, error: finalError } =
            await geminiService.sendMessageWithToolResult(userMessage, toolResult, aiHistory);

          if (finalError) {
            logger.warn('[ChatService] Erro no tool result', { error: finalError });
            return 'Tentei buscar essa informação, mas algo deu errado. Pode reformular sua pergunta?';
          }

          return finalText || 'Desculpe, não consegui processar completamente. Tente novamente?';
        } catch (toolError) {
          logger.warn('[ChatService] Erro ao executar tool', toolError);
          // Continuar sem a tool - pedir reformulação
          return 'Não consegui executar essa ação agora. Pode tentar de outra forma?';
        }
      }

      // Verificar erro na resposta do router
      if (!routerResponse.success || routerResponse.error) {
        logger.warn('[ChatService] Erro da IA:', { error: routerResponse.error });
        return routerResponse.message || routerResponse.error || 'Ops, algo deu errado. Pode tentar novamente?';
      }

      // Obter texto da resposta
      const text = routerResponse.message;

      if (!text) {
        return 'Hmm, não consegui formular uma resposta. Pode repetir de outra forma?';
      }

      return text;
    } catch (error) {
      logger.error('[ChatService] Erro ao obter resposta da IA:', error, {
        service: 'ChatService',
      });
      return 'Ops, algo deu errado. Pode tentar novamente, querida?';
    }
  }

  /**
   * Atualizar título da conversa
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) {
        logger.error('Erro ao atualizar título', error, {
          service: 'ChatService',
          action: 'updateConversationTitle',
          conversationId,
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Erro inesperado ao atualizar título', error, {
        service: 'ChatService',
        action: 'updateConversationTitle',
        conversationId,
      });
      return false;
    }
  }

  /**
   * Deletar conversa
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('chat_conversations').delete().eq('id', conversationId);

      if (error) {
        logger.error('Erro ao deletar conversa', error, {
          service: 'ChatService',
          action: 'deleteConversation',
          conversationId,
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Erro inesperado ao deletar conversa', error, {
        service: 'ChatService',
        action: 'deleteConversation',
        conversationId,
      });
      return false;
    }
  }

  /**
   * Deletar mensagem
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('chat_messages').delete().eq('id', messageId);

      if (error) {
        logger.error('Erro ao deletar mensagem', error, {
          service: 'ChatService',
          action: 'deleteMessage',
          messageId,
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Erro inesperado ao deletar mensagem', error, {
        service: 'ChatService',
        action: 'deleteMessage',
        messageId,
      });
      return false;
    }
  }

  /**
   * Subscrever a mudanças em mensagens (realtime)
   */
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const chatService = new ChatService();
export default chatService;
