/**
 * Hook para otimizar selectors do Zustand
 * Evita re-renders desnecessários usando shallow comparison
 */

import { useCallback } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";

/**
 * Cria um selector otimizado que evita re-renders
 * Use quando precisar de múltiplos valores do store
 */
export function useOptimizedSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): U {
  return useStore(store, selector, equalityFn);
}

/**
 * Helper para criar selectors múltiplos sem causar re-renders
 * Retorna um objeto com os valores selecionados
 */
export function useMultipleSelectors<T extends Record<string, unknown>>(
  store: StoreApi<T>,
  selectors: Array<keyof T>
): Partial<T> {
  const result: Partial<T> = {};
  
  selectors.forEach((key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[key] = useStore(store, (state) => state[key]);
  });
  
  return result;
}

/**
 * Hook para memoizar selector complexo
 */
export function useMemoizedSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
  deps: unknown[] = []
): U {
  const memoizedSelector = useCallback(selector, deps);
  return useStore(store, memoizedSelector);
}
