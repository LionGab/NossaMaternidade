/**
 * Design System Tokens - Nossa Maternidade
 * Sistema unificado de design tokens com suporte a Light/Dark Mode
 * @version 2.0.0
 */

import { Dimensions, Platform } from 'react-native';
import type { ThemeColors as _ThemeColors } from './ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ======================
// 🎨 COLOR TOKENS
// ======================

/**
 * Paleta de cores principal com escalas 50-900
 * Baseado em Material Design 3 + Nossa identidade maternal
 */
export const ColorTokens = {
  // Primary - Azul premium maternal (baseado no Google Blue otimizado)
  primary: {
    50: '#F0F7FF',
    100: '#E0EFFF',
    200: '#BAD4FF',
    300: '#7CACFF',
    400: '#4285F4',   // Google Blue (main)
    500: '#0D5FFF',   // Brand principal
    600: '#0047E6',
    700: '#0036B8',
    800: '#002D96',
    900: '#002979',
  },

  // Secondary - Rosa maternal suave
  secondary: {
    50: '#FFF0F6',
    100: '#FFE0EC',
    200: '#FFC2D9',
    300: '#FF94BA',
    400: '#FF8FA3',   // Rosa coral (legacy)
    500: '#FF2576',   // Brand secondary
    600: '#E60A5B',
    700: '#C10048',
    800: '#A0003D',
    900: '#840036',
  },

  // Neutral - Escala de cinzas moderna
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Success - Verde suave
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning - Laranja/Amarelo
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error - Vermelho
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info - Azul claro
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Accent colors
  accent: {
    purple: '#8B5CF6',
    teal: '#14B8A6',
    orange: '#FB923C',
    pink: '#EC4899',
    green: '#10B981',
    blue: '#4285F4',
  },
} as const;

/**
 * Semantic color mappings para Light Mode
 */
export const LightTheme = {
  // Backgrounds
  background: {
    canvas: '#F8F9FA',        // Fundo principal (warm white)
    card: '#FFFFFF',          // Cards e superfícies
    elevated: '#FFFFFF',      // Superfícies elevadas
    input: '#FFFFFF',         // Inputs
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: ['#E0EFFF', '#FFFFFF'],
      soft: ['#FFF0F6', '#F0F7FF'],
      warm: ['#FFFFFF', '#F8F9FA'],
    },
  },

  // Text
  text: {
    primary: '#5D4E4B',       // Cinza-marrom principal
    secondary: '#525252',     // Cinza médio
    tertiary: '#737373',      // Cinza claro
    disabled: '#A3A3A3',      // Desabilitado
    placeholder: '#9CA3AF',   // Placeholder text
    inverse: '#FFFFFF',       // Texto em fundos escuros
    link: '#0D5FFF',          // Links
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },

  // Borders
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(0, 0, 0, 0.16)',
    focus: '#0D5FFF',
    error: '#EF4444',
    success: '#10B981',
  },

  // Primary/Secondary mapped
  primary: {
    main: ColorTokens.primary[400],    // #4285F4
    light: ColorTokens.primary[100],   // #E0EFFF
    dark: ColorTokens.primary[700],    // #0036B8
    gradient: ['#367FFF', '#0D5FFF', '#0047E6'],
  },

  secondary: {
    main: ColorTokens.secondary[400],  // #FF8FA3
    light: ColorTokens.secondary[100], // #FFE0EC
    dark: ColorTokens.secondary[700],  // #C10048
    gradient: ['#FF94BA', '#FF2576', '#E60A5B'],
  },

  // Status colors for components
  status: {
    success: ColorTokens.success[500],
    warning: ColorTokens.warning[600],
    error: ColorTokens.error[600],
    info: ColorTokens.info[600],
  },
  
  // Gradients
  gradients: {
    success: ['#34D399', '#10B981', '#059669'],
    warning: ['#FBBf24', '#F59E0B', '#D97706'],
    error: ['#F87171', '#EF4444', '#DC2626'],
    info: ['#60A5FA', '#3B82F6', '#2563EB'],
  },
};

/**
 * Semantic color mappings para Dark Mode (Ocean Dark Theme)
 */
export const DarkTheme = {
  // Backgrounds - Ocean Dark inspired
  background: {
    canvas: '#020617',        // Preto azulado profundo
    card: '#0B1220',          // Superfície card
    elevated: '#1D2843',      // Superfície elevada (pause)
    input: '#FFFFFF',         // Input background (branco mesmo no dark mode)
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradient: {
      primary: ['#0B1220', '#020617'],
      soft: ['#1D2843', '#0B1220'],
      ocean: ['#020617', '#0B1220', '#1D2843'],
    },
  },

  // Text
  text: {
    primary: '#F9FAFB',       // Branco suave
    secondary: '#D1D5DB',     // Cinza claro
    tertiary: '#9CA3AF',      // Cinza médio
    disabled: '#6B7280',      // Desabilitado
    placeholder: '#9CA3AF',   // Placeholder text (melhor contraste WCAG AA)
    inverse: '#171717',       // Texto em fundos claros
    link: '#60A5FA',          // Link azul claro
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },

  // Borders
  border: {
    light: 'rgba(148, 163, 184, 0.1)',
    medium: 'rgba(148, 163, 184, 0.2)',
    dark: 'rgba(148, 163, 184, 0.3)',
    focus: '#60A5FA',
    error: '#F87171',
    success: '#34D399',
  },

  // Primary/Secondary mapped
  primary: {
    main: '#3B82F6',       // nath-dark-hero (azul para dark mode)
    light: ColorTokens.primary[300],   // #7CACFF
    dark: ColorTokens.primary[600],    // #0047E6
    gradient: ['#367FFF', '#0D5FFF', '#0047E6'],
  },

  secondary: {
    main: ColorTokens.secondary[400],  // #FF8FA3
    light: ColorTokens.secondary[300], // #FF94BA
    dark: ColorTokens.secondary[600],  // #E60A5B
    gradient: ['#FF94BA', '#FF2576', '#E60A5B'],
  },

  // Status colors for components
  status: {
    success: ColorTokens.success[400],
    warning: ColorTokens.warning[400],
    error: ColorTokens.error[400],
    info: ColorTokens.info[400],
  },

  // Gradients
  gradients: {
    success: ['#34D399', '#10B981', '#059669'],
    warning: ['#FBBf24', '#F59E0B', '#D97706'],
    error: ['#F87171', '#EF4444', '#DC2626'],
    info: ['#60A5FA', '#3B82F6', '#2563EB'],
  },
};

// ======================
// ✍️ TYPOGRAPHY TOKENS
// ======================

export const Typography = {
  // Font families - System fonts otimizados
  fonts: {
    body: Platform.select({  // alias for regular
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semibold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },

  // Font sizes - Mobile optimized
  sizes: {
    '3xs': 10,
    '2xs': 11,
    'xs': 12,
    'sm': 14,
    'base': 16,  // alias for md
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 42,
    '7xl': 48,
  },

  // Line heights
  lineHeights: {
    '3xs': 14,
    '2xs': 16,
    'xs': 18,
    'sm': 20,
    'md': 24,
    'lg': 26,
    'xl': 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 44,
    '6xl': 52,
    '7xl': 60,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },

  // Font weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

// ======================
// 📐 SPACING TOKENS
// ======================

export const Spacing = {
  '0': 0,
  'px': 1,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
} as const;

// ======================
// 🔲 BORDER RADIUS TOKENS
// ======================

export const Radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '2.5xl': 22,
  '3xl': 24,
  full: 9999,
} as const;

// ======================
// 🌑 SHADOW TOKENS
// ======================

/**
 * Helper para criar shadows compatíveis com Web e Native
 */
const createShadow = (
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    const { width: x, height: y } = offset;
    const color = `rgba(0, 0, 0, ${opacity})`;
    // No web, usar apenas boxShadow (sem shadow* props para evitar warnings)
    return {
      boxShadow: `${x}px ${y}px ${radius}px 0px ${color}`,
    };
  }

  // No React Native nativo, usar shadow* props (correto)
  return {
    shadowColor: '#000',
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};

export const Shadows = {
  none: {},
  sm: createShadow({ width: 0, height: 1 }, 0.05, 2, 1),
  md: createShadow({ width: 0, height: 2 }, 0.08, 4, 2),
  lg: createShadow({ width: 0, height: 4 }, 0.1, 8, 4),
  xl: createShadow({ width: 0, height: 8 }, 0.12, 16, 8),
  '2xl': createShadow({ width: 0, height: 12 }, 0.15, 24, 12),
  inner: createShadow({ width: 0, height: -2 }, 0.06, 3, -1),
} as const;

// ======================
// 🎬 ANIMATION TOKENS
// ======================

export const Animations = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  easing: {
    linear: [0, 0, 1, 1] as const,
    ease: [0.25, 0.1, 0.25, 1] as const,
    easeIn: [0.42, 0, 1, 1] as const,
    easeOut: [0, 0, 0.58, 1] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,
    spring: [0.25, 0.46, 0.45, 0.94] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
  },
} as const;

// ======================
// 🎯 TOUCH TARGETS
// ======================

export const TouchTargets = {
  min: 44,      // iOS minimum (WCAG AAA)
  small: 32,
  medium: 44,
  large: 56,
  xl: 64,
} as const;

// ======================
// 📱 ICON SIZES
// ======================

export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// ======================
// 🏗️ Z-INDEX
// ======================

export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

// ======================
// 📐 BREAKPOINTS
// ======================

export const Breakpoints = {
  xs: 360,
  sm: 390,
  md: 428,
  lg: 768,
  xl: 1024,
} as const;

// ======================
// 📱 SAFE AREAS
// ======================

export const SafeArea = {
  top: Platform.select({ ios: 44, android: 24, default: 24 }),
  bottom: Platform.select({ ios: 34, android: 0, default: 0 }),
  horizontal: 16,
} as const;

// ======================
// 🔧 RESPONSIVE HELPERS
// ======================

export const isSmallDevice = SCREEN_WIDTH < Breakpoints.sm;
export const isMediumDevice = SCREEN_WIDTH >= Breakpoints.sm && SCREEN_WIDTH < Breakpoints.md;
export const isLargeDevice = SCREEN_WIDTH >= Breakpoints.md;
export const isTablet = SCREEN_WIDTH >= Breakpoints.lg;

// ======================
// 📦 DEFAULT EXPORT
// ======================

/**
 * Tokens consolidados - use este objeto para acessar todos os tokens
 */
export const Tokens = {
  colors: ColorTokens,
  light: LightTheme,
  dark: DarkTheme,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  animations: Animations,
  touchTargets: TouchTargets,
  icons: IconSizes,
  zIndex: ZIndex,
  breakpoints: Breakpoints,
  safeArea: SafeArea,
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
} as const;

export default Tokens;
