/**
 * Sentry Configuration
 * Crash reporting e error tracking para produção
 * DSN configurado via variáveis de ambiente (app.json extra.sentryDsn)
 * 
 * ⚠️ COMPATIBILIDADE EXPO GO:
 * - Sentry requer development build (npm run build:dev)
 * - No Expo Go, o Sentry não será inicializado (fail-safe)
 */

// Tipo para o módulo Sentry (importação dinâmica por compatibilidade com Expo Go)
interface SentryModule {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: unknown, context?: Record<string, unknown>) => string;
  captureMessage: (message: string, level: string) => string;
  setUser: (user: { id: string } | null) => void;
  addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
  wrap: <T>(component: T) => T;
}

// Importação segura do Sentry (pode falhar no Expo Go)
let Sentry: SentryModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require('@sentry/react-native') as SentryModule;
} catch {
  // Sentry não disponível (Expo Go ou não instalado)
  // Isso é esperado e não é um erro
}

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { logger } from '@/utils/logger';

// Configuração do Sentry
const SENTRY_DSN =
  Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN || '';
const isDevelopment = __DEV__;

/**
 * Valida se o DSN do Sentry é válido
 */
function isValidSentryDsn(dsn: string): boolean {
  if (!dsn || dsn.trim() === '') {
    return false;
  }

  // Verificar formato básico do DSN: https://[key]@[host]/[projectId]
  const dsnPattern = /^https:\/\/[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\/[0-9]+$/;
  if (!dsnPattern.test(dsn)) {
    return false;
  }

  // Verificar se projectId não é "xxx" ou placeholder
  const projectIdMatch = dsn.match(/\/([0-9]+)$/);
  if (projectIdMatch) {
    const projectId = projectIdMatch[1];
    if (projectId === 'xxx' || projectId.length < 3) {
      return false;
    }
  }

  return true;
}

/**
 * Inicializa o Sentry
 * Chamado uma vez no App.tsx
 */
export function initSentry(): void {
  // Verificar se Sentry está disponível (não está no Expo Go)
  if (!Sentry) {
    if (isDevelopment) {
      logger.debug('[Sentry] Não disponível no Expo Go - crash reporting desabilitado');
    }
    return;
  }

  // Não inicializar em desenvolvimento sem DSN válido
  if (!SENTRY_DSN || !isValidSentryDsn(SENTRY_DSN)) {
    if (isDevelopment) {
      logger.debug('[Sentry] DSN não configurado ou inválido - crash reporting desabilitado');
    }
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,

      // Ambiente baseado em __DEV__
      environment: isDevelopment ? 'development' : 'production',

      // Versão do app
      release: `nossa-maternidade@${Constants.expoConfig?.version || '1.0.0'}`,

      // Distribuição (build number)
      dist: Platform.select({
        ios: Constants.expoConfig?.ios?.buildNumber,
        android: Constants.expoConfig?.android?.versionCode?.toString(),
        default: '1',
      }),

      // Tracing: 20% em produção, 0% em dev
      tracesSampleRate: isDevelopment ? 0 : 0.2,

      // Filtros de dados sensíveis
      beforeSend(event: Record<string, unknown>) {
        // Remover dados sensíveis
        const userObj = event?.user as { id?: string } | undefined;
        if (userObj?.id) {
          // Manter apenas ID anônimo, sem PII
          event.user = { id: userObj.id };
        }

        // Não enviar erros de desenvolvimento
        if (isDevelopment) {
          return null;
        }

        return event;
      },

      // Debug apenas em desenvolvimento
      debug: isDevelopment,
    });

    if (!isDevelopment) {
      logger.info('[Sentry] Inicializado com sucesso');
    }
  } catch (error) {
    logger.error('[Sentry] Erro ao inicializar', error);
  }
}

/**
 * Captura uma exceção e envia ao Sentry
 * @param error - Erro a ser capturado
 * @param context - Contexto adicional (tags, extras)
 */
type SentrySeverityLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

export function captureException(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>;
    extras?: Record<string, unknown>;
    level?: SentrySeverityLevel;
  }
): string | undefined {
  if (!Sentry) {
    // Sentry não disponível (Expo Go)
    return undefined;
  }

  if (!SENTRY_DSN) {
    if (isDevelopment) {
      logger.warn('[Sentry] Erro capturado (DSN não configurado)', error);
    }
    return undefined;
  }

  try {
    const eventId = Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extras,
      level: context?.level || 'error',
    });

    return eventId;
  } catch (e) {
    logger.error(
      '[Sentry] Falha ao capturar exceção',
      e instanceof Error ? e : new Error(String(e))
    );
    return undefined;
  }
}

/**
 * Captura uma mensagem (para logs importantes)
 * @param message - Mensagem a ser capturada
 * @param level - Nível de severidade
 */
export function captureMessage(
  message: string,
  level: SentrySeverityLevel = 'info'
): string | undefined {
  if (!Sentry) {
    // Sentry não disponível (Expo Go)
    return undefined;
  }

  if (!SENTRY_DSN) {
    return undefined;
  }

  try {
    return Sentry.captureMessage(message, level);
  } catch (e) {
    logger.error(
      '[Sentry] Falha ao capturar mensagem',
      e instanceof Error ? e : new Error(String(e))
    );
    return undefined;
  }
}

/**
 * Define o usuário atual para rastreamento
 * @param userId - ID do usuário (anônimo)
 */
export function setUser(userId: string | null): void {
  if (!Sentry) return; // Sentry não disponível (Expo Go)
  if (!SENTRY_DSN) return;

  try {
    if (userId) {
      Sentry.setUser({ id: userId });
    } else {
      Sentry.setUser(null);
    }
  } catch (e) {
    logger.error(
      '[Sentry] Falha ao definir usuário',
      e instanceof Error ? e : new Error(String(e))
    );
  }
}

/**
 * Adiciona um breadcrumb para contexto de debugging
 * @param breadcrumb - Dados do breadcrumb
 */
export function addBreadcrumb(breadcrumb: {
  category: string;
  message: string;
  level?: SentrySeverityLevel;
  data?: Record<string, unknown>;
}): void {
  if (!Sentry) return; // Sentry não disponível (Expo Go)
  if (!SENTRY_DSN) return;

  try {
    Sentry.addBreadcrumb({
      category: breadcrumb.category,
      message: breadcrumb.message,
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
    });
  } catch (e) {
    logger.error(
      '[Sentry] Falha ao adicionar breadcrumb',
      e instanceof Error ? e : new Error(String(e))
    );
  }
}

/**
 * Wraps React component com Sentry Error Boundary
 * Para uso manual quando necessário
 */
export const SentryErrorBoundary = Sentry?.wrap || (<T>(Component: T): T => Component);

/**
 * Exporta o módulo Sentry para uso direto quando necessário
 * Pode ser null no Expo Go
 */
export { Sentry };
