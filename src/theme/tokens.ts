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
  // Primary - Ocean Blue System (baseado no web reference)
  primary: {
    50: '#F0F8FF',    // Lightest sky
    100: '#E6F0FA',   // Sky (web reference) - backgrounds light
    200: '#BAD4FF',   // Light blue
    300: '#7CACFF',   // Mid blue
    400: '#004E9A',   // Ocean Blue (main) - web reference
    500: '#00427D',   // Mid ocean
    600: '#003768',   // Dark ocean
    700: '#002C54',   // Navy
    800: '#002244',   // Deep Navy (hover) - web reference
    900: '#001A36',   // Darkest navy
  },

  // Secondary - Coral System (baseado no web reference)
  secondary: {
    50: '#FEF2F2',    // Very light coral
    100: '#FEE2E2',   // Light coral
    200: '#FECACA',   // Soft coral
    300: '#FCA5A5',   // Mid coral
    400: '#D93025',   // Coral (main) - web reference
    500: '#B91C1C',   // Deep coral
    600: '#991B1B',   // Dark coral
    700: '#7F1D1D',   // Darker coral
    800: '#6B1818',   // Almost dark
    900: '#5A1313',   // Darkest coral
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
    blue: '#60A5FA',       // Light ocean (for dark mode accents)
    ocean: '#004E9A',      // Ocean blue (primary reference)
    sunshine: '#F59E0B',   // Amber/Warning - web reference
  },

  // Mint System (web reference - success/positive accent)
  mint: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#236B62',   // Mint (main) - web reference
    500: '#0F5247',   // Deep mint
    600: '#0D4B3F',
    700: '#0B4037',
    800: '#09362F',
    900: '#072D27',
  },
} as const;

/**
 * Semantic color mappings para Light Mode
 */
export const LightTheme = {
  // Backgrounds - Cloud/Snow system (web reference)
  background: {
    canvas: '#F1F5F9',        // Cloud (web reference) - fundo principal
    card: '#FFFFFF',          // Snow - cards e superfícies
    elevated: '#FFFFFF',      // Snow - superfícies elevadas
    input: '#FFFFFF',         // Snow - inputs
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: ['#E6F0FA', '#FFFFFF'],   // Sky → Snow
      soft: ['#FEF2F2', '#F0F8FF'],       // Light coral → Lightest sky
      warm: ['#FFFFFF', '#F1F5F9'],       // Snow → Cloud
    },
  },

  // Text - Charcoal/Slate/Silver system (web reference)
  text: {
    primary: '#0F172A',       // Charcoal (web reference) - alto contraste
    secondary: '#334155',     // Slate (web reference)
    tertiary: '#64748B',      // Silver (web reference)
    disabled: '#94A3B8',      // Lighter silver
    placeholder: '#9CA3AF',   // Placeholder text
    inverse: '#FFFFFF',       // Texto em fundos escuros
    link: '#004E9A',          // Ocean blue (web reference)
    success: '#236B62',       // Mint (web reference)
    warning: '#F59E0B',       // Sunshine (web reference)
    error: '#D93025',         // Coral (web reference)
    info: '#2563EB',
  },

  // Borders
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: '#CBD5E1',        // Visible border (web reference)
    dark: 'rgba(0, 0, 0, 0.16)',
    focus: '#004E9A',         // Ocean blue
    error: '#D93025',         // Coral
    success: '#236B62',       // Mint
  },

  // Primary - Ocean Blue (web reference)
  primary: {
    main: ColorTokens.primary[400],    // #004E9A Ocean Blue
    light: ColorTokens.primary[100],   // #E6F0FA Sky
    dark: ColorTokens.primary[800],    // #002244 Deep Navy
    gradient: ['#004E9A', '#00427D', '#003768'],  // Ocean gradient
  },

  // Secondary - Coral (web reference)
  secondary: {
    main: ColorTokens.secondary[400],  // #D93025 Coral
    light: ColorTokens.secondary[100], // #FEE2E2 Light coral
    dark: ColorTokens.secondary[600],  // #991B1B Dark coral
    gradient: ['#D93025', '#B91C1C', '#991B1B'],  // Coral gradient
  },

  // Status colors - aligned with web reference
  status: {
    success: ColorTokens.mint[400],    // #236B62 Mint
    warning: ColorTokens.warning[500], // #F59E0B Sunshine
    error: ColorTokens.secondary[400], // #D93025 Coral
    info: ColorTokens.info[600],       // #2563EB
  },

  // Gradients
  gradients: {
    success: ['#5EEAD4', '#236B62', '#0F5247'],  // Mint gradient
    warning: ['#FCD34D', '#F59E0B', '#D97706'],  // Sunshine gradient
    error: ['#FCA5A5', '#D93025', '#B91C1C'],    // Coral gradient
    info: ['#60A5FA', '#3B82F6', '#2563EB'],
  },
};

/**
 * Semantic color mappings para Dark Mode (Ocean Dark Theme)
 */
export const DarkTheme = {
  // Backgrounds - Slate system (web reference)
  background: {
    canvas: '#020617',        // Blue-black (web reference) - fundo principal
    card: '#1E293B',          // Slate (web reference) - superfície card
    elevated: '#334155',      // Mid-slate (web reference) - superfície elevada
    input: '#334155',         // Mid-slate (web reference) - input background
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradient: {
      primary: ['#1E293B', '#020617'],   // Slate → Blue-black
      soft: ['#334155', '#1E293B'],       // Mid-slate → Slate
      ocean: ['#020617', '#1E293B', '#334155'],  // Blue-black → Slate → Mid-slate
    },
  },

  // Text - Off-white/Light grey system (web reference)
  text: {
    primary: '#F8FAFC',       // Off-white (web reference)
    secondary: '#CBD5E1',     // Light grey (web reference)
    tertiary: '#94A3B8',      // Mid grey (web reference)
    disabled: '#64748B',      // Silver (web reference)
    placeholder: '#94A3B8',   // Mid grey
    inverse: '#0F172A',       // Charcoal (web reference)
    link: '#60A5FA',          // Light ocean (web reference)
    success: '#4ADE80',       // Light mint
    warning: '#FCD34D',       // Light sunshine
    error: '#F87171',         // Light coral
    info: '#60A5FA',          // Light ocean
  },

  // Borders - (web reference)
  border: {
    light: 'rgba(148, 163, 184, 0.1)',
    medium: '#475569',        // Mid-slate border (web reference)
    dark: 'rgba(148, 163, 184, 0.3)',
    focus: '#60A5FA',         // Light ocean
    error: '#F87171',         // Light coral
    success: '#4ADE80',       // Light mint
  },

  // Primary - Light Ocean (web reference dark mode)
  primary: {
    main: '#60A5FA',          // Light ocean (web reference dark mode)
    light: '#93C5FD',         // Lighter blue
    dark: '#1E40AF',          // Deep blue
    gradient: ['#60A5FA', '#3B82F6', '#2563EB'],  // Light ocean gradient
  },

  // Secondary - Light Coral (web reference dark mode)
  secondary: {
    main: '#F87171',          // Light coral
    light: '#FCA5A5',         // Lighter coral
    dark: '#DC2626',          // Mid coral
    gradient: ['#F87171', '#EF4444', '#DC2626'],  // Light coral gradient
  },

  // Status colors - lighter for dark mode
  status: {
    success: '#4ADE80',       // Light mint
    warning: '#FCD34D',       // Light sunshine
    error: '#F87171',         // Light coral
    info: '#60A5FA',          // Light ocean
  },

  // Gradients - brighter for dark mode
  gradients: {
    success: ['#86EFAC', '#4ADE80', '#22C55E'],  // Light mint gradient
    warning: ['#FDE68A', '#FCD34D', '#FBBF24'],  // Light sunshine gradient
    error: ['#FCA5A5', '#F87171', '#EF4444'],    // Light coral gradient
    info: ['#93C5FD', '#60A5FA', '#3B82F6'],     // Light ocean gradient
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

  // Aliases from web reference
  pill: 9999,     // Fully rounded (pill buttons) - rounded-full
  card: 20,       // Card corners - rounded-card (same as 2xl)
  input: 12,      // Input fields - rounded-input (same as lg)
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

  // Premium shadow with Ocean Blue tint (web reference: shadow-premium)
  premium: Platform.OS === 'web'
    ? { boxShadow: '0 10px 30px -5px rgba(0, 78, 154, 0.4)' }
    : {
        shadowColor: '#004E9A',  // Ocean blue
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
      },

  // Card shadow (web reference: shadow-card)
  card: createShadow({ width: 0, height: 4 }, 0.1, 6, 4),

  // Card hover shadow (web reference: shadow-card-hover)
  cardHover: createShadow({ width: 0, height: 10 }, 0.15, 15, 8),

  // Soft shadow (web reference: shadow-soft)
  soft: createShadow({ width: 0, height: 2 }, 0.05, 8, 2),
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
