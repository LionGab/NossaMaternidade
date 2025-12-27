# Design System Quick Reference Guide

**Last Updated:** December 27, 2025

## TL;DR

✅ **DO:**
```typescript
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/hooks/useTheme';

backgroundColor: Tokens.brand.primary[500]
color: Tokens.neutral[900]
```

❌ **DON'T:**
```typescript
backgroundColor: "#FF5C94"  // Hardcoded hex
color: "rgba(0,0,0,0.5)"    // Hardcoded RGBA
backgroundColor: "white"     // String color (except "transparent")
```

---

## Single Source of Truth

**File:** `src/theme/tokens.ts`

All colors, spacing, typography, and other design tokens live here.

---

## Common Patterns

### 1. Brand Colors

```typescript
import { Tokens } from '@/theme/tokens';

// Primary (Blue Clean - calm, trust)
backgroundColor: Tokens.brand.primary[500]  // #5BB5D6
backgroundColor: Tokens.brand.primary[100]  // Very light blue

// Accent (Pink Clean - CTAs, highlights)
backgroundColor: Tokens.brand.accent[500]   // #F49DB2
backgroundColor: Tokens.brand.accent[400]   // Main CTA color

// Secondary (Lilac - supporting elements)
backgroundColor: Tokens.brand.secondary[500]
```

### 2. Neutral Colors

```typescript
// White to Black scale
backgroundColor: Tokens.neutral[0]    // Pure white (#FFFFFF)
backgroundColor: Tokens.neutral[50]   // Off-white (#F9FAFB)
backgroundColor: Tokens.neutral[900]  // Almost black (#111827)

// Text colors
color: Tokens.text.light.primary      // Dark text for light mode
color: Tokens.text.dark.primary       // Light text for dark mode
```

### 3. Semantic Colors

```typescript
// Success, Warning, Error, Info
backgroundColor: Tokens.semantic.light.success
backgroundColor: Tokens.semantic.light.successLight  // Background tint
color: Tokens.semantic.light.successText             // Text color

// Dark mode variants
backgroundColor: Tokens.semantic.dark.error
```

### 4. Overlays

```typescript
// Modal/Sheet backgrounds
backgroundColor: Tokens.overlay.light   // rgba(0,0,0,0.1)
backgroundColor: Tokens.overlay.medium  // rgba(0,0,0,0.3)
backgroundColor: Tokens.overlay.dark    // rgba(0,0,0,0.5)
backgroundColor: Tokens.overlay.heavy   // rgba(0,0,0,0.7)
backgroundColor: Tokens.overlay.backdrop // rgba(0,0,0,0.85)
```

### 5. Surfaces

```typescript
const { isDark } = useTheme();

backgroundColor: isDark ? Tokens.surface.dark.base : Tokens.surface.light.base
backgroundColor: isDark ? Tokens.surface.dark.card : Tokens.surface.light.card
```

### 6. Spacing (8pt Grid)

```typescript
padding: Tokens.spacing.xs   // 4
padding: Tokens.spacing.sm   // 8
padding: Tokens.spacing.md   // 12
padding: Tokens.spacing.lg   // 16
padding: Tokens.spacing.xl   // 20
padding: Tokens.spacing["2xl"] // 24
padding: Tokens.spacing["3xl"] // 32
```

### 7. Border Radius

```typescript
borderRadius: Tokens.radius.sm   // 8
borderRadius: Tokens.radius.md   // 12
borderRadius: Tokens.radius.lg   // 16
borderRadius: Tokens.radius.xl   // 20
borderRadius: Tokens.radius.full // 9999 (pill)
```

### 8. Shadows

```typescript
// Spread the shadow object
...Tokens.shadows.sm  // Subtle
...Tokens.shadows.md  // Default
...Tokens.shadows.lg  // Elevated
...Tokens.shadows.xl  // High elevation

// Glow for CTAs
...Tokens.shadows.accentGlow  // Pink glow
```

### 9. Typography

```typescript
import { Tokens } from '@/theme/tokens';

// Font family
fontFamily: Tokens.typography.fontFamily.base      // Manrope_400Regular
fontFamily: Tokens.typography.fontFamily.semibold  // Manrope_600SemiBold
fontFamily: Tokens.typography.fontFamily.bold      // Manrope_700Bold

// Type scales (spread objects)
...Tokens.typography.headlineLarge   // h1: 22px/28px/600
...Tokens.typography.headlineMedium  // h2: 18px/24px/600
...Tokens.typography.bodyLarge       // 16px/24px/400
...Tokens.typography.bodyMedium      // 15px/22px/400 (default)
...Tokens.typography.caption         // 12px/16px/400
```

### 10. Theme-Aware Colors (Light/Dark Mode)

```typescript
import { useTheme } from '@/hooks/useTheme';

const { isDark, colors, surface, text, semantic } = useTheme();

// Use theme-aware values
backgroundColor: surface.card  // Switches between light/dark
color: text.primary            // Switches between light/dark
borderColor: semantic.error    // Switches between light/dark
```

---

## Special Features

### Feeling Colors (Daily Check-ins)

```typescript
backgroundColor: Tokens.feeling.bem.color      // Sunny yellow
backgroundColor: Tokens.feeling.cansada.color  // Cloud blue
backgroundColor: Tokens.feeling.indisposta.color // Lavender
backgroundColor: Tokens.feeling.amada.color    // Pink heart
```

### Premium/Dark Immersive Screens

```typescript
// Paywall, Login, Onboarding
backgroundColor: Tokens.premium.gradient.top
backgroundColor: Tokens.premium.glass.base
color: Tokens.premium.text.primary
```

### Gradients

```typescript
import { LinearGradient } from 'expo-linear-gradient';

// Brand gradients
<LinearGradient colors={Tokens.gradients.primary} />
<LinearGradient colors={Tokens.gradients.accent} />

// Affirmation gradients
<LinearGradient colors={Tokens.gradients.affirmations.oceano} />
```

---

## Migration Cheat Sheet

### Replace Hardcoded Hex

| Old | New |
|-----|-----|
| `#FFFFFF` | `Tokens.neutral[0]` |
| `#000000` | `Tokens.neutral[900]` |
| `#F9FAFB` | `Tokens.neutral[50]` |
| `#5BB5D6` | `Tokens.brand.primary[500]` |
| `#F49DB2` | `Tokens.brand.accent[500]` |

### Replace RGBA Overlays

| Old | New |
|-----|-----|
| `rgba(0,0,0,0.1)` | `Tokens.overlay.light` |
| `rgba(0,0,0,0.3)` | `Tokens.overlay.medium` |
| `rgba(0,0,0,0.5)` | `Tokens.overlay.dark` |
| `rgba(0,0,0,0.7)` | `Tokens.overlay.heavy` |

### Replace String Colors

| Old | New |
|-----|-----|
| `"white"` | `Tokens.neutral[0]` |
| `"black"` | `Tokens.neutral[900]` |
| `"transparent"` | `"transparent"` (OK for variants) |

---

## Accessibility

```typescript
// Minimum tap target (44pt iOS HIG)
minHeight: Tokens.accessibility.minTapTarget  // 44

// Contrast ratios
// All colors meet WCAG AAA (7:1) by default
```

---

## Animation

```typescript
// Durations
duration: Tokens.animation.duration.fast    // 150ms
duration: Tokens.animation.duration.normal  // 300ms
duration: Tokens.animation.duration.slow    // 500ms

// Micro-interactions
transform: [{ scale: Tokens.micro.pressScale }]  // 0.97
transform: [{ scale: Tokens.micro.hoverScale }]  // 1.02
```

---

## Anti-Patterns to Avoid

### ❌ DON'T: Hardcode colors
```typescript
backgroundColor: "#FF5C94"
color: "rgba(0, 0, 0, 0.5)"
```

### ✅ DO: Use tokens
```typescript
backgroundColor: Tokens.brand.accent[500]
backgroundColor: Tokens.overlay.medium
```

---

### ❌ DON'T: Import old color files
```typescript
import { Colors } from '@/utils/colors';  // DEPRECATED
import { COLORS } from '@/theme/design-system';  // DOESN'T EXIST
```

### ✅ DO: Import from tokens
```typescript
import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/hooks/useTheme';
```

---

### ❌ DON'T: Hard-code light/dark values
```typescript
const bgColor = isDark ? "#1F2937" : "#FFFFFF";
```

### ✅ DO: Use theme-aware tokens
```typescript
const { surface } = useTheme();
const bgColor = surface.card;
```

---

## ESLint Rule (Planned)

```json
{
  "rules": {
    "no-hardcoded-colors": "error"
  }
}
```

Will block:
- Hex colors (`#xxx`)
- RGBA values (except documented exceptions)
- String colors (except `"transparent"`)

---

## Quick Links

- **Tokens File:** `src/theme/tokens.ts`
- **Theme Hook:** `src/hooks/useTheme.ts`
- **Migration Audit:** `docs/DESIGN_SYSTEM_MIGRATION_AUDIT.md`
- **File-by-File Guide:** `docs/DESIGN_SYSTEM_MIGRATION_FILES.md`
- **Design System Docs:** `docs/DESIGN_SYSTEM_CALM_FEMTECH.md`

---

## Getting Help

**In CLAUDE.md:**
```markdown
### Colors & Design System
- **NEVER hardcode colors** - Use `useThemeColors()` hook or `Tokens.*` from `src/theme/tokens.ts`
- Forbidden: `#xxx`, `rgba()`, `'white'`, `'black'` (except documented cases)
- **SINGLE SOURCE OF TRUTH**: `src/theme/tokens.ts` (Calm FemTech preset)
```

**Quick test:**
```bash
# Search for violations
npm run audit:colors  # (planned)

# Or manually
grep -r "#[0-9A-Fa-f]\{6\}" src/
grep -r "rgba(" src/
```
