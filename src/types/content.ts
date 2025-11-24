export type ContentType = 'video' | 'article' | 'audio' | 'reels' | 'text';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  thumbnail?: any; // Made optional
  thumbnailUrl?: string; // Added
  imageUrl?: string;
  videoUrl?: string; // Added
  content?: string; // Added
  audioUrl?: string;
  duration?: string; // Made optional
  date?: string;
  views?: number;
  likes?: number;
  isPremium?: boolean;
  isOriginal?: boolean;
  isExclusive?: boolean;
  tags?: string[];
  author?: {
    name: string;
    avatar: any;
  };
  stats?: {
    likes: number;
    comments: number;
  };
}

export interface Post {
  id: string;
  title: string;
  type: 'Vídeo' | 'Texto' | 'Reels' | 'Áudio';
  thumbnailUrl: string;
  isNew: boolean;
}
