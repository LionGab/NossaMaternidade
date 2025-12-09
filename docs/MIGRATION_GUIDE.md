# 🔄 Migration Guide - Design System Consolidation

**Date:** December 9, 2025
**Status:** 🚨 URGENT - Action Required
**Impact:** All developers working on Nossa Maternidade

---

## 📋 Executive Summary

We've **consolidated our fragmented design system** into ONE single source of truth. This guide will help you migrate your code.

### What Changed?

| Before | After | Status |
|--------|-------|--------|
| 6 design systems | 1 design system | ✅ DONE |
| atoms/ + primitives/ | atoms/ only | 📝 In progress |
| Hardcoded colors | Design tokens | 📝 In progress |
| No documentation | Complete docs | ✅ DONE |

---

## 🎯 Action Items for Developers

### Priority 1: STOP Using Deprecated Files

#### ❌ DO NOT USE:

```tsx
// ❌ DEPRECATED - Will be removed
import { WellnessColors } from '@/theme/wellnessDesign';

// ❌ DEPRECATED - Use tokens.ts instead
import { colors } from '@/theme/cottonCandyTheme';

// ❌ DEPRECATED - Use tokens.ts instead
import { ModernColors } from '@/theme/modernTokens';

// ❌ DEPRECATED - Use atoms/Button instead
import { Button } from '@/components/primitives/Button';

// ❌ DEPRECATED - Never used, will be deleted
import { WellnessButton } from '@/components/primitives/WellnessButton';
```

#### ✅ DO USE:

```tsx
// ✅ CORRECT - Official design system
import { Tokens, ColorTokens, TextStyles } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeContext';

// ✅ CORRECT - Official button
import { Button } from '@/components/atoms/Button';

// ✅ CORRECT - Official card
import { Card } from '@/components/atoms/Card';
```

---

## 🔧 Step-by-Step Migration

### Step 1: Update Imports (5 minutes)

#### From wellnessDesign.ts:

```tsx
// ❌ BEFORE:
import { WellnessColors } from '@/theme/wellnessDesign';
const bg = WellnessColors.primary[500];

// ✅ AFTER:
import { ColorTokens } from '@/theme/tokens';
const bg = ColorTokens.primary[500];
```

#### From cottonCandyTheme.ts:

```tsx
// ❌ BEFORE:
import { colors, spacing } from '@/theme/cottonCandyTheme';
backgroundColor: colors.primary.pink
padding: spacing[4]

// ✅ AFTER:
import { ColorTokens, Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeContext';

const { colors } = useTheme();
backgroundColor: ColorTokens.primary[500]
padding: Tokens.spacing['4']
```

#### From modernTokens.ts:

```tsx
// ❌ BEFORE:
import { ModernColors } from '@/theme/modernTokens';
backgroundColor: ModernColors.light.primary

// ✅ AFTER:
import { useTheme } from '@/theme/ThemeContext';
const { colors } = useTheme();
backgroundColor: colors.primary.main
```

---

### Step 2: Fix Hardcoded Colors (10 minutes)

#### Replace rgba() with Tokens:

```tsx
// ❌ BEFORE:
backgroundColor: 'rgba(255, 255, 255, 0.2)'
color: 'rgba(255, 255, 255, 0.95)'
borderColor: '#E91E63'

// ✅ AFTER:
backgroundColor: ColorTokens.overlay.light
color: ColorTokens.nathIA.text.light
borderColor: ColorTokens.primary[500]
```

#### Common Replacements:

| Hardcoded Value | Token Replacement |
|----------------|------------------|
| `'rgba(255, 255, 255, 0.2)'` | `ColorTokens.overlay.light` |
| `'rgba(0, 0, 0, 0.5)'` | `ColorTokens.overlay.medium` |
| `'#E91E63'` | `ColorTokens.primary[500]` |
| `'#9C27B0'` | `ColorTokens.secondary[500]` |
| `'#FFFFFF'` | `ColorTokens.neutral[0]` or `colors.background.card` |
| `'#000000'` | `colors.text.primary` (theme-aware!) |

---

### Step 3: Update Component Imports (5 minutes)

#### Buttons:

```tsx
// ❌ BEFORE:
import { Button } from '@/components/primitives/Button';
import { WellnessButton } from '@/components/primitives/WellnessButton';

// ✅ AFTER:
import { Button } from '@/components/atoms/Button';
// WellnessButton is deleted - use atoms/Button
```

#### Cards:

```tsx
// ❌ BEFORE:
import { Card } from '@/components/primitives/Card';
import { Card } from '@/components/Card'; // root

// ✅ AFTER:
import { Card } from '@/components/atoms/Card';

// For CardHeader/CardContent/etc, use primitives:
import {
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/primitives/Card';
```

---

### Step 4: Replace Magic Numbers (10 minutes)

#### Spacing:

```tsx
// ❌ BEFORE:
padding: 16
marginBottom: 12
gap: 8

// ✅ AFTER:
padding: Tokens.spacing['4']
marginBottom: Tokens.spacing['3']
gap: Tokens.spacing['2']
```

#### Border Radius:

```tsx
// ❌ BEFORE:
borderRadius: 12
borderRadius: 20

// ✅ AFTER:
borderRadius: Tokens.radius.lg    // 12px
borderRadius: Tokens.radius['2xl'] // 20px
```

#### Font Size:

```tsx
// ❌ BEFORE:
fontSize: 14
fontSize: 16
fontSize: 24

// ✅ AFTER:
fontSize: Tokens.typography.sizes.sm   // 14
fontSize: Tokens.typography.sizes.base // 16
fontSize: Tokens.typography.sizes['2xl'] // 24

// Or better: use semantic styles
...TextStyles.bodyMedium   // fontSize: 14
...TextStyles.bodyLarge    // fontSize: 16
...TextStyles.displaySmall // fontSize: 24 (32 actually)
```

---

### Step 5: Make Components Theme-Aware (15 minutes)

If your component has hardcoded colors, make it theme-aware:

```tsx
// ❌ BEFORE:
export const MyComponent = () => {
  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <Text style={{ color: '#000000' }}>Hello</Text>
    </View>
  );
};

// ✅ AFTER:
import { useTheme } from '@/theme/ThemeContext';

export const MyComponent = () => {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background.card }}>
      <Text style={{ color: colors.text.primary }}>Hello</Text>
    </View>
  );
};
```

**Why?** This ensures your component works in both light AND dark mode!

---

## 🧪 Testing Your Migration

### Checklist:

- [ ] All imports updated from `@/theme/tokens`
- [ ] No hardcoded hex colors (search for `#`)
- [ ] No hardcoded `rgba()` values
- [ ] Uses `useTheme()` for theme-awareness
- [ ] Spacing uses `Tokens.spacing`
- [ ] Border radius uses `Tokens.radius`
- [ ] Typography uses `TextStyles` or `Tokens.typography`
- [ ] Component works in light mode ✅
- [ ] Component works in dark mode ✅
- [ ] No TypeScript errors
- [ ] App builds successfully

### Test Command:

```bash
# Check for deprecated imports
grep -r "from '@/theme/wellnessDesign'" src/
grep -r "from '@/theme/cottonCandyTheme'" src/
grep -r "from '@/theme/modernTokens'" src/
grep -r "from '@/components/primitives/Button'" src/
grep -r "WellnessButton" src/

# Should return NO results!
```

### Search for Hardcoded Colors:

```bash
# Find hardcoded hex colors
grep -r "#[0-9A-Fa-f]{6}" src/ --include="*.tsx"

# Find hardcoded rgba
grep -r "rgba\(" src/ --include="*.tsx"
```

---

## 📚 Resources

### Documentation:

1. **Design System:** `/docs/DESIGN_SYSTEM.md` - Complete design token reference
2. **Component Guide:** `/docs/COMPONENT_GUIDE.md` - Which component to use
3. **Accessibility:** `/docs/ACCESSIBILITY.md` - WCAG compliance guide

### Code Examples:

```tsx
// ✅ COMPLETE EXAMPLE - Theme-aware component
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Tokens, ColorTokens, TextStyles } from '@/theme/tokens';

export const ExampleCard = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.background.card,
      padding: Tokens.spacing['4'],
      borderRadius: Tokens.radius.lg,
      ...Tokens.shadows.md,
    }}>
      <Text style={{
        ...TextStyles.h3,
        color: colors.text.primary,
      }}>
        Title
      </Text>

      <Text style={{
        ...TextStyles.bodyMedium,
        color: colors.text.secondary,
      }}>
        Description
      </Text>

      <TouchableOpacity style={{
        backgroundColor: ColorTokens.primary[500],
        paddingVertical: Tokens.spacing['3'],
        paddingHorizontal: Tokens.spacing['4'],
        borderRadius: Tokens.radius.md,
        minHeight: Tokens.touchTargets.medium, // 48px WCAG AAA
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

## 🚨 Common Mistakes

### 1. Not Using Theme Context

```tsx
// ❌ WRONG - Hardcoded, breaks in dark mode
const textColor = '#000000';

// ✅ RIGHT - Theme-aware
const { colors } = useTheme();
const textColor = colors.text.primary;
```

### 2. Mixing Old and New Imports

```tsx
// ❌ WRONG - Mixing systems
import { WellnessColors } from '@/theme/wellnessDesign';
import { ColorTokens } from '@/theme/tokens';

// ✅ RIGHT - One system only
import { ColorTokens } from '@/theme/tokens';
```

### 3. Not Using Spacing Tokens

```tsx
// ❌ WRONG - Magic numbers
padding: 16
margin: 12

// ✅ RIGHT - Design tokens
padding: Tokens.spacing['4']
margin: Tokens.spacing['3']
```

### 4. Hardcoding Opacity in rgba()

```tsx
// ❌ WRONG
backgroundColor: 'rgba(255, 255, 255, 0.2)'

// ✅ RIGHT - Option 1: Use overlay token
backgroundColor: ColorTokens.overlay.light

// ✅ RIGHT - Option 2: Use color + opacity prop
backgroundColor: ColorTokens.neutral[0]
opacity: 0.2
```

---

## 📞 Need Help?

### Questions?

1. Check `/docs/DESIGN_SYSTEM.md` first
2. Check `/docs/COMPONENT_GUIDE.md` for component selection
3. Ask in `#frontend` channel
4. File an issue if docs are unclear

### Found a Bug?

File an issue with:
- Component name
- File path
- Before/after code
- Screenshots if visual

---

## 📊 Progress Tracking

### Files Already Migrated:

- ✅ `/src/components/features/home/EmpatheticNathIACard.tsx` - Refactored 4 rgba() values
- ✅ `/src/theme/tokens.ts` - Removed Wellness integration
- ✅ `/src/theme/wellnessDesign.ts` - Marked as deprecated

### Files That Need Migration:

Use these commands to find:

```bash
# Files using cotton-candy theme (9 files)
grep -r "cottonCandyTheme" src/ -l

# Files with hardcoded rgba (43 in components)
grep -r "rgba\(" src/components --include="*.tsx" -l

# Files importing from primitives/Button
grep -r "from '@/components/primitives/Button'" src/ -l
```

---

## 🎯 Timeline

### Week 1 (Dec 9-15):
- ✅ Documentation created
- ✅ Core system consolidated
- 📝 Component refactoring starts

### Week 2 (Dec 16-22):
- 🎯 All developers migrate active code
- 🎯 PR reviews for migration compliance
- 🎯 Update linter rules

### Week 3 (Dec 23-29):
- 🎯 Delete deprecated files
- 🎯 Final cleanup
- 🎯 Celebrate! 🎉

---

**Questions? Check the docs or ask in #frontend!**

Last Updated: December 9, 2025
