/**
 * Premium Design System - Nossa Maternidade
 * Mobile-First Design Tokens
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive breakpoints
export const BREAKPOINTS = {
  xs: 360,
  sm: 390,
  md: 428,
  lg: 768,
  xl: 1024,
} as const;

// Premium color palette with gradients
export const COLORS = {
  // Primary Brand Colors - Soft & Maternal
  primary: {
    50: '#F0F7FF',
    100: '#E0EFFF',
    200: '#BAD4FF',
    300: '#7CACFF',
    400: '#367FFF',
    500: '#0D5FFF', // Main brand color
    600: '#0047E6',
    700: '#0036B8',
    800: '#002D96',
    900: '#002979',
    gradient: ['#367FFF', '#0D5FFF', '#0047E6'],
  },

  // Secondary - Warm Pink (Maternal)
  secondary: {
    50: '#FFF0F6',
    100: '#FFE0EC',
    200: '#FFC2D9',
    300: '#FF94BA',
    400: '#FF5596',
    500: '#FF2576', // Main secondary
    600: '#E60A5B',
    700: '#C10048',
    800: '#A0003D',
    900: '#840036',
    gradient: ['#FF94BA', '#FF2576', '#E60A5B'],
  },

  // Neutral Grays - Modern & Clean
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

  // Semantic Colors
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#059669',
    gradient: ['#34D399', '#10B981', '#059669'],
  },

  warning: {
    light: '#FED7AA',
    main: '#F59E0B',
    dark: '#D97706',
    gradient: ['#FBBf24', '#F59E0B', '#D97706'],
  },

  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
    gradient: ['#F87171', '#EF4444', '#DC2626'],
  },

  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
    gradient: ['#60A5FA', '#3B82F6', '#2563EB'],
  },

  // Special Colors
  accent: {
    purple: '#8B5CF6',
    teal: '#14B8A6',
    orange: '#FB923C',
    pink: '#EC4899',
  },

  // Background variations
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      light: ['#FFFFFF', '#F0F7FF'],
      soft: ['#FFF0F6', '#F0F7FF'],
      premium: ['#E0EFFF', '#FFE0EC'],
    },
  },

  // Text colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#A3A3A3',
    inverse: '#FFFFFF',
    link: '#0D5FFF',
  },

  // Border colors
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A3A3A3',
    focus: '#0D5FFF',
    error: '#EF4444',
  },
} as const;

// Typography scale - Mobile optimized
export const TYPOGRAPHY = {
  // Font families
  fonts: {
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
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 42,
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
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Spacing scale - Touch-friendly
export const SPACING = {
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
  '36': 144,
  '40': 160,
} as const;

// Border radius - Smooth & Modern
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Helper para converter shadow props para boxShadow no web
const createShadowStyle = (
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    // Converter para CSS boxShadow no web
    const offsetX = shadowOffset.width;
    const offsetY = shadowOffset.height;
    const blur = shadowRadius;
    const spread = 0;
    const color = shadowColor || '#000';
    const opacity = shadowOpacity;
    
    // Converter cor hex para rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    const rgbaColor = hexToRgba(color, opacity);
    const boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgbaColor}`;
    
    return {
      boxShadow,
      // Manter props originais para compatibilidade com React Native
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  }
  
  // Em plataformas nativas, usar props originais
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

// Shadows - Elevation for depth (compatível com web)
export const SHADOWS = {
  none: {},
  sm: createShadowStyle('#000', { width: 0, height: 1 }, 0.05, 2, 1),
  md: createShadowStyle('#000', { width: 0, height: 2 }, 0.08, 4, 2),
  lg: createShadowStyle('#000', { width: 0, height: 4 }, 0.1, 8, 4),
  xl: createShadowStyle('#000', { width: 0, height: 8 }, 0.12, 16, 8),
  '2xl': createShadowStyle('#000', { width: 0, height: 12 }, 0.15, 24, 12),
  inner: createShadowStyle('#000', { width: 0, height: 2 }, 0.06, 3, -1),
} as const;

// Touch targets - Accessibility
export const TOUCH_TARGETS = {
  min: 44, // iOS minimum
  small: 32,
  medium: 44,
  large: 56,
  xl: 64,
} as const;

// Animations - Smooth & Natural
export const ANIMATIONS = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: [0.25, 0.46, 0.45, 0.94],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

// Responsive helpers
export const isSmallDevice = SCREEN_WIDTH < BREAKPOINTS.sm;
export const isMediumDevice = SCREEN_WIDTH >= BREAKPOINTS.sm && SCREEN_WIDTH < BREAKPOINTS.md;
export const isLargeDevice = SCREEN_WIDTH >= BREAKPOINTS.md;
export const isTablet = SCREEN_WIDTH >= BREAKPOINTS.lg;

// Safe areas
export const SAFE_AREA = {
  top: Platform.select({ ios: 44, android: 24, default: 24 }),
  bottom: Platform.select({ ios: 34, android: 0, default: 0 }),
  horizontal: 16,
};

// Icon sizes
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export default {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  touchTargets: TOUCH_TARGETS,
  animations: ANIMATIONS,
  zIndex: Z_INDEX,
  icons: ICON_SIZES,
  safeArea: SAFE_AREA,
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  breakpoints: BREAKPOINTS,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
};