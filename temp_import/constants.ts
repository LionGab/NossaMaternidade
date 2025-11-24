
import { Post, Season } from './types';

export const APP_NAME = "Nossa Maternidade";

export const INITIAL_CHAT_GREETING = "Oi! Eu sou a MãesValente. Obrigada por confiar em mim. Como você está se sentindo agora?";

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Como lidar com a culpa materna hoje?',
    type: 'Vídeo',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    isNew: true
  },
  {
    id: '2',
    title: 'Meu relato de parto real e sem filtros',
    type: 'Texto',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2',
    isNew: false
  },
  {
    id: '3',
    title: '3 dicas para dormir melhor na gravidez',
    type: 'Reels',
    thumbnailUrl: 'https://picsum.photos/400/300?random=3',
    isNew: false
  },
  {
    id: '4',
    title: 'Amamentação: O que ninguém te conta',
    type: 'Áudio',
    thumbnailUrl: 'https://picsum.photos/400/300?random=4',
    isNew: true
  }
];

export const MOCK_SEASON: Season = {
  id: '1',
  title: 'Bastidores com o Thales',
  subtitle: 'A realidade do puerpério e do casal',
  coverUrl: 'https://i.imgur.com/GDYdiuy.jpg', // Placeholder using Nath's pic
  progress: 5,
  totalEpisodes: 7,
  episodes: [
    { id: '1', title: 'Primeira noite sem dormir', duration: '10 min', isCompleted: true, isLocked: false },
    { id: '2', title: 'Quando a culpa bate', duration: '12 min', isCompleted: true, isLocked: false },
    { id: '3', title: 'A relação mudou?', duration: '15 min', isCompleted: true, isLocked: false },
    { id: '4', title: 'Rede de apoio', duration: '08 min', isCompleted: true, isLocked: false },
    { id: '5', title: 'Voltando ao trabalho', duration: '11 min', isCompleted: true, isLocked: false },
    { id: '6', title: 'O corpo pós-parto', duration: '14 min', isCompleted: false, isLocked: false },
    { id: '7', title: 'Ritual de encerramento', duration: '20 min', isCompleted: false, isLocked: true },
  ]
};

export const ANGEL_OF_THE_DAY = {
  name: "Maria S.",
  avatar: "https://i.pravatar.cc/150?u=maria",
  message: "Essa mãe hoje tá aqui pra abraçar quem precisa."
};
