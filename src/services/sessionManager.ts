/**
 * Session Manager
 * Gerenciador unificado de todas as sessões (auth, chat, analytics)
 */

import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseReady } from './supabase';
import { validateAuthSession, ensureValidSession, getValidSession } from '../middleware/sessionValidator';
import { sessionPersistence, ChatSessionData } from './sessionPersistence';
import { networkMonitor } from '../utils/networkMonitor';
import { logger } from '../utils/logger';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_SESSION_KEY = '@analytics_session_id';

export interface SessionState {
  auth: {
    session: Session | null;
    user: User | null;
    isValid: boolean;
    isLoading: boolean;
  };
  chat: {
    currentSession: ChatSessionData | null;
    isLoading: boolean;
  };
  analytics: {
    sessionId: string | null;
  };
}

type SessionChangeCallback = (state: SessionState) => void;

class SessionManager {
  private state: SessionState = {
    auth: {
      session: null,
      user: null,
      isValid: false,
      isLoading: true,
    },
    chat: {
      currentSession: null,
      isLoading: false,
    },
    analytics: {
      sessionId: null,
    },
  };

  private listeners: Set<SessionChangeCallback> = new Set();
  private authSubscription: any = null;

  /**
   * Inicializa o Session Manager
   */
  async initialize(): Promise<void> {
    logger.info('Inicializando Session Manager');

    // Inicializar auth session
    await this.initializeAuth();

    // Inicializar analytics session
    await this.initializeAnalytics();

    // Inicializar chat session (se houver)
    await this.initializeChat();

      logger.info('Inicialização completa');
  }

  /**
   * Inicializa sessão de autenticação
   */
  private async initializeAuth(): Promise<void> {
    if (!isSupabaseReady()) {
      this.updateAuthState({
        session: null,
        user: null,
        isValid: false,
        isLoading: false,
      });
      return;
    }

    try {
      // Obter sessão inicial
      const validation = await getValidSession();
      this.updateAuthState({
        session: validation.session,
        user: validation.session?.user ?? null,
        isValid: validation.isValid,
        isLoading: false,
      });

      // Escutar mudanças de autenticação
      this.authSubscription = supabase.auth.onAuthStateChange(async (_event, session) => {
        const validation = await ensureValidSession(session);
        this.updateAuthState({
          session: validation.session,
          user: validation.session?.user ?? null,
          isValid: validation.isValid,
          isLoading: false,
        });
      });
    } catch (error) {
      logger.error('Erro ao inicializar auth', error);
      this.updateAuthState({
        session: null,
        user: null,
        isValid: false,
        isLoading: false,
      });
    }
  }

  /**
   * Inicializa sessão de analytics
   */
  private async initializeAnalytics(): Promise<void> {
    try {
      let sessionId: string | null = null;

      if (Platform.OS === 'web') {
        sessionId = await AsyncStorage.getItem(ANALYTICS_SESSION_KEY);
      } else {
        sessionId = await SecureStore.getItemAsync(ANALYTICS_SESSION_KEY);
      }

      // Se não existe, criar novo
      if (!sessionId) {
        sessionId = `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        if (Platform.OS === 'web') {
          await AsyncStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
        } else {
          await SecureStore.setItemAsync(ANALYTICS_SESSION_KEY, sessionId);
        }
      }

      this.updateAnalyticsState({ sessionId });
    } catch (error) {
      logger.error('Erro ao inicializar analytics', error);
    }
  }

  /**
   * Inicializa sessão de chat
   */
  private async initializeChat(): Promise<void> {
    this.updateChatState({ currentSession: null, isLoading: true });

    try {
      const lastSession = await sessionPersistence.loadLastChatSession();
      this.updateChatState({
        currentSession: lastSession,
        isLoading: false,
      });
    } catch (error) {
      logger.error('Erro ao inicializar chat', error);
      this.updateChatState({
        currentSession: null,
        isLoading: false,
      });
    }
  }

  /**
   * Obtém estado atual das sessões
   */
  getState(): SessionState {
    return { ...this.state };
  }

  /**
   * Obtém sessão de autenticação
   */
  getAuthSession(): Session | null {
    return this.state.auth.session;
  }

  /**
   * Obtém usuário atual
   */
  getCurrentUser(): User | null {
    return this.state.auth.user;
  }

  /**
   * Verifica se sessão de auth é válida
   */
  async validateAuth(): Promise<boolean> {
    const validation = await validateAuthSession(this.state.auth.session);
    this.updateAuthState({
      ...this.state.auth,
      isValid: validation.isValid,
    });
    return validation.isValid;
  }

  /**
   * Força refresh da sessão de auth
   */
  async refreshAuth(): Promise<boolean> {
    const validation = await ensureValidSession(this.state.auth.session);
    this.updateAuthState({
      session: validation.session,
      user: validation.session?.user ?? null,
      isValid: validation.isValid,
      isLoading: false,
    });
    return validation.isValid;
  }

  /**
   * Obtém sessão de chat atual
   */
  getChatSession(): ChatSessionData | null {
    return this.state.chat.currentSession;
  }

  /**
   * Define sessão de chat atual
   */
  setChatSession(session: ChatSessionData | null): void {
    this.updateChatState({
      currentSession: session,
      isLoading: false,
    });

    // Salvar automaticamente
    if (session) {
      sessionPersistence.saveChatSession(session).catch((error) => {
        console.error('[SessionManager] Erro ao salvar sessão de chat:', error);
      });
    }
  }

  /**
   * Obtém session ID de analytics
   */
  getAnalyticsSessionId(): string | null {
    return this.state.analytics.sessionId;
  }

  /**
   * Adiciona listener para mudanças de sessão
   */
  addListener(callback: SessionChangeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Limpa todas as sessões
   */
  async clearAllSessions(): Promise<void> {
    // Limpar auth
    if (isSupabaseReady()) {
      await supabase.auth.signOut();
    }

    // Limpar chat
    this.updateChatState({
      currentSession: null,
      isLoading: false,
    });

    // Limpar analytics (criar novo ID)
    await this.initializeAnalytics();

    // Notificar listeners
    this.notifyListeners();
  }

  /**
   * Atualiza estado de auth
   */
  private updateAuthState(auth: SessionState['auth']): void {
    this.state.auth = { ...auth };
    this.notifyListeners();
  }

  /**
   * Atualiza estado de chat
   */
  private updateChatState(chat: SessionState['chat']): void {
    this.state.chat = { ...chat };
    this.notifyListeners();
  }

  /**
   * Atualiza estado de analytics
   */
  private updateAnalyticsState(analytics: SessionState['analytics']): void {
    this.state.analytics = { ...analytics };
    this.notifyListeners();
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('[SessionManager] Erro ao notificar listener:', error);
      }
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;

