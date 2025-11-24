/**
 * Logger estruturado com contexto de sessão
 * Formato: [Session: {id}] {level} {message}
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  sessionId?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private currentSessionId: string | null = null;
  private enabled: boolean = __DEV__;

  /**
   * Define o session ID atual para incluir em todos os logs
   */
  setSessionId(sessionId: string | null): void {
    this.currentSessionId = sessionId;
  }

  /**
   * Formata mensagem de log com contexto
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const sessionPart = this.currentSessionId ? `[Session: ${this.currentSessionId}]` : '';
    const contextPart = context ? JSON.stringify(context) : '';

    return `[${timestamp}] ${sessionPart} [${level.toUpperCase()}] ${message} ${contextPart}`.trim();
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.enabled) return;
    console.debug(this.formatMessage('debug', message, context));
  }

  /**
   * Log informativo
   */
  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
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

    console.error(this.formatMessage('error', message, errorContext));

    // Em produção, aqui poderia enviar para serviço de tracking (Sentry, etc)
    if (!__DEV__ && error instanceof Error) {
      // TODO: Integrar com serviço de error tracking
    }
  }

  /**
   * Cria logger com contexto pré-definido
   */
  withContext(baseContext: LogContext): {
    debug: (message: string, context?: LogContext) => void;
    info: (message: string, context?: LogContext) => void;
    warn: (message: string, context?: LogContext) => void;
    error: (message: string, error?: Error | unknown, context?: LogContext) => void;
  } {
    return {
      debug: (message: string, context?: LogContext) => {
        this.debug(message, { ...baseContext, ...context });
      },
      info: (message: string, context?: LogContext) => {
        this.info(message, { ...baseContext, ...context });
      },
      warn: (message: string, context?: LogContext) => {
        this.warn(message, { ...baseContext, ...context });
      },
      error: (message: string, error?: Error | unknown, context?: LogContext) => {
        this.error(message, error, { ...baseContext, ...context });
      },
    };
  }
}

export const logger = new Logger();
export default logger;
