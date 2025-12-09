/**
 * Modern Design System Tokens - Nossa Maternidade
 * Inspirado em shadcn/ui + Maternal Design System
 * 
 * Sistema baseado em CSS variables HSL para suporte a temas
 * @version 3.0.0
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ======================
// 🎨 HSL COLOR SYSTEM (shadcn/ui inspired)
// ======================

/**
 * Converte HSL para rgba string para React Native
 */
const hsl = (h: number, s: number, l: number, a: number = 1): string => {
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  let r: number, g: number, b: number;

  if (sDecimal === 0) {
    r = g = b = lDecimal;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;

    r = hue2rgb(p, q, hDecimal + 1 / 3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1 / 3);
  }

  const toHex = (c: number) => Math.round(c * 255);

  if (a === 1) {
    return `rgb(${toHex(r)}, ${toHex(g)}, ${toHex(b)})`;
  }
  return `rgba(${toHex(r)}, ${toHex(g)}, ${toHex(b)}, ${a})`;
};

/**
 * Modern Color System - HSL based
 * Inspirado em shadcn/ui com cores maternais
 */
export const ModernColors = {
  // Light Theme
  light: {
    background: hsl(0, 0, 100), // #FFFFFF
    foreground: hsl(240, 10, 3.9), // #09090B - quase preto

    card: hsl(0, 0, 100), // #FFFFFF
    cardForeground: hsl(240, 10, 3.9),

    popover: hsl(0, 0, 100),
    popoverForeground: hsl(240, 10, 3.9),

    primary: hsl(339, 85, 51), // Rosa Magenta #E91E63
    primaryForeground: hsl(0, 0, 100),

    secondary: hsl(240, 4.8, 95.9), // Cinza muito claro
    secondaryForeground: hsl(240, 5.9, 10),

    muted: hsl(240, 4.8, 95.9),
    mutedForeground: hsl(240, 3.8, 46.1),

    accent: hsl(240, 4.8, 95.9),
    accentForeground: hsl(240, 5.9, 10),

    destructive: hsl(0, 84.2, 60.2), // Vermelho
    destructiveForeground: hsl(0, 0, 98),

    border: hsl(240, 5.9, 90), // Cinza claro
    input: hsl(240, 5.9, 90),
    ring: hsl(339, 85, 51), // Rosa Magenta (focus ring)

    // Maternal specific colors
    maternal: {
      pink: hsl(339, 85, 51), // Rosa Magenta
      purple: hsl(291, 64, 42), // Roxo Vibrante
      blush: hsl(350, 100, 88), // Rosa claro
      sage: hsl(156, 36, 68), // Verde suave
      cream: hsl(30, 50, 98), // Off-white cremoso
    },

    // Status
    success: hsl(142, 76, 36),
    warning: hsl(38, 92, 50),
    info: hsl(199, 89, 48),
    error: hsl(0, 84, 60),
  },

  // Dark Theme
  dark: {
    background: hsl(240, 10, 3.9), // #09090B - quase preto
    foreground: hsl(0, 0, 98), // #FAFAFA

    card: hsl(240, 10, 3.9),
    cardForeground: hsl(0, 0, 98),

    popover: hsl(240, 10, 3.9),
    popoverForeground: hsl(0, 0, 98),

    primary: hsl(339, 85, 60), // Rosa mais claro para dark
    primaryForeground: hsl(0, 0, 100),

    secondary: hsl(240, 3.7, 15.9),
    secondaryForeground: hsl(0, 0, 98),

    muted: hsl(240, 3.7, 15.9),
    mutedForeground: hsl(240, 5, 64.9),

    accent: hsl(240, 3.7, 15.9),
    accentForeground: hsl(0, 0, 98),

    destructive: hsl(0, 62.8, 30.6),
    destructiveForeground: hsl(0, 0, 98),

    border: hsl(240, 3.7, 15.9),
    input: hsl(240, 3.7, 15.9),
    ring: hsl(339, 85, 60),

    // Maternal specific colors (ajustado para dark)
    maternal: {
      pink: hsl(339, 85, 60),
      purple: hsl(291, 64, 52),
      blush: hsl(350, 100, 75),
      sage: hsl(156, 36, 58),
      cream: hsl(30, 50, 10),
    },

    // Status
    success: hsl(142, 71, 45),
    warning: hsl(38, 92, 60),
    info: hsl(199, 89, 58),
    error: hsl(0, 84, 70),
  },
} as const;

// ======================
// 📏 SPACING SCALE (8px base)
// ======================
export const ModernSpacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// ======================
// 🔲 BORDER RADIUS (shadcn/ui style)
// ======================
export const ModernRadius = {
  none: 0,
  sm: 4, // 0.25rem
  DEFAULT: 8, // 0.5rem - var(--radius)
  md: 8, // calc(var(--radius) - 2px)
  lg: 12, // var(--radius)
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
  
  // Aliases
  button: 8,
  input: 8,
  card: 12,
  dialog: 16,
} as const;

// ======================
// ✍️ TYPOGRAPHY (System fonts + fallbacks)
// ======================
export const ModernTypography = {
  fontFamily: {
    sans: Platform.select({
      ios: '-apple-system, BlinkMacSystemFont',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'System',
    }),
    serif: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
      default: 'serif',
    }),
    mono: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      web: '"Courier New", monospace',
      default: 'monospace',
    }),
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// ======================
// 🌑 SHADOWS (Platform adaptive)
// ======================
const createModernShadow = (
  elevation: number,
  color: string = 'rgba(0, 0, 0, 0.1)'
) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${elevation}px ${elevation * 2}px ${color}`,
    };
  }

  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 1.5,
    elevation,
  };
};

export const ModernShadows = {
  none: {},
  sm: createModernShadow(1),
  DEFAULT: createModernShadow(2),
  md: createModernShadow(4),
  lg: createModernShadow(8),
  xl: createModernShadow(12),
  '2xl': createModernShadow(16),
  inner: Platform.OS === 'web' 
    ? { boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }
    : {},
} as const;

// ======================
// 🎬 ANIMATIONS
// ======================
export const ModernAnimations = {
  duration: {
    0: 0,
    75: 75,
    100: 100,
    150: 150,
    200: 200,
    300: 300,
    500: 500,
    700: 700,
    1000: 1000,
  },

  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ======================
// 📱 BREAKPOINTS
// ======================
export const ModernBreakpoints = {
  xs: 0,
  sm: 380, // iPhone SE
  md: 428, // iPhone 14 Pro Max
  lg: 768, // iPad Mini
  xl: 1024, // iPad Pro
  '2xl': 1280,
} as const;

// ======================
// 🎯 COMPONENT VARIANTS
// ======================
export const ModernComponents = {
  button: {
    base: {
      paddingHorizontal: ModernSpacing['4'],
      paddingVertical: ModernSpacing['2'],
      borderRadius: ModernRadius.md,
      minHeight: 44, // Accessibility minimum
    },
    sizes: {
      sm: {
        paddingHorizontal: ModernSpacing['3'],
        paddingVertical: ModernSpacing['1.5'],
        fontSize: ModernTypography.fontSize.sm,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: ModernSpacing['4'],
        paddingVertical: ModernSpacing['2'],
        fontSize: ModernTypography.fontSize.base,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: ModernSpacing['6'],
        paddingVertical: ModernSpacing['3'],
        fontSize: ModernTypography.fontSize.lg,
        minHeight: 56,
      },
    },
  },

  card: {
    base: {
      borderRadius: ModernRadius.lg,
      padding: ModernSpacing['4'],
      ...ModernShadows.sm,
    },
  },

  input: {
    base: {
      borderRadius: ModernRadius.md,
      paddingHorizontal: ModernSpacing['3'],
      paddingVertical: ModernSpacing['2'],
      borderWidth: 1,
      fontSize: ModernTypography.fontSize.base,
      minHeight: 44,
    },
  },
} as const;

// ======================
// 🏗️ Z-INDEX SCALE
// ======================
export const ModernZIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ======================
// 📐 CONTAINER SIZES
// ======================
export const ModernContainer = {
  xs: 320,
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
  '2xl': 672,
  '3xl': 768,
  '4xl': 896,
  '5xl': 1024,
  '6xl': 1152,
  '7xl': 1280,
  full: '100%',
} as const;

// ======================
// 🎨 MATERNAL GRADIENTS
// ======================
export const ModernGradients = {
  maternal: {
    primary: ['#E91E63', '#9C27B0'], // Rosa → Roxo
    soft: ['#FCE4EC', '#F3E5F5'], // Rosa claro → Roxo claro
    warm: ['#FF6B9D', '#FFB6C1'], // Rosa coral → Rosa claro
    sage: ['#A8E6CF', '#DCEDC1'], // Verde suave
    sunset: ['#FA709A', '#FEE140'], // Rosa → Amarelo
    ocean: ['#667EEA', '#764BA2'], // Azul → Roxo
  },
  
  functional: {
    success: ['#10B981', '#34D399'],
    warning: ['#F59E0B', '#FCD34D'],
    error: ['#EF4444', '#F87171'],
    info: ['#3B82F6', '#60A5FA'],
  },
} as const;

// ======================
// 📦 DEFAULT EXPORT
// ======================
export const ModernTokens = {
  colors: ModernColors,
  spacing: ModernSpacing,
  radius: ModernRadius,
  typography: ModernTypography,
  shadows: ModernShadows,
  animations: ModernAnimations,
  breakpoints: ModernBreakpoints,
  components: ModernComponents,
  zIndex: ModernZIndex,
  container: ModernContainer,
  gradients: ModernGradients,
  
  // Screen dimensions
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  
  // Helper functions
  hsl,
} as const;

export default ModernTokens;
