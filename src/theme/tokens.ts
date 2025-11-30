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
  // Primary - Rosa Maternal Quente (Flo-inspired + Nathália)
  primary: {
    50: '#FFF1F3',    // Lightest pink
    100: '#FFE4E9',   // Very light pink
    200: '#FFCCD7',   // Soft pink
    300: '#FFA8BC',   // Light coral pink
    400: '#FF7A96',   // Rosa Nathália MAIN ⭐ (acolhimento, maternidade)
    500: '#FF6583',   // Mid pink
    600: '#EC5975',   // Pink maternal (warm)
    700: '#D94560',   // Deep pink (tom Nathália)
    800: '#B93A50',   // Darker pink
    900: '#8B2D3E',   // Darkest pink
  },

  // Secondary - Roxo Espiritual (Flo-style)
  secondary: {
    50: '#F5F3FF',    // Lightest purple
    100: '#EDE9FE',   // Very light purple
    200: '#DDD6FE',   // Soft purple
    300: '#C4B5FD',   // Light purple
    400: '#A78BFA',   // Roxo Flo-like MAIN ⭐ (serenidade, espiritualidade)
    500: '#8B5CF6',   // Mid purple
    600: '#7C3AED',   // Deep purple
    700: '#6D28D9',   // Darker purple
    800: '#5B21B6',   // Almost dark
    900: '#4C1D95',   // Darkest purple
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

  // Accent colors (GeminiApp-inspired semantic colors)
  accent: {
    purple: '#8B5CF6',
    teal: '#14B8A6',
    orange: '#FB923C',
    pink: '#EC4899',
    green: '#10B981',
    blue: '#60A5FA',       // Light ocean (for dark mode accents)
    // ⭐ GeminiApp Semantic Colors
    ocean: '#0EA5E9',      // Sky 500 - primary action, trust
    oceanDeep: '#0369A1',  // Sky 700 - darker accent
    oceanLight: '#E0F2FE', // Sky 100 - light backgrounds
    coral: '#F43F5E',      // Rose 500 - emotional, likes, errors
    coralLight: '#FFE4E6', // Rose 100 - light coral bg
    mint: '#10B981',       // Emerald 500 - success, completion
    mintLight: '#D1FAE5',  // Emerald 100 - light mint bg
    sunshine: '#F59E0B',   // Amber 500 - warning, premium, highlights
    sunshineLight: '#FEF3C7', // Amber 100 - light sunshine bg
    gold: '#FFA500',       // Gold (lifestyle Nathalia)
    indigo: '#6366F1',     // Indigo 500 - thinking mode
  },

  // Overlay System - For semi-transparent backgrounds
  overlay: {
    light: 'rgba(255, 255, 255, 0.25)',     // Light overlay for dark backgrounds
    medium: 'rgba(0, 0, 0, 0.4)',           // Medium overlay
    dark: 'rgba(0, 0, 0, 0.6)',             // Dark overlay
    heavy: 'rgba(0, 0, 0, 0.7)',            // Heavy overlay
    backdrop: 'rgba(0, 0, 0, 0.5)',         // Modal backdrop
    card: 'rgba(255, 255, 255, 0.1)',       // Card overlay for dark mode
    // ⭐ NOVOS: Overlays inspirados em Clean Slate e Catppuccin
    glass: 'rgba(255, 255, 255, 0.08)',      // Glass effect suave
    glassStrong: 'rgba(255, 255, 255, 0.12)', // Glass effect forte
    darkGlass: 'rgba(0, 0, 0, 0.3)',         // Glass dark mode
    blur: 'rgba(0, 0, 0, 0.45)',              // Blur backdrop
    highlight: 'rgba(255, 122, 150, 0.15)',  // Rosa highlight overlay
  },

  // Mood Colors - Emotional tracking (Lofee-inspired)
  mood: {
    happy: '#FFD93D',       // Yellow - Happy/Joyful
    calm: '#6BCB77',        // Green - Calm/Peaceful
    sad: '#4D96FF',         // Blue - Sad
    anxious: '#FF6B6B',     // Red - Anxious/Worried
    angry: '#FF4757',       // Dark Red - Angry
    tired: '#A29BFE',       // Purple - Tired
    energetic: '#FF9FF3',   // Pink - Energetic
    loved: '#FF6B9D',       // Rose - Loved
  },

  // Cycle Colors - Period/Fertility tracking (Lofee-inspired)
  cycle: {
    period: {
      main: '#FF6B9D',
      gradient: ['#FF6B9D', '#FF8A80'] as const,
    },
    fertile: {
      main: '#B794F6',
      gradient: ['#9C7CF4', '#B794F6'] as const,
    },
    ovulation: {
      main: '#7C4DFF',
      gradient: ['#7C4DFF', '#B388FF'] as const,
    },
    luteal: {
      main: '#FF80AB',
      gradient: ['#FF80AB', '#FF4081'] as const,
    },
  },

  // Category Colors - Content categories (Lofee-inspired)
  category: {
    dailyWoman: ['#FF6B9D', '#FF8A80'] as const,
    moodBooster: ['#7C4DFF', '#B388FF'] as const,
    spreadHappiness: ['#FFD93D', '#FF9500'] as const,
    healthTips: ['#6BCB77', '#4ECDC4'] as const,
    selfCare: ['#A29BFE', '#6C5CE7'] as const,
    pregnancy: ['#FF9FF3', '#F368E0'] as const,
    postpartum: ['#54A0FF', '#5F27CD'] as const,
    nutrition: ['#1DD1A1', '#10AC84'] as const,
  },

  // Notification Colors - Alert types
  notification: {
    ovulation: { main: '#7C4DFF', bg: '#7C4DFF20' },
    period: { main: '#FF6B9D', bg: '#FF6B9D20' },
    pregnancy: { main: '#FF9FF3', bg: '#FF9FF320' },
    reminder: { main: '#FFD93D', bg: '#FFD93D20' },
    mood: { main: '#FF6B6B', bg: '#FF6B6B20' },
    sleep: { main: '#A29BFE', bg: '#A29BFE20' },
    water: { main: '#54A0FF', bg: '#54A0FF20' },
    medicine: { main: '#6BCB77', bg: '#6BCB7720' },
    appointment: { main: '#FF9500', bg: '#FF950020' },
    general: { main: '#636E72', bg: '#636E7220' },
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
      primary: ['#FFE4E9', '#FFFFFF'],   // Light pink → Snow ⭐ ATUALIZADO
      soft: ['#FFF1F3', '#F5F3FF'],      // Lightest pink → Lightest purple ⭐ ATUALIZADO
      warm: ['#FFFFFF', '#F1F5F9'],      // Snow → Cloud
    },
  },

  // Text - Charcoal/Slate/Silver system (web reference)
  text: {
    primary: '#0F172A',       // Charcoal (web reference) - alto contraste
    secondary: '#334155',     // Slate (web reference)
    tertiary: '#475569',      // Dark slate blue - WCAG AAA compliant (8.6:1 on white) ⭐ CORRIGIDO
    disabled: '#94A3B8',      // Lighter silver
    placeholder: '#9CA3AF',   // Placeholder text
    inverse: '#FFFFFF',       // Texto em fundos escuros
    link: '#FF7A96',          // Rosa Nathália (primary) ⭐ ATUALIZADO
    success: '#236B62',       // Mint (web reference)
    warning: '#F59E0B',       // Sunshine (web reference)
    error: '#EF4444',         // Error red ⭐ ATUALIZADO (não mais coral)
    info: '#2563EB',
  },

  // Borders
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: '#CBD5E1',        // Visible border (web reference)
    dark: 'rgba(0, 0, 0, 0.16)',
    focus: '#FF7A96',         // Rosa Nathália (primary) ⭐ ATUALIZADO
    error: '#EF4444',         // Error red ⭐ ATUALIZADO
    success: '#236B62',       // Mint
  },

  // Primary - Rosa Maternal ⭐ ATUALIZADO
  primary: {
    main: ColorTokens.primary[400],    // #FF7A96 Rosa Nathália
    light: ColorTokens.primary[100],   // #FFE4E9 Very light pink
    dark: ColorTokens.primary[800],    // #B93A50 Darker pink
    gradient: ['#FF7A96', '#FF6583', '#EC5975'],  // Rosa gradient
  },

  // Secondary - Roxo Espiritual ⭐ ATUALIZADO
  secondary: {
    main: ColorTokens.secondary[400],  // #A78BFA Roxo Flo-like
    light: ColorTokens.secondary[100], // #EDE9FE Very light purple
    dark: ColorTokens.secondary[600],  // #7C3AED Deep purple
    gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'],  // Roxo gradient
  },

  // Status colors - aligned with web reference
  status: {
    success: ColorTokens.mint[400],    // #236B62 Mint
    warning: ColorTokens.warning[500], // #F59E0B Sunshine
    error: ColorTokens.error[500],     // #EF4444 Error red ⭐ ATUALIZADO
    info: ColorTokens.info[600],       // #2563EB
  },

  // Gradients
  gradients: {
    success: ['#5EEAD4', '#236B62', '#0F5247'],  // Mint gradient
    warning: ['#FCD34D', '#F59E0B', '#D97706'],  // Sunshine gradient
    error: ['#FCA5A5', '#EF4444', '#DC2626'],    // Error gradient ⭐ ATUALIZADO
    info: ['#60A5FA', '#3B82F6', '#2563EB'],
    maternal: ['#FF7A96', '#FF6583', '#EC5975'], // Maternal gradient (Rosa)
    spiritual: ['#A78BFA', '#8B5CF6', '#7C3AED'], // Spiritual gradient (Roxo)
    // ⭐ NOVOS: Gradientes Azuis (preferência Nathália)
    ocean: ['#60A5FA', '#3B82F6', '#2563EB'] as const,       // Ocean blue gradient
    maternalBlue: ['#FFE4E9', '#BFDBFE', '#60A5FA'] as const, // Rosa → Azul (transição suave)
    serenity: ['#93C5FD', '#FFA8BC'] as const,               // Azul → Rosa suave
    trust: ['#60A5FA', '#3B82F6'] as const,                  // Azul confiança
  },
};

/**
 * Semantic color mappings para Dark Mode (Maternal Dark Theme) ⭐ ATUALIZADO
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
      maternal: ['#2D1B1F', '#1E293B', '#334155'],  // ⭐ NOVO: Warm dark gradient
    },
  },

  // Text - Off-white/Light grey system (web reference)
  // ⭐ MELHORADO: Melhor contraste WCAG AAA (inspirado em Catppuccin)
  text: {
    primary: '#FFFFFF',       // Branco puro (melhor contraste - WCAG AAA 15.8:1)
    secondary: '#E2E8F0',     // Light grey (mais legível)
    tertiary: '#A8B4C4',      // Mid grey (hierarquia clara)
    disabled: '#64748B',      // Silver (web reference)
    placeholder: '#94A3B8',   // Mid grey
    inverse: '#0F172A',       // Charcoal (web reference)
    link: '#FFB5C9',          // Light pink ⭐ MELHORADO (mais suave)
    success: '#4ADE80',       // Light mint
    warning: '#FCD34D',       // Light sunshine
    error: '#F87171',         // Light red
    info: '#60A5FA',          // Light ocean
  },

  // Borders - (web reference)
  border: {
    light: 'rgba(148, 163, 184, 0.1)',
    medium: '#475569',        // Mid-slate border (web reference)
    dark: 'rgba(148, 163, 184, 0.3)',
    focus: '#FFB5C9',         // Light pink ⭐ MELHORADO (mais suave)
    error: '#F87171',         // Light red
    success: '#4ADE80',       // Light mint
  },

  // Primary - Light Pink ⭐ MELHORADO (tons mais suaves, inspirado em Catppuccin)
  primary: {
    main: '#FFB5C9',          // Rosa mais suave (melhor harmonia e contraste)
    light: '#FFD4E0',         // Rosa muito claro (melhor legibilidade)
    dark: '#FF8FA3',          // Rosa médio (hover states)
    gradient: ['#FFD4E0', '#FFB5C9', '#FF8FA3'],  // Gradiente suave e acolhedor
  },

  // Secondary - Light Purple ⭐ ATUALIZADO (não mais coral)
  secondary: {
    main: '#C4B5FD',          // Light purple (dark mode friendly)
    light: '#DDD6FE',         // Lighter purple
    dark: '#A78BFA',          // Mid purple
    gradient: ['#C4B5FD', '#A78BFA', '#8B5CF6'],  // Light purple gradient
  },

  // Status colors - lighter for dark mode
  status: {
    success: '#4ADE80',       // Light mint
    warning: '#FCD34D',       // Light sunshine
    error: '#F87171',         // Light red ⭐ ATUALIZADO
    info: '#60A5FA',          // Light ocean
  },

  // Gradients - brighter for dark mode
  gradients: {
    success: ['#86EFAC', '#4ADE80', '#22C55E'],  // Light mint gradient
    warning: ['#FDE68A', '#FCD34D', '#FBBF24'],  // Light sunshine gradient
    error: ['#FCA5A5', '#F87171', '#EF4444'],    // Light red gradient ⭐ ATUALIZADO
    info: ['#93C5FD', '#60A5FA', '#3B82F6'],     // Light ocean gradient
    maternal: ['#FFD4E0', '#FFB5C9', '#FF8FA3'], // ⭐ MELHORADO: Maternal gradient (tons mais suaves)
    spiritual: ['#C4B5FD', '#A78BFA', '#8B5CF6'], // ⭐ NOVO: Spiritual gradient
    // ⭐ NOVO: Warm gradient para dark mode (inspirado nas imagens - amarelo/laranja acolhedor)
    warm: ['#FFD4A3', '#FFB980', '#FFA366'] as const,  // Warm gradient (hero banner dark mode)
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
    'base': 24,  // alias for md
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
// 📝 SEMANTIC TEXT STYLES (Flo-inspired + Material Design 3)
// ======================

/**
 * Semantic Text Styles - Use these instead of raw Typography.sizes
 *
 * Inspirado em:
 * - Flo app (period tracker)
 * - Material Design 3 (Google)
 * - Apple Human Interface Guidelines
 *
 * @example
 * // ❌ ANTES (hardcoded, inconsistente)
 * <Text style={{ fontSize: 28, fontWeight: '700', lineHeight: 36 }}>
 *   Olá, mãe!
 * </Text>
 *
 * // ✅ DEPOIS (semântico, consistente)
 * import { TextStyles } from '@/theme/tokens';
 * <Text style={TextStyles.displayMedium}>
 *   Olá, mãe!
 * </Text>
 */
export const TextStyles = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DISPLAYS (Títulos de página, hero headlines)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  displayLarge: {
    fontSize: Typography.sizes['4xl'],      // 32
    fontWeight: Typography.weights.bold,    // 700
    lineHeight: Typography.lineHeights['4xl'], // 40
    letterSpacing: -0.25,
  } as const,

  displayMedium: {
    fontSize: Typography.sizes['3xl'],      // 28
    fontWeight: Typography.weights.bold,    // 700
    lineHeight: Typography.lineHeights['3xl'], // 36
    letterSpacing: 0,
  } as const,

  displaySmall: {
    fontSize: Typography.sizes['2xl'],      // 24
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights['2xl'], // 32
    letterSpacing: 0,
  } as const,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TITLES (Card headers, section titles)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  titleLarge: {
    fontSize: Typography.sizes.xl,          // 20
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.xl,  // 28
    letterSpacing: 0,
  } as const,

  titleMedium: {
    fontSize: Typography.sizes.lg,          // 18
    fontWeight: Typography.weights.medium,  // 500
    lineHeight: Typography.lineHeights.lg,  // 26
    letterSpacing: 0.15,
  } as const,

  titleSmall: {
    fontSize: Typography.sizes.md,          // 16
    fontWeight: Typography.weights.medium,  // 500
    lineHeight: Typography.lineHeights.md,  // 24
    letterSpacing: 0.1,
  } as const,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BODY TEXT (Paragraph text, descriptions)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  bodyLarge: {
    fontSize: Typography.sizes.md,          // 16
    fontWeight: Typography.weights.regular, // 400
    lineHeight: Typography.lineHeights.md,  // 24
    letterSpacing: 0.5,
  } as const,

  bodyMedium: {
    fontSize: Typography.sizes.sm,          // 14
    fontWeight: Typography.weights.regular, // 400
    lineHeight: Typography.lineHeights.sm,  // 20
    letterSpacing: 0.25,
  } as const,

  bodySmall: {
    fontSize: Typography.sizes.xs,          // 12
    fontWeight: Typography.weights.regular, // 400
    lineHeight: Typography.lineHeights.xs,  // 18
    letterSpacing: 0.4,
  } as const,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LABELS (Buttons, chips, form labels, captions)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  labelLarge: {
    fontSize: Typography.sizes.sm,          // 14
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.sm,  // 20
    letterSpacing: 0.1,
    textTransform: 'none' as const,
  } as const,

  labelMedium: {
    fontSize: Typography.sizes.xs,          // 12
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.xs,  // 18
    letterSpacing: 0.5,
    textTransform: 'none' as const,
  } as const,

  labelSmall: {
    fontSize: 11,                            // 11
    fontWeight: Typography.weights.medium,  // 500
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,    // Flo usa uppercase em tiny labels
  } as const,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ALIASES (Para uso comum, backwards compatibility)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  h1: {
    fontSize: Typography.sizes['5xl'],      // 40
    fontWeight: Typography.weights.extrabold, // 800
    lineHeight: Typography.lineHeights['5xl'], // 44
    letterSpacing: -1,
  } as const,

  h2: {
    fontSize: Typography.sizes['4xl'],       // 32
    fontWeight: Typography.weights.bold,     // 700
    lineHeight: Typography.lineHeights['4xl'], // 40
    letterSpacing: -0.5,
  } as const,

  h3: {
    fontSize: Typography.sizes['3xl'],       // 28
    fontWeight: Typography.weights.bold,     // 700
    lineHeight: Typography.lineHeights['3xl'], // 36
    letterSpacing: 0,
  } as const,

  h4: {
    fontSize: Typography.sizes['2xl'],       // 24
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights['2xl'], // 32
  } as const,

  h5: {
    fontSize: Typography.sizes.lg,           // 18
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.lg,   // 26
  } as const,

  h6: {
    fontSize: Typography.sizes.base,         // 16
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.md,   // 24
  } as const,

  body: {
    fontSize: Typography.sizes.base,         // 16
    fontWeight: Typography.weights.regular,  // 400
    lineHeight: Typography.lineHeights.md,   // 24
  } as const,

  caption: {
    fontSize: Typography.sizes.xs,           // 12
    fontWeight: Typography.weights.medium,   // 500
    lineHeight: Typography.lineHeights.xs,   // 18
  } as const,

  button: {
    fontSize: Typography.sizes.base,         // 16
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.md,   // 24
  } as const,

  buttonSmall: {
    fontSize: Typography.sizes.sm,           // 14
    fontWeight: Typography.weights.semibold, // 600
    lineHeight: Typography.lineHeights.sm,   // 20
  } as const,
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
// 😊 EMOJI SIZES
// ======================

export const EmojiSizes = {
  xs: 20,
  sm: 28,
  md: 32,
  lg: 44,  // Recommendation: WCAG AAA touch target minimum
  xl: 56,
} as const;

// ======================
// 💧 OPACITY VALUES
// ======================

export const Opacity = {
  disabled: 0.5,
  hover: 0.75,
  selected: 0.9,
  overlay: 0.12,  // For background overlays (1F in hex)
  full: 1,
} as const;

// ======================
// 🌫️ BLUR VALUES (Flo-inspired glassmorphism)
// ======================

export const Blur = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  backdrop: 10,   // For modal/sheet backdrops
  glass: 20,      // For glassmorphism cards
} as const;

// ======================
// 🌈 EMOTION GRADIENTS (Flo-inspired)
// ======================

export const EmotionGradients = {
  calm: [ColorTokens.primary[400], ColorTokens.primary[100]], // Rosa maternal (main → light)
  warm: [ColorTokens.primary[300], '#FFC4D9'], // Light pink → Warm pink
  energetic: [ColorTokens.warning[400], ColorTokens.warning[500]], // Yellow → Orange
  peaceful: [ColorTokens.success[400], ColorTokens.success[500]], // Green → Mint
  safe: [ColorTokens.primary[400], ColorTokens.secondary[400]], // Rosa → Roxo (main → main)
  spiritual: [ColorTokens.secondary[400], ColorTokens.secondary[600]], // Roxo gradient
  joyful: [ColorTokens.primary[300], ColorTokens.warning[400]], // Pink → Yellow
  // ⭐ NOVOS: Gradientes com Azul (preferência Nathália)
  trust: [ColorTokens.info[400], ColorTokens.info[600]], // Azul confiança
  serenity: [ColorTokens.info[300], ColorTokens.primary[200]], // Azul → Rosa suave
  ocean: [ColorTokens.info[400], ColorTokens.info[500]], // Ocean blue
  hopeful: [ColorTokens.info[300], ColorTokens.success[400]], // Azul → Verde esperança
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
  textStyles: TextStyles,  // ⭐ NOVO: Semantic text styles (Flo-inspired)
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  animations: Animations,
  touchTargets: TouchTargets,
  icons: IconSizes,
  iconSizes: IconSizes, // Alias for compatibility
  emojiSizes: EmojiSizes, // ⭐ NOVO: Emoji sizes
  opacity: Opacity, // ⭐ NOVO: Opacity values
  blur: Blur, // ⭐ NOVO: Blur values (Flo-inspired glassmorphism)
  emotionGradients: EmotionGradients, // ⭐ NOVO: Emotion gradients (Flo-inspired)
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
