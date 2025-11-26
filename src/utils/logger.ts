/**
 * Logger estruturado com contexto de sessão
 * Formato: [Session: {id}] {level} {message}
 *
 * Em produção, apenas warn e error são exibidos.
 * Em desenvolvimento, todos os níveis são exibidos.
 *
 * Integração com Sentry para monitoramento de erros em produção.
 */

import * as Sentry from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  sessionId?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private currentSessionId: string | null = null;
  private isDev: boolean = __DEV__;

  /**
   * Define o session ID atual para incluir em todos os logs
   */
  setSessionId(sessionId: string | null): void {
    this.currentSessionId = sessionId;
  }

  /**
   * Retorna emoji para cada nível de log
   */
  private getEmojiForLevel(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '🔍';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  }

  /**
   * Formata mensagem de log com contexto
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const emoji = this.getEmojiForLevel(level);
    const timestamp = new Date().toISOString();
    const sessionPart = this.currentSessionId ? `[Session: ${this.currentSessionId}]` : '';
    const contextPart = context ? JSON.stringify(context) : '';

    return `${emoji} [${timestamp}] ${sessionPart} [${level.toUpperCase()}] ${message} ${contextPart}`.trim();
  }

  /**
   * Remove dados sensíveis do contexto antes de enviar para Sentry
   */
  private sanitizeContext(context?: LogContext): LogContext {
    if (!context) return {};

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'credential'];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDev) return;
    // eslint-disable-next-line no-console
    console.debug(this.formatMessage('debug', message, context));
  }

  /**
   * Log informativo (apenas em desenvolvimento)
   */
  info(message: string, context?: LogContext): void {
    if (!this.isDev) return;
    // eslint-disable-next-line no-console
    console.info(this.formatMessage('info', message, context));

    // Em produção, adiciona breadcrumb no Sentry
    if (!this.isDev) {
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: this.sanitizeContext(context),
      });
    }
  }

  /**
   * Log de aviso
   */
  warn(message: string, error?: Error | unknown, context?: LogContext): void {
    const warnContext: LogContext = {
      ...context,
      ...(error ? {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
      } : {}),
    };
    // eslint-disable-next-line no-console
    console.warn(this.formatMessage('warn', message, warnContext));

    // Enviar warning para Sentry
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: this.sanitizeContext(warnContext),
    });
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };

    // eslint-disable-next-line no-console
    console.error(this.formatMessage('error', message, errorContext));

    // Enviar erro para Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        extra: {
          message,
          ...this.sanitizeContext(context),
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: {
          error,
          ...this.sanitizeContext(context),
        },
      });
    }
  }

  /**
   * Log de exceção não tratada (alias para error)
   */
  exception(error: Error, context?: LogContext): void {
    this.error('Unhandled exception', error, context);
  }

  /**
   * Cria logger com contexto pré-definido
   */
  withContext(baseContext: LogContext): {
    debug: (message: string, context?: LogContext) => void;
    info: (message: string, context?: LogContext) => void;
    warn: (message: string, error?: Error | unknown, context?: LogContext) => void;
    error: (message: string, error?: Error | unknown, context?: LogContext) => void;
  } {
    return {
      debug: (message: string, context?: LogContext) => {
        this.debug(message, { ...baseContext, ...context });
      },
      info: (message: string, context?: LogContext) => {
        this.info(message, { ...baseContext, ...context });
      },
      warn: (message: string, error?: Error | unknown, context?: LogContext) => {
        this.warn(message, error, { ...baseContext, ...context });
      },
      error: (message: string, error?: Error | unknown, context?: LogContext) => {
        this.error(message, error, { ...baseContext, ...context });
      },
    };
  }
}

export const logger = new Logger();
export default logger;
