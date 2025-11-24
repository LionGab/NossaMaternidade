/**
 * Session Persistence Service
 * Persiste e recupera sessões de chat no Supabase
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import { ChatSession, ChatMessage } from '../agents/maternal/MaternalChatAgent';

export interface PersistedChatSession {
  conversation_id: string;
  user_id: string;
  title?: string;
  messages: ChatMessage[];
  started_at: string;
  last_activity_at: string;
  context?: Record<string, unknown>;
}

class SessionPersistenceService {
  /**
   * Salva uma sessão de chat no Supabase
   */
  async saveChatSession(session: ChatSession): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('[SessionPersistence] Usuário não autenticado, não é possível salvar sessão');
        return false;
      }

      // Verificar se já existe uma conversa para esta sessão
      let conversationId = session.id.replace('session_', '');

      // Tentar encontrar conversa existente pelo ID
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', conversationId)
        .single();

      // Se não existe, criar nova conversa
      if (!existingConv) {
        const { data: newConv, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            id: conversationId,
            user_id: user.id,
            title: session.messages[0]?.content?.substring(0, 50) || 'Nova conversa',
            model: 'gemini-pro',
            updated_at: new Date(session.lastActivityAt).toISOString(),
          })
          .select()
          .single();

        if (convError) {
          logger.error('[SessionPersistence] Erro ao criar conversa', convError);
          return false;
        }
      } else {
        // Atualizar updated_at da conversa existente
        await supabase
          .from('chat_conversations')
          .update({ updated_at: new Date(session.lastActivityAt).toISOString() })
          .eq('id', conversationId);
      }

      // Salvar mensagens (apenas as novas/atualizadas)
      const existingMessages = await this.getMessages(conversationId);

      // Filtrar mensagens que ainda não foram salvas
      const messagesToSave = session.messages.filter(
        (msg) => !existingMessages.some((existing) => existing.id === msg.id)
      );

      if (messagesToSave.length > 0) {
        const messagesData = messagesToSave.map((msg) => ({
          conversation_id: conversationId,
          role: msg.role,
          content: msg.content,
          metadata: {
            ...msg.metadata,
            timestamp: msg.timestamp,
          },
        }));

        const { error: messagesError } = await supabase
          .from('chat_messages')
          .insert(messagesData);

        if (messagesError) {
          logger.error('[SessionPersistence] Erro ao salvar mensagens', messagesError);
          return false;
        }
      }

      logger.debug('[SessionPersistence] Sessão salva com sucesso', {
        conversationId,
        messageCount: session.messages.length,
      });

      return true;
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao salvar sessão', error);
      return false;
    }
  }

  /**
   * Carrega uma sessão de chat do Supabase
   */
  async loadChatSession(conversationId: string): Promise<ChatSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('[SessionPersistence] Usuário não autenticado');
        return null;
      }

      // Buscar conversa
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (convError || !conversation) {
        logger.debug('[SessionPersistence] Conversa não encontrada', { conversationId });
        return null;
      }

      // Buscar mensagens
      const messages = await this.getMessages(conversationId);

      // Converter para formato ChatSession
      const chatSession: ChatSession = {
        id: `session_${conversation.id}`,
        userId: user.id,
        messages: messages.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
          timestamp: new Date(msg.created_at).getTime(),
          metadata: msg.metadata || {},
        })),
        startedAt: new Date(conversation.created_at).getTime(),
        lastActivityAt: new Date(conversation.updated_at).getTime(),
        context: {},
      };

      logger.debug('[SessionPersistence] Sessão carregada', {
        conversationId,
        messageCount: chatSession.messages.length,
      });

      return chatSession;
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao carregar sessão', error);
      return null;
    }
  }

  /**
   * Lista todas as conversas do usuário
   */
  async listConversations(limit = 50): Promise<PersistedChatSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error || !conversations) {
        logger.error('[SessionPersistence] Erro ao listar conversas', error);
        return [];
      }

      // Carregar mensagens para cada conversa
      const sessions = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await this.getMessages(conv.id);
          return {
            conversation_id: conv.id,
            user_id: user.id,
            title: conv.title,
            messages: messages.map((msg) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content,
              timestamp: new Date(msg.created_at).getTime(),
              metadata: msg.metadata || {},
            })),
            started_at: conv.created_at,
            last_activity_at: conv.updated_at,
            context: {},
          };
        })
      );

      return sessions;
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao listar conversas', error);
      return [];
    }
  }

  /**
   * Busca mensagens de uma conversa
   */
  private async getMessages(conversationId: string): Promise<Array<{
    id: string;
    role: string;
    content: string;
    created_at: string;
    metadata: Record<string, unknown> | null;
  }>> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at, metadata')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('[SessionPersistence] Erro ao buscar mensagens', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao buscar mensagens', error);
      return [];
    }
  }

  /**
   * Sincroniza sessões localmente com o servidor
   */
  async syncSessions(): Promise<void> {
    try {
      logger.info('[SessionPersistence] Iniciando sincronização de sessões');
      // Aqui poderia implementar lógica de sincronização bidirecional
      // Por enquanto, apenas log
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao sincronizar sessões', error);
    }
  }

  /**
   * Remove uma conversa
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        logger.error('[SessionPersistence] Erro ao deletar conversa', error);
        return false;
      }

      logger.debug('[SessionPersistence] Conversa deletada', { conversationId });
      return true;
    } catch (error) {
      logger.error('[SessionPersistence] Erro ao deletar conversa', error);
      return false;
    }
  }
}

export const sessionPersistence = new SessionPersistenceService();
export default sessionPersistence;
