# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot coding agent when working with this repository.

## Project Overview

**Nossa Maternidade** is a maternal health companion app for pregnant women and new mothers in Brazil, created by Nathalia Valente. It's an iOS-first Expo React Native app that provides:

- Menstrual cycle tracking with visual calendar
- Daily health logging (mood, symptoms, sleep)
- AI-powered chat assistant (NathIA)
- Community features for mothers
- Daily affirmations and wellness habits
- Weight calculator and health tools

**Primary Language**: Portuguese (Brazil)  
**Target Platform**: iOS (with Android support)  
**Design Philosophy**: Apple HIG + Material Design 3, inspired by Flo, Clue, and Calm apps

## Tech Stack

### Core Technologies
- **Expo SDK 54** with React Native 0.81.5
- **TypeScript** for type safety
- **React 19.1.0** with React DOM 19.1.0
- **Node.js/Bun** (Bun is faster for local development)

### State Management & Data
- **Zustand 5.x** for state management with AsyncStorage persistence
- **Supabase** for backend (optional, initializes only if env vars exist)
- **AsyncStorage** for local data persistence

### UI & Styling
- **NativeWind 4.x** (TailwindCSS for React Native) with `className` prop
- **React Native Reanimated 4.x** for animations (NOT Animated from react-native)
- **React Native Gesture Handler** for gestures
- **Expo Linear Gradient** for gradients
- **Ionicons** from @expo/vector-icons for icons
- **Zeego** for context/dropdown menus

### Navigation
- **React Navigation 7.x**
  - Native Stack Navigator for main navigation
  - Bottom Tabs Navigator for main app tabs
  - Modal presentations for overlays

### Fonts & Typography
- **DM Sans** (body text)
- **DM Serif Display** (headers)

## File Structure

```
.
├── src/
│   ├── api/              # External service clients (OpenAI, Grok, Supabase)
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Atomic design components
│   │   └── [feature]/   # Feature-specific components
│   ├── config/          # Configuration files (admin, community topics)
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── screens/         # Full-page screen components
│   ├── services/        # Service layer (notifications, etc.)
│   ├── state/           # Zustand stores (centralized in store.ts)
│   ├── theme/           # Design system and theming
│   │   └── design-system.ts  # Official design system ⭐
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── docs/                # Technical documentation
├── scripts/             # Build and setup scripts
├── supabase/           # Supabase edge functions and config
├── App.tsx             # Root component
├── app.json            # Expo configuration
└── app.config.js       # Dynamic Expo config with env vars
```

## Development Commands

### Installation
```bash
npm install          # or: bun install (faster)
```

### Development
```bash
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run web          # Run on web browser
```

### Quality Checks (ALWAYS run before creating PRs)
```bash
npm run quality-gate       # Runs all quality checks (TypeScript, ESLint, build readiness)
npm run typecheck          # Check TypeScript errors (tsc --noEmit)
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix ESLint issues
npm run format             # Format code with Prettier
npm run check-build-ready  # Verify app is ready for build
```

### Testing
```bash
npm test               # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### Build
```bash
npm run eas:build:ios      # Build for iOS
npm run eas:build:android  # Build for Android
```

## Coding Standards & Best Practices

### Critical Security Rules
- **NEVER** share, display, or expose API keys in any manner
- **NEVER** commit secrets to source code
- Use environment variables for all sensitive data
- All API keys should be in `.env.local` (not committed)

### TypeScript Rules
- **Use strict TypeScript** - no `any` types allowed (ESLint will block)
- Define proper types for all props, state, and function parameters
- Use type definitions from `src/types/` directory
- Import types from centralized locations:
  - Navigation: `src/types/navigation.ts`
  - AI: `src/types/ai.ts`
  - Domain models: Defined in respective files

### Code Quality Rules
- **NEVER use `console.log()`** - use `logger.*` from `src/utils/logger.ts` instead
- **NEVER use `alert()`** - implement custom modals instead
- **NEVER use `console.log()` for user communication** - display messages on screen
- ESLint blocks: `console.log`, `alert`, and `any` types

### String Formatting
- **Always use double quotes** for strings containing apostrophes: `"How's it going?"` (NOT single quotes)
- Use template literals for string interpolation

### React Native Specific
- **Use `Pressable`** over `TouchableOpacity`
- **Use `SafeAreaView` from `react-native-safe-area-context`** - NEVER from `react-native`
- `SafeAreaProvider` is already configured in `App.tsx`

### Zustand State Management Pattern
```typescript
// GOOD: Individual selectors (avoids infinite loops)
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// BAD: Object selector creates new ref each render
const { user, setUser } = useAppStore((s) => ({ user: s.user, setUser: s.setUser }));
```

### Styling Guidelines

#### Primary Approach
- **Use NativeWind + Tailwind** with `className` prop
- **Use `cn()` helper** from `src/utils/cn.ts` for conditional classes
- Import design tokens from `src/theme/design-system.ts`:
  - `COLORS` - Complete color palette
  - `TYPOGRAPHY` - Font sizes and weights
  - `SPACING` - 8pt grid system
  - `GRADIENTS` - Pre-defined gradients
  - `ACCESSIBILITY` - Accessibility constants

#### Exceptions Requiring Inline `style` Prop
- `<CameraView>` components (className not supported)
- `<LinearGradient>` components (className not supported)
- Animated components (AnimatedView, AnimatedText) may need inline styles

#### Design System
- **Current system**: Design System 2025 (Apple HIG + Material Design 3)
- **Color philosophy**: Clean FemTech with blue as primary identity color
- **Use design tokens**: Always import from `src/theme/design-system.ts`
  - Primary: `COLORS.primary` (blue #7DB9D5 - calmness and maternal care)
  - Accent: `COLORS.accent` (pink #F4258C - CTAs only, restricted use)
  - Background: `COLORS.background.primary` (neutral cool #F7FBFD)
  - Text: `COLORS.text.primary`, `COLORS.text.secondary`, `COLORS.text.muted`

#### Color System Migration (Important!)
- **PREFER**: `src/theme/design-system.ts` for all new code
- **DEPRECATED**: `src/utils/colors.ts` (kept for backward compatibility only)
- When editing files, migrate from `colors.ts` to `design-system.ts`
- See `docs/DESIGN_SYSTEM_MIGRATION.md` for migration guide

#### Design Quality Standards
- **Tap targets**: Minimum 44pt (iOS HIG) - use `ACCESSIBILITY.minTapTarget`
- **Spacing**: Use `SPACING` tokens (8pt grid system)
- **Colors**: Use `COLORS` from design-system.ts (not hardcoded hex)
- **Dark mode**: All screens should support theming

### Icons & Menus
- **Use Ionicons** from `@expo/vector-icons` for icons
- **Use zeego** for context/dropdown menus

### Animations & Gestures
- **Use `react-native-reanimated` v4** - NOT `Animated` from react-native
- **Use `react-native-gesture-handler`** for gestures
- **Check official documentation** for latest API changes - libraries update frequently

### Safe Area Implementation
- Tab navigator → no bottom insets needed
- Native header → no safe area insets needed
- Custom header → top inset required
- Always use `useSafeAreaInsets` hook when needed

### Camera Implementation
```typescript
// Correct import (Camera is deprecated)
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Must use style prop, NOT className
<CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
  {/* Overlay must be absolute positioned */}
  <View className="absolute inset-0 z-10">{/* UI controls */}</View>
</CameraView>
```

## Architecture Patterns

### Navigation Structure
```
RootNavigator (Native Stack) - 5-stage auth flow:
├── 1. LoginScreen (if !isAuthenticated)
├── 2. NotificationPermissionScreen (if !notificationSetupDone)
├── 3. OnboardingScreen (6 steps)
├── 4. NathIAOnboardingScreen (5 steps)
└── 5. MainTabs (Bottom Tab Navigator)
    ├── Home → HomeScreen
    ├── Ciclo → CycleTrackerScreen
    ├── NathIA → AssistantScreen (AI chat)
    ├── Comunidade → CommunityScreen
    └── Meus Cuidados → MyCareScreen

Modal Screens (presentation: "modal"):
├── PostDetail, NewPost
├── DailyLog, Affirmations, Habits
├── WeightCalculator, ComingSoon
```

### State Management (Zustand Stores)

All stores centralized in `src/state/store.ts`:

| Store                | Persisted | Purpose                                |
| -------------------- | --------- | -------------------------------------- |
| useAppStore          | Yes       | User profile, onboarding state         |
| useCommunityStore    | No        | Posts, groups (always fresh from API)  |
| useChatStore         | Yes       | AI conversation history                |
| useCycleStore        | Yes       | Menstrual cycle tracking, daily logs   |
| useAffirmationsStore | Yes       | Favorite affirmations, daily selection |
| useHabitsStore       | Yes       | 8 wellness habits, streaks             |
| useCheckInStore      | Yes       | Daily mood/energy/sleep check-ins      |

### Component Patterns

#### Community Feature (Example of Best Practices)
```
src/
├── config/community.ts       # Constants: MOCK_POSTS, COMMUNITY_TOPICS
├── utils/formatters.ts       # Utilities: formatTimeAgo(), formatCompactNumber()
├── hooks/useCommunity.ts     # Business logic & state management
└── components/community/
    ├── PostCard.tsx          # Presentation component with React.memo
    ├── ComposerCard.tsx      # Form component
    ├── NewPostModal.tsx      # Modal component
    └── index.ts              # Barrel exports
```

**Pattern**: Screen uses hook for logic, components are UI-only:
```typescript
// In CommunityScreen.tsx
const community = useCommunity(navigation);
// Access: community.filteredPosts, community.handleLike, etc.
```

### API Services

Pre-built API functions in `src/api/`:

```typescript
// AI Chat (src/api/chat-service.ts)
getOpenAITextResponse(messages, options?)  // Default: gpt-4o
getGrokTextResponse(messages, options?)    // Alternative: grok-3-beta

// Audio (src/api/transcribe-audio.ts)
transcribeAudio(filePath)  // Uses gpt-4o-transcribe

// Images (src/api/image-generation.ts)
generateImage(prompt)      // Uses gpt-image-1

// Supabase (src/api/supabase.ts)
// Optional - only initializes if env vars exist
```

## Testing & Quality Gates

### Before Creating PRs
**ALWAYS** run the quality gate:
```bash
npm run quality-gate
```

This checks:
- TypeScript compilation (no errors)
- ESLint (no violations)
- Build readiness
- No `console.log` usage

### Test Infrastructure
- **Jest** for unit testing
- Tests should be consistent with existing test patterns
- Run `npm test` to execute tests

### Code Review Process
1. Make minimal, surgical changes
2. Run quality gate before committing
3. Test manually if UI changes are involved
4. Document any breaking changes

## Environment Setup

### Environment Variables
- Use `.env.local` for local development (NOT committed)
- Copy from `.env.example` or `env.template`
- Required for:
  - Supabase connection
  - AI API keys (OpenAI, Anthropic, Gemini)
  - Authentication providers

### Platform-Specific Notes

#### Windows Development
- The project includes a `postinstall` script that automatically fixes LightningCSS binary issues on Windows x64
- This runs automatically after `npm install` or `bun install`
- For `.sh` scripts, use Git Bash or WSL: `git bash scripts/quality-gate.sh`

#### macOS Setup
```bash
npm run setup-mac    # Initial macOS setup
npm run fix:ios      # Fix iOS pods if needed
```

## Key Workflows

### Adding Dependencies
1. Prefer existing libraries over adding new ones
2. Only add new libraries if absolutely necessary
3. Use package manager commands:
   ```bash
   npm install <package>     # or: bun add <package>
   ```

### Making Code Changes
1. **Minimal changes only** - change as few lines as possible
2. Follow existing patterns in the codebase
3. Use design tokens from `design-system.ts`
4. Add proper TypeScript types
5. Test changes manually
6. Run quality gate before committing

### Creating New Screens
1. Create screen in `src/screens/`
2. Add route to `RootNavigator.tsx` or `MainTabNavigator.tsx`
3. Add type to `src/types/navigation.ts`
4. Use existing hooks and patterns
5. Follow safe area guidelines

### Creating New Components
1. Place in appropriate directory:
   - `src/components/ui/` for atomic components
   - `src/components/[feature]/` for feature components
2. Use TypeScript for props
3. Use React.memo for optimization if needed
4. Export from index.ts (barrel export)

## Common Pitfalls to Avoid

### Safe Area
- ❌ DON'T use `SafeAreaView` from `react-native`
- ✅ DO use `SafeAreaView` from `react-native-safe-area-context`

### Animations
- ❌ DON'T use `Animated` from `react-native`
- ✅ DO use `react-native-reanimated`

### Console & Alerts
- ❌ DON'T use `console.log()` or `alert()`
- ✅ DO use `logger.*` and custom modals

### Colors
- ❌ DON'T hardcode hex colors like `#7DB9D5` or `#F4258C`
- ✅ DO use `COLORS.primary[500]` or `COLORS.accent[500]` from `design-system.ts`
- ✅ DO use semantic tokens like `COLORS.background.primary`, `COLORS.text.primary`

### State Selectors
- ❌ DON'T use object destructuring in Zustand selectors
- ✅ DO use individual selectors

## Documentation References

- **Color System**: `docs/COLOR_SYSTEM.md`
- **Design System Migration**: `docs/DESIGN_SYSTEM_MIGRATION.md`
- **Safe Area Migration**: `docs/SAFE_AREA_MIGRATION.md`
- **MCP Setup**: `docs/MCP_SETUP.md`
- **Agents Guide**: `docs/AGENTS_GUIDE.md`

## Additional Context

### Session-Specific Notes
See `CLAUDE.md` section "Session Notes" for recent changes and pending work.

### Admin Features
- Admin verification system: `src/config/admin.ts` + `src/hooks/useAdmin.ts`
- Use admin hooks for privileged features

### Edge Functions
Deployed Supabase functions:
- `ai` - AI chat processing
- `notifications` - Push notifications
- `delete-account` - Account deletion
- `upload-image` - Image uploads
- `analytics` - Analytics tracking
- `transcribe` - Audio transcription

## Success Criteria for Changes

Your code changes should:
1. ✅ Pass all quality gates (`npm run quality-gate`)
2. ✅ Follow TypeScript best practices (no `any` types)
3. ✅ Use design tokens from `design-system.ts`
4. ✅ Implement proper safe area handling
5. ✅ Include proper error handling
6. ✅ Work on both iOS and Android (when applicable)
7. ✅ Be minimal and surgical (smallest possible changes)
8. ✅ Maintain consistency with existing code patterns
9. ✅ Use Portuguese for user-facing strings
10. ✅ Not introduce security vulnerabilities

## When in Doubt

1. Check existing code for similar patterns
2. Refer to `CLAUDE.md` for additional context
3. Consult documentation in `docs/` directory
4. Run quality gate to catch issues early
5. Make minimal changes - when uncertain, ask before making breaking changes
