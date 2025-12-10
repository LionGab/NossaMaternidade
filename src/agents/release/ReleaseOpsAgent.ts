/**
 * Release Operations Agent
 * Agente especializado em operações de release e saúde de app em produção
 * Integra Sentry, App Store Connect e Google Play Console para monitoramento
 */

import { MCPResponse } from '../../mcp/types';
import { logger } from '../../utils/logger';
import { orchestrator } from '../core/AgentOrchestrator';
import { BaseAgent, AgentConfig, AgentProcessOptions } from '../core/BaseAgent';

export interface ReleaseReadinessReport {
  release: string;
  timestamp: number;
  isReady: boolean;
  crashFreeRate: number | null;
  crashRateThreshold: number;
  criticalCrashes: number;
  appStoreStatus?: {
    platform: 'ios';
    version: string;
    state: string;
    inReview: boolean;
    canPromote: boolean;
  };
  playStoreStatus?: {
    platform: 'android';
    track: string;
    versionCode: string;
    versionName: string;
    status: string;
    rolloutPercentage: number;
    canPromote: boolean;
    issues: Array<{ type: string; severity: string; message: string }>;
  };
  recommendations: string[];
  summary: string;
}

export interface StoreStatusSummary {
  ios?: {
    version: string;
    state: string;
    inReview: boolean;
    canPromote: boolean;
    rejectionReason?: string;
  };
  android?: {
    track: string;
    versionCode: string;
    versionName: string;
    status: string;
    rolloutPercentage: number;
    canPromote: boolean;
    issues: Array<{ type: string; severity: string; message: string }>;
  };
  timestamp: number;
}

export interface CriticalCrash {
  issueId: string;
  title: string;
  count: number;
  userCount: number;
  crashFreeRate: number;
  platform?: string;
  deviceModel?: string;
}

export interface ReleaseOpsInput {
  release?: string;
  sinceDate?: string;
  appId?: string;
  packageName?: string;
}

export class ReleaseOpsAgent extends BaseAgent<ReleaseOpsInput, ReleaseReadinessReport, AgentProcessOptions> {
  constructor() {
    const config: AgentConfig = {
      name: 'release-ops-agent',
      version: '1.0.0',
      description: 'Agente especializado em operações de release e saúde de app em produção',
      capabilities: [
        'release-readiness',
        'crash-monitoring',
        'store-status',
        'release-health',
        'critical-crashes',
      ],
    };
    super(config);
  }

  /**
   * Processa análise de readiness de release
   */
  async process(
    input: ReleaseOpsInput = {},
    _options?: AgentProcessOptions
  ): Promise<ReleaseReadinessReport> {
    if (!this.initialized) {
      await this.initialize();
    }

    logger.info('[ReleaseOpsAgent] Analisando readiness de release', { input });

    try {
      const release = input.release || 'current';
      const crashRateThreshold = 1.5; // 1.5% máximo

      // Buscar dados em paralelo
      const [crashHealth, crashes, appStoreStatus, playStoreStatus] = await Promise.allSettled([
        this.getCrashHealth(release, crashRateThreshold),
        this.listCriticalCrashes(release),
        input.appId ? this.getAppStoreStatus(input.appId, release) : Promise.resolve(null),
        input.packageName ? this.getPlayStoreStatus(input.packageName) : Promise.resolve(null),
      ]);

      const healthData = crashHealth.status === 'fulfilled' ? crashHealth.value : null;
      const crashesData = crashes.status === 'fulfilled' ? crashes.value : [];
      const iosStatus = appStoreStatus.status === 'fulfilled' ? appStoreStatus.value : null;
      const androidStatus = playStoreStatus.status === 'fulfilled' ? playStoreStatus.value : null;

      // Determinar se está pronto
      const isReady =
        healthData?.isHealthy === true &&
        crashesData.length === 0 &&
        (iosStatus?.canPromote !== false || !iosStatus) &&
        (androidStatus?.canPromote !== false || !androidStatus);

      // Gerar recomendações
      const recommendations: string[] = [];

      if (!healthData?.isHealthy) {
        recommendations.push(
          `⚠️ Crash rate acima do threshold (${healthData?.crashFreeRate ?? 'N/A'}% < ${100 - crashRateThreshold}%)`
        );
      }

      if (crashesData.length > 0) {
        recommendations.push(`🐛 ${crashesData.length} crash(es) crítico(s) encontrado(s)`);
      }

      if (iosStatus && !iosStatus.canPromote) {
        recommendations.push(`📱 iOS: ${iosStatus.state} - ${iosStatus.rejectionReason || 'Não pode promover'}`);
      }

      if (androidStatus && !androidStatus.canPromote) {
        recommendations.push(
          `🤖 Android: ${androidStatus.status} - ${androidStatus.issues.length} issue(s) encontrado(s)`
        );
      }

      if (isReady && recommendations.length === 0) {
        recommendations.push('✅ Release saudável e pronto para promover');
      }

      const report: ReleaseReadinessReport = {
        release,
        timestamp: Date.now(),
        isReady,
        crashFreeRate: healthData?.crashFreeRate ?? null,
        crashRateThreshold,
        criticalCrashes: crashesData.length,
        appStoreStatus: iosStatus
          ? {
              platform: 'ios',
              version: iosStatus.version,
              state: iosStatus.state,
              inReview: iosStatus.inReview,
              canPromote: iosStatus.canPromote,
            }
          : undefined,
        playStoreStatus: androidStatus
          ? {
              platform: 'android',
              track: androidStatus.track,
              versionCode: androidStatus.versionCode,
              versionName: androidStatus.versionName,
              status: androidStatus.status,
              rolloutPercentage: androidStatus.rolloutPercentage,
              canPromote: androidStatus.canPromote,
              issues: androidStatus.issues,
            }
          : undefined,
        recommendations,
        summary: this.generateSummary(isReady, healthData, crashesData, iosStatus, androidStatus),
      };

      logger.info('[ReleaseOpsAgent] Análise concluída', {
        release,
        isReady,
        crashFreeRate: healthData?.crashFreeRate ?? null,
        criticalCrashes: crashesData.length,
      });

      return report;
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao processar análise', error);
      throw error;
    }
  }

  /**
   * Obtém resumo de status das stores
   */
  async getStoreStatusSummary(input?: {
    appId?: string;
    packageName?: string;
  }): Promise<StoreStatusSummary> {
    if (!this.initialized) {
      await this.initialize();
    }

    logger.info('[ReleaseOpsAgent] Obtendo resumo de status das stores', { input });

    try {
      const [iosStatus, androidStatus] = await Promise.allSettled([
        input?.appId ? this.getAppStoreStatus(input.appId) : Promise.resolve(null),
        input?.packageName ? this.getPlayStoreStatus(input.packageName) : Promise.resolve(null),
      ]);

      const ios = iosStatus.status === 'fulfilled' ? iosStatus.value : null;
      const android = androidStatus.status === 'fulfilled' ? androidStatus.value : null;

      return {
        ios: ios
          ? {
              version: ios.version,
              state: ios.state,
              inReview: ios.inReview,
              canPromote: ios.canPromote,
              rejectionReason: ios.rejectionReason,
            }
          : undefined,
        android: android
          ? {
              track: android.track,
              versionCode: android.versionCode,
              versionName: android.versionName,
              status: android.status,
              rolloutPercentage: android.rolloutPercentage,
              canPromote: android.canPromote,
              issues: android.issues,
            }
          : undefined,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao obter resumo de stores', error);
      throw error;
    }
  }

  /**
   * Lista crashes críticos desde uma data
   */
  async listCriticalCrashesSince(
    sinceDate: string,
    release?: string
  ): Promise<CriticalCrash[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    logger.info('[ReleaseOpsAgent] Listando crashes críticos', { sinceDate, release });

    try {
      const crashes = await this.listCriticalCrashes(release);
      // Filtrar por data (se necessário, baseado em lastSeen)
      // Por enquanto, retornar todos os crashes críticos
      return crashes;
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao listar crashes', error);
      return [];
    }
  }

  /**
   * Implementação MCP call via orchestrator
   * Cast method to proper type based on the server
   */
  protected async callMCP(
    server: string,
    method: string,
    params: Record<string, unknown>
  ): Promise<MCPResponse> {
    try {
      // Cast method to proper type based on the server
      const typedParams = params as Record<string, import('../../mcp/types').JsonValue>;

      if (server === 'sentry') {
        return await orchestrator.callMCP(
          server,
          method as keyof import('../../mcp/types').SentryMCPMethods,
          typedParams
        );
      } else if (server === 'appstoreconnect') {
        return await orchestrator.callMCP(
          server,
          method as keyof import('../../mcp/types').AppStoreConnectMCPMethods,
          typedParams
        );
      } else if (server === 'googleplayconsole') {
        return await orchestrator.callMCP(
          server,
          method as keyof import('../../mcp/types').GooglePlayConsoleMCPMethods,
          typedParams
        );
      } else if (server === 'analytics') {
        return await orchestrator.callMCP(
          server,
          method as keyof import('../../mcp/types').AnalyticsMCPMethods,
          typedParams
        );
      }

      return await orchestrator.callMCP(
        server,
        method as keyof import('../../mcp/types').AllMCPMethods,
        typedParams
      );
    } catch (error) {
      logger.error(`[ReleaseOpsAgent] MCP call failed: ${server}.${method}`, error);
      return {
        id: `mcp-${Date.now()}`,
        success: false,
        error: {
          code: 'MCP_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        data: null,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Obtém saúde de crash de um release
   */
  private async getCrashHealth(
    release: string,
    threshold: number
  ): Promise<{ isHealthy: boolean; crashFreeRate: number | null }> {
    try {
      const response = await this.callMCP('sentry', 'health.checkCrashRate', {
        release,
        threshold,
      });

      if (!response.success || !response.data) {
        logger.warn('[ReleaseOpsAgent] Não foi possível obter crash health', response.error);
        return { isHealthy: false, crashFreeRate: null };
      }

      const data = response.data as {
        release: string;
        crashFreeRate: number | null;
        threshold: number;
        isHealthy: boolean;
        recommendation: string;
      };

      return {
        isHealthy: data.isHealthy,
        crashFreeRate: data.crashFreeRate,
      };
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao obter crash health', error);
      return { isHealthy: false, crashFreeRate: null };
    }
  }

  /**
   * Lista crashes críticos
   */
  private async listCriticalCrashes(release?: string): Promise<CriticalCrash[]> {
    try {
      const response = await this.callMCP('sentry', 'crash.listTop', {
        release,
        limit: 10,
      });

      if (!response.success || !response.data) {
        logger.warn('[ReleaseOpsAgent] Não foi possível listar crashes', response.error);
        return [];
      }

      return (response.data as unknown as CriticalCrash[]) || [];
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao listar crashes', error);
      return [];
    }
  }

  /**
   * Obtém status do App Store Connect
   */
  private async getAppStoreStatus(
    appId: string,
    version?: string
  ): Promise<{
    version: string;
    state: string;
    inReview: boolean;
    canPromote: boolean;
    rejectionReason?: string;
  } | null> {
    try {
      const response = await this.callMCP('appstoreconnect', 'review.getStatus', {
        appId,
        version,
      });

      if (!response.success || !response.data) {
        logger.warn('[ReleaseOpsAgent] Não foi possível obter status do App Store', response.error);
        return null;
      }

      const data = response.data as {
        version: string;
        state: string;
        inReview: boolean;
        canPromote: boolean;
        rejectionReason?: string;
      };

      return data;
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao obter status do App Store', error);
      return null;
    }
  }

  /**
   * Obtém status do Google Play Console
   */
  private async getPlayStoreStatus(packageName: string, track?: string): Promise<{
    track: string;
    versionCode: string;
    versionName: string;
    status: string;
    rolloutPercentage: number;
    canPromote: boolean;
    issues: Array<{ type: string; severity: string; message: string }>;
  } | null> {
    try {
      const response = await this.callMCP('googleplayconsole', 'release.getStatus', {
        packageName,
        track,
      });

      if (!response.success || !response.data) {
        logger.warn('[ReleaseOpsAgent] Não foi possível obter status do Play Store', response.error);
        return null;
      }

      const data = response.data as {
        track: string;
        versionCode: string;
        versionName: string;
        status: string;
        rolloutPercentage: number;
        canPromote: boolean;
        issues: Array<{ type: string; severity: string; message: string }>;
      };

      return data;
    } catch (error) {
      logger.error('[ReleaseOpsAgent] Erro ao obter status do Play Store', error);
      return null;
    }
  }

  /**
   * Gera resumo textual do report
   */
  private generateSummary(
    isReady: boolean,
    healthData: { isHealthy: boolean; crashFreeRate: number | null } | null,
    crashes: CriticalCrash[],
    iosStatus: {
      version: string;
      state: string;
      inReview: boolean;
      canPromote: boolean;
      rejectionReason?: string;
    } | null,
    androidStatus: {
      track: string;
      versionCode: string;
      versionName: string;
      status: string;
      rolloutPercentage: number;
      canPromote: boolean;
      issues: Array<{ type: string; severity: string; message: string }>;
    } | null
  ): string {
    const parts: string[] = [];

    if (isReady) {
      parts.push('✅ Release saudável e pronto para promover');
    } else {
      parts.push('⚠️ Release não está pronto para promover');
    }

    if (healthData) {
      if (healthData.isHealthy) {
        parts.push(`Crash-free rate: ${healthData.crashFreeRate?.toFixed(2) ?? 'N/A'}%`);
      } else {
        parts.push(`⚠️ Crash rate acima do threshold`);
      }
    }

    if (crashes.length > 0) {
      parts.push(`${crashes.length} crash(es) crítico(s)`);
    }

    if (iosStatus) {
      parts.push(`iOS: ${iosStatus.state}${iosStatus.inReview ? ' (em review)' : ''}`);
    }

    if (androidStatus) {
      parts.push(
        `Android: ${androidStatus.track} track, ${androidStatus.status} (${androidStatus.rolloutPercentage}% rollout)`
      );
    }

    return parts.join('. ');
  }
}

// Singleton instance
export const releaseOpsAgent = new ReleaseOpsAgent();

