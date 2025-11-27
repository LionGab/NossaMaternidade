---
name: Design Tokens Auto-Fixer
description: Automatically fixes hardcoded colors, spacing, and typography violations by replacing them with proper design tokens in React Native components
version: 1.0.0
author: Lion
created: 2025-11-27
tags: [react-native, design-tokens, accessibility, consistency]
---

# Design Tokens Auto-Fixer Skill

## 🎯 Purpose

This skill automatically detects and fixes design token violations in React Native components by replacing hardcoded values with proper design system tokens.

**Target:** Fix 193+ violations in Nossa Maternidade project  
**Impact:** Achieve 95+ design consistency score, ensure WCAG compliance, enable theme switching

## 🔍 When to Use This Skill

Trigger this skill when:
- User asks to "fix design tokens" or "resolve violations"
- Analyzing React Native component files (`.tsx`, `.ts`)
- Detecting hardcoded colors like `#FFFFFF`, `#000000`, `rgb()`, `rgba()`
- Finding hardcoded spacing values like `padding: 16`, `margin: 24`
- Discovering hardcoded font sizes like `fontSize: 14`, `fontWeight: 'bold'`
- Before committing changes to ensure consistency

## 📐 Token Mapping Rules

### Colors

**Text Colors:**
```typescript
// ❌ BEFORE (Hardcoded)
color: '#FFFFFF'
color: '#FFF'
color: 'white'
color: '#000000'
color: '#000'
color: 'black'
color: '#666666'
color: '#999999'

// ✅ AFTER (Using Tokens)
color: colors.text.inverse        // white text
color: colors.text.primary        // black text
color: colors.text.secondary      // gray text
color: colors.text.tertiary       // light gray text
```

**Background Colors:**
```typescript
// ❌ BEFORE
backgroundColor: '#FFFFFF'
backgroundColor: '#F5F5F5'
backgroundColor: '#E8E8E8'
backgroundColor: '#333333'

// ✅ AFTER
backgroundColor: colors.background.primary     // white
backgroundColor: colors.background.secondary   // light gray
backgroundColor: colors.background.tertiary    // medium gray
backgroundColor: colors.background.inverse     // dark
```

**Brand Colors:**
```typescript
// ❌ BEFORE
color: '#FF6B9D'        // pink primary
color: '#FFA8CC'        // pink light
color: '#FF1744'        // error red
color: '#4CAF50'        // success green
color: '#2196F3'        // info blue

// ✅ AFTER
color: colors.brand.primary
color: colors.brand.light
color: colors.error.main
color: colors.success.main
color: colors.info.main
```

### Spacing

```typescript
// ❌ BEFORE
padding: 4
padding: 8
padding: 12
padding: 16
padding: 20
padding: 24
padding: 32
margin: 16
gap: 12

// ✅ AFTER
padding: Spacing["1"]      // 4px
padding: Spacing["2"]      // 8px
padding: Spacing["3"]      // 12px
padding: Spacing["4"]      // 16px
padding: Spacing["5"]      // 20px
padding: Spacing["6"]      // 24px
padding: Spacing["8"]      // 32px
margin: Spacing["4"]
gap: Spacing["3"]
```

### Typography

**Font Sizes:**
```typescript
// ❌ BEFORE
fontSize: 12
fontSize: 14
fontSize: 16
fontSize: 18
fontSize: 20
fontSize: 24
fontSize: 32

// ✅ AFTER
fontSize: Typography.sizes.xs      // 12px
fontSize: Typography.sizes.sm      // 14px
fontSize: Typography.sizes.base    // 16px
fontSize: Typography.sizes.lg      // 18px
fontSize: Typography.sizes.xl      // 20px
fontSize: Typography.sizes["2xl"]  // 24px
fontSize: Typography.sizes["4xl"]  // 32px
```

**Font Weights:**
```typescript
// ❌ BEFORE
fontWeight: '400'
fontWeight: '500'
fontWeight: '600'
fontWeight: '700'
fontWeight: 'normal'
fontWeight: 'bold'

// ✅ AFTER
fontWeight: Typography.weights.normal    // 400
fontWeight: Typography.weights.medium    // 500
fontWeight: Typography.weights.semibold  // 600
fontWeight: Typography.weights.bold      // 700
```

### Border Radius

```typescript
// ❌ BEFORE
borderRadius: 4
borderRadius: 8
borderRadius: 12
borderRadius: 16
borderRadius: 999

// ✅ AFTER
borderRadius: Radius.sm      // 4px
borderRadius: Radius.md      // 8px
borderRadius: Radius.lg      // 12px
borderRadius: Radius.xl      // 16px
borderRadius: Radius.full    // 999px
```

## 🔄 Auto-Fix Process

### Step 1: Detect Violations

```bash
# Scan file for violations
grep -E "(color|backgroundColor):\s*['\"]#[0-9A-Fa-f]{3,6}['\"]" Component.tsx
grep -E "(padding|margin|gap):\s*[0-9]+" Component.tsx
grep -E "fontSize:\s*[0-9]+" Component.tsx
```

### Step 2: Apply Replacements

**Strategy: Progressive Replacement**
1. **Colors first** → Most visible, highest impact
2. **Spacing second** → Layout consistency
3. **Typography third** → Content hierarchy
4. **Borders/Shadows last** → Visual polish

### Step 3: Validate Changes

After applying fixes:
```typescript
// Add import if not present
import { useThemeColors } from '@/theme';
import { Spacing, Radius, Typography } from '@/theme/tokens';

// Ensure no hardcoded values remain
// Run: @design-tokens validate Component.tsx

// Check component still renders
// Run: npm run type-check
```

## 🛠️ Usage Examples

### Example 1: Simple Color Fix

**Before:**
```tsx
<View style={{ backgroundColor: '#FFFFFF', padding: 16 }}>
  <Text style={{ color: '#000000', fontSize: 14 }}>
    Hello World
  </Text>
</View>
```

**After:**
```tsx
import { useThemeColors } from '@/theme';
import { Spacing, Typography } from '@/theme/tokens';

const colors = useThemeColors();

<View style={{ 
  backgroundColor: colors.background.primary, 
  padding: Spacing["4"] 
}}>
  <Text style={{ 
    color: colors.text.primary, 
    fontSize: Typography.sizes.sm 
  }}>
    Hello World
  </Text>
</View>
```

## 🚨 Edge Cases & Warnings

### When NOT to Replace

**1. Third-party Library Props:**
```typescript
// ❌ DON'T replace if prop expects hex string
<ExternalLibrary primaryColor="#FF6B9D" />

// ✅ Keep original or wrap in variable
const PRIMARY_HEX = '#FF6B9D'; // matches colors.brand.primary
<ExternalLibrary primaryColor={PRIMARY_HEX} />
```

**2. Dynamic Calculations:**
```typescript
// ❌ DON'T replace calculated values
opacity: isPressed ? 0.7 : 1.0  // Keep as-is

// ✅ Use token if available
opacity: isPressed ? Tokens.opacity.disabled : Tokens.opacity.full
```

### Important Checks

- ✅ **Always verify component renders** after token replacement
- ✅ **Check TypeScript errors** - tokens may have stricter types
- ✅ **Test on device** - some colors look different on iOS vs Android
- ✅ **Validate accessibility** - ensure contrast ratios still pass WCAG AAA
- ✅ **Check dark mode** if implemented - tokens should adapt automatically

## 🔗 Integration with MCPs

This skill works with these MCPs:

1. **@design-tokens MCP** - Validates token usage
2. **@code-quality MCP** - Checks code standards
3. **@accessibility MCP** - Validates WCAG compliance

**Workflow:**
```bash
# 1. Detect violations
@design-tokens validate src/components/

# 2. Apply this skill to fix
Claude: "Fix design tokens in Checkbox.tsx"

# 3. Re-validate
@design-tokens validate src/components/Checkbox.tsx

# 4. Commit if clean
git add . && git commit -m "fix: apply design tokens to Checkbox"
```

## 📚 References

- Design System: `/src/theme/tokens.ts`
- Color Palette: `/src/theme/tokens.ts`
- Typography Scale: `/src/theme/tokens.ts`
- Spacing Scale: `/src/theme/tokens.ts`

---

*Last Updated: 2025-11-27*  
*Maintained by: Lion (@LionGab)*  
*Questions? Check examples/ folder or ask Claude!*

