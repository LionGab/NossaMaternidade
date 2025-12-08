/**
 * Flo Design System - Paleta Azul & Rosa
 * Adaptado do Flo Pregnancy Mode para Nossa Maternidade
 * @version 1.0.0
 *
 * Baseado em: FloDesignPregnancy STYLE_GUIDE.md
 * Cores originais (Peach/Yellow) adaptadas para Azul/Rosa
 */

// ======================
// PALETA LIGHT MODE (Maternidade)
// ======================

export const FloLightColors = {
  // Primary - Rosa (Main brand color)
  primary: '#F472B6',        // pink-400 - Cor principal, estados ativos
  primaryLight: '#FDF2F8',   // pink-50 - Backgrounds de icones
  primaryDark: '#EC4899',    // pink-500 - Pressed states

  // Accent - Azul (Secondary accents, gradients)
  accent: '#60A5FA',         // blue-400 - Acentos, gradientes
  accentLight: '#EFF6FF',    // blue-50 - Backgrounds suaves
  accentDark: '#3B82F6',     // blue-500 - Pressed states

  // Background
  background: '#FFFBFE',     // Branco rosado (warm white)
  card: '#FFFFFF',           // Branco puro para cards

  // Text
  textPrimary: '#EC4899',    // pink-500 - Headers coloridos
  textBody: '#1F2937',       // gray-800 - Texto principal
  textMuted: '#6B7280',      // gray-500 - Texto secundario

  // Border
  border: '#FBCFE8',         // pink-200 - Bordas suaves
  borderLight: '#FCE7F3',    // pink-100 - Bordas muito suaves
} as const;

// ======================
// PALETA DARK MODE
// ======================

export const FloDarkColors = {
  // Primary - Rosa claro (Dark mode friendly)
  primary: '#F9A8D4',        // pink-300 - Rosa claro no dark
  primaryLight: '#3B1F2B',   // Custom - Background icones
  primaryDark: '#F472B6',    // pink-400 - Pressed states

  // Accent - Azul claro
  accent: '#93C5FD',         // blue-300 - Azul claro
  accentLight: '#1E3A5F',    // Custom - Background azul escuro
  accentDark: '#60A5FA',     // blue-400 - Pressed states

  // Background
  background: '#1A1520',     // Roxo escuro (deep purple/black)
  card: '#2D2233',           // Card escuro

  // Text
  textPrimary: '#FFFFFF',    // Branco - Texto principal
  textMuted: '#9CA3AF',      // gray-400 - Texto secundario

  // Border
  border: '#374151',         // gray-700 - Bordas
  borderLight: '#1F2937',    // gray-800 - Bordas suaves
} as const;

// ======================
// ESCALAS COMPLETAS
// ======================

export const FloPink = {
  50: '#FDF2F8',
  100: '#FCE7F3',
  200: '#FBCFE8',
  300: '#F9A8D4',
  400: '#F472B6',  // MAIN
  500: '#EC4899',
  600: '#DB2777',
  700: '#BE185D',
  800: '#9D174D',
  900: '#831843',
  DEFAULT: '#F472B6',
} as const;

export const FloBlue = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',  // MAIN
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
  DEFAULT: '#60A5FA',
} as const;

// ======================
// CORES FUNCIONAIS
// ======================

export const FloFunctional = {
  // Saude/Nutricao (Verde)
  health: {
    light: { bg: '#DCFCE7', text: '#16A34A' },
    dark: { bg: 'rgba(22, 163, 74, 0.2)', text: '#4ADE80' },
  },
  // Alertas/Medico (Vermelho)
  alert: {
    light: { bg: '#FEE2E2', text: '#DC2626' },
    dark: { bg: 'rgba(220, 38, 38, 0.2)', text: '#F87171' },
  },
  // Info/Educacao (Indigo)
  info: {
    light: { bg: '#E0E7FF', text: '#4F46E5' },
    dark: { bg: 'rgba(79, 70, 229, 0.2)', text: '#A5B4FC' },
  },
  // Sucesso (Verde esmeralda)
  success: {
    light: { bg: '#D1FAE5', text: '#059669' },
    dark: { bg: 'rgba(5, 150, 105, 0.2)', text: '#34D399' },
  },
  // Warning (Amarelo)
  warning: {
    light: { bg: '#FEF3C7', text: '#D97706' },
    dark: { bg: 'rgba(217, 119, 6, 0.2)', text: '#FBBF24' },
  },
} as const;

// ======================
// GRADIENTES
// ======================

export const FloGradients = {
  // Gradiente principal: Rosa -> Azul
  primary: ['#F472B6', '#60A5FA'] as const,

  // Alternativo: Pink -> Violet
  alternate: ['#EC4899', '#8B5CF6'] as const,

  // Dark mode: Rosa escuro -> Azul escuro
  dark: ['#831843', '#1E3A5F'] as const,

  // Suave: Rosa claro -> Azul claro
  soft: ['#FCE7F3', '#DBEAFE'] as const,

  // Header gradient (3 cores)
  header: ['#F472B6', '#EC4899', '#8B5CF6'] as const,

  // Sunrise (warm)
  sunrise: ['#F472B6', '#FB923C', '#FBBF24'] as const,

  // Ocean (cool)
  ocean: ['#60A5FA', '#3B82F6', '#1D4ED8'] as const,
} as const;

// ======================
// TYPOGRAPHY (Flo Design)
// ======================

export const FloTypography = {
  // Display - 24px Bold (Week number display)
  display: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  // Heading 1 - 20px Bold (Card titles)
  h1: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  // Heading 2 - 18px Bold (Section headers)
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  // Body - 14px Medium (Main descriptions)
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  // Label - 12px Medium (Subtitles)
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  // Caption - 10px Bold Uppercase (Badges)
  caption: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

// ======================
// UI ELEMENTS (Flo Design)
// ======================

export const FloRadius = {
  // Main Mobile Frame - 40px (highly rounded)
  frame: 40,
  // Cards - 16px to 24px
  cardSmall: 16,
  cardMedium: 20,
  cardLarge: 24,
  // Icons - Squircle or Circle
  iconSquircle: 16,
  iconCircle: 9999,
  // Nav bar top
  navTop: 24,
  // Pill buttons
  pill: 9999,
} as const;

export const FloShadows = {
  // Card Shadow - subtle lift
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Floating Elements - emphasis
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  // Nav Bar - soft upward
  navBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 4,
  },
  // Pink glow (for primary elements)
  pinkGlow: {
    shadowColor: '#F472B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  // Blue glow (for accent elements)
  blueGlow: {
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// ======================
// COMPONENTES ESPECIFICOS
// ======================

export const FloComponents = {
  // Navigation Bar
  navBar: {
    height: 80,
    iconSize: 24,
    iconStrokeInactive: 2,
    iconStrokeActive: 2.5,
    activeColor: {
      light: '#F472B6', // Rosa
      dark: '#F9A8D4',  // Rosa claro
    },
    inactiveColor: {
      light: '#9CA3AF', // gray-400
      dark: '#6B7280',  // gray-500
    },
  },

  // Week Scroller
  weekScroller: {
    itemSize: 48,
    activeScale: 1.1,
    activeBackground: {
      light: '#F472B6',
      dark: '#F9A8D4',
    },
    activeText: '#FFFFFF',
    inactiveBackground: 'transparent',
    inactiveBorder: {
      light: '#FBCFE8',
      dark: '#374151',
    },
  },

  // Baby Visualizer (Progress Ring)
  babyVisualizer: {
    size: 200,
    strokeWidth: 8,
    progressColor: {
      light: '#F472B6',
      dark: '#F9A8D4',
    },
    backgroundColor: {
      light: '#FCE7F3',
      dark: '#3B1F2B',
    },
  },

  // Insight Cards
  insightCard: {
    borderRadius: 20,
    padding: 16,
    iconSize: 32,
    categories: {
      education: { bg: '#E0E7FF', text: '#4F46E5', icon: 'book-open' },
      nutrition: { bg: '#DCFCE7', text: '#16A34A', icon: 'apple' },
      medical: { bg: '#FEE2E2', text: '#DC2626', icon: 'heart-pulse' },
      wellness: { bg: '#FCE7F3', text: '#EC4899', icon: 'sparkles' },
      exercise: { bg: '#DBEAFE', text: '#3B82F6', icon: 'activity' },
    },
  },
} as const;

// ======================
// TEMA COMPLETO EXPORTADO
// ======================

export const FloTheme = {
  light: FloLightColors,
  dark: FloDarkColors,
  pink: FloPink,
  blue: FloBlue,
  functional: FloFunctional,
  gradients: FloGradients,
  typography: FloTypography,
  radius: FloRadius,
  shadows: FloShadows,
  components: FloComponents,
} as const;

export default FloTheme;

// ======================
// HELPERS
// ======================

/**
 * Retorna as cores do tema baseado no modo (light/dark)
 */
export function getFloColors(isDark: boolean) {
  return isDark ? FloDarkColors : FloLightColors;
}

/**
 * Retorna a cor funcional baseada no tipo e modo
 */
export function getFloFunctionalColor(
  type: keyof typeof FloFunctional,
  isDark: boolean,
  property: 'bg' | 'text'
) {
  return isDark
    ? FloFunctional[type].dark[property]
    : FloFunctional[type].light[property];
}

/**
 * Cria um estilo de gradiente para LinearGradient
 */
export function createFloGradient(type: keyof typeof FloGradients) {
  return {
    colors: FloGradients[type],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  };
}
