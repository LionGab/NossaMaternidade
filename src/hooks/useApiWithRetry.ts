/**
 * Hook para APIs com retry automático
 * Wrapper para funções de API com tratamento de erro e retry
 */

import { useState, useCallback } from "react";
import { retryNetworkRequest } from "../utils/retry";
import { logger } from "../utils/logger";
import { useToast } from "./useToast";

export interface UseApiWithRetryOptions {
  showErrorToast?: boolean;
  errorMessage?: string;
  maxRetries?: number;
}

export function useApiWithRetry<T extends unknown[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options: UseApiWithRetryOptions = {}
) {
  const { showErrorToast = true, errorMessage = "Erro ao carregar dados", maxRetries = 3 } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useToast();

  const execute = useCallback(
    async (...args: T): Promise<R | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await retryNetworkRequest(
          () => apiFunction(...args),
          { maxAttempts: maxRetries }
        );
        setLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        
        logger.error(`API call failed: ${errorMessage}`, "API", error);
        
        if (showErrorToast) {
          showError(errorMessage);
        }
        
        return null;
      }
    },
    [apiFunction, errorMessage, maxRetries, showErrorToast, showError]
  );

  return {
    execute,
    loading,
    error,
  };
}
