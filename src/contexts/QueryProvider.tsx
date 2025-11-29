/**
 * Query Provider - TanStack Query (React Query)
 * Provider para gerenciamento de estado assíncrono e cache
 * @see https://tanstack.com/query/latest
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry 1 vez em caso de erro de rede
      retry: 1,
      // Cache por 5 minutos padrão
      staleTime: 5 * 60 * 1000,
      // Manter dados em cache por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Refetch quando app volta ao foco
      refetchOnWindowFocus: false,
      // Não refetch automaticamente
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry 1 vez em caso de erro
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider - Wrapper do TanStack Query
 * 
 * Uso:
 * ```tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export QueryClient para uso em hooks/services
export { queryClient };

