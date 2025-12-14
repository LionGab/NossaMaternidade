/**
 * Design System 2025 - Nossa Maternidade
 *
 * Baseado em:
 * - Apple Human Interface Guidelines (Liquid Glass 2025)
 * - Material Design 3 Expressive
 * - WCAG AA Accessibility Standards
 *
 * Principios:
 * - Minimalismo com tipografia bold
 * - Espacamento generoso (8pt grid)
 * - Glassmorphism sutil para profundidade
 * - Cores dinamicas com suporte a dark mode
 * - Tap targets minimos de 44pt (iOS)
 */

// ===========================================
// PALETA DE CORES
// ===========================================

export const COLORS = {
  // Cores Primarias
  primary: {
    50: "#FFF0F6",
    100: "#FFE4E6",
    200: "#FECDD3",
    300: "#FDA4AF",
    400: "#FB7185",
    500: "#f4258c", // Principal
    600: "#DB1F7D",
    700: "#BE123C",
    800: "#9F1239",
    900: "#881337",
  },

  // Cores Secundarias (Lilac/Purple)
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

  // Tons Neutros (Warm Gray)
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },

  // Background especiais
  background: {
    primary: "#f8f5f7",
    secondary: "#FFFFFF",
    tertiary: "#F5F2EE",
    card: "rgba(255, 255, 255, 0.85)",
    glass: "rgba(255, 255, 255, 0.72)",
  },

  // Cores Semanticas
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  // Cores de Destaque (Accent)
  accent: {
    sage: "#86EFAC", // Verde suave
    peach: "#FED7AA", // Pessego
    sky: "#BAE6FD", // Azul claro
    lavender: "#DDD6FE", // Lavanda
    coral: "#FECACA", // Coral
  },
} as const;

// Dark Mode Colors
export const COLORS_DARK = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  neutral: {
    0: "#1C1917",
    50: "#292524",
    100: "#44403C",
    200: "#57534E",
    300: "#78716C",
    400: "#A8A29E",
    500: "#D6D3D1",
    600: "#E7E5E4",
    700: "#F5F5F4",
    800: "#FAFAF9",
    900: "#FFFFFF",
  },
  background: {
    primary: "#0C0A09",
    secondary: "#1C1917",
    tertiary: "#292524",
    card: "rgba(28, 25, 23, 0.85)",
    glass: "rgba(28, 25, 23, 0.72)",
  },
  semantic: COLORS.semantic,
  accent: COLORS.accent,
} as const;

// ===========================================
// TIPOGRAFIA
// ===========================================

export const TYPOGRAPHY = {
  // Display - Titulos grandes
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: "400" as const,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },

  // Headline - Secoes
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600" as const,
    letterSpacing: -0.25,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },

  // Title - Titulos de cards
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.1,
  },

  // Body - Texto corrido
  bodyLarge: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "400" as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: 0.4,
  },

  // Label - Botoes, tags
  labelLarge: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
} as const;

// ===========================================
// ESPACAMENTO (8pt Grid System)
// ===========================================

export const SPACING = {
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
// BORDAS E RAIOS
// ===========================================

export const RADIUS = {
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
// SOMBRAS
// ===========================================

export const SHADOWS = {
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
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  }),
} as const;

// ===========================================
// GLASSMORPHISM
// ===========================================

export const GLASS = {
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  medium: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  dark: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
} as const;

// ===========================================
// ANIMACOES
// ===========================================

export const ANIMATION = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    // Curvas iOS-style
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    spring: { damping: 15, stiffness: 150 },
  },
} as const;

// ===========================================
// ACESSIBILIDADE
// ===========================================

export const ACCESSIBILITY = {
  // Tamanho minimo de tap target (Apple HIG)
  minTapTarget: 44,
  // Contraste minimo para WCAG AA
  contrastRatio: 4.5,
  // Espacamento minimo entre elementos tocaveis
  minTouchSpacing: 8,
} as const;

// ===========================================
// COMPONENTES PRE-DEFINIDOS
// ===========================================

export const COMPONENT_STYLES = {
  // Card padrao
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    ...SHADOWS.md,
  },

  // Card com glass effect
  cardGlass: {
    ...GLASS.light,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    ...SHADOWS.md,
  },

  // Botao primario
  buttonPrimary: {
    backgroundColor: COLORS.primary[500],
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Botao secundario
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary[500],
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Input field
  input: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    minHeight: ACCESSIBILITY.minTapTarget + 8,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
  },

  // Chip/Tag
  chip: {
    backgroundColor: COLORS.primary[50],
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 32,
  },

  // Tab Bar
  tabBar: {
    backgroundColor: "rgba(255, 252, 250, 0.92)",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.neutral[200],
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    ...SHADOWS.sm,
  },
} as const;

// ===========================================
// GRADIENTES
// ===========================================

export const GRADIENTS = {
  primary: ["#f4258c", "#DB1F7D"],
  secondary: ["#A855F7", "#9333EA"],
  warm: ["#FFF0F6", "#FCE7F3", "#FAE8FF"],
  cool: ["#EFF6FF", "#DBEAFE", "#BFDBFE"],
  sunset: ["#FED7AA", "#FECACA", "#FEE2E2"],
  aurora: ["#A855F7", "#EC4899", "#f4258c"],
  sage: ["#D1FAE5", "#A7F3D0", "#86EFAC"],
  glass: ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"],
} as const;
