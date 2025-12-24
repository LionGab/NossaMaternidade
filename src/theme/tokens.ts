/**
 * Design Tokens 2025 - Nossa Maternidade
 * "Calm FemTech" - Azul + Rosa Híbrido
 *
 * FONTE ÚNICA DE VERDADE para cores, tipografia, espaçamento.
 *
 * Princípios:
 * - Azul domina superfícies e estrutura (calma, confiança, saúde)
 * - Rosa aparece pontualmente (CTAs, destaques, "momentos de alegria")
 * - Baixo estímulo visual (WCAG AAA por padrão)
 * - Accessibility-first: 44pt tap targets, contraste 4.5:1+
 *
 * Hierarquia:
 * - brand.primary = Azul pastel (base)
 * - brand.accent = Rosa vibrante (CTAs, warmth)
 * - brand.secondary = Lilás suave (apoio)
 *
 * @see https://developer.apple.com/design/human-interface-guidelines
 * @see https://m3.material.io
 */

// ===========================================
// BRAND TOKENS - Paleta Híbrida Azul + Rosa
// ===========================================

export const brand = {
  /**
   * Primary: Azul Pastel Suave
   * - Transmite: calma, confiança, saúde, baixo estímulo
   * - Uso: superfícies, navegação, estrutura, elementos principais
   */
  primary: {
    50: "#F7FBFD", // Background principal
    100: "#E8F3F9", // Highlights, cards
    200: "#DCE9F1", // Border subtle
    300: "#B4D7E8", // Hover states
    400: "#96C7DE", // Active elements
    500: "#7DB9D5", // Principal - elementos destacados
    600: "#5BA3C7", // CTA secundário
    700: "#4488AB", // Links, ícones
    800: "#376E8C", // Textos sobre claro
    900: "#2B576D", // Headings
  },

  /**
   * Accent: Rosa Vibrante
   * - Transmite: calor humano, cuidado, afeto, energia
   * - Uso: CTAs principais, badges especiais, "momentos de alegria"
   * - REGRA: usar pontualmente (máx 10-15% da tela)
   */
  accent: {
    50: "#FFF1F5", // Background accent suave
    100: "#FFE4EC", // Highlight rosa
    200: "#FECDD6", // Border rosa
    300: "#FDA4B8", // Hover
    400: "#FB7190", // Active
    500: "#F4258C", // CTA PRINCIPAL - destaque máximo
    600: "#DB1F7D", // CTA pressed
    700: "#B8196A", // Links rosa
    800: "#961456", // Text accent
    900: "#7A1047", // Heading accent (raro)
  },

  /**
   * Secondary: Lilás/Roxo Suave
   * - Transmite: serenidade, introspecção, bem-estar
   * - Uso: elementos secundários, tags, badges, meditação
   */
  secondary: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7", // Principal
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },

  /**
   * Teal: Accent Secundário
   * - Transmite: saúde, natureza, bem-estar físico
   * - Uso: indicadores de saúde, progresso, badges especiais
   */
  teal: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
} as const;

// ===========================================
// SURFACE TOKENS - Superfícies e Backgrounds
// ===========================================

export const surface = {
  light: {
    /** Base: azul clarinho (nunca branco puro) */
    base: "#F7FBFD",
    /** Cards: branco puro */
    card: "#FFFFFF",
    /** Elevated: cards com elevação */
    elevated: "#FFFFFF",
    /** Tertiary: separadores, dividers */
    tertiary: "#EDF4F8",
    /** Overlay: modais, sheets */
    overlay: "rgba(0, 0, 0, 0.5)",
    /** Glass: elementos com blur */
    glass: "rgba(247, 251, 253, 0.85)",
    /** Card com transparência */
    cardAlpha: "rgba(255, 255, 255, 0.96)",
  },
  dark: {
    /** Base: azul muito escuro (não preto puro - OLED friendly) */
    base: "#0F1419",
    /** Cards: elevação 1 */
    card: "#1A2027",
    /** Elevated: elevação 2 */
    elevated: "#242D36",
    /** Tertiary: separadores */
    tertiary: "#2F3B46",
    /** Overlay */
    overlay: "rgba(0, 0, 0, 0.7)",
    /** Glass */
    glass: "rgba(26, 32, 39, 0.72)",
    /** Card alpha */
    cardAlpha: "rgba(26, 32, 39, 0.95)",
  },
} as const;

// ===========================================
// TEXT TOKENS - Hierarquia de Texto
// ===========================================

export const text = {
  light: {
    /** Primary: títulos, headings (contraste ~14:1) */
    primary: "#1F2937",
    /** Secondary: corpo de texto (contraste ~5.5:1) */
    secondary: "#6B7280",
    /** Tertiary: hints, placeholders (contraste ~3.5:1) */
    tertiary: "#9CA3AF",
    /** Muted: desabilitado (apenas decorativo) */
    muted: "#D1D5DB",
    /** Inverse: texto em fundo escuro */
    inverse: "#F9FAFB",
    /** Accent: texto rosa (links CTA) */
    accent: "#F4258C",
    /** Link: texto azul (links normais) */
    link: "#4488AB",
  },
  dark: {
    primary: "#F3F5F7",
    secondary: "#9DA8B4",
    tertiary: "#7D8B99",
    muted: "#5C6B7A",
    inverse: "#1F2937",
    accent: "#FB7190",
    link: "#96C7DE",
  },
} as const;

// ===========================================
// SEMANTIC TOKENS - Feedback do Sistema
// ===========================================

export const semantic = {
  light: {
    success: "#10B981",
    successLight: "#D1FAE5",
    successText: "#065F46",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    warningText: "#92400E",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    errorText: "#B91C1C",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
    infoText: "#1E40AF",
  },
  dark: {
    success: "#34D399",
    successLight: "rgba(16, 185, 129, 0.15)",
    successText: "#A7F3D0",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    warningText: "#FDE68A",
    error: "#F87171",
    errorLight: "rgba(239, 68, 68, 0.15)",
    errorText: "#FECACA",
    info: "#60A5FA",
    infoLight: "rgba(59, 130, 246, 0.15)",
    infoText: "#BFDBFE",
  },
} as const;

// ===========================================
// NEUTRAL TOKENS - Tons Neutros
// ===========================================

export const neutral = {
  0: "#FFFFFF",
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
} as const;

// ===========================================
// FEELING TOKENS - Check-in Emocional
// ===========================================

export const feeling = {
  /** Bem/Feliz - Amarelo pastel (sol) */
  bem: {
    color: "#FFE4B5",
    active: "#FFEFC7",
    icon: "#F59E0B",
  },
  /** Cansada - Azul pastel (nuvem) */
  cansada: {
    color: "#BAE6FD",
    active: "#D4E9FD",
    icon: "#60A5FA",
  },
  /** Indisposta - Lavanda (chuva) */
  indisposta: {
    color: "#DDD6FE",
    active: "#EDE9FE",
    icon: "#A855F7",
  },
  /** Amada - Rosa (coração) */
  amada: {
    color: "#FECDD3",
    active: "#FFE4E9",
    icon: "#F4258C",
  },
  /** Ansiosa - Coral (urgência suave) */
  ansiosa: {
    color: "#FED7AA",
    active: "#FFE4C7",
    icon: "#F97316",
  },
  /** Enjoada - Lavanda (indisposição) - alias for indisposta */
  enjoada: {
    color: "#DDD6FE",
    active: "#EDE9FE",
    icon: "#A855F7",
  },
} as const;

// ===========================================
// TYPOGRAPHY TOKENS
// ===========================================

export const typography = {
  /**
   * Manrope - Fonte única do app
   * Geometric sans-serif com personalidade amigável
   * Excelente legibilidade em mobile
   */
  fontFamily: {
    base: "Manrope_400Regular",
    medium: "Manrope_500Medium",
    semibold: "Manrope_600SemiBold",
    bold: "Manrope_700Bold",
    extrabold: "Manrope_800ExtraBold",
    // Aliases para compatibilidade
    sans: "Manrope_400Regular",
    sansMedium: "Manrope_500Medium",
    sansSemibold: "Manrope_600SemiBold",
    sansBold: "Manrope_700Bold",
    // Serif não existe mais - usar bold para destaque
    serif: "Manrope_700Bold",
  },

  // Display (títulos hero) - Escala Calm FemTech
  displayLarge: { fontSize: 28, lineHeight: 34, fontWeight: "400" as const },
  displayMedium: { fontSize: 24, lineHeight: 30, fontWeight: "400" as const },
  displaySmall: { fontSize: 22, lineHeight: 28, fontWeight: "400" as const },

  // Headline (seções) - h1, h2, h3
  headlineLarge: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const }, // h1
  headlineMedium: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const }, // h2
  headlineSmall: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const }, // h3

  // Title (cards, subtítulos)
  titleLarge: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  titleMedium: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },

  // Body (texto corrido) - Escala principal
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const }, // body
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const }, // body (padrão)
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const }, // bodySm

  // Label (botões, tags, inputs)
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const }, // label
  labelMedium: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: "600" as const }, // caption

  // Caption (legendas, hints) - alias para labelSmall
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
} as const;

// ===========================================
// SPACING TOKENS (8pt Grid)
// ===========================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  "7xl": 80,
  "8xl": 96,
} as const;

// ===========================================
// RADIUS TOKENS
// ===========================================

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
} as const;

// ===========================================
// SHADOW TOKENS
// ===========================================

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  /** Glow colorido para CTAs */
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  }),
  /** Glow rosa para CTA accent */
  accentGlow: {
    shadowColor: "#F4258C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// ===========================================
// GRADIENT TOKENS
// ===========================================

export const gradients = {
  // Brand gradients
  primary: [brand.primary[500], brand.primary[600]] as const,
  primarySoft: [brand.primary[50], brand.primary[100]] as const,
  accent: [brand.accent[400], brand.accent[500]] as const,
  accentSoft: [brand.accent[50], brand.accent[100]] as const,
  secondary: [brand.secondary[400], brand.secondary[500]] as const,
  secondarySoft: [brand.secondary[50], brand.secondary[100]] as const,

  // Hero backgrounds
  heroLight: [brand.primary[50], "#FFFFFF", brand.primary[100]] as const,
  heroAccent: [brand.accent[50], "#FFFFFF", brand.primary[50]] as const,
  heroWarm: [brand.accent[50], "#FFF9F3", brand.primary[50]] as const,

  // Mood gradients
  calm: [brand.primary[100], brand.primary[50], "#FFFFFF"] as const,
  warmth: [brand.accent[100], brand.accent[50], "#FFFFFF"] as const,
  serenity: [brand.secondary[100], brand.secondary[50], "#FFFFFF"] as const,

  // Additional hero backgrounds
  warm: [brand.accent[50], "#FFF9F3", brand.primary[50]] as const,
  cool: [brand.primary[100], brand.primary[50], "#FFFFFF"] as const,
  sunset: ["#FDE68A", "#FBBF24", "#F59E0B"] as const,

  // NathIA Onboarding gradient
  nathiaOnboarding: [brand.accent[400], brand.accent[500]] as const,

  // Glass/Overlay
  glass: ["rgba(255,255,255,0.8)", "rgba(247,251,253,0.4)"] as const,
  overlay: ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"] as const,

  // Affirmations gradients (for affirmation cards/backgrounds)
  affirmations: {
    oceano: ["#1E3A8A", "#3B82F6", "#60A5FA"] as const,
    ametista: ["#4C1D95", "#7C3AED", "#A78BFA"] as const,
    lavanda: ["#6B21A8", "#A855F7", "#C4B5FD"] as const,
    poente: ["#9A3412", "#EA580C", "#FDBA74"] as const,
    floresta: ["#166534", "#22C55E", "#86EFAC"] as const,
    nuvem: ["#1E40AF", "#60A5FA", "#BFDBFE"] as const,
    coral: ["#9F1239", "#FB7185", "#FECDD3"] as const,
    amanhecer: ["#B45309", "#FBBF24", "#FEF3C7"] as const,
    noite: ["#312E81", "#4F46E5", "#818CF8"] as const,
    esperanca: ["#0F766E", "#14B8A6", "#99F6E4"] as const,
  },

  // Cycle gradients (for menstrual cycle phases)
  cycle: {
    menstrual: ["#F43F5E", "#FB7185"] as const,
    follicular: ["#60A5FA", "#93C5FD"] as const,
    ovulation: ["#34D399", "#6EE7B7"] as const,
    luteal: ["#FBBF24", "#FDE68A"] as const,
    fertile: ["#A78BFA", "#C4B5FD"] as const, // Lilac for fertile window
  },
} as const;

// ===========================================
// ANIMATION TOKENS
// ===========================================

export const animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    spring: { damping: 15, stiffness: 150 },
  },
} as const;

// ===========================================
// ACCESSIBILITY TOKENS
// ===========================================

export const accessibility = {
  minTapTarget: 44,
  contrastRatioAA: 4.5,
  contrastRatioAAA: 7,
  minTouchSpacing: 8,
} as const;

// ===========================================
// COMPONENT STYLE TOKENS
// ===========================================

export const components = {
  // Button Primary: ROSA (CTA principal)
  buttonPrimary: {
    backgroundColor: brand.accent[500],
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    minHeight: accessibility.minTapTarget,
  },

  // Button Secondary: AZUL outline
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: brand.primary[500],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    minHeight: accessibility.minTapTarget,
  },

  // Button Ghost: sem fundo
  buttonGhost: {
    backgroundColor: "transparent",
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: accessibility.minTapTarget,
  },

  // Card: fundo branco com sombra suave
  card: {
    backgroundColor: surface.light.card,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    ...shadows.md,
  },

  // Card Outlined: borda sutil
  cardOutlined: {
    backgroundColor: surface.light.card,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: neutral[200],
    padding: spacing["2xl"],
  },

  // Input
  input: {
    backgroundColor: neutral[50],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral[200],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: accessibility.minTapTarget + 8,
  },

  // Chip
  chip: {
    backgroundColor: brand.primary[50],
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 32,
  },

  // Tab Bar
  tabBar: {
    backgroundColor: "rgba(247, 251, 253, 0.95)",
    borderTopWidth: 0.5,
    borderTopColor: brand.primary[200],
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },
} as const;

// ===========================================
// LAYOUT TOKENS
// ===========================================

export const layout = {
  screenPaddingHorizontal: spacing["2xl"],
  screenPaddingVertical: spacing["2xl"],
  sectionGap: spacing["4xl"],
  cardGap: spacing.lg,
  heroHeight: {
    small: 180,
    medium: 240,
    large: 320,
  },
} as const;

// ===========================================
// ELEVATION (z-index)
// ===========================================

export const elevation = {
  base: 0,
  raised: 1,
  overlay: 10,
  dropdown: 20,
  modal: 30,
  tooltip: 40,
  toast: 50,
} as const;

// ===========================================
// OVERLAY TOKENS
// ===========================================

export const overlay = {
  light: "rgba(0, 0, 0, 0.1)",
  medium: "rgba(0, 0, 0, 0.3)",
  dark: "rgba(0, 0, 0, 0.5)",
  heavy: "rgba(0, 0, 0, 0.7)",
  backdrop: "rgba(0, 0, 0, 0.85)",
} as const;

// ===========================================
// MOOD TOKENS (for emotion/mood tracking)
// ===========================================

export const mood = {
  happy: "#10B981",
  calm: "#6366F1",
  energetic: "#F59E0B",
  anxious: "#EF4444",
  sad: "#3B82F6",
  irritated: "#F97316",
  sensitive: "#EC4899",
  tired: "#8B5CF6",
} as const;

// ===========================================
// CYCLE PHASE COLORS (single colors for cycle tracking)
// ===========================================

export const cycleColors = {
  menstrual: "#F43F5E",
  follicular: "#60A5FA",
  ovulation: "#34D399",
  luteal: "#FBBF24",
  fertile: "#A78BFA",
} as const;

// ===========================================
// THEME HELPER - Resolve tokens por modo
// ===========================================

export type ThemeMode = "light" | "dark";

/**
 * Resolve todos os tokens para o modo especificado
 */
export const getThemeTokens = (mode: ThemeMode) => ({
  brand,
  surface: surface[mode],
  text: text[mode],
  semantic: semantic[mode],
  neutral,
  feeling,
  typography,
  spacing,
  radius,
  shadows,
  gradients,
  animation,
  accessibility,
  components,
  layout,
  elevation,
});

/**
 * Hook helper para usar com useTheme()
 */
export const resolveToken = <T>(lightValue: T, darkValue: T, isDark: boolean): T =>
  isDark ? darkValue : lightValue;

// ===========================================
// EXPORTS COMPATÍVEIS (backward compatibility)
// ===========================================

/**
 * @deprecated Use `brand` diretamente
 */
export const COLORS = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.teal,
  neutral,
  background: {
    primary: surface.light.base,
    secondary: surface.light.card,
    tertiary: surface.light.tertiary,
    warm: brand.primary[50],
    card: surface.light.cardAlpha,
    glass: surface.light.glass,
  },
  text: {
    primary: text.light.primary,
    secondary: text.light.secondary,
    tertiary: text.light.tertiary,
    muted: text.light.muted,
    inverse: text.light.inverse,
  },
  semantic: {
    success: semantic.light.success,
    successLight: semantic.light.successLight,
    warning: semantic.light.warning,
    warningLight: semantic.light.warningLight,
    error: semantic.light.error,
    errorLight: semantic.light.errorLight,
    info: semantic.light.info,
    infoLight: semantic.light.infoLight,
  },
  feeling: {
    bem: feeling.bem.color,
    cansada: feeling.cansada.color,
    indisposta: feeling.indisposta.color,
    amada: feeling.amada.color,
  },
  mood: {
    happy: "#10B981",
    calm: "#6366F1",
    energetic: "#F59E0B",
    anxious: "#EF4444",
    sad: "#3B82F6",
    irritated: "#F97316",
    sensitive: "#EC4899",
    tired: "#8B5CF6",
  },
  legacyAccent: {
    sage: "#86EFAC",
    peach: "#FED7AA",
    sky: "#BAE6FD",
    lavender: "#DDD6FE",
    coral: "#FECACA",
  },
} as const;

export const COLORS_DARK = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.teal,
  neutral: {
    0: "#0F1419",
    50: "#1A2027",
    100: "#242D36",
    200: "#2F3B46",
    300: "#3D4A57",
    400: "#5C6B7A",
    500: "#7D8B99",
    600: "#9DA8B4",
    700: "#C7CED5",
    800: "#E2E7EC",
    900: "#F3F5F7",
  },
  background: {
    primary: surface.dark.base,
    secondary: surface.dark.card,
    tertiary: surface.dark.tertiary,
    warm: "#151C22",
    card: surface.dark.cardAlpha,
    glass: surface.dark.glass,
  },
  text: text.dark,
  semantic: semantic.dark,
  feeling: {
    bem: "rgba(255, 228, 181, 0.2)",
    cansada: "rgba(186, 230, 253, 0.25)",
    indisposta: "rgba(167, 139, 250, 0.2)",
    amada: "rgba(254, 205, 211, 0.2)",
  },
  mood: COLORS.mood,
  legacyAccent: COLORS.legacyAccent,
} as const;

export const TYPOGRAPHY = typography;
export const SPACING = spacing;
export const RADIUS = radius;
export const SHADOWS = shadows;
export const GRADIENTS = gradients;

/**
 * Tokens - Objeto agregado para fácil importação
 * Uso: import { Tokens } from '@/theme/tokens'
 */
export const Tokens = {
  brand,
  neutral,
  text,
  semantic,
  surface,
  gradients,
  typography,
  spacing,
  radius,
  shadows,
  feeling,
  animation,
  accessibility,
  components,
  layout,
  elevation,
  overlay,
  mood,
  cycleColors,
} as const;
