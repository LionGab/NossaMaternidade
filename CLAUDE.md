# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nossa Maternidade** - A maternal health companion app for pregnant women and new mothers in Brazil, created by Nathalia Valente. iOS-first Expo React Native app.

## Development Guidelines

- **DO NOT** share, display, or expose API keys in any manner
- **Always use** double quotes for strings containing apostrophes: `"How's it going?"` (NOT single quotes)
- **Never use** `console.log()` for user communication - display messages on screen instead
- **Never use** alerts - implement custom modals instead

## Commands

You can use either `npm` or `bun` (bun is faster but optional):

```bash
# Install dependencies
npm install          # or: bun install

# Development
npm start            # or: bun start (starts Expo dev server)
npm run ios          # or: bun run ios
npm run android      # or: bun run android

# Quality checks
npx tsc --noEmit     # Check TypeScript errors
npm run lint         # Run ESLint
npm run typecheck    # Same as tsc --noEmit

# Build preparation
npm run check-build-ready  # Verify app is ready for build
```

## Architecture

### Navigation Structure

```
RootNavigator (Native Stack)
├── OnboardingScreen (9 steps, shown if !onboardingComplete)
└── MainTabs (Bottom Tab Navigator)
    ├── Home         → HomeScreen
    ├── Ciclo        → CycleTrackerScreen
    ├── NathIA       → AssistantScreen (AI chat)
    ├── Comunidade   → CommunityScreen
    └── Meus Cuidados → MyCareScreen

Modal Screens (presentation: "modal"):
├── PostDetail, NewPost
├── DailyLog, Affirmations, Habits
├── WeightCalculator, ComingSoon
```

### State Management (Zustand + AsyncStorage)

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

**Zustand selector pattern** (avoid infinite loops):

```typescript
// GOOD: Individual selectors
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// BAD: Object selector creates new ref each render
const { user, setUser } = useAppStore((s) => ({ user: s.user, setUser: s.setUser }));
```

### Pre-built API Functions

Located in `src/api/`:

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

## Styling Rules

- **Use Nativewind + Tailwind** with `className` prop
- **Use `cn()` helper** from `src/utils/cn.ts` for conditional classes
- **EXCEPTION**: `<CameraView>` and `<LinearGradient>` require inline `style` prop (not className)
- **EXCEPTION**: Animated components (AnimatedView, AnimatedText) may need inline styles
- **Use Ionicons** from `@expo/vector-icons` for icons
- **Use zeego** for context/dropdown menus

### Design Tokens

**Current system** (Design System 2025 - Apple HIG + Material Design 3):

```
Primary: #f4258c (vibrant pink)
Secondary: #A855F7 (lilac/purple)
Background: #f8f5f7 (soft pink-white)
Text Dark: #1C1917 (warm gray 900)
Fonts: DMSans (body), DMSerifDisplay (headers)
```

**Official color system**: `src/theme/design-system.ts` ⭐

- **USE THIS**: Import `COLORS`, `GRADIENTS`, `TYPOGRAPHY`, `SPACING`, etc.
- Complete design system with colors, typography, spacing, shadows, glassmorphism
- Follows Apple HIG and Material Design 3 best practices
- Includes accessibility guidelines (44pt min tap target, WCAG AA contrast)

**Legacy compatibility**: `src/utils/colors.ts`

- Re-exports from design-system.ts for backward compatibility
- **DEPRECATED**: Migrate imports to design-system.ts when editing files
- Helper functions: `getFeelingColor()`, `getGradient()`
- Constants: `PRIMARY_COLOR`, `SECONDARY_COLOR`, `TEXT_DARK`

**Feeling colors** (for daily check-ins):

- Bem (sunny): #FFD89B (yellow pastel)
- Cansada (cloud): #BAE6FD (blue pastel)
- Enjoada (rainy): #DDD6FE (lavender)
- Amada (heart): #FB7185 (pink)

See [docs/COLOR_SYSTEM.md](docs/COLOR_SYSTEM.md) for complete documentation.

## Animation & Gestures

- **Use react-native-reanimated v3** - NOT Animated from react-native
- **Use react-native-gesture-handler** for gestures
- **Always WebSearch docs** before implementing - training data may be outdated

## Layout Rules

- **Use SafeAreaProvider** with `useSafeAreaInsets` (not SafeAreaView from react-native)
- Tab navigator → no bottom insets needed
- Native header → no safe area insets needed
- Custom header → top inset required
- **Use Pressable** over TouchableOpacity

## Camera Implementation

```typescript
// Correct import (Camera is deprecated)
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Must use style prop, NOT className
<CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
  {/* Overlay must be absolute positioned */}
  <View className="absolute inset-0 z-10">{/* UI controls */}</View>
</CameraView>;
```

## Type Definitions

Navigation types in `src/types/navigation.ts`:

- `RootStackParamList` - all stack screens
- `MainTabParamList` - 5 tab screens
- Domain types: `UserProfile`, `Post`, `ChatMessage`, `DailyLog`, `Affirmation`, `Habit`

AI types in `src/types/ai.ts`:

- `AIMessage`, `AIRequestOptions`, `AIResponse`

## File Organization

```
src/
├── api/           # External service clients (OpenAI, Grok, Supabase)
├── components/    # Reusable UI (ui/ for atoms, feature components at root)
├── screens/       # Full-page screen components
├── navigation/    # RootNavigator, MainTabNavigator
├── state/         # Zustand stores (store.ts)
├── types/         # TypeScript definitions
└── utils/         # Helpers (cn.ts, colors.ts, logger.ts, shadow.ts)

docs/              # Technical documentation
scripts/           # Build and setup scripts
```

## Key Files

| File                               | Purpose                                         |
| ---------------------------------- | ----------------------------------------------- |
| `App.tsx`                          | Root component, font loading, providers         |
| `src/state/store.ts`               | All Zustand stores                              |
| `src/navigation/RootNavigator.tsx` | Navigation config                               |
| `src/utils/colors.ts`              | Centralized color system                        |
| `tailwind.config.js`               | Theme colors, fonts, Tailwind config            |
| `app.json`                         | Expo config (bundle ID, permissions)            |
| `app.config.js`                    | Dynamic Expo config with env vars               |
| `scripts/fix-lightningcss.js`      | Windows compatibility fix (runs on postinstall) |

## Important Notes

### Windows Development

- The project includes a `postinstall` script that automatically fixes LightningCSS binary issues on Windows x64
- This runs automatically after `bun install` - no manual intervention needed
- For `.sh` scripts, use Git Bash or WSL: `git bash scripts/quality-gate.sh`

### Color System Migration

- **IMPORTANT**: Migrating from `src/utils/colors.ts` to `src/theme/design-system.ts`
- New code should use `COLORS`, `TYPOGRAPHY`, `SPACING` from `design-system.ts`
- `colors.ts` is deprecated and kept only for backward compatibility
- See [docs/DESIGN_SYSTEM_MIGRATION.md](docs/DESIGN_SYSTEM_MIGRATION.md) for migration guide

### Safe Area Handling

- Always use `SafeAreaView` from `react-native-safe-area-context`, NEVER from `react-native`
- `SafeAreaProvider` is already configured in `App.tsx`
- See [docs/SAFE_AREA_MIGRATION.md](docs/SAFE_AREA_MIGRATION.md) for details

### Quality Gates

- Always run `bun run quality-gate` before creating PRs
- This checks: TypeScript, ESLint, build readiness, and console.log usage
- ESLint now blocks `console.log` (use `logger.*` instead), `alert`, and `any` types

### MCPs and Agents

- See [docs/MCP_SETUP.md](docs/MCP_SETUP.md) for MCP configuration
- See [docs/AGENTS_GUIDE.md](docs/AGENTS_GUIDE.md) for agent usage
- Available MCPs: Supabase, Context7, Playwright (Figma and Linear require setup)
