/**
 * Analytics MCP Server
 * Fornece tracking de eventos, telas e comportamento do usuário
 * Preparado para integração com Firebase Analytics, Amplitude, etc.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
} from '../types';

const ANALYTICS_SESSION_KEY = '@analytics_session_id';

interface AnalyticsEvent {
  id: string;
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

interface UserIdentity {
  userId: string;
  traits?: Record<string, any>;
  timestamp: number;
}

export class AnalyticsMCPServer implements MCPServer {
  name = 'analytics-mcp';
  version = '1.0.0';

  private initialized = false;
  private sessionId: string | null = null;
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = '@analytics_events';
  private readonly MAX_QUEUE_SIZE = 100;

  async initialize(): Promise<void> {
    try {
      // Tentar restaurar session ID persistido
      let storedSessionId: string | null = null;

      if (Platform.OS === 'web') {
        storedSessionId = await AsyncStorage.getItem(ANALYTICS_SESSION_KEY);
      } else {
        storedSessionId = await SecureStore.getItemAsync(ANALYTICS_SESSION_KEY);
      }

      if (storedSessionId) {
        this.sessionId = storedSessionId;
        console.log('[AnalyticsMCP] Session ID restaurado:', this.sessionId);
      } else {
        // Gerar novo session ID
        this.sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Persistir session ID
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem(ANALYTICS_SESSION_KEY, this.sessionId);
        } else {
          await SecureStore.setItemAsync(ANALYTICS_SESSION_KEY, this.sessionId);
        }

        console.log('[AnalyticsMCP] Novo session ID criado:', this.sessionId);
      }

      // Restaurar eventos pendentes do storage
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.eventQueue = JSON.parse(stored);
      }

      // Restaurar userId se existir
      const storedUserId = await AsyncStorage.getItem('@user_id');
      if (storedUserId) {
        this.userId = storedUserId;
      }

      this.initialized = true;
      console.log('[AnalyticsMCP] Initialized successfully');

      // Track session start
      await this.trackEvent('session_start', {
        sessionId: this.sessionId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('[AnalyticsMCP] Initialization failed:', error);
      throw error;
    }
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return createMCPResponse(request.id, undefined, {
        code: 'NOT_INITIALIZED',
        message: 'MCP Server not initialized',
      });
    }

    try {
      const [category, action] = request.method.split('.');

      switch (category) {
        case 'event':
          return await this.handleEvent(request.id, action, request.params);
        case 'screen':
          return await this.handleScreen(request.id, action, request.params);
        case 'user':
          return await this.handleUser(request.id, action, request.params);
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

  private async handleEvent(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    switch (action) {
      case 'track': {
        const { name, properties } = params;
        await this.trackEvent(name, properties);

        return createMCPResponse(id, {
          success: true,
          eventName: name,
          timestamp: Date.now(),
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown event action: ${action}`,
        });
    }
  }

  private async handleScreen(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    switch (action) {
      case 'view': {
        const { name, properties } = params;
        await this.trackEvent('screen_view', {
          screen_name: name,
          ...properties,
        });

        return createMCPResponse(id, {
          success: true,
          screenName: name,
          timestamp: Date.now(),
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown screen action: ${action}`,
        });
    }
  }

  private async handleUser(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    switch (action) {
      case 'identify': {
        const { userId, traits } = params;

        this.userId = userId;
        await AsyncStorage.setItem('@user_id', userId);

        await this.trackEvent('user_identify', {
          userId,
          traits,
        });

        return createMCPResponse(id, {
          success: true,
          userId,
          timestamp: Date.now(),
        });
      }

      case 'alias': {
        const { previousId, userId } = params;

        await this.trackEvent('user_alias', {
          previousId,
          userId,
        });

        return createMCPResponse(id, {
          success: true,
          previousId,
          userId,
          timestamp: Date.now(),
        });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown user action: ${action}`,
        });
    }
  }

  private async trackEvent(
    name: string,
    properties?: Record<string, any>
  ): Promise<void> {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      properties,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId || undefined,
    };

    // Adicionar à fila
    this.eventQueue.push(event);

    // Limitar tamanho da fila
    if (this.eventQueue.length > this.MAX_QUEUE_SIZE) {
      this.eventQueue = this.eventQueue.slice(-this.MAX_QUEUE_SIZE);
    }

    // Persistir eventos
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      console.error('[AnalyticsMCP] Failed to persist events:', error);
    }

    // Log para desenvolvimento
    console.log('[AnalyticsMCP] Event tracked:', {
      name,
      properties,
      userId: this.userId,
      sessionId: this.sessionId,
    });

    // TODO: Enviar para backend analytics quando implementado
    // await this.sendToBackend(event);
  }

  /**
   * Obtém estatísticas da sessão atual
   */
  async getSessionStats(): Promise<{
    sessionId: string | null;
    userId: string | null;
    eventsCount: number;
    events: AnalyticsEvent[];
  }> {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventsCount: this.eventQueue.length,
      events: this.eventQueue,
    };
  }

  /**
   * Limpa a fila de eventos
   */
  async clearQueue(): Promise<void> {
    this.eventQueue = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  async shutdown(): Promise<void> {
    // Track session end
    await this.trackEvent('session_end', {
      sessionId: this.sessionId,
      duration: Date.now(),
      eventsCount: this.eventQueue.length,
    });

    // Persistir eventos finais
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      console.error('[AnalyticsMCP] Failed to persist final events:', error);
    }

    // Session ID é mantido para continuidade entre restarts
    // Não limpar this.sessionId aqui

    this.initialized = false;

    console.log('[AnalyticsMCP] Shutdown complete');
  }
}

// Singleton instance
export const analyticsMCP = new AnalyticsMCPServer();
