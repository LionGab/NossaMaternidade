/**
 * Theme System - Nossa Maternidade
 * Exportações centralizadas do Design System
 */

// Tokens
export {
  // Color tokens
  ColorTokens,
  LightTheme,
  DarkTheme,

  // Typography
  Typography,

  // Spacing & Layout
  Spacing,
  Radius,
  Shadows,

  // Animations
  Animations,

  // Sizes
  TouchTargets,
  IconSizes,

  // Layout
  ZIndex,
  Breakpoints,
  SafeArea,

  // Responsive helpers
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,

  // Default export
  Tokens,
  default as Theme,
} from './tokens';

// Context & Hooks
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useIsDark,
  useThemedStyles,
  type ThemeMode,
  type ActiveTheme,
  type ThemeColors,
  type ThemeContextValue,
} from './ThemeContext';

// Re-export legacy Colors aliases from tokens for backwards compatibility
// TODO: Remove after full migration to useTheme() hook
import { ColorTokens, LightTheme, DarkTheme } from './tokens';

/**
 * Legacy Colors export for backwards compatibility
 * @deprecated Use useTheme() hook and colors from ThemeContext instead
 */
export const Colors = {
  brand: {
    blue: ColorTokens.primary[400],
    lightBlue: ColorTokens.primary[100],
    warm: '#F8F9FA',
    dark: '#5D4E4B',
    pink: ColorTokens.secondary[400],
  },
  background: {
    canvas: DarkTheme.background.canvas,
    card: DarkTheme.background.card,
    sleep: '#111827',
    pause: DarkTheme.background.elevated,
    light: LightTheme.background.canvas,
    dark: DarkTheme.background.canvas,
    tab: DarkTheme.background.canvas,
  },
  text: {
    primary: DarkTheme.text.primary,
    secondary: DarkTheme.text.secondary,
    tertiary: DarkTheme.text.tertiary,
    muted: DarkTheme.text.tertiary,
    dark: LightTheme.text.primary,
  },
  primary: {
    main: ColorTokens.primary[400],
    light: ColorTokens.primary[100],
    dark: ColorTokens.primary[700],
    hero: ColorTokens.primary[500],
  },
  accent: {
    green: ColorTokens.success[500],
    orange: ColorTokens.warning[500],
    pink: ColorTokens.secondary[400],
    blue: ColorTokens.primary[400],
  },
  border: {
    light: LightTheme.border.light,
    medium: LightTheme.border.medium,
    dark: DarkTheme.border.light,
    subtle: 'rgba(255, 255, 255, 0.05)',
  },
  status: {
    success: ColorTokens.success[500],
    warning: ColorTokens.warning[500],
    error: ColorTokens.error[500],
    info: ColorTokens.info[500],
  },
  progress: {
    active: ColorTokens.primary[400],
    inactive: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

/**
 * @deprecated Use useTheme() with isDark check instead
 */
export const LightColors = {
  background: LightTheme.background,
  text: LightTheme.text,
  primary: LightTheme.primary,
  border: LightTheme.border,
} as const;

/**
 * @deprecated Use useTheme() with isDark check instead
 */
export const DarkColors = {
  background: DarkTheme.background,
  text: DarkTheme.text,
  primary: DarkTheme.primary,
  border: DarkTheme.border,
} as const;
