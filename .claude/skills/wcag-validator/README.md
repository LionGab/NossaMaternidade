---
name: WCAG Accessibility Validator
description: Validates and fixes accessibility issues to meet WCAG 2.1 Level AAA standards for inclusive maternal health app
version: 1.0.0
author: Lion
created: 2025-11-27
tags: [accessibility, wcag, a11y, inclusive-design]
---

# WCAG Accessibility Validator Skill

## 🎯 Purpose

Ensures Nossa Maternidade app meets WCAG 2.1 Level AAA standards, making it accessible to ALL mothers including those with visual, motor, or cognitive disabilities.

**Target:** WCAG AAA compliance (95%+ score)  
**Impact:** Reach 15%+ more users, better app store ratings, legal compliance

## 🔍 When to Use This Skill

Trigger this skill when:
- User asks to "check accessibility" or "fix WCAG issues"
- Auditing color contrast ratios
- Validating touch target sizes
- Ensuring screen reader compatibility
- Before production deployment
- When adding new UI components

## ♿ WCAG AAA Requirements

### 1. Color Contrast (1.4.6)

**AAA Level requires 7:1 ratio for normal text, 4.5:1 for large text**

```typescript
// ❌ FAIL - Contrast ratio 3.2:1 (insufficient)
<Text style={{ color: '#999999', backgroundColor: '#FFFFFF' }}>
  Important health info
</Text>

// ✅ PASS - Contrast ratio 7.5:1 (AAA compliant)
<Text style={{ color: colors.text.primary, backgroundColor: colors.background.primary }}>
  Important health info
</Text>
```

### 2. Touch Targets (2.5.5)

**AAA Level requires 44x44 dp minimum**

```typescript
// ❌ FAIL - Too small (32x32)
<TouchableOpacity style={{ width: 32, height: 32 }}>
  <Icon name="close" size={16} />
</TouchableOpacity>

// ✅ PASS - WCAG compliant (44x44)
<TouchableOpacity 
  style={{ 
    width: Tokens.touchTargets.min,  // 44px
    height: Tokens.touchTargets.min, // 44px
    justifyContent: 'center',
    alignItems: 'center',
  }}
  accessibilityLabel="Close dialog"
  accessibilityRole="button"
>
  <Icon name="close" size={20} />
</TouchableOpacity>
```

### 3. Accessible Names (4.1.2)

**All interactive elements must have accessible names**

```typescript
// ❌ FAIL - No accessible label
<TouchableOpacity onPress={handleSubmit}>
  <Text>→</Text>
</TouchableOpacity>

// ✅ PASS - Clear accessible label
<TouchableOpacity 
  onPress={handleSubmit}
  accessibilityLabel="Submit pregnancy symptoms form"
  accessibilityRole="button"
  accessibilityHint="Sends your symptoms to be analyzed by our AI assistant"
>
  <Text>→</Text>
</TouchableOpacity>
```

### 4. Text Alternatives (1.1.1)

**All non-text content needs text alternative**

```typescript
// ❌ FAIL - Image without alt text
<Image source={ultraSoundImage} />

// ✅ PASS - Descriptive alt text
<Image 
  source={ultraSoundImage}
  accessibilityLabel="Ultrasound scan showing healthy 12-week fetus"
  accessibilityRole="image"
/>
```

## 🎨 Contrast Ratio Validation

### Text Contrast Requirements

```typescript
// Color pairs that meet WCAG AAA (7:1+):

// Dark text on light backgrounds:
colors.text.primary (#000000) on colors.background.primary (#FFFFFF) = 21:1 ✅
colors.text.secondary (#666666) on colors.background.primary (#FFFFFF) = 7.5:1 ✅

// Light text on dark backgrounds:
colors.text.inverse (#FFFFFF) on colors.primary.main (#004E9A) = 8.1:1 ✅
```

## 📏 Touch Target Validation

### Minimum Sizes (WCAG 2.5.5)

```typescript
// Required sizes:
const TOUCH_TARGET_MIN = 44;  // WCAG AAA requirement

// Common components:
const touchTargets = {
  button: { width: 44, height: 44 },  // ✅ Minimum
  buttonLarge: { width: 48, height: 48 },  // ✅ Better
  checkbox: { width: 44, height: 44 },  // ✅ Minimum
  icon: { width: 44, height: 44 },  // ✅ Even if icon is 20px
  link: { minHeight: 44 },  // ✅ With padding
};
```

## 🎤 Screen Reader Testing

### Required Accessibility Props

```typescript
interface A11yComponentProps {
  // REQUIRED for interactive elements:
  accessible: true;
  accessibilityLabel: string;  // What it is
  accessibilityRole: AccessibilityRole;  // button, link, checkbox, etc.
  
  // RECOMMENDED:
  accessibilityHint?: string;  // What it does
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
  };
  
  // FOR ERRORS:
  accessibilityInvalid?: boolean;
  accessibilityErrorMessage?: string;
  
  // FOR LIVE REGIONS:
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
}
```

## ✅ Accessibility Audit Checklist

### Visual Accessibility

- [ ] All text meets 7:1 contrast ratio (AAA)
- [ ] Large text (18px+) meets 4.5:1 ratio
- [ ] UI components meet 3:1 contrast
- [ ] Focus indicators visible (2px, high contrast)
- [ ] No information conveyed by color alone
- [ ] Text can be resized to 200% without loss

### Motor Accessibility

- [ ] All touch targets minimum 44x44dp
- [ ] Spacing between targets minimum 8dp
- [ ] No drag-only interactions
- [ ] No time limits (or can be extended)
- [ ] No shake-to-undo (motor impairment issue)

### Cognitive Accessibility

- [ ] Clear, simple language (6th grade reading level)
- [ ] Consistent navigation patterns
- [ ] Error messages are specific and helpful
- [ ] No flashing content (seizure risk)
- [ ] Important actions require confirmation

### Screen Reader Accessibility

- [ ] All images have descriptive labels
- [ ] All buttons have clear labels
- [ ] Form fields have labels and instructions
- [ ] Error messages announced to screen reader
- [ ] Loading states announced
- [ ] Focus order logical

## 🛠️ Auto-Fix Patterns

### Fix 1: Add Missing Accessibility Labels

```typescript
// Detect: Interactive element without label
if (isInteractive && !hasAccessibilityLabel) {
  addAccessibilityLabel();
}

// Apply fix:
<TouchableOpacity
  accessibilityLabel="[NEEDS LABEL - Describe what this does]"
  accessibilityRole="button"
  // ...
/>
```

### Fix 2: Increase Touch Target Size

```typescript
// Detect: Touch target < 44x44
if (touchableWidth < 44 || touchableHeight < 44) {
  increaseTouchTarget();
}

// Apply fix:
<TouchableOpacity
  style={{
    ...styles.button,
    minWidth: Tokens.touchTargets.min,
    minHeight: Tokens.touchTargets.min,
    justifyContent: 'center',
    alignItems: 'center',
  }}
/>
```

### Fix 3: Improve Contrast

```typescript
// Detect: Contrast ratio < 7:1
if (contrastRatio < 7.0) {
  improveContrast();
}

// Apply fix:
// Replace low-contrast color with compliant alternative
color: colors.text.secondary  // 7.5:1 ✅
// instead of
color: '#999999'  // 3.5:1 ❌
```

## 🎓 Maternal Health Specific Guidelines

**Critical for Nossa Maternidade:**

1. **Crisis Detection Accessibility**
   - Error states must be highly visible
   - Emergency buttons must be large (56x56+)
   - Crisis alerts use `accessibilityLiveRegion="assertive"`

2. **Medical Information Clarity**
   - Symptoms described in plain Portuguese
   - Medical terms followed by explanations
   - Contrast ratio 8:1+ for critical info

3. **Low-Vision Support**
   - All text minimum 16px (large text mode available)
   - Icons accompanied by text labels
   - Haptic feedback for important actions

4. **Stress-State Consideration**
   - Clear, calming language
   - Large, obvious CTAs
   - No time pressure for critical decisions

## 🔗 Integration with MCPs

Works with:
- **@accessibility MCP** - Validates WCAG compliance
- **@design-tokens MCP** - Ensures compliant colors

**Workflow:**
```bash
# 1. Audit accessibility
@accessibility audit src/components/

# 2. Fix with this skill
Claude: "Fix WCAG AAA issues in SymptomForm.tsx"

# 3. Validate
@accessibility validate src/components/SymptomForm.tsx

# 4. Test with screen reader
npm run test:a11y
```

---

*Last Updated: 2025-11-27*  
*Maintained by: Lion (@LionGab)*  
*All mothers deserve accessible healthcare information ♿💗*

