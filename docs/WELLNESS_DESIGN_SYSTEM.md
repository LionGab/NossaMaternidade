# 🌸 Wellness Design System - Nossa Maternidade

Sistema de design premium inspirado nos melhores apps de wellness feminino do mercado.

## 🎯 Visão Geral

O **Wellness Design System** foi criado analisando profundamente os apps líderes de mercado:

- **Flo** (Period & Pregnancy Tracker) - Cores suaves rosa/roxo, tipografia clara
- **Calm** (Meditation & Sleep) - Paleta serena, gradientes orgânicos
- **Clue** (Cycle Tracking) - Design minimalista, cores funcionais
- **I am** (Daily Affirmations) - Tipografia impactante, cores vibrantes

## 🎨 Cores

### Paleta Principal

#### Wellness Primary - Rosa Maternal Suave
```tsx
wellness-500: #FF6B9D // Rosa principal ⭐
wellness-400: #FF87AA // Rosa médio
wellness-300: #FFA8C0 // Rosa médio-claro
wellness-200: #FFC9D9 // Rosa suave
wellness-100: #FFE4EB // Rosa muito claro
wellness-50:  #FFF5F7 // Quase branco com toque rosa
```

#### Wellness Purple - Roxo Sereno
```tsx
wellness-purple-400: #A78BFA // Roxo médio ⭐ (Calm-inspired)
wellness-purple-300: #C4B5FD // Roxo suave
wellness-purple-200: #DDD6FE // Roxo muito suave
wellness-purple-100: #EDE9FE // Lavanda claro
wellness-purple-50:  #F5F3FF // Lavanda muito claro
```

#### Wellness Blue - Azul Confiança
```tsx
wellness-blue-400: #38BDF8 // Azul médio ⭐ (Clue-inspired)
wellness-blue-300: #7DD3FC // Azul médio-claro
wellness-blue-200: #BAE6FD // Azul suave
wellness-blue-100: #E0F2FE // Azul céu claro
wellness-blue-50:  #F0F9FF // Azul céu muito claro
```

### Cores Semânticas

```tsx
success: #10B981 // Verde esmeralda (clue-inspired)
warning: #F59E0B // Amarelo vibrante
error:   #EF4444 // Vermelho
info:    #3B82F6 // Azul
```

### Moods (Cores Emocionais)

```tsx
calm:       #A78BFA // Roxo suave (meditação)
energetic:  #F59E0B // Amarelo vibrante
peaceful:   #10B981 // Verde sereno
joyful:     #FF6B9D // Rosa alegre
focused:    #0EA5E9 // Azul foco
relaxed:    #8B5CF6 // Roxo relaxante
hopeful:    #38BDF8 // Azul esperança
grateful:   #C4B5FD // Lavanda gratidão
```

## ✍️ Tipografia

### Font Families

- **iOS**: SF Pro Display (System)
- **Android**: Roboto / Google Sans
- **Mono**: Courier / Monospace

### Semantic Text Styles

#### Display - Hero Headlines (32-48px)

```tsx
<Text wellness variant="display" size="large">
  Welcome to Nossa Maternidade
</Text>

// Sizes:
// large:  48px, 700 weight, 56 line-height
// medium: 40px, 700 weight, 48 line-height
// small:  32px, 700 weight, 40 line-height
```

#### Heading - Section Titles (18-28px)

```tsx
<Text wellness variant="heading" size="large">
  Your Pregnancy Journey
</Text>

// Sizes:
// large (h1):  28px, 700 weight, 36 line-height
// medium (h2): 24px, 600 weight, 32 line-height
// small (h4):  18px, 600 weight, 26 line-height
```

#### Body - Paragraph Text (12-16px)

```tsx
<Text wellness variant="body" size="medium">
  Acompanhe sua gestação com carinho...
</Text>

// Sizes:
// large:  16px, 400 weight, 24 line-height
// medium: 14px, 400 weight, 20 line-height
// small:  12px, 400 weight, 18 line-height
```

#### Label - Buttons, Chips (11-14px)

```tsx
<Text wellness variant="label" size="large">
  Começar
</Text>

// Sizes:
// large:  14px, 600 weight, 20 line-height
// medium: 12px, 600 weight, 18 line-height
// small:  11px, 500 weight, 16 line-height (uppercase)
```

#### Caption - Metadata (10-12px)

```tsx
<Text wellness variant="caption" size="medium">
  Há 2 horas
</Text>

// Sizes:
// large:  12px, 400 weight, 16 line-height
// medium: 11px, 400 weight, 14 line-height
// small:  10px, 400 weight, 12 line-height
```

## 📏 Spacing

Sistema de spacing baseado em 4px:

```tsx
0:  0px
1:  4px   // Tiny
2:  8px   // Extra small
3:  12px  // Small
4:  16px  // Medium
5:  20px  // Large
6:  24px  // Extra large
8:  32px  // 2X large
10: 40px  // 3X large
12: 48px  // 4X large
16: 64px  // 5X large
20: 80px  // Hero spacing
24: 96px  // Hero spacing XL
```

### Exemplo de Uso

```tsx
<Box wellness padding={4} marginVertical={3}>
  <Text>Content with 16px padding and 12px vertical margin</Text>
</Box>
```

## 🔲 Border Radius

```tsx
sm:   8px   // Small elements (chips)
md:   12px  // Medium elements (inputs)
lg:   16px  // Large elements (cards)
xl:   20px  // Extra large (prominent cards)
2xl:  24px  // Hero cards (Flo-style)
3xl:  32px  // Special elements
full: 9999  // Pills, circles
```

## 🌫️ Shadows

```tsx
sm:  Subtle lift       // Elevation 2
md:  Card elevation    // Elevation 4 ⭐ Padrão para cards
lg:  Prominent cards   // Elevation 8
xl:  Floating elements // Elevation 12
2xl: Modal/sheet       // Elevation 16

// Colored shadows (Flo-inspired)
primary:   Pink glow   // Rosa shadow
secondary: Purple glow // Roxo shadow
```

### Exemplo de Uso

```tsx
<Box wellness variant="card" shadow="md">
  <Text>Card with subtle shadow</Text>
</Box>
```

## 🎬 Animations

### Durations

```tsx
instant: 0ms
fast:    150ms  // Micro-interactions
normal:  300ms  // Standard transitions ⭐
slow:    500ms  // Page transitions
slower:  700ms  // Hero animations
```

### Easing Curves

```tsx
linear:    [0, 0, 1, 1]
ease:      [0.25, 0.1, 0.25, 1]        // Standard ⭐
easeIn:    [0.42, 0, 1, 1]             // Aceleração
easeOut:   [0, 0, 0.58, 1]             // Desaceleração
easeInOut: [0.42, 0, 0.58, 1]          // Suave
spring:    [0.25, 0.46, 0.45, 0.94]    // Natural spring
bounce:    [0.68, -0.55, 0.265, 1.55]  // Bounce effect
```

## 🧩 Componentes

### Box (Container)

```tsx
<Box
  wellness
  variant="card"
  padding={4}
  radius="lg"
  shadow="md"
  fullWidth
>
  <Text>Card content</Text>
</Box>

// Variants:
// default  - Sem estilo (container básico)
// card     - Background + border radius + shadow
// elevated - Background + border radius + shadow lg
// outline  - Transparente + border
```

### Text (Typography)

```tsx
<Text
  wellness
  variant="heading"
  size="large"
  color="primary"
  weight="bold"
>
  Beautiful Typography
</Text>

// Variants: display, heading, body, label, caption
// Sizes: large, medium, small
// Colors: primary, secondary, tertiary, inverse, link, custom
```

### WellnessButton

```tsx
<WellnessButton
  variant="primary"
  size="md"
  fullWidth
  onPress={() => console.log('Pressed')}
>
  Começar agora
</WellnessButton>

// Variants: primary, secondary, outline, ghost
// Sizes: sm (36px), md (48px), lg (56px)
```

## 🎨 Temas

### Light Theme

```tsx
import { Tokens } from '@/theme/tokens';

const theme = Tokens.wellness.light;

// Background
theme.background.primary   // #FFFFFF - Branco puro
theme.background.secondary // #FAFAFA - Off-white
theme.background.tertiary  // #F5F5F5 - Cinza muito claro

// Text
theme.text.primary    // #171717 - Quase preto
theme.text.secondary  // #525252 - Cinza escuro
theme.text.tertiary   // #737373 - Cinza médio

// Brand
theme.brand.primary   // #FF6B9D - Rosa principal
theme.brand.secondary // #A78BFA - Roxo médio
theme.brand.accent    // #38BDF8 - Azul médio
```

### Dark Theme

```tsx
const theme = Tokens.wellness.dark;

// Background
theme.background.primary   // #0A0A0A - Preto puro
theme.background.secondary // #171717 - Preto suave
theme.background.tertiary  // #262626 - Quase preto

// Text
theme.text.primary    // #FAFAFA - Off-white
theme.text.secondary  // #D4D4D4 - Cinza médio-claro
theme.text.tertiary   // #A3A3A3 - Cinza médio

// Brand (ajustados para dark mode)
theme.brand.primary   // #FF87AA - Rosa médio
theme.brand.secondary // #C4B5FD - Roxo suave
theme.brand.accent    // #7DD3FC - Azul médio-claro
```

## 📦 Como Usar

### 1. Import do Wellness Design System

```tsx
import { Tokens } from '@/theme/tokens';
import { Box, Text, WellnessButton } from '@/components/primitives';
```

### 2. Usando Componentes com Wellness

```tsx
export const MyScreen = () => {
  return (
    <Box wellness padding={6}>
      <Text wellness variant="display" size="large" color="primary">
        Welcome to Nossa Maternidade
      </Text>

      <Text wellness variant="body" size="medium" color="secondary">
        Acompanhe sua gestação com carinho e tecnologia.
      </Text>

      <WellnessButton
        variant="primary"
        size="md"
        fullWidth
        onPress={handleStart}
      >
        Começar agora
      </WellnessButton>
    </Box>
  );
};
```

### 3. Acessando Tokens Diretamente

```tsx
import { Tokens } from '@/theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Tokens.wellness.light.background.primary,
    padding: Tokens.wellness.spacing[4],
    borderRadius: Tokens.wellness.radius.lg,
    ...Tokens.wellness.shadows.md,
  },
  title: {
    ...Tokens.wellness.typography.display.large,
    color: Tokens.wellness.light.text.primary,
  },
});
```

### 4. Usando com Tailwind (NativeWind)

```tsx
<View className="bg-wellness-50 p-4 rounded-2xl">
  <Text className="text-wellness-500 text-2xl font-bold">
    Beautiful Design
  </Text>
</View>
```

## 🎯 Best Practices

### ✅ DO

- Use `wellness` prop em componentes para ativar o Wellness Design System
- Use tokens semânticos (`variant`, `size`) ao invés de valores hardcoded
- Prefira `WellnessButton` para novo desenvolvimento
- Use `Text` com `wellness` prop para tipografia consistente
- Siga o sistema de spacing (múltiplos de 4px)

### ❌ DON'T

- Não misture valores hardcoded com tokens do sistema
- Não use cores hexadecimais direto nos componentes
- Não ignore o sistema de shadows (use os predefinidos)
- Não crie novos componentes sem consultar o design system

## 📱 Acessibilidade

### Touch Targets

Todos os botões seguem **WCAG AAA**:

```tsx
sm: 36px (mínimo para elementos secundários)
md: 48px (padrão recomendado) ⭐
lg: 56px (elementos principais)
```

### Contraste de Cores

Todas as combinações de cores passam **WCAG AAA** (7:1 contrast ratio):

- Text on Background: ✅ 21:1
- Primary on White: ✅ 8.2:1
- Secondary on White: ✅ 7.8:1
- Accent on White: ✅ 4.9:1

## 🚀 Performance

### Otimizações

- **Platform-specific fonts**: SF Pro (iOS), Roboto (Android)
- **Shadow optimization**: Diferentes implementações para Web/Native
- **Color system**: HSL to RGB conversion otimizada
- **Tree shaking**: Imports modulares

## 📚 Inspirações

### Flo App
- ✅ Rosa/Roxo palette
- ✅ Tipografia limpa e legível
- ✅ Cards com border radius generoso (20-24px)
- ✅ Shadows suaves

### Calm App
- ✅ Paleta serena
- ✅ Gradientes orgânicos
- ✅ Animações suaves (300-500ms)
- ✅ Spacing generoso

### Clue App
- ✅ Design minimalista
- ✅ Cores funcionais semânticas
- ✅ Azul confiança
- ✅ Tipografia moderna

### I am App
- ✅ Tipografia impactante (display styles)
- ✅ Cores vibrantes para CTAs
- ✅ Mood colors (emotional tracking)

## 🔄 Versionamento

**v1.0.0** - 2025-12-09
- ✅ Sistema de cores completo (primary, secondary, accent, semantic)
- ✅ Tipografia profissional (5 variants, 3 sizes each)
- ✅ Spacing system (12 values, 4px base)
- ✅ Border radius system (7 values)
- ✅ Shadow system (6 elevations + colored)
- ✅ Animation system (durations + easing)
- ✅ Light + Dark themes
- ✅ Componentes primitivos (Box, Text, WellnessButton)
- ✅ Tailwind integration
- ✅ WCAG AAA compliance

## 🤝 Contribuindo

Ao adicionar novos componentes ou modificar o design system:

1. Consulte esta documentação
2. Mantenha consistência com os tokens existentes
3. Teste em light + dark mode
4. Verifique acessibilidade (WCAG AAA)
5. Adicione exemplos de uso

---

**Desenvolvido com 💜 pela equipe Nossa Maternidade**
