# 🌸 Wellness Design System - Guia de Uso

**Status:** ✅ ATIVO - Sistema premium inspirado em Flo, Calm, Clue
**Versão:** 1.0.0

---

## 🎯 O que é o Wellness Design System?

Sistema de design **premium** criado especificamente para apps de wellness feminino, inspirado nos melhores do mercado:

- **Flo** - Cores suaves rosa/roxo, tipografia clara
- **Calm** - Paleta serena, gradientes suaves
- **Clue** - Design minimalista, cores funcionais
- **I am** - Tipografia impactante, cores vibrantes

---

## 🚀 Como Usar

### 1. Import do Hook

```tsx
import { useWellnessTheme } from '@/theme/ThemeContext';

export const MyComponent = () => {
  const wellness = useWellnessTheme();

  // Agora você tem acesso a:
  // - wellness.colors
  // - wellness.theme (light/dark)
  // - wellness.typography
  // - wellness.spacing
  // - wellness.radius
  // - wellness.shadows
  // - wellness.animations
  // - wellness.components
  // - wellness.isDark
};
```

### 2. Exemplo Completo

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useWellnessTheme } from '@/theme/ThemeContext';

export const WellnessCard = () => {
  const wellness = useWellnessTheme();

  return (
    <View
      style={{
        // Background
        backgroundColor: wellness.theme.background.primary,

        // Spacing
        padding: wellness.spacing[4],
        gap: wellness.spacing[3],

        // Border
        borderRadius: wellness.radius.lg,

        // Shadow
        ...wellness.shadows.md,
      }}
    >
      {/* Título com tipografia wellness */}
      <Text
        style={{
          ...wellness.typography.heading.h2,
          color: wellness.theme.text.primary,
        }}
      >
        Bem-vinda!
      </Text>

      {/* Texto body */}
      <Text
        style={{
          ...wellness.typography.body.large,
          color: wellness.theme.text.secondary,
        }}
      >
        Design premium inspirado em Flo e Calm
      </Text>

      {/* Botão primary */}
      <TouchableOpacity
        style={{
          backgroundColor: wellness.colors.primary[500],
          paddingVertical: wellness.spacing[3],
          paddingHorizontal: wellness.spacing[5],
          borderRadius: wellness.radius.md,
          alignItems: 'center',
          ...wellness.shadows.primary,
        }}
      >
        <Text
          style={{
            ...wellness.typography.label.large,
            color: wellness.theme.text.inverse,
          }}
        >
          Começar
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🎨 Paleta de Cores

### Primary - Rosa Maternal Suave

```tsx
wellness.colors.primary[500]  // #FF6B9D ⭐ MAIN
wellness.colors.primary[400]  // #FF87AA (lighter)
wellness.colors.primary[600]  // #F24C83 (darker)
```

### Secondary - Roxo Sereno

```tsx
wellness.colors.secondary[400]  // #A78BFA ⭐ MAIN (Calm-inspired)
wellness.colors.secondary[500]  // #8B5CF6 (darker)
```

### Accent - Azul Confiança

```tsx
wellness.colors.accent[400]  // #38BDF8 ⭐ MAIN (Clue-inspired)
wellness.colors.accent[500]  // #0EA5E9 (darker)
```

### Moods - Cores Emocionais

```tsx
wellness.colors.moods.calm       // #A78BFA
wellness.colors.moods.energetic  // #F59E0B
wellness.colors.moods.peaceful   // #10B981
wellness.colors.moods.joyful     // #FF6B9D
wellness.colors.moods.focused    // #0EA5E9
wellness.colors.moods.relaxed    // #8B5CF6
wellness.colors.moods.hopeful    // #38BDF8
wellness.colors.moods.grateful   // #C4B5FD
```

---

## ✍️ Tipografia

### Display - Hero Headlines

```tsx
// Large (48px, bold)
wellness.typography.display.large

// Medium (40px, bold)
wellness.typography.display.medium

// Small (32px, bold)
wellness.typography.display.small
```

### Headings - Títulos de Seção

```tsx
// H1 (28px, bold)
wellness.typography.heading.h1

// H2 (24px, semibold)
wellness.typography.heading.h2

// H3 (20px, semibold)
wellness.typography.heading.h3

// H4 (18px, semibold)
wellness.typography.heading.h4
```

### Body - Texto Principal

```tsx
// Large (16px, regular)
wellness.typography.body.large

// Medium (14px, regular)
wellness.typography.body.medium

// Small (12px, regular)
wellness.typography.body.small
```

### Labels - Botões, Chips

```tsx
// Large (14px, semibold)
wellness.typography.label.large

// Medium (12px, semibold)
wellness.typography.label.medium

// Small (11px, medium, uppercase)
wellness.typography.label.small
```

### Captions - Metadata

```tsx
// Large (12px, regular)
wellness.typography.caption.large

// Medium (11px, regular)
wellness.typography.caption.medium

// Small (10px, regular)
wellness.typography.caption.small
```

---

## 📏 Spacing (4px Grid)

```tsx
wellness.spacing[1]   // 4px
wellness.spacing[2]   // 8px
wellness.spacing[3]   // 12px
wellness.spacing[4]   // 16px ⭐ MOST COMMON
wellness.spacing[5]   // 20px
wellness.spacing[6]   // 24px
wellness.spacing[8]   // 32px
wellness.spacing[10]  // 40px
wellness.spacing[12]  // 48px
```

---

## 🔲 Border Radius

```tsx
wellness.radius.sm    // 8px
wellness.radius.md    // 12px ⭐ INPUTS
wellness.radius.lg    // 16px ⭐ CARDS
wellness.radius.xl    // 20px
wellness.radius['2xl'] // 24px (Flo-style)
wellness.radius.full  // 9999px (pills)
```

---

## 🌫️ Shadows

```tsx
wellness.shadows.sm        // Subtle lift
wellness.shadows.md        // Card elevation ⭐ DEFAULT
wellness.shadows.lg        // Prominent cards
wellness.shadows.xl        // Floating elements
wellness.shadows['2xl']    // Modals

// Colored shadows (Flo-inspired)
wellness.shadows.primary   // Pink glow
wellness.shadows.secondary // Purple glow
```

---

## 🎬 Animations

### Durations

```tsx
wellness.animations.duration.instant  // 0ms
wellness.animations.duration.fast     // 150ms ⭐ MICRO
wellness.animations.duration.normal   // 300ms ⭐ STANDARD
wellness.animations.duration.slow     // 500ms
wellness.animations.duration.slower   // 700ms
```

### Easing

```tsx
wellness.animations.easing.linear
wellness.animations.easing.ease
wellness.animations.easing.easeIn
wellness.animations.easing.easeOut
wellness.animations.easing.easeInOut
wellness.animations.easing.spring     // Natural
wellness.animations.easing.bounce
```

---

## 🧩 Componentes Prontos

### WellnessButton

```tsx
import { WellnessButton } from '@/components/primitives';

<WellnessButton
  variant="primary"    // primary, secondary, outline, ghost
  size="md"            // sm, md, lg
  fullWidth
  onPress={handlePress}
>
  Começar Agora
</WellnessButton>
```

### Exemplo Completo

```tsx
import { WellnessExampleCard } from '@/components/examples/WellnessExampleCard';

<WellnessExampleCard />
```

---

## 🎯 Quando Usar Wellness vs Base Theme

### Use Wellness Design Para:

- ✅ Telas principais (Home, Chat, Perfil)
- ✅ Features premium
- ✅ Experiência "deluxe"
- ✅ Telas focadas em bem-estar emocional
- ✅ Onboarding
- ✅ Marketing pages

### Use Base Theme Para:

- ✅ Componentes utilitários
- ✅ Settings/configurações
- ✅ Listas simples
- ✅ Formulários padrão
- ✅ Quando não precisa de "extra polish"

---

## 📦 Estrutura Completa

```tsx
const wellness = useWellnessTheme();

// Colors
wellness.colors.primary
wellness.colors.secondary
wellness.colors.accent
wellness.colors.semantic
wellness.colors.moods

// Theme (light/dark aware)
wellness.theme.background
wellness.theme.text
wellness.theme.border
wellness.theme.brand
wellness.theme.semantic

// Typography
wellness.typography.display
wellness.typography.heading
wellness.typography.body
wellness.typography.label
wellness.typography.caption

// Layout
wellness.spacing
wellness.radius
wellness.shadows
wellness.animations

// Components
wellness.components.button
wellness.components.card
wellness.components.input
wellness.components.chip

// Dark mode
wellness.isDark
```

---

## ⚡ Performance Tips

### 1. Use useMemo para estilos complexos

```tsx
const styles = useMemo(() => ({
  card: {
    backgroundColor: wellness.theme.background.primary,
    padding: wellness.spacing[4],
    ...wellness.shadows.md,
  },
}), [wellness]);
```

### 2. Extraia estilos estáticos

```tsx
const staticStyles = {
  borderRadius: wellness.radius.lg,  // ❌ Recria todo render
};

// Melhor:
const STATIC_RADIUS = Tokens.wellness.radius.lg;
const staticStyles = {
  borderRadius: STATIC_RADIUS,  // ✅ Uma vez só
};
```

---

## 🎨 Exemplos Práticos

### Card de Mood Tracking

```tsx
export const MoodCard = () => {
  const wellness = useWellnessTheme();
  const [selectedMood, setSelectedMood] = useState('calm');

  return (
    <View style={{
      backgroundColor: wellness.theme.background.primary,
      padding: wellness.spacing[5],
      borderRadius: wellness.radius.xl,
      ...wellness.shadows.lg,
    }}>
      <Text style={{
        ...wellness.typography.heading.h2,
        color: wellness.theme.text.primary,
        marginBottom: wellness.spacing[4],
      }}>
        Como você está se sentindo?
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wellness.spacing[2],
      }}>
        {Object.entries(wellness.colors.moods).map(([mood, color]) => (
          <TouchableOpacity
            key={mood}
            onPress={() => setSelectedMood(mood)}
            style={{
              backgroundColor: selectedMood === mood ? color : wellness.theme.background.secondary,
              paddingVertical: wellness.spacing[3],
              paddingHorizontal: wellness.spacing[4],
              borderRadius: wellness.radius.full,
              borderWidth: 2,
              borderColor: color,
            }}
          >
            <Text style={{
              ...wellness.typography.label.medium,
              color: selectedMood === mood ? '#fff' : wellness.theme.text.primary,
            }}>
              {mood}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
```

---

## 📚 Recursos

- **Código:** `/src/theme/wellnessDesign.ts`
- **Hook:** `/src/theme/ThemeContext.tsx` (`useWellnessTheme`)
- **Exemplo:** `/src/components/examples/WellnessExampleCard.tsx`
- **Botão:** `/src/components/primitives/WellnessButton.tsx`

---

**Desenvolvido com 💜 para proporcionar a melhor experiência wellness**

Last Updated: December 9, 2025
