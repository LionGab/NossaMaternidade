/**
 * Retry utility para requisições
 * Implementa retry automático com backoff exponencial
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryable?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryable: () => true,
};

/**
 * Executa uma função com retry automático
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Verificar se o erro é retryable
      if (!opts.retryable(error)) {
        throw error;
      }

      // Se não é a última tentativa, aguardar antes de retry
      if (attempt < opts.maxAttempts) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
          opts.maxDelay
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Helper para requisições de rede
 */
export async function retryNetworkRequest<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return withRetry(fn, {
    ...options,
    retryable: (error) => {
      // Retry apenas em erros de rede/timeout
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return (
          message.includes("network") ||
          message.includes("timeout") ||
          message.includes("fetch") ||
          message.includes("connection")
        );
      }
      return false;
    },
  });
}
