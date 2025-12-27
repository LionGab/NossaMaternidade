# Design System Migration - File-by-File Breakdown

## Legend
- ✅ Fully migrated (using Tokens only)
- ⚠️ Partially migrated (uses Tokens but has violations)
- ❌ Not migrated (no Tokens usage)
- 🔵 Acceptable exceptions (documented)

---

## Priority 0: Critical User-Facing Screens

### ✅ Fully Migrated
1. `src/screens/HomeScreen.tsx` - Uses brand, neutral, shadows, spacing, radius
2. `src/screens/CommunityScreen.tsx` - Uses Tokens
3. `src/screens/ProfileScreen.tsx` - Uses Tokens
4. `src/screens/MyCareScreen.tsx` - Uses Tokens
5. `src/screens/AssistantScreen.tsx` - Uses Tokens (minor comment violation)

### ⚠️ Partially Migrated
1. `src/screens/PaywallScreenRedesign.tsx`
   - Uses: brand, premium, typography
   - Violations:
     - Line 246: `#F59E0B` → Use Tokens.semantic.light.warning
     - Line 251: `#FFFBEB` → Use Tokens.neutral[50] or brand.accent[50]
   - Effort: 5 minutes

2. `src/screens/LoginScreenRedesign.tsx`
   - Uses: Tokens
   - Violations:
     - Line 756: `#FFFFFF` → Use Tokens.neutral[0]
     - Line 883: `#1877F2` → OK (Facebook brand)
   - Effort: 2 minutes

3. `src/screens/auth/AuthLandingScreen.tsx`
   - Uses: brand
   - Violations:
     - Line 622: `#1877F2` → OK (Facebook brand)
   - Effort: 0 minutes (acceptable)

### ❌ Not Migrated (Priority: check if these exist)
None detected in critical screens.

---

## Priority 1: Core UI Components

### ✅ Fully Migrated
1. `src/components/ui/Button.tsx` - Uses brand, neutral, gradients, shadows, micro
2. `src/components/ui/Badge.tsx` - Uses Tokens
3. `src/components/ui/AnimatedBadge.tsx` - Uses Tokens
4. `src/components/ui/ScreenHeader.tsx` - Uses Tokens
5. `src/components/ui/PremiumEmptyState.tsx` - Uses Tokens
6. `src/components/ui/AppPressable.tsx` - Uses Tokens

### ⚠️ Partially Migrated
1. `src/components/ui/Avatar.tsx`
   - Uses: Tokens
   - Violations:
     - Line 29: `fallbackBgColor = "rgba(255, 255, 255, 0.1)"` → Extract to Tokens.surface.dark.cardAlpha
   - Effort: 5 minutes

2. `src/components/ui/AlertModal.tsx`
   - Uses: Tokens
   - Violations:
     - Line 86: `backgroundColor: "rgba(0, 0, 0, 0.5)"` → Use Tokens.overlay.medium
   - Effort: 2 minutes

3. `src/components/ui/PremiumCard.tsx`
   - Uses: Tokens
   - Violations:
     - Lines 80-84, 145-146: Multiple RGBA values → Use Tokens.premium.glass.*
   - Effort: 10 minutes

4. `src/components/ui/GlowEffect.tsx`
   - Uses: Tokens
   - Violations:
     - Line 182: `color = "rgba(255,255,255,0.3)"` → 🔵 Acceptable (dynamic prop)
   - Effort: 0 minutes

---

## Priority 2: Feature Components

### ⚠️ Partially Migrated (Overlays)
1. `src/components/community/NewPostModal.tsx`
   - Violation: Line 361: `backgroundColor: "rgba(0,0,0,0.6)"` → Tokens.overlay.dark
   - Effort: 2 minutes

2. `src/components/chat/AIConsentModal.tsx`
   - Violation: Line 95: `backgroundColor: "rgba(0, 0, 0, 0.5)"` → Tokens.overlay.medium
   - Effort: 2 minutes

3. `src/components/chat/ChatHistorySidebar.tsx`
   - Violation: Line 147: `backgroundColor: "rgba(0, 0, 0, 0.5)"` → Tokens.overlay.medium
   - Effort: 2 minutes

4. `src/components/CommunityComposer.tsx`
   - Violation: Line 338: `backgroundColor: "rgba(0, 0, 0, 0.5)"` → Tokens.overlay.medium
   - Effort: 2 minutes

### ⚠️ Partially Migrated (Semantic Colors)
1. `src/components/OfflineBanner.tsx`
   - Violations: Lines 39-46: Multiple RGBA warning colors
   - Needs: Tokens.semantic extension with alpha variants
   - Effort: 15 minutes (add tokens first)

2. `src/components/DailyCheckIn.tsx`
   - Violations: Lines 46-53, 60: RGBA semantic colors
   - Needs: Tokens.semantic alpha variants
   - Effort: 15 minutes (add tokens first)

3. `src/components/home/BelongingCard.tsx`
   - Violations: Lines 49-50, 108: RGBA background/border
   - Should use: Tokens.surface + Tokens.brand
   - Effort: 10 minutes

4. `src/components/home/InstagramSentimentBar.tsx`
   - Violation: Line 193: Conditional RGBA
   - Should use: Theme-aware Tokens.surface
   - Effort: 5 minutes

### ⚠️ String Color Violations
1. `src/components/community/CommunityPostCard.tsx`
   - Violation: Line 191: `backgroundColor: "black"`
   - Should use: `Tokens.neutral[900]`
   - Effort: 1 minute

### 🔵 Acceptable Exceptions
1. `src/components/onboarding/VideoPlayer.tsx`
   - Lines 183, 196: Video player controls overlay
   - Reason: Platform standard UI

2. `src/components/onboarding/StageCard.tsx`
   - Lines 79, 153: Gradient overlays for images
   - Reason: Dynamic image overlay, hard to tokenize

3. `src/components/AnimatedSplashScreen.tsx`
   - Line 122: Text shadow
   - Reason: Inline style for text shadow (acceptable)

4. `src/components/onboarding/ProgressBar.tsx`
   - Lines 66-67: Conditional transparent RGBA
   - Reason: Could be Tokens.overlay.light but acceptable

---

## Quick Win Action Items (Total: ~1 hour)

### Phase 1A: String Colors (10 minutes)
```typescript
// File: src/components/community/CommunityPostCard.tsx:191
// BEFORE
backgroundColor: "black"
// AFTER
backgroundColor: Tokens.neutral[900]
```

### Phase 1B: Simple Overlays (20 minutes)
```typescript
// Files: NewPostModal, AIConsentModal, ChatHistorySidebar, CommunityComposer
// BEFORE
backgroundColor: "rgba(0, 0, 0, 0.5)"
// AFTER
backgroundColor: Tokens.overlay.medium

// OR
backgroundColor: "rgba(0, 0, 0, 0.6)"
// AFTER
backgroundColor: Tokens.overlay.dark
```

### Phase 1C: Hardcoded Hex in Screens (15 minutes)
```typescript
// File: src/screens/PaywallScreenRedesign.tsx:246
// BEFORE
colors={[COLORS.gold, "#F59E0B", "#D97706"]}
// AFTER
colors={[COLORS.gold, Tokens.semantic.light.warning, Tokens.semantic.light.warningText]}

// File: src/screens/PaywallScreenRedesign.tsx:251
// BEFORE
<Ionicons name="diamond" size={40} color="#FFFBEB" />
// AFTER
<Ionicons name="diamond" size={40} color={Tokens.neutral[50]} />

// File: src/screens/LoginScreenRedesign.tsx:756
// BEFORE
backgroundColor: "#FFFFFF"
// AFTER
backgroundColor: Tokens.neutral[0]
```

### Phase 1D: UI Component RGBA (15 minutes)
```typescript
// File: src/components/ui/Avatar.tsx:29
// BEFORE
fallbackBgColor = "rgba(255, 255, 255, 0.1)"
// AFTER
fallbackBgColor = Tokens.premium.glass.ultraLight

// File: src/components/ui/AlertModal.tsx:86
// BEFORE
backgroundColor: "rgba(0, 0, 0, 0.5)"
// AFTER
backgroundColor: Tokens.overlay.medium
```

---

## Token Extensions Needed (for Phase 2)

Add to `src/theme/tokens.ts`:

```typescript
export const semantic = {
  light: {
    // ... existing

    // Add alpha variants
    successAlpha: "rgba(16, 185, 129, 0.15)",
    warningAlpha: "rgba(245, 158, 11, 0.15)",
    errorAlpha: "rgba(239, 68, 68, 0.15)",
    infoAlpha: "rgba(59, 130, 246, 0.15)",
  },
  dark: {
    // ... existing

    successAlpha: "rgba(16, 185, 129, 0.15)",
    warningAlpha: "rgba(245, 158, 11, 0.15)",
    errorAlpha: "rgba(239, 68, 68, 0.15)",
    infoAlpha: "rgba(59, 130, 246, 0.15)",
  },
}
```

---

## Summary Statistics

### Overall Progress
- Total files analyzed: 182
- Files using Tokens: 90 (49.5%)
- Files with violations: 33 (18.1%)
- Quick wins available: 8 files (~1 hour)

### Violations by Type
- Hardcoded hex (#xxx): 12 files → 3 need fixing (others acceptable)
- RGBA overlays: 8 files → All fixable with existing Tokens
- RGBA semantic: 4 files → Need token extensions
- String colors: 1 file → Quick fix

### Estimated Effort to 95%+ Migration
- Phase 1 (Quick Wins): 1 hour
- Phase 2 (Token Extensions + Semantic): 2-3 hours
- Phase 3 (Dark Mode Audit): 3-4 hours
- **Total: 6-8 hours to A- grade**
