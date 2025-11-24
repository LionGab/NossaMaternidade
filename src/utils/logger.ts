/**
 * Logger Estruturado
 * Sistema de logging com contexto de sessão
 */

import { sessionManager } from '../services/sessionManager';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  sessionId?: string;
  userId?: string;
  analyticsSessionId?: string;
  chatSessionId?: string;
  [key: string]: any;
}

class Logger {
  private getContext(): LogContext {
    const state = sessionManager.getState();
    return {
      sessionId: state.auth.session?.access_token?.substring(0, 8) || 'no-session',
      userId: state.auth.user?.id || undefined,
      analyticsSessionId: state.analytics.sessionId || undefined,
      chatSessionId: state.chat.currentSession?.id || undefined,
    };
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const baseContext = this.getContext();
    const fullContext = { ...baseContext, ...context };
    const contextStr = Object.entries(fullContext)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join(' ');

    return `[${level.toUpperCase()}] [Session: ${fullContext.sessionId || 'none'}] ${message} ${contextStr ? `(${contextStr})` : ''}`;
  }

  debug(message: string, context?: LogContext): void {
    if (__DEV__) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(
      this.formatMessage('error', `${message}: ${errorMessage}`, context),
      errorStack ? `\n${errorStack}` : ''
    );
  }
}

export const logger = new Logger();
export default logger;

