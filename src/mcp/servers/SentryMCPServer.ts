/**
 * Sentry MCP Server
 * Fornece acesso ao Sentry para monitoramento de releases, crashes e saúde do app
 * Integrado com @sentry/react-native e Sentry API REST
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { logger } from '../../utils/logger';
import { supabase } from '../../services/supabase';
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
  JsonValue,
} from '../types';
import { sentryConfig } from '../utils/envConfig';

// Tipos para dados do Sentry
interface SentryRelease {
  version: string;
  dateCreated: string;
  dateReleased?: string;
  projects: Array<{ id: string; name: string; slug: string }>;
  newGroups: number;
  ref?: string;
  url?: string;
}

interface SentryIssue {
  id: string;
  title: string;
  culprit: string;
  level: 'fatal' | 'error' | 'warning' | 'info';
  status: 'resolved' | 'unresolved' | 'ignored';
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  permalink: string;
  metadata?: {
    value?: string;
    type?: string;
    filename?: string;
  };
}

interface SentryReleaseHealth {
  release: string;
  date: string;
  new: number;
  resolved: number;
  regressed: number;
  unhandled: number;
  unhandledNew: number;
  unhandledRegressed: number;
  crashFreeUsers: number | null;
  crashFreeSessions: number | null;
  sessions: number;
  users: number;
}

interface SentryTopCrash {
  issueId: string;
  title: string;
  count: number;
  userCount: number;
  crashFreeRate: number;
  platform?: string;
  deviceModel?: string;
}

export class SentryMCPServer implements MCPServer {
  name = 'sentry-mcp';
  version = '1.0.0';

  private initialized = false;
  private apiToken: string | null = null;
  private organizationSlug: string | null = null;
  private projectSlug: string | null = null;
  // baseUrl removido - agora usa Edge Function

  async initialize(): Promise<void> {
    try {
      // Obter credenciais do Sentry via envConfig (mobile-safe)
      this.apiToken = sentryConfig.apiToken;
      this.organizationSlug = sentryConfig.organizationSlug;
      this.projectSlug = sentryConfig.projectSlug;

      // Se não tiver token, ainda inicializa mas métodos que precisam de API retornarão erro
      if (!this.apiToken) {
        logger.warn(
          '[SentryMCP] Inicializado sem API token - métodos de API não estarão disponíveis'
        );
      }

      this.initialized = true;
      logger.info('[SentryMCP] Initialized successfully', {
        hasToken: !!this.apiToken,
        platform: Platform.OS,
        organization: this.organizationSlug,
        project: this.projectSlug,
      });
    } catch (error) {
      logger.error('[SentryMCP] Initialization failed', error);
      throw error;
    }
  }

  async handleRequest<T = JsonValue>(request: MCPRequest): Promise<MCPResponse<T>> {
    if (!this.initialized) {
      return createMCPResponse(request.id, null, {
        code: 'NOT_INITIALIZED',
        message: 'MCP Server not initialized',
      }) as MCPResponse<T>;
    }

    try {
      const [category, action] = request.method.split('.');

      switch (category) {
        case 'release':
          return (await this.handleRelease(request.id, action, request.params)) as MCPResponse<T>;
        case 'crash':
          return (await this.handleCrash(request.id, action, request.params)) as MCPResponse<T>;
        case 'health':
          return (await this.handleHealth(request.id, action, request.params)) as MCPResponse<T>;
        default:
          return createMCPResponse(request.id, null, {
            code: 'UNKNOWN_METHOD',
            message: `Unknown method category: ${category}`,
          }) as MCPResponse<T>;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      return createMCPResponse(request.id, null, {
        code: 'INTERNAL_ERROR',
        message: errorMessage,
        details:
          error instanceof Error
            ? { message: error.message, stack: error.stack ?? '' }
            : { error: String(error) },
      }) as MCPResponse<T>;
    }
  }

  private async handleRelease(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'list': {
        const { limit = 10 } = params as { limit?: number };
        const releases = await this.listReleases(limit);
        return createMCPResponse(id, releases as unknown as JsonValue);
      }

      case 'get': {
        const { version } = params as { version: string };
        const release = await this.getRelease(version);
        return createMCPResponse(id, release as unknown as JsonValue);
      }

      case 'getCurrent': {
        const currentRelease = this.getCurrentRelease();
        return createMCPResponse(id, currentRelease as unknown as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown release action: ${action}`,
        });
    }
  }

  private async handleCrash(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'listTop': {
        const { release, limit = 10 } = params as { release?: string; limit?: number };
        const crashes = await this.listTopCrashes(release, limit);
        return createMCPResponse(id, crashes as unknown as JsonValue);
      }

      case 'getIssue': {
        const { issueId } = params as { issueId: string };
        const issue = await this.getIssue(issueId);
        return createMCPResponse(id, issue as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown crash action: ${action}`,
        });
    }
  }

  private async handleHealth(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getReleaseHealth': {
        const { release, since } = params as { release: string; since?: string };
        const health = await this.getReleaseHealth(release, since);
        return createMCPResponse(id, health as JsonValue);
      }

      case 'checkCrashRate': {
        const { release, threshold = 1.5 } = params as {
          release: string;
          threshold?: number;
        };
        const result = await this.checkCrashRate(release, threshold);
        return createMCPResponse(id, result);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown health action: ${action}`,
        });
    }
  }

  /**
   * Lista releases do projeto
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async listReleases(limit = 10): Promise<SentryRelease[]> {
    if (!this.apiToken || !this.organizationSlug || !this.projectSlug) {
      logger.warn('[SentryMCP] API token não configurado - retornando release local');
      return [this.getCurrentRelease()];
    }

    try {
      // Chamar via Edge Function (tokens ficam no servidor)
      const { data, error } = await supabase.functions.invoke('sentry-proxy', {
        body: {
          action: 'listReleases',
          params: {
            organizationSlug: this.organizationSlug,
            projectSlug: this.projectSlug,
            limit,
          },
        },
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (data && Array.isArray(data)) {
        return data as SentryRelease[];
      }

      // Fallback: retornar release atual
      return [this.getCurrentRelease()];
    } catch (error) {
      logger.error('[SentryMCP] Failed to list releases', error);
      // Fallback: retornar release atual
      return [this.getCurrentRelease()];
    }
  }

  /**
   * Obtém detalhes de um release específico
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async getRelease(version: string): Promise<SentryRelease | null> {
    if (!this.apiToken || !this.organizationSlug || !this.projectSlug) {
      logger.warn('[SentryMCP] API token não configurado');
      return null;
    }

    try {
      // Chamar via Edge Function
      const { data, error } = await supabase.functions.invoke('sentry-proxy', {
        body: {
          action: 'getRelease',
          params: {
            organizationSlug: this.organizationSlug,
            projectSlug: this.projectSlug,
            version,
          },
        },
      });

      if (error) {
        if (error.message.includes('404')) {
          return null;
        }
        throw new Error(`Edge function error: ${error.message}`);
      }

      return (data as SentryRelease) || null;
    } catch (error) {
      logger.error('[SentryMCP] Failed to get release', error);
      return null;
    }
  }

  /**
   * Obtém release atual do app (baseado em Constants)
   */
  private getCurrentRelease(): SentryRelease {
    const version = Constants.expoConfig?.version || '1.0.0';
    const buildNumber =
      Constants.expoConfig?.ios?.buildNumber ||
      Constants.expoConfig?.android?.versionCode?.toString() ||
      '1';

    return {
      version: `${version}+${buildNumber}`,
      dateCreated: new Date().toISOString(),
      projects: [
        {
          id: this.projectSlug || 'nossa-maternidade-mobile',
          name: 'Nossa Maternidade Mobile',
          slug: this.projectSlug || 'nossa-maternidade-mobile',
        },
      ],
      newGroups: 0,
      ref: buildNumber,
    };
  }

  /**
   * Lista top crashes de um release
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async listTopCrashes(
    release?: string,
    limit = 10
  ): Promise<SentryTopCrash[]> {
    if (!this.apiToken || !this.organizationSlug || !this.projectSlug) {
      logger.warn('[SentryMCP] API token não configurado');
      return [];
    }

    const targetRelease = release || this.getCurrentRelease().version;

    try {
      // Chamar via Edge Function
      const { data, error } = await supabase.functions.invoke('sentry-proxy', {
        body: {
          action: 'listTopCrashes',
          params: {
            organizationSlug: this.organizationSlug,
            projectSlug: this.projectSlug,
            release: targetRelease,
            limit,
          },
        },
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (data && Array.isArray(data)) {
        return data as SentryTopCrash[];
      }

      return [];
    } catch (error) {
      logger.error('[SentryMCP] Failed to list top crashes', error);
      return [];
    }
  }

  /**
   * Obtém detalhes de uma issue específica
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async getIssue(issueId: string): Promise<SentryIssue | null> {
    if (!this.apiToken || !this.organizationSlug || !this.projectSlug) {
      logger.warn('[SentryMCP] API token não configurado');
      return null;
    }

    try {
      // Chamar via Edge Function
      const { data, error } = await supabase.functions.invoke('sentry-proxy', {
        body: {
          action: 'getIssue',
          params: {
            organizationSlug: this.organizationSlug,
            projectSlug: this.projectSlug,
            issueId,
          },
        },
      });

      if (error) {
        if (error.message.includes('404')) {
          return null;
        }
        throw new Error(`Edge function error: ${error.message}`);
      }

      return (data as SentryIssue) || null;
    } catch (error) {
      logger.error('[SentryMCP] Failed to get issue', error);
      return null;
    }
  }

  /**
   * Obtém saúde de um release (crash-free rate, sessions, etc)
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async getReleaseHealth(
    release: string,
    since?: string
  ): Promise<SentryReleaseHealth | null> {
    if (!this.apiToken || !this.organizationSlug || !this.projectSlug) {
      logger.warn('[SentryMCP] API token não configurado');
      return null;
    }

    try {
      // Chamar via Edge Function
      const { data, error } = await supabase.functions.invoke('sentry-proxy', {
        body: {
          action: 'getReleaseHealth',
          params: {
            organizationSlug: this.organizationSlug,
            projectSlug: this.projectSlug,
            release,
            since: since || '14d',
          },
        },
      });

      if (error) {
        if (error.message.includes('404')) {
          return null;
        }
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (data) {
        return data as SentryReleaseHealth;
      }

      return null;
    } catch (error) {
      logger.error('[SentryMCP] Failed to get release health', error);
      return null;
    }
  }

  /**
   * Verifica se crash rate está acima do threshold
   */
  private async checkCrashRate(
    release: string,
    threshold = 1.5
  ): Promise<{
    release: string;
    crashFreeRate: number | null;
    threshold: number;
    isHealthy: boolean;
    recommendation: string;
  }> {
    const health = await this.getReleaseHealth(release);

    if (!health || health.crashFreeSessions === null) {
      return {
        release,
        crashFreeRate: null,
        threshold,
        isHealthy: false,
        recommendation: 'Não foi possível calcular crash rate. Verifique configuração do Sentry.',
      };
    }

    const crashRate = 100 - health.crashFreeSessions;
    const isHealthy = crashRate <= threshold;

    return {
      release,
      crashFreeRate: health.crashFreeSessions,
      threshold,
      isHealthy,
      recommendation: isHealthy
        ? `Release saudável (crash rate: ${crashRate.toFixed(2)}% <= ${threshold}%)`
        : `⚠️ ATENÇÃO: Crash rate alto (${crashRate.toFixed(2)}% > ${threshold}%). Não promover para produção.`,
    };
  }

  async shutdown(): Promise<void> {
    this.apiToken = null;
    this.organizationSlug = null;
    this.projectSlug = null;
    this.initialized = false;
    logger.info('[SentryMCP] Shutdown complete');
  }
}

// Singleton instance
export const sentryMCP = new SentryMCPServer();

