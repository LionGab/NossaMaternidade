/**
 * Tipos para a comunidade Mães Valentes
 * Fase 3 + Melhorias (Post do Dia, Temas, Grupos)
 */

// Status de moderação do post
export type PostStatus = 'pending' | 'published' | 'rejected' | 'flagged' | 'removed';

// Temas disponíveis para categorização
export type PostTheme =
  | 'sono'
  | 'culpa'
  | 'puerperio'
  | 'amamentacao'
  | 'relacionamento'
  | 'saude-mental'
  | 'desenvolvimento-bebe'
  | 'alimentacao'
  | 'trabalho-maternidade';

export interface CommunityPost {
  id: string;
  user_id: string;
  author_name?: string; // pode ser anônimo
  is_anonymous: boolean;

  content: string;
  images?: string[];
  theme?: PostTheme; // Tema do post (novo)

  // Moderação
  status: PostStatus;
  moderation_score?: number; // 0-1 (calculado por IA)
  moderation_flags?: string[];
  moderation_note?: string; // Nota da NathIA (novo)

  // Engagement
  likes_count: number;
  comments_count: number;
  helpful_votes: number;
  is_liked_by_user?: boolean; // Se o usuário atual curtiu (novo)

  // Timestamps
  created_at: string;
  updated_at?: string;

  // Dados do autor (para facilitar exibição)
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };

  // URL da imagem (compatibilidade com CommunityScreen)
  image_url?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name?: string;
  is_anonymous: boolean;
  content: string;
  likes_count: number;
  created_at: string;
}

// Post em destaque (curado pela NathIA)
export interface FeaturedPost extends CommunityPost {
  curator_note?: string; // Por que foi destacado
  featured_at: string; // Quando foi destacado
}

// Grupo de apoio
export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  color: string;
  members_count: number;
  is_member?: boolean;
  created_at: string;
}

// Labels dos temas (para exibição)
export const THEME_LABELS: Record<PostTheme, string> = {
  sono: 'Sono do Bebê',
  culpa: 'Culpa Materna',
  puerperio: 'Puerpério',
  amamentacao: 'Amamentação',
  relacionamento: 'Relacionamento',
  'saude-mental': 'Saúde Mental',
  'desenvolvimento-bebe': 'Desenvolvimento',
  alimentacao: 'Alimentação',
  'trabalho-maternidade': 'Trabalho & Maternidade',
};

// Labels dos status (para exibição)
export const STATUS_LABELS: Record<PostStatus, string> = {
  pending: 'Em revisão',
  published: 'Publicado',
  rejected: 'Não publicado',
  flagged: 'Sinalizado',
  removed: 'Removido',
};

// Cores dos temas (para chips)
export const THEME_COLORS: Record<PostTheme, string> = {
  sono: '#B8D4FF',
  culpa: '#FFB8D9',
  puerperio: '#D9B8FF',
  amamentacao: '#FFCBA4',
  relacionamento: '#FFB8B8',
  'saude-mental': '#C4FFD9',
  'desenvolvimento-bebe': '#FFE4B8',
  alimentacao: '#E4FFB8',
  'trabalho-maternidade': '#FFD4B8',
};
