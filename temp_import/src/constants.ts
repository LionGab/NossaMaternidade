
import { Post, Season } from './types';

export const APP_NAME = "Nossa Maternidade";

export const INITIAL_CHAT_GREETING = "Oi! Eu sou a MãesValente. Obrigada por confiar em mim. Como você está se sentindo agora?";

export const MOCK_POSTS: Post[] = [
  {
    id: 'audio-1',
    title: 'Áudio de Socorro: Crise de Choro',
    description: 'Para ouvir trancada no banheiro. Respire comigo por 3 minutos e acalme seu coração.',
    type: 'Áudio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515814472071-4d632ff9673d?w=600&auto=format&fit=crop&q=60', 
    duration: '03:15',
    isNew: true
  },
  {
    id: 'video-reality',
    title: 'O que ninguém te conta sobre o corpo',
    description: 'Minha barriga real, flacidez e como estou aprendendo a amar minhas novas marcas.',
    type: 'Vídeo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551024739-78e9d60c45ca?w=600&auto=format&fit=crop&q=60', // Woman looking at mirror/body positive
    duration: '08:42',
    isNew: true
  },
  {
    id: 'audio-2',
    title: 'Meditação para dormir (mesmo picado)',
    description: 'Desligue o cérebro em 5 minutos. Técnica para voltar a dormir rápido após a mamada.',
    type: 'Áudio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541944470220-8a4d821d431d?w=600&auto=format&fit=crop&q=60', // Sleepy woman/calm
    duration: '05:00',
    isNew: false
  },
  {
    id: 'reels-casal',
    title: 'Briguei com o marido: A realidade',
    description: 'A privação de sono quase acabou com a gente hoje. Como resolvemos.',
    type: 'Reels',
    thumbnailUrl: 'https://images.unsplash.com/photo-1623752398695-a64725334d3b?w=600&auto=format&fit=crop&q=60', // Woman looking tired/thoughtful
    isNew: false
  },
  {
    id: 'audio-3',
    title: 'Afirmações para dias difíceis',
    description: 'Repita comigo: "Eu sou a melhor mãe que meu filho poderia ter".',
    type: 'Áudio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499540633125-484965b60031?w=600&auto=format&fit=crop&q=60', // Peaceful nature/woman
    duration: '04:20',
    isNew: true
  },
  {
    id: 'video-enxoval',
    title: 'Coisas que joguei dinheiro fora',
    description: 'Lista polêmica: Os itens do enxoval que só serviram para ocupar espaço.',
    type: 'Vídeo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=60', // Baby clothes/items
    duration: '05:20',
    isNew: false
  }
];

export const MOCK_SEASON: Season = {
  id: '1',
  title: 'Bastidores: A Vida Sem Filtro',
  subtitle: 'O que não foi postado no Instagram',
  coverUrl: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&auto=format&fit=crop&q=60',
  progress: 20,
  totalEpisodes: 5,
  episodes: [
    { id: '1', title: 'O dia que pensei em fugir', duration: '12 min', isCompleted: true, isLocked: false },
    { id: '2', title: 'Ataque de pânico na madrugada', duration: '08 min', isCompleted: false, isLocked: false },
    { id: '3', title: 'A primeira relação pós-parto', duration: '15 min', isCompleted: false, isLocked: true },
    { id: '4', title: 'Tour pela bagunça real da casa', duration: '10 min', isCompleted: false, isLocked: true },
    { id: '5', title: 'Carta para meu eu do passado', duration: '06 min', isCompleted: false, isLocked: true },
  ]
};

export const ANGEL_OF_THE_DAY = {
  name: "Camila R.",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
  message: "Obrigada por me lembrar que prato sujo pode esperar, mas meu sono não."
};
