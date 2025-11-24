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

// Re-export legacy constants for gradual migration
export { Colors, LightColors, DarkColors } from '../constants/Colors';
export {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  TOUCH_TARGETS,
  ANIMATIONS,
  ICON_SIZES,
  Z_INDEX,
  BREAKPOINTS,
  SAFE_AREA,
} from '../constants/Theme';
