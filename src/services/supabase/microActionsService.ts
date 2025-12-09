/**
 * Service para Micro-ações de Descanso
 * Queries e operações no Supabase
 */

import { supabase, isSupabaseReady } from './supabase';
import { logger } from '@/utils/logger';
import type {
  MicroAction,
  LifeStage,
  MicroActionId,
  MicroActionsResponse,
} from '@/types/microActions';

// =============================================================================
// CONSTANTES
// =============================================================================

const TABLE_NAME = 'micro_actions_catalog';

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Busca todas as micro-ações do catálogo
 */
async function getAllMicroActions(): Promise<MicroActionsResponse> {
  if (!isSupabaseReady()) {
    logger.warn('[MicroActions] Supabase não configurado');
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      logger.error('[MicroActions] Erro ao buscar micro-ações', error);
      return { data: null, error };
    }

    return { data: data as MicroAction[], error: null };
  } catch (error) {
    logger.error('[MicroActions] Exceção ao buscar micro-ações', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Busca micro-ações filtradas por fase da vida
 * Usa operador @> para verificar se stages contém a fase
 *
 * @param stage - Fase da vida (pregnant, new-mother, experienced-mother)
 */
async function getMicroActionsForStage(
  stage: LifeStage
): Promise<MicroActionsResponse> {
  if (!isSupabaseReady()) {
    logger.warn('[MicroActions] Supabase não configurado');
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .contains('stages', [stage])
      .order('priority', { ascending: true });

    if (error) {
      logger.error('[MicroActions] Erro ao buscar micro-ações por fase', error);
      return { data: null, error };
    }

    return { data: data as MicroAction[], error: null };
  } catch (error) {
    logger.error('[MicroActions] Exceção ao buscar micro-ações por fase', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Busca uma micro-ação específica por ID
 *
 * @param id - Slug da micro-ação (ex: rest_close_eyes_30s)
 */
async function getMicroActionById(
  id: MicroActionId
): Promise<{ data: MicroAction | null; error: Error | null }> {
  if (!isSupabaseReady()) {
    logger.warn('[MicroActions] Supabase não configurado');
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('[MicroActions] Erro ao buscar micro-ação por ID', error);
      return { data: null, error };
    }

    return { data: data as MicroAction, error: null };
  } catch (error) {
    logger.error('[MicroActions] Exceção ao buscar micro-ação por ID', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Busca micro-ações que podem ser feitas com bebê
 *
 * @param stage - Fase da vida (opcional, filtra por fase também)
 */
async function getMicroActionsWithBaby(
  stage?: LifeStage
): Promise<MicroActionsResponse> {
  if (!isSupabaseReady()) {
    logger.warn('[MicroActions] Supabase não configurado');
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('can_do_with_baby', true)
      .order('priority', { ascending: true });

    if (stage) {
      query = query.contains('stages', [stage]);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[MicroActions] Erro ao buscar micro-ações com bebê', error);
      return { data: null, error };
    }

    return { data: data as MicroAction[], error: null };
  } catch (error) {
    logger.error('[MicroActions] Exceção ao buscar micro-ações com bebê', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Busca micro-ações por categoria
 *
 * @param category - Categoria (rest, breathe, mindfulness, movement)
 * @param stage - Fase da vida (opcional)
 */
async function getMicroActionsByCategory(
  category: string,
  stage?: LifeStage
): Promise<MicroActionsResponse> {
  if (!isSupabaseReady()) {
    logger.warn('[MicroActions] Supabase não configurado');
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('category', category)
      .order('priority', { ascending: true });

    if (stage) {
      query = query.contains('stages', [stage]);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[MicroActions] Erro ao buscar micro-ações por categoria', error);
      return { data: null, error };
    }

    return { data: data as MicroAction[], error: null };
  } catch (error) {
    logger.error('[MicroActions] Exceção ao buscar micro-ações por categoria', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Conta total de micro-ações no catálogo
 */
async function countMicroActions(): Promise<{ count: number; error: Error | null }> {
  if (!isSupabaseReady()) {
    return { count: 0, error: new Error('Supabase não configurado') };
  }

  try {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    return { count: 0, error: error as Error };
  }
}

// =============================================================================
// EXPORT
// =============================================================================

export const microActionsService = {
  /** Busca todas as micro-ações */
  getAll: getAllMicroActions,

  /** Busca micro-ações filtradas por fase */
  getForStage: getMicroActionsForStage,

  /** Busca micro-ação por ID */
  getById: getMicroActionById,

  /** Busca micro-ações que podem ser feitas com bebê */
  getWithBaby: getMicroActionsWithBaby,

  /** Busca micro-ações por categoria */
  getByCategory: getMicroActionsByCategory,

  /** Conta total de micro-ações */
  count: countMicroActions,
};

export default microActionsService;
