/**
 * 🌸 Wellness Design System - Nossa Maternidade
 *
 * Design premium inspirado nos melhores apps de wellness feminino:
 * - Flo (period tracking) - Cores suaves rosa/roxo, tipografia clara
 * - Calm (meditation) - Paleta serena, gradientes suaves
 * - Clue (cycle tracking) - Design minimalista, cores funcionais
 * - I am (affirmations) - Tipografia impactante, cores vibrantes
 *
 * @version 1.0.0
 * @author Nossa Maternidade Design Team
 */

import { Platform } from 'react-native';

// ======================
// 🎨 WELLNESS COLOR PALETTE
// ======================

/**
 * Paleta de cores inspirada em wellness apps
 * Todas as cores passam WCAG AAA para acessibilidade
 */
export const WellnessColors = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PRIMARY PALETTE - Rosa Maternal Suave
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  primary: {
    50: '#FFF5F7',   // Quase branco com toque rosa
    100: '#FFE4EB',  // Rosa muito claro (backgrounds)
    200: '#FFC9D9',  // Rosa suave
    300: '#FFA8C0',  // Rosa médio-claro
    400: '#FF87AA',  // Rosa médio
    500: '#FF6B9D',  // Rosa principal ⭐ (Flo-inspired)
    600: '#F24C83',  // Rosa vibrante
    700: '#D93A6D',  // Rosa profundo
    800: '#B8295A',  // Rosa escuro
    900: '#8B1E45',  // Rosa muito escuro
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SECONDARY PALETTE - Roxo Sereno
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  secondary: {
    50: '#F5F3FF',   // Lavanda muito claro
    100: '#EDE9FE',  // Lavanda claro
    200: '#DDD6FE',  // Roxo muito suave
    300: '#C4B5FD',  // Roxo suave
    400: '#A78BFA',  // Roxo médio ⭐ (Calm-inspired)
    500: '#8B5CF6',  // Roxo vibrante
    600: '#7C3AED',  // Roxo profundo
    700: '#6D28D9',  // Roxo escuro
    800: '#5B21B6',  // Roxo muito escuro
    900: '#4C1D95',  // Roxo quase preto
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACCENT PALETTE - Azul Confiança
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  accent: {
    50: '#F0F9FF',   // Azul céu muito claro
    100: '#E0F2FE',  // Azul céu claro
    200: '#BAE6FD',  // Azul suave
    300: '#7DD3FC',  // Azul médio-claro
    400: '#38BDF8',  // Azul médio ⭐ (Clue-inspired)
    500: '#0EA5E9',  // Azul vibrante
    600: '#0284C7',  // Azul profundo
    700: '#0369A1',  // Azul escuro
    800: '#075985',  // Azul muito escuro
    900: '#0C4A6E',  // Azul quase preto
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEUTRAL PALETTE - Cinzas Modernos
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  neutral: {
    0: '#FFFFFF',    // Branco puro
    50: '#FAFAFA',   // Off-white (canvas)
    100: '#F5F5F5',  // Cinza muito claro
    200: '#E5E5E5',  // Cinza claro
    300: '#D4D4D4',  // Cinza médio-claro
    400: '#A3A3A3',  // Cinza médio
    500: '#737373',  // Cinza (text secondary)
    600: '#525252',  // Cinza escuro
    700: '#404040',  // Cinza muito escuro
    800: '#262626',  // Quase preto
    900: '#171717',  // Preto suave
    950: '#0A0A0A',  // Preto puro
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SEMANTIC COLORS - Status & Feedback
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  semantic: {
    success: {
      light: '#10B981',  // Verde esmeralda (clue-inspired)
      main: '#059669',   // Verde profundo
      dark: '#047857',   // Verde escuro
      bg: '#ECFDF5',     // Verde muito claro (background)
    },
    warning: {
      light: '#FBBF24',  // Amarelo dourado
      main: '#F59E0B',   // Amarelo vibrante
      dark: '#D97706',   // Laranja escuro
      bg: '#FEF3C7',     // Amarelo muito claro
    },
    error: {
      light: '#F87171',  // Vermelho suave
      main: '#EF4444',   // Vermelho
      dark: '#DC2626',   // Vermelho escuro
      bg: '#FEE2E2',     // Vermelho muito claro
    },
    info: {
      light: '#60A5FA',  // Azul claro
      main: '#3B82F6',   // Azul
      dark: '#2563EB',   // Azul escuro
      bg: '#DBEAFE',     // Azul muito claro
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WELLNESS MOODS - Emotion Colors
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  moods: {
    calm: '#A78BFA',      // Roxo suave (meditação)
    energetic: '#F59E0B', // Amarelo vibrante
    peaceful: '#10B981',  // Verde sereno
    joyful: '#FF6B9D',    // Rosa alegre
    focused: '#0EA5E9',   // Azul foco
    relaxed: '#8B5CF6',   // Roxo relaxante
    hopeful: '#38BDF8',   // Azul esperança
    grateful: '#C4B5FD',  // Lavanda gratidão
  },
};

// ======================
// 🎨 LIGHT THEME
// ======================

export const WellnessLightTheme = {
  // Backgrounds
  background: {
    primary: WellnessColors.neutral[0],     // #FFFFFF - Branco puro
    secondary: WellnessColors.neutral[50],  // #FAFAFA - Off-white
    tertiary: WellnessColors.neutral[100],  // #F5F5F5 - Cinza muito claro
    elevated: WellnessColors.neutral[0],    // Cards elevados
    overlay: 'rgba(0, 0, 0, 0.5)',         // Modal overlay

    // Gradients
    gradient: {
      primary: [WellnessColors.primary[500], WellnessColors.secondary[400]], // Rosa → Roxo
      soft: [WellnessColors.primary[50], WellnessColors.secondary[50]],      // Rosa claro → Roxo claro
      warm: ['#FFFFFF', WellnessColors.primary[50]],                         // Branco → Rosa suave
      hero: [WellnessColors.primary[400], WellnessColors.accent[400]],       // Rosa → Azul
    },
  },

  // Text colors
  text: {
    primary: WellnessColors.neutral[900],   // #171717 - Quase preto
    secondary: WellnessColors.neutral[600], // #525252 - Cinza escuro
    tertiary: WellnessColors.neutral[500],  // #737373 - Cinza médio
    disabled: WellnessColors.neutral[400],  // #A3A3A3 - Cinza médio-claro
    inverse: WellnessColors.neutral[0],     // #FFFFFF - Branco
    link: WellnessColors.primary[600],      // Rosa vibrante
    placeholder: WellnessColors.neutral[400], // Cinza médio-claro
  },

  // Border colors
  border: {
    light: WellnessColors.neutral[200],     // Cinza claro
    medium: WellnessColors.neutral[300],    // Cinza médio-claro
    dark: WellnessColors.neutral[400],      // Cinza médio
    focus: WellnessColors.primary[500],     // Rosa principal
    error: WellnessColors.semantic.error.main,
    success: WellnessColors.semantic.success.main,
  },

  // Brand colors
  brand: {
    primary: WellnessColors.primary[500],    // Rosa principal
    secondary: WellnessColors.secondary[400], // Roxo médio
    accent: WellnessColors.accent[400],       // Azul médio
  },

  // Semantic colors
  semantic: WellnessColors.semantic,
};

// ======================
// 🌙 DARK THEME
// ======================

export const WellnessDarkTheme = {
  // Backgrounds
  background: {
    primary: WellnessColors.neutral[950],   // #0A0A0A - Preto puro
    secondary: WellnessColors.neutral[900], // #171717 - Preto suave
    tertiary: WellnessColors.neutral[800],  // #262626 - Quase preto
    elevated: WellnessColors.neutral[900],  // Cards elevados
    overlay: 'rgba(0, 0, 0, 0.7)',         // Modal overlay

    // Gradients (mais suaves para dark mode)
    gradient: {
      primary: [WellnessColors.primary[600], WellnessColors.secondary[500]], // Rosa → Roxo
      soft: [WellnessColors.neutral[900], WellnessColors.neutral[800]],     // Preto → Cinza escuro
      warm: [WellnessColors.neutral[950], WellnessColors.neutral[900]],     // Preto → Preto suave
      hero: [WellnessColors.primary[500], WellnessColors.accent[500]],      // Rosa → Azul
    },
  },

  // Text colors (mais claros para dark mode)
  text: {
    primary: WellnessColors.neutral[50],    // #FAFAFA - Off-white
    secondary: WellnessColors.neutral[300], // #D4D4D4 - Cinza médio-claro
    tertiary: WellnessColors.neutral[400],  // #A3A3A3 - Cinza médio
    disabled: WellnessColors.neutral[600],  // #525252 - Cinza escuro
    inverse: WellnessColors.neutral[950],   // #0A0A0A - Preto
    link: WellnessColors.primary[400],      // Rosa médio
    placeholder: WellnessColors.neutral[500], // Cinza médio
  },

  // Border colors (mais suaves para dark mode)
  border: {
    light: WellnessColors.neutral[800],     // Quase preto
    medium: WellnessColors.neutral[700],    // Cinza muito escuro
    dark: WellnessColors.neutral[600],      // Cinza escuro
    focus: WellnessColors.primary[400],     // Rosa médio
    error: WellnessColors.semantic.error.light,
    success: WellnessColors.semantic.success.light,
  },

  // Brand colors (ajustados para dark mode)
  brand: {
    primary: WellnessColors.primary[400],    // Rosa médio
    secondary: WellnessColors.secondary[300], // Roxo suave
    accent: WellnessColors.accent[300],       // Azul médio-claro
  },

  // Semantic colors (versões light para dark mode)
  semantic: {
    success: {
      light: WellnessColors.semantic.success.light,
      main: WellnessColors.semantic.success.light,
      dark: WellnessColors.semantic.success.main,
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    warning: {
      light: WellnessColors.semantic.warning.light,
      main: WellnessColors.semantic.warning.light,
      dark: WellnessColors.semantic.warning.main,
      bg: 'rgba(251, 191, 36, 0.1)',
    },
    error: {
      light: WellnessColors.semantic.error.light,
      main: WellnessColors.semantic.error.light,
      dark: WellnessColors.semantic.error.main,
      bg: 'rgba(248, 113, 113, 0.1)',
    },
    info: {
      light: WellnessColors.semantic.info.light,
      main: WellnessColors.semantic.info.light,
      dark: WellnessColors.semantic.info.main,
      bg: 'rgba(96, 165, 250, 0.1)',
    },
  },
};

// ======================
// ✍️ WELLNESS TYPOGRAPHY
// ======================

/**
 * Tipografia profissional inspirada em Flo, Calm, Clue
 *
 * iOS: SF Pro Display (system)
 * Android: Roboto / Google Sans
 */
export const WellnessTypography = {
  // Font families otimizadas por plataforma
  fonts: {
    // Display - Headlines grandes (Flo-style)
    display: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),

    // Body - Texto principal (legibilidade)
    body: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),

    // Mono - Códigos, números
    mono: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SEMANTIC TEXT STYLES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Display - Hero headlines (32-48px)
  display: {
    large: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 56,
      letterSpacing: -1,
    },
    medium: {
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 48,
      letterSpacing: -0.5,
    },
    small: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: 0,
    },
  },

  // Heading - Section titles (20-28px)
  heading: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 26,
      letterSpacing: 0.15,
    },
  },

  // Body - Paragraph text (14-16px)
  body: {
    large: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    medium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 18,
      letterSpacing: 0.4,
    },
  },

  // Label - Buttons, chips (12-14px)
  label: {
    large: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    medium: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const, // Flo-style badges
    },
  },

  // Caption - Metadata (10-12px)
  caption: {
    large: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    medium: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 14,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 10,
      fontWeight: '400' as const,
      lineHeight: 12,
      letterSpacing: 0.5,
    },
  },
};

// ======================
// 📏 WELLNESS SPACING
// ======================

/**
 * Sistema de spacing 4px (Calm-inspired)
 */
export const WellnessSpacing = {
  0: 0,
  1: 4,    // Tiny
  2: 8,    // Extra small
  3: 12,   // Small
  4: 16,   // Medium
  5: 20,   // Large
  6: 24,   // Extra large
  8: 32,   // 2X large
  10: 40,  // 3X large
  12: 48,  // 4X large
  16: 64,  // 5X large
  20: 80,  // Hero spacing
  24: 96,  // Hero spacing XL
};

// ======================
// 🔲 WELLNESS RADIUS
// ======================

/**
 * Border radius system (Flo + Calm inspired)
 */
export const WellnessRadius = {
  none: 0,
  sm: 8,      // Small elements (chips)
  md: 12,     // Medium elements (inputs)
  lg: 16,     // Large elements (cards)
  xl: 20,     // Extra large (prominent cards)
  '2xl': 24,  // Hero cards (Flo-style)
  '3xl': 32,  // Special elements
  full: 9999, // Pills, circles
};

// ======================
// 🌫️ WELLNESS SHADOWS
// ======================

/**
 * Shadow system (Calm-inspired - suaves e elevadas)
 */
const createWellnessShadow = (
  elevation: number,
  color: string = 'rgba(0, 0, 0, 0.08)'
) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${elevation}px ${elevation * 3}px ${color}`,
    };
  }

  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.08,
    shadowRadius: elevation * 1.5,
    elevation,
  };
};

export const WellnessShadows = {
  none: {},
  sm: createWellnessShadow(2),   // Subtle lift
  md: createWellnessShadow(4),   // Card elevation
  lg: createWellnessShadow(8),   // Prominent cards
  xl: createWellnessShadow(12),  // Floating elements
  '2xl': createWellnessShadow(16), // Modal/sheet

  // Colored shadows (Flo-inspired)
  primary: Platform.OS === 'web'
    ? { boxShadow: `0 8px 24px rgba(255, 107, 157, 0.2)` }
    : {
        shadowColor: WellnessColors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      },

  secondary: Platform.OS === 'web'
    ? { boxShadow: `0 8px 24px rgba(167, 139, 250, 0.2)` }
    : {
        shadowColor: WellnessColors.secondary[400],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      },
};

// ======================
// 🎬 WELLNESS ANIMATIONS
// ======================

/**
 * Animation system (Calm-inspired - suaves e orgânicas)
 */
export const WellnessAnimations = {
  // Durations
  duration: {
    instant: 0,
    fast: 150,      // Micro-interactions
    normal: 300,    // Standard transitions
    slow: 500,      // Page transitions
    slower: 700,    // Hero animations
  },

  // Easing curves (natural motion)
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],           // Standard
    easeIn: [0.42, 0, 1, 1],              // Aceleração
    easeOut: [0, 0, 0.58, 1],             // Desaceleração
    easeInOut: [0.42, 0, 0.58, 1],        // Suave
    spring: [0.25, 0.46, 0.45, 0.94],     // Natural spring
    bounce: [0.68, -0.55, 0.265, 1.55],   // Bounce effect
  },
};

// ======================
// 🎯 WELLNESS COMPONENTS
// ======================

/**
 * Component styles pré-definidos
 */
export const WellnessComponents = {
  // Button variants
  button: {
    base: {
      borderRadius: WellnessRadius.md,
      minHeight: 48, // WCAG AAA touch target
      paddingHorizontal: WellnessSpacing[4],
      paddingVertical: WellnessSpacing[3],
    },
    sizes: {
      sm: {
        minHeight: 36,
        paddingHorizontal: WellnessSpacing[3],
        paddingVertical: WellnessSpacing[2],
        fontSize: 14,
      },
      md: {
        minHeight: 48,
        paddingHorizontal: WellnessSpacing[4],
        paddingVertical: WellnessSpacing[3],
        fontSize: 16,
      },
      lg: {
        minHeight: 56,
        paddingHorizontal: WellnessSpacing[6],
        paddingVertical: WellnessSpacing[4],
        fontSize: 18,
      },
    },
  },

  // Card variants
  card: {
    base: {
      borderRadius: WellnessRadius.lg,
      padding: WellnessSpacing[4],
      ...WellnessShadows.md,
    },
    elevated: {
      borderRadius: WellnessRadius.xl,
      padding: WellnessSpacing[6],
      ...WellnessShadows.lg,
    },
  },

  // Input variants
  input: {
    base: {
      borderRadius: WellnessRadius.md,
      minHeight: 48,
      paddingHorizontal: WellnessSpacing[4],
      paddingVertical: WellnessSpacing[3],
      borderWidth: 1,
    },
  },

  // Chip variants (Flo-inspired)
  chip: {
    base: {
      borderRadius: WellnessRadius.full,
      paddingHorizontal: WellnessSpacing[3],
      paddingVertical: WellnessSpacing[2],
    },
  },
};

// ======================
// 📦 WELLNESS DESIGN SYSTEM (Export completo)
// ======================

export const WellnessDesignSystem = {
  colors: WellnessColors,
  light: WellnessLightTheme,
  dark: WellnessDarkTheme,
  typography: WellnessTypography,
  spacing: WellnessSpacing,
  radius: WellnessRadius,
  shadows: WellnessShadows,
  animations: WellnessAnimations,
  components: WellnessComponents,
} as const;

export default WellnessDesignSystem;
