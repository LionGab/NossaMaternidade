/**
 * useSession Hook
 * Hook React para componentes acessarem sessão com auto-validação
 */

import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { sessionManager, SessionState } from '../services/sessionManager';
import { ChatSessionData } from '../services/sessionPersistence';

export interface UseSessionReturn {
  // Auth
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isValid: boolean;
  isLoading: boolean;

  // Chat
  chatSession: ChatSessionData | null;
  chatLoading: boolean;

  // Analytics
  analyticsSessionId: string | null;

  // Methods
  refresh: () => Promise<boolean>;
  validate: () => Promise<boolean>;
  setChatSession: (session: ChatSessionData | null) => void;
}

/**
 * Hook para acessar e gerenciar sessões
 */
export function useSession(): UseSessionReturn {
  const [state, setState] = useState<SessionState>(sessionManager.getState());

  useEffect(() => {
    // Inicializar se necessário
    if (state.auth.isLoading) {
      sessionManager.initialize().catch((error) => {
        console.error('[useSession] Erro ao inicializar:', error);
      });
    }

    // Escutar mudanças
    const unsubscribe = sessionManager.addListener((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    return await sessionManager.refreshAuth();
  }, []);

  const validate = useCallback(async (): Promise<boolean> => {
    return await sessionManager.validateAuth();
  }, []);

  const setChatSession = useCallback((session: ChatSessionData | null) => {
    sessionManager.setChatSession(session);
  }, []);

  return {
    // Auth
    session: state.auth.session,
    user: state.auth.user,
    isAuthenticated: !!state.auth.user,
    isValid: state.auth.isValid,
    isLoading: state.auth.isLoading,

    // Chat
    chatSession: state.chat.currentSession,
    chatLoading: state.chat.isLoading,

    // Analytics
    analyticsSessionId: state.analytics.sessionId,

    // Methods
    refresh,
    validate,
    setChatSession,
  };
}

export default useSession;

