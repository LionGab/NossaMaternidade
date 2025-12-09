# 🎨 Nossa Maternidade Design System - Official Guide

**Version:** 2.0
**Last Updated:** December 9, 2025
**Status:** ✅ PRODUCTION - This is the OFFICIAL and ONLY design system to use

---

## ⚠️ IMPORTANT: Single Source of Truth

**USE THIS:** `/src/theme/tokens.ts` (1,530 lines - Used in 100+ files)

**DO NOT USE:**
- ❌ `/src/theme/wellnessDesign.ts` - DEPRECATED (unused code)
- ❌ `/src/theme/cottonCandyTheme.ts` - Use tokens.ts instead
- ❌ `/src/theme/modernTokens.ts` - Use tokens.ts instead
- ❌ `/src/constants/Theme.ts` - Legacy, avoid

---

## 🎯 Quick Start

```tsx
// ✅ CORRECT: Import from tokens
import { Tokens, ColorTokens } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeContext';

export const MyComponent = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.background.canvas,
      padding: Tokens.spacing['4'],
      borderRadius: Tokens.radius.lg,
    }}>
      <Text style={{ color: colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
};
```

---

## 🎨 Colors

### Brand Colors (Primary)

```tsx
// Rosa Magenta - Main brand color
ColorTokens.primary[500]  // #E91E63 ⭐ MAIN
ColorTokens.primary[400]  // #EC407A (lighter)
ColorTokens.primary[600]  // #D81B60 (darker)

// Roxo Vibrante - Secondary
ColorTokens.secondary[500]  // #9C27B0 ⭐ MAIN
ColorTokens.secondary[400]  // #AB47BC (lighter)
ColorTokens.secondary[600]  // #8E24AA (darker)
```

### Accessing via Theme (Recommended)

```tsx
const { colors } = useTheme();

// Background colors (theme-aware)
colors.background.canvas    // Main background
colors.background.card      // Card background
colors.background.elevated  // Elevated surfaces
colors.background.input     // Input fields

// Text colors (theme-aware)
colors.text.primary     // Main text
colors.text.secondary   // Secondary text
colors.text.tertiary    // Tertiary text
colors.text.inverse     // Inverse (white on dark)
colors.text.link        // Links

// Border colors (theme-aware)
colors.border.light     // Light borders
colors.border.medium    // Medium borders
colors.border.focus     // Focus state
```

### Semantic Colors

```tsx
// Status colors
ColorTokens.success[500]  // #10B981 (green)
ColorTokens.warning[500]  // #F59E0B (amber)
ColorTokens.error[500]    // #EF4444 (red)
ColorTokens.info[500]     // #3B82F6 (blue)

// Mood colors (emotion tracking)
ColorTokens.mood.happy    // #FFD93D
ColorTokens.mood.calm     // #6BCB77
ColorTokens.mood.anxious  // #FF6B6B
```

### ⚠️ DO NOT USE Hardcoded Colors

```tsx
// ❌ BAD - Hardcoded hex
backgroundColor: '#E91E63'
color: 'rgba(255, 255, 255, 0.5)'

// ✅ GOOD - Use tokens
backgroundColor: ColorTokens.primary[500]
backgroundColor: ColorTokens.overlay.light
```

---

## ✍️ Typography

### Font Sizes

```tsx
Tokens.typography.sizes['3xs']  // 10
Tokens.typography.sizes.xs      // 12
Tokens.typography.sizes.sm      // 14
Tokens.typography.sizes.base    // 16 ⭐ DEFAULT
Tokens.typography.sizes.lg      // 18
Tokens.typography.sizes.xl      // 20
Tokens.typography.sizes['2xl']  // 24
Tokens.typography.sizes['3xl']  // 28
Tokens.typography.sizes['4xl']  // 32
```

### Semantic Text Styles (Recommended)

```tsx
import { TextStyles } from '@/theme/tokens';

// Display - Hero headlines
<Text style={TextStyles.displayLarge}>Welcome</Text>
<Text style={TextStyles.displayMedium}>Welcome</Text>
<Text style={TextStyles.displaySmall}>Welcome</Text>

// Headings - Section titles
<Text style={TextStyles.h1}>Heading 1</Text>
<Text style={TextStyles.h2}>Heading 2</Text>
<Text style={TextStyles.h3}>Heading 3</Text>

// Body - Main text
<Text style={TextStyles.bodyLarge}>Paragraph</Text>
<Text style={TextStyles.bodyMedium}>Paragraph</Text>
<Text style={TextStyles.bodySmall}>Paragraph</Text>

// Labels - Buttons, chips
<Text style={TextStyles.labelLarge}>Button</Text>
<Text style={TextStyles.labelMedium}>Chip</Text>

// Captions - Metadata
<Text style={TextStyles.caption}>Timestamp</Text>
```

### Font Weights

```tsx
Tokens.typography.weights.light      // '300'
Tokens.typography.weights.regular    // '400'
Tokens.typography.weights.medium     // '500'
Tokens.typography.weights.semibold   // '600' ⭐ BUTTONS
Tokens.typography.weights.bold       // '700' ⭐ HEADINGS
Tokens.typography.weights.extrabold  // '800'
```

---

## 📏 Spacing

System based on 4px grid:

```tsx
Tokens.spacing['0']   // 0px
Tokens.spacing['1']   // 4px
Tokens.spacing['2']   // 8px
Tokens.spacing['3']   // 12px
Tokens.spacing['4']   // 16px ⭐ MOST COMMON
Tokens.spacing['5']   // 20px
Tokens.spacing['6']   // 24px
Tokens.spacing['8']   // 32px
Tokens.spacing['10']  // 40px
Tokens.spacing['12']  // 48px
Tokens.spacing['16']  // 64px
Tokens.spacing['20']  // 80px
```

### Usage Example

```tsx
<View style={{
  padding: Tokens.spacing['4'],        // 16px all sides
  paddingHorizontal: Tokens.spacing['6'], // 24px horizontal
  marginBottom: Tokens.spacing['3'],   // 12px bottom
  gap: Tokens.spacing['2'],            // 8px gap
}}>
```

---

## 🔲 Border Radius

```tsx
Tokens.radius.none    // 0px
Tokens.radius.sm      // 4px
Tokens.radius.md      // 8px
Tokens.radius.lg      // 12px ⭐ CARDS
Tokens.radius.xl      // 16px
Tokens.radius['2xl']  // 20px ⭐ PROMINENT CARDS
Tokens.radius['3xl']  // 24px
Tokens.radius.full    // 9999px ⭐ PILLS/CIRCLES

// Semantic aliases
Tokens.radius.card    // 20px (2xl)
Tokens.radius.input   // 12px (lg)
Tokens.radius.pill    // 9999px (full)
```

---

## 🌫️ Shadows

```tsx
// Platform-optimized shadows
Tokens.shadows.none
Tokens.shadows.sm     // Subtle lift
Tokens.shadows.md     // Card elevation ⭐ DEFAULT CARDS
Tokens.shadows.lg     // Prominent cards
Tokens.shadows.xl     // Floating elements
Tokens.shadows['2xl'] // Modals

// Specialized shadows
Tokens.shadows.card       // Card default
Tokens.shadows.cardHover  // Card on press
Tokens.shadows.soft       // Very subtle
Tokens.shadows.premium    // Ocean blue tint
```

### Usage

```tsx
<View style={{
  ...Tokens.shadows.md,  // Spread operator
  borderRadius: Tokens.radius.lg,
}}>
```

---

## 🎬 Animations

### Durations

```tsx
Tokens.animations.duration.instant  // 0ms
Tokens.animations.duration.fast     // 150ms ⭐ MICRO-INTERACTIONS
Tokens.animations.duration.normal   // 300ms ⭐ TRANSITIONS
Tokens.animations.duration.slow     // 500ms
Tokens.animations.duration.slower   // 700ms
```

### Easing

```tsx
Tokens.animations.easing.linear
Tokens.animations.easing.ease       // [0.25, 0.1, 0.25, 1]
Tokens.animations.easing.easeIn
Tokens.animations.easing.easeOut
Tokens.animations.easing.easeInOut
Tokens.animations.easing.spring     // Natural spring
Tokens.animations.easing.bounce
```

---

## 🎯 Touch Targets (Accessibility)

WCAG AAA compliant:

```tsx
Tokens.touchTargets.min        // 44px (iOS minimum)
Tokens.touchTargets.minAndroid // 48px (Android minimum)
Tokens.touchTargets.medium     // 48px ⭐ RECOMMENDED
Tokens.touchTargets.large      // 56px
Tokens.touchTargets.xl         // 64px
```

### Usage in Buttons

```tsx
<TouchableOpacity style={{
  minHeight: Tokens.touchTargets.medium, // 48px
  paddingHorizontal: Tokens.spacing['4'],
}}>
```

---

## 🌙 Theme System

### Using Theme Context

```tsx
import { useTheme } from '@/theme/ThemeContext';

export const ThemedComponent = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background.canvas }}>
      <Text style={{ color: colors.text.primary }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      <Button onPress={toggleTheme}>Toggle Theme</Button>
    </View>
  );
};
```

### Theme Modes

```tsx
type ThemeMode = 'light' | 'dark' | 'system';

const { mode, setMode } = useTheme();
setMode('light');   // Force light mode
setMode('dark');    // Force dark mode
setMode('system');  // Follow system preference
```

---

## 📦 Complete Component Example

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Tokens, ColorTokens, TextStyles } from '@/theme/tokens';

export const ExampleCard = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={{
      // Background
      backgroundColor: colors.background.card,

      // Spacing
      padding: Tokens.spacing['4'],
      marginBottom: Tokens.spacing['3'],
      gap: Tokens.spacing['2'],

      // Border
      borderRadius: Tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border.light,

      // Shadow
      ...Tokens.shadows.md,
    }}>
      {/* Title */}
      <Text style={{
        ...TextStyles.h3,
        color: colors.text.primary,
      }}>
        Card Title
      </Text>

      {/* Body */}
      <Text style={{
        ...TextStyles.bodyMedium,
        color: colors.text.secondary,
      }}>
        Card description goes here
      </Text>

      {/* Button */}
      <TouchableOpacity style={{
        backgroundColor: ColorTokens.primary[500],
        paddingHorizontal: Tokens.spacing['4'],
        paddingVertical: Tokens.spacing['2'],
        borderRadius: Tokens.radius.md,
        minHeight: Tokens.touchTargets.medium,
        alignItems: 'center',
        justifyContent: 'center',
        ...Tokens.shadows.sm,
      }}>
        <Text style={{
          ...TextStyles.labelLarge,
          color: colors.text.inverse,
        }}>
          Action
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T

```tsx
// ❌ Hardcoded colors
backgroundColor: '#E91E63'
color: 'rgba(255, 255, 255, 0.5)'

// ❌ Magic numbers
padding: 16
fontSize: 14
borderRadius: 12

// ❌ Importing from wrong files
import { WellnessColors } from '@/theme/wellnessDesign';
import { colors } from '@/theme/cottonCandyTheme';

// ❌ Not using theme context
const textColor = '#000000'; // Breaks in dark mode!
```

### ✅ DO

```tsx
// ✅ Use ColorTokens
backgroundColor: ColorTokens.primary[500]
backgroundColor: ColorTokens.overlay.light

// ✅ Use Tokens
padding: Tokens.spacing['4']
fontSize: Tokens.typography.sizes.sm
borderRadius: Tokens.radius.lg

// ✅ Import from tokens.ts
import { Tokens, ColorTokens, TextStyles } from '@/theme/tokens';

// ✅ Use theme context
const { colors } = useTheme();
const textColor = colors.text.primary; // Theme-aware!
```

---

## 📚 Additional Resources

- **Theme Context:** `/src/theme/ThemeContext.tsx`
- **Main Tokens:** `/src/theme/tokens.ts`
- **Component Guide:** `COMPONENT_GUIDE.md`
- **Accessibility Guide:** `ACCESSIBILITY.md`

---

## 🔄 Migration from Old Systems

### From wellnessDesign.ts (DEPRECATED)

```tsx
// ❌ OLD:
import { WellnessColors } from '@/theme/wellnessDesign';
backgroundColor: WellnessColors.primary[500]

// ✅ NEW:
import { ColorTokens } from '@/theme/tokens';
backgroundColor: ColorTokens.primary[500]
```

### From cottonCandyTheme.ts

```tsx
// ❌ OLD:
import { colors, spacing } from '@/theme/cottonCandyTheme';
backgroundColor: colors.primary.pink
padding: spacing[4]

// ✅ NEW:
import { ColorTokens, Tokens } from '@/theme/tokens';
const { colors } = useTheme();
backgroundColor: ColorTokens.primary[500]
padding: Tokens.spacing['4']
```

### From modernTokens.ts

```tsx
// ❌ OLD:
import { ModernColors } from '@/theme/modernTokens';
backgroundColor: ModernColors.light.primary

// ✅ NEW:
import { useTheme } from '@/theme/ThemeContext';
const { colors } = useTheme();
backgroundColor: colors.primary.main
```

---

## ✅ Design System Checklist

Before shipping a component, verify:

- [ ] Uses `useTheme()` for theme awareness
- [ ] No hardcoded hex colors
- [ ] No hardcoded `rgba()` values
- [ ] Uses `Tokens.spacing` instead of magic numbers
- [ ] Uses `Tokens.radius` for border radius
- [ ] Uses `TextStyles` for typography
- [ ] Touch targets >= 48px (WCAG AAA)
- [ ] Works in both light and dark mode
- [ ] Uses `Tokens.shadows` for elevations
- [ ] Imports from `@/theme/tokens` only

---

**Last Updated:** December 9, 2025
**Maintained By:** Nossa Maternidade Design Team

Need help? Check the component guide or ask in #design channel.
