/**
 * Tipos para Mundo da Nath - Conteúdo Exclusivo
 * Apenas a Nathália Valente posta, mães consomem
 */

export type NathContentType = 'video' | 'audio' | 'article' | 'ritual';

export type NathContentStatus = 'draft' | 'scheduled' | 'published';

export interface NathContentItem {
  id: string;
  type: NathContentType;
  title: string;
  description: string;
  durationMinutes?: number;
  isExclusive: boolean; // para futuro paywall
  status: NathContentStatus;
  isFeatured?: boolean; // se é o destaque atual
  thumbnailUrl?: string;
  mediaUrl?: string; // link de vídeo/áudio (mock por enquanto)
  tags?: string[];
  createdAt: string;
  scheduledFor?: string | null;
  likesCount: number;
  viewsCount: number;
}

// TODO: Conectar esses tipos ao backend/Supabase futuramente
// TODO: Criar migration para tabela nath_content_items
// TODO: Adicionar RLS policies (apenas Nath pode criar/editar)
