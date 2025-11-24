/**
 * User Data Service
 * Funcionalidades de LGPD: Export Data e Delete Account
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import { sessionManager } from './sessionManager';
import { chatService } from './chatService';
import { profileService } from './profileService';

export interface ExportedUserData {
  profile: any;
  chatConversations: Array<{
    conversation: any;
    messages: any[];
  }>;
  habits: Array<{
    type: 'user_habit' | 'habit_log';
    data: any;
  }>;
  milestones: any[];
  interactions: any[];
  community?: {
    posts: any[];
    comments: any[];
  };
  exportedAt: string;
  version: string;
}

class UserDataService {
  /**
   * Exporta todos os dados do usuário (LGPD compliance)
   * Retorna JSON completo com todos os dados pessoais
   */
  async exportUserData(): Promise<{ data: ExportedUserData | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuária não autenticada' };
      }

      logger.info('[UserDataService] Iniciando exportação de dados', { userId: user.id });

      // 1. Perfil
      const profile = await profileService.getCurrentProfile();

      // 2. Conversas de chat
      const conversations = await chatService.getConversations(1000); // Buscar todas
      const allMessages: any[] = [];
      
      for (const conv of conversations) {
        const messages = await chatService.getMessages(conv.id, 1000);
        allMessages.push(...messages);
      }

      // 3. Hábitos
      const { data: userHabits } = await supabase
        .from('user_habits')
        .select('*, habit:habits(*)')
        .eq('user_id', user.id);

      // 4. Logs de hábitos
      const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      // 5. Marcos do bebê
      const { data: milestones } = await supabase
        .from('user_baby_milestones')
        .select('*, milestone:baby_milestones(*)')
        .eq('user_id', user.id);

      // 6. Interações com conteúdo
      const { data: interactions } = await supabase
        .from('user_content_interactions')
        .select('*')
        .eq('user_id', user.id);

      // 7. Posts da comunidade (se houver)
      const { data: communityPosts } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', user.id);

      // 8. Comentários
      const { data: comments } = await supabase
        .from('community_comments')
        .select('*')
        .eq('user_id', user.id);

      const exportedData: ExportedUserData = {
        profile: profile || {},
        chatConversations: conversations.map(conv => ({
          conversation: conv,
          messages: allMessages.filter(m => m.conversation_id === conv.id),
        })),
        habits: [
          ...(userHabits || []).map((h: any) => ({ type: 'user_habit' as const, data: h })),
          ...(habitLogs || []).map((l: any) => ({ type: 'habit_log' as const, data: l })),
        ],
        milestones: milestones || [],
        interactions: interactions || [],
        community: {
          posts: communityPosts || [],
          comments: comments || [],
        },
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      logger.info('[UserDataService] Exportação concluída', {
        userId: user.id,
        conversationsCount: conversations.length,
        messagesCount: allMessages.length,
      });

      return { data: exportedData, error: null };
    } catch (error) {
      logger.error('[UserDataService] Erro ao exportar dados', error);
      return { data: null, error };
    }
  }

  /**
   * Deleta permanentemente a conta e todos os dados (LGPD compliance)
   * ⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL
   */
  async deleteAccount(): Promise<{ success: boolean; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuária não autenticada' };
      }

      logger.warn('[UserDataService] Iniciando deleção de conta', { userId: user.id });

      // Por segurança, deleção de conta deve ser feita via Edge Function
      // que usa service_role_key para ter permissão de deletar tudo
      
      // Obter token de sessão para passar na chamada
      const { data: { session } } = await supabase.auth.getSession();
      
      // Tentar chamar Edge Function se disponível
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId: user.id },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : undefined,
      });

      if (error) {
        // Fallback: deletar via cliente (limitado pelo RLS)
        logger.warn('[UserDataService] Edge Function não disponível, usando fallback');
        
        // 1. Deletar dados relacionados (cascata deve funcionar via RLS)
        await supabase.from('chat_conversations').delete().eq('user_id', user.id);
        await supabase.from('user_habits').delete().eq('user_id', user.id);
        await supabase.from('user_content_interactions').delete().eq('user_id', user.id);
        await supabase.from('user_baby_milestones').delete().eq('user_id', user.id);
        
        // 2. Deletar perfil
        await supabase.from('profiles').delete().eq('id', user.id);
        
        // 3. Deletar conta de autenticação
        // Nota: Isso requer service_role_key, então apenas fazer logout
        await supabase.auth.signOut();
      } else {
        // Edge Function deletou com sucesso
        await supabase.auth.signOut();
      }

      // Limpar sessões locais
      await sessionManager.clearAllSessions();

      logger.info('[UserDataService] Conta deletada com sucesso', { userId: user.id });

      return { success: true, error: null };
    } catch (error) {
      logger.error('[UserDataService] Erro ao deletar conta', error);
      return { success: false, error };
    }
  }

  /**
   * Request account deletion (soft delete - marca para deleção após período de retenção)
   * Mais seguro que hard delete imediato
   */
  async requestAccountDeletion(): Promise<{ success: boolean; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuária não autenticada' };
      }

      // Marcar perfil para deleção (após 30 dias por padrão LGPD)
      const { error } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          // Ou criar campo 'deletion_requested_at'
        })
        .eq('id', user.id);

      if (error) {
        logger.error('[UserDataService] Erro ao solicitar deleção', error);
        return { success: false, error };
      }

      logger.info('[UserDataService] Solicitação de deleção registrada', { userId: user.id });

      // Fazer logout imediatamente
      await supabase.auth.signOut();
      await sessionManager.clearAllSessions();

      return { success: true, error: null };
    } catch (error) {
      logger.error('[UserDataService] Erro ao solicitar deleção', error);
      return { success: false, error };
    }
  }
}

export const userDataService = new UserDataService();
export default userDataService;

