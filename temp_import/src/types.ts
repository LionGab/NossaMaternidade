
export enum UserStage {
  TRYING = 'Tentante',
  PREGNANT = 'Gestante',
  NEW_MOM = 'Puérpera (Recém-nascido)',
  MOM = 'Mãe experiente'
}

export enum UserEmotion {
  ANXIOUS = 'Ansiosa',
  TIRED = 'Cansada',
  GUILTY = 'Culpada',
  HAPPY = 'Feliz',
  CONFUSED = 'Confusa'
}

export enum UserChallenge {
  SLEEP = 'Sono do bebê',
  BREASTFEEDING = 'Amamentação',
  ANXIETY = 'Ansiedade/Depressão',
  RELATIONSHIP = 'Relacionamento',
  WORK = 'Volta ao trabalho',
  LONELINESS = 'Solidão',
  NONE = 'Só curiosidade'
}

export enum UserSupport {
  HIGH = 'Sim, tenho ajuda',
  MEDIUM = 'Às vezes',
  LOW = 'Me sinto sozinha'
}

export enum UserNeed {
  CHAT = 'Desabafar com alguém',
  LEARN = 'Aprender cuidados',
  CALM = 'Técnicas para acalmar',
  CONNECT = 'Conectar com mães'
}

export interface UserProfile {
  name?: string;
  email?: string;
  stage?: UserStage;
  timelineInfo?: string; // "32 semanas" or "3 meses"
  currentFeeling?: UserEmotion;
  biggestChallenge?: UserChallenge;
  supportLevel?: UserSupport;
  primaryNeed?: UserNeed;
  notificationsEnabled?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  title: string;
  description?: string; // Added description for context
  type: 'Reels' | 'Vídeo' | 'Texto' | 'Áudio' | 'Foto'; // Added Foto
  thumbnailUrl: string;
  duration?: string; // Added duration for Audio/Video
  isNew?: boolean;
  url?: string;
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Season {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  progress: number;
  totalEpisodes: number;
  episodes: Episode[];
}
