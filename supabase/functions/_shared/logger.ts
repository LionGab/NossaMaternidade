/**
 * Logger compartilhado para Supabase Edge Functions (Deno).
 *
 * Motivo: padronizar logs e evitar `console.*` espalhado nas funções.
 * Internamente usa console (único ponto), mas as funções devem importar `edgeLogger`.
 */

type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ message: 'unstringifiable_log_payload' });
  }
}

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const payload = {
    level,
    message,
    context: context ?? {},
    ts: new Date().toISOString(),
  };

  const line = safeStringify(payload);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

function toErrorContext(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export const edgeLogger = {
  info(message: string, context?: LogContext): void {
    emit('info', message, context);
  },
  warn(message: string, context?: LogContext): void {
    emit('warn', message, context);
  },
  error(message: string, error?: unknown, context?: LogContext): void {
    emit('error', message, { ...(context ?? {}), error: toErrorContext(error) });
  },
};


