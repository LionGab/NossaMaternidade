export type ContentType = 'video' | 'article' | 'audio' | 'reels' | 'text';

export interface ContentAuthor {
  name: string;
  avatar: number | { uri: string } | string; // ImageSourcePropType
}

export interface ContentStats {
  likes: number;
  comments: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  thumbnail?: number | { uri: string } | string; // ImageSourcePropType
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  content?: string;
  audioUrl?: string;
  duration?: string;
  date?: string;
  views?: number;
  likes?: number;
  isPremium?: boolean;
  isOriginal?: boolean;
  isExclusive?: boolean;
  tags?: string[];
  author?: ContentAuthor;
  stats?: ContentStats;
}

export interface Post {
  id: string;
  title: string;
  type: ContentType;
  thumbnailUrl: string;
  isNew: boolean;
}
