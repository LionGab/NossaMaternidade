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

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
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
    const { data: { user } } = await supabase.auth.getUser();
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
        console.error('Erro ao buscar conversas:', error);
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
      console.error('Erro inesperado ao buscar conversas:', error);
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
        console.error('Erro ao criar conversa:', error);
        return null;
      }

      return conversation as ChatConversation;
    } catch (error) {
      console.error('Erro inesperado ao criar conversa:', error);
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
        console.error('Erro ao buscar mensagens:', error);
        return [];
      }

      return (data || []) as ChatMessage[];
    } catch (error) {
      console.error('Erro inesperado ao buscar mensagens:', error);
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
        console.error('Erro ao enviar mensagem:', error);
        return null;
      }

      // Atualizar updated_at da conversa
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', messageData.conversation_id);

      return data as ChatMessage;
    } catch (error) {
      console.error('Erro inesperado ao enviar mensagem:', error);
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
          await new Promise(resolve => setTimeout(resolve, 50));
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
      console.error('Erro ao enviar mensagem com IA:', error);
      return { userMsg: null, aiMsg: null };
    }
  }

  /**
   * Obter resposta da IA (placeholder - integração real será feita depois)
   */
  private async getAIResponse(history: ChatMessage[], userMessage: string): Promise<string> {
    // TODO: Integrar com Gemini API real
    // Por enquanto, retorna resposta placeholder
    return `Olá! Recebi sua mensagem: "${userMessage}". Estou aqui para te apoiar em sua jornada de maternidade. Como posso te ajudar hoje?`;
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
        console.error('Erro ao atualizar título:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao atualizar título:', error);
      return false;
    }
  }

  /**
   * Deletar conversa
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Erro ao deletar conversa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao deletar conversa:', error);
      return false;
    }
  }

  /**
   * Deletar mensagem
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Erro ao deletar mensagem:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao deletar mensagem:', error);
      return false;
    }
  }

  /**
   * Subscrever a mudanças em mensagens (realtime)
   */
  subscribeToMessages(
    conversationId: string,
    callback: (message: ChatMessage) => void
  ) {
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
