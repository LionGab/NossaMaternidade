/**
 * Design Tokens 2025 - Nossa Maternidade
 * "Pink Clean + Blue Clean" - Cores vibrantes e Instagram-worthy ✨
 *
 * FONTE ÚNICA DE VERDADE para cores, tipografia, espaçamento.
 *
 * Princípios:
 * - Blue Clean: Céu limpo, água cristalina, frescor digital
 * - Pink Clean: Flores frescas, blush natural, feminilidade moderna
 * - Paleta Instagram-worthy, perfeita para influenciadoras
 * - WCAG AAA por padrão, accessibility-first
 *
 * Hierarquia:
 * - brand.primary = Blue Clean (#1AB8FF) - sky blue vibrante
 * - brand.accent = Pink Clean (#FF5C94) - rosa fresco e moderno
 * - brand.secondary = Lilás suave (apoio)
 *
 * @see https://developer.apple.com/design/human-interface-guidelines
 * @see https://m3.material.io
 */

// ===========================================
// BRAND TOKENS - Pink Clean + Blue Clean ✨
// ===========================================

export const brand = {
  /**
   * Primary: Blue Clean ✨
   * - Transmite: frescor, leveza, confiança, modernidade
   * - Uso: superfícies, navegação, estrutura, elementos principais
   * - Inspiração: Céu limpo, água cristalina, digital wellness
   */
  primary: {
    50: "#F0FAFF", // Background principal - quase branco azulado
    100: "#E0F4FF", // Highlights, cards - azul clarinho
    200: "#B8E8FF", // Border subtle - baby blue suave
    300: "#7DD8FF", // Hover states - sky blue
    400: "#4AC8FF", // Active elements - azul vibrante
    500: "#1AB8FF", // Principal - azul clean e fresco ✨
    600: "#0099E6", // CTA secundário
    700: "#007ACC", // Links, ícones
    800: "#005C99", // Textos sobre claro
    900: "#004066", // Headings
  },

  /**
   * Accent: Pink Clean ✨
   * - Transmite: calor humano, feminilidade, energia positiva
   * - Uso: CTAs principais, badges especiais, "momentos de alegria"
   * - REGRA: usar pontualmente (máx 10-15% da tela)
   * - Inspiração: Flores frescas, blush natural, Instagram aesthetic
   */
  accent: {
    50: "#FFF5F8", // Background accent suave - quase branco rosado
    100: "#FFE5ED", // Highlight rosa - rosa clarinho
    200: "#FFD0E0", // Border rosa - rosa suave
    300: "#FFA8C5", // Hover - rosa médio
    400: "#FF7AA8", // Active - rosa vibrante
    500: "#FF5C94", // CTA PRINCIPAL - pink clean e Instagram-worthy ✨
    600: "#E84D82", // CTA pressed
    700: "#CC3E6F", // Links rosa
    800: "#A8335B", // Text accent
    900: "#852848", // Heading accent (raro)
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
// MATERNAL TOKENS - Auto-cuidado & Acolhimento
// Cores que transmitem: segurança, amor, cuidado, crescimento
// ===========================================

export const maternal = {
  /**
   * Acolhimento - Tons quentes que abraçam
   * Para momentos de conexão, boas-vindas, conforto
   */
  warmth: {
    blush: "#FFEEF2",      // Abraço suave
    peach: "#FFE4D6",      // Carinho maternal
    honey: "#FFF4E6",      // Doçura, lar
    cream: "#FFFBF5",      // Aconchego
  },

  /**
   * Serenidade - Tons que acalmam
   * Para meditação, respiração, momentos de paz
   */
  calm: {
    lavender: "#F5F0FF",   // Tranquilidade
    mist: "#F0F7FF",       // Clareza mental
    sage: "#F0FDF4",       // Natureza, renovação
    cloud: "#F8FAFC",      // Leveza
  },

  /**
   * Força - Tons que empoderam
   * Para conquistas, progresso, superação
   */
  strength: {
    rose: "#FCE7F3",       // Força feminina
    coral: "#FFF1F0",      // Energia positiva
    gold: "#FFFBEB",       // Conquista, valor
    mint: "#ECFDF5",       // Renovação, crescimento
  },

  /**
   * Conexão - Tons para momentos de vínculo
   * Para interações, comunidade, compartilhamento
   */
  bond: {
    heart: "#FDF2F8",      // Amor incondicional
    nurture: "#FEF3F2",    // Cuidado mútuo
    trust: "#EFF6FF",      // Confiança
    together: "#F5F3FF",   // Comunidade
  },

  /**
   * Jornada - Fases da maternidade
   * Cores específicas para cada momento
   */
  journey: {
    tentando: "#FFF7ED",   // Esperança dourada
    gravidez: "#FDF4FF",   // Magia lilás
    posNatal: "#FEF2F2",   // Rosa acolhedor
    amamentacao: "#F0FDF4", // Verde nutritivo
    maternidade: "#FFF1F2", // Rosa maduro
  },

  /**
   * Autocuidado - Rituais e bem-estar
   */
  selfCare: {
    rest: "#F8F4FF",       // Descanso
    hydrate: "#F0F9FF",    // Água, frescor
    nourish: "#FFFBEB",    // Nutrição
    move: "#ECFDF5",       // Movimento
    breathe: "#F0FDFA",    // Respiração
    reflect: "#FDF4FF",    // Reflexão
  },

  /**
   * Respiração - Cores e gradientes para exercícios
   */
  breathing: {
    box: {
      color: "#60A5FA",
      bgColors: ["#DBEAFE", "#BFDBFE", "#93C5FD"] as const,
    },
    technique478: {
      bgColors: ["#EDE9FE", "#DDD6FE", "#C4B5FD"] as const,
    },
    calm: {
      bgColors: ["#DCFCE7", "#BBF7D0", "#86EFAC"] as const,
    },
  },

  /**
   * Gradientes maternais suaves (light backgrounds)
   */
  gradients: {
    embrace: ["#FFEEF2", "#FFF4E6", "#FFFBF5"] as const,     // Abraço
    serenity: ["#F5F0FF", "#F0F7FF", "#F8FAFC"] as const,    // Paz
    growth: ["#ECFDF5", "#F0FDF4", "#FFFBEB"] as const,      // Crescimento
    love: ["#FDF2F8", "#FCE7F3", "#FFF1F2"] as const,        // Amor
    journey: ["#FFF7ED", "#FDF4FF", "#FEF2F2"] as const,     // Jornada
  },

  /**
   * Gradientes para Stories/Onboarding (dark immersive)
   * Cada etapa tem sua própria atmosfera
   */
  stories: {
    welcome: ["#1A1A2E", "#16213E", "#0F3460"] as const,     // Noite acolhedora
    moment: ["#2D1B4E", "#462B7C", "#5B3A9B"] as const,      // Lilás introspectivo
    date: ["#3D2B54", "#5C3D7A", "#7B4F9F"] as const,        // Roxo mágico
    objectives: ["#1E3A5F", "#2E5A8F", "#3E7ABF"] as const,  // Azul sereno
    emotional: ["#4A2040", "#6B3060", "#8C4080"] as const,   // Rosa profundo
    checkIn: ["#1F4E5F", "#2F6E8F", "#3F8EAF"] as const,     // Azul teal
    reward: ["#0D0D0D", "#1A1A1A", "#2D2D2D"] as const,      // Premium escuro
  },
} as const;

// ===========================================
// SURFACE TOKENS - Superfícies e Backgrounds
// ===========================================

export const surface = {
  light: {
    /** Base: Blue Clean clarinho (nunca branco puro) */
    base: "#F0FAFF",
    /** Cards: branco puro */
    card: "#FFFFFF",
    /** Elevated: cards com elevação */
    elevated: "#FFFFFF",
    /** Tertiary: separadores, dividers */
    tertiary: "#E0F4FF",
    /** Overlay: modais, sheets */
    overlay: "rgba(0, 0, 0, 0.5)",
    /** Glass: elementos com blur */
    glass: "rgba(240, 250, 255, 0.85)",
    /** Card com transparência */
    cardAlpha: "rgba(255, 255, 255, 0.96)",
  },
  dark: {
    /** Base: Blue Clean escuro (não preto puro - OLED friendly) */
    base: "#0A1520",
    /** Cards: elevação 1 */
    card: "#0F1E2D",
    /** Elevated: elevação 2 */
    elevated: "#15283A",
    /** Tertiary: separadores */
    tertiary: "#1F3A4F",
    /** Overlay */
    overlay: "rgba(0, 0, 0, 0.7)",
    /** Glass */
    glass: "rgba(15, 30, 45, 0.72)",
    /** Card alpha */
    cardAlpha: "rgba(15, 30, 45, 0.95)",
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
    accent: "#FF5C94",
    /** Link: texto azul (links normais) */
    link: "#007ACC",
  },
  dark: {
    primary: "#F3F5F7",
    secondary: "#9DA8B4",
    tertiary: "#7D8B99",
    muted: "#5C6B7A",
    inverse: "#1F2937",
    accent: "#FF7AA8",
    link: "#4AC8FF",
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
    color: "#FFD0E0",
    active: "#FFE5ED",
    icon: "#FF5C94",
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
    shadowColor: "#FF5C94",
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
  accent: [brand.accent[300], brand.accent[400]] as const, // Cores mais suaves
  accentVibrant: [brand.accent[400], brand.accent[500]] as const, // Versão vibrante
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
    instant: 80,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
    glow: 1500,
    particle: 2000,
  },
  easing: {
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    spring: { damping: 15, stiffness: 150 },
    springSnappy: { damping: 12, stiffness: 200 },
    springBouncy: { damping: 8, stiffness: 180 },
  },
} as const;

// ===========================================
// MICRO-INTERACTION TOKENS
// ===========================================

export const micro = {
  /** Escala quando pressionado (0.97 = 3% menor) */
  pressScale: 0.97,
  /** Escala no hover/focus */
  hoverScale: 1.02,
  /** Escala para pop/destaque */
  popScale: 1.15,
  /** Distância de float para partículas (px) */
  floatDistance: 10,
  /** Ângulo de tilt sutil (graus) */
  tiltAngle: 3,
  /** Opacidade de glow */
  glow: {
    min: 0.3,
    max: 0.7,
  },
  /** Delay entre itens em stagger (ms) */
  staggerDelay: 50,
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
    backgroundColor: "rgba(240, 250, 255, 0.95)",
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
// PREMIUM TOKENS - Dark Immersive Screens
// (Paywall, Premium features, Cinematic UI)
// ===========================================

export const premium = {
  /**
   * Premium Gradient Background
   * Deep purple/violet for luxurious feel
   * Used in: Paywall, Premium features
   */
  gradient: {
    top: "#0F0A1F",
    mid: "#1A1030",
    bottom: "#251540",
    accent: "#301A55",
  },

  /**
   * Glow effects for premium screens
   */
  glow: {
    accent: "rgba(255, 92, 148, 0.25)",
    secondary: "rgba(139, 92, 246, 0.2)",
    primary: "rgba(26, 184, 255, 0.2)",
  },

  /**
   * Aurora effects for cinematic screens (Login, onboarding)
   */
  aurora: {
    pink: "rgba(255, 92, 148, 0.3)",
    purple: "rgba(139, 92, 246, 0.3)",
    blue: "rgba(26, 184, 255, 0.25)",
  },

  /**
   * Input styles for dark premium screens
   */
  input: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.12)",
  },

  /**
   * Glass morphism for premium cards
   */
  glass: {
    ultraLight: "rgba(255, 255, 255, 0.06)",
    light: "rgba(255, 255, 255, 0.08)",
    base: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.2)",
    strong: "rgba(255, 255, 255, 0.25)",
    progressActive: "rgba(255, 255, 255, 0.95)",
    accentLight: "rgba(255, 92, 148, 0.15)",
    accentMedium: "rgba(255, 92, 148, 0.2)",
    dark: "rgba(0, 0, 0, 0.3)",
    // Legacy aliases
    background: "rgba(255, 255, 255, 0.08)",
    selected: "rgba(255, 92, 148, 0.15)",
    highlight: "rgba(255, 255, 255, 0.2)",
  },

  /**
   * Text colors on premium dark backgrounds
   */
  text: {
    primary: "#FFFFFF",
    bright: "rgba(255, 255, 255, 0.9)",
    secondary: "rgba(255, 255, 255, 0.8)",
    muted: "rgba(255, 255, 255, 0.7)",
    subtle: "rgba(255, 255, 255, 0.6)",
    disabled: "rgba(255, 255, 255, 0.5)",
    hint: "rgba(255, 255, 255, 0.4)",
    accent: brand.accent[400],
  },

  /**
   * CTA gradient for premium buttons
   */
  cta: {
    start: brand.accent[400],
    end: brand.accent[600],
  },

  /**
   * Special colors for premium UI
   */
  special: {
    success: "#34D399",
    gold: "#FCD34D",
    crown: "#FCD34D",
  },
} as const;

// ===========================================
// STREAK/HABIT TOKENS
// ===========================================

export const streak = {
  /** Streak badge background (warm yellow) */
  background: "#FEF3C7",
  /** Streak flame icon color */
  icon: "#F59E0B",
  /** Streak text color */
  text: "#B45309",
  /** Completion states */
  completion: {
    light: "#D4EDD9",
    medium: "#A7D4B4",
    full: "#10B981",
  },
  /** Success gradient for habits header */
  gradient: ["#10B981", "#5A9D68", "#4A8C58"] as const,
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
    primary: "#F0FAFF",
    secondary: "#FFFFFF",
    tertiary: "#E0F4FF",
    warm: "#F0FAFF",
    card: "rgba(255, 255, 255, 0.96)",
    glass: "rgba(240, 250, 255, 0.85)",
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
    0: "#0A1520",
    50: "#0F1E2D",
    100: "#15283A",
    200: "#1F3A4F",
    300: "#2A4A60",
    400: "#4A6A80",
    500: "#6A8A9F",
    600: "#8AAABF",
    700: "#AACADE",
    800: "#D0EAFF",
    900: "#F0FAFF",
  },
  background: {
    primary: "#0A1520",
    secondary: "#0F1E2D",
    tertiary: "#15283A",
    warm: "#0F1A25",
    card: "rgba(15, 30, 45, 0.95)",
    glass: "rgba(15, 30, 45, 0.72)",
  },
  text: text.dark,
  semantic: semantic.dark,
  feeling: {
    bem: "rgba(255, 228, 181, 0.2)",
    cansada: "rgba(26, 184, 255, 0.25)",
    indisposta: "rgba(167, 139, 250, 0.2)",
    amada: "rgba(255, 208, 224, 0.2)",
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
  maternal,
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
  micro,
  accessibility,
  components,
  layout,
  elevation,
  overlay,
  premium,
  mood,
  streak,
  cycleColors,
} as const;
