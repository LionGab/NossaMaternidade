/**
 * Session Persistence Service
 * Gerencia persistência de sessões de chat no Supabase
 */

import { supabase } from './supabase';
import { chatService, ChatConversation, ChatMessage } from './chatService';
import { networkMonitor } from '../utils/networkMonitor';
import { logger } from '../utils/logger';

export interface ChatSessionData {
  id: string;
  userId: string;
  conversationId?: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    metadata?: any;
  }>;
  startedAt: number;
  lastActivityAt: number;
  context?: any;
}

class SessionPersistenceService {
  /**
   * Salva uma sessão de chat no Supabase
   */
  async saveChatSession(session: ChatSessionData): Promise<boolean> {
    try {
      // Verificar se está online
      if (!networkMonitor.isOnline()) {
        logger.warn('Offline - adicionando à queue');
        networkMonitor.addToOfflineQueue(() => this.saveChatSession(session));
        return false; // Retorna false mas a operação será executada quando online
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('Usuário não autenticado');
        return false;
      }

      // Criar ou obter conversa
      let conversationId = session.conversationId;

      if (!conversationId) {
        // Criar nova conversa
        const conversation = await chatService.createConversation({
          title: this.generateConversationTitle(session.messages),
          model: 'gemini-pro',
        });

        if (!conversation) {
          logger.error('Erro ao criar conversa');
          return false;
        }

        conversationId = conversation.id;
      }

      // Salvar mensagens que ainda não foram salvas
      const existingMessages = await chatService.getMessages(conversationId);
      const existingMessageIds = new Set(existingMessages.map((m) => m.id));

      for (const message of session.messages) {
        // Verificar se mensagem já existe (comparar por timestamp e conteúdo)
        const exists = existingMessages.some(
          (m) =>
            Math.abs(new Date(m.created_at).getTime() - message.timestamp) < 1000 &&
            m.content === message.content
        );

        if (!exists) {
          await chatService.sendMessage({
            conversation_id: conversationId,
            content: message.content,
            role: message.role,
          });
        }
      }

      // Atualizar updated_at da conversa
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

        logger.info(`Sessão salva: ${conversationId}`, { conversationId });
      return true;
    } catch (error) {
      logger.error('Erro ao salvar sessão', error);
      // Adicionar à queue offline se houver erro de rede
      if (error instanceof Error && error.message.includes('network')) {
        networkMonitor.addToOfflineQueue(() => this.saveChatSession(session));
      }
      return false;
    }
  }

  /**
   * Carrega a última sessão de chat do usuário
   */
  async loadLastChatSession(): Promise<ChatSessionData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      // Buscar última conversa
      const conversations = await chatService.getConversations(1);
      if (conversations.length === 0) {
        return null;
      }

      const conversation = conversations[0];
      const messages = await chatService.getMessages(conversation.id);

      // Converter mensagens do formato Supabase para formato de sessão
      const sessionMessages = messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        metadata: msg.metadata || {},
      }));

      return {
        id: `session_${conversation.id}`,
        userId: user.id,
        conversationId: conversation.id,
        messages: sessionMessages,
        startedAt: new Date(conversation.created_at).getTime(),
        lastActivityAt: new Date(conversation.updated_at).getTime(),
      };
    } catch (error) {
      console.error('[SessionPersistence] Erro ao carregar sessão:', error);
      return null;
    }
  }

  /**
   * Carrega uma sessão específica por ID de conversa
   */
  async loadChatSession(conversationId: string): Promise<ChatSessionData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      const conversation = await chatService.getConversations().then((convs) =>
        convs.find((c) => c.id === conversationId)
      );

      if (!conversation) {
        return null;
      }

      const messages = await chatService.getMessages(conversationId);

      const sessionMessages = messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        metadata: msg.metadata || {},
      }));

      return {
        id: `session_${conversationId}`,
        userId: user.id,
        conversationId: conversation.id,
        messages: sessionMessages,
        startedAt: new Date(conversation.created_at).getTime(),
        lastActivityAt: new Date(conversation.updated_at).getTime(),
      };
    } catch (error) {
      console.error('[SessionPersistence] Erro ao carregar sessão:', error);
      return null;
    }
  }

  /**
   * Sincroniza todas as sessões pendentes
   */
  async syncSessions(): Promise<void> {
    if (!networkMonitor.isOnline()) {
      console.log('[SessionPersistence] Offline - sincronização adiada');
      return;
    }

    // A queue do networkMonitor já processa automaticamente quando online
    // Este método pode ser usado para forçar sincronização manual
    console.log('[SessionPersistence] Sincronização de sessões iniciada');
  }

  /**
   * Gera título para conversa baseado nas primeiras mensagens
   */
  private generateConversationTitle(messages: ChatSessionData['messages']): string {
    if (messages.length === 0) {
      return 'Nova conversa';
    }

    // Pegar primeira mensagem do usuário
    const firstUserMessage = messages.find((m) => m.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.substring(0, 50);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }

    return 'Nova conversa';
  }
}

export const sessionPersistence = new SessionPersistenceService();
export default sessionPersistence;

