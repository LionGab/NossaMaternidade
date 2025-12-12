/**
 * Hook para feed do Mundo da Nath
 * Gerencia conteúdos exclusivos da Nathália Valente
 */

import { useState, useCallback, useMemo } from 'react';
import type { NathContentItem, NathContentType } from '@/types/nathContent';

// TODO: Substituir por chamada real ao backend/Supabase
const MOCK_CONTENT: NathContentItem[] = [
  // Featured content
  {
    id: 'featured-1',
    type: 'ritual',
    title: 'Ritual de 3 Minutos',
    description: 'Reconecte-se com você antes de começar o caos do dia',
    durationMinutes: 3,
    isExclusive: true,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    likesCount: 234,
    viewsCount: 1542,
  },
  // Quick rituals
  {
    id: 'ritual-1',
    type: 'ritual',
    title: 'Respiração 4-7-8',
    description: 'Acalme sua mente',
    durationMinutes: 2,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 89,
    viewsCount: 456,
  },
  {
    id: 'ritual-2',
    type: 'ritual',
    title: 'Gratidão Matinal',
    description: 'Comece bem o dia',
    durationMinutes: 3,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 123,
    viewsCount: 678,
  },
  {
    id: 'ritual-3',
    type: 'ritual',
    title: 'Body Scan',
    description: 'Relaxe o corpo',
    durationMinutes: 5,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 156,
    viewsCount: 892,
  },
  {
    id: 'ritual-4',
    type: 'ritual',
    title: 'Afirmações',
    description: 'Fortaleça sua mente',
    durationMinutes: 2,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 98,
    viewsCount: 534,
  },
  // Explore content
  {
    id: 'video-1',
    type: 'video',
    title: 'Amamentação: Mitos e Verdades',
    description: 'O que você precisa saber sobre amamentação',
    durationMinutes: 8,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 234,
    viewsCount: 2103,
  },
  {
    id: 'audio-1',
    type: 'audio',
    title: 'Meditação para Mães Cansadas',
    description: 'Um momento de paz no meio do caos',
    durationMinutes: 10,
    isExclusive: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 156,
    viewsCount: 856,
  },
  {
    id: 'article-1',
    type: 'article',
    title: 'Como lidar com a privação de sono',
    description: 'Dicas práticas para sobreviver às noites mal dormidas',
    durationMinutes: 5,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 89,
    viewsCount: 1234,
  },
  {
    id: 'video-2',
    type: 'video',
    title: 'Autocuidado em 10 Minutos',
    description: 'Práticas rápidas para se cuidar no dia a dia',
    durationMinutes: 10,
    isExclusive: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 178,
    viewsCount: 1456,
  },
  {
    id: 'audio-2',
    type: 'audio',
    title: 'Sons da Natureza para Dormir',
    description: 'Relaxamento profundo para você e seu bebê',
    durationMinutes: 20,
    isExclusive: false,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 267,
    viewsCount: 1890,
  },
];

export interface UseNathContentFeedResult {
  featured: NathContentItem | null;
  quickRituals: NathContentItem[];
  explore: NathContentItem[];
  filterType: NathContentType | 'all';
  setFilterType: (type: NathContentType | 'all') => void;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useNathContentFeed(): UseNathContentFeedResult {
  const [filterType, setFilterType] = useState<NathContentType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Substituir por chamada real ao serviço
  const refetch = useCallback(async () => {
    setIsLoading(true);
    // Simular loading
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
  }, []);

  // Featured content (apenas um item marcado como isFeatured)
  const featured = useMemo(
    () => MOCK_CONTENT.find((item) => item.isFeatured) || null,
    []
  );

  // Quick rituals (tipo ritual, duração <= 5 min)
  const quickRituals = useMemo(
    () =>
      MOCK_CONTENT.filter(
        (item) =>
          item.type === 'ritual' &&
          item.durationMinutes &&
          item.durationMinutes <= 5 &&
          !item.isFeatured
      ),
    []
  );

  // Explore content (filtrável por tipo, excluindo featured e quick rituals)
  const explore = useMemo(() => {
    const explorable = MOCK_CONTENT.filter(
      (item) =>
        !item.isFeatured &&
        !(item.type === 'ritual' && item.durationMinutes && item.durationMinutes <= 5)
    );

    if (filterType === 'all') {
      return explorable;
    }

    return explorable.filter((item) => item.type === filterType);
  }, [filterType]);

  return {
    featured,
    quickRituals,
    explore,
    filterType,
    setFilterType,
    isLoading,
    refetch,
  };
}

// TODO: Implementar funções para backend:
// - fetchNathContent(): buscar conteúdos do Supabase
// - toggleLike(contentId): curtir/descurtir
// - incrementViews(contentId): incrementar visualizações
// - saveContent(contentId): salvar para ver depois
