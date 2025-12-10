/**
 * App Store Connect MCP Server
 * Fornece acesso ao App Store Connect API para builds, reviews, ratings e status de release
 * Requer App Store Connect API Key (issuer ID, key ID, private key)
 */

import { Platform } from 'react-native';

import { logger } from '../../utils/logger';
import { supabase } from '../../services/supabase';
import { base64Decode } from '../../utils/base64';
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
  JsonValue,
} from '../types';
import { appStoreConnectConfig } from '../utils/envConfig';

// Tipos para App Store Connect
// Tipos não utilizados diretamente, mas mantidos para referência futura
// @ts-expect-error - Interface mantida para referência futura
interface _AppStoreApp {
  id: string;
  type: 'apps';
  attributes: {
    name: string;
    bundleId: string;
    sku: string;
  };
}

// @ts-expect-error - Interface mantida para referência futura
interface _AppStoreReview {
  id: string;
  type: 'appStoreReviewDetails';
  attributes: {
    contactFirstName: string;
    contactLastName: string;
    contactPhone: string;
    contactEmail: string;
    notes: string;
    demoAccountName: string;
    demoAccountPassword: string;
    demoAccountRequired: boolean;
  };
}

interface AppStoreBuild {
  id: string;
  type: 'builds';
  attributes: {
    version: string;
    uploadedDate: string;
    expirationDate: string;
    expired: boolean;
    processingState: 'PROCESSING' | 'FAILED' | 'INVALID' | 'VALID';
    usesNonExemptEncryption: boolean;
  };
  relationships?: {
    app?: {
      data: {
        id: string;
        type: 'apps';
      };
    };
  };
}

interface AppStoreRating {
  rating: number;
  count: number;
  version?: string;
}

interface AppStoreVersion {
  id: string;
  type: 'appStoreVersions';
  attributes: {
    platform: 'IOS' | 'MAC_OS';
    versionString: string;
    appStoreState:
      | 'DEVELOPER_REMOVED_FROM_SALE'
      | 'DEVELOPER_REJECTED'
      | 'IN_REVIEW'
      | 'INVALID_BINARY'
      | 'METADATA_REJECTED'
      | 'PENDING_APPLE_RELEASE'
      | 'PENDING_CONTRACT'
      | 'PENDING_DEVELOPER_RELEASE'
      | 'PREPARE_FOR_SUBMISSION'
      | 'PREORDER_READY_FOR_SALE'
      | 'PROCESSING_FOR_APP_STORE'
      | 'READY_FOR_SALE'
      | 'REJECTED'
      | 'REMOVED_FROM_SALE'
      | 'WAITING_FOR_EXPORT_COMPLIANCE'
      | 'WAITING_FOR_REVIEW'
      | 'REPLACED_WITH_NEW_VERSION';
    copyright?: string;
    releaseType?: 'MANUAL' | 'AFTER_APPROVAL' | 'SCHEDULED';
    earliestReleaseDate?: string;
  };
}

interface AppStoreReviewStatus {
  version: string;
  state: string;
  inReview: boolean;
  rejectionReason?: string;
  canPromote: boolean;
  canRelease: boolean;
}

export class AppStoreConnectMCPServer implements MCPServer {
  name = 'appstoreconnect-mcp';
  version = '1.0.0';

  private initialized = false;
  private issuerId: string | null = null;
  private keyId: string | null = null;
  private privateKey: string | null = null;
  // baseUrl removido - agora usa Edge Function

  async initialize(): Promise<void> {
    try {
      // Obter credenciais do App Store Connect via envConfig (mobile-safe)
      this.issuerId = appStoreConnectConfig.issuerId;
      this.keyId = appStoreConnectConfig.keyId;
      this.privateKey = appStoreConnectConfig.privateKey;

      // Private key pode estar em arquivo ou env var (base64 encoded)
      if (this.privateKey && this.privateKey.includes('-----BEGIN')) {
        // Já está em formato PEM
      } else if (this.privateKey) {
        // Assumir que está em base64 - usar helper React Native compatible
        try {
          this.privateKey = base64Decode(this.privateKey);
        } catch {
          // Se falhar, usar como está
          logger.warn('[AppStoreConnectMCP] Failed to decode base64 private key, using as-is');
        }
      }

      // Se não tiver credenciais, ainda inicializa mas métodos retornarão erro
      if (!this.issuerId || !this.keyId || !this.privateKey) {
        logger.warn(
          '[AppStoreConnectMCP] Inicializado sem credenciais - métodos de API não estarão disponíveis'
        );
      }

      this.initialized = true;
      logger.info('[AppStoreConnectMCP] Initialized successfully', {
        hasCredentials: !!(this.issuerId && this.keyId && this.privateKey),
        platform: Platform.OS,
      });
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Initialization failed', error);
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
        case 'build':
          return (await this.handleBuild(request.id, action, request.params)) as MCPResponse<T>;
        case 'review':
          return (await this.handleReview(request.id, action, request.params)) as MCPResponse<T>;
        case 'rating':
          return (await this.handleRating(request.id, action, request.params)) as MCPResponse<T>;
        case 'version':
          return (await this.handleVersion(request.id, action, request.params)) as MCPResponse<T>;
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

  private async handleBuild(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'list': {
        const { appId, filter } = params as {
          appId: string;
          filter?: { version?: string; processingState?: string };
        };
        const builds = await this.listBuilds(appId, filter);
        return createMCPResponse(id, builds as unknown as JsonValue);
      }

      case 'get': {
        const { buildId } = params as { buildId: string };
        const build = await this.getBuild(buildId);
        return createMCPResponse(id, build as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown build action: ${action}`,
        });
    }
  }

  private async handleReview(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getStatus': {
        const { appId, version } = params as { appId: string; version?: string };
        const status = await this.getReviewStatus(appId, version);
        return createMCPResponse(id, status as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown review action: ${action}`,
        });
    }
  }

  private async handleRating(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'getAppStoreRatings': {
        const { appId, sinceDate } = params as {
          appId: string;
          sinceDate?: string;
        };
        const ratings = await this.getAppStoreRatings(appId, sinceDate);
        return createMCPResponse(id, ratings as unknown as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown rating action: ${action}`,
        });
    }
  }

  private async handleVersion(
    id: string,
    action: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    switch (action) {
      case 'list': {
        const { appId } = params as { appId: string };
        const versions = await this.listVersions(appId);
        return createMCPResponse(id, versions as unknown as JsonValue);
      }

      case 'get': {
        const { versionId } = params as { versionId: string };
        const version = await this.getVersion(versionId);
        return createMCPResponse(id, version as JsonValue);
      }

      default:
        return createMCPResponse(id, null, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown version action: ${action}`,
        });
    }
  }

  /**
   * Gera JWT token para autenticação App Store Connect API
   * Nota: JWT é gerado na Edge Function (appstore-proxy) para manter private key segura
   * Este método não é mais usado diretamente - Edge Function faz a autenticação
   */
  // @ts-expect-error - Método mantido para referência futura
  private async generateJWT(): Promise<string> {
    if (!this.issuerId || !this.keyId || !this.privateKey) {
      throw new Error('App Store Connect credentials not configured');
    }

    // Nota: Em produção, usar biblioteca como 'jsonwebtoken' ou 'jose'
    // Por enquanto, retornar placeholder - implementação real requer biblioteca JWT
    logger.warn(
      '[AppStoreConnectMCP] JWT generation not implemented - requires jwt library'
    );
    throw new Error('JWT generation requires jwt library (jsonwebtoken or jose)');
  }

  /**
   * Faz requisição autenticada para App Store Connect API
   * Usa Edge Function para manter tokens seguros no servidor
   */
  private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Chamar via Edge Function (tokens ficam no servidor)
    const { data, error } = await supabase.functions.invoke('appstore-proxy', {
      body: {
        endpoint,
        method: options?.method || 'GET',
        body: options?.body ? JSON.parse(options.body as string) : undefined,
        headers: options?.headers,
      },
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: T }).data;
    }

    return data as T;
  }

  /**
   * Lista builds de um app
   */
  private async listBuilds(
    appId: string,
    filter?: { version?: string; processingState?: string }
  ): Promise<AppStoreBuild[]> {
    try {
      let url = `/apps/${appId}/builds?limit=50`;
      if (filter?.version) {
        url += `&filter[version]=${filter.version}`;
      }
      if (filter?.processingState) {
        url += `&filter[processingState]=${filter.processingState}`;
      }

      const builds = await this.apiRequest<AppStoreBuild[]>(url);
      return builds;
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Failed to list builds', error);
      throw error;
    }
  }

  /**
   * Obtém detalhes de um build específico
   */
  private async getBuild(buildId: string): Promise<AppStoreBuild | null> {
    try {
      const build = await this.apiRequest<AppStoreBuild>(`/builds/${buildId}`);
      return build;
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Failed to get build', error);
      return null;
    }
  }

  /**
   * Obtém status de review de uma versão
   */
  private async getReviewStatus(
    appId: string,
    version?: string
  ): Promise<AppStoreReviewStatus | null> {
    try {
      // Buscar versão mais recente se não especificada
      let versionId: string;
      if (version) {
        const versions = await this.listVersions(appId);
        const found = versions.find((v) => v.attributes.versionString === version);
        if (!found) {
          return null;
        }
        versionId = found.id;
      } else {
        const versions = await this.listVersions(appId);
        if (versions.length === 0) {
          return null;
        }
        versionId = versions[0].id;
      }

      const versionData = await this.getVersion(versionId);
      if (!versionData) {
        return null;
      }

      const state = versionData.attributes.appStoreState;
      const inReview =
        state === 'IN_REVIEW' ||
        state === 'WAITING_FOR_REVIEW' ||
        state === 'PROCESSING_FOR_APP_STORE';

      return {
        version: versionData.attributes.versionString,
        state,
        inReview,
        rejectionReason:
          state === 'REJECTED' || state === 'METADATA_REJECTED'
            ? 'Rejeitado pela Apple - verificar App Store Connect para detalhes'
            : undefined,
        canPromote: state === 'READY_FOR_SALE' || state === 'PENDING_APPLE_RELEASE',
        canRelease: state === 'READY_FOR_SALE',
      };
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Failed to get review status', error);
      return null;
    }
  }

  /**
   * Obtém ratings do App Store
   * Nota: App Store Connect API não fornece ratings diretamente
   * Este método retorna estrutura esperada, mas requer integração com App Store Connect ou scraping
   */
  private async getAppStoreRatings(
    _appId: string,
    _sinceDate?: string
  ): Promise<AppStoreRating[]> {
    logger.warn(
      '[AppStoreConnectMCP] getAppStoreRatings not fully implemented - App Store Connect API does not provide ratings directly'
    );
    // Retornar estrutura vazia - implementação real requer scraping ou terceira API
    return [];
  }

  /**
   * Lista versões de um app
   */
  private async listVersions(appId: string): Promise<AppStoreVersion[]> {
    try {
      const versions = await this.apiRequest<AppStoreVersion[]>(
        `/apps/${appId}/appStoreVersions?limit=50&sort=-versionString`
      );
      return versions;
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Failed to list versions', error);
      throw error;
    }
  }

  /**
   * Obtém detalhes de uma versão específica
   */
  private async getVersion(versionId: string): Promise<AppStoreVersion | null> {
    try {
      const version = await this.apiRequest<AppStoreVersion>(`/appStoreVersions/${versionId}`);
      return version;
    } catch (error) {
      logger.error('[AppStoreConnectMCP] Failed to get version', error);
      return null;
    }
  }

  async shutdown(): Promise<void> {
    this.issuerId = null;
    this.keyId = null;
    this.privateKey = null;
    this.initialized = false;
    logger.info('[AppStoreConnectMCP] Shutdown complete');
  }
}

// Singleton instance
export const appStoreConnectMCP = new AppStoreConnectMCPServer();

