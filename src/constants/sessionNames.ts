/**
 * Session Names & Titles
 *
 * Títulos sugeridos emocionais e criativos para sessões de chat
 * Baseado em momentos significativos da maternidade
 */

export const SUGGESTED_SESSION_NAMES = [
  // 💙 Momentos de Alegria
  'O DIA MAIS FELIZ DA MINHA VIDA 💙',
  'Quando meu coração transbordou 💖',
  'O dia que tudo mudou ✨',
  'Um amor que não cabe no peito 💕',
  'Quando descobri que estava grávida 🌟',
  'O primeiro chute que senti 👣',
  'O sorriso que me derrete 😊',
  'Primeira palavra dele(a) 🗣️',
  'Nossa primeira noite em casa 🏡',
  'Conquistas que me orgulham 🎉',

  // 🌈 Desafios e Superação
  'Dias difíceis, mas estou aqui 💪',
  'Quando pensei que não conseguiria 🌈',
  'Momentos de cansaço extremo 😴',
  'Noites sem dormir, mas vale a pena 🌙',
  'Culpa materna que carrego 💭',
  'Quando precisei de ajuda 🤝',
  'Superando meus medos 🦋',
  'Aprendendo a me perdoar 🌸',

  // 💬 Conversas Íntimas
  'Preciso desabafar agora 💙',
  'Ninguém entende o que sinto 😔',
  'Estou me sentindo sozinha 🫂',
  'Queria que alguém me ouvisse 👂',
  'Meus medos mais profundos 🌊',
  'Será que sou uma boa mãe? 🤔',
  'Momentos de dúvida 🌧️',
  'Quando me sinto perdida 🧭',

  // ✨ Reflexões e Crescimento
  'Como estou me transformando 🦋',
  'Descobrindo quem sou agora 🪞',
  'Aprendendo a me cuidar também 🌺',
  'Meus limites e forças 💪',
  'O que aprendi sobre mim 📖',
  'Prioridades que mudaram 🎯',
  'Minha jornada até aqui 🛤️',

  // 🌟 Apoio e Esperança
  'Buscando luz na escuridão 💫',
  'Recomeçando hoje 🌅',
  'Um dia de cada vez 📆',
  'Pequenas vitórias do dia 🏆',
  'Gratidão por hoje 🙏',
  'Esperança para amanhã 🌈',
  'Cuidando de mim hoje 💚',

  // 🎭 Emoções do Momento
  'Me sentindo ansiosa agora 😰',
  'Emoções à flor da pele 🎭',
  'Quando a raiva aparece 😤',
  'Tristeza sem explicação 😢',
  'Alegria inesperada 😄',
  'Paz interior que busco 🕊️',

  // 👶 Momentos com Bebê/Criança
  'Observando ele(a) dormir 😴',
  'Birra que testou minha paciência 😅',
  'Abraço que precisava 🤗',
  'Quando ele(a) me surpreendeu 🎁',
  'Risada que iluminou meu dia 😆',
  'Momento mãe e filho(a) 💝',

  // 💡 Insights e Descobertas
  'Entendi algo importante hoje 💡',
  'Mudança que preciso fazer 🔄',
  'Padrão que percebi em mim 🔍',
  'Conversa que me marcou 💬',
  'Conselho que me ajudou 📝',

  // 🌺 Autocuidado
  'Hora de cuidar de mim 🛁',
  'Precisando de uma pausa ⏸️',
  'Meu momento de paz 🧘',
  'Reconectando comigo 🌟',
  'Merecendo descanso 😌',
];

/**
 * Categorias de títulos para contextos específicos
 */
export const SESSION_CATEGORIES = {
  joy: [
    'O DIA MAIS FELIZ DA MINHA VIDA 💙',
    'Quando meu coração transbordou 💖',
    'Um amor que não cabe no peito 💕',
    'O sorriso que me derrete 😊',
    'Conquistas que me orgulham 🎉',
  ],
  challenge: [
    'Dias difíceis, mas estou aqui 💪',
    'Quando pensei que não conseguiria 🌈',
    'Momentos de cansaço extremo 😴',
    'Superando meus medos 🦋',
  ],
  vulnerability: [
    'Preciso desabafar agora 💙',
    'Ninguém entende o que sinto 😔',
    'Estou me sentindo sozinha 🫂',
    'Meus medos mais profundos 🌊',
  ],
  growth: [
    'Como estou me transformando 🦋',
    'Descobrindo quem sou agora 🪞',
    'O que aprendi sobre mim 📖',
  ],
  selfCare: [
    'Hora de cuidar de mim 🛁',
    'Precisando de uma pausa ⏸️',
    'Meu momento de paz 🧘',
    'Merecendo descanso 😌',
  ],
};

/**
 * Pega um título aleatório da lista completa
 */
export const getRandomSessionName = (): string => {
  return SUGGESTED_SESSION_NAMES[
    Math.floor(Math.random() * SUGGESTED_SESSION_NAMES.length)
  ];
};

/**
 * Pega um título baseado em contexto/emoção
 */
export const getContextualSessionName = (context?: string): string => {
  if (!context) return getRandomSessionName();

  const categoryMap: Record<string, keyof typeof SESSION_CATEGORIES> = {
    happy: 'joy',
    sad: 'vulnerability',
    tired: 'challenge',
    anxious: 'vulnerability',
    calm: 'selfCare',
    reflective: 'growth',
  };

  const category = categoryMap[context] || 'joy';
  const titles = SESSION_CATEGORIES[category];

  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Títulos para destaque da semana (featured)
 */
export const FEATURED_WEEK_TITLES = [
  'O DIA MAIS FELIZ DA MINHA VIDA 💙',
  'Quando meu coração transbordou 💖',
  'O dia que tudo mudou ✨',
  'Momentos que vou guardar para sempre 💝',
  'Uma semana de conquistas 🎉',
  'Superações desta semana 🌈',
  'Minha evolução até aqui 🦋',
];
