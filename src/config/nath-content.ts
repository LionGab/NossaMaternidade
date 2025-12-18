/**
 * Configuração de Conteúdo da Nathalia Valente
 *
 * URLs e IDs de posts/reels do Instagram para uso no app.
 * Atualize as URLs das imagens quando tiver acesso às URLs diretas do Instagram.
 */

// ============================================
// HERO IMAGES (Home Screen)
// ============================================

/**
 * 🥇 MELHOR FOTO ABSOLUTA (HOME / PRIMEIRA DOBRA)
 * "2 meses do nosso mini homenzinho"
 * Instagram: https://www.instagram.com/p/DQzcsyvDmTV/
 *
 * Por quê:
 * - Maternidade explícita em 1 segundo
 * - Zero ruído (não é sensual, não é polêmica)
 * - Funciona para qualquer público
 * - Excelente para retenção nos primeiros 10–15s
 */
export const HERO_IMAGE_PRIMARY = "https://www.instagram.com/p/DQzcsyvDmTV/";
// TODO: Substituir pela URL direta da imagem quando disponível
// Exemplo: "https://i.imgur.com/XXXXX.jpg"

/**
 * 🥈 MELHOR ALTERNATIVA DE HOME
 * "meu príncipe cabeludo e gordinho"
 * Instagram: https://www.instagram.com/p/DOZYvneksfs/
 *
 * Uso: Hero alternativo (A/B) ou destaque secundário no "Mundo da Nath"
 */
export const HERO_IMAGE_ALTERNATIVE = "https://www.instagram.com/p/DOZYvneksfs/";
// TODO: Substituir pela URL direta da imagem quando disponível

// ============================================
// CONTEÚDO DE PARTO (Mundo da Nath)
// ============================================

/**
 * 🥇 MELHOR CONTEÚDO DE PARTO (ÂNCORA EMOCIONAL)
 * "Meu relato de parto 🩵"
 * Instagram Reel: https://www.instagram.com/reel/DOhD-3nEt79/
 * Arquivo local: mundo-parto-relato.mp4
 *
 * Por quê:
 * - Conteúdo real, vulnerável, raro
 * - Cria vínculo profundo (confiança)
 * - Diferencial competitivo do app
 *
 * Uso: Conteúdo âncora do "Mundo da Nath"
 */
export const PARTO_REEL = {
  id: "DOhD-3nEt79",
  url: "https://www.instagram.com/reel/DOhD-3nEt79/",
  thumbnailUrl: "https://i.imgur.com/7GX41Ft.jpg", // Thumbnail atual - atualizar quando tiver a URL real
  localVideoPath: "mundo-parto-relato.mp4", // Se o vídeo estiver em assets/
  title: "Meu relato de parto 🩵",
  description: "O momento mais especial da minha vida. Parto natural, muita emoção e amor.",
};

// ============================================
// CONTEÚDO DE PROPÓSITO (Mães Valente)
// ============================================

/**
 * 🥇 MELHOR CONTEÚDO DE PROPÓSITO (MÃES VALENTE)
 * "Nathalia Valente se emociona ao falar da alimentação das crianças"
 * Instagram Reel: https://www.instagram.com/reel/DSGFrJECX0X/
 * Arquivo local: mundo-nath-africa.mp4
 *
 * Por quê:
 * - Emoção verbal > imagem
 * - Nenhum conflito moral
 * - Fortalece missão sem atacar marca
 *
 * Uso: Vídeo principal da seção Mães Valente
 */
export const MAES_VALENTE_REEL = {
  id: "DSGFrJECX0X",
  url: "https://www.instagram.com/reel/DSGFrJECX0X/",
  thumbnailUrl: "https://i.imgur.com/I86r5G5.jpg", // Thumbnail atual - atualizar quando tiver a URL real
  localVideoPath: "mundo-nath-africa.mp4", // Se o vídeo estiver em assets/
  title: "Nathalia Valente se emociona ao falar da alimentação das crianças",
  description: "Emoção e propósito em cada palavra.",
};

// ============================================
// CONTEÚDO DE GESTAÇÃO
// ============================================

/**
 * Conteúdo de gestação
 * Instagram: https://www.instagram.com/p/DN6p40GjgmB/
 */
export const GESTACAO_POST = {
  id: "DN6p40GjgmB",
  url: "https://www.instagram.com/p/DN6p40GjgmB/",
  thumbnailUrl: "https://i.imgur.com/37dbPJE.jpg", // Ensaio gestante
  title: "Meu ensaio de gestante",
  description:
    "Foi pensado em cada detalhe 🤰✨ Esse momento ficou eternizado nas fotos mais lindas!",
};

// ============================================
// DECISÃO FINAL (5 conteúdos essenciais)
// ============================================

/**
 * Se você tivesse que lançar o app com só 5 conteúdos, seriam:
 *
 * 🏠 HOME: DQzcsyvDmTV (2 meses do nosso mini homenzinho)
 * 🤱 PARTO: DOhD-3nEt79 (Meu relato de parto)
 * 🌍 MÃES VALENTE: DSGFrJECX0X (Nathalia se emociona)
 * 🌱 GESTAÇÃO: DN6p40GjgmB (Ensaio gestante)
 * 🧠 TRANSFORMAÇÃO (texto): Terra + Podcast (quotes)
 */
export const ESSENTIAL_CONTENT = {
  home: HERO_IMAGE_PRIMARY,
  parto: PARTO_REEL,
  maesValente: MAES_VALENTE_REEL,
  gestacao: GESTACAO_POST,
  // Transformação (texto) - quotes de matérias
  transformacao: {
    terra: "https://www.terra.com.br/...", // TODO: Adicionar URL quando disponível
    podcast: "https://...", // TODO: Adicionar URL quando disponível
  },
} as const;
