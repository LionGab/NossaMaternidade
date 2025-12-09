/**
 * Cotton Candy Tech Theme - iOS/Android Store Ready
 * Based on Nathália Valente Design System (Blue Version v12)
 *
 * Theme: Cotton Candy Tech (Pink & Blue)
 * Optimized for: App Store + Google Play
 */

// ============================================
// 🎨 COLOR PALETTE
// ============================================
export const colors = {
  // Primary Brand Colors
  primary: {
    pink: '#FF0080', // Brand Accent - Rosa Nath
    pinkDark: '#E6007A', // Pressed state
    pinkLight: '#FF4D9F', // Lighter variant
    blue: '#0070F3', // Trust & Action
    blueDark: '#0061D9', // Pressed state
    blueLight: '#00C6FF', // Gradient end
  },

  // Backgrounds
  background: {
    soft: '#FDF4F9', // App Background - Rosa suave
    white: '#FFFFFF',
    gradient: {
      cotton: ['#FFF0F5', '#F0F7FF'], // 180deg gradient
      pinkBlue: ['#FF4D9F', '#0070F3'], // Main tab button
      blueAction: ['#0070F3', '#00C6FF'],
    },
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E', // Green-500
    successLight: '#DCFCE7',
    warning: '#CA8A04', // Yellow-600
    warningLight: '#FEF3C7',
    error: '#EF4444', // Red-500
    errorLight: '#FEE2E2',
    info: '#0070F3',
    infoLight: '#DBEAFE',
  },

  // Category Colors
  categories: {
    diario: { bg: '#FCE7F3', text: '#EC4899', icon: '#EC4899' }, // Pink
    saude: { bg: '#DBEAFE', text: '#3B82F6', icon: '#3B82F6' }, // Blue
    dicas: { bg: '#FEF3C7', text: '#CA8A04', icon: '#CA8A04' }, // Yellow
    enxoval: { bg: '#F3E8FF', text: '#9333EA', icon: '#9333EA' }, // Purple
    alimentacao: { bg: '#DCFCE7', text: '#22C55E', icon: '#22C55E' }, // Green
    bemestar: { bg: '#F3E8FF', text: '#9D4EDD', icon: '#9D4EDD' }, // Purple
    treino: { bg: '#DBEAFE', text: '#0099FF', icon: '#0099FF' }, // Blue
    autocuidado: { bg: '#FFF0F5', text: '#FF4D8C', icon: '#FF4D8C' }, // Pink
  },

  // Neutral Colors
  neutral: {
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
  },

  // Glass Effect
  glass: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(255, 255, 255, 0.6)',
  },
} as const;

// ============================================
// 📝 TYPOGRAPHY
// ============================================
export const typography = {
  // Font Families (Google Fonts)
  fontFamily: {
    heading: 'Outfit', // Weights: 300-800
    body: 'Plus Jakarta Sans', // Weights: 400-700
    // Fallbacks for React Native
    headingNative: 'Outfit-Bold',
    bodyNative: 'PlusJakartaSans-Regular',
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Font Sizes (React Native scale)
  fontSize: {
    micro: 10, // Micro copy
    xs: 12, // Body small
    sm: 14, // Body text
    base: 16, // Body default
    lg: 18, // Section title
    xl: 20, // Subtitle
    '2xl': 24, // Display/Headers
    '3xl': 30, // Large headers
    '4xl': 36, // Hero text
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// ============================================
// 📐 SPACING (Múltiplos de 4px)
// ============================================
export const spacing = {
  0: 0,
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
} as const;

// ============================================
// 🔲 BORDER RADIUS
// ============================================
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20, // Small cards/buttons
  '3xl': 24, // Large cards
  full: 9999, // Avatars/Pills
} as const;

// ============================================
// 🌑 SHADOWS (iOS/Android optimized)
// ============================================
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
  // Colored shadows
  pink: {
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  blue: {
    shadowColor: '#0070F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// ============================================
// 🎯 COMPONENT STYLES
// ============================================
export const components = {
  // Cards
  card: {
    standard: {
      backgroundColor: colors.background.white,
      borderRadius: borderRadius['3xl'],
      borderWidth: 1,
      borderColor: colors.neutral[100],
      ...shadows.sm,
    },
    hero: {
      borderRadius: borderRadius['3xl'],
      overflow: 'hidden' as const,
      ...shadows.xl,
    },
    glass: {
      backgroundColor: colors.glass.background,
      borderWidth: 1,
      borderColor: colors.glass.border,
      borderRadius: borderRadius['3xl'],
    },
  },

  // Buttons
  button: {
    primary: {
      backgroundColor: colors.primary.pink,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      ...shadows.pink,
    },
    secondary: {
      backgroundColor: colors.primary.blue,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      ...shadows.blue,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary.pink,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
    },
    quickAction: {
      borderRadius: borderRadius['2xl'],
      padding: spacing[4],
    },
  },

  // Tab Bar (Bottom Navigation)
  tabBar: {
    container: {
      backgroundColor: colors.background.white,
      borderTopWidth: 1,
      borderTopColor: colors.neutral[100],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[6], // Safe area
    },
    mainButton: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.full,
      ...shadows.lg,
    },
    icon: {
      size: 22,
      activeColor: colors.primary.pink,
      inactiveColor: colors.neutral[300],
    },
  },

  // Input
  input: {
    container: {
      backgroundColor: colors.neutral[50],
      borderRadius: borderRadius['3xl'],
      borderWidth: 1,
      borderColor: colors.neutral[100],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    text: {
      fontSize: typography.fontSize.sm,
      color: colors.neutral[700],
    },
    placeholder: {
      color: colors.neutral[400],
    },
  },

  // Avatar
  avatar: {
    small: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
    },
    medium: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
    },
    large: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.full,
    },
    border: {
      borderWidth: 2,
      borderColor: '#FFB6C1', // Pink-200
    },
  },

  // Pills/Badges
  pill: {
    container: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: borderRadius.full,
    },
    text: {
      fontSize: typography.fontSize.micro,
      fontWeight: typography.fontWeight.bold,
      textTransform: 'uppercase' as const,
    },
  },
} as const;

// ============================================
// 📱 LAYOUT
// ============================================
export const layout = {
  // Page container (mobile optimized - max 428px)
  maxWidth: 428, // iPhone 14 Pro Max width
  padding: {
    page: spacing[6], // 24px
    section: spacing[4], // 16px
  },
  gap: {
    sm: spacing[2], // 8px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
  },
  // Safe areas
  safeArea: {
    top: 44, // iOS status bar
    bottom: 34, // iOS home indicator
  },
} as const;

// ============================================
// 🖼️ ASSETS (Images used in the app)
// ============================================
export const assets = {
  avatars: {
    nathia: 'https://i.imgur.com/oB9ewPG.jpg', // Pixel Art Avatar
    placeholder: 'https://ui-avatars.com/api/?name=NV&background=ffb6c1&color=fff&size=128',
  },
  headers: {
    cuidados: 'https://i.imgur.com/LF2PX1w.jpg', // Pixel Art header
    mundoDaNath: 'https://i.imgur.com/tNIrNIs.jpg',
  },
  content: {
    proposito: 'https://i.imgur.com/H74CErJ.jpg',
    africa: 'https://i.imgur.com/7gXBh78.png',
  },
  social: {
    real1: 'https://i.imgur.com/x0EOyNE.jpg',
    real2: 'https://i.imgur.com/2pF5jEl.jpg',
    real3: 'https://i.imgur.com/vmM9BVt.jpg',
    real4: 'https://i.imgur.com/XfI71Gh.jpg',
  },
} as const;

// ============================================
// 🎬 ANIMATIONS
// ============================================
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;

// ============================================
// 📲 NAVIGATION TABS
// ============================================
export const navigationTabs = [
  { id: 'inicio', label: 'Início', icon: 'Home' },
  { id: 'comunidade', label: 'Comunidade', icon: 'Users' },
  { id: 'nathia', label: 'NathIA', icon: 'MessageCircle', isMain: true },
  { id: 'conteudo', label: 'Conteúdo', icon: 'Sparkles' },
  { id: 'cuidados', label: 'Cuidados', icon: 'Heart' },
] as const;

// ============================================
// 🎨 QUICK ACTIONS (Home Grid)
// ============================================
export const quickActions = [
  { id: 'diario', icon: 'BookOpen', label: 'Diário', category: 'diario' },
  { id: 'saude', icon: 'Activity', label: 'Saúde', category: 'saude' },
  { id: 'dicas', icon: 'Sparkles', label: 'Dicas', category: 'dicas' },
  { id: 'enxoval', icon: 'ShoppingBag', label: 'Enxoval', category: 'enxoval' },
] as const;

// ============================================
// 🧩 CONTENT CATEGORIES
// ============================================
export const contentCategories = [
  {
    id: 'autocuidado',
    title: 'Autocuidado',
    count: '3 conteúdos',
    icon: 'Sparkles',
    color: '#FF4D8C',
    bgLight: '#FFF0F5',
  },
  {
    id: 'treino',
    title: 'Treino em Casa',
    count: '3 conteúdos',
    icon: 'Dumbbell',
    color: '#0099FF',
    bgLight: '#F0F7FF',
  },
  {
    id: 'alimentacao',
    title: 'Alimentação',
    count: '3 conteúdos',
    icon: 'Apple',
    color: '#00C853',
    bgLight: '#E8F5E9',
  },
  {
    id: 'bemestar',
    title: 'Bem-estar Emocional',
    count: '3 conteúdos',
    icon: 'Heart',
    color: '#9D4EDD',
    bgLight: '#F3E5F5',
  },
] as const;

// ============================================
// 🔧 HABITS (Self-care)
// ============================================
export const defaultHabits = [
  {
    id: 'banho',
    icon: 'Sparkles',
    title: 'Banho Premium',
    desc: 'Aquele banho que limpa até a alma 🧖‍♀️',
    category: 'autocuidado',
  },
  {
    id: 'skincare',
    icon: 'Heart',
    title: 'Skincare Completo',
    desc: 'Cuidar da pele do rosto e corpo ✨',
    category: 'autocuidado',
  },
  {
    id: 'agua',
    icon: 'Droplet',
    title: 'Beber água',
    desc: 'Hidratação é o segredo 💧',
    category: 'saude',
  },
  {
    id: 'afirmacoes',
    icon: 'Star',
    title: 'Palavras de Afirmação',
    desc: 'Fortaleça sua autoestima ❤️',
    category: 'bemestar',
  },
] as const;

// ============================================
// 💬 NATHIA QUICK REPLIES
// ============================================
export const nathiaQuickReplies = [
  { id: 'sono', emoji: '😴', text: 'Meu bebê não dorme' },
  { id: 'alimentacao', emoji: '🍼', text: 'Dica de alimentação' },
  { id: 'exausta', emoji: '😰', text: 'Estou exausta' },
  { id: 'colica', emoji: '🤔', text: 'O que fazer com cólica?' },
] as const;

// ============================================
// 📤 EXPORT DEFAULT
// ============================================
const cottonCandyTheme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  layout,
  assets,
  animations,
  navigationTabs,
  quickActions,
  contentCategories,
  defaultHabits,
  nathiaQuickReplies,
};

export default cottonCandyTheme;

// Type exports
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Components = typeof components;
export type CottonCandyTheme = typeof cottonCandyTheme;
