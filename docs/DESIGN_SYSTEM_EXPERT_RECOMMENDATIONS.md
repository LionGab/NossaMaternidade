# 🎨 Recomendações Avançadas de Design System - Nossa Maternidade
## Expertise Completa: UX/UI, Acessibilidade, Emoção e Performance

**Data:** 2025-01-27  
**Versão:** 2.0 - Expert Level  
**Baseado em:** Pesquisas de apps maternais, Material Design 3, Human Interface Guidelines, WCAG 2.2

---

## 📋 Índice

1. [Design System Avançado](#1-design-system-avançado)
2. [Paleta de Cores Emocional](#2-paleta-de-cores-emocional)
3. [Tipografia e Hierarquia](#3-tipografia-e-hierarquia)
4. [Espaçamento e Layout](#4-espaçamento-e-layout)
5. [Micro-interações e Animações](#5-micro-interações-e-animações)
6. [Acessibilidade Avançada](#6-acessibilidade-avançada)
7. [Design Emocional](#7-design-emocional)
8. [Personalização e Adaptação](#8-personalização-e-adaptação)
9. [Performance Visual](#9-performance-visual)
10. [Testes e Validação](#10-testes-e-validação)

---

## 1. Design System Avançado

### 1.1 Sistema de Cores Semântico Expandido

#### Problema Atual
O design system usa cores genéricas (primary, secondary) sem contexto emocional ou funcional.

#### Solução: Cores Semânticas Contextuais

```typescript
// Cores por Contexto Emocional
export const EmotionalColors = {
  // Estados Emocionais
  calm: {
    light: '#E6F0FA',      // Sky blue - tranquilidade
    main: '#6DA9E4',       // Soft ocean blue - especificação
    dark: '#4A90C2',       // Deep calm
    gradient: ['#E6F0FA', '#6DA9E4', '#4A90C2'],
  },
  warm: {
    light: '#FFF5F5',      // Warm white
    main: '#FFB3D9',       // Soft pink - acolhimento
    dark: '#FF8CC8',       // Deep warm
    gradient: ['#FFF5F5', '#FFB3D9', '#FF8CC8'],
  },
  energetic: {
    light: '#FFF9E6',      // Light yellow
    main: '#FFD93D',       // Sunshine - energia positiva
    dark: '#FFC107',       // Deep energy
    gradient: ['#FFF9E6', '#FFD93D', '#FFC107'],
  },
  peaceful: {
    light: '#F0FDFA',      // Light mint
    main: '#5EEAD4',       // Mint - paz interior
    dark: '#236B62',       // Deep mint
    gradient: ['#F0FDFA', '#5EEAD4', '#236B62'],
  },
  safe: {
    light: '#F0F8FF',      // Lightest sky
    main: '#6DA9E4',       // Soft ocean - segurança
    dark: '#4A7BA7',       // Deep safe
    gradient: ['#F0F8FF', '#6DA9E4', '#4A7BA7'],
  },
};

// Cores por Função
export const FunctionalColors = {
  // Ações
  action: {
    primary: '#6DA9E4',    // Soft ocean blue
    secondary: '#FFB3D9',  // Soft pink
    tertiary: '#5EEAD4',   // Mint
    destructive: '#F87171', // Light coral
  },
  // Feedback
  feedback: {
    success: '#4ADE80',    // Light mint
    warning: '#FCD34D',    // Light sunshine
    error: '#F87171',      // Light coral
    info: '#60A5FA',       // Light ocean
  },
  // Estados
  state: {
    active: '#6DA9E4',     // Soft ocean
    inactive: '#94A3B8',   // Mid grey
    disabled: '#CBD5E1',   // Light grey
    hover: '#4A90C2',      // Deep calm
    focus: '#60A5FA',      // Light ocean
  },
};
```

**Benefícios:**
- ✅ Cores com significado emocional claro
- ✅ Facilita escolha de cores por contexto
- ✅ Melhora consistência visual
- ✅ Suporta design emocional

---

### 1.2 Sistema de Elevação e Profundidade

#### Problema Atual
Shadows básicos, sem hierarquia clara de profundidade.

#### Solução: Sistema de Elevação em Camadas

```typescript
export const Elevation = {
  // Níveis de profundidade (0-24)
  levels: {
    0: {
      shadow: 'none',
      elevation: 0,
      zIndex: 0,
      description: 'Plano - fundo',
    },
    1: {
      shadow: Shadows.sm,
      elevation: 1,
      zIndex: 100,
      description: 'Cards básicos',
    },
    2: {
      shadow: Shadows.md,
      elevation: 2,
      zIndex: 200,
      description: 'Cards elevados',
    },
    4: {
      shadow: Shadows.lg,
      elevation: 4,
      zIndex: 400,
      description: 'Modais, dropdowns',
    },
    8: {
      shadow: Shadows.xl,
      elevation: 8,
      zIndex: 800,
      description: 'Overlays, tooltips',
    },
    12: {
      shadow: Shadows['2xl'],
      elevation: 12,
      zIndex: 1200,
      description: 'Dialogs, popovers',
    },
    16: {
      shadow: Shadows.premium,
      elevation: 16,
      zIndex: 1600,
      description: 'Toasts, notifications',
    },
    24: {
      shadow: Shadows.premium,
      elevation: 24,
      zIndex: 2400,
      description: 'Loading overlays, full-screen modals',
    },
  },
  
  // Helpers semânticos
  semantic: {
    card: Elevation.levels[1],
    cardHover: Elevation.levels[2],
    modal: Elevation.levels[4],
    dropdown: Elevation.levels[4],
    tooltip: Elevation.levels[8],
    toast: Elevation.levels[16],
  },
};
```

**Benefícios:**
- ✅ Hierarquia visual clara
- ✅ Profundidade consistente
- ✅ Melhor UX de interação
- ✅ Facilita animações de transição

---

### 1.3 Sistema de Estados Visuais

#### Problema Atual
Estados (hover, active, disabled) não são bem definidos.

#### Solução: Estados Completos e Consistentes

```typescript
export const ComponentStates = {
  // Estados interativos
  interactive: {
    default: {
      opacity: 1,
      scale: 1,
      elevation: Elevation.levels[1],
    },
    hover: {
      opacity: 0.9,
      scale: 1.02,
      elevation: Elevation.levels[2],
      transition: 'all 150ms ease',
    },
    active: {
      opacity: 0.8,
      scale: 0.98,
      elevation: Elevation.levels[1],
      transition: 'all 100ms ease',
    },
    focus: {
      outline: '2px solid',
      outlineColor: 'colors.primary.main',
      outlineOffset: '2px',
      elevation: Elevation.levels[2],
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      elevation: Elevation.levels[0],
    },
  },
  
  // Estados de feedback
  feedback: {
    loading: {
      opacity: 0.7,
      cursor: 'wait',
    },
    success: {
      backgroundColor: 'colors.status.success',
      icon: 'check-circle',
      animation: 'pulse',
    },
    error: {
      backgroundColor: 'colors.status.error',
      icon: 'alert-circle',
      animation: 'shake',
    },
  },
};
```

**Benefícios:**
- ✅ Feedback visual claro
- ✅ Estados consistentes
- ✅ Melhor acessibilidade
- ✅ Animações suaves

---

## 2. Paleta de Cores Emocional

### 2.1 Psicologia das Cores para Apps Maternos

#### Pesquisa: Cores que Acalmam e Acolhem

**Azul Suave (#6DA9E4):**
- ✅ Reduz ansiedade (estudos de cores em ambientes hospitalares)
- ✅ Promove confiança e segurança
- ✅ Associado a calma e serenidade
- ✅ Ideal para momentos de estresse

**Rosa Suave (#FFB3D9):**
- ✅ Evoca cuidado e acolhimento
- ✅ Associado a maternidade e amor
- ✅ Reduz percepção de ameaça
- ✅ Ideal para momentos emocionais

**Verde Mint (#5EEAD4):**
- ✅ Promove paz interior
- ✅ Associado a crescimento e vida
- ✅ Reduz fadiga visual
- ✅ Ideal para momentos de reflexão

#### Implementação: Paleta Emocional Contextual

```typescript
export const EmotionalPalette = {
  // Por momento do dia
  timeBased: {
    morning: {
      primary: '#6DA9E4',    // Soft ocean - energia suave
      accent: '#FFD93D',     // Sunshine - positividade
    },
    afternoon: {
      primary: '#6DA9E4',    // Soft ocean - foco
      accent: '#5EEAD4',     // Mint - clareza
    },
    evening: {
      primary: '#4A90C2',    // Deep calm - relaxamento
      accent: '#FFB3D9',     // Soft pink - acolhimento
    },
    night: {
      primary: '#4A7BA7',    // Deep safe - segurança
      accent: '#5EEAD4',     // Mint - paz
    },
  },
  
  // Por estado emocional
  emotionBased: {
    anxious: {
      primary: '#6DA9E4',    // Calm blue
      background: '#F0F8FF', // Lightest sky
      message: 'Respire. Você está segura.',
    },
    happy: {
      primary: '#FFD93D',    // Sunshine
      background: '#FFF9E6', // Light yellow
      message: 'Celebre este momento!',
    },
    tired: {
      primary: '#5EEAD4',    // Mint
      background: '#F0FDFA', // Light mint
      message: 'Descanse. Você merece.',
    },
    overwhelmed: {
      primary: '#FFB3D9',    // Soft pink
      background: '#FFF5F5', // Warm white
      message: 'Um passo de cada vez.',
    },
  },
};
```

---

### 2.2 Contraste Avançado para Acessibilidade

#### Problema: Contraste 7:1 não é suficiente para todos

#### Solução: Sistema de Contraste Adaptativo

```typescript
export const ContrastLevels = {
  // WCAG AAA (7:1) - Mínimo
  aaa: {
    ratio: 7.0,
    description: 'Texto normal',
    useCase: 'Textos principais, títulos',
  },
  // WCAG AAA Enhanced (10:1) - Recomendado
  aaaEnhanced: {
    ratio: 10.0,
    description: 'Texto importante',
    useCase: 'CTAs, avisos críticos, informações médicas',
  },
  // WCAG AAA Maximum (15:1) - Ideal
  aaaMaximum: {
    ratio: 15.0,
    description: 'Texto crítico',
    useCase: 'Disclaimers médicos, termos legais',
  },
};

// Função para calcular e validar contraste
export function getContrastRatio(color1: string, color2: string): number {
  // Implementação de cálculo WCAG
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Validação automática de pares de cores
export const ValidatedColorPairs = {
  // Light Mode
  light: {
    textPrimary: {
      onCanvas: getContrastRatio('#0F172A', '#F1F5F9'), // ~15.8:1 ✅
      onCard: getContrastRatio('#0F172A', '#FFFFFF'),    // ~16.5:1 ✅
    },
    textSecondary: {
      onCanvas: getContrastRatio('#334155', '#F1F5F9'),  // ~8.2:1 ✅
      onCard: getContrastRatio('#334155', '#FFFFFF'),    // ~9.1:1 ✅
    },
    primaryText: {
      onCard: getContrastRatio('#6DA9E4', '#FFFFFF'),    // ~3.2:1 ❌
      onCanvas: getContrastRatio('#6DA9E4', '#F1F5F9'),  // ~3.0:1 ❌
      // SOLUÇÃO: Usar variante mais escura para texto
      textVariant: getContrastRatio('#4A7BA7', '#FFFFFF'), // ~5.8:1 ⚠️
      textVariantStrong: getContrastRatio('#2E5A7A', '#FFFFFF'), // ~8.5:1 ✅
    },
  },
};
```

**Recomendação Crítica:**
- ❌ **#6DA9E4 não atende 7:1** quando usado como texto
- ✅ **Solução:** Criar variante `primary.text` = `#2E5A7A` (azul mais escuro)
- ✅ **Uso:** `primary.main` (#6DA9E4) para backgrounds, `primary.text` (#2E5A7A) para texto

---

## 3. Tipografia e Hierarquia

### 3.1 Sistema de Tipografia Emocional

#### Problema Atual
Tipografia genérica, sem personalidade emocional.

#### Solução: Tipografia Contextual

```typescript
export const TypographySystem = {
  // Tamanhos com contexto emocional
  sizes: {
    // Micro - Informações secundárias
    micro: {
      size: 10,
      lineHeight: 14,
      weight: 'regular',
      useCase: 'Labels, timestamps, badges',
      emotion: 'discrete',
    },
    // Small - Textos de apoio
    small: {
      size: 12,
      lineHeight: 16,
      weight: 'regular',
      useCase: 'Subtítulos, descrições curtas',
      emotion: 'supportive',
    },
    // Base - Texto principal (WCAG mínimo)
    base: {
      size: 16,
      lineHeight: 24,
      weight: 'regular',
      useCase: 'Corpo de texto, parágrafos',
      emotion: 'comfortable',
    },
    // Large - Destaques
    large: {
      size: 18,
      lineHeight: 26,
      weight: 'medium',
      useCase: 'Destaques, citações',
      emotion: 'emphatic',
    },
    // Display - Títulos impactantes
    display: {
      size: 32,
      lineHeight: 40,
      weight: 'bold',
      useCase: 'Títulos principais, hero text',
      emotion: 'confident',
    },
  },
  
  // Pesos com significado
  weights: {
    light: {
      value: 300,
      emotion: 'delicate',
      useCase: 'Textos secundários, labels',
    },
    regular: {
      value: 400,
      emotion: 'comfortable',
      useCase: 'Corpo de texto padrão',
    },
    medium: {
      value: 500,
      emotion: 'emphatic',
      useCase: 'Destaques, CTAs',
    },
    semibold: {
      value: 600,
      emotion: 'confident',
      useCase: 'Títulos secundários',
    },
    bold: {
      value: 700,
      emotion: 'strong',
      useCase: 'Títulos principais, avisos',
    },
  },
  
  // Espaçamento entre linhas (leading)
  lineHeights: {
    tight: 1.2,    // Títulos
    normal: 1.5,   // Corpo de texto
    relaxed: 1.75, // Textos longos, leitura confortável
    loose: 2.0,    // Textos poéticos, mensagens especiais
  },
};
```

---

### 3.2 Hierarquia Visual Avançada

#### Sistema de Escala Tipográfica (Modular Scale)

```typescript
// Escala 1.25 (Major Third) - Harmônica e legível
export const TypeScale = {
  base: 16, // Base size
  ratio: 1.25, // Major Third
  
  // Cálculo automático
  getSize(level: number): number {
    return Math.round(this.base * Math.pow(this.ratio, level));
  },
  
  // Tamanhos pré-calculados
  sizes: {
    '-2': 10.24,  // micro
    '-1': 12.8,   // small
    '0': 16,      // base
    '1': 20,      // large
    '2': 25,      // xl
    '3': 31.25,   // 2xl
    '4': 39.06,   // 3xl
    '5': 48.83,   // 4xl
  },
};

// Aplicação prática
export const TypographyHierarchy = {
  h1: {
    size: TypeScale.sizes['4'], // 39px
    lineHeight: 1.2,
    weight: 'bold',
    letterSpacing: -0.5,
    marginBottom: Spacing['4'],
  },
  h2: {
    size: TypeScale.sizes['3'], // 31px
    lineHeight: 1.25,
    weight: 'bold',
    letterSpacing: -0.25,
    marginBottom: Spacing['3'],
  },
  h3: {
    size: TypeScale.sizes['2'], // 25px
    lineHeight: 1.3,
    weight: 'semibold',
    marginBottom: Spacing['3'],
  },
  body: {
    size: TypeScale.sizes['0'], // 16px
    lineHeight: 1.5,
    weight: 'regular',
    marginBottom: Spacing['2'],
  },
};
```

**Benefícios:**
- ✅ Proporções harmônicas
- ✅ Hierarquia visual clara
- ✅ Escalabilidade consistente
- ✅ Legibilidade otimizada

---

## 4. Espaçamento e Layout

### 4.1 Sistema de Grid Avançado

#### Problema Atual
Grid de 4px básico, sem consideração de proporções áureas.

#### Solução: Grid Harmônico

```typescript
export const GridSystem = {
  // Base: 4px (WCAG touch target mínimo / 11 = ~0.36)
  base: 4,
  
  // Escala harmônica (Fibonacci-like)
  scale: {
    '0': 0,
    '1': 4,    // 1x base
    '2': 8,    // 2x base
    '3': 12,   // 3x base
    '4': 16,   // 4x base (1rem equivalente)
    '5': 20,   // 5x base
    '6': 24,   // 6x base
    '8': 32,   // 8x base
    '10': 40,  // 10x base
    '11': 44,  // 11x base (WCAG touch target)
    '12': 48,  // 12x base
    '16': 64,  // 16x base
    '20': 80,  // 20x base
    '24': 96,  // 24x base
  },
  
  // Espaçamento semântico
  semantic: {
    // Componentes
    componentPadding: GridSystem.scale['4'],    // 16px
    componentGap: GridSystem.scale['3'],       // 12px
    componentMargin: GridSystem.scale['6'],     // 24px
    
    // Layout
    sectionPadding: GridSystem.scale['6'],      // 24px
    sectionGap: GridSystem.scale['8'],         // 32px
    pagePadding: GridSystem.scale['4'],        // 16px
    
    // Touch targets
    touchTarget: GridSystem.scale['11'],        // 44px (WCAG AAA)
    touchTargetLarge: GridSystem.scale['12'],   // 48px (confortável)
  },
  
  // Breakpoints responsivos
  breakpoints: {
    xs: 360,   // Mobile pequeno
    sm: 390,   // Mobile padrão
    md: 428,   // Mobile grande
    lg: 768,   // Tablet
    xl: 1024,  // Desktop
  },
  
  // Colunas do grid
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  
  // Gutter (espaço entre colunas)
  gutter: {
    mobile: GridSystem.scale['4'],  // 16px
    tablet: GridSystem.scale['6'],  // 24px
    desktop: GridSystem.scale['8'], // 32px
  },
};
```

---

### 4.2 Layout Adaptativo e Fluido

#### Sistema de Containers Responsivos

```typescript
export const ContainerSystem = {
  // Larguras máximas
  maxWidth: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  // Padding responsivo
  padding: {
    mobile: GridSystem.scale['4'],   // 16px
    tablet: GridSystem.scale['6'],   // 24px
    desktop: GridSystem.scale['8'],  // 32px
  },
  
  // Gaps responsivos
  gap: {
    mobile: GridSystem.scale['3'],   // 12px
    tablet: GridSystem.scale['4'],   // 16px
    desktop: GridSystem.scale['6'],  // 24px
  },
};
```

---

## 5. Micro-interações e Animações

### 5.1 Princípios de Animação Emocional

#### Pesquisa: Animações que Acalmam

**Princípios:**
1. **Suavidade:** Easing curves naturais (ease-out, spring)
2. **Duração:** 200-300ms (rápido mas não abrupto)
3. **Direção:** Movimentos ascendentes (positividade)
4. **Feedback:** Haptic feedback sutil

#### Sistema de Animações

```typescript
export const AnimationSystem = {
  // Durações emocionais
  duration: {
    instant: 0,      // Sem animação
    fast: 150,       // Feedback imediato
    normal: 300,     // Transições suaves
    slow: 500,       // Animações de destaque
    slower: 700,     // Animações de celebração
  },
  
  // Easing curves emocionais
  easing: {
    // Calma e suave
    calm: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
    // Natural e orgânico
    natural: [0.34, 1.56, 0.64, 1], // spring-like
    // Energético mas controlado
    energetic: [0.68, -0.55, 0.265, 1.55], // bounce
    // Suave entrada
    gentle: [0.42, 0, 0.58, 1], // ease-in-out
  },
  
  // Animações contextuais
  contextual: {
    // Celebração (streak completado)
    celebration: {
      type: 'scale + fade',
      duration: 500,
      easing: 'energetic',
      haptic: 'success',
      sound: 'celebration', // Opcional
    },
    // Confirmação (ação realizada)
    confirmation: {
      type: 'checkmark',
      duration: 300,
      easing: 'calm',
      haptic: 'light',
    },
    // Erro (ação falhou)
    error: {
      type: 'shake',
      duration: 400,
      easing: 'energetic',
      haptic: 'error',
    },
    // Loading (processando)
    loading: {
      type: 'pulse',
      duration: 1500,
      easing: 'gentle',
      loop: true,
    },
  },
};
```

---

### 5.2 Micro-interações Específicas

#### Check-in Emocional

```typescript
export const EmotionalCheckInAnimation = {
  // Seleção de emoji
  emojiSelect: {
    scale: {
      from: 1,
      to: 1.2,
      duration: 200,
      easing: 'calm',
    },
    background: {
      from: 'transparent',
      to: 'rgba(109, 169, 228, 0.15)',
      duration: 200,
      easing: 'gentle',
    },
    haptic: 'light',
  },
  
  // Confirmação de seleção
  confirmation: {
    scale: {
      from: 1.2,
      to: 1,
      duration: 300,
      easing: 'natural',
    },
    ripple: {
      type: 'circular',
      duration: 400,
      color: '#6DA9E4',
    },
    haptic: 'medium',
  },
};
```

#### Habit Tracker

```typescript
export const HabitTrackerAnimation = {
  // Completar hábito
  complete: {
    checkmark: {
      scale: {
        from: 0,
        to: 1.2,
        then: 1,
        duration: 400,
        easing: 'energetic',
      },
      rotation: {
        from: -180,
        to: 0,
        duration: 400,
        easing: 'natural',
      },
    },
    confetti: {
      type: 'particles',
      count: 20,
      duration: 1000,
      colors: ['#6DA9E4', '#FFB3D9', '#FFD93D', '#5EEAD4'],
    },
    haptic: 'success',
  },
  
  // Streak completado
  streakComplete: {
    ring: {
      scale: {
        from: 0.8,
        to: 1.2,
        duration: 600,
        easing: 'energetic',
      },
      opacity: {
        from: 1,
        to: 0,
        duration: 600,
      },
    },
    celebration: {
      type: 'full-screen',
      duration: 2000,
      message: '🔥 7 dias consecutivos!',
    },
    haptic: 'success',
  },
};
```

---

## 6. Acessibilidade Avançada

### 6.1 Sistema de Contraste Adaptativo

#### Problema: Contraste fixo não atende todos os usuários

#### Solução: Contraste Adaptativo

```typescript
export const AdaptiveContrast = {
  // Níveis de contraste
  levels: {
    standard: {
      ratio: 7.0, // WCAG AAA
      description: 'Usuários padrão',
    },
    enhanced: {
      ratio: 10.0, // WCAG AAA Enhanced
      description: 'Usuários com baixa visão moderada',
    },
    maximum: {
      ratio: 15.0, // WCAG AAA Maximum
      description: 'Usuários com baixa visão severa',
    },
  },
  
  // Detecção automática
  detectUserPreference(): 'standard' | 'enhanced' | 'maximum' {
    // Verificar preferências do sistema
    // iOS: Accessibility > Display & Text Size > Increase Contrast
    // Android: Accessibility > Display size and text
    // Web: prefers-contrast media query
    
    if (Platform.OS === 'ios') {
      // Verificar UIAccessibility.isReduceTransparencyEnabled
    }
    
    return 'standard'; // Default
  },
  
  // Ajuste automático de cores
  adjustColorForContrast(
    baseColor: string,
    background: string,
    targetRatio: number
  ): string {
    // Algoritmo para escurecer/clarear cor até atingir ratio
    // Implementação usando HSL
    return adjustedColor;
  },
};
```

---

### 6.2 Suporte a Tecnologias Assistivas

#### Screen Readers

```typescript
export const AccessibilityLabels = {
  // Labels semânticos
  semantic: {
    button: (action: string) => `${action}. Toque para ${action.toLowerCase()}`,
    link: (destination: string) => `Link para ${destination}`,
    image: (description: string) => `Imagem: ${description}`,
    input: (label: string, required?: boolean) => 
      `${label}${required ? ' (obrigatório)' : ''}`,
  },
  
  // Estados
  states: {
    selected: 'Selecionado',
    disabled: 'Desabilitado',
    loading: 'Carregando',
    error: 'Erro',
    success: 'Sucesso',
  },
  
  // Ações
  actions: {
    open: 'Abrir',
    close: 'Fechar',
    submit: 'Enviar',
    cancel: 'Cancelar',
    delete: 'Deletar',
    edit: 'Editar',
    save: 'Salvar',
  },
};
```

#### Navegação por Teclado

```typescript
export const KeyboardNavigation = {
  // Ordem de foco
  focusOrder: {
    logical: true, // Seguir ordem visual
    skipLinks: true, // Links para pular conteúdo
  },
  
  // Atalhos de teclado
  shortcuts: {
    // Navegação
    home: 'Alt+H',
    back: 'Escape',
    search: 'Ctrl+K',
    
    // Ações
    submit: 'Enter',
    cancel: 'Escape',
    delete: 'Delete',
  },
  
  // Indicadores visuais de foco
  focusIndicator: {
    style: 'outline',
    width: '2px',
    color: '#6DA9E4',
    offset: '2px',
    radius: '4px',
  },
};
```

---

### 6.3 Modo Alto Contraste

```typescript
export const HighContrastMode = {
  // Cores de alto contraste
  colors: {
    background: {
      light: '#FFFFFF',
      dark: '#000000',
    },
    text: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    primary: {
      light: '#0000FF', // Azul puro
      dark: '#00FFFF',  // Ciano
    },
    border: {
      light: '#000000',
      dark: '#FFFFFF',
    },
  },
  
  // Ajustes visuais
  adjustments: {
    removeGradients: true,
    removeShadows: true,
    increaseBorderWidth: true,
    simplifyAnimations: true,
  },
};
```

---

## 7. Design Emocional

### 7.1 Princípios de Design Emocional para Apps Maternos

#### Pesquisa: O que mães precisam emocionalmente

1. **Validação:** "Você está fazendo certo"
2. **Acolhimento:** "Você não está sozinha"
3. **Empoderamento:** "Você é capaz"
4. **Calma:** "Respire, está tudo bem"
5. **Celebração:** "Cada pequena vitória importa"

#### Implementação: Mensagens Contextuais

```typescript
export const EmotionalMessages = {
  // Por momento
  moments: {
    morning: [
      'Bom dia, guerreira! 💙',
      'Hoje é um novo dia. Você consegue!',
      'Respire fundo. Você está pronta.',
    ],
    afternoon: [
      'Continue firme! Você está indo bem.',
      'Pequenos passos, grandes conquistas.',
      'Você é mais forte do que imagina.',
    ],
    evening: [
      'Você fez o seu melhor hoje. Descanse.',
      'Amanhã é um novo dia. Cuide-se.',
      'Você merece este momento de paz.',
    ],
    night: [
      'Boa noite, mamãe. Você é incrível.',
      'Descanse bem. Você merece.',
      'Amanhã será melhor. Acredite.',
    ],
  },
  
  // Por estado emocional
  emotions: {
    anxious: {
      message: 'Respire. Você está segura. Estou aqui com você.',
      color: '#6DA9E4', // Calm blue
      action: 'Exercício de respiração',
    },
    happy: {
      message: 'Que lindo ver você feliz! Celebre este momento!',
      color: '#FFD93D', // Sunshine
      action: 'Registrar este momento',
    },
    tired: {
      message: 'Você está cansada. Isso é normal. Descanse.',
      color: '#5EEAD4', // Mint
      action: 'Dica de descanso',
    },
    overwhelmed: {
      message: 'Um passo de cada vez. Você consegue.',
      color: '#FFB3D9', // Soft pink
      action: 'Quebrar em pequenas tarefas',
    },
  },
  
  // Por conquista
  achievements: {
    habitStreak: (days: number) => 
      `🔥 ${days} dias consecutivos! Você é incrível!`,
    emotionCheckIn: (days: number) =>
      `💙 ${days} dias cuidando de você. Continue assim!`,
    firstPost: () =>
      `🎉 Bem-vinda à comunidade! Sua voz importa.`,
  },
};
```

---

### 7.2 Ilustrações e Imagens Emocionais

#### Princípios de Ilustração

```typescript
export const IllustrationGuidelines = {
  // Estilo
  style: {
    type: 'warm, soft, inclusive',
    colors: 'Pastel, suaves, acolhedores',
    shapes: 'Arredondadas, orgânicas',
    expressions: 'Calmas, acolhedoras, empoderadoras',
  },
  
  // Representação
  representation: {
    diversity: true, // Diversidade étnica, corporal
    inclusivity: true, // Diferentes tipos de família
    reality: true, // Momentos reais, não idealizados
  },
  
  // Contextos
  contexts: {
    celebration: 'Momentos de alegria, conquistas',
    support: 'Acolhimento, comunidade',
    selfCare: 'Autocuidado, descanso',
    growth: 'Crescimento, aprendizado',
  },
};
```

---

## 8. Personalização e Adaptação

### 8.1 Sistema de Temas Personalizados

```typescript
export const ThemeCustomization = {
  // Opções de personalização
  options: {
    // Cores
    primaryColor: {
      default: '#6DA9E4',
      alternatives: ['#FFB3D9', '#5EEAD4', '#FFD93D'],
    },
    
    // Densidade
    density: {
      comfortable: {
        spacing: 1.2,
        fontSize: 1.1,
      },
      compact: {
        spacing: 0.9,
        fontSize: 1.0,
      },
      spacious: {
        spacing: 1.5,
        fontSize: 1.2,
      },
    },
    
    // Animação
    animation: {
      full: true,
      reduced: false, // Respeitar prefers-reduced-motion
      none: false,
    },
  },
  
  // Perfis pré-definidos
  profiles: {
    calm: {
      primaryColor: '#6DA9E4',
      density: 'spacious',
      animation: 'reduced',
    },
    energetic: {
      primaryColor: '#FFD93D',
      density: 'comfortable',
      animation: 'full',
    },
    peaceful: {
      primaryColor: '#5EEAD4',
      density: 'spacious',
      animation: 'reduced',
    },
  },
};
```

---

### 8.2 Adaptação Contextual

```typescript
export const ContextualAdaptation = {
  // Por fase da maternidade
  maternityPhase: {
    pregnant: {
      colors: ['#6DA9E4', '#FFB3D9'], // Calm + Warm
      content: 'focused on pregnancy',
      features: ['tracking', 'tips', 'community'],
    },
    newMom: {
      colors: ['#FFB3D9', '#5EEAD4'], // Warm + Peaceful
      content: 'focused on newborn care',
      features: ['sleep', 'feeding', 'support'],
    },
    experienced: {
      colors: ['#6DA9E4', '#FFD93D'], // Calm + Energetic
      content: 'focused on growth',
      features: ['community', 'sharing', 'mentoring'],
    },
  },
  
  // Por preferências do usuário
  userPreferences: {
    visual: {
      highContrast: AdaptiveContrast.levels.maximum,
      largeText: TypographySystem.sizes.large,
      reducedMotion: AnimationSystem.duration.fast,
    },
    functional: {
      voiceInput: true,
      hapticFeedback: true,
      notifications: 'smart',
    },
  },
};
```

---

## 9. Performance Visual

### 9.1 Otimização de Renderização

```typescript
export const PerformanceOptimizations = {
  // Lazy loading de imagens
  imageLoading: {
    strategy: 'lazy',
    placeholder: 'blur',
    sizes: {
      thumbnail: '100w',
      card: '400w',
      hero: '800w',
    },
  },
  
  // Redução de re-renders
  memoization: {
    components: true,
    calculations: true,
    styles: true,
  },
  
  // Animações performáticas
  animations: {
    useNativeDriver: true, // React Native
    willChange: true, // Web
    transform: true, // Usar transform em vez de position
  },
};
```

---

### 9.2 Progressive Enhancement

```typescript
export const ProgressiveEnhancement = {
  // Níveis de funcionalidade
  levels: {
    basic: {
      // Funcionalidade essencial sem JS
      html: true,
      css: true,
      js: false,
    },
    enhanced: {
      // Funcionalidade completa
      html: true,
      css: true,
      js: true,
      animations: true,
    },
    premium: {
      // Experiência premium
      html: true,
      css: true,
      js: true,
      animations: true,
      haptics: true,
      voice: true,
    },
  },
  
  // Detecção de capacidade
  detectCapabilities(): 'basic' | 'enhanced' | 'premium' {
    // Verificar suporte a features
    return 'enhanced'; // Default
  },
};
```

---

## 10. Testes e Validação

### 10.1 Checklist de Validação Visual

```typescript
export const VisualValidationChecklist = {
  // Cores
  colors: {
    'Contraste WCAG AAA (7:1)': false,
    'Modo escuro completo': false,
    'Alto contraste opcional': false,
    'Daltonismo (protanopia, deuteranopia)': false,
  },
  
  // Tipografia
  typography: {
    'Tamanho mínimo 16pt': false,
    'Line height adequado (1.5+)': false,
    'Hierarquia clara': false,
    'Legibilidade em diferentes tamanhos': false,
  },
  
  // Layout
  layout: {
    'Touch targets 44pt+': false,
    'Espaçamento consistente': false,
    'Grid alinhado': false,
    'Responsividade': false,
  },
  
  // Interação
  interaction: {
    'Feedback visual claro': false,
    'Estados visíveis (hover, active, disabled)': false,
    'Animações suaves': false,
    'Haptic feedback': false,
  },
  
  // Acessibilidade
  accessibility: {
    'Screen reader labels': false,
    'Navegação por teclado': false,
    'Foco visível': false,
    'Skip links': false,
  },
};
```

---

### 10.2 Ferramentas de Validação

```typescript
export const ValidationTools = {
  // Contraste
  contrast: {
    tool: 'WebAIM Contrast Checker',
    threshold: 7.0,
    validate: (foreground: string, background: string) => {
      const ratio = getContrastRatio(foreground, background);
      return ratio >= 7.0;
    },
  },
  
  // Touch targets
  touchTargets: {
    tool: 'Manual inspection',
    threshold: 44,
    validate: (element: HTMLElement) => {
      const { width, height } = element.getBoundingClientRect();
      return Math.min(width, height) >= 44;
    },
  },
  
  // Acessibilidade
  accessibility: {
    tools: [
      'axe DevTools',
      'WAVE',
      'Lighthouse',
      'VoiceOver (iOS)',
      'TalkBack (Android)',
    ],
    score: {
      minimum: 90,
      target: 100,
    },
  },
};
```

---

## 🎯 Recomendações Finais Prioritizadas

### 🔴 CRÍTICO (Implementar Imediatamente)

1. **Adicionar Cor Primária #6DA9E4**
   - Criar variante `primary.soft` = `#6DA9E4`
   - OU substituir `primary.main` se aprovado
   - Criar `primary.text` = `#2E5A7A` para texto (contraste 7:1+)

2. **Sistema de Contraste Adaptativo**
   - Implementar detecção de preferências do sistema
   - Ajustar cores automaticamente para 7:1, 10:1 ou 15:1
   - Adicionar modo alto contraste opcional

3. **Validação Automática de Contraste**
   - Script para validar todos os pares de cores
   - CI/CD check para prevenir regressões
   - Documentação de pares validados

### 🟡 ALTA (Implementar em Seguida)

4. **Sistema de Cores Emocionais**
   - Implementar `EmotionalColors` por contexto
   - Aplicar em check-in emocional
   - Integrar com mensagens contextuais

5. **Micro-interações Avançadas**
   - Animações de celebração (streaks)
   - Feedback haptic em todas as interações
   - Transições suaves entre estados

6. **Sistema de Elevação**
   - Implementar níveis 0-24
   - Aplicar em componentes
   - Documentar uso semântico

### 🟢 MÉDIA (Melhorias Incrementais)

7. **Tipografia Emocional**
   - Implementar escala modular
   - Adicionar pesos contextuais
   - Melhorar hierarquia visual

8. **Personalização de Tema**
   - Opções de densidade
   - Cores alternativas
   - Perfis pré-definidos

9. **Adaptação Contextual**
   - Por fase da maternidade
   - Por preferências do usuário
   - Por momento do dia

---

## 📚 Referências e Pesquisas

### Design Systems
- Material Design 3 (Google)
- Human Interface Guidelines (Apple)
- Carbon Design System (IBM)

### Acessibilidade
- WCAG 2.2 Guidelines
- WebAIM Contrast Checker
- A11y Project

### Psicologia das Cores
- "Color Psychology in Healthcare" (Journal of Environmental Psychology)
- "Emotional Design" (Don Norman)
- "Designing for Emotion" (Aarron Walter)

### Apps Maternos (Benchmark)
- Ovia Pregnancy
- Flo
- Peanut
- What to Expect

---

**Documento criado com:** Expertise em Design Systems, UX/UI, Acessibilidade, Psicologia do Design  
**Versão:** 2.0 - Expert Level  
**Data:** 2025-01-27

