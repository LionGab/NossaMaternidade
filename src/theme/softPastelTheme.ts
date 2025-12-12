/**
 * Soft Pastel Theme - Nossa Maternidade
 * App Store / Google Play Ready
 * TikTok Aesthetic + Maternal Maturity
 *
 * Based on Extract2 Design Reference
 * @version 1.0.0
 */

// ⭐ Soft Pastel Color Palette
export const SoftPastelColors = {
  // Primary Colors
  pink: '#FFB8D9',      // Soft pastel pink (main brand)
  blue: '#B8D4FF',      // Soft pastel blue (trust)
  purple: '#D9B8FF',    // Soft pastel purple (secondary)

  // Accent Colors
  peach: '#FFD6A5',     // Soft peach (warm accent)
  mint: '#A8E6CF',      // Soft mint (success/wellness)
  coral: '#FFAAA5',     // Soft coral (alerts)
  sky: '#A5C9FF',       // Soft sky blue (info)
} as const;

// Pink Scale
export const PinkScale = {
  50: '#FFF8FC',
  100: '#FFF0F7',
  200: '#FFE5F1',
  300: '#FFCCE5',
  400: '#FFB8D9',  // Main pastel pink ⭐
  500: '#FF9DC5',
  600: '#FF7AAD',
} as const;

// Blue Scale
export const BlueScale = {
  50: '#F0F7FF',
  100: '#E0EFFF',
  200: '#C9E2FF',
  300: '#B8D4FF',  // Main pastel blue ⭐
  400: '#93C5FD',
  500: '#60A5FA',
} as const;

// Purple Scale
export const PurpleScale = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#E4DBFF',
  300: '#D9B8FF',  // Main pastel purple ⭐
  400: '#C4A5FF',
  500: '#A78BFA',
} as const;

// Neutral Scale (warm tint)
export const NeutralScale = {
  50: '#FFF8FC',
  100: '#FFF0F7',
  200: '#FFE5F1',
  300: '#FFCCE5',
  400: '#C4A8B0',
  500: '#9B8A8F',
  600: '#7A696E',
  700: '#5A4F52',
  800: '#3E3638',
  900: '#2A2225',
} as const;

// Backgrounds
export const SoftPastelBackgrounds = {
  canvas: '#FFFBFD',
  card: '#FFFFFF',
  soft: '#FFF8FC',
  gradientStart: '#FFB8D9',
  gradientMid: '#D9B8FF',
  gradientEnd: '#B8D4FF',
} as const;

// Gradients (for LinearGradient)
export const SoftPastelGradients = {
  primary: ['#FFB8D9', '#D9B8FF'] as const,
  secondary: ['#B8D4FF', '#D4E8FF'] as const,
  warm: ['#FFD6A5', '#FFE5C9'] as const,
  header: ['#FFB8D9', '#D9B8FF', '#B8D4FF'] as const,
  hero: ['#FFB8D9', '#FFCCE5', '#FFE5F1'] as const,
  blue: ['#B8D4FF', '#D4E8FF'] as const,
  peach: ['#FFD6A5', '#FFE5C9'] as const,
} as const;

// Habit Category Colors (Extract2 Reference)
export const HabitColors = {
  banhoPremium: { bg: '#E0EFFF', text: '#3B82F6', icon: 'sparkles' },
  skincare: { bg: '#FCE7F3', text: '#EC4899', icon: 'heart' },
  beberAgua: { bg: '#E0F7FA', text: '#06B6D4', icon: 'droplet' },
  afirmacao: { bg: '#FEF3C7', text: '#F59E0B', icon: 'message-circle' },
  cafeDaManha: { bg: '#FFEDD5', text: '#F97316', icon: 'coffee' },
  cuidarCasa: { bg: '#D1FAE5', text: '#10B981', icon: 'home' },
  lookDoDia: { bg: '#F3E8FF', text: '#9333EA', icon: 'shirt' },
  treino: { bg: '#FFE4E6', text: '#F43F5E', icon: 'activity' },
} as const;

// Tab Bar Colors
export const TabBarColors = {
  active: '#EC4899',
  inactive: '#9B8A8F',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'rgba(255, 184, 217, 0.3)',
} as const;

// Shadow Colors
export const SoftPastelShadows = {
  pink: 'rgba(255, 184, 217, 0.3)',
  purple: 'rgba(217, 184, 255, 0.3)',
  blue: 'rgba(184, 212, 255, 0.3)',
  default: 'rgba(0, 0, 0, 0.1)',
} as const;

// Story Ring Colors (from Extract2)
export const StoryRingColors = {
  pinkPurple: ['#FFB8D9', '#D9B8FF'] as const,
  blueCyan: ['#B8D4FF', '#A8E6CF'] as const,
  pinkOrange: ['#FFB8D9', '#FFD6A5'] as const,
  purpleIndigo: ['#D9B8FF', '#A78BFA'] as const,
  greenEmerald: ['#A8E6CF', '#6BCB77'] as const,
} as const;

// CSS Variables (for web/NativeWind)
export const SoftPastelCSSVars = {
  '--primary-pink': '#FFB8D9',
  '--primary-blue': '#B8D4FF',
  '--primary-purple': '#D9B8FF',
  '--accent-peach': '#FFD6A5',
  '--accent-mint': '#A8E6CF',
} as const;

// Typography (Extract2 Reference)
export const SoftPastelTypography = {
  fontHeading: 'Outfit',
  fontBody: 'Plus Jakarta Sans',
  // Fallbacks for React Native
  fontHeadingFallback: 'System',
  fontBodyFallback: 'System',
} as const;

// Complete Theme Export
export const SoftPastelTheme = {
  colors: SoftPastelColors,
  pink: PinkScale,
  blue: BlueScale,
  purple: PurpleScale,
  neutral: NeutralScale,
  backgrounds: SoftPastelBackgrounds,
  gradients: SoftPastelGradients,
  habits: HabitColors,
  tabBar: TabBarColors,
  shadows: SoftPastelShadows,
  storyRings: StoryRingColors,
  cssVars: SoftPastelCSSVars,
  typography: SoftPastelTypography,
} as const;

export default SoftPastelTheme;
