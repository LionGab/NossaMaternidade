# Session Memory - December 24, 2025

## Overview

Complete record of frontend design session for **Nossa Maternidade** app.

---

## What Was Built

### 1. OnboardingStoriesScreen.tsx (NEW - ~1000 lines)

**Location**: `src/screens/OnboardingStoriesScreen.tsx`

**Concept**: "Nath's Journey" - Stories-style immersive onboarding

**Replaced**: 8 individual onboarding screens with single cohesive experience

**Key Components**:
- `StoryProgressBar` - Instagram-style progress indicators
- `NathSpeaks` - Avatar with animated speech bubble
- `SelectionCard` - Pressable cards with glow effect on selection
- `ObjectiveChip` - Multi-select chips for goals
- `EpisodeCard` - Reward card with sparkle animations
- `StoryButton` - CTA with pulsing glow effect

**7 Slides**:
1. Welcome - "Ola, eu sou a Nath!"
2. Moment - Pregnancy stage selection (Tentando, Gravida, Mae)
3. Date - Due date picker
4. Objectives - Multi-select goals
5. Emotional - How are you feeling today
6. CheckIn - Preferred check-in time
7. Reward - Episode 0 unlock with 7-day plan

**State Integration**:
- `useNathJourneyOnboardingStore` - New stories onboarding state
- `useAppStore` - User profile updates

**Styling**:
- Deep blue gradient background (#0a0f1a to #1a1f3a)
- Glass-morphism cards with blur effect
- Floating particles animation
- Staggered entrance animations

---

### 2. LoginScreenRedesign.tsx (NEW - ~700 lines)

**Location**: `src/screens/LoginScreenRedesign.tsx`

**Concept**: "Portal to Motherhood" - Cinematic reveal experience

**Key Components**:
- `FloatingParticle` - 20 animated stars with varying sizes/speeds
- `GlassCard` - Frosted glass container for auth options
- `SocialButton` - Apple/Google sign-in buttons
- `EmailInput` - Animated email input field
- `CTAButton` - Primary CTA with gradient and glow

**Visual Effects**:
- Deep navy to rose gradient background
- Aurora gradient overlays (3 layers)
- Floating star particles with looping animations
- Staggered entrance animations (logo, title, tagline, card)
- Glass-morphism auth card with backdrop blur

**Colors Used**:
```typescript
background: ['#0a0f1a', '#1a1f3a', '#2d1f3d']
aurora1: '#7DB9D5' (primary blue)
aurora2: '#F4258C' (accent pink)
aurora3: '#9b7dff' (purple)
```

---

### 3. PaywallScreenRedesign.tsx (NEW - ~650 lines)

**Location**: `src/screens/PaywallScreenRedesign.tsx`

**Concept**: "Unlock Your Journey" - Premium unlock celebration

**Key Components**:
- `FloatingOrb` - 5 glowing orbs with scale/opacity animation
- `PremiumBadge` - Diamond icon with sparkle effects
- `FeatureItem` - Benefits list with icons
- `PlanCard` - Glass-morphism subscription cards
- `CTAButton` - Pulsing gradient button with glow

**Visual Effects**:
- Deep purple gradient background
- Floating glowing orbs (pink, blue, purple)
- Animated diamond badge with rotating sparkles
- Glass-morphism plan cards with selection glow
- Pulsing CTA with animated glow effect

**Plans**:
- Monthly: R$29.90/mes
- Annual: R$199.90/ano (45% off - BEST VALUE)

**Features Grid**:
- NathIA Ilimitada
- Sons de Descanso
- Exercicios Guiados
- Comunidade VIP
- Sem Anuncios
- Novidades Primeiro

---

## Navigation Updates

### RootNavigator.tsx Changes

```typescript
// NEW Imports
import LoginScreen from "../screens/LoginScreenRedesign";
import OnboardingStoriesScreen from "../screens/OnboardingStoriesScreen";
import Paywall from "../screens/PaywallScreenRedesign";

// NEW State
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";

// NEW Flow Step (Stage 2.5)
const shouldShowNathJourneyOnboarding = isDevBypassActive()
  ? false
  : isAuthenticated && notificationSetupDone && !isNathJourneyOnboardingComplete;

// NEW Screen
{shouldShowNathJourneyOnboarding && (
  <Stack.Screen
    name="OnboardingStories"
    component={OnboardingStoriesScreen}
    options={{
      animation: "fade",
      gestureEnabled: false,
    }}
  />
)}
```

**Updated Flow**:
1. Login (LoginScreenRedesign)
2. NotificationPermission
3. **OnboardingStories** (NEW - NathJourneyOnboarding)
4. Onboarding (legacy)
5. NathIAOnboarding
6. MainApp

---

## Type Updates

### navigation.ts

```typescript
// Added to RootStackParamList
OnboardingStories: undefined;
```

---

## Design System Used

### From src/theme/tokens.ts

**Brand Colors**:
- Primary: `#7DB9D5` (Blue pastel)
- Accent: `#F4258C` (Pink vibrant)
- Secondary: `#B8A9D9` (Lilac)

**Typography**:
- Font: Manrope (sans-serif)
- H1: 32px, bold
- H2: 24px, semibold
- Body: 16px, regular

**Spacing** (8pt grid):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

## Animation Patterns Used

### 1. Floating Particles
```typescript
const translateY = useSharedValue(0);
useEffect(() => {
  translateY.value = withRepeat(
    withSequence(
      withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(20, { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ),
    -1, // infinite
    true // reverse
  );
}, []);
```

### 2. Staggered Entrance
```typescript
entering={FadeInUp.delay(100 * index).duration(600).springify()}
```

### 3. Pulsing Glow
```typescript
const pulseAnim = useSharedValue(1);
useEffect(() => {
  pulseAnim.value = withRepeat(
    withSequence(
      withTiming(1.02, { duration: 1500 }),
      withTiming(1, { duration: 1500 })
    ),
    -1,
    true
  );
}, []);
```

### 4. Glass-morphism
```typescript
style={{
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderColor: 'rgba(255,255,255,0.15)',
  borderWidth: 1,
  borderRadius: 24,
  // Note: backdrop-filter requires native blur on RN
}}
```

---

## Dependencies Used

All Expo Go compatible:
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `expo-linear-gradient` - Gradients
- `expo-haptics` - Haptic feedback
- `@expo/vector-icons` (Ionicons) - Icons

---

## TypeScript Fixes Applied

1. **Removed unused imports** in OnboardingStoriesScreen:
   - useRef, FadeOut, withDelay, neutral, spacing, radius, shadows, gradients, SCREEN_HEIGHT

2. **Added missing return** in useEffect:
   ```typescript
   useEffect(() => {
     if (selected) {
       // animation code
     }
     return undefined; // Added
   }, [selected]);
   ```

3. **Fixed function reference**:
   - Changed `completeOnboarding` to `handleCompleteOnboarding`

4. **Removed unused imports** in PaywallScreenRedesign:
   - useRef, FadeInDown, PREMIUM_FEATURES

---

## Pre-existing Errors (Not Fixed)

In `OnboardingPaywall.tsx`:
- `handleComplete` used before declaration
- These are in legacy code not touched this session

---

## Files Summary

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `src/screens/OnboardingStoriesScreen.tsx` | NEW | ~1000 | Stories-style onboarding |
| `src/screens/LoginScreenRedesign.tsx` | NEW | ~700 | Cinematic login screen |
| `src/screens/PaywallScreenRedesign.tsx` | NEW | ~650 | Premium paywall screen |
| `src/navigation/RootNavigator.tsx` | MODIFIED | - | Navigation flow updates |
| `src/types/navigation.ts` | MODIFIED | - | Route type definitions |
| `src/state/nath-journey-onboarding-store.ts` | EXISTS | - | Zustand store for stories |

---

## Git Commits This Session

```
1db5fc7 feat: correcoes paywall + reorganizacao OnboardingPaywall + melhorias UI
5697655 feat: adiciona LoginScreenRedesign
f056584 fix: corrige bugs no PaywallScreen e atualiza precos premium
```

---

## Next Steps (Suggested)

1. **Home Screen Polish** - Apply similar design patterns
2. **Fix Legacy Errors** - Clean up OnboardingPaywall.tsx
3. **Test on Device** - Verify animations on iOS/Android
4. **A/B Testing** - Compare conversion with old designs

---

## User Context

- **Developer**: Lion (eugabrielmktd@gmail.com)
- **System**: Windows 11 with Git Bash
- **Preference**: English for prompts, Portuguese for UI

---

*Session recorded: December 24, 2025*
*Claude Code - Opus 4.5*
