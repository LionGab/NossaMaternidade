/**
 * Google Play Console MCP Server
 * Fornece acesso ao Google Play Console API para tracks, ANRs, data safety e status de release
 * Requer Google Play Console API (service account ou OAuth)
 */

import { Platform } from 'react-native';

import { logger } from '../../utils/logger';
// supabase import removido - não usado diretamente (Edge Function faz chamadas)
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
  JsonValue,
} from '../types';
import { googlePlayConsoleConfig } from '../utils/envConfig';

// Tipos para Google Play Console
interface PlayTrack {
  track: 'production' | 'beta' | 'alpha' | 'internal';
  releases: Array<{
    versionCodes: string[];
    status: 'completed' | 'draft' | 'halted' | 'inProgress';
    releaseNotes?: Array<{
      language: string;
      text: string;
    }>;
    fractionOfUsers?: number;
    userFraction?: number;
  }>;
}

interface PlayANRStats {
  versionCode: string;
  versionName: string;
  anrRate: number;
  crashRate: number;
  totalUsers: number;
  affectedUsers: number;
  period: string;
}

interface PlayDataSafetyIssue {
  type: 'warning' | 'error';
  severity: 'low' | 'medium' | 'high';
  message: string;
  field?: string;
}

interface PlayStoreListingIssue {
  type: 'warning' | 'error';
  severity: 'low' | 'medium' | 'high';
  message: string;
  locale?: string;
}

interface PlayReleaseStatus {
  packageName: string;
  track: string;
  versionCode: string;
  versionName: string;
  status: string;
  rolloutPercentage: number;
  canPromote: boolean;
  canRollback: boolean;
  issues: Array<PlayDataSafetyIssue | PlayStoreListingIssue>;
}

export class GooglePlayConsoleMCPServer implements MCPServer {
  name = 'googleplayconsole-mcp';
  version = '1.0.0';

  private initialized = false;
  private serviceAccountEmail: string | null = null;
  private privateKey: string | null = null;
  private packageName: string | null = null;
  private baseUrl = 'https://androidpublisher.googleapis.com/androidpublisher/v3';

  async initialize(): Promise<void> {
    try {
      // Obter credenciais do Google Play Console via envConfig (mobile-safe)
      this.serviceAccountEmail = googlePlayConsoleConfig.serviceAccountEmail;
      this.privateKey = googlePlayConsoleConfig.privateKey;
      this.packageName = googlePlayConsoleConfig.packageName;

      // Se não tiver credenciais, ainda inicializa mas métodos retornarão erro
      if (!this.serviceAccountEmail || !this.privateKey) {
        logger.warn(
          '[GooglePlayConsoleMCP] Inicializado sem credenciais - métodos de API não estarão disponíveis'
        );
      }

      this.initialized = true;
      logger.info('[GooglePlayConsoleMCP] Initialized successfully', {
        hasCredentials: !!(this.serviceAccountEmail && this.privateKey),
        platform: Platform.OS,
        packageName: this.packageName || '',
      });
    } catch (error) {
      logger.error('[GooglePlayConsoleMCP] Initialization failed', error);
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
        case 'track':
          return (await this.handleTrack(request.id, action, request.params)) as MCPResponse<T>;
        case 'anr':
          return (await this.handleANR(request.id, action, request.params)) as MCPResponse<T>;
        case 'dataSafety':
          return (await this.handleDataSafety(request.id, action, request.params)) as MCPResponse<T>;
        case 'release':
          return (await this.handleRelease(request.id, action, request.params)) as MCPResponse<T>;
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

  private async handleTrack(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'list': {
        const { packageName } = params as { packageName?: string };
        const tracks = await this.listTracks(packageName || this.packageName || '');
        return createMCPResponse(id, tracks as unknown as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown track action: ${action}`,
        });
    }
  }

  private async handleANR(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getStats': {
        const { packageName, versionCode } = params as {
          packageName?: string;
          versionCode?: string;
        };
        const stats = await this.getANRStats(
          packageName || this.packageName || '',
          versionCode
        );
        return createMCPResponse(id, stats as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown ANR action: ${action}`,
        });
    }
  }

  private async handleDataSafety(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getIssues': {
        const { packageName } = params as { packageName?: string };
        const issues = await this.getDataSafetyIssues(packageName || this.packageName || '');
        return createMCPResponse(id, issues as unknown as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown dataSafety action: ${action}`,
        });
    }
  }

  private async handleRelease(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getStatus': {
        const { packageName, track } = params as {
          packageName?: string;
          track?: string;
        };
        const status = await this.getReleaseStatus(
          packageName || this.packageName || '',
          track
        );
        return createMCPResponse(id, status as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown release action: ${action}`,
        });
    }
  }

  /**
   * Gera OAuth2 access token para Google Play Console API
   * Requer service account credentials
   */
  private async generateAccessToken(): Promise<string> {
    if (!this.serviceAccountEmail || !this.privateKey) {
      throw new Error('Google Play Console credentials not configured');
    }

    // Nota: Em produção, usar biblioteca como 'google-auth-library'
    // Por enquanto, retornar placeholder - implementação real requer biblioteca OAuth2
    logger.warn(
      '[GooglePlayConsoleMCP] OAuth2 token generation not implemented - requires google-auth-library'
    );
    throw new Error(
      'OAuth2 token generation requires google-auth-library (npm install google-auth-library)'
    );
  }

  /**
   * Faz requisição autenticada para Google Play Console API
   */
  private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await this.generateAccessToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Play Console API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as T;
    return data;
  }

  /**
   * Lista tracks de um app
   */
  private async listTracks(packageName: string): Promise<PlayTrack[]> {
    try {
      const data = await this.apiRequest<{ tracks: PlayTrack[] }>(
        `/applications/${packageName}/tracks`
      );
      return data.tracks || [];
    } catch (error) {
      logger.error('[GooglePlayConsoleMCP] Failed to list tracks', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de ANR (Application Not Responding) de uma versão
   */
  private async getANRStats(
    packageName: string,
    versionCode?: string
  ): Promise<PlayANRStats | null> {
    try {
      // Buscar crash/ANR data via Google Play Console API
      // Nota: API real requer parâmetros específicos de data range
      // endpoint será usado pela Edge Function quando implementado
      // @ts-expect-error - Variável mantida para referência futura
      const _endpoint = versionCode
        ? `/applications/${packageName}/crashes?versionCode=${versionCode}`
        : `/applications/${packageName}/crashes`;

      // Por enquanto, retornar estrutura esperada
      // Implementação real requer parsing de dados de crash/ANR da API
      logger.warn(
        '[GooglePlayConsoleMCP] getANRStats partially implemented - requires full API integration'
      );

      return {
        versionCode: versionCode || 'unknown',
        versionName: 'unknown',
        anrRate: 0,
        crashRate: 0,
        totalUsers: 0,
        affectedUsers: 0,
        period: '7d',
      };
    } catch (error) {
      logger.error('[GooglePlayConsoleMCP] Failed to get ANR stats', error);
      return null;
    }
  }

  /**
   * Obtém issues de Data Safety
   */
  private async getDataSafetyIssues(_packageName: string): Promise<PlayDataSafetyIssue[]> {
    try {
      // Buscar data safety status via Google Play Console API
      // Nota: API real requer verificação de compliance
      logger.warn(
        '[GooglePlayConsoleMCP] getDataSafetyIssues partially implemented - requires full API integration'
      );

      // Retornar estrutura vazia - implementação real requer verificação de compliance
      return [];
    } catch (error) {
      logger.error('[GooglePlayConsoleMCP] Failed to get data safety issues', error);
      return [];
    }
  }

  /**
   * Obtém status de release em um track específico
   */
  private async getReleaseStatus(
    packageName: string,
    track?: string
  ): Promise<PlayReleaseStatus | null> {
    try {
      const tracks = await this.listTracks(packageName);
      const targetTrack = track || 'production';

      const trackData = tracks.find((t) => t.track === targetTrack);
      if (!trackData || trackData.releases.length === 0) {
        return null;
      }

      const latestRelease = trackData.releases[0];
      const versionCodes = latestRelease.versionCodes || [];
      const versionCode = versionCodes[0] || 'unknown';

      // Buscar issues de data safety e store listing
      const dataSafetyIssues = await this.getDataSafetyIssues(packageName);

      // Verificar se pode promover (baseado em status do release)
      const canPromote =
        latestRelease.status === 'completed' &&
        trackData.track !== 'production' &&
        dataSafetyIssues.length === 0;

      const canRollback = trackData.track === 'production' && tracks.length > 1;

      return {
        packageName,
        track: targetTrack,
        versionCode,
        versionName: versionCode, // Em produção, buscar versionName real
        status: latestRelease.status,
        rolloutPercentage:
          latestRelease.fractionOfUsers !== undefined
            ? latestRelease.fractionOfUsers * 100
            : latestRelease.userFraction !== undefined
              ? latestRelease.userFraction * 100
              : 100,
        canPromote,
        canRollback,
        issues: dataSafetyIssues,
      };
    } catch (error) {
      logger.error('[GooglePlayConsoleMCP] Failed to get release status', error);
      return null;
    }
  }

  async shutdown(): Promise<void> {
    this.serviceAccountEmail = null;
    this.privateKey = null;
    this.packageName = null;
    this.initialized = false;
    logger.info('[GooglePlayConsoleMCP] Shutdown complete');
  }
}

// Singleton instance
export const googlePlayConsoleMCP = new GooglePlayConsoleMCPServer();

