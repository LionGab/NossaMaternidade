/**
 * Sistema de Cores - Nossa Maternidade
 *
 * DEPRECADO: Este arquivo re-exporta de tokens.ts para compatibilidade.
 * TODO: Migrar todos os imports para usar tokens.ts diretamente
 *
 * Paleta oficial: Calm FemTech (Azul + Rosa)
 * Baseado em Apple HIG e Material Design 3
 */

import {
  brand,
  neutral,
  semantic,
  gradients,
  feeling as feelingColors,
} from "../theme/tokens";

// Re-exporta colors do tokens com compatibilidade
export const Colors = {
  // Cores Principais - Azul Primary (Calm FemTech)
  primary: {
    DEFAULT: brand.primary[500],
    50: brand.primary[50],
    100: brand.primary[100],
    200: brand.primary[200],
    300: brand.primary[300],
    400: brand.primary[400],
    500: brand.primary[500],
    600: brand.primary[600],
    700: brand.primary[700],
    800: brand.primary[800],
    900: brand.primary[900],
  },

  // Cores Secundárias - Lilac/Purple
  secondary: {
    DEFAULT: brand.secondary[500],
    50: brand.secondary[50],
    100: brand.secondary[100],
    200: brand.secondary[200],
    300: brand.secondary[300],
    400: brand.secondary[400],
    500: brand.secondary[500],
    600: brand.secondary[600],
    700: brand.secondary[700],
    800: brand.secondary[800],
    900: brand.secondary[900],
  },

  // Rosa Accent (Calm FemTech)
  accent: {
    DEFAULT: brand.accent[500],
    50: brand.accent[50],
    100: brand.accent[100],
    200: brand.accent[200],
    300: brand.accent[300],
    400: brand.accent[400],
    500: brand.accent[500],
    600: brand.accent[600],
    700: brand.accent[700],
    800: brand.accent[800],
    900: brand.accent[900],
  },

  // Azul Pastel Suave (legacy compat)
  bluePastel: {
    DEFAULT: "#BAE6FD",
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#BAE6FD",
    600: "#0EA5E9",
    700: "#0284C7",
    800: "#0369A1",
    900: "#075985",
  },

  // Cores de Sentimentos (Daily Feelings) - Mapeado para tokens
  feeling: {
    sunny: {
      color: feelingColors.bem.color,
      activeColor: "#FFE5B8",
      label: "Bem",
    },
    cloud: {
      color: feelingColors.cansada.color,
      activeColor: "#D4E9FD",
      label: "Cansada",
    },
    rainy: {
      color: feelingColors.indisposta.color,
      activeColor: "#EDE9FE",
      label: "Enjoada",
    },
    heart: {
      color: feelingColors.amada.color,
      activeColor: brand.accent[300],
      label: "Amada",
    },
  },

  // Cores de Texto
  text: {
    dark: neutral[900],
    DEFAULT: neutral[900],
    light: neutral[600],
    muted: neutral[500],
    white: "#ffffff",
  },

  // Cores de Fundo
  background: {
    DEFAULT: neutral[50],
    light: neutral[100],
    soft: neutral[200],
    cream: neutral[200],
    blueTint: "#F0F9FF",
    pinkTint: brand.accent[50],
  },

  // Cores de Categorias
  category: {
    nutricao: brand.accent[400],
    exercicio: "#BAE6FD",
    saude: "#DDD6FE",
    bemestar: "#FECACA",
  },

  // Gradientes
  gradients: {
    primary: gradients.primary,
    primarySoft: [brand.accent[400], brand.accent[200]],
    secondary: gradients.secondary,
    warm: gradients.warm,
    cool: gradients.cool,
    sunset: gradients.sunset,
  },

  // Cores de Status
  status: {
    success: semantic.light.success,
    warning: semantic.light.warning,
    error: semantic.light.error,
    info: semantic.light.info,
  },

  // Cores de UI
  ui: {
    border: neutral[200],
    borderLight: neutral[100],
    borderPink: brand.accent[200],
    borderBlue: "#BAE6FD",
    shadow: "rgba(244, 37, 140, 0.15)",
    shadowStrong: "rgba(244, 37, 140, 0.25)",
    shadowBlue: "rgba(186, 230, 253, 0.15)",
  },
} as const;

// Dark Mode Colors
export const ColorsDark = {
  primary: {
    DEFAULT: brand.primary[400],
    50: neutral[900],
    100: neutral[800],
    200: neutral[700],
    300: neutral[600],
    400: brand.primary[400],
    500: brand.primary[500],
    600: brand.primary[600],
    700: brand.primary[700],
    800: brand.primary[800],
    900: brand.primary[900],
  },

  secondary: {
    DEFAULT: brand.secondary[400],
    50: neutral[900],
    100: neutral[800],
    200: neutral[700],
    300: neutral[600],
    400: brand.secondary[400],
    500: brand.secondary[500],
    600: brand.secondary[600],
    700: brand.secondary[700],
    800: brand.secondary[800],
    900: brand.secondary[900],
  },

  accent: {
    DEFAULT: brand.accent[400],
    50: neutral[900],
    100: neutral[800],
    200: neutral[700],
    300: neutral[600],
    400: brand.accent[400],
    500: brand.accent[500],
    600: brand.accent[600],
    700: brand.accent[700],
    800: brand.accent[800],
    900: brand.accent[900],
  },

  bluePastel: {
    DEFAULT: "#BAE6FD",
    50: neutral[900],
    100: neutral[800],
    200: neutral[700],
    300: neutral[600],
    400: "#38BDF8",
    500: "#BAE6FD",
    600: "#7DD3FC",
    700: "#BAE6FD",
    800: "#E0F2FE",
    900: "#F0F9FF",
  },

  feeling: {
    sunny: {
      color: feelingColors.bem.color,
      activeColor: "#FFE5B8",
      label: "Bem",
    },
    cloud: {
      color: feelingColors.cansada.color,
      activeColor: "#D4E9FD",
      label: "Cansada",
    },
    rainy: {
      color: feelingColors.indisposta.color,
      activeColor: "#EDE9FE",
      label: "Enjoada",
    },
    heart: {
      color: feelingColors.amada.color,
      activeColor: brand.accent[300],
      label: "Amada",
    },
  },

  text: {
    dark: neutral[100],
    DEFAULT: neutral[100],
    light: neutral[400],
    muted: neutral[500],
    white: "#ffffff",
  },

  background: {
    DEFAULT: neutral[900],
    light: neutral[800],
    soft: neutral[700],
    cream: neutral[700],
    blueTint: "#0F1419",
    pinkTint: "#1A0F14",
  },

  category: {
    nutricao: brand.accent[400],
    exercicio: "#BAE6FD",
    saude: "#DDD6FE",
    bemestar: "#FECACA",
  },

  gradients: {
    primary: gradients.primary,
    primarySoft: [brand.accent[400], brand.accent[300]],
    secondary: gradients.secondary,
    warm: ["#2D1A1F", "#1A0F14"],
    cool: ["#0F1419", "#0A0F14"],
    sunset: gradients.sunset,
  },

  status: {
    success: semantic.dark.success,
    warning: semantic.dark.warning,
    error: semantic.dark.error,
    info: semantic.dark.info,
  },

  ui: {
    border: neutral[700],
    borderLight: neutral[800],
    borderPink: brand.accent[800],
    borderBlue: "#1F3F7A",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    shadowBlue: "rgba(186, 230, 253, 0.1)",
  },
} as const;

// Helper para obter cores de sentimentos
export const getFeelingColor = (feeling: keyof typeof Colors.feeling) => {
  return Colors.feeling[feeling];
};

// Helper para gradientes
export const getGradient = (gradient: keyof typeof Colors.gradients) => {
  return Colors.gradients[gradient];
};

// Exportar cor primária como constante para uso rápido
export const PRIMARY_COLOR = Colors.primary.DEFAULT;
export const SECONDARY_COLOR = Colors.secondary.DEFAULT;
export const ACCENT_COLOR = Colors.accent.DEFAULT;
export const BLUE_PASTEL = Colors.bluePastel.DEFAULT;
export const BACKGROUND_COLOR = Colors.background.DEFAULT;
export const TEXT_DARK = Colors.text.dark;
